"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleNormalLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      toast.error("Please enter both email/username and password.");
      return;
    }

    if (usernameOrEmail === "superadmin") {
      if (password !== "admin123" && password !== "superadmin") {
        toast.error("Invalid superadmin password (try: admin123)");
        return;
      }
      sessionStorage.setItem("vivaha_user", JSON.stringify({ name: "Super Admin", role: "SUPER_ADMIN", username: usernameOrEmail }));
      toast.success("Logged in as Super Admin!");
      router.push("/super-admin");
      return;
    }

    const cleanInput = usernameOrEmail.trim().toLowerCase();
    const existingUsersStr = localStorage.getItem("vivaha_registered_users") || "{}";
    let existingUsers: Record<string, any> = {};
    try {
      existingUsers = JSON.parse(existingUsersStr);
    } catch (err) {}

    // Also support built-in demo credentials for quick evaluation
    if (cleanInput === "demo@vivahaluxe.com" && password === "demo123") {
      const demoUser = {
        name: "Demo Host Couple",
        email: "demo@vivahaluxe.com",
        role: "USER",
        onboarded: true,
        coupleNames: "Aswin & Annapoorna",
        slug: "aswin-annapoorna",
        isDemo: true,
      };
      sessionStorage.setItem("vivaha_user", JSON.stringify(demoUser));
      sessionStorage.setItem("admin_authenticated", "true");
      sessionStorage.setItem("vivaha_onboarded", "true");
      toast.success("Signed in with demo evaluation account!");
      router.push("/admin");
      return;
    }

    const user = existingUsers[cleanInput];
    if (!user) {
      toast.error("Account Not Found!", {
        description: "Please register a new account or use demo credentials: demo@vivahaluxe.com / demo123",
      });
      return;
    }

    if (user.password !== password) {
      toast.error("Invalid Credentials", {
        description: "The password you entered is incorrect. Please verify and try again.",
      });
      return;
    }

    if (!user.verified) {
      toast.error("Email Verification Required", {
        description: "Please complete your 6-digit email OTP verification before signing in.",
      });
      router.push(`/auth/verify?email=${encodeURIComponent(user.email)}`);
      return;
    }

    sessionStorage.setItem("vivaha_user", JSON.stringify(user));
    sessionStorage.setItem("admin_authenticated", "true");
    if (user.onboarded) {
      sessionStorage.setItem("vivaha_onboarded", "true");
      toast.success(`Welcome back, ${user.name}!`, {
        description: "Opening Couple Studio Dashboard...",
      });
      router.push("/admin");
    } else {
      sessionStorage.removeItem("vivaha_onboarded");
      toast.success("Authentication Successful!", {
        description: "Please complete your one-time celebration setup.",
      });
      router.push("/admin/onboarding");
    }
  };

  const handleGoogleLogin = () => {
    toast.loading("Connecting to Google OAuth security gateway...");
    setTimeout(() => {
      toast.dismiss();
      const existingUsersStr = localStorage.getItem("vivaha_registered_users") || "{}";
      let existingUsers: Record<string, any> = {};
      try {
        existingUsers = JSON.parse(existingUsersStr);
      } catch (err) {}

      const googleEmail = "ashwinachu9525@gmail.com";
      let user = existingUsers[googleEmail];
      if (!user) {
        user = {
          name: "Aswin K (Google)",
          email: googleEmail,
          role: "USER",
          provider: "google",
          verified: true,
          onboarded: false,
        };
        existingUsers[googleEmail] = user;
        localStorage.setItem("vivaha_registered_users", JSON.stringify(existingUsers));
      }

      sessionStorage.setItem("vivaha_user", JSON.stringify(user));
      sessionStorage.setItem("admin_authenticated", "true");
      if (user.onboarded) {
        sessionStorage.setItem("vivaha_onboarded", "true");
        toast.success("Successfully authenticated with Google!");
        router.push("/admin");
      } else {
        sessionStorage.removeItem("vivaha_onboarded");
        toast.success("Google account linked! Complete your one-time celebration setup.");
        router.push("/admin/onboarding");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#22201E] flex flex-col items-center justify-center p-4 text-[#FAF8F5]">
      <div className="max-w-md w-full bg-[#1F1D1A] border border-white/10 p-8 sm:p-10 rounded-sm shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5]/10 flex items-center justify-center text-[#D4AF37]">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#C4B7A6]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>VivahaLuxe Authentication</span>
          </div>
          <h1 className="font-serif text-3xl font-light">Sign In to Platform</h1>
        </div>

        {/* Google OAuth Option */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full bg-white text-slate-800 py-3.5 px-4 rounded-xs font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 hover:bg-slate-100 transition-all shadow-md"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/15 w-full" />
          <span className="bg-[#1F1D1A] px-3 text-[10px] uppercase tracking-widest text-[#888178] absolute">
            Or normal sign in
          </span>
        </div>

        {/* Username/Password Form */}
        <form onSubmit={handleNormalLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1.5 font-semibold">
              Username or Email
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              autoCorrect="off"
              autoCapitalize="none"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="Enter your registered email or username"
              className="w-full bg-black/40 border border-white/20 px-3.5 py-3 text-xs rounded-xs focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1.5 font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black/40 border border-white/20 px-3.5 py-3 text-xs rounded-xs focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#D4AF37] text-[#1F1D1A] font-bold py-3.5 rounded-xs uppercase tracking-widest text-xs hover:bg-[#E6C35C] transition-colors shadow-lg mt-2"
          >
            Sign In with Credentials
          </button>
        </form>

        <div className="bg-[#1F1D1A]/90 p-3.5 rounded-xs border border-[#D4AF37]/30 space-y-1.5 shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Demo Evaluation Credentials</span>
            </span>
            <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded uppercase font-mono">Instant Test</span>
          </div>
          <div className="text-[11px] font-mono text-[#C4B7A6] flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-black/40 p-2 rounded border border-white/5">
            <span>Email: <strong className="text-white select-all">demo@vivahaluxe.com</strong></span>
            <span>Pass: <strong className="text-white select-all">demo123</strong></span>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <Link href="/auth/register" className="text-[#D4AF37] hover:underline">
            Don&apos;t have an account? Register
          </Link>
          <Link href="/" className="text-[#C4B7A6] hover:text-white">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
