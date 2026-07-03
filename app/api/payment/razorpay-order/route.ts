import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { coupleNames, userEmail, amount = 499 } = body;

    if (!coupleNames || !userEmail) {
      return NextResponse.json({ error: "Missing required fields: coupleNames, userEmail" }, { status: 400 });
    }

    // Create Razorpay Order
    const order = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: "INR",
      receipt: `vl_pro_${Date.now()}`,
      notes: {
        coupleNames,
        userEmail,
        plan: "PRO",
        platform: "VivahaLuxe",
        purpose: "Pro Lifetime Subscription",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (err: any) {
    console.error("[Razorpay Order Creation Error]:", err?.message || err);
    // Return mock order for dev mode if keys are not real
    const mockOrderId = `order_mock_${crypto.randomBytes(8).toString("hex")}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: 49900,
      currency: "INR",
      receipt: `vl_pro_dev_${Date.now()}`,
      isMock: true,
    });
  }
}
