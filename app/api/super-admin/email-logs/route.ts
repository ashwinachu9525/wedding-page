import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getPrismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session?.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const prisma = getPrismaClient();
    if (!prisma) return NextResponse.json([], { status: 200 });

    // Ensure table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id TEXT PRIMARY KEY,
        "to" TEXT NOT NULL,
        subject TEXT NOT NULL,
        source TEXT NOT NULL,
        status TEXT NOT NULL,
        error TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM email_logs ORDER BY created_at DESC LIMIT 200`
    );

    const logs = rows.map((r) => ({
      id: r.id,
      to: r.to,
      subject: r.subject,
      source: r.source,
      status: r.status,
      error: r.error || null,
      createdAt: r.created_at
        ? new Date(r.created_at).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "—",
    }));

    return NextResponse.json(logs);
  } catch (err: any) {
    console.error("[super-admin/email-logs]", err);
    return NextResponse.json([], { status: 200 });
  }
}
