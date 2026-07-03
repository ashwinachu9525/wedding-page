import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    // Generate 6-digit verification OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

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
              VivahaLuxe Platform Security • CockroachDB Prisma Cloud Engine
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"VivahaLuxe Platform" <${process.env.SMTP_USER}>`,
          to: email,
          subject: `✨ Your VivahaLuxe Verification OTP: ${otpCode}`,
          html: htmlContent,
        });
        emailSent = true;
      } else {
        console.log(`[SMTP Verification Notice] Simulated 6-digit OTP sent to ${email}: ${otpCode}`);
      }
    } catch (smtpErr) {
      console.warn("SMTP email dispatch failed:", smtpErr);
    }

    return NextResponse.json({
      success: true,
      message: "Verification OTP dispatched!",
      otpCode,
      emailSent,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to dispatch verification OTP" }, { status: 500 });
  }
}
