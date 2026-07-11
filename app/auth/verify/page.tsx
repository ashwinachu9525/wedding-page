"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, Sparkles, ShieldCheck, RefreshCw, Lock } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
  const otpFromUrl = searchParams.get("otp") || "";

  const [otpInput, setOtpInput] = useState("");
  const [expectedOtp, setExpectedOtp] = useState(otpFromUrl);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = otpInput.trim();
    if (!trimmed || trimmed.length < 6) {
      toast.error("Please enter the full 6-digit verification code sent to your email.");
      return;
    }
    if (!email) {
      toast.error("No email address found. Please restart registration.");
      router.replace("/auth/register");
      return;
    }

    setVerifying(true);

    // Validate against expected OTP (only populated in dev when SMTP is off)
    if (expectedOtp && trimmed !== expectedOtp) {
      setVerifying(false);
      toast.error(`Invalid OTP code. Please check your email inbox for ${email}.`);
      return;
    }

    // Mark the user's email as verified on the server and create session
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setVerifying(false);
        toast.error(data.error || "OTP verification failed. Please try again.");
        return;
      }

      setVerifying(false);
      setVerified(true);
      toast.success("Email verified! Opening celebration setup wizard...");
      setTimeout(() => router.push("/admin/onboarding"), 1200);
    } catch (err) {
      setVerifying(false);
      toast.error("Network error during verification. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("No email found to resend verification code.");
      return;
    }
    setResending(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: "Celebration Host" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.otpCode) {
          setExpectedOtp(data.otpCode);
          toast.success(`[Dev] New OTP: ${data.otpCode}`);
        } else {
          toast.success(`New 6-digit code sent to ${email}!`);
        }
      } else {
        toast.error(data.error || "Could not resend OTP code.");
      }
    } catch (err) {
      toast.error("Network error while requesting new OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1D1A] text-[#FAF8F5] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-md w-full bg-[#2A2723] border border-[#D4AF37]/40 p-8 sm:p-10 rounded-sm shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step 2: Email Verification</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-white">Enter Email OTP</h1>
          <p className="text-xs text-[#C4B7A6] leading-relaxed">
            We sent a 6-digit verification code to{" "}
            <span className="text-white font-semibold">{email || "your email"}</span>. Enter it below to continue.
          </p>
        </div>

        {!verified ? (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2 font-bold text-center">
                6-Digit One-Time Password
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="• • • • • •"
                className="w-full bg-black/60 border-2 border-[#D4AF37]/50 px-4 py-4 text-2xl text-center tracking-[0.5em] font-mono font-bold rounded-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={verifying || otpInput.length < 6}
              className="w-full bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-50 text-[#1F1D1A] py-4 rounded-xs text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{verifying ? "Verifying Code..." : "Verify Email & Start Onboarding"}</span>
            </button>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#888178]">Didn&apos;t receive code?</span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-[#D4AF37] hover:underline font-semibold flex items-center gap-1"
              >
                <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                <span>{resending ? "Resending..." : "Resend OTP"}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="py-6 text-center space-y-5 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-800 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-white">Verification Complete!</h2>
              <p className="text-xs text-emerald-300 mt-1">Redirecting to your celebration setup wizard...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1D1A] text-white flex items-center justify-center">Loading Verification...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
