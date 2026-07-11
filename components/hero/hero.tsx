"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Calendar, MapPin, Send } from "lucide-react";
import { formatHeadingText } from "@/lib/fonts";
import { CoupleNameDisplay } from "@/components/couple-name/couple-name";

interface HeroProps {
  coupleNames?: string;
  splitCoupleNames?: boolean;
  weddingDate?: string;
  weddingDateDisplay?: string;
  venueName?: string;
  heroBgType?: "image" | "video";
  heroBgUrl?: string;
  onOpenRSVP: () => void;
  accentClass?: string;
  themeKey?: string;
  headingType?: "script" | "serif" | "modern";
}

export function Hero({
  coupleNames = "Rahul Sharma & Priya Mehta",
  splitCoupleNames = false,
  weddingDate = "2026-11-21T10:30:00",
  weddingDateDisplay = "November 21–22, 2026",
  venueName = "The Tamarind Tree & The Leela Palace, Bangalore",
  heroBgType = "image",
  heroBgUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
  onOpenRSVP,
  accentClass = "text-[#D4AF37]",
  themeKey = "alabaster",
  headingType,
}: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(weddingDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [weddingDate]);

  return (
    <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden py-16">
      {/* Background Media */}
      {heroBgType === "video" && heroBgUrl ? (
        <video
          src={heroBgUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 brightness-40 sm:brightness-50 filter"
        />
      ) : (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBgUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop"}
            alt="Wedding Celebration Background"
            fill
            priority
            className="object-cover brightness-40 sm:brightness-50 filter"
          />
        </div>
      )}

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 z-10 pointer-events-none" />

      {/* Content Box */}
      {/* Content Box */}
      <div className={`relative z-20 max-w-2xl mx-auto p-8 sm:p-12 text-center animate-fade-in ${
        themeKey === "hindu_royal" ? "bg-[#2D0A0E]/95 border-[6px] border-double border-[#FF9933] shadow-2xl text-[#FAF8F5]" :
        themeKey === "arabic_royal" ? "bg-[#061B1C]/95 border-[6px] border-double border-[#E6C280] shadow-2xl text-[#FAF8F5]" :
        themeKey === "christian_royal" ? "bg-[#FAF9F6]/95 border-[6px] border-double border-[#B0C4DE] shadow-2xl text-[#2B3E50]" :
        "text-white space-y-8"
      } rounded-sm relative overflow-hidden`}>

        {/* Motif decorations inside the card container */}
        {themeKey === "arabic_royal" && (
          <>
            {/* Arabic Calligraphy header */}
            <div className="w-48 mx-auto mb-4 text-[#E6C280]">
              <svg className="w-full h-12 fill-current opacity-85" viewBox="0 0 120 40">
                <path d="M10,20 Q30,5 60,20 T110,20 M30,28 Q60,10 90,28 M50,35 Q60,25 70,35" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[28px] uppercase tracking-[0.25em] text-[#E6C280]/85 font-semibold mb-2">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <p className="text-[11px] italic tracking-wide opacity-80 max-w-md mx-auto mb-6">
              "With the blessings of Allah, we joyfully invite you to the marriage ceremony of"
            </p>
            <div className="absolute bottom-1 right-2 w-20 h-20 pointer-events-none opacity-20 text-[#E6C280]">
              <svg className="w-full h-full fill-current" viewBox="0 0 100 100">
                <path d="M50,10 C50,10 47,25 35,30 C30,32 20,35 20,50 L20,95 L80,95 L80,50 C80,35 70,32 65,30 C53,25 50,10 50,10 Z M15,95 L85,95 M30,95 L30,65 C30,60 35,55 50,55 C65,55 70,60 70,65 L70,95 Z" />
              </svg>
            </div>
          </>
        )}

        {themeKey === "hindu_royal" && (
          <>
            {/* Ganesh Motif SVG */}
            <div className="w-12 h-12 mx-auto mb-3 text-[#FF9933]">
              <svg className="w-full h-full fill-current" viewBox="0 0 100 100">
                <path d="M50 15c-15 0-22 8-22 17s7 15 12 18c2 1.5 3 2.5 3 4s-1 3-3 4-6-1-8-3-5-5-5-8c0-8-12-8-12 0 0 10 7 16 15 19v30h10v-30c8 0 14-8 14-17s-7-17-22-17z" />
                <circle cx="50" cy="30" r="3" fill="#FF9933" />
              </svg>
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#FF9933] font-bold mb-2">
              || Shri Ganeshaya Namah ||
            </p>
            <p className="text-[11px] italic tracking-wide opacity-80 max-w-md mx-auto mb-6">
              "With the blessings of Almighty and Elders, we joyfully invite you to the auspicious wedding ceremony of"
            </p>
            <div className="absolute bottom-1 right-2 w-16 h-20 pointer-events-none opacity-20 text-[#FF9933]">
              <svg className="w-full h-full fill-current" viewBox="0 0 100 120">
                <path d="M50,10 C40,10 35,25 35,45 C35,70 50,85 50,85 C50,85 65,70 65,45 C65,25 60,10 50,10 Z M50,0 L50,10 M35,45 H65" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="50" cy="45" r="8" />
              </svg>
            </div>
          </>
        )}

        {themeKey === "christian_royal" && (
          <>
            {/* Holy Cross SVG */}
            <div className="w-8 h-12 mx-auto mb-3 text-[#2B3E50]">
              <svg className="w-full h-full fill-current" viewBox="0 0 100 100">
                <path d="M42,10 H58 V35 H78 V48 H58 V90 H42 V48 H22 V35 H42 Z" />
              </svg>
            </div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#2B3E50] font-bold mb-2">
              Holy Matrimony
            </p>
            <p className="text-[11px] italic tracking-wide opacity-80 max-w-md mx-auto mb-6">
              "In the grace of God and our families, we invite you to witness the wedding ceremony uniting"
            </p>
            <div className="absolute bottom-2 right-2 w-16 h-16 pointer-events-none opacity-15 text-[#2B3E50]">
              <svg className="w-full h-full fill-current" viewBox="0 0 100 100">
                <path d="M20,50 C20,30 40,25 50,15 C60,25 80,30 80,50 C80,70 60,75 50,90 C40,75 20,70 20,50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M40,50 Q50,45 60,50 Q50,55 40,50" />
              </svg>
            </div>
          </>
        )}

        {/* Regular Top Tag (for non-cultural modern layouts) */}
        {!["hindu_royal", "arabic_royal", "christian_royal"].includes(themeKey) && (
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs uppercase tracking-[0.3em] font-medium mb-6">
            <Sparkles className={`w-3.5 h-3.5 ${accentClass}`} />
            <span>The Royal Union</span>
            <Sparkles className={`w-3.5 h-3.5 ${accentClass}`} />
          </div>
        )}

        <h1 className={`font-serif tracking-tight w-full max-w-5xl mx-auto px-2 ${headingType === "script" ? "font-normal leading-tight" : "uppercase leading-none"} ${
          ["hindu_royal", "arabic_royal", "christian_royal"].includes(themeKey)
            ? "text-3xl sm:text-5xl md:text-6xl my-4"
            : "text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
        }`}>
          <CoupleNameDisplay
            names={coupleNames}
            headingType={headingType}
            multiLine={true}
            splitAmpersand={splitCoupleNames}
          />
        </h1>

        <div className="w-32 h-[1px] bg-current/30 mx-auto my-4" />

        <div className="space-y-3 text-xs sm:text-sm font-sans tracking-wide">
          <p className="flex items-center justify-center gap-2 uppercase tracking-[0.25em] font-semibold">
            <Calendar className="w-4 h-4 opacity-80" />
            <span>{weddingDateDisplay}</span>
          </p>
          <p className="flex items-center justify-center gap-2 text-xs sm:text-sm opacity-90 max-w-lg mx-auto">
            <MapPin className="w-4 h-4 opacity-80 shrink-0" />
            <span>{venueName}</span>
          </p>
        </div>

        {/* Live Countdown Grid */}
        <div className="pt-4">
          <p className="text-[9px] uppercase tracking-[0.25em] opacity-80 mb-3">Countdown to Sacred Union</p>
          <div className={`grid grid-cols-4 gap-2.5 sm:gap-4 max-w-sm mx-auto p-3.5 sm:p-5 rounded-xs border shadow-md ${
            themeKey === "hindu_royal" ? "bg-black/30 border-[#FF9933]/20" :
            themeKey === "arabic_royal" ? "bg-black/30 border-[#E6C280]/20" :
            themeKey === "christian_royal" ? "bg-[#FAF9F6] border-[#B0C4DE]/30" :
            "bg-black/40 border-white/15"
          }`}>
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-3xl font-light font-sans">{timeLeft.days}</span>
              <span className="text-[8px] uppercase tracking-widest opacity-80">Days</span>
            </div>
            <div className="flex flex-col items-center border-l border-current/10">
              <span className="text-xl sm:text-3xl font-light font-sans">{timeLeft.hours}</span>
              <span className="text-[8px] uppercase tracking-widest opacity-80">Hours</span>
            </div>
            <div className="flex flex-col items-center border-l border-current/10">
              <span className="text-xl sm:text-3xl font-light font-sans">{timeLeft.minutes}</span>
              <span className="text-[8px] uppercase tracking-widest opacity-80">Mins</span>
            </div>
            <div className="flex flex-col items-center border-l border-current/10">
              <span className="text-xl sm:text-3xl font-light font-sans">{timeLeft.seconds}</span>
              <span className="text-[8px] uppercase tracking-widest opacity-80">Secs</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onOpenRSVP}
            className={`px-6 py-3.5 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs rounded-xs shadow-lg transition-all transform active:scale-95 inline-flex items-center gap-2 ${
              themeKey === "hindu_royal" ? "bg-[#FF9933] text-[#2D0A0E] hover:bg-[#E68A2E]" :
              themeKey === "arabic_royal" ? "bg-[#E6C280] text-[#061B1C] hover:bg-[#D6B36E]" :
              themeKey === "christian_royal" ? "bg-[#2B3E50] text-[#FAF9F6] hover:bg-[#3D5A75]" :
              "bg-[#D4AF37] hover:bg-[#E6C35C] text-black"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Confirm Your Presence</span>
          </button>
        </div>
      </div>
    </section>
  );
}
