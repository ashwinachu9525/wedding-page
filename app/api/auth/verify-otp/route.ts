import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";

// In-memory OTP store keyed by email (good enough for single-instance dev/prod)
// For multi-instance production, use Redis or store OTP hash in the DB.
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

/** Called by /api/auth/register to store the generated OTP server-side */
export function storeOtp(email: string, otp: string) {
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stored = otpStore.get(cleanEmail);

    // Validate OTP
    if (!stored) {
      return NextResponse.json({ error: "No pending verification for this email. Please register again." }, { status: 400 });
    }
    if (Date.now() > stored.expiresAt) {
      otpStore.delete(cleanEmail);
      return NextResponse.json({ error: "OTP has expired. Please request a new code." }, { status: 400 });
    }
    if (otp.trim() !== stored.otp) {
      return NextResponse.json({ error: "Invalid OTP code. Please check your email and try again." }, { status: 400 });
    }

    // OTP valid — clear it
    otpStore.delete(cleanEmail);

    // Mark user as email-verified in DB
    const prisma = getPrismaClient();
    let sessionPayload: any = { email: cleanEmail, role: "USER", provider: "credentials", onboarded: false };

    if (prisma) {
      try {
        const user = await prisma.user.update({
          where: { email: cleanEmail },
          data: { emailVerified: true },
          include: {
            invitations: { select: { slug: true }, take: 1 },
          },
        });
        const firstInvite = user.invitations?.[0];
        sessionPayload = {
          id: user.id,
          email: user.email!,
          name: user.name || user.email!,
          role: user.role,
          provider: user.provider || "credentials",
          slug: firstInvite?.slug || null,
          onboarded: !!firstInvite,
        };
      } catch (dbErr) {
        console.warn("[verify-otp] DB update failed:", dbErr);
      }
    }

    // Issue session cookie
    const token = await createSessionToken(sessionPayload);
    const res = NextResponse.json({ success: true, user: sessionPayload });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (err) {
    console.error("[verify-otp]", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
