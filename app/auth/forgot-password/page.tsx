"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Mail, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (!clean || !clean.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: clean }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send reset OTP.");
        setLoading(false);
        return;
      }

      setSent(true);

      // Dev mode: OTP returned directly in response
      if (data.otpCode) {
        toast.success(`[Dev] OTP: ${data.otpCode}`, { duration: 20000 });
      } else {
        toast.success(`Reset OTP sent to ${clean}. Check your inbox.`);
      }

      // Navigate to reset page after short delay
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(clean)}`);
      }, 1500);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#22201E] flex flex-col items-center justify-center p-4 text-[#FAF8F5]">
      <div className="max-w-md w-full bg-[#1F1D1A] border border-white/10 p-8 sm:p-10 rounded-sm shadow-2xl space-y-6">

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <KeyRound className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#C4B7A6]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>VivahaLuxe Authentication</span>
          </div>
          <h1 className="font-serif text-3xl font-light">Forgot Password</h1>
          <p className="text-xs text-[#C4B7A6] leading-relaxed">
            Enter your registered email address. We&apos;ll send a 6-digit OTP to reset your password.
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1 font-semibold">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888178]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/5 border border-white/15 pl-10 pr-4 py-3 text-sm rounded-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-60 text-[#1F1D1A] py-4 rounded-xs text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>{loading ? "Sending OTP..." : "Send Reset OTP"}</span>
            </button>
          </form>
        ) : (
          <div className="py-4 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
              <Mail className="w-7 h-7" />
            </div>
            <p className="text-sm text-emerald-300 font-semibold">OTP sent!</p>
            <p className="text-xs text-[#C4B7A6]">Redirecting to reset page...</p>
          </div>
        )}

        <div className="text-center pt-2 border-t border-white/10 space-y-2">
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
