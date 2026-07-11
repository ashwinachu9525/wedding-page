import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { getPrismaClient } from "@/lib/prisma";
import { storeOtp } from "@/lib/otp-store";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email address is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const prisma = getPrismaClient();

    // Always return success to prevent email enumeration
    if (prisma) {
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (!user) {
        // Don't reveal whether email exists
        return NextResponse.json({ success: true, emailSent: false });
      }

      if (user.provider === "google") {
        return NextResponse.json(
          { error: "This account uses Google Sign-In. Please sign in with Google instead." },
          { status: 400 }
        );
      }

      // Generate OTP and store hashed in DB
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      storeOtp(cleanEmail, otpCode);

      const hashedOtp = await bcrypt.hash(otpCode, 8);
      const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min

      await prisma.user.update({
        where: { email: cleanEmail },
        data: { otpHash: hashedOtp, otpExpiresAt: otpExpiry },
      });

      // Send email
      let emailSent = false;
      try {
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
          const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 465),
            secure: Number(process.env.SMTP_PORT) === 465,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
          });

          await transporter.sendMail({
            from: process.env.SMTP_FROM || `"VivahaLuxe" <${process.env.SMTP_USER}>`,
            to: cleanEmail,
            subject: `🔐 VivahaLuxe Password Reset OTP: ${otpCode}`,
            html: `
              <div style="font-family:serif;max-width:600px;margin:0 auto;padding:40px;background:#FAF8F5;color:#22201E;border:2px solid #D4AF37;">
                <div style="text-align:center;margin-bottom:24px;">
                  <h1 style="font-size:26px;margin:0;color:#112A21;">✨ VivahaLuxe</h1>
                  <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#888178;">Password Reset Request</p>
                </div>
                <div style="background:#fff;padding:30px;border:1px solid #E8E2D9;text-align:center;">
                  <h2 style="margin-top:0;font-size:20px;">Reset Your Password</h2>
                  <p style="font-size:13px;color:#55514C;line-height:1.7;">
                    We received a request to reset the password for your VivahaLuxe account (<strong>${cleanEmail}</strong>).
                    Use the OTP below — it expires in <strong>15 minutes</strong>.
                  </p>
                  <div style="margin:28px 0;">
                    <span style="background:#112A21;color:#D4AF37;padding:16px 40px;font-weight:bold;font-size:30px;letter-spacing:10px;border-radius:4px;display:inline-block;font-family:monospace;">
                      ${otpCode}
                    </span>
                  </div>
                  <p style="font-size:12px;color:#888178;">If you did not request this, you can safely ignore this email. Your password will not be changed.</p>
                </div>
                <p style="text-align:center;margin-top:16px;font-size:11px;color:#A09A90;">VivahaLuxe Platform Security</p>
              </div>
            `,
          });
          emailSent = true;
        } else {
          console.log(`[SMTP Dev] Password reset OTP for ${cleanEmail}: ${otpCode}`);
        }
      } catch (smtpErr) {
        console.warn("[forgot-password] SMTP failed:", smtpErr);
      }

      return NextResponse.json({
        success: true,
        emailSent,
        // Expose OTP only in dev when SMTP is not configured
        ...(emailSent ? {} : { otpCode }),
      });
    }

    // No DB — fallback dev mode
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    storeOtp(cleanEmail, otpCode);
    console.log(`[Dev no-DB] Password reset OTP for ${cleanEmail}: ${otpCode}`);
    return NextResponse.json({ success: true, emailSent: false, otpCode });
  } catch (err) {
    console.error("[forgot-password]", err);
    return NextResponse.json({ error: "Failed to send reset OTP. Please try again." }, { status: 500 });
  }
}
