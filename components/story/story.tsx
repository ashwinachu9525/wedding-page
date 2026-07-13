"use client";

import React from "react";
import { Heart, Sparkles, BookOpen, Quote } from "lucide-react";

export interface StoryData {
  quote: string;
  howWeMet: string;
  firstImpression: string;
  ourJourney: string;
  specialMoment: string;
  thingsWeLove: string[];
  ourPromise: string;
  withRegards: string;
}

export const STORY_QUOTES = [
  "Every love story is beautiful, but ours is my favorite.",
  "Some hearts understand each other, even in silence.",
  "Two souls, one beautiful journey.",
  "Together is our favorite place to be.",
  "A successful marriage is built on love, trust, respect, and friendship.",
  "Sometimes two families bring two hearts together, creating a lifetime of happiness.",
  "Love isn't always found at first sight; sometimes it grows beautifully with every passing day.",
  "Our story wasn't written by chance — it was written with love, faith, and destiny.",
  "Every beautiful journey begins with a single moment, and ours is a story worth remembering forever.",
  "Two families, one beautiful beginning — blessed by love and sealed by destiny.",
];

export const DEFAULT_STORY_DATA: StoryData = {
  quote: "Every beautiful journey begins with a single moment, and ours is a story worth remembering forever.",
  howWeMet: "",
  firstImpression: "",
  ourJourney: "",
  specialMoment: "",
  thingsWeLove: ["Kindness", "Sense of humor", "Supportive nature", "Caring personality"],
  ourPromise: "Together, we promise to support, respect, and cherish each other through every season of life.",
  withRegards: "",
};

/** Parse story field — may be JSON (StoryData) or legacy plain string */
export function parseStory(raw: string | undefined | null): StoryData | string {
  if (!raw) return DEFAULT_STORY_DATA;

  // Try to parse as JSON — handle both single and double-stringified cases
  let toParse = raw.trim();
  try {
    let parsed = JSON.parse(toParse);
    // Handle double-stringified JSON (string inside string)
    if (typeof parsed === "string") {
      parsed = JSON.parse(parsed);
    }
    if (parsed && typeof parsed === "object" && "quote" in parsed) {
      return parsed as StoryData;
    }
  } catch {}

  // Legacy plain-text story
  return raw;
}

/** Extract a clean plain-text description from a story field (for SEO, previews) */
export function getStoryDescription(raw: string | undefined | null): string {
  const parsed = parseStory(raw);
  if (typeof parsed === "object") {
    return (parsed as StoryData).quote?.trim() || "";
  }
  return (parsed as string)?.trim() || "";
}

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
  story,
  brideDetails,
  groomDetails,
  timeline,
  accentClass = "text-[#D4AF37]",
}: StoryProps) {
  const parsed = parseStory(story);
  const isStructured = typeof parsed === "object";
  const data = isStructured ? (parsed as StoryData) : null;
  // For legacy plain text, guard against accidentally showing a raw JSON string
  const rawLegacy = isStructured ? null : (parsed as string);
  const legacyText = rawLegacy?.startsWith("{") ? null : rawLegacy;

  // Determine if there's any meaningful content to show
  const hasQuote = data ? !!data.quote?.trim() : !!legacyText?.trim();
  const hasStructuredContent = data && (
    !!data.howWeMet?.trim() ||
    !!data.firstImpression?.trim() ||
    !!data.ourJourney?.trim() ||
    !!data.specialMoment?.trim() ||
    (data.thingsWeLove?.filter(Boolean).length > 0) ||
    !!data.ourPromise?.trim()
  );
  const hasLineage = !!brideDetails?.trim() || !!groomDetails?.trim();
  const hasTimeline = timeline && timeline.length > 0;

  // Hide entire section if nothing to show
  if (!hasQuote && !hasStructuredContent && !hasLineage && !hasTimeline) return null;

  return (
    <section id="story" className="py-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-16">

      {/* Section Header + Quote — only if there's a quote */}
      {hasQuote && (
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${accentClass}`} />
            <span className="text-xs uppercase tracking-[0.3em] opacity-75">Editorial Feature</span>
            <Sparkles className={`w-4 h-4 ${accentClass}`} />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wide">Our Story</h2>
          <div className="w-16 h-[1px] bg-current/30 mx-auto" />
          <div className="flex justify-center pt-1">
            <blockquote className="relative max-w-xl px-6">
              <Quote className={`absolute -top-2 -left-1 w-6 h-6 opacity-30 ${accentClass}`} />
              <p className="font-serif italic text-lg sm:text-xl leading-relaxed opacity-95">
                {data ? data.quote : legacyText}
              </p>
              <Quote className={`absolute -bottom-2 -right-1 w-6 h-6 opacity-30 rotate-180 ${accentClass}`} />
            </blockquote>
          </div>
        </div>
      )}

      {/* Section heading when no quote but has other content */}
      {!hasQuote && (hasStructuredContent || hasLineage || hasTimeline) && (
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${accentClass}`} />
            <span className="text-xs uppercase tracking-[0.3em] opacity-75">Editorial Feature</span>
            <Sparkles className={`w-4 h-4 ${accentClass}`} />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wide">Our Story</h2>
          <div className="w-16 h-[1px] bg-current/30 mx-auto" />
        </div>
      )}

      {/* Structured sections — only when StoryData JSON is present */}
      {data && (
        <div className="space-y-10">

          {/* How We Met + First Impression — side by side on md+ */}
          {(data.howWeMet || data.firstImpression) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.howWeMet && (
                <div className="p-6 bg-current/5 border border-current/15 rounded-sm space-y-2">
                  <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>
                    How We Met
                  </span>
                  <p className="font-serif text-sm sm:text-base leading-relaxed opacity-90">{data.howWeMet}</p>
                </div>
              )}
              {data.firstImpression && (
                <div className="p-6 bg-current/5 border border-current/15 rounded-sm space-y-2">
                  <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>
                    The First Impression
                  </span>
                  <p className="font-serif text-sm sm:text-base leading-relaxed opacity-90">{data.firstImpression}</p>
                </div>
              )}
            </div>
          )}

          {/* Our Journey Together */}
          {data.ourJourney && (
            <div className="p-6 bg-current/5 border border-current/15 rounded-sm space-y-2">
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>
                Our Journey Together
              </span>
              <p className="font-serif text-sm sm:text-base leading-relaxed opacity-90">{data.ourJourney}</p>
            </div>
          )}

          {/* The Special Moment */}
          {data.specialMoment && (
            <div className="p-6 bg-current/5 border border-current/15 rounded-sm space-y-2">
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>
                The Special Moment
              </span>
              <p className="font-serif text-sm sm:text-base leading-relaxed opacity-90">{data.specialMoment}</p>
            </div>
          )}

          {/* Things We Love About Each Other */}
          {data.thingsWeLove && data.thingsWeLove.filter(Boolean).length > 0 && (
            <div className="space-y-3">
              <div className="text-center">
                <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>
                  Things We Love About Each Other
                </span>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {data.thingsWeLove.filter(Boolean).map((item, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 px-4 py-2 bg-current/5 border border-current/20 rounded-full text-sm font-serif"
                  >
                    <Heart className={`w-3.5 h-3.5 fill-current ${accentClass}`} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Our Promise */}
          {data.ourPromise && (
            <div className="text-center max-w-2xl mx-auto pt-4 border-t border-current/15 space-y-2">
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>
                Our Promise
              </span>
              <p className="font-serif italic text-base sm:text-lg leading-relaxed opacity-90">
                &ldquo;{data.ourPromise}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Bride & Groom Lineage Cards — only when content exists */}
      {hasLineage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-4">
          {brideDetails?.trim() && (
            <div className="p-5 sm:p-8 bg-current/5 rounded-sm border border-current/15 text-center space-y-3 shadow-xs">
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>The Bride&apos;s Family</span>
              <h3 className="font-serif text-2xl font-light">The Bride&apos;s Lineage</h3>
              <p className="font-serif italic text-sm opacity-85 leading-relaxed">{brideDetails}</p>
            </div>
          )}
          {groomDetails?.trim() && (
            <div className="p-5 sm:p-8 bg-current/5 rounded-sm border border-current/15 text-center space-y-3 shadow-xs">
              <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>The Groom&apos;s Family</span>
              <h3 className="font-serif text-2xl font-light">The Groom&apos;s Lineage</h3>
              <p className="font-serif italic text-sm opacity-85 leading-relaxed">{groomDetails}</p>
            </div>
          )}
        </div>
      )}

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
