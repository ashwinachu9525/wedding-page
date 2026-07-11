import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getPrismaClient } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      coupleNames,
      userEmail,
      amount,
      paymentMethod,
    } = body;

    // ── 1. Signature Verification ──────────────────────────────────────────────
    // isMock is determined server-side by checking if order ID has our mock prefix
    const isMock = typeof razorpay_order_id === "string" && razorpay_order_id.startsWith("order_mock_");
    let isValid = false;

    if (isMock) {
      // Mock orders are only valid in dev (no real Razorpay keys configured)
      isValid = !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET.startsWith("rzp_test_");
    } else if (process.env.RAZORPAY_KEY_SECRET) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
      isValid = generatedSignature === razorpay_signature;
    }

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Payment signature verification failed. Transaction rejected." },
        { status: 400 }
      );
    }

    // ── 2. Build Payment Record ────────────────────────────────────────────────
    const paymentRecord = {
      txId: razorpay_payment_id || `mock_${razorpay_order_id}`,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id || null,
      razorpaySignature: razorpay_signature || null,
      coupleNames,
      userEmail,
      amount: amount || 499,
      currency: "INR",
      paymentMethod: paymentMethod || "RAZORPAY",
      status: "Approved & Active",
      plan: "PRO",
      createdAt: new Date().toISOString(),
      isMock,
    };

    // ── 3. Persist to DB via Prisma (reuses same SSL connection) ─────────────
    try {
      const prisma = getPrismaClient();
      if (prisma) {
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
        await prisma.$executeRawUnsafe(
          `INSERT INTO vivaha_pro_payments
             (tx_id, razorpay_order_id, razorpay_payment_id, razorpay_signature,
              couple_names, user_email, amount, currency, payment_method, status, plan, is_mock)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (tx_id) DO NOTHING`,
          paymentRecord.txId,
          paymentRecord.razorpayOrderId,
          paymentRecord.razorpayPaymentId,
          paymentRecord.razorpaySignature,
          paymentRecord.coupleNames,
          paymentRecord.userEmail,
          paymentRecord.amount,
          paymentRecord.currency,
          paymentRecord.paymentMethod,
          paymentRecord.status,
          paymentRecord.plan,
          paymentRecord.isMock
        );
      }
    } catch (dbErr) {
      console.warn("[DB Write Warning] Payment insert skipped:", dbErr);
    }

    // ── 4. Send Confirmation Emails ────────────────────────────────────────────
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 465),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const adminHtml = `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:30px;background:#111827;color:#F9FAFB;border:2px solid #9333EA;">
            <h2 style="color:#A855F7;margin-top:0;">💎 New Pro Subscription Payment Received!</h2>
            <p style="color:#D1D5DB;">A VivahaLuxe Pro upgrade payment has been verified via Razorpay.</p>
            <div style="background:#1F2937;padding:20px;border-radius:6px;margin:20px 0;">
              <p><strong>Couple:</strong> ${coupleNames}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Amount Paid:</strong> ₹${amount} (INR)</p>
              <p><strong>Razorpay Payment ID:</strong> <code>${razorpay_payment_id || "MOCK"}</code></p>
              <p><strong>Razorpay Order ID:</strong> <code>${razorpay_order_id}</code></p>
              <p><strong>Payment Method:</strong> ${paymentMethod}</p>
              <p><strong>Status:</strong> <span style="color:#10B981;font-weight:bold;">Approved & Active</span></p>
              <p><strong>Timestamp:</strong> ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
            </div>
            <p style="font-size:12px;color:#9CA3AF;">Payment record persisted to CockroachDB (vivaha_pro_payments). Review in the Super Admin portal at /super-admin → Pro Subscriptions tab.</p>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM,
          to: "support@vivahaluxe.com",
          subject: `💎 Pro Subscription Payment Received: ${coupleNames} — ₹${amount} [${razorpay_payment_id || razorpay_order_id}]`,
          html: adminHtml,
        });

        if (userEmail?.includes("@")) {
          const userHtml = `
            <div style="font-family:serif;max-width:600px;margin:0 auto;padding:40px;background:#FAF8F5;color:#22201E;border:2px solid #D4AF37;">
              <div style="text-align:center;margin-bottom:25px;">
                <h1 style="font-size:26px;color:#112A21;">💎 VivahaLuxe Pro — Activated!</h1>
                <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#888178;">Payment Confirmed • Subscription Active</p>
              </div>
              <div style="background:#fff;padding:30px;border:1px solid #E8E2D9;">
                <p>Dear <strong>${coupleNames}</strong>,</p>
                <p>Your Razorpay payment of <strong>₹${amount}</strong> has been received and verified. Your VivahaLuxe Pro subscription is now <strong style="color:#059669;">Active</strong>!</p>
                <div style="margin:20px 0;padding:15px;background:#FAF8F5;border:1px dashed #C4B7A6;">
                  <p style="margin:5px 0;"><strong>Payment ID:</strong> ${razorpay_payment_id || "Verified"}</p>
                  <p style="margin:5px 0;"><strong>Order Reference:</strong> ${razorpay_order_id}</p>
                  <p style="margin:5px 0;"><strong>Amount:</strong> ₹${amount} (Lifetime, no renewal)</p>
                  <p style="margin:5px 0;"><strong>Plan:</strong> <span style="color:#7C3AED;font-weight:bold;">PRO — Lifetime</span></p>
                  <p style="margin:5px 0;"><strong>Ads Removed:</strong> ✅ Yes — completely ad-free</p>
                </div>
                <p style="font-size:13px;color:#55514C;">All advertisements have been permanently removed from your wedding invitation portal and admin studio. Enjoy an uninterrupted premium experience!</p>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: userEmail,
            subject: `💎 Pro Subscription Active — VivahaLuxe [${razorpay_payment_id || razorpay_order_id}]`,
            html: userHtml,
          });
        }
      }
    } catch (emailErr) {
      console.warn("[Email Warning] Post-payment email send error:", emailErr);
    }

    return NextResponse.json({ success: true, paymentRecord });
  } catch (err: any) {
    console.error("[Razorpay Verify Error]:", err?.message || err);
    return NextResponse.json({ success: false, error: "Payment verification failed." }, { status: 500 });
  }
}
