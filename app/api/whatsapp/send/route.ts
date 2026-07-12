import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ error: "WhatsApp session not linked" }, { status: 400 });
    }

    if (user.plan !== "PRO") {
      return NextResponse.json({ error: "WhatsApp integration requires PRO plan" }, { status: 403 });
    }

    const { numbers, message } = await req.json();

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

    // Use WAHA's send endpoint
    // Note: WAHA only allows letters, numbers, and hyphens in session names
    const safeSessionId = user.whatsappSessionId.replace(/_/g, "-");
    const sendUrl = `${openWaUrl}/api/sessions/${safeSessionId}/messages/send-text`;
    
    const results = [];
    let successCount = 0;
    
    for (const number of numbers) {
      const cleanNumber = number.replace(/[^0-9]/g, "");
      if (!cleanNumber) continue;
      
      const chatId = `${cleanNumber}@c.us`;
      
      try {
        const res = await fetch(sendUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            chatId: chatId,
            text: message,
          }),
        });
        
        if (res.ok) {
          successCount++;
          const data = await res.json().catch(() => ({}));
          const messageId = data?.id || null;
          
          await prisma.whatsappLog.create({
            data: {
              userId: user.id,
              recipient: number,
              messageId: messageId,
              content: message,
              status: "PENDING", // Webhook will update to SENT/DELIVERED
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
        await prisma.whatsappLog.create({
          data: {
            userId: user.id,
            recipient: number,
            content: message,
            status: "FAILED",
            errorMessage: err.message || "Request failed",
          }
        });
        
        results.push({ number, status: "failed", error: err.message || "Request failed" });
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
