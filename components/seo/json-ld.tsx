import { coupleInfo, weddingEvents } from "@/data/wedding-data";

export function WeddingJsonLd() {
  const mainEvent = weddingEvents.find((e) => e.featured) || weddingEvents[0];

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${coupleInfo.names} Wedding Celebration`,
    startDate: coupleInfo.weddingDateISO,
    endDate: "2026-10-18T23:59:00.000Z",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: mainEvent.venueName,
      address: {
        "@type": "PostalAddress",
        streetAddress: mainEvent.address,
        addressLocality: mainEvent.city,
        addressCountry: "Italy",
      },
    },
    image: [coupleInfo.heroFallbackImage],
    description: coupleInfo.welcomeMessage,
    organizer: {
      "@type": "Person",
      name: coupleInfo.names,
    },
    performer: [
      {
        "@type": "Person",
        name: coupleInfo.fullNames.partner1,
      },
      {
        "@type": "Person",
        name: coupleInfo.fullNames.partner2,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
    />
  );
}
