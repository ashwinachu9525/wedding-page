import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import { getSessionFromRequest, SESSION_COOKIE } from "@/lib/session";

export async function POST(req: NextRequest) {
  try {
    // Auth check — only the logged-in user can delete their own account
    const session = await getSessionFromRequest(req);
    if (!session || !session.email) {
      return NextResponse.json({ error: "Unauthorized. Please sign in first." }, { status: 401 });
    }

    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Ensure the session user can only delete their own account (unless super admin)
    if (!session.isSuperAdmin && session.email.toLowerCase() !== cleanEmail) {
      return NextResponse.json({ error: "Forbidden. You can only delete your own account." }, { status: 403 });
    }

    // Do not allow deleting the demo account
    if (cleanEmail === "demo@vivahaluxe.com") {
      return NextResponse.json({ error: "Cannot delete the evaluation showcase account" }, { status: 403 });
    }

    const prisma = getPrismaClient();
    if (prisma) {
      const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Cascades to invitations and RSVPs via schema onDelete: Cascade
      await prisma.user.delete({ where: { id: user.id } });

      // Clear the session cookie
      const res = NextResponse.json({ success: true, message: "Account and associated data deleted successfully." });
      res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", path: "/", maxAge: 0 });
      return res;
    }
  } catch (err: any) {
    console.error("Delete account error:", err);
    return NextResponse.json({ error: "Internal server error deleting account" }, { status: 500 });
  }

  return NextResponse.json({ success: true, localOnly: true });
}
