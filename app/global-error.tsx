"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw, UserPlus } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our super admin system
    fetch("/api/super-admin/system-errors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error.message || "Unknown error",
        stack: error.stack,
        path: typeof window !== "undefined" ? window.location.pathname : "global",
      }),
    }).catch(console.error); // Ignore failures in error logging to avoid loops
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-[#FAF8F5] text-[#22201E] font-sans flex flex-col selection:bg-emerald-900 selection:text-white m-0">
        {/* Navigation Bar */}
        <header className="border-b border-[#E8E2D9] bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#22201E] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-lg">
                V
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#22201E] block leading-none">
                  Vivaha<span className="text-emerald-800 font-light italic">Luxe</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#888178]">Wedding Platform Suite</span>
              </div>
            </Link>

            <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
              <Link href="/features" className="hidden md:block text-xs font-semibold uppercase tracking-wider text-[#55514C] hover:text-emerald-800 px-2 py-2 transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="hidden md:block text-xs font-semibold uppercase tracking-wider text-[#55514C] hover:text-emerald-800 px-2 py-2 transition-colors">
                Pricing
              </Link>
              <Link href="/auth/login" className="text-xs font-semibold uppercase tracking-wider text-[#55514C] hover:text-[#22201E] px-2 py-2 transition-colors">
                Sign In
              </Link>
              <Link href="/auth/register" className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#22201E] text-white text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-[#3A3632] transition-colors shadow-xs">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Register</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Error Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white border border-[#E8E2D9] rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-serif text-[#22201E] mb-3">Oops!</h1>
            <p className="text-[#888178] mb-8 leading-relaxed">
              Something went wrong unexpectedly. Our technical team has been notified and is looking into the issue.
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={() => reset()}
                className="w-full bg-[#22201E] hover:bg-[#3d3a36] text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Try Again
              </button>
              
              <Link
                href="/"
                className="w-full bg-white hover:bg-gray-50 border border-[#E8E2D9] text-[#22201E] px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> Return Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
