"use client";

import { useCallback } from "react";
import { toast } from "sonner";

interface UseRazorpayOptions {
  coupleNames: string;
  userEmail: string;
  onSuccess: (paymentRecord: any) => void;
  onFailure?: (error: any) => void;
}

export function useRazorpay({ coupleNames, userEmail, onSuccess, onFailure }: UseRazorpayOptions) {
  const loadScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-sdk")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-sdk";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const initiatePayment = useCallback(async () => {
    const loaded = await loadScript();
    if (!loaded) {
      toast.error("Failed to load Razorpay. Check your internet connection.");
      return;
    }

    try {
      // Step 1: Create Razorpay Order
      const orderRes = await fetch("/api/payment/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coupleNames, userEmail, amount: 499 }),
      });
      const orderData = await orderRes.json();

      if (!orderData.success || !orderData.orderId) {
        toast.error("Could not initiate payment. Please try again.");
        return;
      }

      const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
      const isMock = orderData.isMock || !keyId || keyId.includes("YOUR_KEY");

      // Step 2: For mock/dev mode — simulate payment instantly
      if (isMock) {
        toast.info("⚙️ Dev Mode: Simulating Razorpay payment...", { duration: 1500 });
        await new Promise((r) => setTimeout(r, 1500));

        const mockPaymentId = `pay_mock_${Math.random().toString(36).slice(2, 12)}`;
        const verifyRes = await fetch("/api/payment/razorpay-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: mockPaymentId,
            razorpay_signature: "mock_signature",
            coupleNames,
            userEmail,
            amount: 499,
            paymentMethod: "Mock / Dev",
            isMock: true,
          }),
        });
        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          onSuccess(verifyData.paymentRecord);
        } else {
          toast.error("Mock payment verification failed.");
          onFailure?.(verifyData.error);
        }
        return;
      }

      // Step 3: Real Razorpay Checkout
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VivahaLuxe",
        description: "Pro Lifetime Subscription (₹499) — Ad-Free Wedding Portal",
        order_id: orderData.orderId,
        image: "/favicon.ico",
        prefill: {
          name: coupleNames,
          email: userEmail,
        },
        theme: { color: "#662D91" },
        modal: {
          ondismiss: () => {
            toast.warning("Payment cancelled. Your Pro request was not submitted.");
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch("/api/payment/razorpay-verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                coupleNames,
                userEmail,
                amount: 499,
                paymentMethod: "Razorpay",
                isMock: false,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              onSuccess(verifyData.paymentRecord);
            } else {
              toast.error("Payment received but verification failed. Contact support.");
              onFailure?.(verifyData.error);
            }
          } catch (err) {
            toast.error("Post-payment verification error. Please contact support.");
            onFailure?.(err);
          }
        },
      };

      // @ts-ignore — Razorpay is loaded from CDN script
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        toast.error(`Payment failed: ${resp.error?.description || "Unknown error"}`);
        onFailure?.(resp.error);
      });
      rzp.open();
    } catch (err: any) {
      toast.error("Payment initiation error: " + (err?.message || "Unknown error"));
      onFailure?.(err);
    }
  }, [coupleNames, userEmail, onSuccess, onFailure]);

  return { initiatePayment };
}
