"use client";

import React, { useState } from "react";
import { coupleInfo, faqs } from "@/data/wedding-data";
import { ChevronDown, ArrowUp, Heart } from "lucide-react";

export function FooterSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* FAQ Section */}
      <section id="faq" className="py-24 md:py-36 bg-[#F3EFE9] border-t border-[#DED7CD]">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#88837E] block mb-3">
              Need To Know
            </span>
            <h2 className="font-serif text-4xl md:text-6xl text-[#22201E] tracking-tight mb-6">
              Common Questions
            </h2>
            <div className="w-16 h-[1px] bg-[#C4B7A6] mx-auto mb-6" />
            <p className="font-serif italic text-lg text-[#66625D]">
              Everything you need to plan your celebration in Bangalore.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#FAF8F5] border border-[#E8E2D9] rounded-sm overflow-hidden transition-all duration-300 shadow-2xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 md:p-8 text-left flex items-center justify-between space-x-4 focus:outline-none"
                  >
                    <span className="font-serif text-xl md:text-2xl text-[#22201E]">
                      {faq.question}
                    </span>
                    <div
                      className={`p-2 rounded-full border border-[#DED7CD] transition-transform duration-300 shrink-0 ${
                        isOpen ? "rotate-180 bg-[#22201E] text-[#FAF8F5]" : ""
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 md:px-8 md:pb-8 text-[#55514C] leading-relaxed border-t border-[#E8E2D9] pt-4 text-sm md:text-base">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Footer Banner */}
      <footer className="bg-[#22201E] text-[#FAF8F5] py-20 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center space-y-12">
          {/* Monogram Brand */}
          <div className="font-serif text-4xl md:text-6xl tracking-widest uppercase text-white drop-shadow-md">
            {coupleInfo.firstNames.partner1.charAt(0)}{" "}
            <span className="italic text-2xl md:text-4xl font-normal text-[#C4B7A6] mx-2">
              &amp;
            </span>{" "}
            {coupleInfo.firstNames.partner2.charAt(0)}
          </div>

          {/* Decorative Divider */}
          <div className="w-24 h-[1px] bg-white/20" />

          {/* Thank You Note */}
          <p className="font-serif italic text-lg md:text-xl text-[#D4C8BA] max-w-lg font-light leading-relaxed">
            &ldquo;We cannot wait to celebrate the beginning of our greatest chapter surrounded by the people who mean everything to us.&rdquo;
          </p>

          <div className="flex items-center space-x-2 text-xs uppercase tracking-[0.25em] text-[#88837E]">
            <span>With Love</span>
            <Heart className="w-3.5 h-3.5 text-[#C4B7A6] fill-[#C4B7A6]" />
            <span>{coupleInfo.hashtag}</span>
          </div>

          {/* Scroll to Top & Admin Link */}
          <div className="pt-8 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#88837E]">
            <div className="flex items-center space-x-4">
              <span>
                &copy; {new Date().getFullYear()} {coupleInfo.names}.
              </span>
              <a
                href="/admin"
                className="text-[#C4B7A6] hover:text-white underline transition-colors"
              >
                Admin Portal
              </a>
            </div>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center space-x-2 hover:text-white transition-colors py-2 group"
            >
              <span className="uppercase tracking-[0.2em]">Back to Top</span>
              <div className="p-1.5 rounded-full border border-white/20 group-hover:border-white transition-colors">
                <ArrowUp className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>
      </footer>
    </>
  );
}
