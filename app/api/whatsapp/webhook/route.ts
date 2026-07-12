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

    // Extract the user ID from the session name ("user-cuid...")
    // In some cases, session is just the name of the session we configured.
    // If we can't find the user, we just ignore.
    const user = await prisma.user.findFirst({
      where: { whatsappSessionId: session },
    });

    if (!user) {
      return NextResponse.json({ success: true, ignored: true });
    }

    // Process different events
    switch (event) {
      case "message.any":
      case "message":
        break; // Ignore incoming messages for now, or log them later

      case "message.ack":
        // Payload typically contains id and ack status
        // ack: 1 (server), 2 (device), 3 (read), 4 (played)
        if (payload?.id) {
          let status = "SENT";
          if (payload.ack === 2) status = "DELIVERED";
          if (payload.ack === 3) status = "READ";
          if (payload.ack === 4) status = "PLAYED";
          
          await prisma.whatsappLog.updateMany({
            where: { messageId: payload.id },
            data: { status },
          });
        }
        break;

      case "message.sent":
      case "message.failed":
      case "message.revoked":
        if (payload?.id) {
          let status = "SENT";
          if (event === "message.failed") status = "FAILED";
          if (event === "message.revoked") status = "REVOKED";
          
          await prisma.whatsappLog.updateMany({
            where: { messageId: payload.id },
            data: { status },
          });
        }
        break;

      case "session.status":
      case "session.disconnected":
      case "session.authenticated":
        // We could store session status, but currently we rely on dynamic API fetching.
        // We can just log it for now.
        console.log(`[WAHA] Session ${session} status update:`, event, payload);
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
