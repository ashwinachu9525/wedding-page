import React from "react";
import { getStoryDescription } from "@/components/story/story";

interface WeddingJsonLdProps {
  coupleNames?: string;
  weddingDate?: string;
  venueName?: string;
  venueAddress?: string;
  story?: string;
}

export function WeddingJsonLd({
  coupleNames = "Rahul Sharma & Priya Mehta",
  weddingDate = "2026-11-21T10:30:00",
  venueName = "The Tamarind Tree & The Leela Palace",
  venueAddress = "Bangalore, Karnataka, India",
  story = "",
}: WeddingJsonLdProps) {
  // Extract clean plain-text description — story may be JSON or legacy plain text
  const description = getStoryDescription(story) ||
    `Wedding Celebration of ${coupleNames} at ${venueName}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SocialEvent",
    name: `Wedding Celebration of ${coupleNames}`,
    startDate: weddingDate,
    location: {
      "@type": "Place",
      name: venueName,
      address: {
        "@type": "PostalAddress",
        addressLocality: venueAddress,
      },
    },
    description,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
