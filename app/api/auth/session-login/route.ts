import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "../../../../lib/prisma";
import { createSessionToken, SESSION_COOKIE, SessionPayload } from "../../../../lib/session";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

function setCookieResponse(data: object, token: string, status = 200) {
  const res = NextResponse.json(data, { status });
  res.cookies.set(SESSION_COOKIE, token, COOKIE_OPTS);
  return res;
}

// ── Welcome Email ─────────────────────────────────────────────────────────────
async function sendWelcomeEmail(email: string, name: string) {
  try {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return;
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vivahaluxe.vercel.app";
    const displayName = name || email;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: `🎉 Welcome to VivahaLuxe, ${displayName}! Your Royal Wedding Portal Awaits`,
      html: `
        <div style="font-family:serif;max-width:620px;margin:0 auto;background:#FAF8F5;color:#22201E;border:2px solid #D4AF37;">
          <div style="background:#112A21;padding:36px 40px;text-align:center;">
            <h1 style="color:#D4AF37;font-size:28px;margin:0;letter-spacing:2px;">✨ VivahaLuxe</h1>
            <p style="color:#C4B7A6;font-size:11px;letter-spacing:4px;text-transform:uppercase;margin:8px 0 0;">Royal Wedding Invitations Platform</p>
          </div>

          <div style="padding:40px;">
            <h2 style="font-size:22px;color:#112A21;margin-top:0;">Namaste, ${displayName}! 🙏</h2>
            <p style="font-size:15px;line-height:1.8;color:#55514C;">
              Welcome to <strong>VivahaLuxe</strong> — the premium platform for crafting breathtaking digital wedding invitations inspired by India's rich heritage and royal traditions.
            </p>

            <div style="background:#FFFDF9;border:1px solid #E8E2D9;border-left:4px solid #D4AF37;padding:20px 24px;margin:24px 0;border-radius:2px;">
              <h3 style="color:#112A21;margin:0 0 12px;font-size:15px;">🌟 What you can do with VivahaLuxe:</h3>
              <ul style="color:#55514C;font-size:13px;line-height:2;margin:0;padding-left:20px;">
                <li>Create your personalized wedding invitation portal</li>
                <li>Choose from 12+ exclusive royal themes (Arabic, Hindu, Christian & more)</li>
                <li>Add ceremony timeline, events, gallery & music</li>
                <li>Send personalized guest invite links</li>
                <li>Collect RSVPs in real time</li>
                <li>Upgrade to Pro for a 100% ad-free experience</li>
              </ul>
            </div>

            <div style="text-align:center;margin:32px 0;">
              <a href="${appUrl}/admin" style="background:#D4AF37;color:#1F1D1A;padding:16px 36px;text-decoration:none;font-weight:bold;font-size:13px;letter-spacing:2px;text-transform:uppercase;display:inline-block;border-radius:2px;">
                Open My Studio Dashboard →
              </a>
            </div>

            <p style="font-size:12px;color:#888178;line-height:1.7;">
              If you have any questions, reply to this email or visit our <a href="${appUrl}/support" style="color:#D4AF37;">support page</a>.
              We are honored to be part of your celebration. 💛
            </p>
          </div>

          <div style="background:#1F1D1A;padding:20px 40px;text-align:center;">
            <p style="color:#888178;font-size:11px;margin:0;">
              © 2026 VivahaLuxe Royal Platform • <a href="${appUrl}" style="color:#D4AF37;text-decoration:none;">${appUrl}</a>
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[Welcome Email] Sent to ${email}`);
  } catch (err) {
    console.warn("[Welcome Email] Failed:", err);
  }
}

// POST /api/auth/session-login
// Body: { type: "credentials" | "google" | "demo" | "super-admin", email?, password?, idToken?, googleUser? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    // ── Super Admin ──────────────────────────────────────────────────────────
    if (type === "super-admin") {
      const { username, password } = body;
      const validUser = process.env.SUPER_ADMIN_USERNAME;
      const validPass = process.env.SUPER_ADMIN_PASSWORD;
      if (!validUser || !validPass || username !== validUser || password !== validPass) {
        return NextResponse.json({ error: "Invalid super admin credentials" }, { status: 401 });
      }
      const payload: SessionPayload = { email: "superadmin@vivahaluxe.internal", name: "Super Admin", role: "SUPER_ADMIN", isSuperAdmin: true };
      const token = await createSessionToken(payload);
      return setCookieResponse({ success: true, user: payload }, token);
    }

    // ── Demo Account ─────────────────────────────────────────────────────────
    if (type === "demo") {
      const payload: SessionPayload = {
        email: "demo@vivahaluxe.com",
        name: "Demo Host Couple",
        role: "USER",
        onboarded: true,
        slug: "rahul-priya-2026",
        isDemo: true,
      };
      const token = await createSessionToken(payload);
      return setCookieResponse({ success: true, user: payload }, token);
    }

    // ── Refresh (post-onboarding: re-read from DB and reissue cookie) ────────
    if (type === "refresh") {
      const { email, slug: sessionSlug } = body;
      if (!email) {
        return NextResponse.json({ error: "Email required for refresh" }, { status: 400 });
      }
      const prisma = getPrismaClient();
      if (!prisma) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
      }
      const user = await prisma.user.findUnique({
        where: { email: email.trim().toLowerCase() },
        include: {
          invitations: {
            select: { slug: true, coupleNames: true, venueName: true, weddingDate: true },
            take: 1,
          },
        },
      });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      let firstInvite = user.invitations?.[0];

      // Orphan recovery: if invitation was saved without userId, find and link it
      if (!firstInvite && sessionSlug) {
        try {
          const orphan = await prisma.invitation.findUnique({
            where: { slug: sessionSlug },
            select: { slug: true, coupleNames: true, venueName: true, weddingDate: true, userId: true, id: true },
          });
          if (orphan && !orphan.userId) {
            await prisma.invitation.update({ where: { id: orphan.id }, data: { userId: user.id } });
            firstInvite = orphan;
          } else if (orphan?.userId === user.id) {
            firstInvite = orphan;
          }
        } catch (e) {
          console.warn("[refresh] Orphan recovery failed:", e);
        }
      }

      const onboarded = !!firstInvite;
      const payload: SessionPayload = {
        id: user.id,
        email: user.email!,
        name: user.name || user.email!,
        role: user.role,
        provider: user.provider || "credentials",
        slug: firstInvite?.slug || null,
        onboarded,
      };
      const token = await createSessionToken(payload);
      return setCookieResponse({ success: true, user: payload }, token);
    }

    // ── Google OAuth (token already verified by /api/auth/google) ─────────
    if (type === "google") {
      const { googleUser } = body;
      if (!googleUser?.email) {
        return NextResponse.json({ error: "Missing google user data" }, { status: 400 });
      }

      // Check if first login (firstLoginAt not set) — send welcome email
      const prisma = getPrismaClient();
      if (prisma && googleUser.email) {
        try {
          const existingUser = await prisma.user.findUnique({ where: { email: googleUser.email } });
          if (existingUser && !existingUser.firstLoginAt) {
            // Mark first login
            await prisma.user.update({
              where: { email: googleUser.email },
              data: { firstLoginAt: new Date(), emailVerified: true },
            });
            // Send welcome email async (non-blocking)
            sendWelcomeEmail(googleUser.email, googleUser.name || googleUser.email);
          }
        } catch (e) {
          console.warn("[First Login Check] DB error:", e);
        }
      }

      const payload: SessionPayload = {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        role: googleUser.role || "USER",
        provider: "google",
        slug: googleUser.slug || null,
        onboarded: !!googleUser.onboarded,
      };
      const token = await createSessionToken(payload);
      return setCookieResponse({ success: true, user: payload }, token);
    }

    // ── Email / Password ─────────────────────────────────────────────────────
    if (type === "credentials") {
      const { email, password } = body;
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
      }

      const cleanEmail = email.trim().toLowerCase();
      const prisma = getPrismaClient();

      if (!prisma) {
        return NextResponse.json({ error: "Database not configured" }, { status: 503 });
      }

      const user = await prisma.user.findUnique({
        where: { email: cleanEmail },
        include: {
          invitations: { select: { slug: true, coupleNames: true, venueName: true, weddingDate: true }, take: 1 },
        },
      });

      if (!user) {
        return NextResponse.json({ error: "Account not found. Please register first." }, { status: 404 });
      }

      // Compare password (bcrypt only)
      let passwordValid = false;
      try {
        passwordValid = await bcrypt.compare(password, user.password || "");
      } catch {
        // bcrypt compare failed
      }

      if (!passwordValid) {
        return NextResponse.json({ error: "Invalid password." }, { status: 401 });
      }

      if (!user.emailVerified && user.provider !== "google") {
        return NextResponse.json({ error: "EMAIL_NOT_VERIFIED", email: cleanEmail }, { status: 403 });
      }

      // First login welcome email
      if (!user.firstLoginAt) {
        try {
          await prisma.user.update({
            where: { email: cleanEmail },
            data: { firstLoginAt: new Date() },
          });
          sendWelcomeEmail(cleanEmail, user.name || cleanEmail);
        } catch (e) {
          console.warn("[First Login] DB update error:", e);
        }
      }

      const firstInvite = user.invitations?.[0];
      const onboarded = (user.invitations?.length || 0) > 0;

      const payload: SessionPayload = {
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: user.role,
        provider: user.provider || "credentials",
        slug: firstInvite?.slug || null,
        onboarded,
      };
      const token = await createSessionToken(payload);
      return setCookieResponse({ success: true, user: payload }, token);
    }

    return NextResponse.json({ error: "Invalid login type" }, { status: 400 });
  } catch (err: any) {
    console.error("[POST /api/auth/session-login]", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
