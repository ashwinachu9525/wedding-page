import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "Slug is required" }, { status: 400 });

    const prisma = getPrismaClient();
    if (prisma) {
      const invitation = await prisma.invitation.findUnique({
        where: { slug },
        include: { rsvps: { orderBy: { createdAt: "desc" } } },
      });
      return NextResponse.json(invitation?.rsvps || []);
    }
  } catch (e) {
    console.error("Failed to fetch RSVPs:", e);
  }
  return NextResponse.json([]);
}

export async function POST(req: Request) {
  try {
    const { slug, name, attending, guestsCount, dietary, allergies, songRequest, events } = await req.json();
    if (!slug || !name) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const prisma = getPrismaClient();
    if (prisma) {
      const invitation = await prisma.invitation.findUnique({ where: { slug } });
      if (!invitation) {
        return NextResponse.json({ error: "Invitation not found for slug: " + slug }, { status: 404 });
      }
      if (invitation.rsvpDeadline) {
        const deadlineDate = new Date(invitation.rsvpDeadline);
        if (!isNaN(deadlineDate.getTime()) && new Date().getTime() > deadlineDate.getTime()) {
          const formattedDate = deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          return NextResponse.json({ error: `RSVP cutoff deadline (${formattedDate}) has passed.` }, { status: 403 });
        }
      }
      const rsvp = await prisma.rsvp.create({
        data: {
          invitationId: invitation.id,
          guestName: name,
          attending: attending || "yes",
          guestsCount: Number(guestsCount || 1),
          dietary: dietary || "None",
          events: events ? (Array.isArray(events) ? events.join(", ") : events) : "Ceremony",
          // phone field stores the guest phone/contact; allergies & songRequest stored in dietary notes
          phone: allergies || songRequest || "",
        },
      });
      return NextResponse.json({ success: true, rsvp });
    }
  } catch (e) {
    console.error("Failed to save RSVP:", e);
    return NextResponse.json({ error: "Failed to save RSVP" }, { status: 500 });
  }
  return NextResponse.json({ success: true, localOnly: true });
}
