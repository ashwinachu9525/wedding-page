"use client";

import React from "react";
import Image from "next/image";
import { coupleInfo, storyTimeline } from "@/data/wedding-data";
import { Heart, MapPin } from "lucide-react";

export function Story() {
  return (
    <section id="story" className="py-24 md:py-36 bg-[#FAF8F5] relative overflow-hidden">
      {/* Subtle Background Flourish */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-[#E8E2D9] to-transparent" />

      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-28">
          <span className="text-xs uppercase tracking-[0.3em] text-[#88837E] block mb-3">
            How It Began
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-[#22201E] tracking-tight mb-6">
            A Story of Serendipity
          </h2>
          <div className="w-16 h-[1px] bg-[#C4B7A6] mx-auto mb-6" />
          <p className="font-serif italic text-lg md:text-xl text-[#66625D] leading-relaxed">
            From an autumn downpour in Milan to the serene shores of Lake Como, every step has led us to this moment.
          </p>
        </div>

        {/* Editorial Intro Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-32">
          {/* Left Large Portrait Spread */}
          <div className="lg:col-span-7 relative">
            <div className="relative aspect-4/3 sm:aspect-16/10 rounded-sm overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80"
                alt={`${coupleInfo.names} walking in Milan`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover editorial-image"
              />
            </div>
            {/* Overlay Quote Card */}
            <div className="absolute -bottom-6 sm:-bottom-8 right-4 sm:-right-8 bg-[#22201E] text-[#FAF8F5] p-6 sm:p-8 max-w-xs shadow-xl rounded-sm hidden sm:block border border-white/10">
              <p className="font-serif italic text-sm sm:text-base leading-relaxed mb-4">
                &ldquo;True connection doesn&apos;t announce itself with thunder; it whispers softly in moments you least expect.&rdquo;
              </p>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4B7A6] block">
                — {coupleInfo.names}
              </span>
            </div>
          </div>

          {/* Right Narrative Copy */}
          <div className="lg:col-span-5 space-y-6 pt-4 sm:pt-0">
            <h3 className="font-serif text-2xl md:text-3xl text-[#22201E] leading-snug">
              Two kindred spirits united by art, architecture, and an unshakeable devotion.
            </h3>
            <p className="text-[#55514C] leading-relaxed text-sm md:text-base">
              When Aswin first moved to northern Italy to study classical architectural design, he never anticipated that a sudden storm in the streets of Brera would introduce him to Annapoorna. Shared umbrellas quickly became shared coffees, gallery walks, and weekend journeys across the Tuscan countryside.
            </p>
            <p className="text-[#55514C] leading-relaxed text-sm md:text-base">
              Through years of distance between New York and Florence, their commitment only grew stronger. Today, they invite you to step into their world as they celebrate their vows in one of the most romantic settings on earth.
            </p>
            <div className="pt-4 flex items-center space-x-4 border-t border-[#E8E2D9]">
              <div className="font-serif italic text-xl text-[#22201E]">
                {coupleInfo.fullNames.partner1} &amp; {coupleInfo.fullNames.partner2}
              </div>
            </div>
          </div>
        </div>

        {/* Chronological Timeline */}
        <div className="relative pt-12">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-[#88837E] block mb-2">
              Milestones
            </span>
            <h3 className="font-serif text-3xl md:text-4xl text-[#22201E]">
              Our Timeline
            </h3>
          </div>

          {/* Vertical Center Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-48 bottom-12 w-[1px] bg-[#E8E2D9] hidden md:block" />

          <div className="space-y-16 md:space-y-24 relative z-10">
            {storyTimeline.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.id}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Image Block */}
                  <div className="w-full md:w-1/2">
                    <div className="relative aspect-4/3 rounded-sm overflow-hidden shadow-sm group">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {item.location && (
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-[10px] uppercase tracking-widest flex items-center space-x-1.5">
                          <MapPin className="w-3 h-3 text-[#C4B7A6]" />
                          <span>{item.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Center Dot for Desktop */}
                  <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#FAF8F5] border-2 border-[#22201E] text-[#22201E] shadow-xs shrink-0 z-10">
                    <Heart className="w-3.5 h-3.5 fill-[#22201E]" />
                  </div>

                  {/* Text Block */}
                  <div className={`w-full md:w-1/2 ${isEven ? "md:text-left" : "md:text-right"}`}>
                    <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#88837E] font-semibold bg-[#EBE5DC] px-3 py-1 rounded-full mb-3">
                      {item.date}
                    </span>
                    <h4 className="font-serif text-2xl md:text-3xl text-[#22201E] mb-3">
                      {item.title}
                    </h4>
                    <p className="text-[#55514C] leading-relaxed text-sm md:text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
