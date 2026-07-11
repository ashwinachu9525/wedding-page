import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter required" }, { status: 400 });
    }

    const prisma = getPrismaClient();
    if (!prisma) return NextResponse.json([], { status: 200 });

    // Ensure table exists
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS vivaha_pro_payments (
        id SERIAL PRIMARY KEY,
        tx_id TEXT UNIQUE,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        couple_names TEXT,
        user_email TEXT,
        amount INTEGER DEFAULT 0,
        currency TEXT DEFAULT 'INR',
        payment_method TEXT,
        status TEXT DEFAULT 'Approved & Active',
        plan TEXT DEFAULT 'PRO',
        is_mock BOOLEAN DEFAULT FALSE,
        granted_by_admin BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    await prisma.$executeRawUnsafe(`
      ALTER TABLE vivaha_pro_payments
      ADD COLUMN IF NOT EXISTS couple_names TEXT,
      ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
      ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
      ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
      ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR',
      ADD COLUMN IF NOT EXISTS payment_method TEXT,
      ADD COLUMN IF NOT EXISTS is_mock BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS granted_by_admin BOOLEAN DEFAULT FALSE
    `);

    const rows: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM vivaha_pro_payments WHERE user_email = $1 ORDER BY created_at DESC`,
      email.trim().toLowerCase()
    );

    const payments = rows.map((r) => ({
      id: r.id,
      txId: r.tx_id,
      razorpayOrderId: r.razorpay_order_id,
      razorpayPaymentId: r.razorpay_payment_id,
      coupleNames: r.couple_names,
      userEmail: r.user_email,
      amount: r.amount,
      currency: r.currency,
      paymentMethod: r.payment_method,
      status: r.status,
      plan: r.plan,
      isMock: r.is_mock,
      grantedByAdmin: r.granted_by_admin,
      date: new Date(r.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    return NextResponse.json(payments);
  } catch (err: any) {
    console.error("[payments GET]", err);
    return NextResponse.json([], { status: 200 });
  }
}
