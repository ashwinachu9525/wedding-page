import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

// Default fallback testimonials when DB is empty
const DEFAULT_TESTIMONIALS = [
  {
    name: "Ananya & Karthik Iyer",
    venue: "Taj Coromandel, Chennai",
    date: "March 2026",
    quote: "We sent personalized invites to 340 guests in under 15 minutes. The WhatsApp delivery tracking is a lifesaver — we knew exactly who opened it!",
    rating: 5,
    theme: "Heritage Emerald",
    themeColor: "#112A21",
    textColor: "#FAF8F5",
    isVisible: true,
    sortOrder: 0,
  },
  {
    name: "Riya & Arjun Menon",
    venue: "Leela Palace, Udaipur",
    date: "January 2026",
    quote: "The AI card scanner is pure magic. I uploaded a photo of my printed card and it filled everything automatically. My guests said it was the most beautiful digital invite they'd ever received.",
    rating: 5,
    theme: "Midnight Velvet",
    themeColor: "#1F1D1A",
    textColor: "#FAF8F5",
    isVisible: true,
    sortOrder: 1,
  },
  {
    name: "Sneha & Rohit Sharma",
    venue: "Falaknuma Palace, Hyderabad",
    date: "December 2025",
    quote: "The countdown timer on our invite page kept our guests excited for weeks! Every time they checked, they'd message us how pumped they were. 10/10 would recommend.",
    rating: 5,
    theme: "Jaipur Rose",
    themeColor: "#FFF8F8",
    textColor: "#4A1D24",
    isVisible: true,
    sortOrder: 2,
  },
];

export async function GET() {
  try {
    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json(DEFAULT_TESTIMONIALS);
    }

    const testimonials = await prisma.testimonial.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    // Return defaults if table is empty (first-run)
    if (testimonials.length === 0) {
      return NextResponse.json(DEFAULT_TESTIMONIALS);
    }

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("[Testimonials GET] Error:", error);
    return NextResponse.json(DEFAULT_TESTIMONIALS);
  }
}
