import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "../../../../lib/prisma";
import { createSessionToken, getSessionFromRequest, SESSION_COOKIE } from "../../../../lib/session";

// GET /api/auth/session — read current session from cookie, enrich from DB
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // For super admin short-circuit
    if (session.isSuperAdmin) {
      return NextResponse.json({ user: session }, { status: 200 });
    }

    // For demo user short-circuit
    if (session.isDemo) {
      return NextResponse.json({ user: session }, { status: 200 });
    }

    // Enrich from DB
    const prisma = getPrismaClient();
    if (!prisma || !session.email) {
      return NextResponse.json({ user: session }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.email },
      include: {
        invitations: {
          select: {
            id: true,
            slug: true,
            coupleNames: true,
            venueName: true,
            weddingDate: true,
          },
          take: 1,
        },
      },
    });

    if (!user) {
      // User deleted from DB — clear cookie
      const res = NextResponse.json({ user: null }, { status: 200 });
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }

    let firstInvite = user.invitations?.[0];

    // Orphan recovery: invitation was created before userId linking was fixed.
    // If the user has no linked invitations but the session JWT carries a slug,
    // find the orphaned invitation and link it to this user now.
    if (!firstInvite && session.slug) {
      try {
        const orphan = await prisma.invitation.findUnique({
          where: { slug: session.slug },
          select: { id: true, slug: true, coupleNames: true, venueName: true, weddingDate: true, userId: true },
        });
        if (orphan && !orphan.userId) {
          await prisma.invitation.update({
            where: { id: orphan.id },
            data: { userId: user.id },
          });
          firstInvite = orphan;
        } else if (orphan && orphan.userId === user.id) {
          firstInvite = orphan;
        }
      } catch (e) {
        console.warn("[session] Orphan invitation recovery failed:", e);
      }
    }

    const onboarded = !!firstInvite;

    const enrichedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
      slug: firstInvite?.slug || null,
      coupleNames: firstInvite?.coupleNames || null,
      venueName: firstInvite?.venueName || null,
      weddingDate: firstInvite?.weddingDate || null,
      onboarded,
    };

    return NextResponse.json({ user: enrichedUser }, { status: 200 });
  } catch (err) {
    console.error("[GET /api/auth/session]", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}

// DELETE /api/auth/session — logout, clear cookie
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
