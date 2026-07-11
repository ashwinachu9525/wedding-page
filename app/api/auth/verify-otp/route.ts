import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrismaClient } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const prisma = getPrismaClient();

    if (!prisma) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Load user and OTP fields from DB
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

    if (!user) {
      return NextResponse.json(
        { error: "No account found for this email. Please register first." },
        { status: 400 }
      );
    }

    if (!user.otpHash || !user.otpExpiresAt) {
      return NextResponse.json(
        { error: "No pending verification found. Please request a new OTP." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date() > user.otpExpiresAt) {
      // Clear expired OTP
      await prisma.user.update({
        where: { email: cleanEmail },
        data: { otpHash: null, otpExpiresAt: null },
      });
      return NextResponse.json(
        { error: "OTP has expired. Please click Resend to get a new code." },
        { status: 400 }
      );
    }

    // Verify OTP against stored hash
    const isValid = await bcrypt.compare(otp.trim(), user.otpHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid OTP code. Please check your email and try again." },
        { status: 400 }
      );
    }

    // OTP valid — mark email verified and clear OTP fields
    const updatedUser = await prisma.user.update({
      where: { email: cleanEmail },
      data: {
        emailVerified: true,
        otpHash: null,
        otpExpiresAt: null,
      },
      include: {
        invitations: { select: { slug: true }, take: 1 },
      },
    });

    const firstInvite = updatedUser.invitations?.[0];
    const sessionPayload = {
      id: updatedUser.id,
      email: updatedUser.email!,
      name: updatedUser.name || updatedUser.email!,
      role: updatedUser.role,
      provider: updatedUser.provider || "credentials",
      slug: firstInvite?.slug || null,
      onboarded: !!firstInvite,
    };

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
