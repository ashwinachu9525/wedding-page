import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    const envUsername = process.env.SUPER_ADMIN_USERNAME || "superadmin";
    const envPassword = process.env.SUPER_ADMIN_PASSWORD || "vivahaluxe2026";

    if (username === envUsername && password === envPassword) {
      return NextResponse.json({ success: true, message: "Super Admin Authenticated" });
    } else {
      return NextResponse.json({ success: false, error: "Invalid Company Super-Admin credentials" }, { status: 401 });
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: "Authentication server error" }, { status: 500 });
  }
}
