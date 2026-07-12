import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

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

    const logs = await prisma.whatsappLog.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit to last 100 messages
    });

    return NextResponse.json({ logs });
  } catch (error: any) {
    console.error("WhatsApp logs error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
