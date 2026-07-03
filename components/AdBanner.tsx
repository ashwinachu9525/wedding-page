"use client";

import React, { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  slot?: "landing" | "admin" | "footer" | "sidebar";
  className?: string;
}

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || "ca-pub-XXXXXXXXXXXXXXXX";
const SLOT_MAP: Record<string, string> = {
  landing: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LANDING || "1234567890",
  admin: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ADMIN || "0987654321",
  footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LANDING || "1234567890",
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ADMIN || "0987654321",
};

export default function AdBanner({ slot = "landing", className = "" }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const [isPro, setIsPro] = useState(false);
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const isPlaceholder = !PUBLISHER_ID || PUBLISHER_ID.includes("XXXX");

  useEffect(() => {
    // Check if current user is Pro
    try {
      const userStr = sessionStorage.getItem("vivaha_user");
      if (userStr) {
        const u = JSON.parse(userStr);
        if (u.plan === "PRO" || u.isPro === true) {
          setIsPro(true);
          return;
        }
      }

      // Check global ad enable config from Super Admin
      const globalAdConfig = localStorage.getItem("vivaha_global_ad_config");
      if (globalAdConfig) {
        const parsed = JSON.parse(globalAdConfig);
        if (parsed.enabled === false) {
          setAdsEnabled(false);
          return;
        }
      }
    } catch (e) {}

    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized || isPro || !adsEnabled) return;
    if (isPlaceholder) return; // Don't push to AdSense in placeholder mode

    // Push AdSense ad after render
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {}
  }, [initialized, isPro, adsEnabled, isPlaceholder]);

  // Don't show ads to Pro users or if disabled globally
  if (isPro || !adsEnabled) return null;

  // In development / placeholder mode — show a styled mock ad unit
  if (isPlaceholder) {
    return <MockAdUnit slot={slot} className={className} />;
  }

  // Real AdSense Unit
  const adSlot = SLOT_MAP[slot] || SLOT_MAP.landing;
  const isHorizontal = slot === "landing" || slot === "footer";

  return (
    <div
      className={`w-full overflow-hidden rounded border border-dashed border-gray-200 bg-gray-50 ${className}`}
      aria-label="Advertisement"
    >
      <p className="text-[9px] text-gray-400 text-center pt-1 uppercase tracking-widest">Advertisement</p>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: "block", textAlign: "center" }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={adSlot}
        data-ad-format={isHorizontal ? "auto" : "rectangle"}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// ── Mock Ad Unit (shown when AdSense publisher ID is not configured) ───────────
function MockAdUnit({ slot, className }: { slot: string; className: string }) {
  const [adConfig, setAdConfig] = useState({
    sponsorName: "Tanishq Royal Wedding Jewels",
    tagline: "Exclusive Heritage Bridal Gold & Diamond Collections • Up to 20% Off Making Charges",
    linkUrl: "https://tanishq.co.in",
    ctaText: "Explore Bridal Collection",
  });

  useEffect(() => {
    try {
      const cfg = localStorage.getItem("vivaha_global_ad_config");
      if (cfg) {
        const parsed = JSON.parse(cfg);
        setAdConfig((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {}
  }, []);

  const isAdminSlot = slot === "admin";

  if (isAdminSlot) {
    return (
      <div
        className={`bg-gradient-to-r from-[#FAF5FF] via-[#FFFDF9] to-[#FAF8F5] border border-[#E9D5FF] p-3.5 rounded-md shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
        aria-label="Sponsored Advertisement"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0 text-xs font-bold">
            Ad
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] uppercase font-bold tracking-widest bg-purple-100 text-[#662D91] px-1.5 py-0.5 rounded">
                Sponsored
              </span>
              <span className="font-serif text-sm font-bold text-[#22201E]">{adConfig.sponsorName}</span>
            </div>
            <p className="text-[11px] text-[#55514C] mt-0.5 leading-relaxed">{adConfig.tagline}</p>
          </div>
        </div>
        <a
          href={adConfig.linkUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="px-3.5 py-1.5 bg-[#662D91] hover:bg-[#522178] text-white text-xs font-semibold rounded transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
        >
          <span>{adConfig.ctaText}</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-md bg-white/95 backdrop-blur-md border border-[#E8E2D9] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 transition-all hover:shadow-md ${className}`}
      aria-label="Sponsored Advertisement"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 text-[10px] font-bold">
          Ad
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
              Sponsored
            </span>
            <span className="font-serif text-sm font-bold text-[#22201E]">{adConfig.sponsorName}</span>
          </div>
          <p className="text-xs text-[#66625D] mt-0.5">{adConfig.tagline}</p>
        </div>
      </div>
      <a
        href={adConfig.linkUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="px-4 py-2 bg-[#22201E] hover:bg-black text-[#D4AF37] text-xs font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap shrink-0"
      >
        <span>{adConfig.ctaText}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
      </a>
    </div>
  );
}
