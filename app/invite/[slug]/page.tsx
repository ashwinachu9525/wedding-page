"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getInvitationBySlug, InvitationData } from "@/lib/mock-storage";
import { Sparkles, ArrowLeft, MessageCircle } from "lucide-react";

import { Navbar } from "@/components/navbar/navbar";
import { Hero } from "@/components/hero/hero";
import { Story } from "@/components/story/story";
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
  | "banarasi";

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
};

export default function DynamicCoupleLandingPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "aswin-annapoorna";
  const [invite, setInvite] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const handleOpenRSVP = () => setRsvpOpen(true);

  useEffect(() => {
    async function fetchInvite() {
      setLoading(true);
      const cleanSlug = slug.toLowerCase();
      const baseInvite = getInvitationBySlug(cleanSlug) || getInvitationBySlug("aswin-annapoorna")!;

      let apiFound: any = null;
      try {
        const res = await fetch(`/api/invitations`);
        const all: InvitationData[] = await res.json();
        apiFound = all.find((i) => i.slug.toLowerCase() === cleanSlug);
      } catch (e) {}

      // Check browser localStorage overrides for instant live updates after clicking Save
      const localSavedStr = localStorage.getItem("vivaha_saved_invitations") || "{}";
      let localSaved: Record<string, any> = {};
      try {
        localSaved = JSON.parse(localSavedStr);
      } catch (e) {}

      const localFound = localSaved[cleanSlug];

      if (localFound) {
        setInvite({ ...baseInvite, ...apiFound, ...localFound });
      } else if (apiFound) {
        setInvite(apiFound);
      } else {
        setInvite(baseInvite);
      }
      setLoading(false);
    }
    fetchInvite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141311] flex flex-col items-center justify-center text-[#C4B7A6] p-6 font-serif">
        <Sparkles className="w-8 h-8 animate-spin mb-4 text-[#D4AF37]" />
        <p className="text-xl tracking-widest uppercase">Unfolding Sacred Celebration...</p>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-[#141311] flex flex-col items-center justify-center text-[#FAF8F5] p-6 text-center font-serif">
        <h1 className="text-3xl mb-4">Celebration Not Found</h1>
        <p className="text-sm text-[#C4B7A6] mb-8 max-w-md">
          The wedding celebration site you requested might not be published yet or the URL slug is incorrect.
        </p>
        <Link href="/" className="px-6 py-3 bg-[#D4AF37] text-[#141311] uppercase tracking-widest text-xs font-semibold rounded-xs">
          Return to VivahaLuxe Homepage
        </Link>
      </div>
    );
  }

  const themeKey = (invite.theme as ThemeKey) in THEME_STYLES ? (invite.theme as ThemeKey) : "alabaster";
  const styles = THEME_STYLES[themeKey];

  let parsedEvents: Array<{ name: string; time: string; venue: string; desc?: string }> = [];
  try {
    parsedEvents = JSON.parse(invite.eventsJson);
  } catch (e) {
    parsedEvents = [
      { name: "Muhurtham Ceremony", time: "Nov 21, 9:30 AM", venue: invite.venueName },
      { name: "Grand Reception Gala", time: "Nov 22, 7:00 PM", venue: invite.venueName },
    ];
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

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.text} overflow-x-hidden transition-colors duration-500`}>
      {/* SEO Structured Data */}
      <WeddingJsonLd
        coupleNames={invite.coupleNames}
        weddingDate={invite.weddingDate}
        venueName={invite.venueName}
        venueAddress={invite.venueAddress}
        story={invite.story}
      />

      {/* Floating Back to Hub Banner */}
      <div className="bg-black/80 text-white text-[11px] uppercase tracking-widest py-1.5 px-4 flex items-center justify-between z-50 relative">
        <Link href="/" className="hover:underline flex items-center gap-1 opacity-80 hover:opacity-100">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>VivahaLuxe Hub</span>
        </Link>
        <span>Custom Celebration URL: /invite/{invite.slug}</span>
      </div>

      {/* Sticky Navigation */}
      <Navbar
        coupleNames={invite.coupleNames}
        musicUrl={invite.musicUrl}
        onOpenRSVP={handleOpenRSVP}
        accentClass={styles.accent}
        buttonClass={styles.buttonBg}
      />

      {/* Main Content Sections */}
      <main>
        {/* Full-Screen Video or Cinematic Background Hero */}
        <Hero
          coupleNames={invite.coupleNames}
          weddingDate={invite.weddingDate}
          weddingDateDisplay={invite.weddingDateDisplay}
          venueName={invite.venueName}
          heroBgType={invite.heroBgType || "image"}
          heroBgUrl={invite.heroBgUrl}
          onOpenRSVP={handleOpenRSVP}
          accentClass={styles.accent}
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
        />

        {/* Responsive Masonry Photo Gallery with Lightbox */}
        <GallerySection images={parsedGallery} accentClass={styles.accent} />
      </main>

      {/* Free Plan Advertisement Banner */}
      <AdBanner slot="landing" className="max-w-4xl mx-auto my-8 px-4" />

      {/* FAQ & Editorial Footer */}
      <FooterSection
        coupleNames={invite.coupleNames}
        faqs={parsedFaqs.length > 0 ? parsedFaqs : undefined}
        accentClass={styles.accent}
      />

      {/* Interactive RSVP Dialog Modal */}
      <RSVPModal
        open={rsvpOpen}
        onOpenChange={setRsvpOpen}
        coupleNames={invite.coupleNames}
        buttonClass={styles.buttonBg}
      />
    </div>
  );
}
