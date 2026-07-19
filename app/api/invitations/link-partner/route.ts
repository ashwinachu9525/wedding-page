import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, partnerEmail, action = "link" } = body;

    if (!slug) {
      return NextResponse.json({ error: "Invitation slug is required" }, { status: 400 });
    }

    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Verify user owns or is partner of this invitation
    const currentUser = await prisma.user.findUnique({
      where: { email: session.email },
      select: { id: true, email: true, name: true },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User profile not found" }, { status: 404 });
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug: slug.toLowerCase() },
      include: {
        user: { select: { id: true, email: true, name: true } },
        partnerUser: { select: { id: true, email: true, name: true } },
      },
    });

    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const isOwner = invitation.userId === currentUser.id || invitation.user?.email === session.email;
    const isPartner = invitation.partnerUserId === currentUser.id || invitation.partnerEmail === session.email;

    if (!isOwner && !isPartner && !session.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to manage this wedding" }, { status: 403 });
    }

    if (action === "unlink") {
      await prisma.invitation.update({
        where: { id: invitation.id },
        data: {
          partnerUserId: null,
          partnerEmail: null,
        },
      });
      return NextResponse.json({ success: true, message: "Partner account unlinked successfully." });
    }

    // Action is "link"
    if (!partnerEmail || typeof partnerEmail !== "string") {
      return NextResponse.json({ error: "Please enter a valid partner email address" }, { status: 400 });
    }

    const cleanEmail = partnerEmail.trim().toLowerCase();
    if (cleanEmail === currentUser.email?.toLowerCase()) {
      return NextResponse.json({ error: "You cannot link your own email as your partner." }, { status: 400 });
    }

    // Check if a user exists with this email
    const targetPartner = await prisma.user.findUnique({
      where: { email: cleanEmail },
      select: { id: true, email: true, name: true },
    });

    const updated = await prisma.invitation.update({
      where: { id: invitation.id },
      data: {
        partnerEmail: cleanEmail,
        partnerUserId: targetPartner ? targetPartner.id : null,
      },
      include: {
        partnerUser: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: targetPartner
        ? `Linked account: ${targetPartner.name || cleanEmail} is now co-owner of this wedding celebration!`
        : `Invitation linked to ${cleanEmail}. When they register and sign in, they will automatically share this celebration dashboard.`,
      partnerEmail: updated.partnerEmail,
      partnerUser: updated.partnerUser,
    });
  } catch (err: any) {
    console.error("[POST /api/invitations/link-partner]", err);
    return NextResponse.json({ error: err.message || "Failed to process account link" }, { status: 500 });
  }
}
