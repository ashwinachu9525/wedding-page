import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getAllInvitations, getInvitationBySlug, saveOrUpdateInvitation } from "@/lib/mock-storage";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    const prisma = getPrismaClient();
    if (prisma && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
      if (slug) {
        const invite = await prisma.invitation.findUnique({
          where: { slug: slug.toLowerCase() },
          include: { user: { select: { email: true } } },
        });
        if (!invite) return NextResponse.json(null);

        // Check if owner has active PRO
        let isProUser = false;
        try {
          const rows: any[] = await prisma.$queryRawUnsafe(
            `SELECT 1 FROM vivaha_pro_payments WHERE user_email = $1 AND status = 'Approved & Active' LIMIT 1`,
            invite.user?.email ?? ""
          );
          isProUser = rows.length > 0;
        } catch (_) {}

        return NextResponse.json({ ...invite, isProUser });
      }
      const invites = await prisma.invitation.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(invites);
    }
  } catch (e) {
    console.warn("Prisma DB not reachable, returning mock invitations.");
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (slug) {
    return NextResponse.json(getInvitationBySlug(slug.toLowerCase()) || null);
  }
  return NextResponse.json(getAllInvitations());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      email,
      slug,
      coupleNames,
      title,
      brideDetails,
      groomDetails,
      weddingDate,
      weddingDateDisplay,
      venueName,
      venueAddress,
      mapUrl,
      story,
      theme,
      heroBgType,
      heroBgUrl,
      musicUrl,
      timelineJson,
      faqJson,
      eventsJson,
      galleryJson,
    } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    try {
      const prisma = getPrismaClient();
      if (prisma && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
        // Resolve userId from email so the invitation is linked to the user
        let userId: string | undefined;
        if (email) {
          const owner = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
            select: { id: true },
          });
          userId = owner?.id;
        }

        const saved = await prisma.invitation.upsert({
          where: { slug },
          update: {
            ...(userId ? { userId } : {}),
            coupleNames,
            title,
            brideDetails,
            groomDetails,
            weddingDate,
            weddingDateDisplay,
            venueName,
            venueAddress,
            mapUrl,
            story,
            theme,
            musicUrl,
            eventsJson,
            timelineJson,
            faqJson,
            galleryJson,
          },
          create: {
            slug,
            ...(userId ? { userId } : {}),
            coupleNames,
            title,
            brideDetails,
            groomDetails,
            weddingDate: weddingDate || new Date().toISOString(),
            weddingDateDisplay,
            venueName,
            venueAddress: venueAddress || "India",
            mapUrl: mapUrl || "https://maps.google.com",
            story,
            theme,
            musicUrl,
            eventsJson,
            timelineJson,
            faqJson,
            galleryJson,
          },
        });
        return NextResponse.json(saved);
      }
    } catch (dbErr) {
      console.warn("Prisma save failed, saving to local fallback storage.", dbErr);
    }

    const fallbackSaved = saveOrUpdateInvitation(body);
    return NextResponse.json(fallbackSaved);
  } catch (err) {
    return NextResponse.json({ error: "Failed to save invitation" }, { status: 500 });
  }
}
