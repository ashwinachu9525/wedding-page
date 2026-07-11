"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Lock, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 6) {
      toast.error("Please enter the full 6-digit OTP from your email.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otp.trim(), newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Password reset failed.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      toast.success("Password reset successfully! Redirecting to sign in...");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch {
      toast.error("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1F1D1A] text-[#FAF8F5] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#2A2723] border border-[#D4AF37]/40 p-8 sm:p-10 rounded-sm shadow-2xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <KeyRound className="w-7 h-7" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reset Your Password</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-white">Enter OTP & New Password</h1>
          <p className="text-xs text-[#C4B7A6] leading-relaxed">
            Check your email <span className="text-white font-semibold">{email}</span> for the 6-digit OTP.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* OTP Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2 font-bold text-center">
                6-Digit OTP from Email
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="• • • • • •"
                className="w-full bg-black/60 border-2 border-[#D4AF37]/50 px-4 py-4 text-2xl text-center tracking-[0.5em] font-mono font-bold rounded-xs text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37] transition-all"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1 font-semibold">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888178]" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full bg-black/60 border border-white/20 pl-10 pr-4 py-3 text-sm rounded-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1 font-semibold">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888178]" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full bg-black/60 border border-white/20 pl-10 pr-4 py-3 text-sm rounded-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-50 text-[#1F1D1A] py-4 rounded-xs text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-xl flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </button>
          </form>
        ) : (
          <div className="py-6 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="font-serif text-2xl text-white">Password Reset Complete!</h2>
              <p className="text-xs text-emerald-300 mt-1">Redirecting to sign in...</p>
            </div>
          </div>
        )}

        <div className="text-center pt-2 border-t border-white/10">
          <Link
            href="/auth/login"
            className="text-xs text-[#888178] hover:text-[#C4B7A6] flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1D1A] text-white flex items-center justify-center">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
