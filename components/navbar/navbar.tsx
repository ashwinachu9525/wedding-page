"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Music, VolumeX, Volume2, Calendar, MapPin, Heart,
  Image as ImageIcon, Sparkles, Send, Menu, X, Share2, Copy, Check,
} from "lucide-react";
import { toast } from "sonner";
import { formatHeadingText } from "@/lib/fonts";
import { CoupleNameDisplay } from "@/components/couple-name/couple-name";
import { getPlayableMediaUrl } from "@/lib/utils";
import { PwaInstallButton } from "@/components/pwa/pwa-install-button";

interface NavbarProps {
  names?: string;
  coupleNames?: string;
  musicUrl?: string;
  onOpenRSVP: () => void;
  accentClass?: string;
  buttonClass?: string;
  headingType?: any;
  accentColor?: "gold" | "rose" | "emerald" | "royal" | "champagne";
  enableAccommodations?: boolean;
}

export function Navbar({
  names = "",
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
  const [isMuted, setIsMuted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Animate music waveform bars
  const [waveActive, setWaveActive] = useState(false);
  useEffect(() => {
    setWaveActive(isPlayingMusic && !isMuted);
  }, [isPlayingMusic, isMuted]);

  const toggleAudio = () => {
    if (!audioRef.current || !musicUrl) return;
    if (isPlayingMusic) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
    } else {
      const audio = audioRef.current;
      audio.muted = isMuted;
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

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
    setIsMuted((prev) => !prev);
  };

  // Share invite
  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = coupleNames ? `${coupleNames} — Wedding Invitation` : "Wedding Invitation";

    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url: shareUrl });
      } catch (err) {
        // User dismissed — no error needed
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Invite link copied to clipboard!");
        setTimeout(() => setCopied(false), 2500);
      } catch {
        toast.error("Couldn't copy link. Please copy the URL manually.");
      }
    }
  };

  const playableAudioUrl = getPlayableMediaUrl(musicUrl);

  // Extract a friendly track name from URL
  const trackName = (() => {
    if (!musicUrl) return "Background Music";
    try {
      const url = new URL(musicUrl);
      const parts = url.pathname.split("/").filter(Boolean);
      const filename = parts[parts.length - 1] || "";
      return decodeURIComponent(filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ")) || "Background Music";
    } catch {
      return "Background Music";
    }
  })();

  return (
    <header className="sticky top-0 z-40 bg-current/5 backdrop-blur-md border-b border-current/10 px-4 sm:px-8 py-4 transition-colors duration-500">
      {playableAudioUrl && <audio ref={audioRef} src={playableAudioUrl} preload="auto" loop />}

      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Couple Names / Logo */}
        <Link
          href="#hero"
          className={`font-serif tracking-widest flex items-center gap-2 hover:opacity-80 transition-opacity ${headingType === "script" ? "font-normal text-2xl sm:text-3xl" : "text-lg sm:text-xl uppercase font-light"}`}
        >
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

          {/* ── Music Mini-Player ── */}
          {musicUrl && (
            <div className={`flex items-center gap-1.5 rounded-full border border-current/25 px-2.5 py-1.5 transition-all ${isPlayingMusic ? "bg-current/10" : ""}`}>
              {/* Animated Waveform */}
              {isPlayingMusic && (
                <div className="hidden sm:flex items-end gap-[3px] h-4 mr-1" aria-hidden>
                  {[1, 2, 3, 4].map((bar) => (
                    <div
                      key={bar}
                      className={`w-[3px] rounded-full ${accentClass.replace("text-", "bg-")} ${waveActive ? "animate-bounce" : ""}`}
                      style={{
                        height: `${8 + bar * 2}px`,
                        animationDuration: `${0.4 + bar * 0.15}s`,
                        animationDelay: `${bar * 0.1}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Play/Pause */}
              <button
                onClick={toggleAudio}
                className={`flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider transition-all ${isPlayingMusic ? accentClass : "opacity-75"}`}
                title={isPlayingMusic ? "Pause Music" : "Play Music"}
              >
                {isPlayingMusic ? (
                  <Music className="w-3.5 h-3.5" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline max-w-[80px] truncate">{isPlayingMusic ? trackName : "Music"}</span>
              </button>

              {/* Mute/Unmute — only show when playing */}
              {isPlayingMusic && (
                <button
                  onClick={toggleMute}
                  className="ml-1 opacity-70 hover:opacity-100 transition-opacity"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          )}

          {/* ── Share Invite Button ── */}
          <button
            onClick={handleShare}
            id="share-invite-btn"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-full border border-current/25 text-[11px] font-semibold uppercase tracking-wider opacity-80 hover:opacity-100 transition-all active:scale-95"
            title="Share this invite"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Share2 className="w-3.5 h-3.5" />
            )}
            <span className="hidden md:inline">{copied ? "Copied!" : "Share"}</span>
          </button>

          <PwaInstallButton variant="outline" size="sm" label="Install App" className="hidden lg:inline-flex rounded-full border-current/25 opacity-85 hover:opacity-100" />

          {/* ── RSVP Button ── */}
          <button
            onClick={onOpenRSVP}
            className={`px-4.5 py-2 sm:px-6 sm:py-2.5 rounded-xs text-xs uppercase tracking-widest font-bold shadow-md transition-transform active:scale-95 flex items-center gap-1.5 ${buttonClass}`}
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Will You Attend?</span>
            <span className="sm:hidden">Attend?</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 ml-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 border-b border-current/10 shadow-2xl px-6 py-6 flex flex-col gap-5 text-xs uppercase tracking-[0.2em] font-bold z-50 bg-[#141210]/95 text-[#FAF8F5] backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <a href="#story" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1 flex items-center gap-2.5">
            <Heart className="w-4 h-4 text-[#D4AF37]" /> Our Story
          </a>
          <a href="#events" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1 flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-[#D4AF37]" /> Itinerary
          </a>
          <a href="#gallery" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1 flex items-center gap-2.5">
            <ImageIcon className="w-4 h-4 text-[#D4AF37]" /> Gallery
          </a>
          <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#D4AF37] transition-colors py-1 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-[#D4AF37]" /> {enableAccommodations !== false ? "Accommodations & FAQ" : "Directions & FAQ"}
          </a>
          {/* Share in mobile menu */}
          <button
            onClick={() => { setIsMobileMenuOpen(false); handleShare(); }}
            className="hover:text-[#D4AF37] transition-colors py-1 flex items-center gap-2.5 text-left"
          >
            <Share2 className="w-4 h-4 text-[#D4AF37]" /> Share This Invite
          </button>

          <div className="pt-3 border-t border-white/10">
            <PwaInstallButton variant="primary" size="md" label="📲 Install Celebration App" className="w-full justify-center" />
          </div>
        </div>
      )}
    </header>
  );
}
