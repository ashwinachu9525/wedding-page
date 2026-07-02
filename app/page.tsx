"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar/navbar";
import { Hero } from "@/components/hero/hero";
import { Story } from "@/components/story/story";
import { EventSection } from "@/components/event/event";
import { GallerySection } from "@/components/gallery/gallery";
import { FooterSection } from "@/components/footer/footer";
import { RSVPModal } from "@/components/rsvp/rsvp-modal";
import { WeddingJsonLd } from "@/components/seo/json-ld";

export default function WeddingLandingPage() {
  const [rsvpOpen, setRsvpOpen] = useState(false);

  const handleOpenRSVP = () => setRsvpOpen(true);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#22201E] overflow-x-hidden selection:bg-[#E8E2D9]">
      {/* SEO Structured Data */}
      <WeddingJsonLd />

      {/* Sticky Navigation */}
      <Navbar onOpenRSVP={handleOpenRSVP} />

      {/* Main Content Sections */}
      <main>
        {/* Full-Screen Video Hero */}
        <Hero onOpenRSVP={handleOpenRSVP} />

        {/* Editorial Couple's Story & Timeline */}
        <Story />

        {/* Itinerary Details & Accommodations Guide */}
        <EventSection onOpenRSVP={handleOpenRSVP} />

        {/* Responsive Masonry Photo Gallery with Lightbox */}
        <GallerySection />
      </main>

      {/* FAQ & Editorial Footer */}
      <FooterSection />

      {/* Interactive RSVP Dialog Modal */}
      <RSVPModal open={rsvpOpen} onOpenChange={setRsvpOpen} />
    </div>
  );
}
