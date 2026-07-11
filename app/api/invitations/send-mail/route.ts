import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { logEmail } from "@/lib/email-logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { guestEmail, guestName, coupleNames, weddingDate, venue, note, inviteUrl, theme } = body;

    if (!guestEmail) {
      return NextResponse.json({ error: "Guest email address is required" }, { status: 400 });
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
            <div style="text-align: center; margin-bottom: 25px;">
              <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #888178; margin: 0;">Royal Wedding Invitation</p>
              <h1 style="font-size: 30px; margin: 10px 0; color: #112A21;">${coupleNames || "Royal Couple"}</h1>
              <div style="width: 50px; height: 1px; background-color: #D4AF37; margin: 15px auto;"></div>
            </div>

            <div style="background-color: #FFFFFF; padding: 30px; border: 1px solid #E8E2D9; text-align: center;">
              <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #888178; margin-bottom: 5px;">Inviting</p>
              <h2 style="font-size: 22px; margin-top: 0; color: #22201E;">Dearest ${guestName || "Honored Guest"},</h2>
              
              <p style="font-size: 15px; line-height: 1.7; color: #55514C; font-style: italic; margin: 25px 0;">
                "${note || "We request the honor of your presence at our royal wedding celebration."}"
              </p>

              <div style="margin: 25px 0; padding: 15px; background-color: #FAF8F5; border: 1px dashed #C4B7A6;">
                <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; margin: 0; color: #112A21;">${weddingDate || "2026"}</p>
                <p style="font-size: 12px; color: #66625D; margin: 5px 0 0 0;">📍 ${venue || "India"}</p>
              </div>

              <div style="margin: 30px 0;">
                <a href="${inviteUrl}" style="background-color: #112A21; color: #FAF8F5; padding: 14px 32px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; border-radius: 2px; display: inline-block; border: 1px solid #D4AF37;">
                  Tap to Open Interactive Invitation Card &amp; RSVP
                </a>
              </div>
              <p style="font-size: 11px; color: #888178;">Direct URL: <a href="${inviteUrl}" style="color: #112A21;">${inviteUrl}</a></p>
            </div>

            <div style="text-align: center; margin-top: 25px; font-size: 11px; color: #A09A90;">
              Sent with love from ${coupleNames} via VivahaLuxe Platform • CockroachDB Prisma Cloud
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"VivahaLuxe Royal Invites" <${process.env.SMTP_USER}>`,
          to: guestEmail,
          subject: `✨ Royal Wedding Invitation: ${coupleNames}`,
          html: htmlContent,
        });
        emailSent = true;
        logEmail({ to: guestEmail, subject: `✨ Royal Wedding Invitation: ${coupleNames}`, source: "invitation", status: "SUCCESS" });
      } else {
        console.log("[SMTP Invite Notice] Simulated SMTP email sent to", guestEmail, "with URL:", inviteUrl);
      }
    } catch (smtpErr) {
      console.warn("SMTP email dispatch failed (check .env):", smtpErr);
        logEmail({ to: guestEmail, subject: `✨ Royal Wedding Invitation: ${coupleNames}`, source: "invitation", status: "FAILED", error: String(smtpErr) });
    }

    return NextResponse.json({
      success: true,
      message: `Invitation card sent to ${guestEmail}!`,
      emailSent,
    });
  } catch (e) {
    return NextResponse.json({ error: "Failed to dispatch email invitation" }, { status: 500 });
  }
}
