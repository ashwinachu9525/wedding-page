import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrismaClient } from "@/lib/prisma";
import { createSessionToken, SESSION_COOKIE } from "@/lib/session";
import { verifyAndConsumeOtp } from "@/lib/otp-store";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otpTrimmed = otp.trim();
    const prisma = getPrismaClient();

    // ── DB path (primary) ────────────────────────────────────────────────────
    if (prisma) {
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });

      if (!user) {
        return NextResponse.json(
          { error: "No account found for this email. Please register first." },
          { status: 400 }
        );
      }

      if (!user.otpHash || !user.otpExpiresAt) {
        // No DB OTP — try in-memory fallback (dev mode without SMTP)
        const memResult = verifyAndConsumeOtp(cleanEmail, otpTrimmed);
        if (memResult !== "valid") {
          return NextResponse.json(
            { error: "No pending verification found. Please click Resend OTP." },
            { status: 400 }
          );
        }
      } else {
        // Check expiry
        if (new Date() > user.otpExpiresAt) {
          await prisma.user.update({
            where: { email: cleanEmail },
            data: { otpHash: null, otpExpiresAt: null },
          });
          return NextResponse.json(
            { error: "OTP has expired. Please click Resend to get a new code." },
            { status: 400 }
          );
        }

        // Verify hash
        const isValid = await bcrypt.compare(otpTrimmed, user.otpHash);
        if (!isValid) {
          return NextResponse.json(
            { error: "Invalid OTP code. Please check your email and try again." },
            { status: 400 }
          );
        }
      }

      // Mark verified and clear OTP
      const updatedUser = await prisma.user.update({
        where: { email: cleanEmail },
        data: { emailVerified: true, otpHash: null, otpExpiresAt: null },
        include: { invitations: { select: { slug: true }, take: 1 } },
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

      const token = await createSessionToken(sessionPayload);
      const res = NextResponse.json({ success: true, user: sessionPayload });
      res.cookies.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return res;
    }

    // ── Fallback: no DB — use in-memory store (dev only) ─────────────────────
    const memResult = verifyAndConsumeOtp(cleanEmail, otpTrimmed);
    if (memResult === "not_found") {
      return NextResponse.json(
        { error: "No pending verification. Please register again." },
        { status: 400 }
      );
    }
    if (memResult === "expired") {
      return NextResponse.json(
        { error: "OTP expired. Please click Resend." },
        { status: 400 }
      );
    }
    if (memResult === "invalid") {
      return NextResponse.json(
        { error: "Invalid OTP code." },
        { status: 400 }
      );
    }

    // No DB — issue a minimal session
    const sessionPayload = {
      email: cleanEmail,
      role: "USER",
      provider: "credentials",
      onboarded: false,
    };
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
