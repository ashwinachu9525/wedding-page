"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Calendar, MapPin, Send } from "lucide-react";

interface HeroProps {
  coupleNames?: string;
  weddingDate?: string;
  weddingDateDisplay?: string;
  venueName?: string;
  heroBgType?: "image" | "video";
  heroBgUrl?: string;
  onOpenRSVP: () => void;
  accentClass?: string;
}

export function Hero({
  coupleNames = "Aswin K & Annapoorna",
  weddingDate = "2026-11-21T10:30:00",
  weddingDateDisplay = "November 21–22, 2026",
  venueName = "The Tamarind Tree & The Leela Palace, Bangalore",
  heroBgType = "image",
  heroBgUrl = "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
  onOpenRSVP,
  accentClass = "text-[#D4AF37]",
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
        const seconds = Math.floor((diff % (1000 * 60 * 60)) / 1000);
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
      <div className="relative z-20 max-w-4xl mx-auto space-y-8 text-white animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs uppercase tracking-[0.3em] font-medium">
          <Sparkles className={`w-3.5 h-3.5 ${accentClass}`} />
          <span>The Royal Union</span>
          <Sparkles className={`w-3.5 h-3.5 ${accentClass}`} />
        </div>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl tracking-tight uppercase font-light leading-none drop-shadow-lg">
          {coupleNames}
        </h1>

        <div className="w-32 h-[1px] bg-white/40 mx-auto" />

        <div className="space-y-2 text-sm sm:text-base font-serif tracking-wide drop-shadow-md">
          <p className="flex items-center justify-center gap-2 uppercase tracking-[0.25em] font-semibold">
            <Calendar className={`w-4 h-4 ${accentClass}`} />
            <span>{weddingDateDisplay}</span>
          </p>
          <p className="flex items-center justify-center gap-2 text-xs sm:text-sm opacity-90">
            <MapPin className={`w-4 h-4 ${accentClass}`} />
            <span>{venueName}</span>
          </p>
        </div>

        {/* Live Countdown Grid */}
        <div className="pt-6">
          <p className="text-[10px] uppercase tracking-[0.3em] opacity-80 mb-4">Countdown to Sacred Union</p>
          <div className="grid grid-cols-4 gap-3 sm:gap-6 max-w-md mx-auto bg-black/40 backdrop-blur-md p-4 sm:p-6 rounded-sm border border-white/15 shadow-xl">
            <div className="flex flex-col items-center">
              <span className={`text-2xl sm:text-4xl font-light font-serif ${accentClass}`}>{timeLeft.days}</span>
              <span className="text-[9px] uppercase tracking-widest opacity-80">Days</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10">
              <span className={`text-2xl sm:text-4xl font-light font-serif ${accentClass}`}>{timeLeft.hours}</span>
              <span className="text-[9px] uppercase tracking-widest opacity-80">Hours</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10">
              <span className={`text-2xl sm:text-4xl font-light font-serif ${accentClass}`}>{timeLeft.minutes}</span>
              <span className={`text-[9px] uppercase tracking-widest opacity-80`}>Mins</span>
            </div>
            <div className="flex flex-col items-center border-l border-white/10">
              <span className={`text-2xl sm:text-4xl font-light font-serif ${accentClass}`}>{timeLeft.seconds}</span>
              <span className="text-[9px] uppercase tracking-widest opacity-80">Secs</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onOpenRSVP}
            className="px-8 py-4 bg-[#D4AF37] hover:bg-[#E6C35C] text-black font-bold uppercase tracking-[0.25em] text-xs rounded-xs shadow-2xl transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Confirm Your Gracious Presence</span>
          </button>
        </div>
      </div>
    </section>
  );
}
