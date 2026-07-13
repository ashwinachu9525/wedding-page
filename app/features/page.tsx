import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  MessageCircle,
  Layers,
  Palette,
  MapPin,
  Scan,
  Type,
  CheckCircle2,
  Image as ImageIcon,
  UserPlus,
  Lock,
} from "lucide-react";

export const metadata = {
  title: "Features - VivahaLuxe",
  description: "Explore the luxury digital wedding invitation features of VivahaLuxe.",
};

const features = [
  {
    title: "AI Card Scanner",
    description: "Upload printed card photos, auto-extract details (Bride, Groom, Dates, Venues) instantly using our Gemini Pro AI model.",
    icon: <Scan className="w-6 h-6 text-emerald-700" />,
    badge: "Pro AI Model",
  },
  {
    title: "Custom Typography Suite",
    description: "Elevate your aesthetics with 18+ Curated Royal Google Fonts including Bodoni Moda, Great Vibes, and Cormorant Garamond.",
    icon: <Type className="w-6 h-6 text-amber-600" />,
  },
  {
    title: "12 Luxury Themes",
    description: "From Alabaster Cream to Midnight Velvet, pick the perfect colorway and style for your celebration.",
    icon: <Palette className="w-6 h-6 text-rose-600" />,
  },
  {
    title: "Multi-Event Support",
    description: "Manage Haldi, Mehendi, Muhurtham, and Reception details all in one unified, elegant digital invitation.",
    icon: <Layers className="w-6 h-6 text-blue-600" />,
  },
  {
    title: "Guest RSVP Tracking",
    description: "One-tap responses, live counts, dietary preferences, and event-specific attendance tracking.",
    icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
  },
  {
    title: "Venue Directions & Maps",
    description: "Easy navigation links directly to venues via Google Maps for seamless and stress-free guest arrivals.",
    icon: <MapPin className="w-6 h-6 text-red-600" />,
  },
  {
    title: "Beautiful Photo Gallery",
    description: "Showcase your engagement and pre-wedding photoshoot beautifully directly on the invitation page.",
    icon: <ImageIcon className="w-6 h-6 text-purple-600" />,
  },
  {
    title: "Data Privacy & Security",
    description: "Enterprise Data Sovereignty: Zero data selling, secure PostgreSQL storage, and 100% account deletion capability.",
    icon: <ShieldCheck className="w-6 h-6 text-emerald-800" />,
  },
  {
    title: "WhatsApp API Gateway",
    description: "Connect your WhatsApp via QR code and broadcast beautiful invitations instantly to all your guests with live read receipts.",
    icon: <MessageCircle className="w-6 h-6 text-[#25D366]" />,
  },
];

export default function FeaturesPage() {
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
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#22201E] text-[#FAF8F5] flex items-center justify-center font-serif font-bold text-lg">
              V
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#22201E] block leading-none">
                Vivaha<span className="text-emerald-800 font-light italic">Luxe</span>
              </span>
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#888178]">Wedding Platform Suite</span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/features"
              className="text-xs font-semibold uppercase tracking-wider text-emerald-800 px-3 py-2 transition-colors"
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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-16 text-center">
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-[#E8E2D9]/60 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-[#55514C]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Platform Features</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] text-[#22201E]">
            Everything you need for a <br className="hidden sm:block" />
            <span className="italic font-light text-emerald-900">Luxury Digital Celebration</span>
          </h1>

          <p className="text-base sm:text-lg text-[#66625D] max-w-2xl mx-auto leading-relaxed font-normal">
            From AI-powered card scanning to custom typography and multi-event RSVPs, VivahaLuxe provides all the tools to create stunning, personalized digital wedding invitations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left pt-8 border-t border-[#E8E2D9]">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-sm shadow-xl border border-[#E8E2D9] flex flex-col justify-start space-y-4 group hover:border-emerald-700 hover:shadow-2xl transition-all">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xs bg-[#FAF8F5] border border-[#E8E2D9] flex items-center justify-center group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                {feature.badge && (
                  <span className="bg-[#D4AF37] text-[#1F1D1A] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                    {feature.badge}
                  </span>
                )}
              </div>
              <h3 className="font-serif text-2xl font-light text-[#22201E]">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#66625D] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="pt-16 pb-8 border-t border-[#E8E2D9]">
          <div className="bg-gradient-to-r from-[#112A21] via-[#16382C] to-[#112A21] text-white p-8 sm:p-12 rounded-sm shadow-2xl border border-emerald-500/30 flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl font-light">
              Ready to craft your royal invitation?
            </h2>
            <p className="text-sm text-[#A3C1B4] max-w-xl">
              Join VivahaLuxe today and start building your bespoke digital wedding experience with our intuitive studio dashboard.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold tracking-widest uppercase transition-all focus-visible:outline-none h-12 rounded-xs px-8 bg-[#D4AF37] hover:bg-[#C5A059] text-[#1F1D1A] shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E2D9] bg-white py-8 px-4 sm:px-8 text-center text-xs text-[#888178] space-y-4">
        <p className="uppercase tracking-[0.25em]">
          &copy; {new Date().getFullYear()} <span className="font-semibold text-[#22201E]">VivahaLuxe</span> • All Rights Reserved
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 text-xs font-semibold">
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
