import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

// GET — list all testimonials (including hidden, for admin)
export async function GET() {
  try {
    const prisma = getPrismaClient();
    if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({ success: true, testimonials });
  } catch (error) {
    console.error("[SuperAdmin Testimonials GET] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST — create a new testimonial
export async function POST(req: NextRequest) {
  try {
    const prisma = getPrismaClient();
    if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const body = await req.json();
    const { name, venue, date, quote, rating, theme, themeColor, textColor, isVisible, sortOrder } = body;

    if (!name || !venue || !quote) {
      return NextResponse.json({ error: "name, venue and quote are required" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        venue,
        date: date || "",
        quote,
        rating: Number(rating) || 5,
        theme: theme || "",
        themeColor: themeColor || "#22201E",
        textColor: textColor || "#FAF8F5",
        isVisible: isVisible !== false,
        sortOrder: Number(sortOrder) || 0,
      },
    });

    return NextResponse.json({ success: true, testimonial });
  } catch (error) {
    console.error("[SuperAdmin Testimonials POST] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
