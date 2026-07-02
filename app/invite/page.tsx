"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { coupleInfo } from "@/data/wedding-data";
import { Sparkles, Calendar, MapPin, Heart, ArrowRight, CheckCircle2, Share2 } from "lucide-react";

type ThemeKey = "alabaster" | "velvet" | "emerald" | "rose" | "marigold" | "mysore" | "crimson" | "ivory";

const THEMES: Record<ThemeKey, { bg: string; cardBg: string; border: string; text: string; accent: string; subText: string }> = {
  alabaster: {
    bg: "bg-[#F3EFEA]",
    cardBg: "bg-[#FAF8F5]",
    border: "border-[#C4B7A6]",
    text: "text-[#22201E]",
    accent: "text-[#9E8B73]",
    subText: "text-[#55514C]",
  },
  velvet: {
    bg: "bg-[#141311]",
    cardBg: "bg-[#1F1D1A]",
    border: "border-[#D4AF37]",
    text: "text-[#FAF8F5]",
    accent: "text-[#D4AF37]",
    subText: "text-[#C4B7A6]",
  },
  emerald: {
    bg: "bg-[#0B1D16]",
    cardBg: "bg-[#112A21]",
    border: "border-[#D4AF37]",
    text: "text-[#FAF8F5]",
    accent: "text-[#D4AF37]",
    subText: "text-[#A3C1B4]",
  },
  rose: {
    bg: "bg-[#FDEDF0]",
    cardBg: "bg-[#FFF8F8]",
    border: "border-[#D48C9A]",
    text: "text-[#4A1D24]",
    accent: "text-[#B85D6B]",
    subText: "text-[#7A444C]",
  },
  marigold: {
    bg: "bg-[#1A0E04]",
    cardBg: "bg-[#2A1808]",
    border: "border-[#E8984E]",
    text: "text-[#FFF6ED]",
    accent: "text-[#E8984E]",
    subText: "text-[#D4B59D]",
  },
  mysore: {
    bg: "bg-[#060D18]",
    cardBg: "bg-[#0A1628]",
    border: "border-[#C5A059]",
    text: "text-[#F3EAD8]",
    accent: "text-[#C5A059]",
    subText: "text-[#A8B7CD]",
  },
  crimson: {
    bg: "bg-[#240609]",
    cardBg: "bg-[#380B10]",
    border: "border-[#E6C280]",
    text: "text-[#FCEEE3]",
    accent: "text-[#E6C280]",
    subText: "text-[#D9AFB4]",
  },
  ivory: {
    bg: "bg-[#ECE9E3]",
    cardBg: "bg-[#FFFFFF]",
    border: "border-[#E0DCD5]",
    text: "text-[#1F1D1A]",
    accent: "text-[#888178]",
    subText: "text-[#66625D]",
  },
};

function InviteContent() {
  const searchParams = useSearchParams();

  // Parse query parameters
  const rawGuest = searchParams.get("guest") || searchParams.get("g") || "Honored Guest";
  const guestName = decodeURIComponent(rawGuest);

  const rawNote =
    searchParams.get("note") ||
    searchParams.get("n") ||
    "We joyfully invite you and your family to join us as we celebrate our beginning as husband and wife. Your presence and blessings mean the world to us!";
  const customNote = decodeURIComponent(rawNote);

  const rawTheme = (searchParams.get("theme") || searchParams.get("t") || "alabaster") as ThemeKey;
  const theme = THEMES[rawTheme] ? rawTheme : "alabaster";
  const styles = THEMES[theme];

  return (
    <div className={`min-h-screen ${styles.bg} flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 transition-colors duration-500`}>
      {/* Editorial Top Badge */}
      <div className="mb-6 flex items-center space-x-2 animate-fade-in opacity-85">
        <Sparkles className={`w-4 h-4 ${styles.accent}`} />
        <span className={`text-[11px] font-semibold uppercase tracking-[0.3em] ${styles.subText}`}>
          Official Personalized Invitation
        </span>
      </div>

      {/* The Digital Invitation Card */}
      <div
        className={`w-full max-w-xl ${styles.cardBg} ${styles.text} border-2 ${styles.border} p-8 sm:p-12 md:p-16 rounded-sm shadow-2xl relative overflow-hidden text-center transition-all duration-500`}
      >
        {/* Corner Ornaments */}
        <div className={`absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 ${styles.border} opacity-60 pointer-events-none`} />
        <div className={`absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 ${styles.border} opacity-60 pointer-events-none`} />
        <div className={`absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 ${styles.border} opacity-60 pointer-events-none`} />
        <div className={`absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 ${styles.border} opacity-60 pointer-events-none`} />

        {/* Inner Border Frame */}
        <div className={`absolute inset-4 border border-current/10 pointer-events-none rounded-2xs`} />

        <div className="relative z-10 space-y-8">
          {/* Header Tag */}
          <div className="space-y-1">
            <span className={`text-[10px] sm:text-xs uppercase tracking-[0.4em] ${styles.subText} block font-light`}>
              In the Name of Love &amp; Tradition
            </span>
            <div className={`text-xs uppercase tracking-[0.25em] ${styles.accent} font-medium`}>
              The Wedding Celebration of
            </div>
          </div>

          {/* Couple Names */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase font-light leading-none">
            Aswin{" "}
            <span className={`italic font-normal text-3xl sm:text-5xl ${styles.accent} mx-1.5`}>&amp;</span>{" "}
            Annapoorna
          </h1>

          {/* Divider Line */}
          <div className="flex items-center justify-center gap-4 py-1">
            <div className="w-16 h-[1px] bg-current/25" />
            <Heart className={`w-3.5 h-3.5 ${styles.accent} fill-current`} />
            <div className="w-16 h-[1px] bg-current/25" />
          </div>

          {/* Dedicated Guest Invitation Box */}
          <div className="py-4 px-6 rounded-xs border border-current/15 bg-current/5 max-w-md mx-auto">
            <p className={`text-[10px] uppercase tracking-[0.3em] ${styles.subText} mb-1`}>Cordially Inviting</p>
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-medium tracking-wide">
              {guestName}
            </h2>
          </div>

          {/* Personalized Message Quote */}
          <blockquote className="font-serif italic text-base sm:text-lg md:text-xl leading-relaxed px-4 opacity-95">
            &ldquo;{customNote}&rdquo;
          </blockquote>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-current/15 max-w-md mx-auto text-left">
            <div className="flex items-start space-x-3 p-3 rounded-xs bg-current/5">
              <Calendar className={`w-5 h-5 ${styles.accent} shrink-0 mt-0.5`} />
              <div>
                <p className={`text-[10px] uppercase tracking-widest ${styles.subText} font-semibold`}>Celebration Dates</p>
                <p className="text-xs sm:text-sm font-medium mt-0.5">Nov 21–22, 2026</p>
                <p className={`text-[11px] ${styles.subText}`}>Muhurtham &amp; Reception</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xs bg-current/5">
              <MapPin className={`w-5 h-5 ${styles.accent} shrink-0 mt-0.5`} />
              <div>
                <p className={`text-[10px] uppercase tracking-widest ${styles.subText} font-semibold`}>Royal Venues</p>
                <p className="text-xs sm:text-sm font-medium mt-0.5">Bangalore, India</p>
                <p className={`text-[11px] ${styles.subText}`}>Tamarind Tree &amp; Leela Palace</p>
              </div>
            </div>
          </div>

          {/* Call To Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className={`w-full sm:w-auto px-8 py-4 bg-[#22201E] text-[#FAF8F5] text-xs uppercase tracking-[0.25em] font-semibold rounded-xs hover:bg-[#3A3632] transition-all shadow-lg flex items-center justify-center gap-2`}
            >
              <span>Explore Full Website &amp; RSVP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Tag */}
      <div className="mt-8 text-center">
        <p className={`text-xs ${styles.subText} tracking-widest uppercase`}>
          #AswinWedsAnnapoorna • Bangalore Celebration
        </p>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#22201E] flex items-center justify-center text-[#C4B7A6] font-serif text-xl p-6 text-center">
          Opening royal wedding invitation...
        </div>
      }
    >
      <InviteContent />
    </Suspense>
  );
}
