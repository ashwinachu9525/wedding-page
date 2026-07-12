"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

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
      <body>
        <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center font-sans text-[#22201E]">
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
        </div>
      </body>
    </html>
  );
}
