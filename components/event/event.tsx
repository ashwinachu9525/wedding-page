"use client";

import React, { useState } from "react";
import { Calendar, Clock, MapPin, ExternalLink, Send, Sparkles, Download, Map, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { WeatherWidget } from "@/components/weather/weather-widget";

interface EventItem {
  name: string;
  time: string;
  venue: string;
  desc?: string;
}

interface EventSectionProps {
  events?: EventItem[];
  venueName?: string;
  venueAddress?: string;
  mapUrl?: string;
  weddingDate?: string;
  onOpenRSVP: () => void;
  accentClass?: string;
  buttonClass?: string;
  enableAccommodations?: boolean;
  accommodationsTitle?: string;
}

/**
 * Converts a Google Maps share URL into an embeddable iframe src.
 * Supports: maps.google.com, google.com/maps, goo.gl/maps links.
 * Returns null if the URL cannot be converted to an embed.
 */
function getMapEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    // Already an embed URL
    if (url.href.includes("google.com/maps/embed")) return url.href;

    // Extract query param "q" if present
    const q = url.searchParams.get("q") || url.searchParams.get("query");
    if (q) {
      return `https://www.google.com/maps?q=${encodeURIComponent(q)}`;
    }

    // Extract coordinates from pathname like /@lat,lng,zoom or /place/.../@lat,lng
    const coordMatch = url.pathname.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      const lat = coordMatch[1];
      const lng = coordMatch[2];
      return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    }

    // Extract place name from /place/ path
    const placeMatch = url.pathname.match(/\/place\/([^/]+)/);
    if (placeMatch) {
      const place = decodeURIComponent(placeMatch[1]).replace(/\+/g, " ");
      return `https://maps.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
    }
  } catch {
    // Not a valid URL
  }
  return null;
}

export function EventSection({
  events = [],
  venueName = "",
  venueAddress = "",
  mapUrl = "",
  weddingDate = "",
  onOpenRSVP,
  accentClass = "text-[#D4AF37]",
  buttonClass = "bg-[#22201E] text-white hover:bg-[#3A3632]",
  enableAccommodations = true,
  accommodationsTitle,
}: EventSectionProps) {
  const [mapExpanded, setMapExpanded] = useState(false);

  const directionsHeader = accommodationsTitle?.trim() || (enableAccommodations !== false ? "Accommodations & Venue Directions" : "Venue Directions Guide");

  const hasEvents = events && events.length > 0;
  const hasVenue = !!(venueName?.trim() || venueAddress?.trim());

  // Hide entire section when there's nothing to show
  if (!hasEvents && !hasVenue) return null;

  const embedUrl = getMapEmbedUrl(mapUrl);

  // 1-Click .ics Add to Calendar Generator
  const handleDownloadICS = (ev: EventItem) => {
    try {
      const title = ev.name;
      const description = ev.desc || `Wedding Celebration at ${ev.venue}`;
      const location = ev.venue;

      // Parse ev.time into a Date — supports "Nov 21, 2026 09:30" or "Nov 21, 9:30 AM"
      const parsedDate = new Date(ev.time);
      const startDate = isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // +2 hours

      const fmt = (d: Date) =>
        d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

      const icsContent = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//VivahaLuxe Platform//EN",
        "BEGIN:VEVENT",
        `SUMMARY:${title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        `DTSTART:${fmt(startDate)}`,
        `DTEND:${fmt(endDate)}`,
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n");

      const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title.replace(/\s+/g, "_")}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success(`Generated .ics calendar file for ${ev.name}!`);
    } catch (err) {
      toast.error("Failed to generate calendar event.");
    }
  };

  return (
    <section id="events" className="py-20 px-4 sm:px-8 bg-current/5 border-y border-current/10">
      <div className="max-w-6xl mx-auto space-y-16">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className={`w-4 h-4 ${accentClass}`} />
            <span className="text-xs uppercase tracking-[0.3em] opacity-75">Sacred Schedule</span>
            <Sparkles className={`w-4 h-4 ${accentClass}`} />
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wide">Celebration Itinerary</h2>
          <p className="text-xs uppercase tracking-widest opacity-70">Featuring 1-Click Calendar Sync &amp; Venue Directions</p>
        </div>

        {/* Events Grid — only when events exist */}
        {hasEvents && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-8 rounded-sm bg-current/[0.04] border border-current/15 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <span className={`text-[10px] uppercase tracking-[0.2em] font-bold ${accentClass}`}>Function {idx + 1}</span>
                  <h3 className="font-serif text-2xl font-medium">{ev.name}</h3>
                  {ev.desc && <p className="text-xs opacity-80 leading-relaxed italic font-serif">&ldquo;{ev.desc}&rdquo;</p>}
                </div>

                <div className="pt-4 border-t border-current/10 space-y-3">
                  <div className="space-y-1.5 text-xs opacity-90">
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 shrink-0 ${accentClass}`} />
                      <span className="font-semibold">{ev.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 shrink-0 ${accentClass}`} />
                      <span>{ev.venue}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownloadICS(ev)}
                    className="w-full py-2 px-3 rounded-xs border border-current/20 hover:bg-current/10 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors min-h-[44px]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Add to Calendar (.ics)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Accommodations & Directions Guide — only when venue info exists */}
        {hasVenue && (
          <div className="space-y-6">
            <WeatherWidget
              venueName={venueAddress ? `${venueAddress}, ${venueName}` : venueName || "Bengaluru, India"}
              weddingDate={weddingDate}
              accentClass={accentClass}
            />
            <div className="rounded-sm bg-current/5 border border-current/15 overflow-hidden">
              {/* Venue Info Header */}
              <div className="p-5 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left w-full">
                <div className="space-y-2 max-w-xl">
                  <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>{directionsHeader}</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-light">{venueName}</h3>
                  {venueAddress && <p className="text-xs opacity-80">{venueAddress}</p>}
                </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0 w-full md:w-auto">
                {/* Toggle embedded map */}
                {(mapUrl || embedUrl) && (
                  <button
                    onClick={() => setMapExpanded((v) => !v)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xs text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 border border-current/30 hover:bg-current/10 min-h-[44px]"
                    aria-expanded={mapExpanded}
                  >
                    <Map className="w-4 h-4" />
                    <span>{mapExpanded ? "Hide Map" : "View Map"}</span>
                    {mapExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                )}

                {mapUrl && (
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 rounded-xs text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center justify-center gap-2 border border-current/30 hover:bg-current/10 min-h-[44px]"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                  </a>
                )}

                <button
                  onClick={onOpenRSVP}
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xs text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px] ${buttonClass}`}
                >
                  <Send className="w-4 h-4" />
                  <span>Will You Attend?</span>
                </button>
              </div>
            </div>

            {/* Collapsible Embedded Map */}
            {mapExpanded && (
              <div className="border-t border-current/15 animate-in slide-in-from-top-2 duration-300">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="380"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map for ${venueName}`}
                    className="w-full"
                  />
                ) : (
                  /* Fallback when embed isn't possible: show a styled placeholder with directions link */
                  <div className="h-64 flex flex-col items-center justify-center gap-4 bg-current/5 text-center px-4">
                    <MapPin className={`w-10 h-10 opacity-40 ${accentClass}`} />
                    <div className="space-y-1">
                      <p className="font-serif text-lg">{venueName}</p>
                      {venueAddress && <p className="text-xs opacity-70">{venueAddress}</p>}
                    </div>
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold uppercase tracking-widest underline opacity-80 hover:opacity-100 flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Open in Google Maps
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
