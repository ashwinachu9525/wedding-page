import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, coupleNames, senderName, itemTitle, razorpayKeyId } = body;

    const keyId = process.env.RAZORPAY_KEY_ID || razorpayKeyId || "";
    const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // If we have a real key ID (or one starting with rzp_live_) AND secret on server, create official Razorpay order
    if (keyId && keySecret && !keyId.includes("test_1DP5mmOlF5G5ag")) {
      const razorpay = new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      });

      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // paise
        currency: "INR",
        receipt: `vl_gift_${Date.now()}`.slice(0, 40),
        notes: {
          coupleNames: coupleNames || "VivahaLuxe Couple",
          senderName: senderName || "Honored Guest",
          itemTitle: itemTitle || "Wedding Gift Shagun",
          purpose: "Wedding Registry Gift",
        },
      });

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: keyId,
      });
    } else {
      // Fallback for test mode keys or when RAZORPAY_KEY_SECRET is not set in environment
      const mockOrderId = `order_mock_gift_${crypto.randomBytes(6).toString("hex")}`;
      return NextResponse.json({
        success: true,
        orderId: mockOrderId,
        amount: Math.round(amount * 100),
        currency: "INR",
        keyId: keyId || "rzp_test_1DP5mmOlF5G5ag",
        isMock: true,
      });
    }
  } catch (err: any) {
    console.error("[Razorpay Gift Order Creation Error]:", err?.message || err);
    const mockOrderId = `order_mock_gift_${crypto.randomBytes(6).toString("hex")}`;
    return NextResponse.json({
      success: true,
      orderId: mockOrderId,
      amount: 110100,
      currency: "INR",
      isMock: true,
      error: err?.message,
    });
  }
}
