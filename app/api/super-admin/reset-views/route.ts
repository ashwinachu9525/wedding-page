import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getPrismaClient } from "@/lib/prisma";
import { resetInvitationViews } from "@/lib/mock-storage";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session?.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { userId, username } = await req.json();
    if (!userId && !username) {
      return NextResponse.json({ error: "userId or username required" }, { status: 400 });
    }

    const prisma = getPrismaClient();
    if (prisma && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
      try {
        // Find invitations matching either userId or username (slug)
        const invitations = await prisma.invitation.findMany({
          where: userId ? { userId } : { slug: username },
          select: { id: true, slug: true },
        });

        if (invitations.length > 0) {
          const invIds = invitations.map((i) => i.id);

          // Reset viewCount to 0 for all invitations of this user
          await prisma.invitation.updateMany({
            where: { id: { in: invIds } },
            data: { viewCount: 0 },
          });

          // Delete all tracked IP visits so visitors count from scratch again
          await prisma.invitationVisit.deleteMany({
            where: { invitationId: { in: invIds } },
          });

          return NextResponse.json({
            success: true,
            resetCount: invitations.length,
            message: `Reset view count to 0 for ${invitations.length} invitation(s).`,
          });
        } else if (username) {
          // If no user/invitation relation found directly by id, try exact slug
          await prisma.invitation.updateMany({
            where: { slug: username },
            data: { viewCount: 0 },
          });
          const inv = await prisma.invitation.findUnique({ where: { slug: username }, select: { id: true } });
          if (inv) {
            await prisma.invitationVisit.deleteMany({ where: { invitationId: inv.id } });
          }
          return NextResponse.json({ success: true, message: "Reset view count to 0 for invitation slug." });
        }
      } catch (dbErr) {
        console.warn("[super-admin/reset-views] Prisma error:", dbErr);
      }
    }

    // Fallback storage reset
    if (username) resetInvitationViews(username);
    if (userId) resetInvitationViews(userId);

    return NextResponse.json({ success: true, message: "Reset view count in local storage." });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to reset views" }, { status: 500 });
  }
}
