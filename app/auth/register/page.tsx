"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, UserPlus, ArrowLeft, Heart, Mail, Lock, CheckCircle2, Send } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "sent">("form");
  const [verificationUrl, setVerificationUrl] = useState("");

  // Simple Account credentials
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error("Please provide your full name, email address, and password.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUsersStr = localStorage.getItem("vivaha_registered_users") || "{}";
    let existingUsers: Record<string, any> = {};
    try {
      existingUsers = JSON.parse(existingUsersStr);
    } catch (err) {}

    if (existingUsers[cleanEmail] && existingUsers[cleanEmail].verified) {
      toast.error("An account with this email already exists! Please sign in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          password,
          name: fullName,
          username: cleanEmail.split("@")[0].replace(/[^a-z0-9]/g, ""),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const newUserObj = {
          name: fullName,
          email: cleanEmail,
          password: password,
          role: "USER",
          provider: "credentials",
          onboarded: false,
          verified: false,
        };

        existingUsers[cleanEmail] = newUserObj;
        localStorage.setItem("vivaha_registered_users", JSON.stringify(existingUsers));

        sessionStorage.setItem("vivaha_user", JSON.stringify(newUserObj));
        if (data.otpCode) {
          sessionStorage.setItem("vivaha_otp", data.otpCode);
        }
        if (!data.emailSent) {
          toast.success(`[Demo Simulator] Your 6-digit OTP code is: ${data.otpCode}`);
        } else {
          toast.success("Registration complete! Please enter the 6-digit OTP code sent to your email.");
        }
        router.push(`/auth/verify?email=${encodeURIComponent(cleanEmail)}`);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Failed to connect to registration endpoint.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    toast.loading("Connecting to Google OAuth account setup...");
    setTimeout(() => {
      toast.dismiss();
      sessionStorage.setItem(
        "vivaha_user",
        JSON.stringify({ name: "Annapoorna & Aswin (Google)", email: "annapoorna@gmail.com", role: "USER", provider: "google", onboarded: false })
      );
      sessionStorage.setItem("admin_authenticated", "true");
      toast.success("Registered and signed in with Google OAuth!");
      router.push("/admin/onboarding");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1F1D1A] flex flex-col items-center justify-center p-4 sm:p-8 text-[#FAF8F5] font-sans">
      <div className="max-w-md w-full bg-[#2A2723] border border-[#D4AF37]/30 p-8 sm:p-10 rounded-sm shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
            <Heart className="w-6 h-6 fill-[#D4AF37]" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VivahaLuxe Account Creation</span>
          </div>
          <h1 className="font-serif text-3xl font-light text-white">Sign Up to Get Started</h1>
          <p className="text-xs text-[#C4B7A6]">Create your account first, then configure celebration details</p>
        </div>

        {step === "sent" ? (
          <div className="bg-[#1F1D1A] p-6 rounded-sm border border-[#D4AF37] text-center space-y-6 animate-fade-in">
            <div className="w-14 h-14 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-800">
              <Send className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-white">Account Verified!</h2>
              <p className="text-xs text-[#C4B7A6] leading-relaxed">
                A verification email was sent via SMTP to <span className="text-white font-semibold">{email}</span>. You can now configure your unique SEO celebration portal.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/onboarding"
                className="inline-block w-full bg-[#D4AF37] hover:bg-[#C5A059] text-[#1F1D1A] font-bold py-3.5 rounded-xs text-xs uppercase tracking-widest transition-all shadow-lg"
              >
                Continue to Celebration Setup Wizard →
              </Link>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={handleGoogleRegister}
              type="button"
              className="w-full bg-white text-slate-800 py-3.5 px-4 rounded-xs font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 hover:bg-slate-100 transition-all shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Direct Google OAuth Sign Up</span>
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-white/15 w-full" />
              <span className="bg-[#2A2723] px-3 text-[10px] uppercase tracking-widest text-[#888178] absolute font-bold">
                Or sign up with email
              </span>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1 font-semibold">
                  Full Name / Contact Person
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aswin Kumar"
                  className="w-full bg-black/40 border border-white/20 px-3.5 py-3 text-xs sm:text-sm rounded-xs text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  className="w-full bg-black/40 border border-white/20 px-3.5 py-3 text-xs sm:text-sm rounded-xs text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1 font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-white/20 px-3.5 py-3 text-xs sm:text-sm rounded-xs text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] hover:bg-[#C5A059] text-[#1F1D1A] py-4 rounded-xs text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg mt-4 flex items-center justify-center gap-2"
              >
                <span>{loading ? "Creating Account..." : "Create Account & Continue"}</span>
              </button>
            </form>
          </>
        )}

        <div className="text-center text-xs text-[#888178] pt-2 border-t border-white/10">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#D4AF37] hover:underline font-semibold">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
