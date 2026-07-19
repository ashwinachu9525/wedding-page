"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Send, Sparkles, Music, Heart, PartyPopper, Star, Calendar, Clock, Gift } from "lucide-react";
import { toast } from "sonner";
import { GiftRegistryModal } from "../registry/gift-registry-modal";

interface RSVPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coupleNames?: string;
  buttonClass?: string;
  slug?: string;
  rsvpDeadline?: string;
  razorpayKeyId?: string;
  upiVpa?: string;
  upiQrCodeUrl?: string;
  enableGiftRegistry?: boolean;
}

export function RSVPModal({
  open,
  onOpenChange,
  coupleNames = "Rahul Sharma & Priya Mehta",
  buttonClass = "bg-[#22201E] text-white hover:bg-[#3A3632]",
  slug = "rahul-priya-2026",
  rsvpDeadline,
  razorpayKeyId,
  upiVpa,
  upiQrCodeUrl,
  enableGiftRegistry = false,
}: RSVPModalProps) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("yes");
  const [guestsCount, setGuestsCount] = useState(2);
  const [dietary, setDietary] = useState("Vegetarian");
  const [allergies, setAllergies] = useState("");
  const [songRequest, setSongRequest] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showRegistry, setShowRegistry] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedAttending, setSubmittedAttending] = useState("yes");
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (submitted) {
      // Generate random sparkle positions
      const newSparkles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.5,
      }));
      setSparkles(newSparkles);
    }
  }, [submitted]);

  const handleClose = () => {
    onOpenChange(false);
    // Reset after close animation
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setAllergies("");
      setSongRequest("");
      setSparkles([]);
      setShowRegistry(false);
    }, 300);
  };

  const deadlineDate = rsvpDeadline ? new Date(rsvpDeadline) : null;
  const isDeadlinePassed = deadlineDate && !isNaN(deadlineDate.getTime()) ? new Date().getTime() > deadlineDate.getTime() : false;

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || isDeadlinePassed) return;
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

    setSubmittedName(name);
    setSubmittedAttending(attending);
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#1F1D1A] text-[#FAF8F5] rounded-sm border border-[#D4AF37]/50 shadow-2xl overflow-hidden max-h-[90vh]">

        {/* ── Cutoff Passed Screen ── */}
        {isDeadlinePassed ? (
          <div className="relative flex flex-col items-center justify-center text-center px-8 py-14 min-h-[420px] overflow-hidden animate-in zoom-in-95 duration-300">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[#C4B7A6] hover:text-white transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 shadow-inner">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-3 max-w-md">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-amber-400 bg-amber-500/15 px-3.5 py-1.5 rounded-full border border-amber-500/30">
                RSVP Closed
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-white mt-2">
                Cutoff Date Reached
              </h3>
              <p className="text-xs sm:text-sm text-[#C4B7A6] leading-relaxed font-light">
                The RSVP deadline (<strong className="text-[#FAF8F5] font-medium">{deadlineDate!.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</strong>) has passed. Thank you for your warm wishes and love for <span className="text-[#D4AF37] font-medium">{coupleNames}</span>!
              </p>
            </div>
            <div className="pt-6 w-full max-w-xs">
              <button
                type="button"
                onClick={handleClose}
                className={`w-full py-3 px-6 rounded-xs text-xs uppercase tracking-widest font-bold shadow-md transition-all active:scale-95 ${buttonClass}`}
              >
                Close Window
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          </div>
        ) : submitted ? (
          <div className="relative flex flex-col items-center justify-center text-center px-8 py-14 min-h-[480px] overflow-hidden">
            {/* Animated sparkle particles */}
            {sparkles.map((s) => (
              <span
                key={s.id}
                className="absolute pointer-events-none animate-ping"
                style={{
                  left: `${s.x}%`,
                  top: `${s.y}%`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: "1.8s",
                }}
              >
                <Star className="w-3 h-3 text-[#D4AF37] fill-current opacity-60" />
              </span>
            ))}

            {/* Decorative gold ring */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border-4 border-[#D4AF37]/40 flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37]/15 border-2 border-[#D4AF37]/60 flex items-center justify-center">
                  {submittedAttending === "yes" ? (
                    <Heart className="w-8 h-8 text-[#D4AF37] fill-current" />
                  ) : (
                    <Heart className="w-8 h-8 text-[#C4B7A6]" />
                  )}
                </div>
              </div>
            </div>

            {submittedAttending === "yes" ? (
              <>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RSVP Confirmed</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-white mb-3 leading-tight">
                  We can't wait to<br />
                  <span className="italic text-[#D4AF37]">celebrate with you!</span>
                </h2>
                <p className="text-sm text-[#C4B7A6] mb-2">
                  Dear <span className="text-white font-semibold">{submittedName}</span>,
                </p>
                <p className="text-xs text-[#A09890] leading-relaxed max-w-sm mb-8">
                  Your presence at the union of <span className="text-[#FAF8F5]">{coupleNames}</span> means the world to us. We'll see you at the celebration! 🎉
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#C4B7A6] mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Response Received</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-white mb-3 leading-tight">
                  Thank you for<br />
                  <span className="italic text-[#C4B7A6]">letting us know</span>
                </h2>
                <p className="text-sm text-[#C4B7A6] mb-2">
                  Dear <span className="text-white font-semibold">{submittedName}</span>,
                </p>
                <p className="text-xs text-[#A09890] leading-relaxed max-w-sm mb-8">
                  We'll truly miss you at the union of <span className="text-[#FAF8F5]">{coupleNames}</span>. Thank you for taking the time to respond — you'll always be in our hearts. 💛
                </p>
              </>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm z-20">
              {Boolean(enableGiftRegistry) && (
                <button
                  type="button"
                  onClick={() => setShowRegistry(true)}
                  className="w-full py-3.5 px-5 rounded-xs text-xs uppercase tracking-widest font-bold shadow-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] hover:from-[#e3be47] hover:to-[#D4AF37] text-[#141210] transition-all transform active:scale-98 flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4 text-[#141210]" />
                  <span>Open Gift Boutique &amp; Shagun</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xs text-xs uppercase tracking-widest font-semibold bg-white/10 hover:bg-white/20 text-[#FAF8F5] transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>

            <GiftRegistryModal
              open={showRegistry}
              onOpenChange={(openVal) => setShowRegistry(openVal)}
              coupleNames={coupleNames}
              guestName={submittedName}
              slug={slug}
              razorpayKeyId={razorpayKeyId}
              upiVpa={upiVpa}
              upiQrCodeUrl={upiQrCodeUrl}
            />

            {/* Subtle bottom border accent */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
          </div>
        ) : (
          /* ── Form Screen ── */
          <div className="p-5 sm:p-8 md:p-10 space-y-6 overflow-y-auto max-h-[90vh]">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-[#C4B7A6] hover:text-white transition-colors z-10"
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

            {deadlineDate && !isNaN(deadlineDate.getTime()) && !isDeadlinePassed && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xs flex items-center gap-2.5 text-xs text-amber-300">
                <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong className="font-semibold text-white">RSVP Cutoff Date:</strong>{" "}
                  {deadlineDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            )}

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
        )}
      </div>
    </div>
  );
}
