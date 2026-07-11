"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, UserPlus, ArrowLeft, Heart, Lock, Send } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "sent">("form");
  const [pendingEmail, setPendingEmail] = useState("");
  const [pendingOtp, setPendingOtp] = useState("");

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
        setPendingEmail(cleanEmail);
        if (data.otpCode) setPendingOtp(data.otpCode);
        if (!data.emailSent) {
          toast.success(`[Dev Simulator] Your 6-digit OTP code is: ${data.otpCode}`);
        } else {
          toast.success("Registration started! Please enter the 6-digit OTP sent to your email.");
        }
        router.push(`/auth/verify?email=${encodeURIComponent(cleanEmail)}${data.otpCode ? `&otp=${data.otpCode}` : ""}`);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (err) {
      toast.error("Failed to connect to registration endpoint.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Identity Services credential response
  const handleCredentialResponse = async (resp: any) => {
    try {
      toast.loading("Verifying Google account...");
      const idToken = resp?.credential;
      if (!idToken) throw new Error("No credential from Google");

      const googleRes = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const googleData = await googleRes.json();
      toast.dismiss();

      if (!googleRes.ok || !googleData.success) {
        toast.error(googleData.error || "Google sign-up failed");
        return;
      }

      const googleUser = googleData.user;

      const sessionRes = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "google", googleUser }),
      });
      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.success) {
        toast.error("Failed to create session after Google sign-up.");
        return;
      }

      const user = sessionData.user;
      if (user?.onboarded) {
        toast.success("Successfully authenticated with Google!");
        router.push("/admin");
      } else {
        toast.success("Google account linked! Complete your one-time celebration setup.");
        router.push("/admin/onboarding");
      }
    } catch (err: any) {
      toast.dismiss();
      toast.error(err?.message || "Google sign-up failed");
    }
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const init = () => {
      if (!(window as any).google?.accounts?.id) return;
      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: (resp: any) => handleCredentialResponse(resp),
        });
        (window as any).google.accounts.id.renderButton(
          document.getElementById("googleSignInDiv"),
          { theme: "outline", size: "large", width: "100%" }
        );
      } catch (e) {}
    };

    if (!document.getElementById("gsiScript")) {
      const s = document.createElement("script");
      s.src = "https://accounts.google.com/gsi/client";
      s.id = "gsiScript";
      s.async = true;
      s.defer = true;
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* Google OAuth Option */}
        <div className="w-full">
          <div id="googleSignInDiv" />
        </div>

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
              placeholder="e.g. Rahul Kumar"
              className="w-full bg-black/40 border border-white/20 px-3.5 py-3 text-xs sm:text-sm rounded-xs text-white focus:outline-none focus:border-[#D4AF37]"
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
              className="w-full bg-black/40 border border-white/20 px-3.5 py-3 text-xs sm:text-sm rounded-xs text-white focus:outline-none focus:border-[#D4AF37]"
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
              className="w-full bg-black/40 border border-white/20 px-3.5 py-3 text-xs sm:text-sm rounded-xs text-white focus:outline-none focus:border-[#D4AF37]"
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

        <div className="text-center text-xs text-[#888178] pt-2 border-t border-white/10">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#D4AF37] hover:underline font-semibold">
            Sign In Here
          </Link>
        </div>

        <div className="text-center">
          <Link href="/" className="text-[10px] text-[#888178] hover:text-[#C4B7A6] flex items-center justify-center gap-1 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
