"use client";

import React from "react";
import { weddingEvents, accommodations, coupleInfo } from "@/data/wedding-data";
import { WeddingEventDetail } from "@/types/wedding";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  ExternalLink,
  Sparkles,
  Download,
  CheckCircle2,
} from "lucide-react";

interface EventProps {
  onOpenRSVP?: () => void;
}

export function EventSection({ onOpenRSVP }: EventProps) {
  const downloadICS = (event: WeddingEventDetail) => {
    // Generate valid iCalendar format
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      `PRODID:-//${coupleInfo.names} Wedding//EN`,
      "BEGIN:VEVENT",
      `SUMMARY:${event.title} — ${coupleInfo.names} Wedding`,
      `DESCRIPTION:${event.description}\\n\\nDress Code: ${event.dressCode}`,
      `LOCATION:${event.venueName}, ${event.address}, ${event.city}`,
      "DTSTART:20261018T140000Z",
      "DTEND:20261018T230000Z",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute("download", `${event.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="events" className="py-24 md:py-36 bg-[#F3EFE9] relative">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs uppercase tracking-[0.3em] text-[#88837E] block mb-3">
            The Weekend Itinerary
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-[#22201E] tracking-tight mb-6">
            Event Details
          </h2>
          <div className="w-16 h-[1px] bg-[#C4B7A6] mx-auto mb-6" />
          <p className="font-serif italic text-lg md:text-xl text-[#66625D] leading-relaxed">
            We have thoughtfully arranged three days of celebration on the waters of Lake Como. Here is what awaits.
          </p>
        </div>

        {/* Refined Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-28">
          {weddingEvents.map((event) => {
            return (
              <div
                key={event.id}
                className={`flex flex-col justify-between p-8 md:p-10 rounded-sm bg-[#FAF8F5] border transition-all duration-300 shadow-xs hover:shadow-md ${
                  event.featured
                    ? "border-[#22201E] ring-1 ring-[#22201E]"
                    : "border-[#E8E2D9]"
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-[#88837E] font-semibold">
                      {event.subtitle}
                    </span>
                    {event.featured && (
                      <span className="inline-flex items-center space-x-1 bg-[#22201E] text-[#FAF8F5] px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-medium">
                        <Sparkles className="w-3 h-3 text-[#C4B7A6]" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif text-3xl md:text-4xl text-[#22201E] mb-6">
                    {event.title}
                  </h3>

                  {/* Metadata List */}
                  <div className="space-y-4 border-t border-b border-[#E8E2D9] py-6 mb-6 text-sm text-[#44403C]">
                    <div className="flex items-start space-x-3.5">
                      <CalendarIcon className="w-4 h-4 text-[#88837E] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold block text-[#22201E]">Date</span>
                        <span>{event.date}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <Clock className="w-4 h-4 text-[#88837E] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold block text-[#22201E]">Time</span>
                        <span>{event.time}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3.5">
                      <MapPin className="w-4 h-4 text-[#88837E] mt-0.5 shrink-0" />
                      <div>
                        <span className="font-semibold block text-[#22201E]">Venue</span>
                        <span className="block font-medium">{event.venueName}</span>
                        <span className="text-xs text-[#66625D]">
                          {event.address}, {event.city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-[#55514C] leading-relaxed mb-6">
                    {event.description}
                  </p>

                  {/* Dress Code Box */}
                  <div className="bg-[#F5F1EB] p-4 rounded-sm border border-[#E8E2D9] mb-8">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#88837E] font-semibold block mb-1">
                      Dress Code
                    </span>
                    <p className="text-xs md:text-sm text-[#22201E] font-medium">
                      {event.dressCode}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-[#E8E2D9]">
                  <a
                    href={event.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 bg-[#22201E] text-[#FAF8F5] text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#383532] transition-colors rounded-sm"
                  >
                    <span>Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => downloadICS(event)}
                    className="flex-1 inline-flex items-center justify-center space-x-2 py-3 px-4 bg-transparent border border-[#22201E] text-[#22201E] text-xs uppercase tracking-[0.15em] font-medium hover:bg-[#22201E] hover:text-[#FAF8F5] transition-colors rounded-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Add to Calendar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Accommodations Guide Section */}
        <div id="accommodations" className="pt-16 border-t border-[#DED7CD]">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-[#88837E] block mb-3">
              Where to Stay
            </span>
            <h3 className="font-serif text-3xl md:text-5xl text-[#22201E] mb-4">
              Accommodations
            </h3>
            <p className="font-serif italic text-base md:text-lg text-[#66625D]">
              We have secured special room blocks and partner rates at nearby lakeside hotels for your convenience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {accommodations.map((acc, i) => (
              <div
                key={i}
                className="bg-[#FAF8F5] p-8 rounded-sm border border-[#E8E2D9] flex flex-col justify-between shadow-xs hover:shadow-sm transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-serif text-2xl text-[#22201E]">
                      {acc.name}
                    </h4>
                  </div>
                  <span className="text-xs text-[#88837E] block mb-4 italic">
                    {acc.distance}
                  </span>
                  <p className="text-sm text-[#55514C] leading-relaxed mb-6">
                    {acc.description}
                  </p>
                  {acc.promoCode && (
                    <div className="mb-6 bg-[#EBE5DC] py-2 px-3 rounded-xs inline-block text-xs text-[#22201E]">
                      Booking Code: <strong className="font-mono tracking-wider">{acc.promoCode}</strong>
                    </div>
                  )}
                </div>
                <a
                  href={acc.bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between w-full py-3 px-4 border border-[#22201E] text-[#22201E] text-xs uppercase tracking-[0.15em] hover:bg-[#22201E] hover:text-[#FAF8F5] transition-colors rounded-sm"
                >
                  <span>Reserve Room</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Banner RSVP Callout */}
        <div className="mt-24 p-12 bg-[#22201E] text-[#FAF8F5] rounded-sm text-center relative overflow-hidden shadow-lg">
          <div className="max-w-xl mx-auto relative z-10 space-y-6">
            <h3 className="font-serif text-3xl md:text-4xl">
              Will You Join Our Celebration?
            </h3>
            <p className="text-sm md:text-base text-[#D4C8BA] font-light">
              Kindly reply by July 1, 2026, so we may finalize arrangements for our gala dinner and private boat charters.
            </p>
            <button
              onClick={onOpenRSVP}
              className="px-8 py-4 bg-[#FAF8F5] text-[#22201E] text-xs uppercase tracking-[0.25em] font-semibold hover:bg-[#E8E2D9] transition-colors rounded-sm shadow-md"
            >
              Confirm Your Presence
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
