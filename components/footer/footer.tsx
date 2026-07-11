"use client";

import React from "react";
import Link from "next/link";
import { HelpCircle, MessageCircle, Sparkles, Heart } from "lucide-react";

interface FAQItem {
  q: string;
  a: string;
}

interface FooterSectionProps {
  coupleNames?: string;
  faqs?: FAQItem[];
  accentClass?: string;
}

export function FooterSection({
  coupleNames = "Rahul Sharma & Priya Mehta",
  faqs,
  accentClass = "text-[#D4AF37]",
}: FooterSectionProps) {
  return (
    <footer id="faq" className="bg-current/5 border-t border-current/15 pt-16 pb-12 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* FAQ Accordion / Grid */}
        {faqs && faqs.length > 0 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2">
                <HelpCircle className={`w-4 h-4 ${accentClass}`} />
                <span className="text-xs uppercase tracking-[0.3em] opacity-75">Frequently Asked Questions</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl">Everything You Need to Know</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {faqs.map((item, idx) => (
                <div key={idx} className="p-6 rounded-sm bg-current/[0.04] border border-current/15 space-y-2 shadow-2xs">
                  <h3 className="font-serif text-lg font-medium flex items-start gap-2">
                    <span className={`${accentClass} font-bold`}>Q.</span>
                    <span>{item.q}</span>
                  </h3>
                  <p className="text-xs opacity-80 leading-relaxed pl-6">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editorial Brand Footer */}
        <div className="pt-12 border-t border-current/15 text-center space-y-6">
          <div className="font-serif text-3xl uppercase tracking-widest font-light">{coupleNames}</div>
          <p className="text-xs opacity-75 max-w-md mx-auto">
            With grateful hearts, we look forward to celebrating our sacred union with our beloved family and friends.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-widest pt-2">
            <Link href="/" className="hover:underline">VivahaLuxe Platform</Link>
            <Link href="/admin" className="hover:underline">Couple Studio</Link>
            <a
              href="https://wa.me/917012406453"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Concierge (+91 7012406453)</span>
            </a>
          </div>

          <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 pt-4">
            Powered by VivahaLuxe • Luxury Digital Wedding SaaS Architecture
          </p>
        </div>
      </div>
    </footer>
  );
}
