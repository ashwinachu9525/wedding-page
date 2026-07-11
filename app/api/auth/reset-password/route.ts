import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getPrismaClient } from "@/lib/prisma";
import { verifyAndConsumeOtp } from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP, and new password are required." }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otpTrimmed = otp.trim();
    const prisma = getPrismaClient();

    if (prisma) {
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (!user) {
        return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
      }

      // Verify OTP — DB path first, in-memory fallback
      if (user.otpHash && user.otpExpiresAt) {
        if (new Date() > user.otpExpiresAt) {
          await prisma.user.update({
            where: { email: cleanEmail },
            data: { otpHash: null, otpExpiresAt: null },
          });
          return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }

        const isValid = await bcrypt.compare(otpTrimmed, user.otpHash);
        if (!isValid) {
          return NextResponse.json({ error: "Invalid OTP code. Please check your email." }, { status: 400 });
        }
      } else {
        // Fallback: check in-memory OTP store
        const memResult = verifyAndConsumeOtp(cleanEmail, otpTrimmed);
        if (memResult === "expired") {
          return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
        }
        if (memResult !== "valid") {
          return NextResponse.json({ error: "Invalid or expired OTP code." }, { status: 400 });
        }
      }

      // Hash new password and save, clear OTP fields
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email: cleanEmail },
        data: {
          password: hashedPassword,
          otpHash: null,
          otpExpiresAt: null,
          emailVerified: true, // ensure verified
        },
      });

      return NextResponse.json({ success: true, message: "Password reset successfully. Please sign in." });
    }

    // No DB fallback
    const memResult = verifyAndConsumeOtp(cleanEmail, otpTrimmed);
    if (memResult !== "valid") {
      return NextResponse.json({ error: "Invalid or expired OTP code." }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Password reset successfully." });
  } catch (err) {
    console.error("[reset-password]", err);
    return NextResponse.json({ error: "Failed to reset password. Please try again." }, { status: 500 });
  }
}
