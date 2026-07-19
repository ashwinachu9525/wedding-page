import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

// PATCH — update a testimonial by id
export async function PATCH(req: NextRequest, { params }: any) {
  try {
    const prisma = getPrismaClient();
    if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    const body = await req.json();
    const { name, venue, date, quote, rating, theme, themeColor, textColor, isVisible, sortOrder } = body;

    const updated = await prisma.testimonial.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(venue !== undefined && { venue }),
        ...(date !== undefined && { date }),
        ...(quote !== undefined && { quote }),
        ...(rating !== undefined && { rating: Number(rating) }),
        ...(theme !== undefined && { theme }),
        ...(themeColor !== undefined && { themeColor }),
        ...(textColor !== undefined && { textColor }),
        ...(isVisible !== undefined && { isVisible }),
        ...(sortOrder !== undefined && { sortOrder: Number(sortOrder) }),
      },
    });

    return NextResponse.json({ success: true, testimonial: updated });
  } catch (error) {
    console.error("[SuperAdmin Testimonials PATCH] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE — delete a testimonial by id
export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const prisma = getPrismaClient();
    if (!prisma) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SuperAdmin Testimonials DELETE] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
