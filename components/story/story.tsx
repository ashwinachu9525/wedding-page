"use client";

import React from "react";
import { Heart, Sparkles, BookOpen } from "lucide-react";

interface TimelineItem {
  date: string;
  title: string;
  desc: string;
}

interface StoryProps {
  story?: string;
  brideDetails?: string;
  groomDetails?: string;
  timeline?: TimelineItem[];
  accentClass?: string;
}

export function Story({
  story = "Two paths crossed under the Bangalore skies, blossoming into a lifelong bond of love, laughter, and heritage.",
  brideDetails = "Daughter of Sri K. Ramachandran & Smt. Lakshmi Devi",
  groomDetails = "Son of Sri V. Krishnan & Smt. Saraswathi",
  timeline,
  accentClass = "text-[#D4AF37]",
}: StoryProps) {
  return (
    <section id="story" className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className={`w-4 h-4 ${accentClass}`} />
          <span className="text-xs uppercase tracking-[0.3em] opacity-75">Editorial Feature</span>
          <Sparkles className={`w-4 h-4 ${accentClass}`} />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wide">Our Love Story</h2>
        <div className="w-16 h-[1px] bg-current/30 mx-auto" />
        <p className="font-serif italic text-lg sm:text-xl leading-relaxed opacity-95">&ldquo;{story}&rdquo;</p>
      </div>

      {/* Bride & Groom Lineage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <div className="p-8 bg-current/5 rounded-sm border border-current/15 text-center space-y-3 shadow-xs">
          <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>The Bride Lineage</span>
          <h3 className="font-serif text-2xl font-light">The Bride&apos;s Family</h3>
          <p className="font-serif italic text-sm opacity-85 leading-relaxed">{brideDetails}</p>
        </div>

        <div className="p-8 bg-current/5 rounded-sm border border-current/15 text-center space-y-3 shadow-xs">
          <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>The Groom Lineage</span>
          <h3 className="font-serif text-2xl font-light">The Groom&apos;s Family</h3>
          <p className="font-serif italic text-sm opacity-85 leading-relaxed">{groomDetails}</p>
        </div>
      </div>

      {/* Relationship Milestones Timeline */}
      {timeline && timeline.length > 0 && (
        <div className="space-y-10 pt-8 border-t border-current/15">
          <div className="text-center">
            <h3 className="font-serif text-2xl sm:text-3xl uppercase tracking-wider">Milestones of Togetherness</h3>
            <p className="text-xs uppercase tracking-widest opacity-70 mt-1">From First Hello to Forever</p>
          </div>

          <div className="relative max-w-2xl mx-auto space-y-8 pl-6 border-l-2 border-current/20">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-current border-4 border-[#FAF8F5] group-hover:scale-125 transition-transform" />
                <span className={`text-xs uppercase tracking-widest font-mono font-bold ${accentClass}`}>{item.date}</span>
                <h4 className="font-serif text-xl font-medium mt-1">{item.title}</h4>
                <p className="text-xs sm:text-sm opacity-80 leading-relaxed mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
