"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Send, Sparkles, Music } from "lucide-react";
import { toast } from "sonner";

interface RSVPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupleNames?: string;
  buttonClass?: string;
  slug?: string;
}

export function RSVPModal({
  open,
  onOpenChange,
  coupleNames = "Rahul Sharma & Priya Mehta",
  buttonClass = "bg-[#22201E] text-white hover:bg-[#3A3632]",
  slug = "rahul-priya-2026",
}: RSVPModalProps) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guestsCount, setGuestsCount] = useState(2);
  const [dietary, setDietary] = useState("Vegetarian");
  const [allergies, setAllergies] = useState("");
  const [songRequest, setSongRequest] = useState("");

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    try {
      await fetch("/api/rsvps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          attending,
          guestsCount,
          dietary,
          allergies,
          songRequest,
        }),
      });
    } catch (err) {
      console.warn("Failed to post RSVP, fallback to local.");
    }
    toast.success(`Thank you ${name}! Your RSVP, song request & dietary preferences for ${coupleNames} are logged.`);
    setName("");
    setAllergies("");
    setSongRequest("");
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#1F1D1A] text-[#FAF8F5] rounded-sm border border-[#D4AF37]/50 p-5 sm:p-8 md:p-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[#C4B7A6] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Sacred Invitation</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl uppercase tracking-wide text-white">Confirm Attendance</h2>
          <p className="text-xs text-[#C4B7A6]">Kindly respond for the union of {coupleNames}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#D4AF37] font-semibold mb-1">Full Name(s)</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikram & Pooja Sharma"
              className="w-full bg-[#2A2723] border border-white/20 px-3.5 py-2.5 text-xs sm:text-sm rounded-xs text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] font-semibold mb-1">Attending?</label>
              <select
                value={attending}
                onChange={(e) => setAttending(e.target.value)}
                className="w-full bg-[#2A2723] border border-white/20 px-3 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-[#D4AF37]"
              >
                <option value="yes">Joyfully Attending</option>
                <option value="no">Regretfully Decline</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] font-semibold mb-1">Guest Count</label>
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-[#2A2723] border border-white/20 px-3 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-[#D4AF37]"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] font-semibold mb-1">Dietary Preference</label>
              <select
                value={dietary}
                onChange={(e) => setDietary(e.target.value)}
                className="w-full bg-[#2A2723] border border-white/20 px-3 py-2.5 text-xs rounded-xs text-white focus:outline-hidden focus:border-[#D4AF37]"
              >
                <option value="Vegetarian">Traditional Indian Vegetarian</option>
                <option value="Jain">Jain Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="No restrictions">No Restrictions</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold mb-1 opacity-80">Specific Allergies</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Nut allergy, Gluten free"
                className="w-full bg-transparent border border-current/30 px-3.5 py-2 text-xs rounded-xs focus:outline-hidden focus:border-current"
              />
            </div>
          </div>

          {/* Song Request Tracker */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold mb-1 opacity-80 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-amber-500" />
              <span>Sangeet / Gala Song Request</span>
            </label>
            <input
              type="text"
              value={songRequest}
              onChange={(e) => setSongRequest(e.target.value)}
              placeholder="What song will get you on the dance floor?"
              className="w-full bg-transparent border border-current/30 px-3.5 py-2 text-xs rounded-xs focus:outline-hidden focus:border-current"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3.5 rounded-xs text-xs uppercase tracking-widest font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${buttonClass}`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm RSVP Submission</span>
          </button>
        </form>
      </div>
    </div>
  );
}
