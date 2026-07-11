"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Music, VolumeX, Calendar, MapPin, Heart, Image as ImageIcon, Sparkles, Send } from "lucide-react";
import { toast } from "sonner";
import { formatHeadingText } from "@/lib/fonts";
import { CoupleNameDisplay } from "@/components/couple-name/couple-name";
import { getPlayableMediaUrl } from "@/lib/utils";

interface NavbarProps {
  names: string;
  coupleNames?: string;
  musicUrl?: string;
  onOpenRSVP: () => void;
  accentClass?: string;
  buttonClass?: string;
  headingType?: "classic" | "modern" | "script";
  accentColor?: "gold" | "rose" | "emerald" | "royal" | "champagne";
  enableAccommodations?: boolean;
}

export function Navbar({
  names,
  coupleNames = names,
  musicUrl = "",
  onOpenRSVP,
  accentClass = "text-[#D4AF37]",
  buttonClass = "bg-[#22201E] text-white hover:bg-[#3A3632]",
  headingType = "classic",
  accentColor = "gold",
  enableAccommodations = true,
}: NavbarProps) {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleAudio = () => {
    if (!audioRef.current || !musicUrl) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      const audio = audioRef.current;
      const attemptPlay = () => {
        audio
          .play()
          .then(() => setIsPlayingMusic(true))
          .catch((err: any) => {
            console.warn("Audio playback error:", err);
            if (err?.name === "NotAllowedError") {
              toast.error("Please click anywhere on the page once to enable browser audio playback!");
            } else {
              toast.error("Could not load background track. Please verify the music selection in your Admin settings.");
            }
          });
      };

      if (audio.readyState === 0) {
        const onCanPlay = () => {
          audio.removeEventListener("canplay", onCanPlay);
          attemptPlay();
        };
        audio.addEventListener("canplay", onCanPlay, { once: true });
        audio.load();
      } else {
        attemptPlay();
      }
    }
  };

  const playableAudioUrl = getPlayableMediaUrl(musicUrl);

  return (
    <header className="sticky top-0 z-40 bg-current/5 backdrop-blur-md border-b border-current/10 px-4 sm:px-8 py-4 transition-colors duration-500">
      {playableAudioUrl && <audio ref={audioRef} src={playableAudioUrl} preload="auto" loop />}

      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Couple Names / Logo E.g. Single-line for top header */}
        <Link href="#hero" className={`font-serif tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity ${headingType === "script" ? "font-normal text-2xl sm:text-3xl" : "text-lg sm:text-xl uppercase font-light"}`}>
          <Sparkles className={`w-4 h-4 ${accentClass}`} />
          <CoupleNameDisplay names={coupleNames} headingType={headingType} multiLine={false} />
        </Link>

        {/* Navigation Anchor Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-[0.2em] font-medium opacity-85">
          <a href="#story" className="hover:opacity-100 transition-opacity">Our Story</a>
          <a href="#events" className="hover:opacity-100 transition-opacity">Itinerary</a>
          <a href="#gallery" className="hover:opacity-100 transition-opacity">Gallery</a>
          <a href="#faq" className="hover:opacity-100 transition-opacity">
            {enableAccommodations !== false ? "Accommodations & FAQ" : "Directions & FAQ"}
          </a>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {musicUrl && (
            <button
              onClick={toggleAudio}
              className={`p-2 sm:px-3 sm:py-2 rounded-full border border-current/25 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition-all ${
                isPlayingMusic ? `${accentClass} bg-current/10 shadow-sm` : "opacity-75"
              }`}
              title="Toggle Background Music"
            >
              {isPlayingMusic ? <Music className="w-3.5 h-3.5 animate-bounce" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlayingMusic ? "Music On" : "Play Music"}</span>
            </button>
          )}

          <button
            onClick={onOpenRSVP}
            className={`px-4.5 py-2 sm:px-6 sm:py-2.5 rounded-xs text-xs uppercase tracking-widest font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5 ${buttonClass}`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>RSVP Now</span>
          </button>
        </div>
      </div>
    </header>
  );
}
