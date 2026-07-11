import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { trackUniqueVisit } from "@/lib/mock-storage";

export async function POST(req: NextRequest) {
  try {
    const { slug } = await req.json();
    if (!slug) {
      return NextResponse.json({ error: "Slug required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase();

    // Extract visitor IP address
    const forwarded = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const ipAddress = (forwarded ? forwarded.split(",")[0].trim() : realIp) || "127.0.0.1";

    const prisma = getPrismaClient();
    if (prisma && process.env.DATABASE_URL && !process.env.DATABASE_URL.includes("localhost")) {
      try {
        const inv = await prisma.invitation.findUnique({
          where: { slug: cleanSlug },
          select: { id: true, viewCount: true },
        });

        if (!inv) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        // Try inserting a unique visit record for [invitationId, ipAddress]
        try {
          await prisma.invitationVisit.create({
            data: {
              invitationId: inv.id,
              ipAddress: ipAddress,
            },
          });

          // If create succeeds, it's a unique visitor — increment viewCount!
          const updated = await prisma.invitation.update({
            where: { id: inv.id },
            data: { viewCount: { increment: 1 } },
            select: { viewCount: true },
          });

          return NextResponse.json({ unique: true, viewCount: updated.viewCount });
        } catch (uniqueErr: any) {
          // Unique constraint violation (P2002) means this IP already visited!
          // Return existing viewCount without incrementing.
          return NextResponse.json({ unique: false, viewCount: inv.viewCount });
        }
      } catch (dbErr) {
        console.warn("[track-view] Prisma error, falling back to mock storage:", dbErr);
      }
    }

    const result = trackUniqueVisit(cleanSlug, ipAddress);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 });
  }
}
