import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

// Helper to robustly register/update webhook according to exact OpenAPI specification
async function registerOpenWaWebhook(gatewayUrl: string, sessionId: string, webhookUrl: string, headers: any) {
  const payload = {
    url: webhookUrl,
    events: [
      "message.received",
      "message.sent",
      "message.ack",
      "message.failed",
      "message.revoked",
      "session.status",
      "session.disconnected",
      "session.authenticated"
    ],
    retryCount: 3
  };

  try {
    const res = await fetch(`${gatewayUrl}/api/sessions/${sessionId}/webhooks`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
      cache: "no-store"
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      console.warn(`[OpenWA] Webhook registration for ${sessionId} returned ${res.status}: ${errText}`);
    } else {
      console.log(`[OpenWA] Successfully registered webhook for session ${sessionId} -> ${webhookUrl}`);
    }
  } catch (e: any) {
    console.warn(`[OpenWA] Webhook registration failed for ${sessionId}: ${e?.message || e}`);
  }
}

// Resolves or creates a session on WAHA / OpenWA without duplicating sessions
async function ensureWahaSession(gatewayUrl: string, desiredName: string, existingId: string | null, token: string | null): Promise<string | null> {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { "X-API-Key": token } : {}),
  };
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://vivahaluxe.vercel.app"}/api/whatsapp/webhook`;
  const events = [
    "message.received",
    "message.sent",
    "message.ack",
    "message.failed",
    "message.revoked",
    "session.status",
    "session.disconnected",
    "session.authenticated"
  ];

  try {
    // 1. Try to find existing session by desiredName OR existingId
    const res = await fetch(`${gatewayUrl}/api/sessions`, { method: "GET", headers, cache: "no-store" });
    if (res.ok) {
      const sessions = await res.json();
      if (Array.isArray(sessions)) {
        const matched = sessions.find((s: any) => 
          s.name === desiredName || 
          (existingId && (s.id === existingId || s.name === existingId))
        );
        if (matched) {
          const id = matched.id || matched.name;
          // Ensure webhooks are registered on existing session using exact OpenAPI schema
          await registerOpenWaWebhook(gatewayUrl, id, webhookUrl, headers);
          return id;
        }
      }
    }

    // 2. Not found, create it using desiredName (`user-${user.id}`) ONLY, never a UUID
    const createRes = await fetch(`${gatewayUrl}/api/sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify({ 
        name: desiredName,
        config: {
          autoReconnect: true,
          webhookUrl: webhookUrl,
          webhooks: [{ url: webhookUrl, events, retryCount: 3 }]
        },
        webhook: { url: webhookUrl, events, retryCount: 3 }
      }),
      cache: "no-store"
    });
    
    if (createRes.ok) {
      const data = await createRes.json();
      const id = data.id || desiredName;
      
      // Ensure webhooks and start immediately after creation
      await registerOpenWaWebhook(gatewayUrl, id, webhookUrl, headers);
      await fetch(`${gatewayUrl}/api/sessions/${id}/start`, { method: "POST", headers, cache: "no-store" }).catch(() => {});
      return id;
    } else if (createRes.status === 409) {
      // If 409 conflict, session already exists under desiredName, fetch and return
      const checkRes = await fetch(`${gatewayUrl}/api/sessions/${desiredName}`, { method: "GET", headers, cache: "no-store" });
      if (checkRes.ok) {
        const data = await checkRes.json();
        const id = data?.id || desiredName;
        await registerOpenWaWebhook(gatewayUrl, id, webhookUrl, headers);
        return id;
      }
    } else {
      const errText = await createRes.text().catch(() => "");
      console.error(`[OpenWA] createRes returned ${createRes.status}: ${errText}`);
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

    const openWaUrl = process.env.OPENWA_SERVER_URL?.replace(/\/$/, "");
    const openWaKey = process.env.OPENWA_API_KEY || null;

    if (!openWaUrl) {
      return NextResponse.json(
        { error: "OPENWA_SERVER_URL is not configured" },
        { status: 500 }
      );
    }

    const desiredName = `user-${user.id}`;
    const sessionId = await ensureWahaSession(openWaUrl, desiredName, user.whatsappSessionId, openWaKey);
    
    if (!sessionId) {
      return NextResponse.json({ 
        status: "DISCONNECTED", 
        message: "Failed to initialize session on the WhatsApp Gateway."
      });
    }

    // Store the exact resolved sessionId (UUID) into User model so /send uses the exact same ID
    if (user.whatsappSessionId !== sessionId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { whatsappSessionId: sessionId },
      });
    }

    const headers = { ...(openWaKey ? { "X-API-Key": openWaKey } : {}) };

    // Check session status
    let rawStatus = "UNKNOWN";
    let info: any = null;
    try {
      const statusRes = await fetch(`${openWaUrl}/api/sessions/${sessionId}`, { method: "GET", headers, cache: "no-store" });
      if (statusRes.ok) {
        info = await statusRes.json();
        rawStatus = (info.status || "UNKNOWN").toUpperCase();
      } else {
        // If not ok (e.g., 404 or 400 not active), force start
        await fetch(`${openWaUrl}/api/sessions/${sessionId}/start`, { method: "POST", headers, cache: "no-store" }).catch(() => {});
        await new Promise(r => setTimeout(r, 2500));
        const retryRes = await fetch(`${openWaUrl}/api/sessions/${sessionId}`, { method: "GET", headers, cache: "no-store" });
        if (retryRes.ok) {
          info = await retryRes.json();
          rawStatus = (info.status || "UNKNOWN").toUpperCase();
        }
      }
    } catch (e) {
      // ignore
    }

    if (["STOPPED", "CREATED", "INITIALIZING", "AUTHENTICATING", "DISCONNECTED", "FAILED", "UNKNOWN"].includes(rawStatus)) {
      await fetch(`${openWaUrl}/api/sessions/${sessionId}/start`, { method: "POST", headers, cache: "no-store" }).catch(() => {});
      await new Promise(r => setTimeout(r, 2500));
      // re-check once after starting
      try {
        const sRes = await fetch(`${openWaUrl}/api/sessions/${sessionId}`, { method: "GET", headers, cache: "no-store" });
        if (sRes.ok) {
          info = await sRes.json();
          rawStatus = (info.status || "UNKNOWN").toUpperCase();
        }
      } catch (e) {}
    }

    if (["WORKING", "CONNECTED", "READY", "AUTHENTICATED"].includes(rawStatus)) {
      return NextResponse.json({ status: "CONNECTED", sessionId, phone: info?.phone || null });
    }

    if (["SCAN_QR_CODE", "SCAN_QR", "QR_READY"].includes(rawStatus)) {
      try {
        let qrRes = await fetch(`${openWaUrl}/api/sessions/${sessionId}/qr`, { method: "GET", headers, cache: "no-store" });
        if (!qrRes.ok) {
          const errText = await qrRes.text();
          if (errText.includes("not active") || errText.includes("Start the session")) {
            await fetch(`${openWaUrl}/api/sessions/${sessionId}/start`, { method: "POST", headers, cache: "no-store" }).catch(() => {});
            await new Promise(r => setTimeout(r, 2500));
            qrRes = await fetch(`${openWaUrl}/api/sessions/${sessionId}/qr`, { method: "GET", headers, cache: "no-store" });
          }
        }

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
        }
      } catch (e) {
        // fallback
      }
      return NextResponse.json({ status: "QR_READY", qr: null, sessionId });
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

    if (!user) {
      return NextResponse.json({ success: true });
    }

    const openWaUrl = process.env.OPENWA_SERVER_URL?.replace(/\/$/, "");
    const openWaKey = process.env.OPENWA_API_KEY || null;

    if (openWaUrl) {
      const headers = { ...(openWaKey ? { "X-API-Key": openWaKey } : {}) };
      const desiredName = `user-${user.id}`;
      const toClean = new Set<string>();
      if (user.whatsappSessionId) toClean.add(user.whatsappSessionId);
      toClean.add(desiredName);

      // Find any other stale sessions matching this user on WAHA and add to cleanup list
      try {
        const listRes = await fetch(`${openWaUrl}/api/sessions`, { method: "GET", headers, cache: "no-store" });
        if (listRes.ok) {
          const sessions = await listRes.json();
          if (Array.isArray(sessions)) {
            for (const s of sessions) {
              if (s.name === desiredName || s.name === user.whatsappSessionId || s.id === user.whatsappSessionId) {
                if (s.id) toClean.add(s.id);
                if (s.name) toClean.add(s.name);
              }
            }
          }
        }
      } catch (e) {}

      for (const sid of toClean) {
        try {
          await fetch(`${openWaUrl}/api/sessions/${sid}/logout`, { method: "POST", headers }).catch(() => {});
          await fetch(`${openWaUrl}/api/sessions/${sid}/stop`, { method: "POST", headers }).catch(() => {});
          await fetch(`${openWaUrl}/api/sessions/${sid}`, { method: "DELETE", headers }).catch(() => {});
        } catch (e) {}
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
