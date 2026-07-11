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

    const users = await prisma.user.findMany({
      where: {
        email: { not: "demo@vivahaluxe.com" },
        role: { not: "SUPER_ADMIN" },
      },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { invitations: true } },
        invitations: {
          select: {
            viewCount: true,
            _count: { select: { rsvps: true } },
          },
        },
      },
    });

    // Ensure payments table exists then get PRO emails — use Prisma connection
    let proEmails = new Set<string>();
    try {
      await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS vivaha_pro_payments (
          id SERIAL PRIMARY KEY,
          tx_id TEXT UNIQUE,
          user_email TEXT,
          status TEXT DEFAULT 'Approved & Active',
          plan TEXT DEFAULT 'PRO',
          granted_by_admin BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMPTZ DEFAULT NOW()
        )
      `);
      const rows: any[] = await prisma.$queryRawUnsafe(
        `SELECT DISTINCT user_email FROM vivaha_pro_payments WHERE status = 'Approved & Active'`
      );
      proEmails = new Set(rows.map((r) => r.user_email));
    } catch (e) {
      console.warn("[super-admin/users] payments lookup failed:", e);
    }

    const mapped = users.map((u) => {
      const totalViews = u.invitations?.reduce((sum, inv) => sum + (inv.viewCount || 0), 0) || 0;
      const totalRsvps = u.invitations?.reduce((sum, inv) => sum + (inv._count?.rsvps || 0), 0) || 0;

      return {
        id: u.id,
        name: u.name || u.email,
        username: u.username || u.email?.split("@")[0],
        email: u.email,
        role: u.role,
        status: u.status,
        provider: u.provider,
        invitationsCount: u._count.invitations,
        joinedDate: u.createdAt
          ? new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
          : "—",
        rsvpsCount: totalRsvps,
        views: totalViews,
        isDemo: false,
        plan: proEmails.has(u.email!) ? "PRO" : "FREE",
        subStatus: proEmails.has(u.email!) ? "ACTIVE" : "EXPIRED",
      };
    });

    return NextResponse.json(mapped);
  } catch (err: any) {
    console.error("[super-admin/users]", err);
    return NextResponse.json({ error: err.message || "Failed to fetch users" }, { status: 500 });
  }
}
