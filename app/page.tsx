"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Sparkles,
  Calendar,
  ShieldCheck,
  MessageCircle,
  ArrowRight,
  Layers,
  Database,
  Lock,
  Globe,
  UserPlus,
  Eye,
  Palette,
  MapPin,
  Scan,
  Type,
  Trash2,
  CheckCircle2,
  Crown,
} from "lucide-react";

const DEMO_PRESETS = [
  {
    slug: "rahul-anjali",
    couple: "Rahul Sharma & Anjali Mehta",
    themeName: "Midnight Velvet",
    themeKey: "velvet",
    themeBadgeClass: "bg-[#1F1D1A] text-[#FAF8F5] border-[#D4AF37]",
    venue: "Umaid Bhawan Palace, Jaipur",
    date: "Dec 14–15, 2026",
    vibe: "Dark Royal Gold • Sufi Sangeet & Palace Courtyard Nuptials",
  },
  {
    slug: "rahul-priya-2026",
    couple: "Rahul Sharma & Priya Mehta",
    themeName: "Alabaster Cream",
    themeKey: "alabaster",
    themeBadgeClass: "bg-[#FAF8F5] text-[#22201E] border-[#C4B7A6]",
    venue: "The Tamarind Tree, Bangalore",
    date: "Nov 21–22, 2026",
    vibe: "Warm Sandalwood • South Indian Muhurtham & Leela Gala",
  },
  {
    slug: "vikram-pooja",
    couple: "Vikram Rao & Pooja Nair",
    themeName: "Heritage Emerald",
    themeKey: "emerald",
    themeBadgeClass: "bg-[#112A21] text-[#FAF8F5] border-[#D4AF37]",
    venue: "Taj Lake Palace, Udaipur",
    date: "Jan 18–19, 2027",
    vibe: "Deep Emerald Green • Lakeside Mehendi & Island Mandap",
  },
  {
    slug: "sneha-arjun",
    couple: "Sneha Kapoor & Arjun Verma",
    themeName: "Jaipur Rose Blossom",
    themeKey: "rose",
    themeBadgeClass: "bg-[#FFF8F8] text-[#4A1D24] border-[#D48C9A]",
    venue: "Oberoi Amarvilas, Agra",
    date: "Feb 14, 2027",
    vibe: "Soft Romantic Rose Quartz • Fountain Vows & Harp Symphony",
  },
];

export default function VivahaLuxeHomepage() {
  const router = useRouter();

  const handleSelectPresetToEdit = (themeKey: string, themeName: string) => {
    const isAuth = sessionStorage.getItem("admin_authenticated") === "true";
    if (!isAuth) {
      sessionStorage.setItem("vivaha_pending_theme", themeKey);
      toast.error(`Please sign in first to apply the ${themeName} style to your celebration!`);
      router.push("/auth/login");
      return;
    }

    sessionStorage.setItem("vivaha_pending_theme", themeKey);
    toast.success(`Applied ${themeName} template style to your Studio!`);
    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#22201E] font-sans flex flex-col justify-between selection:bg-emerald-900 selection:text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#112A21] via-[#1A3A2F] to-[#112A21] text-white py-3 px-4 text-center text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
        <span>VivahaLuxe v2.0 Live: AI Card Scanner, 18+ Custom Royal Fonts &amp; Safe PostgreSQL Storage!</span>
        <Link href="/support" className="underline font-bold text-[#D4AF37] ml-2 hidden sm:inline flex items-center gap-1">
          <span>Need Help? Chat +91 7012406453</span>
        </Link>
      </div>

      {/* Navigation Bar */}
      <header className="border-b border-[#E8E2D9] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#22201E] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-lg">
              V
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#22201E] block leading-none">
                Vivaha<span className="text-emerald-800 font-light italic">Luxe</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#888178]">Wedding Platform Suite</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/features"
              className="text-xs font-semibold uppercase tracking-wider text-[#55514C] hover:text-emerald-800 px-3 py-2 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-xs font-semibold uppercase tracking-wider text-[#55514C] hover:text-emerald-800 px-3 py-2 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/support"
              className="text-xs font-semibold uppercase tracking-wider text-[#55514C] hover:text-emerald-800 px-3 py-2 transition-colors"
            >
              Support
            </Link>
            <Link
              href="/auth/login"
              className="text-xs font-semibold uppercase tracking-wider text-[#55514C] hover:text-[#22201E] px-3 py-2 transition-colors"
            >
              Sign In
            </Link>

            <Link
              href="/auth/register"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 bg-[#22201E] text-white text-xs font-semibold uppercase tracking-widest rounded-xs hover:bg-[#3A3632] transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Free</span>
            </Link>

            <Link
              href="/support"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#25D366]/15 border border-[#25D366]/40 text-[#16783B] text-xs font-bold uppercase tracking-wider rounded-full hover:bg-[#25D366] hover:text-white transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Support</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-[#E8E2D9]/60 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-[#55514C]">
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>The #1 Luxury Digital Wedding Portal</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[1.08] text-[#22201E]">
            Craft Royal Digital <br />
            <span className="italic font-light text-emerald-900">Invitations</span> &amp; Memories.
          </h1>

          <p className="text-base sm:text-lg text-[#66625D] max-w-2xl mx-auto leading-relaxed font-normal">
            Create stunning digital invitation cards, extract details instantly using AI, and seamlessly broadcast to all your guests via our advanced WhatsApp Gateway integration with real-time delivery tracking.
          </p>
          <div className="flex justify-center pt-4">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#FAF8F5] border border-[#C4B7A6] text-[#22201E] hover:border-[#D4AF37] hover:text-emerald-900 text-xs font-bold uppercase tracking-widest rounded-xs transition-all shadow-sm group"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37] group-hover:scale-110 transition-transform" />
              <span>Explore All Platform Features</span>
            </Link>
          </div>
        </div>

        {/* NEW ADVANCED FEATURES SHOWCASE: AI Scanner & Custom Typography */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left pt-6 border-t border-[#E8E2D9]">
          {/* Feature 1: AI Card Scanner */}
          <div className="bg-gradient-to-br from-[#1F1D1A] to-[#2B2723] text-white p-8 sm:p-10 rounded-sm shadow-xl border border-[#D4AF37]/30 flex flex-col justify-between space-y-6 relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xs bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
                  <Scan className="w-6 h-6" />
                </div>
                <span className="bg-[#D4AF37] text-[#1F1D1A] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>Pro AI Model</span>
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#FAF8F5]">
                AI Wedding Card Extraction Scanner
              </h3>
              <p className="text-xs sm:text-sm text-[#C4B7A6] leading-relaxed">
                Skip manual data entry completely! Simply upload a photo of your printed wedding invitation card or flyer. Our high-precision **Google Gemini Pro AI model** automatically analyzes the imagery and extracts Bride &amp; Groom names, exact muhurtham dates, venue addresses, and schedule details instantly into your digital invitation studio.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold pt-2 border-t border-white/10">
              <Sparkles className="w-4 h-4" />
              <span>Right to use Pro AI models is reserved for paid users • Zero manual typing required</span>
            </div>
          </div>

          {/* Feature 2: Custom Luxury Fonts & Typography Suite */}
          <div className="bg-white p-8 sm:p-10 rounded-sm shadow-xl border border-[#E8E2D9] flex flex-col justify-between space-y-6 group hover:border-[#D4AF37] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xs bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800">
                  <Type className="w-6 h-6" />
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  Custom Typography Suite
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#22201E]">
                18+ Curated Royal Google Fonts
              </h3>
              <p className="text-xs sm:text-sm text-[#66625D] leading-relaxed">
                Elevate your invitation aesthetics with our tailored typography engine. Couples can seamlessly switch between world-class calligraphy, classic serif, and modern script typography styles—including **Bodoni Moda, Alex Brush, Cormorant Garamond, Cinzel, Great Vibes, Playfair Display, and WindSong**—ensuring every guest sees flawless royal typography.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-[#E8E2D9] text-xs font-serif italic text-[#55514C]">
              <span className="text-base font-bold text-[#D4AF37]">Aa</span>
              <span>&ldquo;Elegance is the only beauty that never fades.&rdquo; — Instant font switching</span>
            </div>
          </div>
        </div>

        {/* PROMINENT DATA PRIVACY & 100% ACCOUNT DELETION GUARANTEE BANNER */}
        <div className="bg-gradient-to-r from-[#112A21] via-[#16382C] to-[#112A21] text-white p-8 sm:p-12 rounded-sm shadow-2xl border border-emerald-500/30 text-left space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-emerald-400/20 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-[#4ade80] bg-emerald-950/80 px-3.5 py-1.5 rounded-full border border-emerald-500/40">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise Data Sovereignty &amp; Trust Guarantee</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-light">
                Your Privacy &amp; Data Security Come First
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Link
                href="/privacy"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-xs text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Privacy Policy</span>
              </Link>
              <Link
                href="/terms"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-xs text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4ade80]" />
                <span>Terms of Service</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="bg-emerald-950/60 p-5 rounded-xs border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm uppercase tracking-wider">
                <Lock className="w-4 h-4 text-[#D4AF37]" />
                <span>1. Zero Data Selling Policy</span>
              </div>
              <p className="text-[#A3C1B4] leading-relaxed">
                We are strictly **not using any user data to sell to customers, commercial partners, or advertisers**. Your guest contact lists, couple biographies, and RSVPs remain entirely private and unmonetized.
              </p>
            </div>

            <div className="bg-emerald-950/60 p-5 rounded-xs border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm uppercase tracking-wider">
                <Database className="w-4 h-4 text-blue-400" />
                <span>2. Safe PostgreSQL Storage</span>
              </div>
              <p className="text-[#A3C1B4] leading-relaxed">
                All celebration schedules, authentication tokens, and user credentials are safely stored inside our encrypted, enterprise-grade **PostgreSQL / CockroachDB Serverless** database with continuous SSL security.
              </p>
            </div>

            <div className="bg-emerald-950/60 p-5 rounded-xs border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2 font-bold text-white text-sm uppercase tracking-wider">
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>3. 100% Account Deletion Right</span>
              </div>
              <p className="text-[#A3C1B4] leading-relaxed">
                You retain complete sovereignty over your data lifecycle. **Users can delete their account whenever they want**, instantly and permanently wiping every trace of their personal information and photos from our database.
              </p>
            </div>
          </div>
        </div>

        {/* 4 Interactive Demo Presets Showcase */}
        <div className="space-y-6 pt-4 border-t border-[#E8E2D9]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              <Palette className="w-3.5 h-3.5" />
              <span>Interactive Preset Template Showcase</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl">Experience 4 Distinct Royal Celebrations</h2>
            <p className="text-xs text-[#66625D] max-w-xl mx-auto">
              Select any pre-configured template below to view its live multi-section website or load its design directly into your custom configurator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {DEMO_PRESETS.map((demo) => (
              <div
                key={demo.slug}
                className="bg-white border-2 border-[#E8E2D9] hover:border-[#D4AF37] p-6 rounded-sm shadow-md transition-all flex flex-col justify-between space-y-6 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-xs ${demo.themeBadgeClass}`}>
                      {demo.themeName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">/invite/{demo.slug}</span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#22201E] group-hover:text-emerald-900 transition-colors">
                    {demo.couple}
                  </h3>

                  <div className="space-y-1 text-xs text-[#66625D]">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">{demo.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{demo.date}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#888178] leading-relaxed italic border-t border-[#E8E2D9] pt-2.5">
                    &ldquo;{demo.vibe}&rdquo;
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <Link
                    href={`/invite/${demo.slug}`}
                    target="_blank"
                    className="w-full bg-[#22201E] hover:bg-[#3A3632] text-white py-2.5 rounded-xs text-[11px] font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 shadow-sm transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Launch Live Demo Page</span>
                  </Link>

                  <button
                    onClick={() => handleSelectPresetToEdit(demo.themeKey, demo.themeName)}
                    className="w-full bg-[#FAF8F5] hover:bg-[#E8E2D9] text-[#22201E] border border-[#C4B7A6] py-2 rounded-xs text-[10px] font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3 h-3 text-[#D4AF37]" />
                    <span>Adopt Style (Login Req)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Portal Access Grid (SUPER ADMIN DETAILS COMPLETELY REMOVED) */}
        <div className="space-y-6 text-left pt-8 border-t border-[#E8E2D9]">
          <div className="text-center">
            <h2 className="font-serif text-2xl sm:text-3xl">Platform Command Gateways</h2>
            <p className="text-xs text-[#888178] uppercase tracking-widest mt-1">Instant Direct Navigation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Couple Dashboard */}
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E8E2D9] shadow-2xs space-y-4 hover:border-[#22201E] transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xs bg-emerald-900 text-white flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold">Couple Studio Dashboard</h3>
                <p className="text-xs text-[#66625D] leading-relaxed">
                  Configure couple names, wedding dates, event schedules (Haldi, Mehendi, Muhurtham, Reception), custom map links, select from 12 themes, or run AI Card Scans.
                </p>
              </div>
              <Link href="/admin" className="text-xs uppercase tracking-widest font-bold text-emerald-800 flex items-center gap-1.5 pt-4 hover:underline">
                <span>Enter Studio Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Support & Concierge */}
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-[#E8E2D9] shadow-2xs space-y-4 hover:border-[#22201E] transition-all flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xs bg-[#25D366] text-white flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold">Help &amp; WhatsApp Support</h3>
                <p className="text-xs text-[#66625D] leading-relaxed">
                  Dedicated assistance center with interactive FAQ, support tickets, and direct 1-click WhatsApp concierge chat connected to lead engineer **(+91 7012406453)**.
                </p>
              </div>
              <Link href="/support" className="text-xs uppercase tracking-widest font-bold text-[#16783B] flex items-center gap-1.5 pt-4 hover:underline">
                <span>Open Support Hub (+91 7012406453)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Themes Showcase Grid */}
        <div className="space-y-8 pt-6 border-t border-[#E8E2D9]">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl">12 Curated Indian Wedding Luxury Themes</h2>
            <p className="text-xs uppercase tracking-[0.25em] text-[#888178]">Tailored Colorways &amp; Responsive Layouts</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              { name: "Alabaster Cream", bg: "bg-[#FAF8F5] text-[#22201E] border-[#C4B7A6]" },
              { name: "Midnight Velvet", bg: "bg-[#1F1D1A] text-[#FAF8F5] border-[#D4AF37]" },
              { name: "Heritage Emerald", bg: "bg-[#112A21] text-[#FAF8F5] border-[#D4AF37]" },
              { name: "Jaipur Rose", bg: "bg-[#FFF8F8] text-[#4A1D24] border-[#D48C9A]" },
              { name: "Sunset Marigold", bg: "bg-[#2A1808] text-[#FFF6ED] border-[#E8984E]" },
              { name: "Mysore Royal Silk", bg: "bg-[#0A1628] text-[#F3EAD8] border-[#C5A059]" },
              { name: "Kanchipuram Crimson", bg: "bg-[#380B10] text-[#FCEEE3] border-[#E6C280]" },
              { name: "Minimalist Ivory", bg: "bg-[#FFFFFF] text-[#1F1D1A] border-[#E0DCD5]" },
              { name: "Royal Peacock Teal", bg: "bg-[#0A2229] text-[#E8F8FA] border-[#38A3A5]" },
              { name: "Sacred Pink Lotus", bg: "bg-[#FFF0F5] text-[#5C1D34] border-[#D8829D]" },
              { name: "Mysore Sandalwood", bg: "bg-[#2A2019] text-[#F3E6DA] border-[#C19A6B]" },
              { name: "Banarasi Brocade", bg: "bg-[#201035] text-[#F8F2FF] border-[#D4AF37]" },
            ].map((t, i) => (
              <div
                key={i}
                className={`p-4 rounded-xs border text-center font-serif text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center min-h-20 ${t.bg}`}
              >
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E2D9] bg-white py-8 px-4 sm:px-8 text-center text-xs text-[#888178] space-y-4">
        <p className="uppercase tracking-[0.25em]">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-[#22201E]">VivahaLuxe</span> • All Rights Reserved
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-semibold">
          <Link href="/features" className="hover:text-[#22201E] transition-colors">Features</Link>
          <Link href="/auth/login" className="hover:text-[#22201E] transition-colors">Sign In</Link>
          <Link href="/auth/register" className="hover:text-[#22201E] transition-colors">Register</Link>
          <Link href="/admin" className="hover:text-[#22201E] transition-colors">Studio Dashboard</Link>
          <Link href="/privacy" className="text-[#D4AF37] hover:underline transition-colors flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Privacy Policy</span>
          </Link>
          <Link href="/terms" className="text-emerald-800 hover:underline transition-colors flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Terms of Service</span>
          </Link>
          <Link href="/support" className="text-[#16783B] hover:underline transition-colors">WhatsApp Support (+91 7012406453)</Link>
        </div>
      </footer>
    </div>
  );
}

