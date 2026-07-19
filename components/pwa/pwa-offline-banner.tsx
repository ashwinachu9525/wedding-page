"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, CheckCircle2 } from "lucide-react";

export function PwaOfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    setIsOnline(navigator.onLine);

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#3B1219] text-[#FFF0F5] border-b border-[#D48C9A] px-4 py-2.5 shadow-xl flex items-center justify-center gap-2.5 text-xs animate-in slide-in-from-top-full duration-300">
        <WifiOff className="w-4 h-4 text-[#FFB3C1] animate-pulse shrink-0" />
        <span className="font-semibold tracking-wide">
          Offline Mode Active: Showing cached celebration guide, timeline &amp; venue directions ✓
        </span>
      </div>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#112A21] text-[#FAF8F5] border-b border-[#D4AF37] px-4 py-2.5 shadow-xl flex items-center justify-center gap-2 text-xs animate-in slide-in-from-top-full duration-300">
      <Wifi className="w-4 h-4 text-[#57CC99] shrink-0" />
      <span className="font-bold tracking-wider uppercase text-[11px]">Connection Restored — Live Updates Active!</span>
    </div>
  );
}
