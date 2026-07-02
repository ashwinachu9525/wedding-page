"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useMedia } from "@/lib/media-context";
import { coupleInfo } from "@/data/wedding-data";
import { toast } from "sonner";
import {
  Upload,
  Video,
  Image as ImageIcon,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Users,
  Layout,
  Check,
  Send,
  MessageCircle,
  Copy,
  Share2,
  ExternalLink,
  Globe,
} from "lucide-react";

type ThemeKey = "alabaster" | "velvet" | "emerald" | "rose" | "marigold" | "mysore" | "crimson" | "ivory";

const INVITE_THEMES: { key: ThemeKey; name: string; bgClass: string; textClass: string; borderClass: string }[] = [
  { key: "alabaster", name: "Alabaster Cream", bgClass: "bg-[#FAF8F5]", textClass: "text-[#22201E]", borderClass: "border-[#C4B7A6]" },
  { key: "velvet", name: "Midnight Velvet", bgClass: "bg-[#1F1D1A]", textClass: "text-[#FAF8F5]", borderClass: "border-[#D4AF37]" },
  { key: "emerald", name: "Heritage Emerald", bgClass: "bg-[#112A21]", textClass: "text-[#FAF8F5]", borderClass: "border-[#D4AF37]" },
  { key: "rose", name: "Jaipur Rose Palace", bgClass: "bg-[#FFF8F8]", textClass: "text-[#4A1D24]", borderClass: "border-[#D48C9A]" },
  { key: "marigold", name: "Sunset Marigold", bgClass: "bg-[#2A1808]", textClass: "text-[#FFF6ED]", borderClass: "border-[#E8984E]" },
  { key: "mysore", name: "Mysore Royal Silk", bgClass: "bg-[#0A1628]", textClass: "text-[#F3EAD8]", borderClass: "border-[#C5A059]" },
  { key: "crimson", name: "Kanchipuram Crimson", bgClass: "bg-[#380B10]", textClass: "text-[#FCEEE3]", borderClass: "border-[#E6C280]" },
  { key: "ivory", name: "Minimalist Ivory", bgClass: "bg-[#FFFFFF]", textClass: "text-[#1F1D1A]", borderClass: "border-[#E0DCD5]" },
];

const CURATED_HERO_IMAGES = [
  {
    name: "Royal Mandap Lighting",
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Tamarind Tree Gardenia",
    url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Bangalore Palace Arch",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Golden Sunset Garland",
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2070&auto=format&fit=crop",
  },
];

export default function AdminPage() {
  const {
    photos,
    heroBgType,
    heroVideoUrl,
    heroImageUrl,
    addPhoto,
    deletePhoto,
    updateHeroVideo,
    updateHeroImage,
    setHeroBgType,
    removeHeroVideo,
    resetToDefaults,
  } = useMedia();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"photos" | "hero" | "invites" | "rsvps">("photos");

  // Photo upload form state
  const [photoSrc, setPhotoSrc] = useState("");
  const [photoAlt, setPhotoAlt] = useState("");
  const [photoCaption, setPhotoCaption] = useState("");
  const [photoCategory, setPhotoCategory] = useState("ceremony");

  // Hero customizer state
  const [bgModeInput, setBgModeInput] = useState<"video" | "image">(heroBgType);
  const [videoInputUrl, setVideoInputUrl] = useState(heroVideoUrl);
  const [imageInputUrl, setImageInputUrl] = useState(heroImageUrl);

  // WhatsApp Invite Studio state
  const [customDomain, setCustomDomain] = useState("https://aswin-and-annapoorna.vercel.app");
  const [inviteGuestName, setInviteGuestName] = useState("Sri Rajesh Sharma & Family");
  const [invitePhone, setInvitePhone] = useState("");
  const [inviteNote, setInviteNote] = useState(
    "We joyfully invite you and your family to join us as we celebrate our beginning as husband and wife. Your presence and blessings mean the world to us!"
  );
  const [inviteTheme, setInviteTheme] = useState<ThemeKey>("alabaster");

  // Demo RSVPs state
  const [rsvps, setRsvps] = useState<any[]>([]);

  useEffect(() => {
    setBgModeInput(heroBgType);
    setVideoInputUrl(heroVideoUrl);
    setImageInputUrl(heroImageUrl);
  }, [heroBgType, heroVideoUrl, heroImageUrl]);

  useEffect(() => {
    const cachedAuth = sessionStorage.getItem("admin_authenticated");
    if (cachedAuth === "true") {
      setIsAuthenticated(true);
    }

    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      if (origin && !origin.includes("localhost")) {
        setCustomDomain(origin);
      }
    }

    try {
      const savedRSVPs = localStorage.getItem("aswin_wedding_rsvps");
      if (savedRSVPs) {
        setRsvps(JSON.parse(savedRSVPs));
      } else {
        setRsvps([
          { id: 1, name: "Vikram & Pooja Sharma", attending: "yes", guests: "2", dietary: "Vegetarian", events: ["Mehendi", "Ceremony", "Reception"] },
          { id: 2, name: "Rajesh K Nair", attending: "yes", guests: "1", dietary: "No restrictions", events: ["Ceremony"] },
          { id: 3, name: "Sneha & Rohan Rao", attending: "yes", guests: "2", dietary: "Jain Vegetarian", events: ["Reception"] },
        ]);
      }
    } catch (e) {
      console.error("Error loading RSVPs", e);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "2026" || pinInput === "aswin" || pinInput === "admin") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
      setErrorMsg("");
      toast.success("Welcome back to your wedding dashboard!");
    } else {
      setErrorMsg("Invalid passcode. Hint: Use default PIN '2026'");
      toast.error("Incorrect PIN entered.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        toast.warning("File exceeds 15MB. It will be saved directly into browser IndexedDB storage.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPhotoSrc(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoSrc) return;

    addPhoto({
      src: photoSrc,
      alt: photoAlt || "Wedding celebration moment in Bangalore",
      caption: photoCaption || photoAlt,
      width: 1000,
      height: 800,
      category: photoCategory,
    });

    setPhotoSrc("");
    setPhotoAlt("");
    setPhotoCaption("");
    toast.success("Photo published to gallery successfully!");
  };

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        toast.warning("Video file is larger than 100MB. IndexedDB storage active.");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setVideoInputUrl(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImageInputUrl(reader.result.toString());
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveHeroSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setHeroBgType(bgModeInput);
    if (bgModeInput === "video") {
      updateHeroVideo(videoInputUrl);
      toast.success("Cinematic video background updated on homepage hero!");
    } else {
      updateHeroImage(imageInputUrl);
      toast.success("Stunning background image applied to homepage hero!");
    }
  };

  const handleRemoveHeroMedia = () => {
    removeHeroVideo();
    setVideoInputUrl(coupleInfo.heroVideoUrl);
    setImageInputUrl(CURATED_HERO_IMAGES[0].url);
    setHeroBgType("video");
    setBgModeInput("video");
    toast.info("Custom hero media removed. Default Bangalore celebration background restored.");
  };

  // Construct standalone invite URL
  const getInviteCardUrl = () => {
    const cleanDomain = customDomain.trim().replace(/\/$/, "");
    const params = new URLSearchParams({
      guest: inviteGuestName || "Honored Guest",
      note: inviteNote,
      theme: inviteTheme,
    });
    return `${cleanDomain}/invite?${params.toString()}`;
  };

  // WhatsApp Invite Handlers
  const handleSendWhatsApp = () => {
    const inviteUrl = getInviteCardUrl();
    const text = `✨ *ROYAL WEDDING INVITATION* ✨\n\nDearest *${inviteGuestName}*,\n\nWith hearts full of love, we request the honor of your presence at our royal wedding celebration in Bangalore:\n\n👰 *ASWIN K & ANNAPOORNA* 🤵\n\n🗓 *Date*: November 21–22, 2026\n📍 *Location*: Bangalore, India (The Garden City)\n🏛 *Venues*: The Tamarind Tree & The Leela Palace\n\n💌 *Tap below to view your interactive digital invitation card & RSVP online*:\n${inviteUrl}\n\nWith warm regards,\nAswin & Annapoorna (#AswinWedsAnnapoorna)`;

    const cleanPhone = invitePhone.replace(/[^0-9]/g, "");
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(text)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;

    window.open(waUrl, "_blank");
    toast.success("Opened WhatsApp with your personalized digital card link!");
  };

  const handleCopyInviteText = () => {
    const inviteUrl = getInviteCardUrl();
    const text = `✨ ROYAL WEDDING INVITATION ✨\n\nDearest ${inviteGuestName},\n\nWith hearts full of love, we request the honor of your presence at our royal wedding celebration:\n\nASWIN K & ANNAPOORNA\n\nDate: November 21–22, 2026\nLocation: Bangalore, India\nVenues: The Tamarind Tree & The Leela Palace\n\nView Your Digital Invitation Card & RSVP Online:\n${inviteUrl}\n\nWith warm regards,\nAswin & Annapoorna`;

    navigator.clipboard.writeText(text);
    toast.success("Invitation message & card link copied to clipboard!");
  };

  const currentThemeObj = INVITE_THEMES.find((t) => t.key === inviteTheme) || INVITE_THEMES[0];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#22201E] flex items-center justify-center p-4 sm:p-6 text-[#FAF8F5]">
        <div className="max-w-md w-full bg-[#1F1D1A] border border-white/10 p-6 sm:p-10 rounded-sm shadow-2xl text-center">
          <div className="w-12 h-12 mx-auto mb-6 rounded-full bg-[#FAF8F5]/10 flex items-center justify-center text-[#C4B7A6]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl md:text-3xl tracking-wide mb-2">Admin Portal</h1>
          <p className="text-xs sm:text-sm text-[#C4B7A6] mb-8 leading-relaxed">
            Enter PIN to customize hero background, create WhatsApp invites, and manage gallery.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (2026)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full bg-black/40 border border-white/20 px-4 py-3 sm:py-3.5 text-center text-lg tracking-[0.3em] rounded-xs focus:outline-hidden focus:border-[#C4B7A6] transition-colors"
              autoFocus
            />
            {errorMsg && <p className="text-red-400 text-xs">{errorMsg}</p>}
            <button
              type="submit"
              className="w-full bg-[#FAF8F5] text-[#22201E] font-semibold py-3 sm:py-3.5 rounded-xs uppercase tracking-widest text-xs hover:bg-[#E8E2D9] transition-colors"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10">
            <Link
              href="/"
              className="text-xs text-[#C4B7A6] hover:text-white flex items-center justify-center space-x-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Live Website</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#22201E] py-8 sm:py-12 px-4 sm:px-8 md:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D9] mb-8">
          <div>
            <div className="flex items-center space-x-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#888178] mb-1">
              <Unlock className="w-3.5 h-3.5 text-[#C4B7A6]" />
              <span>Authenticated Admin</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#22201E]">Media & Site Customizer</h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => {
                resetToDefaults();
                toast.info("Site media reset to original Bangalore demo content!");
              }}
              className="px-3.5 py-2 border border-[#22201E]/20 text-[11px] uppercase tracking-widest hover:bg-[#22201E] hover:text-white transition-colors flex items-center gap-1.5 rounded-xs"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2 bg-[#22201E] text-[#FAF8F5] text-[11px] uppercase tracking-widest hover:bg-[#3A3632] transition-colors flex items-center gap-1.5 rounded-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Live Site</span>
            </Link>
          </div>
        </div>

        {/* Responsive Tabs */}
        <div className="flex border-b border-[#E8E2D9] mb-8 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
          <button
            onClick={() => setActiveTab("photos")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm tracking-wide border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "photos"
                ? "border-[#22201E] text-[#22201E]"
                : "border-transparent text-[#888178] hover:text-[#22201E]"
            }`}
          >
            <ImageIcon className="w-4 h-4 shrink-0" />
            <span>Photo Gallery ({photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm tracking-wide border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "hero"
                ? "border-[#22201E] text-[#22201E]"
                : "border-transparent text-[#888178] hover:text-[#22201E]"
            }`}
          >
            <Layout className="w-4 h-4 shrink-0" />
            <span>Hero Screen</span>
          </button>

          <button
            onClick={() => setActiveTab("invites")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm tracking-wide border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "invites"
                ? "border-[#22201E] text-[#22201E]"
                : "border-transparent text-[#888178] hover:text-[#22201E]"
            }`}
          >
            <Share2 className="w-4 h-4 shrink-0 text-emerald-700" />
            <span>WhatsApp Invite Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("rsvps")}
            className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium text-xs sm:text-sm tracking-wide border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "rsvps"
                ? "border-[#22201E] text-[#22201E]"
                : "border-transparent text-[#888178] hover:text-[#22201E]"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            <span>Guest RSVPs ({rsvps.length})</span>
          </button>
        </div>

        {/* Tab 1: Photo Manager */}
        {activeTab === "photos" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            {/* Left Upload Form */}
            <div className="lg:col-span-5 bg-white border border-[#E8E2D9] p-5 sm:p-7 rounded-sm shadow-2xs h-fit">
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl mb-5">Upload New Photo</h2>

              <form onSubmit={handleAddPhotoSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-2">
                    Select Image File or Paste URL
                  </label>
                  <div className="border-2 border-dashed border-[#E8E2D9] rounded-xs p-5 sm:p-6 text-center hover:border-[#C4B7A6] transition-colors bg-[#FAF8F5]/50">
                    <Upload className="w-5 h-5 mx-auto text-[#888178] mb-2" />
                    <span className="text-[11px] text-[#55514C] block mb-2">
                      Drag & Drop or Click to Choose File
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="text-[11px] text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-xs file:border-0 file:text-[11px] file:font-semibold file:bg-[#22201E] file:text-white hover:file:bg-[#3A3632]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1">
                    Or Direct Image URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={photoSrc.startsWith("data:") ? "" : photoSrc}
                    onChange={(e) => setPhotoSrc(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                  />
                </div>

                {photoSrc && (
                  <div className="relative aspect-16/10 rounded-xs overflow-hidden border border-[#E8E2D9] bg-black/5">
                    <Image src={photoSrc} alt="Preview" fill className="object-cover" />
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1">
                    Event Category
                  </label>
                  <select
                    value={photoCategory}
                    onChange={(e) => setPhotoCategory(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                  >
                    <option value="ceremony">Muhurtham / Ceremony</option>
                    <option value="mehendi">Mehendi & Sangeet</option>
                    <option value="reception">Reception Gala</option>
                    <option value="engagement">Engagement & Portraits</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1">
                    Photo Caption / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Joyful moments at Tamarind Tree"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!photoSrc}
                  className="w-full bg-[#22201E] text-white py-3 text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3A3632] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#C4B7A6]" />
                  <span>Publish to Gallery</span>
                </button>
              </form>
            </div>

            {/* Right Photo Grid */}
            <div className="lg:col-span-7 space-y-5">
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl">Published Gallery Photos</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="group relative bg-white border border-[#E8E2D9] rounded-sm overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-[#FAF8F5]">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-2.5 right-2.5 z-10">
                        <button
                          onClick={() => {
                            deletePhoto(photo.id);
                            toast.success("Photo removed from gallery.");
                          }}
                          className="bg-red-600/90 hover:bg-red-700 text-white p-2 rounded-xs shadow-md transition-colors"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C4B7A6]">
                          {photo.category}
                        </span>
                        {photo.id.startsWith("uploaded-") && (
                          <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-xs font-mono">
                            Admin Uploaded
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#22201E] font-medium truncate">
                        {photo.caption || photo.alt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Hero Screen Customizer (Image or Video) */}
        {activeTab === "hero" && (
          <div className="max-w-3xl bg-white border border-[#E8E2D9] p-5 sm:p-8 rounded-sm shadow-2xs space-y-6 sm:space-y-8">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl mb-1.5">Homepage Hero Screen Customizer</h2>
              <p className="text-xs text-[#55514C] leading-relaxed">
                Choose whether your website visitor is greeted by a cinematic background video or a stunning royal Indian wedding image.
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#FAF8F5] border border-[#E8E2D9] rounded-xs">
              <button
                type="button"
                onClick={() => setBgModeInput("image")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xs text-xs uppercase tracking-wider font-semibold transition-all ${
                  bgModeInput === "image"
                    ? "bg-[#22201E] text-white shadow-sm"
                    : "text-[#888178] hover:text-[#22201E]"
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0" />
                <span>Background Image Mode</span>
              </button>

              <button
                type="button"
                onClick={() => setBgModeInput("video")}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xs text-xs uppercase tracking-wider font-semibold transition-all ${
                  bgModeInput === "video"
                    ? "bg-[#22201E] text-white shadow-sm"
                    : "text-[#888178] hover:text-[#22201E]"
                }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>Background Video Mode</span>
              </button>
            </div>

            <form onSubmit={handleSaveHeroSettings} className="space-y-6">
              {/* If Image Mode is Active */}
              {bgModeInput === "image" ? (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-3">
                      Quick Select Curated Indian Royal Presets
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {CURATED_HERO_IMAGES.map((preset, idx) => {
                        const isSelected = imageInputUrl === preset.url;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setImageInputUrl(preset.url);
                              toast.info(`Selected preset: ${preset.name}`);
                            }}
                            className={`group relative aspect-4/3 rounded-xs overflow-hidden border-2 transition-all text-left ${
                              isSelected ? "border-[#22201E] shadow-md scale-[1.02]" : "border-[#E8E2D9] opacity-80 hover:opacity-100"
                            }`}
                          >
                            <Image src={preset.url} alt={preset.name} fill className="object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                              <span className="text-[10px] text-white font-medium leading-tight">{preset.name}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-[#22201E] text-white rounded-full p-1">
                                <Check className="w-3 h-3" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-2">
                        Upload Image File
                      </label>
                      <div className="border border-dashed border-[#E8E2D9] rounded-xs p-4 text-center bg-[#FAF8F5]/50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-xs file:border-0 file:text-[11px] file:font-semibold file:bg-[#22201E] file:text-white hover:file:bg-[#3A3632]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-2">
                        Or Direct Image URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={imageInputUrl.startsWith("data:") ? "" : imageInputUrl}
                        onChange={(e) => setImageInputUrl(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* If Video Mode is Active */
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-2">
                      Upload Video File (.mp4 / .webm)
                    </label>
                    <div className="border-2 border-dashed border-[#E8E2D9] rounded-xs p-5 text-center bg-[#FAF8F5]/50">
                      <Video className="w-5 h-5 mx-auto text-[#888178] mb-1.5" />
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/*"
                        onChange={handleVideoFileUpload}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xs file:border-0 file:text-xs file:font-semibold file:bg-[#22201E] file:text-white hover:file:bg-[#3A3632]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#55514C] mb-2">
                      Or Direct Video URL (CDN / Vercel Blob)
                    </label>
                    <input
                      type="url"
                      placeholder="https://assets.mixkit.co/..."
                      value={videoInputUrl.startsWith("data:") ? "" : videoInputUrl}
                      onChange={(e) => setVideoInputUrl(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-4 py-3 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                    />
                  </div>
                </div>
              )}

              {/* Live Preview Box */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#55514C]">
                    Live Screen Preview ({bgModeInput.toUpperCase()})
                  </label>
                  <span className="text-[10px] text-[#888178]">Desktop & Mobile Compatible</span>
                </div>
                <div className="aspect-16/9 bg-black rounded-xs overflow-hidden relative border border-[#E8E2D9] shadow-inner">
                  {bgModeInput === "image" ? (
                    <Image
                      src={imageInputUrl || CURATED_HERO_IMAGES[0].url}
                      alt="Hero Image Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      key={videoInputUrl || heroVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    >
                      <source src={videoInputUrl || heroVideoUrl} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#22201E] text-white py-3.5 text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-[#3A3632] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#C4B7A6] shrink-0" />
                  <span>Save Live Hero Background</span>
                </button>

                <button
                  type="button"
                  onClick={handleRemoveHeroMedia}
                  className="px-5 py-3.5 border border-red-200 bg-red-50 text-red-700 text-xs uppercase tracking-widest font-semibold rounded-xs hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Remove & Restore Default</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: WhatsApp Invite Studio */}
        {activeTab === "invites" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            {/* Left Customizer Form */}
            <div className="lg:col-span-6 bg-white border border-[#E8E2D9] p-5 sm:p-8 rounded-sm shadow-2xs space-y-6">
              <div>
                <div className="flex items-center gap-2 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Digital Invitation Studio</span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl text-[#22201E]">Personalize & Send Invitation</h2>
                <p className="text-xs text-[#55514C] mt-1 leading-relaxed">
                  Generates a dedicated Vercel-hosted standalone invitation card URL (`/invite?guest=...`) for each guest!
                </p>
              </div>

              <div className="space-y-4">
                {/* Production Domain Setting */}
                <div className="bg-[#FAF8F5] p-3 rounded-xs border border-[#E8E2D9]">
                  <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Vercel / Live Public Domain URL</span>
                  </label>
                  <input
                    type="url"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="https://your-wedding.vercel.app"
                    className="w-full bg-white border border-[#E8E2D9] px-3 py-2 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E] font-mono text-emerald-800"
                  />
                  <p className="text-[10px] text-[#888178] mt-1">
                    This public link is embedded in the WhatsApp message so guests open your invitation card online.
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">
                    Guest Name / Family Name
                  </label>
                  <input
                    type="text"
                    value={inviteGuestName}
                    onChange={(e) => setInviteGuestName(e.target.value)}
                    placeholder="e.g. Sri Rajesh Sharma & Family"
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E] font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">
                    Guest WhatsApp Mobile Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210 (Leave empty to pick from contacts)"
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] px-3.5 py-2.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-1.5">
                    Personalized Invitation Note
                  </label>
                  <textarea
                    rows={3}
                    value={inviteNote}
                    onChange={(e) => setInviteNote(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E2D9] p-3.5 text-xs rounded-xs focus:outline-hidden focus:border-[#22201E] leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#55514C] mb-2">
                    Visual Card Theme Style (8 Luxury Colorways)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {INVITE_THEMES.map((th) => {
                      const isSelected = inviteTheme === th.key;
                      return (
                        <button
                          key={th.key}
                          type="button"
                          onClick={() => setInviteTheme(th.key)}
                          className={`p-2.5 rounded-xs border text-center text-xs font-medium transition-all flex flex-col items-center justify-center gap-1 ${
                            isSelected
                              ? `${th.bgClass} ${th.borderClass} ${th.textClass} shadow-md ring-2 ring-current font-semibold scale-[1.02]`
                              : "bg-white border-[#E8E2D9] text-[#66625D] hover:border-[#C4B7A6]"
                          }`}
                        >
                          <span className="truncate w-full">{th.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Generated URL Box */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
                    Generated Standalone Invitation Link
                  </span>
                  <Link
                    href={`/invite?guest=${encodeURIComponent(inviteGuestName)}&theme=${inviteTheme}&note=${encodeURIComponent(inviteNote)}`}
                    target="_blank"
                    className="text-[10px] text-emerald-700 hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Test Card in New Tab</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-[11px] font-mono text-emerald-900 break-all bg-white p-2 border border-emerald-100 rounded-xs">
                  {getInviteCardUrl()}
                </p>
              </div>

              {/* Action Share Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleSendWhatsApp}
                  className="flex-1 bg-[#25D366] hover:bg-[#20BD5A] text-white py-3.5 px-6 rounded-xs font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyInviteText}
                  className="px-5 py-3.5 bg-[#22201E] hover:bg-[#3A3632] text-white rounded-xs font-semibold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Text & Link</span>
                </button>
              </div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="w-full mb-3 flex justify-between items-center px-1">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#888178]">
                  Live Digital Card Preview ({currentThemeObj.name})
                </span>
                <span className="text-[10px] text-[#C4B7A6] italic">Ready to share</span>
              </div>

              {/* The Styled Card */}
              <div
                className={`w-full max-w-md p-8 sm:p-10 rounded-sm border-2 shadow-xl relative overflow-hidden transition-all duration-300 text-center ${currentThemeObj.bgClass} ${currentThemeObj.borderClass} ${currentThemeObj.textClass}`}
              >
                {/* Decorative Frame */}
                <div className="absolute inset-3 border border-current/15 pointer-events-none rounded-2xs" />

                <div className="relative z-10 space-y-6">
                  <div className="text-[10px] uppercase tracking-[0.35em] text-current/70">
                    The Wedding Celebration
                  </div>

                  <div className="font-serif text-3xl sm:text-4xl tracking-wide uppercase font-light">
                    Aswin{" "}
                    <span className="italic font-normal text-2xl text-current/60 mx-1">&amp;</span>{" "}
                    Annapoorna
                  </div>

                  <div className="w-12 h-[1px] bg-current/30 mx-auto" />

                  <div className="py-2.5 bg-current/5 border border-current/15 rounded-xs px-4">
                    <p className="text-[10px] uppercase tracking-widest text-current/60 mb-0.5">Inviting</p>
                    <p className="font-serif text-lg sm:text-xl font-medium tracking-wide">
                      {inviteGuestName || "Honored Guest"}
                    </p>
                  </div>

                  <p className="font-serif italic text-sm sm:text-base leading-relaxed text-current/90 px-2">
                    &ldquo;{inviteNote}&rdquo;
                  </p>

                  <div className="text-xs uppercase tracking-[0.2em] space-y-1 pt-2">
                    <p className="font-semibold">{coupleInfo.weddingDateDisplay}</p>
                    <p className="text-[11px] text-current/75">Bangalore, India</p>
                  </div>

                  <div className="pt-4 border-t border-current/15">
                    <button
                      onClick={handleSendWhatsApp}
                      className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-wider shadow-md hover:bg-[#20BD5A] transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send via WhatsApp</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: RSVPs */}
        {activeTab === "rsvps" && (
          <div className="bg-white border border-[#E8E2D9] rounded-sm overflow-hidden shadow-2xs">
            <div className="p-5 sm:p-6 border-b border-[#E8E2D9]">
              <h2 className="font-serif text-lg sm:text-xl md:text-2xl">Guest RSVP Responses</h2>
              <p className="text-xs text-[#55514C]">Real-time guest confirmations submitted via the website.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E8E2D9] uppercase tracking-wider text-[#888178]">
                    <th className="p-3.5 sm:p-4 font-semibold">Guest Name</th>
                    <th className="p-3.5 sm:p-4 font-semibold">Attending</th>
                    <th className="p-3.5 sm:p-4 font-semibold">Count</th>
                    <th className="p-3.5 sm:p-4 font-semibold">Dietary Notes</th>
                    <th className="p-3.5 sm:p-4 font-semibold">Events</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9]">
                  {rsvps.map((r) => (
                    <tr key={r.id} className="hover:bg-[#FAF8F5]/50 transition-colors">
                      <td className="p-3.5 sm:p-4 font-medium text-[#22201E] whitespace-nowrap">{r.name}</td>
                      <td className="p-3.5 sm:p-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-100 text-green-800 uppercase tracking-wide">
                          {r.attending}
                        </span>
                      </td>
                      <td className="p-3.5 sm:p-4 whitespace-nowrap">{r.guests}</td>
                      <td className="p-3.5 sm:p-4 text-[#55514C]">{r.dietary || "None"}</td>
                      <td className="p-3.5 sm:p-4">
                        <div className="flex flex-wrap gap-1">
                          {(r.events || []).map((ev: string) => (
                            <span key={ev} className="bg-[#FAF8F5] border border-[#E8E2D9] px-1.5 py-0.5 rounded-xs text-[10px] whitespace-nowrap">
                              {ev}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
