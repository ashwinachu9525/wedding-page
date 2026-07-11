import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/session";
import { getPrismaClient } from "@/lib/prisma";

// POST /api/super-admin/set-plan
// Body: { email: string, plan: "PRO" | "FREE" }
export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session?.isSuperAdmin) {
    return NextResponse.json({ error: "Unauthorized. Super admin access required." }, { status: 401 });
  }

  try {
    const { email, plan } = await req.json();
    if (!email || !plan || !["PRO", "FREE"].includes(plan)) {
      return NextResponse.json({ error: "email and plan (PRO | FREE) are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const prisma = getPrismaClient();
    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Use Prisma's $executeRawUnsafe so we reuse the same connection + SSL config
    // Ensure table exists with all required columns
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS vivaha_pro_payments (
        id SERIAL PRIMARY KEY,
        tx_id TEXT UNIQUE,
        razorpay_order_id TEXT,
        razorpay_payment_id TEXT,
        razorpay_signature TEXT,
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

    // Add granted_by_admin column if it doesn't exist yet (safe migration)
    await prisma.$executeRawUnsafe(`
      ALTER TABLE vivaha_pro_payments
      ADD COLUMN IF NOT EXISTS granted_by_admin BOOLEAN DEFAULT FALSE
    `);

    if (plan === "PRO") {
      const txId = `ADMIN-GRANT-${Date.now()}-${cleanEmail.replace(/[^a-z0-9]/g, "")}`;
      await prisma.$executeRawUnsafe(
        `INSERT INTO vivaha_pro_payments
           (tx_id, couple_names, user_email, amount, currency, payment_method, status, plan, is_mock, granted_by_admin)
         VALUES ($1, $2, $3, 0, 'INR', 'Admin Grant', 'Approved & Active', 'PRO', false, true)
         ON CONFLICT (tx_id) DO NOTHING`,
        txId,
        user.name || cleanEmail,
        cleanEmail
      );
    } else {
      // Revoke all active records for this user
      await prisma.$executeRawUnsafe(
        `UPDATE vivaha_pro_payments SET status = 'Revoked' WHERE user_email = $1`,
        cleanEmail
      );
    }

    return NextResponse.json({
      success: true,
      email: cleanEmail,
      plan,
      message:
        plan === "PRO"
          ? `💎 PRO granted to ${cleanEmail} by super admin`
          : `PRO revoked for ${cleanEmail}`,
    });
  } catch (err: any) {
    console.error("[set-plan]", err);
    return NextResponse.json({ error: err.message || "Failed to update plan" }, { status: 500 });
  }
}
