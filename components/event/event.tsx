"use client";

import React from "react";
import { Calendar, Clock, MapPin, ExternalLink, Send, Sparkles, Download } from "lucide-react";
import { toast } from "sonner";

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
  onOpenRSVP: () => void;
  accentClass?: string;
  buttonClass?: string;
  enableAccommodations?: boolean;
  accommodationsTitle?: string;
}

export function EventSection({
  events = [],
  venueName = "",
  venueAddress = "",
  mapUrl = "",
  onOpenRSVP,
  accentClass = "text-[#D4AF37]",
  buttonClass = "bg-[#22201E] text-white hover:bg-[#3A3632]",
  enableAccommodations = true,
  accommodationsTitle,
}: EventSectionProps) {
  const directionsHeader = accommodationsTitle?.trim() || (enableAccommodations !== false ? "Accommodations & Venue Directions" : "Venue Directions Guide");

  const hasEvents = events && events.length > 0;
  const hasVenue = !!(venueName?.trim() || venueAddress?.trim());

  // Hide entire section when there's nothing to show
  if (!hasEvents && !hasVenue) return null;

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
        <div className="p-5 sm:p-8 md:p-12 rounded-sm bg-current/5 border border-current/15 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 text-center md:text-left w-full">
          <div className="space-y-2 max-w-xl">
            <span className={`text-[10px] uppercase tracking-[0.25em] font-bold ${accentClass}`}>{directionsHeader}</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-light">{venueName}</h3>
            {venueAddress && <p className="text-xs opacity-80">{venueAddress}</p>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0 w-full md:w-auto">
            {mapUrl && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xs text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center justify-center gap-2 border border-current/30 hover:bg-current/10 min-h-[44px]"
            >
              <MapPin className="w-4 h-4" />
              <span>Google Maps Navigation</span>
            </a>
            )}

            <button
              onClick={onOpenRSVP}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-xs text-xs uppercase tracking-widest font-bold shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px] ${buttonClass}`}
            >
              <Send className="w-4 h-4" />
              <span>RSVP For Events</span>
            </button>
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
