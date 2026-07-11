import { NextResponse } from "next/server";
import { getPrismaClient } from "../../../../lib/prisma";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing idToken" }, { status: 400 });

    // Verify token using Google Auth Library
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });

    const email = payload.email as string | undefined;
    const name = (payload.name as string) || (payload.given_name as string) || null;
    const picture = (payload.picture as string) || null;
    const email_verified = payload.email_verified === "true" || payload.email_verified === true;

    if (!email) return NextResponse.json({ error: "Google token did not include an email" }, { status: 400 });

    const prisma = getPrismaClient();
    if (!prisma) {
      // No DB configured – return verified info only
      return NextResponse.json({ success: true, user: { email, name, image: picture, provider: "google", email_verified }, dbSaved: false });
    }

    // Generate a unique username from email local part
    let base = (email.split("@")[0] || "user").replace(/[^a-z0-9\-]/gi, "").toLowerCase();
    if (!base) base = `user${Date.now()}`;
    let username = base;
    for (let i = 0; i < 6; i++) {
      const existing = await prisma.user.findUnique({ where: { username } as any });
      if (!existing) break;
      username = `${base}${Math.floor(Math.random() * 9000 + 1000)}`;
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name: name || undefined,
        image: picture || undefined,
        provider: "google",
        updatedAt: new Date(),
      },
      create: {
        email,
        name: name || undefined,
        username,
        provider: "google",
        image: picture || undefined,
      },
      include: {
        invitations: {
          select: {
            id: true,
            slug: true,
            coupleNames: true,
            venueName: true,
            weddingDate: true,
          },
        },
      },
    });

    const onboarded = (user.invitations?.length || 0) > 0;
    const firstInvite = user.invitations?.[0];

    const userWithOnboarded = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      status: user.status,
      provider: user.provider,
      image: user.image,
      onboarded,
      coupleNames: firstInvite?.coupleNames || null,
      slug: firstInvite?.slug || null,
      venueName: firstInvite?.venueName || null,
      weddingDate: firstInvite?.weddingDate || null,
    };

    return NextResponse.json({ success: true, user: userWithOnboarded, dbSaved: true });
  } catch (err) {
    console.error("/api/auth/google error:", err);
    return NextResponse.json({ error: "Internal server error verifying Google token" }, { status: 500 });
  }
}
