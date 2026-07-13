import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimitError = enforceRateLimit(req, 20, 60000); // Max 20 sends per minute per IP
    if (rateLimitError) return rateLimitError;

    const session = await getSessionFromRequest(req);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const prisma = getPrismaClient()!;
    const user = await prisma.user.findUnique({
      where: { email: session.email },
    });

    if (!user || !user.whatsappSessionId) {
      return NextResponse.json({ error: "WhatsApp session not linked" }, { status: 400 });
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

    const { numbers, message, imageUrl } = await req.json();

    if (!numbers || !Array.isArray(numbers) || numbers.length === 0 || !message) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const openWaUrl = process.env.OPENWA_SERVER_URL?.replace(/\/$/, "");
    const openWaKey = process.env.OPENWA_API_KEY || null;

    if (!openWaUrl) {
      return NextResponse.json(
        { error: "OPENWA_SERVER_URL is not configured" },
        { status: 500 }
      );
    }

    const headers = {
      "Content-Type": "application/json",
      ...(openWaKey ? { "X-API-Key": openWaKey } : {}),
    };

    let activeSessionId = user.whatsappSessionId.replace(/_/g, "-");
    try {
      // Self-heal: resolve exact session UUID if currently stored as name
      const checkRes = await fetch(`${openWaUrl}/api/sessions/${activeSessionId}`, { method: "GET", headers });
      if (!checkRes.ok) {
        const listRes = await fetch(`${openWaUrl}/api/sessions`, { method: "GET", headers });
        if (listRes.ok) {
          const sessions = await listRes.json();
          if (Array.isArray(sessions)) {
            const matched = sessions.find((s: any) => s.id === activeSessionId || s.name === activeSessionId || s.name === `user-${user.id}`);
            if (matched) {
              activeSessionId = matched.id;
              await prisma.user.update({ where: { id: user.id }, data: { whatsappSessionId: activeSessionId } }).catch(() => {});
            }
          }
        }
      }

      // Ensure session is started and active before sending
      let isReady = false;
      for (let attempt = 0; attempt < 5; attempt++) {
        const sRes = await fetch(`${openWaUrl}/api/sessions/${activeSessionId}`, { method: "GET", headers, cache: "no-store" });
        if (sRes.ok) {
          const info = await sRes.json();
          const rawStatus = (info.status || "").toUpperCase();
          if (["WORKING", "CONNECTED", "READY", "AUTHENTICATED"].includes(rawStatus)) {
            isReady = true;
            break;
          }
        }
        // If not ready, issue start command and wait 2 seconds
        await fetch(`${openWaUrl}/api/sessions/${activeSessionId}/start`, { method: "POST", headers, cache: "no-store" }).catch(() => {});
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (e) {
      // ignore precheck errors
    }

    const results = [];
    let successCount = 0;
    
    for (const number of numbers) {
      const cleanNumber = number.replace(/[^0-9]/g, "");
      if (!cleanNumber) continue;
      
      const chatId = number.includes("@") ? number : `${cleanNumber}@c.us`;
      
      try {
        const openWaPayload = imageUrl ? {
          chatId: chatId,
          url: imageUrl,
          mimetype: imageUrl.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
          filename: "wedding-invite.jpg",
          caption: message,
        } : {
          chatId: chatId,
          text: message,
        };

        const targetEndpoint = imageUrl
          ? `${openWaUrl}/api/sessions/${activeSessionId}/messages/send-image`
          : `${openWaUrl}/api/sessions/${activeSessionId}/messages/send-text`;

        let res = await fetch(targetEndpoint, {
          method: "POST",
          headers,
          body: JSON.stringify(openWaPayload),
        });

        // If failed due to inactive session, attempt to start session, wait 3 seconds, and retry
        if (!res.ok) {
          const errText = await res.text().catch(() => "");
          if (errText.includes("not active") || errText.includes("Start the session") || errText.includes("not running") || errText.includes("STOPPED")) {
            await fetch(`${openWaUrl}/api/sessions/${activeSessionId}/start`, { method: "POST", headers }).catch(() => {});
            await new Promise(r => setTimeout(r, 3000));
            res = await fetch(targetEndpoint, {
              method: "POST",
              headers,
              body: JSON.stringify(openWaPayload),
            });
          } else if (imageUrl && (res.status === 400 || res.status === 404 || res.status === 422)) {
            // If OpenWA send-image failed with 400/404/422 (e.g. connected to legacy WAHA engine expecting nested file object or send-file)
            console.warn(`[OpenWA] top-level send-image failed (${res.status}): ${errText}. Trying WAHA file object and send-file endpoints...`);
            const wahaPayload = {
              chatId: chatId,
              file: {
                url: imageUrl,
                mimetype: imageUrl.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg",
                filename: "wedding-invite.jpg",
              },
              caption: message,
            };
            res = await fetch(targetEndpoint, {
              method: "POST",
              headers,
              body: JSON.stringify(wahaPayload),
            });
            if (!res.ok && (res.status === 404 || res.status === 400)) {
              const fileEndpoint = `${openWaUrl}/api/sessions/${activeSessionId}/messages/send-file`;
              res = await fetch(fileEndpoint, {
                method: "POST",
                headers,
                body: JSON.stringify(wahaPayload),
              });
            }
          }
          if (!res.ok) {
            const finalErr = await res.text().catch(() => "");
            throw new Error(finalErr || errText || `Failed with HTTP ${res.status}`);
          }
        }

        if (res.ok) {
          successCount++;
          const data = await res.json().catch(() => ({}));
          const messageId = typeof data?.id === "string" ? data.id : (data?.id?._serialized || data?.id?.id || null);
          
          await prisma.whatsappLog.create({
            data: {
              userId: user.id,
              recipient: number,
              messageId: messageId,
              content: message,
              status: "SENT", // Immediately mark as SENT on HTTP 200 from gateway
            }
          });
          
          results.push({ number, status: "success", messageId });
        } else {
          const err = await res.text();
          await prisma.whatsappLog.create({
            data: {
              userId: user.id,
              recipient: number,
              content: message,
              status: "FAILED",
              errorMessage: err,
            }
          });
          
          results.push({ number, status: "failed", error: err });
        }
      } catch (err: any) {
        const errMsg = err?.message || "Request failed";
        await prisma.whatsappLog.create({
          data: {
            userId: user.id,
            recipient: number,
            content: message,
            status: "FAILED",
            errorMessage: errMsg,
          }
        });
        
        results.push({ number, status: "failed", error: errMsg });
      }
    }

    return NextResponse.json({ 
      success: true, 
      sent: successCount, 
      total: numbers.length,
      results 
    });
  } catch (error: any) {
    console.error("WhatsApp send error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
