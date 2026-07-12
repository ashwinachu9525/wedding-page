import { NextRequest, NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { message, stack, path } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const prisma = getPrismaClient()!;
    const errorLog = await prisma.systemError.create({
      data: {
        message: String(message),
        stack: stack ? String(stack) : null,
        path: path ? String(path) : null,
        status: "OPEN",
      },
    });

    // Send email alert to super admin
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: "yahoo",
        auth: {
          user: emailUser,
          pass: emailPass,
        },
      });

      const mailOptions = {
        from: emailUser,
        to: "ashwinachu9525@gmail.com",
        subject: `[VivahaLuxe] Critical System Error - ${path || "Global"}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fcfbf9; border-radius: 8px;">
            <h2 style="color: #dc2626;">System Error Detected</h2>
            <p><strong>Message:</strong> ${message}</p>
            <p><strong>Path:</strong> ${path || "Unknown"}</p>
            <hr style="border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <h4 style="margin-bottom: 8px;">Stack Trace:</h4>
            <pre style="background: #1f2937; color: #f3f4f6; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${stack || "No stack trace available"}</pre>
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Log ID: ${errorLog.id}</p>
          </div>
        `,
      };

      // Don't wait for the email to send before returning response
      transporter.sendMail(mailOptions).catch(err => {
        console.error("Failed to send system error email alert:", err);
      });
    }

    return NextResponse.json({ success: true, id: errorLog.id }, { status: 201 });
  } catch (err) {
    console.error("Error logging system error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get("vivaha_admin_session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = JSON.parse(atob(sessionCookie));
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (!decoded || !decoded.isSuperAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const prisma = getPrismaClient()!;
    const errors = await prisma.systemError.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ errors });
  } catch (err) {
    console.error("Error fetching system errors:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
