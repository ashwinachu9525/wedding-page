"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getInvitationBySlug, InvitationData } from "@/lib/mock-storage";
import { Sparkles, ArrowLeft, MessageCircle } from "lucide-react";
import { getFontPairingById } from "@/lib/fonts";

import { Navbar } from "@/components/navbar/navbar";
import { Hero } from "@/components/hero/hero";
import { Story, parseStory, type StoryData } from "@/components/story/story";
import { EventSection } from "@/components/event/event";
import { GallerySection } from "@/components/gallery/gallery";
import { FooterSection } from "@/components/footer/footer";
import { RSVPModal } from "@/components/rsvp/rsvp-modal";
import { WeddingJsonLd } from "@/components/seo/json-ld";
import AdBanner from "@/components/AdBanner";

type ThemeKey =
  | "alabaster"
  | "velvet"
  | "emerald"
  | "rose"
  | "marigold"
  | "mysore"
  | "crimson"
  | "ivory"
  | "peacock"
  | "lotus"
  | "sandalwood"
  | "banarasi"
  | "hindu_royal"
  | "arabic_royal"
  | "christian_royal";

const THEME_STYLES: Record<
  ThemeKey,
  { bg: string; text: string; accent: string; buttonBg: string }
> = {
  alabaster: { bg: "bg-[#FAF8F5]", text: "text-[#22201E]", accent: "text-[#9E8B73]", buttonBg: "bg-[#22201E] text-[#FAF8F5] hover:bg-[#3A3632]" },
  velvet: { bg: "bg-[#141311]", text: "text-[#FAF8F5]", accent: "text-[#D4AF37]", buttonBg: "bg-[#D4AF37] text-[#141311] hover:bg-[#E6C35C]" },
  emerald: { bg: "bg-[#0B1D16]", text: "text-[#FAF8F5]", accent: "text-[#D4AF37]", buttonBg: "bg-[#D4AF37] text-[#0B1D16] hover:bg-[#E6C35C]" },
  rose: { bg: "bg-[#FFF8F8]", text: "text-[#4A1D24]", accent: "text-[#B85D6B]", buttonBg: "bg-[#B85D6B] text-white hover:bg-[#A34B58]" },
  marigold: { bg: "bg-[#1A0E04]", text: "text-[#FFF6ED]", accent: "text-[#E8984E]", buttonBg: "bg-[#E8984E] text-[#1A0E04] hover:bg-[#F3AC6B]" },
  mysore: { bg: "bg-[#060D18]", text: "text-[#F3EAD8]", accent: "text-[#C5A059]", buttonBg: "bg-[#C5A059] text-[#060D18] hover:bg-[#D6B36E]" },
  crimson: { bg: "bg-[#240609]", text: "text-[#FCEEE3]", accent: "text-[#E6C280]", buttonBg: "bg-[#E6C280] text-[#240609] hover:bg-[#F2D194]" },
  ivory: { bg: "bg-[#FFFFFF]", text: "text-[#1F1D1A]", accent: "text-[#888178]", buttonBg: "bg-[#1F1D1A] text-white hover:bg-[#383532]" },
  peacock: { bg: "bg-[#06181D]", text: "text-[#E8F8FA]", accent: "text-[#57CC99]", buttonBg: "bg-[#38A3A5] text-[#06181D] hover:bg-[#57CC99]" },
  lotus: { bg: "bg-[#FFF0F5]", text: "text-[#5C1D34]", accent: "text-[#D8829D]", buttonBg: "bg-[#D8829D] text-white hover:bg-[#C46884]" },
  sandalwood: { bg: "bg-[#1C1510]", text: "text-[#F3E6DA]", accent: "text-[#C19A6B]", buttonBg: "bg-[#C19A6B] text-[#1C1510] hover:bg-[#D3AD7F]" },
  banarasi: { bg: "bg-[#130822]", text: "text-[#F8F2FF]", accent: "text-[#D4AF37]", buttonBg: "bg-[#D4AF37] text-[#130822] hover:bg-[#E6C35C]" },
  hindu_royal: {
    bg: "bg-[#2D0A0E] relative before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_1px,transparent_1px)] before:bg-[size:24px_24px]",
    text: "text-[#FAF8F5]",
    accent: "text-[#FF9933]",
    buttonBg: "bg-[#FF9933] text-[#2D0A0E] hover:bg-[#E68A2E] font-bold"
  },
  arabic_royal: {
    bg: "bg-[#061B1C] relative before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(circle_at_center,rgba(230,194,128,0.05)_1px,transparent_1px)] before:bg-[size:32px_32px]",
    text: "text-[#FAF8F5]",
    accent: "text-[#E6C280]",
    buttonBg: "bg-[#E6C280] text-[#061B1C] hover:bg-[#D6B36E] font-bold"
  },
  christian_royal: {
    bg: "bg-[#FAF9F6] relative before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(circle_at_center,rgba(163,180,200,0.08)_1px,transparent_1px)] before:bg-[size:20px_20px]",
    text: "text-[#2B3E50]",
    accent: "text-[#B0C4DE]",
    buttonBg: "bg-[#2B3E50] text-[#FAF9F6] hover:bg-[#3D5A75] font-bold"
  },
};

function InviteLandingContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const guest = searchParams ? searchParams.get("guest") || "" : "";
  const note = searchParams ? searchParams.get("note") || "" : "";
  const urlEnableAccommodations = searchParams ? searchParams.get("enableAccommodations") : null;
  const urlAccommodationsTitle = searchParams ? searchParams.get("accommodationsTitle") : null;
  const urlSplitCoupleNames = searchParams ? searchParams.get("splitCoupleNames") : null;

  const slug = (params?.slug as string) || "rahul-priya-2026";
  const [invite, setInvite] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const handleOpenRSVP = () => setRsvpOpen(true);

  useEffect(() => {
    async function fetchInvite() {
      setLoading(true);
      const cleanSlug = slug.toLowerCase();

      // DB is the source of truth — fetch from API first
      try {
        const res = await fetch(`/api/invitations?slug=${encodeURIComponent(cleanSlug)}`);
        const data = await res.json();
        if (data && data.slug) {
          setInvite(data);
          setLoading(false);
          return;
        }
      } catch (e) {}

      // Fallback to in-memory mock data if DB unreachable
      const fallback = getInvitationBySlug(cleanSlug) || getInvitationBySlug("rahul-priya-2026")!;
      setInvite(fallback);
      setLoading(false);
    }
    fetchInvite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-center px-4">
        <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin mb-4" />
        <p className="font-serif text-[#FAF8F5] tracking-widest uppercase text-xs">Loading Celebration Details...</p>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-[#111111] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-3xl text-white mb-2">Invitation Not Found</h1>
        <p className="text-[#A69E94] text-sm max-w-md mb-6">
          We couldn&apos;t locate the celebration details for &ldquo;{slug}&rdquo;. Please verify the URL or contact the hosts.
        </p>
        <Link href="/" className="px-6 py-2.5 bg-[#D4AF37] text-black font-medium text-xs uppercase tracking-widest rounded-full hover:bg-[#E6C280] transition-colors">
          Return to Hub
        </Link>
      </div>
    );
  }

  const effectiveEnableAccommodations = urlEnableAccommodations !== null
    ? urlEnableAccommodations === "true"
    : invite.enableAccommodations !== false;

  const effectiveAccommodationsTitle = urlAccommodationsTitle !== null
    ? urlAccommodationsTitle
    : invite.accommodationsTitle;

  const effectiveSplitCoupleNames = urlSplitCoupleNames !== null
    ? urlSplitCoupleNames === "true"
    : Boolean(invite.splitCoupleNames);

  const urlFont = searchParams ? searchParams.get("fontStyle") || "" : "";
  const effectiveFontId = urlFont || invite.fontStyle || "cormorant_bickham";
  const fontPairing = getFontPairingById(effectiveFontId);

  const fontStyles = {
    "--invitation-heading-font": fontPairing.headingFont,
    "--invitation-body-font": fontPairing.bodyFont,
    "--heading-scale": fontPairing.scaleAdjustment || 1.0,
  } as React.CSSProperties;

  const themeKey = (invite.theme as ThemeKey) in THEME_STYLES ? (invite.theme as ThemeKey) : "alabaster";
  const styles = THEME_STYLES[themeKey];

  let parsedEvents: Array<{ name: string; time: string; venue: string; desc?: string }> = [];
  try {
    const ev = JSON.parse(invite.eventsJson);
    if (Array.isArray(ev)) parsedEvents = ev;
  } catch (e) {
    parsedEvents = [];
  }

  let parsedGallery: string[] = [];
  try {
    parsedGallery = JSON.parse(invite.galleryJson);
  } catch (e) {
    parsedGallery = [];
  }

  let parsedTimeline: Array<{ date: string; title: string; desc: string }> = [];
  try {
    if (invite.timelineJson) parsedTimeline = JSON.parse(invite.timelineJson);
  } catch (e) {
    parsedTimeline = [];
  }

  let parsedFaqs: Array<{ q: string; a: string }> = [];
  try {
    if (invite.faqJson) parsedFaqs = JSON.parse(invite.faqJson);
  } catch (e) {
    parsedFaqs = [];
  }

  // Extract withRegards from structured story JSON
  const parsedStory = parseStory(invite.story);
  const withRegards = typeof parsedStory === "object"
    ? (parsedStory as StoryData).withRegards?.trim() || ""
    : "";

  return (
    <div
      className={`invitation-container min-h-screen ${styles.bg} ${styles.text} overflow-x-hidden transition-colors duration-500`}
      style={fontStyles}
      data-heading-type={fontPairing.headingType || "serif"}
    >
      {/* SEO Structured Data */}
      <WeddingJsonLd
        coupleNames={invite.coupleNames}
        weddingDate={invite.weddingDate}
        venueName={invite.venueName}
        venueAddress={invite.venueAddress}
        story={invite.story}
      />

      {/* Floating Back to Hub Banner */}
      <div className="bg-black/90 text-white text-[11px] uppercase tracking-widest py-2 px-4 flex items-center justify-between z-50 relative border-b border-white/10">
        <Link href="/" className="hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VivahaLuxe Hub</span>
        </Link>
        <span className="opacity-60 text-[10px]">Celebration Invitation</span>
      </div>

      {/* Personalized Greeting Card Block */}
      {guest && (
        <div className={`w-full py-6 text-center flex flex-col items-center justify-center border-b border-current/10 px-4 ${
          themeKey === "hindu_royal" ? "bg-[#FF9933]/10 text-[#FF9933]" :
          themeKey === "arabic_royal" ? "bg-[#E6C280]/15 text-[#E6C280]" :
          themeKey === "christian_royal" ? "bg-[#2B3E50]/5 text-[#2B3E50]" :
          "bg-current/[0.05]"
        }`}>
          <p className="text-[10px] uppercase tracking-[0.25em] opacity-75 font-semibold">Personalized Invitation For</p>
          <h2 className="font-serif text-2xl sm:text-3xl font-light mt-1.5">{guest}</h2>
          {note && (
            <p className="text-xs italic opacity-85 mt-2.5 max-w-md leading-relaxed">
              "{note}"
            </p>
          )}
        </div>
      )}

      {/* Sticky Navigation */}
      <Navbar
        coupleNames={invite.coupleNames}
        musicUrl={invite.musicUrl}
        onOpenRSVP={handleOpenRSVP}
        accentClass={styles.accent}
        buttonClass={styles.buttonBg}
        headingType={fontPairing.headingType}
        enableAccommodations={effectiveEnableAccommodations}
      />

      {/* Main Content Sections */}
      <main>
        {/* Full-Screen Video or Cinematic Background Hero */}
        <Hero
          coupleNames={invite.coupleNames}
          splitCoupleNames={effectiveSplitCoupleNames}
          weddingDate={invite.weddingDate}
          weddingDateDisplay={invite.weddingDateDisplay}
          venueName={invite.venueName}
          heroBgType={invite.heroBgType || "image"}
          heroBgUrl={invite.heroBgUrl}
          onOpenRSVP={handleOpenRSVP}
          accentClass={styles.accent}
          themeKey={themeKey}
          headingType={fontPairing.headingType}
        />

        {/* Editorial Couple's Story & Timeline */}
        <Story
          story={invite.story}
          brideDetails={invite.brideDetails}
          groomDetails={invite.groomDetails}
          timeline={parsedTimeline.length > 0 ? parsedTimeline : undefined}
          accentClass={styles.accent}
        />

        {/* Itinerary Details & Accommodations Guide */}
        <EventSection
          events={parsedEvents}
          venueName={invite.venueName}
          venueAddress={invite.venueAddress}
          mapUrl={invite.mapUrl}
          onOpenRSVP={handleOpenRSVP}
          accentClass={styles.accent}
          buttonClass={styles.buttonBg}
          enableAccommodations={effectiveEnableAccommodations}
          accommodationsTitle={effectiveAccommodationsTitle}
        />

        {/* Responsive Masonry Photo Gallery with Lightbox */}
        <GallerySection images={parsedGallery} accentClass={styles.accent} />
      </main>

      {/* Free Plan Advertisement Banner — hidden for PRO accounts */}
      {!invite.isProUser && (
        <AdBanner slot="landing" className="max-w-4xl mx-auto my-8 px-4" />
      )}

      {/* FAQ & Editorial Footer */}
      <FooterSection
        coupleNames={invite.coupleNames}
        splitCoupleNames={effectiveSplitCoupleNames}
        faqs={parsedFaqs.length > 0 ? parsedFaqs : undefined}
        withRegards={withRegards || undefined}
        accentClass={styles.accent}
        headingType={fontPairing.headingType}
      />

      {/* Interactive RSVP Dialog Modal */}
      <RSVPModal
        open={rsvpOpen}
        onOpenChange={setRsvpOpen}
        coupleNames={invite.coupleNames}
        buttonClass={styles.buttonBg}
        slug={invite.slug}
      />
    </div>
  );
}

export default function DynamicCoupleLandingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#1F1D1A] text-white flex items-center justify-center font-serif">Loading Invitation Portal...</div>}>
      <InviteLandingContent />
    </Suspense>
  );
}
