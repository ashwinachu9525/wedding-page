"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { coupleInfo } from "@/data/wedding-data";
import { useMedia } from "@/lib/media-context";
import { ChevronDown, Calendar, MapPin } from "lucide-react";

interface HeroProps {
  onOpenRSVP?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function Hero({ onOpenRSVP }: HeroProps) {
  const { heroBgType, heroVideoUrl, heroImageUrl } = useMedia();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check viewport for responsive media optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Countdown logic
    const targetDate = new Date(coupleInfo.weddingDateISO).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => {
      window.removeEventListener("resize", checkMobile);
      clearInterval(timer);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[700px] max-h-[1200px] flex items-center justify-center overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 bg-[#22201E]">
        {heroBgType === "image" ? (
          <div className="absolute inset-0">
            <Image
              src={heroImageUrl || coupleInfo.heroFallbackImage}
              alt={`${coupleInfo.names} Hero Background Image`}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center scale-105 transition-transform duration-1000 ease-out opacity-90"
            />
          </div>
        ) : (
          <>
            {!isMobile ? (
              <video
                key={heroVideoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-80 scale-105 transition-transform duration-1000 ease-out"
                poster={coupleInfo.heroFallbackImage}
              >
                <source src={heroVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : null}

            {/* Fallback & Mobile Image */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                !isMobile ? "opacity-0 md:opacity-0 pointer-events-none" : "opacity-90"
              }`}
            >
              <Image
                src={coupleInfo.heroFallbackImage}
                alt={`${coupleInfo.names} Hero Background`}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </>
        )}

        {/* Luxury Soft Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30 backdrop-brightness-[0.85]" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white flex flex-col items-center justify-center pt-16">
        {/* Subtle Editorial Top Tag */}
        <div className="inline-flex items-center space-x-3 mb-6 animate-fade-in opacity-90">
          <span className="h-[1px] w-8 md:w-12 bg-white/60" />
          <span className="text-[11px] md:text-xs uppercase tracking-[0.35em] font-light text-[#E8E2D9]">
            The Wedding Celebration of
          </span>
          <span className="h-[1px] w-8 md:w-12 bg-white/60" />
        </div>

        {/* Couple Names */}
        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight font-light leading-none mb-4 drop-shadow-md">
          {coupleInfo.firstNames.partner1}{" "}
          <span className="italic font-normal text-4xl sm:text-6xl md:text-7xl text-[#E8E2D9] mx-1 md:mx-3">
            &amp;
          </span>{" "}
          {coupleInfo.firstNames.partner2}
        </h1>

        {/* Elegant Headline */}
        <p className="font-serif italic text-xl md:text-2xl text-[#E8E2D9]/90 mb-8 max-w-2xl font-light">
          &ldquo;{coupleInfo.headline}&rdquo;
        </p>

        {/* Date & Location Pills */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10 text-xs md:text-sm tracking-[0.2em] uppercase font-light">
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <Calendar className="w-4 h-4 text-[#C4B7A6]" />
            <span>{coupleInfo.weddingDateDisplay}</span>
          </div>
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
            <MapPin className="w-4 h-4 text-[#C4B7A6]" />
            <span>{coupleInfo.locationDisplay}</span>
          </div>
        </div>

        {/* Short Welcome Message */}
        <p className="max-w-xl text-sm md:text-base text-white/85 font-light leading-relaxed mb-10 hidden sm:block">
          {coupleInfo.welcomeMessage}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-xs sm:max-w-none mb-14">
          <button
            onClick={onOpenRSVP}
            className="w-full sm:w-auto px-8 py-4 bg-[#FAF8F5] text-[#22201E] uppercase tracking-[0.25em] text-xs font-semibold hover:bg-[#E8E2D9] transition-all duration-300 rounded-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            RSVP Online
          </button>
          <button
            onClick={() => scrollToSection("events")}
            className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/60 text-white uppercase tracking-[0.25em] text-xs font-medium hover:bg-white/15 hover:border-white transition-all duration-300 rounded-sm backdrop-blur-xs"
          >
            View Itinerary
          </button>
        </div>

        {/* Minimalist Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-md w-full py-4 px-6 bg-black/40 backdrop-blur-md rounded-lg border border-white/15 text-center">
          <div className="flex flex-col">
            <span className="font-serif text-2xl md:text-3xl font-light text-white">
              {timeLeft.days}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4B7A6]">
              Days
            </span>
          </div>
          <div className="flex flex-col border-l border-white/15">
            <span className="font-serif text-2xl md:text-3xl font-light text-white">
              {String(timeLeft.hours).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4B7A6]">
              Hours
            </span>
          </div>
          <div className="flex flex-col border-l border-white/15">
            <span className="font-serif text-2xl md:text-3xl font-light text-white">
              {String(timeLeft.minutes).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4B7A6]">
              Mins
            </span>
          </div>
          <div className="flex flex-col border-l border-white/15">
            <span className="font-serif text-2xl md:text-3xl font-light text-white">
              {String(timeLeft.seconds).padStart(2, "0")}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4B7A6]">
              Secs
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollToSection("story")}
        aria-label="Scroll to our story"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 text-white/70 hover:text-white flex flex-col items-center space-y-2 transition-colors duration-300 group cursor-pointer"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Our Story</span>
        <ChevronDown className="w-4 h-4 animate-bounce text-[#E8E2D9]" />
      </button>
    </section>
  );
}
