import React from "react";

interface WeddingJsonLdProps {
  coupleNames?: string;
  weddingDate?: string;
  venueName?: string;
  venueAddress?: string;
  story?: string;
}

export function WeddingJsonLd({
  coupleNames = "Aswin K & Annapoorna",
  weddingDate = "2026-11-21T10:30:00",
  venueName = "The Tamarind Tree & The Leela Palace",
  venueAddress = "Bangalore, Karnataka, India",
  story = "The Royal Wedding Celebration of Aswin & Annapoorna",
}: WeddingJsonLdProps) {
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
    description: story,
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
