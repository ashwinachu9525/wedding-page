import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { getPrismaClient } from "@/lib/prisma";
import { storeOtp } from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password, username } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Generate 6-digit verification OTP and store server-side
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    storeOtp(cleanEmail, otpCode);

    // Upsert the user in the DB (create if new, update OTP fields if resending)
    const prisma = getPrismaClient();
    if (prisma && password) {
      try {
        const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
        if (existing && existing.emailVerified) {
          return NextResponse.json({ error: "An account with this email already exists. Please sign in." }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedOtp = await bcrypt.hash(otpCode, 8); // lower rounds — OTPs are short-lived
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        // Derive a unique username
        let base = (username || cleanEmail.split("@")[0]).replace(/[^a-z0-9]/gi, "").toLowerCase() || "user";
        let finalUsername = base;
        if (!existing) {
          for (let i = 0; i < 6; i++) {
            const taken = await prisma.user.findUnique({ where: { username: finalUsername } as any });
            if (!taken) break;
            finalUsername = `${base}${Math.floor(1000 + Math.random() * 9000)}`;
          }
        }

        await prisma.user.upsert({
          where: { email: cleanEmail },
          update: {
            name: name || undefined,
            password: hashedPassword,
            otpHash: hashedOtp,
            otpExpiresAt: otpExpiry,
          },
          create: {
            email: cleanEmail,
            name: name || undefined,
            password: hashedPassword,
            username: existing?.username || finalUsername,
            provider: "credentials",
            emailVerified: false,
            otpHash: hashedOtp,
            otpExpiresAt: otpExpiry,
          },
        });
      } catch (dbErr) {
        console.warn("[Register] DB upsert failed:", dbErr);
      }
    } else if (prisma && !password) {
      // Resend OTP — just update the OTP fields
      try {
        const hashedOtp = await bcrypt.hash(otpCode, 8);
        const otpExpiry = new Date(Date.now() + 15 * 60 * 1000);
        await prisma.user.update({
          where: { email: cleanEmail },
          data: { otpHash: hashedOtp, otpExpiresAt: otpExpiry },
        });
      } catch (dbErr) {
        console.warn("[Register] OTP update failed:", dbErr);
      }
    }

    let emailSent = false;
    try {
      if (process.env.SMTP_HOST && process.env.SMTP_USER && !process.env.SMTP_PASS?.includes("your-app-password")) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const htmlContent = `
          <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FAF8F5; color: #22201E; border: 2px solid #D4AF37;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="font-size: 28px; margin: 0; color: #112A21;">✨ VivahaLuxe Royal Invitations ✨</h1>
              <p style="font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #888178;">Email Verification Protocol</p>
            </div>
            <div style="background-color: #FFFFFF; padding: 30px; border: 1px solid #E8E2D9; text-align: center;">
              <h2 style="font-size: 22px; margin-top: 0;">Namaste, ${name || "Celebration Host"}!</h2>
              <p style="font-size: 14px; line-height: 1.6; color: #55514C;">
                Please use the following 6-digit One-Time Password (OTP) to verify your email address and continue to your celebration setup wizard:
              </p>
              <div style="margin: 30px 0;">
                <span style="background-color: #112A21; color: #D4AF37; padding: 16px 36px; font-weight: bold; font-size: 28px; letter-spacing: 8px; border-radius: 4px; display: inline-block; font-family: monospace;">
                  ${otpCode}
                </span>
              </div>
              <p style="font-size: 12px; color: #888178;">This OTP expires in 15 minutes. Do not share this code with anyone.</p>
            </div>
            <div style="text-align: center; margin-top: 20px; font-size: 11px; color: #A09A90;">
              VivahaLuxe Platform Security
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"VivahaLuxe Platform" <${process.env.SMTP_USER}>`,
          to: cleanEmail,
          subject: `✨ Your VivahaLuxe Verification OTP: ${otpCode}`,
          html: htmlContent,
        });
        emailSent = true;
      } else {
        console.log(`[SMTP Dev] OTP for ${cleanEmail}: ${otpCode}`);
      }
    } catch (smtpErr) {
      console.warn("SMTP email dispatch failed:", smtpErr);
    }

    return NextResponse.json({
      success: true,
      message: "Verification OTP dispatched!",
      // Only expose OTP in dev when email not sent — never in production
      ...(emailSent ? {} : { otpCode }),
      emailSent,
    });
  } catch (e) {
    console.error("[Register error]", e);
    return NextResponse.json({ error: "Failed to dispatch verification OTP" }, { status: 500 });
  }
}
