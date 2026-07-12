import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

// Resolves or creates a session on WAHA
async function ensureWahaSession(gatewayUrl: string, name: string, token: string | null): Promise<string | null> {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "X-API-Key": token } : {}),
  };

  try {
    // 1. Try to find it
    const res = await fetch(`${gatewayUrl}/api/sessions`, { method: "GET", headers, cache: "no-store" });
    if (res.ok) {
      const sessions = await res.json();
      if (Array.isArray(sessions)) {
        const matched = sessions.find((s: any) => s.name === name);
        if (matched) return matched.id || matched.name;
      }
    }

    // 2. Not found, create it
    const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/whatsapp/webhook`;
    const createRes = await fetch(`${gatewayUrl}/api/sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        name,
        config: {
          webhooks: [
            {
              url: webhookUrl,
              events: [
                "message.sent",
                "message.ack",
                "message.failed",
                "message.revoked",
                "session.status",
                "session.disconnected",
                "session.authenticated"
              ]
            }
          ]
        }
      }),
      cache: "no-store"
    });
    
    if (createRes.ok) {
      const data = await createRes.json();
      const id = data.id || name;
      
      // Start it immediately after creation
      await fetch(`${gatewayUrl}/api/sessions/${id}/start`, { method: "POST", headers, cache: "no-store" });
      return id;
    }
  } catch (e) {
    console.error("ensureWahaSession failed:", e);
  }
  return null;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrismaClient()!;
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let isPro = false;
    if (session.email === "demo@vivahaluxe.com") {
      isPro = true;
    } else {
      try {
        const payments: any[] = await prisma.$queryRawUnsafe(
          `SELECT * FROM vivaha_pro_payments WHERE user_email = $1 AND (status = 'Approved & Active' OR status = 'Active')`,
          session.email.trim().toLowerCase()
        );
        if (payments && payments.length > 0) isPro = true;
      } catch (e) {
        console.warn("Failed to check pro payments", e);
      }
    }

    if (!isPro) {
      return NextResponse.json({ error: "WhatsApp integration requires PRO plan" }, { status: 403 });
    }

    // We use the user's ID as the session name in WAHA
    // Note: WAHA only allows letters, numbers, and hyphens in session names
    let sessionName = user.whatsappSessionId || `user-${user.id}`;
    if (sessionName.includes("_")) {
      sessionName = sessionName.replace(/_/g, "-");
    }

    if (!user.whatsappSessionId || user.whatsappSessionId !== sessionName) {
      await prisma.user.update({
        where: { id: user.id },
        data: { whatsappSessionId: sessionName },
      });
    }

    const openWaUrl = process.env.OPENWA_SERVER_URL?.replace(/\/$/, "");
    const openWaKey = process.env.OPENWA_API_KEY || null;

    if (!openWaUrl) {
      return NextResponse.json(
        { error: "OPENWA_SERVER_URL is not configured" },
        { status: 500 }
      );
    }

    const sessionId = await ensureWahaSession(openWaUrl, sessionName, openWaKey);
    
    if (!sessionId) {
      return NextResponse.json({ 
        status: "DISCONNECTED", 
        message: "Failed to initialize session on the WhatsApp Gateway."
      });
    }

    const headers = { ...(openWaKey ? { "X-API-Key": openWaKey } : {}) };

    // Check session status
    let rawStatus = "UNKNOWN";
    try {
      const statusRes = await fetch(`${openWaUrl}/api/sessions/${sessionId}`, { method: "GET", headers, cache: "no-store" });
      if (statusRes.ok) {
        const info = await statusRes.json();
        rawStatus = (info.status || "UNKNOWN").toUpperCase();
      }
    } catch (e) {
      // ignore
    }

    if (["STOPPED", "CREATED", "FAILED"].includes(rawStatus)) {
      await fetch(`${openWaUrl}/api/sessions/${sessionId}/start`, { method: "POST", headers, cache: "no-store" }).catch(() => {});
      return NextResponse.json({ status: "LOADING", sessionId });
    }

    if (["WORKING", "CONNECTED", "READY"].includes(rawStatus)) {
      return NextResponse.json({ status: "CONNECTED", sessionId });
    }

    if (["SCAN_QR_CODE", "SCAN_QR", "QR_READY"].includes(rawStatus)) {
      // Try to get QR code base64
      try {
        const qrRes = await fetch(`${openWaUrl}/api/sessions/${sessionId}/qr`, { method: "GET", headers, cache: "no-store" });
        if (qrRes.ok) {
          const qrData = await qrRes.json();
          const qrImage = qrData.image || qrData.qrCode || qrData.code;
          if (qrImage) {
            let base64 = qrImage;
            if (qrImage.startsWith("data:")) {
               return NextResponse.json({ status: "QR_READY", qr: qrImage, sessionId });
            } else {
               return NextResponse.json({ status: "QR_READY", qr: `data:image/png;base64,${base64}`, sessionId });
            }
          }
        } else {
          const errText = await qrRes.text();
          if (errText.includes("not active") || errText.includes("Start the session")) {
            // Self-healing: WAHA thinks status is SCAN_QR_CODE but engine is not active. Force start.
            await fetch(`${openWaUrl}/api/sessions/${sessionId}/start`, { method: "POST", headers, cache: "no-store" }).catch(() => {});
            return NextResponse.json({ status: "LOADING", sessionId });
          }
        }
      } catch (e) {
        // fallback
      }
      return NextResponse.json({ status: "QR_READY", qr: null, sessionId }); // Wait until QR is returned
    }

    return NextResponse.json({ 
      status: "LOADING", 
      sessionId
    });
  } catch (error: any) {
    console.error("WhatsApp session error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrismaClient()!;
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user || !user.whatsappSessionId) {
      return NextResponse.json({ success: true });
    }

    const openWaUrl = process.env.OPENWA_SERVER_URL?.replace(/\/$/, "");
    const openWaKey = process.env.OPENWA_API_KEY || null;

    if (openWaUrl) {
      const headers = { ...(openWaKey ? { "X-API-Key": openWaKey } : {}) };
      try {
        await fetch(`${openWaUrl}/api/sessions/${user.whatsappSessionId}/logout`, {
          method: "POST",
          headers,
        });
      } catch (e) {
        console.warn("Failed to logout OpenWA session", e);
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { whatsappSessionId: null },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
