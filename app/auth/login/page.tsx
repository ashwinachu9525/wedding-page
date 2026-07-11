"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Lock, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNormalLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail || !password) {
      toast.error("Please enter both email/username and password.");
      return;
    }

    setLoading(true);

    // ── Super Admin shortcut ──────────────────────────────────────────────
    if (usernameOrEmail === "superadmin" || usernameOrEmail === (process.env.NEXT_PUBLIC_SUPER_ADMIN_USERNAME || "superadmin")) {
      const res = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "super-admin", username: usernameOrEmail, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.success) {
        toast.success("Logged in as Super Admin!");
        router.push("/super-admin");
      } else {
        toast.error(data.error || "Invalid super admin credentials (try: vivahaluxe2026)");
      }
      return;
    }

    const cleanInput = usernameOrEmail.trim().toLowerCase();

    // ── Demo account ──────────────────────────────────────────────────────
    if (cleanInput === "demo@vivahaluxe.com" && password === "demo123") {
      const res = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "demo" }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok && data.success) {
        toast.success("Signed in with demo evaluation account!");
        router.push("/admin");
      } else {
        toast.error("Demo login failed");
      }
      return;
    }

    // ── Regular credentials login ─────────────────────────────────────────
    const res = await fetch("/api/auth/session-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "credentials", email: cleanInput, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      if (data.error === "EMAIL_NOT_VERIFIED") {
        toast.error("Email Verification Required", {
          description: "Please complete your 6-digit email OTP verification before signing in.",
        });
        router.push(`/auth/verify?email=${encodeURIComponent(data.email || cleanInput)}`);
        return;
      }
      toast.error(data.error || "Login failed", {
        description: res.status === 404 ? "Please register a new account or use demo credentials: demo@vivahaluxe.com / demo123" : undefined,
      });
      return;
    }

    const user = data.user;
    toast.success(`Welcome back, ${user?.name || ""}!`, { description: "Opening Couple Studio Dashboard..." });
    if (user?.onboarded) {
      router.push("/admin");
    } else {
      router.push("/admin/onboarding");
    }
  };

  // ── Google Identity Services ─────────────────────────────────────────────
  const handleCredentialResponse = async (resp: any) => {
    try {
      toast.loading("Verifying Google account...");
      const idToken = resp?.credential;
      if (!idToken) throw new Error("No credential from Google");

      // First verify token + upsert user via existing /api/auth/google
      const googleRes = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      const googleData = await googleRes.json();
      toast.dismiss();

      if (!googleRes.ok || !googleData.success) {
        toast.error(googleData.error || "Google sign-in failed");
        return;
      }

      const googleUser = googleData.user;

      // Now set the session cookie
      const sessionRes = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "google", googleUser }),
      });
      const sessionData = await sessionRes.json();

      if (!sessionRes.ok || !sessionData.success) {
        toast.error("Failed to create session. Please try again.");
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
      toast.error(err?.message || "Google sign-in failed");
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

  // Fallback quick simulation when no Google client ID is configured
  const handleGoogleLogin = async () => {
    if (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) return;
    toast.loading("Connecting to Google OAuth security gateway...");
    setTimeout(async () => {
      toast.dismiss();
      const simulatedUser = {
        id: "sim-001",
        email: "rahul.priya.demo@vivahaluxe.com",
        name: "Rahul K (Google)",
        role: "USER",
        provider: "google",
        onboarded: true,
        slug: null,
      };
      const res = await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "google", googleUser: simulatedUser }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const user = data.user;
        toast.success("Google simulation signed in!");
        if (user?.onboarded) {
          router.push("/admin");
        } else {
          router.push("/admin/onboarding");
        }
      } else {
        toast.error("Simulation failed");
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

        {/* Google Sign In */}
        <div className="w-full">
          <div id="googleSignInDiv" />
          {!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full mt-2 bg-white text-slate-800 py-3.5 px-4 rounded-xs font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 hover:bg-slate-100 transition-all shadow-md"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>
          )}
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#1F1D1A] px-3 text-[10px] uppercase tracking-widest text-[#888178] absolute font-bold">Or sign in with email</span>
        </div>

        <form onSubmit={handleNormalLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1 font-semibold">
              Email / Username
            </label>
            <input
              type="text"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
              placeholder="you@domain.com or superadmin"
              className="w-full bg-white/5 border border-white/15 px-3.5 py-3 text-sm rounded-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] font-semibold">
                Password
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-[#D4AF37] hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/15 px-3.5 py-3 text-sm rounded-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-60 text-[#1F1D1A] py-4 rounded-xs text-xs uppercase tracking-[0.2em] font-bold transition-all shadow-lg mt-2 flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? "Signing In..." : "Sign In to Studio"}</span>
          </button>
        </form>

        <p className="text-[10px] text-center text-[#888178]">
          Demo account: <span className="text-[#D4AF37] font-mono">demo@vivahaluxe.com</span> / <span className="text-[#D4AF37] font-mono">demo123</span>
        </p>

        <div className="text-center text-xs text-[#888178] pt-2 border-t border-white/10">
          New to VivahaLuxe?{" "}
          <Link href="/auth/register" className="text-[#D4AF37] hover:underline font-semibold">
            Create an Account
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
