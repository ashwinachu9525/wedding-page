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
          include: {
            user: { select: { email: true, name: true } },
            partnerUser: { select: { email: true, name: true } },
          },
        });
        if (!invite) return NextResponse.json(null);

        // Check if owner or partner has active PRO
        let isProUser = false;
        try {
          const emailsToCheck = [invite.user?.email, invite.partnerUser?.email, invite.partnerEmail]
            .filter(Boolean)
            .map(e => e!.trim().toLowerCase());

          if (emailsToCheck.length > 0) {
            // Ensure table exists before querying
            await prisma.$executeRawUnsafe(`
              CREATE TABLE IF NOT EXISTS vivaha_pro_payments (
                id SERIAL PRIMARY KEY,
                tx_id TEXT UNIQUE,
                user_email TEXT,
                status TEXT DEFAULT 'Approved & Active',
                plan TEXT DEFAULT 'PRO',
                created_at TIMESTAMPTZ DEFAULT NOW()
              )
            `);
            for (const email of emailsToCheck) {
              const rows: any[] = await prisma.$queryRawUnsafe(
                `SELECT tx_id FROM vivaha_pro_payments WHERE user_email = $1 AND status = 'Approved & Active' LIMIT 1`,
                email
              );
              if (Array.isArray(rows) && rows.length > 0) {
                isProUser = true;
                break;
              }
            }
          }
        } catch (proErr) {
          console.warn("[isProUser check failed]", proErr);
        }

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
      fontStyle,
      heroBgType,
      heroBgUrl,
      musicUrl,
      timelineJson,
      faqJson,
      eventsJson,
      galleryJson,
      enableAccommodations,
      accommodationsTitle,
      splitCoupleNames,
      enableEnvelope,
      envelopeTemplate,
      rsvpDeadline,
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
            fontStyle,
            heroBgType,
            heroBgUrl,
            musicUrl,
            eventsJson,
            timelineJson,
            faqJson,
            galleryJson,
            ...(enableAccommodations !== undefined ? { enableAccommodations: Boolean(enableAccommodations) } : {}),
            ...(accommodationsTitle !== undefined ? { accommodationsTitle } : {}),
            ...(splitCoupleNames !== undefined ? { splitCoupleNames: Boolean(splitCoupleNames) } : {}),
            ...(enableEnvelope !== undefined ? { enableEnvelope: Boolean(enableEnvelope) } : {}),
            ...(envelopeTemplate !== undefined ? { envelopeTemplate } : {}),
            ...(rsvpDeadline !== undefined ? { rsvpDeadline: rsvpDeadline || null } : {}),
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
            fontStyle,
            heroBgType: heroBgType || "image",
            heroBgUrl: heroBgUrl || null,
            musicUrl,
            eventsJson,
            timelineJson,
            faqJson,
            galleryJson,
            enableAccommodations: enableAccommodations !== undefined ? Boolean(enableAccommodations) : true,
            accommodationsTitle: accommodationsTitle || "Accommodations & Venue Directions",
            splitCoupleNames: Boolean(splitCoupleNames),
            enableEnvelope: enableEnvelope !== undefined ? Boolean(enableEnvelope) : false,
            envelopeTemplate: envelopeTemplate || "classic-gold",
            rsvpDeadline: rsvpDeadline || null,
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
