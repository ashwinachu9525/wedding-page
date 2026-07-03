import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getAllInvitations, saveOrUpdateInvitation } from "@/lib/mock-storage";

export async function GET() {
  try {
    const prisma = getPrismaClient();
    if (prisma && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
      const invites = await prisma.invitation.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(invites);
    }
  } catch (e) {
    console.warn("Prisma DB not reachable, returning mock invitations.");
  }
  return NextResponse.json(getAllInvitations());
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
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
        const saved = await prisma.invitation.upsert({
          where: { slug },
          update: {
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
            galleryJson,
          },
          create: {
            slug,
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
            galleryJson,
          },
        });
        return NextResponse.json(saved);
      }
    } catch (dbErr) {
      console.warn("Prisma save failed, saving to local fallback storage.");
    }

    const fallbackSaved = saveOrUpdateInvitation(body);
    return NextResponse.json(fallbackSaved);
  } catch (err) {
    return NextResponse.json({ error: "Failed to save invitation" }, { status: 500 });
  }
}
