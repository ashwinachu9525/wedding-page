import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[WAHA Webhook] Received:", JSON.stringify(body, null, 2));

    const { event, session, payload, engine } = body;

    if (!session || !event) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const prisma = getPrismaClient()!;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { whatsappSessionId: session },
          { id: session.replace(/^user-/, "") },
        ],
      },
    });

    // Process different events
    switch (event) {
      case "message.received":
      case "message.any":
      case "message":
        break;

      case "message.ack":
        if (payload?.id) {
          const msgId = typeof payload.id === "string" ? payload.id : (payload.id._serialized || payload.id.id);
          if (msgId) {
            let status = "SENT";
            if (payload.ack === 2) status = "DELIVERED";
            if (payload.ack === 3) status = "READ";
            if (payload.ack === 4) status = "PLAYED";
            
            await prisma.whatsappLog.updateMany({
              where: { messageId: msgId },
              data: { status },
            });
          }
        }
        break;

      case "message.sent":
      case "message.failed":
      case "message.revoked":
        if (payload?.id) {
          const msgId = typeof payload.id === "string" ? payload.id : (payload.id._serialized || payload.id.id);
          if (msgId) {
            let status = "SENT";
            if (event === "message.failed") status = "FAILED";
            if (event === "message.revoked") status = "REVOKED";
            
            await prisma.whatsappLog.updateMany({
              where: { messageId: msgId },
              data: { status },
            });
          }
        }
        break;

      case "session.status":
      case "session.disconnected":
      case "session.authenticated":
        console.log(`[WAHA] Session ${session} status update:`, event, payload);
        if (event === "session.disconnected" && user) {
          await prisma.user.update({
            where: { id: user.id },
            data: { whatsappSessionId: `user-${user.id}` },
          }).catch(() => {});
        }
        break;
      
      default:
        console.log(`[WAHA] Unhandled event type: ${event}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[WAHA Webhook Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
