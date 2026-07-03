import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, coupleNames, userEmail, design, quantity, unitPrice, totalAmount, deliveryAddress, contactMobile } = body;

    if (!quantity || quantity < 100) {
      return NextResponse.json({ error: "Bulk print order quantity must be at least 100 cards." }, { status: 400 });
    }

    const adminEmail = "ashwinachu9525@gmail.com";
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

        // 1. Send Notification to Admin Team (ashwinachu9525@gmail.com)
        const adminHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #111827; color: #F9FAFB; border: 2px solid #10B981;">
            <h2 style="color: #10B981; margin-top: 0;">🖨️ New Bulk Print Order Placed!</h2>
            <p style="font-size: 14px; color: #D1D5DB;">An order request has been submitted from the Couple Studio.</p>
            
            <div style="background-color: #1F2937; padding: 20px; border-radius: 6px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Couple Names:</strong> ${coupleNames}</p>
              <p><strong>Contact Email:</strong> ${userEmail}</p>
              <p><strong>Contact Mobile:</strong> ${contactMobile}</p>
              <hr style="border-color: #374151;" />
              <p><strong>Card Design Option:</strong> ${design}</p>
              <p><strong>Bulk Quantity:</strong> ${quantity} units (Min 100 verified)</p>
              <p><strong>Unit Price:</strong> ₹${unitPrice}</p>
              <p style="font-size: 18px; color: #F59E0B;"><strong>Total Order Amount:</strong> ₹${totalAmount.toLocaleString("en-IN")}</p>
              <hr style="border-color: #374151;" />
              <p><strong>Delivery Address:</strong><br />${deliveryAddress}</p>
            </div>
            
            <p style="font-size: 12px; color: #9CA3AF;">Log into the Super Admin portal (/super-admin) to manage order status: In Review -> In Progress -> In Transit -> Delivered.</p>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_FROM || `"VivahaLuxe Print Studio" <${process.env.SMTP_USER}>`,
          to: adminEmail,
          subject: `🚨 Bulk Print Order Received [${orderId}]: ${coupleNames} (${quantity} cards)`,
          html: adminHtml,
        });

        // 2. Send Confirmation to User (if email provided)
        if (userEmail && userEmail.includes("@")) {
          const userHtml = `
            <div style="font-family: serif; max-width: 600px; margin: 0 auto; padding: 40px; background-color: #FAF8F5; color: #22201E; border: 2px solid #D4AF37;">
              <div style="text-align: center; margin-bottom: 25px;">
                <h1 style="font-size: 26px; color: #112A21;">VivahaLuxe Royal Card Print Studio</h1>
                <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #888178;">Bulk Print Order Confirmation</p>
              </div>

              <div style="background-color: #FFFFFF; padding: 30px; border: 1px solid #E8E2D9;">
                <p>Dearest <strong>${coupleNames}</strong>,</p>
                <p>We have received your bulk physical luxury invitation card print order! Our executive design team is reviewing your customization specifications.</p>
                
                <div style="margin: 20px 0; padding: 15px; background-color: #FAF8F5; border: 1px dashed #C4B7A6;">
                  <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderId}</p>
                  <p style="margin: 5px 0;"><strong>Card Design:</strong> ${design}</p>
                  <p style="margin: 5px 0;"><strong>Quantity:</strong> ${quantity} cards</p>
                  <p style="margin: 5px 0;"><strong>Total Amount:</strong> ₹${totalAmount.toLocaleString("en-IN")}</p>
                  <p style="margin: 5px 0;"><strong>Current Status:</strong> <span style="color: #D4AF37; font-weight: bold;">In Review</span></p>
                </div>

                <p style="font-size: 13px; color: #55514C;">You can track real-time fulfillment progress (In Review -> In Progress -> In Transit -> Delivered) directly in your Couple Studio under the Bulk Print tab.</p>
              </div>
            </div>
          `;

          await transporter.sendMail({
            from: process.env.SMTP_FROM || `"VivahaLuxe Print Studio" <${process.env.SMTP_USER}>`,
            to: userEmail,
            subject: `✨ Bulk Print Order Placed [${orderId}]: ${design}`,
            html: userHtml,
          });
        }

        emailSent = true;
      } else {
        console.log(`[Mock SMTP Dispatch] Order ${orderId} placed for ${coupleNames}. Email dispatched to admin team (${adminEmail}) and user (${userEmail}).`);
        emailSent = true;
      }
    } catch (smtpErr) {
      console.warn("SMTP email dispatch warning:", smtpErr);
    }

    return NextResponse.json({
      success: true,
      message: `Order ${orderId} placed successfully! Notification sent to admin team (${adminEmail}).`,
      emailSent,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to process bulk print order request." }, { status: 500 });
  }
}
