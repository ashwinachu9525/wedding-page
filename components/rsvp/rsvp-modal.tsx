"use client";

import React, { useState } from "react";
import { coupleInfo } from "@/data/wedding-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CheckCircle2, Sparkles, Heart } from "lucide-react";

interface RSVPModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RSVPModal({ open, onOpenChange }: RSVPModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    attending: "yes",
    guestCount: 1,
    dietary: "",
    songRequest: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-[#FAF8F5] border-[#E8E2D9] p-8 md:p-10 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto">
        {!submitted ? (
          <>
            <DialogHeader className="text-center mb-6">
              <span className="text-xs uppercase tracking-[0.3em] text-[#88837E] block mb-2">
                Join Our Celebration
              </span>
              <DialogTitle className="font-serif text-3xl md:text-4xl text-[#22201E] tracking-tight">
                RSVP to {coupleInfo.names}
              </DialogTitle>
              <DialogDescription className="font-serif italic text-base text-[#66625D]">
                Kindly respond by July 1, 2026.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#22201E] font-medium mb-2">
                  Full Name(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lord & Lady Kensington"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-[#DED7CD] rounded-sm text-sm focus:outline-none focus:border-[#22201E] transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#22201E] font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="kensington@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-[#DED7CD] rounded-sm text-sm focus:outline-none focus:border-[#22201E] transition-colors"
                />
              </div>

              {/* Attendance Radio */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#22201E] font-medium mb-3">
                  Will You Be Attending? *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: "yes" })}
                    className={`py-3.5 px-4 rounded-sm border text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                      formData.attending === "yes"
                        ? "bg-[#22201E] text-[#FAF8F5] border-[#22201E]"
                        : "bg-white text-[#66625D] border-[#DED7CD] hover:border-[#22201E]"
                    }`}
                  >
                    Joyfully Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, attending: "no" })}
                    className={`py-3.5 px-4 rounded-sm border text-xs uppercase tracking-[0.15em] font-medium transition-all ${
                      formData.attending === "no"
                        ? "bg-[#22201E] text-[#FAF8F5] border-[#22201E]"
                        : "bg-white text-[#66625D] border-[#DED7CD] hover:border-[#22201E]"
                    }`}
                  >
                    Regretfully Decline
                  </button>
                </div>
              </div>

              {/* Guest Count (if attending) */}
              {formData.attending === "yes" && (
                <>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#22201E] font-medium mb-2">
                      Number of Guests (Including Yourself)
                    </label>
                    <select
                      value={formData.guestCount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          guestCount: Number(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 bg-white border border-[#DED7CD] rounded-sm text-sm focus:outline-none focus:border-[#22201E] transition-colors"
                    >
                      {[1, 2, 3, 4].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Dietary Requirements */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#22201E] font-medium mb-2">
                      Dietary Requirements / Allergies
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Vegetarian, Gluten-Free, Nut Allergy"
                      value={formData.dietary}
                      onChange={(e) =>
                        setFormData({ ...formData, dietary: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-[#DED7CD] rounded-sm text-sm focus:outline-none focus:border-[#22201E] transition-colors"
                    />
                  </div>

                  {/* Song Request */}
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-[#22201E] font-medium mb-2">
                      Dance Floor Song Request
                    </label>
                    <input
                      type="text"
                      placeholder="What song will get you on the dance floor?"
                      value={formData.songRequest}
                      onChange={(e) =>
                        setFormData({ ...formData, songRequest: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-white border border-[#DED7CD] rounded-sm text-sm focus:outline-none focus:border-[#22201E] transition-colors"
                    />
                  </div>
                </>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs uppercase tracking-[0.2em] text-[#22201E] font-medium mb-2">
                  A Note For The Couple (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Share a well-wish or note..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-white border border-[#DED7CD] rounded-sm text-sm focus:outline-none focus:border-[#22201E] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#22201E] text-[#FAF8F5] uppercase tracking-[0.25em] text-xs font-semibold hover:bg-[#383532] transition-colors rounded-sm shadow-md disabled:opacity-50"
              >
                {loading ? "Sending Response..." : "Submit RSVP"}
              </button>
            </form>
          </>
        ) : (
          <div className="py-12 text-center space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-[#22201E] text-[#FAF8F5] rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-8 h-8 text-[#C4B7A6]" />
            </div>
            <h3 className="font-serif text-3xl text-[#22201E]">
              Thank You, {formData.fullName}!
            </h3>
            <p className="text-sm md:text-base text-[#55514C] max-w-md mx-auto leading-relaxed">
              {formData.attending === "yes"
                ? `We are overjoyed that you will be celebrating with us in Lake Como! A confirmation email has been dispatched to ${formData.email}.`
                : "We will miss your presence dearly, but thank you so much for letting us know and sending your love."}
            </p>
            <div className="pt-6">
              <button
                onClick={resetAndClose}
                className="px-8 py-3.5 bg-[#22201E] text-[#FAF8F5] uppercase tracking-[0.25em] text-xs font-medium hover:bg-[#383532] transition-colors rounded-sm"
              >
                Return to Website
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
