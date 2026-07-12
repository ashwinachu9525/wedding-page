import React from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, X, ShieldCheck, CreditCard, Gift, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Pricing - VivahaLuxe",
  description: "Simple, transparent pricing for your luxury digital wedding invitation.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#22201E] font-sans selection:bg-emerald-900 selection:text-white">
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
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#55514C] hover:text-[#22201E] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="px-5 py-2.5 bg-[#22201E] text-[#FAF8F5] text-xs font-bold uppercase tracking-widest hover:bg-[#3A3632] transition-colors rounded-xs shadow-md"
            >
              Create Free Invitation
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 space-y-20">
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#E8E2D9]/60 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-[0.2em] text-[#55514C]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Simple, Transparent Pricing</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-[#22201E] leading-tight">
            One Perfect Day, <br/>
            <span className="italic font-light text-emerald-900">One Simple Price.</span>
          </h1>
          
          <p className="text-base sm:text-lg text-[#66625D] leading-relaxed">
            Start creating your beautiful invitation for free. Upgrade to Premium for ₹499 when you're ready to unlock exclusive themes, AI scanners, and WhatsApp broadcasting. No hidden fees or recurring subscriptions.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">
          
          {/* Free Tier */}
          <div className="bg-white border border-[#E8E2D9] rounded-sm p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow relative">
            <h3 className="text-xl font-serif text-[#22201E] mb-2">Basic Elegance</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-[#22201E]">₹0</span>
              <span className="text-sm text-[#888178] uppercase tracking-wider font-semibold">/ forever</span>
            </div>
            <p className="text-sm text-[#66625D] mb-8 pb-8 border-b border-[#E8E2D9]">
              Perfect for getting started and designing your dream wedding invitation layout.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#888178] shrink-0 mt-0.5" />
                <span className="text-sm text-[#55514C]">Access to 3 Standard Themes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#888178] shrink-0 mt-0.5" />
                <span className="text-sm text-[#55514C]">Standard Web Typography</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#888178] shrink-0 mt-0.5" />
                <span className="text-sm text-[#55514C]">Basic RSVP Tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 line-through">WhatsApp API Broadcasting</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 line-through">Pro AI Card Scanner</span>
              </li>
              <li className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400 line-through">Custom Domain Connection</span>
              </li>
            </ul>

            <Link
              href="/auth/register"
              className="block w-full text-center px-6 py-4 border-2 border-[#22201E] text-[#22201E] hover:bg-[#22201E] hover:text-[#FAF8F5] text-xs font-bold uppercase tracking-widest rounded-xs transition-colors"
            >
              Start Designing Free
            </Link>
          </div>

          {/* Premium Tier */}
          <div className="bg-gradient-to-b from-[#112A21] to-[#1A3A2F] text-white rounded-sm p-8 sm:p-10 shadow-2xl relative border border-[#D4AF37]/30 transform md:-translate-y-4">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#D4AF37] text-[#112A21] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Most Popular</span>
            </div>
            
            <h3 className="text-xl font-serif text-[#FAF8F5] mb-2 flex items-center gap-2">
              Royal Premium
            </h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl sm:text-5xl font-bold text-[#D4AF37]">₹499</span>
              <span className="text-sm text-[#888178] uppercase tracking-wider font-semibold">/ one-time fee</span>
            </div>
            <p className="text-sm text-[#A3C1B4] mb-8 pb-8 border-b border-white/10">
              The ultimate wedding suite. Pay once and unlock every premium feature for your entire marriage celebration.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-sm text-[#FAF8F5]">Access to all 12 Luxury Themes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-sm text-[#FAF8F5]">18+ Custom Royal Google Fonts</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-sm text-[#FAF8F5] font-semibold">WhatsApp Gateway Broadcasting & Delivery Tracking</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-sm text-[#FAF8F5] font-semibold">Google Gemini Pro AI Card Extraction</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-sm text-[#FAF8F5]">Advanced RSVP Management & CSV Exports</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-sm text-[#FAF8F5]">Remove VivahaLuxe Watermarks</span>
              </li>
            </ul>

            <Link
              href="/auth/register"
              className="block w-full text-center px-6 py-4 bg-[#D4AF37] text-[#112A21] hover:bg-[#b5952f] text-xs font-bold uppercase tracking-widest rounded-xs transition-colors shadow-xl"
            >
              Get Premium Access
            </Link>
          </div>

        </div>

        {/* FAQ or Trust Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto pt-16 border-t border-[#E8E2D9]">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#E8E2D9]">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-serif font-semibold text-[#22201E]">Secure Payments</h4>
            <p className="text-xs text-[#66625D]">Processed safely via Razorpay API.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#E8E2D9]">
              <CreditCard className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-serif font-semibold text-[#22201E]">One-Time Fee</h4>
            <p className="text-xs text-[#66625D]">No hidden subscriptions or recurring charges.</p>
          </div>
          <div className="text-center space-y-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm border border-[#E8E2D9]">
              <Gift className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-serif font-semibold text-[#22201E]">Lifetime Access</h4>
            <p className="text-xs text-[#66625D]">Your portal stays live as long as you want.</p>
          </div>
        </div>

        <div className="text-center pt-8">
          <Link href="/support" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 hover:text-emerald-600 transition-colors">
            <span>Still have questions? Contact Support</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </main>
    </div>
  );
}
