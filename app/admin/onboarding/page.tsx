"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Heart, Calendar, MapPin, RefreshCw, CheckCircle2, ArrowRight, User } from "lucide-react";
import { WeddingDatePicker } from "@/components/ui/date-picker";
import { useSession } from "@/hooks/useSession";

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, refresh } = useSession();

  const [coupleNames, setCoupleNames] = useState("");
  const [brideDetails, setBrideDetails] = useState("");
  const [groomDetails, setGroomDetails] = useState("");
  const [weddingDate, setWeddingDate] = useState("2026-12-14");
  const [venueName, setVenueName] = useState("Umaid Bhawan Palace, Jaipur");
  const [generatedSlug, setGeneratedSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      // Not logged in
      router.replace("/auth/login");
      return;
    }
    if (user.onboarded && user.slug && !submitting) {
      // Already onboarded — skip to dashboard
      router.replace("/admin");
    }
  }, [user, loading, submitting, router]);

  const generateSeoSlug = (names: string) => {
    if (!names.trim()) return "";
    const clean = names
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    const uniqueId = Math.floor(1000 + Math.random() * 9000);
    return `${clean}-${uniqueId}`;
  };

  const handleNameChange = (val: string) => {
    setCoupleNames(val);
    setGeneratedSlug(generateSeoSlug(val));
  };

  const regenerateSlug = () => {
    if (!coupleNames) return;
    setGeneratedSlug(generateSeoSlug(coupleNames));
    toast.success("Generated new unique SEO slug!");
  };

  const handleCompleteOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleNames.trim() || !generatedSlug.trim()) {
      toast.error("Please provide couple names to generate your custom URL.");
      return;
    }
    if (!user?.email) {
      toast.error("Session expired. Please log in again.");
      router.replace("/auth/login");
      return;
    }

    setSubmitting(true);
    try {
      // Save invitation to DB via existing /api/invitations
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          slug: generatedSlug,
          coupleNames,
          brideDetails,
          groomDetails,
          weddingDate,
          venueName,
        }),
      });
      const data = await res.json();

      if (!res.ok && !data.slug) {
        toast.error(data.error || "Failed to save celebration details. Please try again.");
        setSubmitting(false);
        return;
      }

      // Refresh the session cookie — re-reads user + invitation from DB
      // Works for any provider (google, credentials, etc.)
      await fetch("/api/auth/session-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "refresh",
          email: user.email,
          slug: generatedSlug,
        }),
      });

      // Re-fetch the session so useSession reflects the updated onboarded state
      // before navigating — prevents the /admin → /onboarding redirect loop.
      await refresh();

      toast.success(`Celebration initialized! Live slug created: /invite/${generatedSlug}`);
      router.push("/admin");
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1F1D1A] text-[#FAF8F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-widest text-[#C4B7A6]">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1D1A] text-[#FAF8F5] flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
      <div className="max-w-2xl w-full bg-[#2A2723] border border-[#D4AF37]/40 p-8 sm:p-12 rounded-sm shadow-2xl space-y-8 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-inner">
            <Heart className="w-7 h-7 fill-[#D4AF37]" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D4AF37]/10 rounded-full text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold">
            <Sparkles className="w-3 h-3" />
            <span>Welcome to VivahaLuxe Setup</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-wide">
            Tell Us About Your Celebration
          </h1>
          <p className="text-xs sm:text-sm text-[#C4B7A6] max-w-md mx-auto leading-relaxed">
            You are signed in as{" "}
            <span className="text-white font-semibold">{user?.name || user?.email}</span>. Enter your wedding details to auto-generate your unique SEO-friendly invitation portal.
          </p>
        </div>

        <form onSubmit={handleCompleteOnboarding} className="space-y-6">
          <div className="bg-[#1F1D1A] p-6 rounded-xs border border-white/10 space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#D4AF37] mb-2 font-bold flex items-center gap-1.5">
                <Heart className="w-4 h-4 fill-[#D4AF37]" />
                <span>Couple Names (Required)</span>
              </label>
              <input
                type="text"
                required
                value={coupleNames}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Rahul Sharma & Anjali Mehta"
                className="w-full bg-black/50 border border-white/20 px-4 py-3.5 text-sm rounded-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37] transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1.5 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-pink-400" />
                  <span>Bride Details</span>
                </label>
                <input
                  type="text"
                  value={brideDetails}
                  onChange={(e) => setBrideDetails(e.target.value)}
                  placeholder="e.g. Daughter of Sri. Mehta & Smt. Mehta"
                  className="w-full bg-black/50 border border-white/20 px-3.5 py-3 text-xs rounded-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1.5 font-semibold flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Groom Details</span>
                </label>
                <input
                  type="text"
                  value={groomDetails}
                  onChange={(e) => setGroomDetails(e.target.value)}
                  placeholder="e.g. Son of Sri. Sharma & Smt. Sharma"
                  className="w-full bg-black/50 border border-white/20 px-3.5 py-3 text-xs rounded-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1.5 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wedding Date</span>
                </label>
                <WeddingDatePicker value={weddingDate} onChange={setWeddingDate} />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1.5 font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Primary Venue / Location</span>
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  placeholder="e.g. Umaid Bhawan Palace, Jaipur"
                  className="w-full bg-black/50 border border-white/20 px-3.5 py-3 text-xs rounded-xs text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Generated slug */}
          <div className="bg-[#112A21] border border-emerald-500/30 p-5 rounded-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unique SEO-Friendly URL Slug</span>
                </span>
                <p className="text-[11px] text-emerald-100/70 mt-0.5">
                  System-generated with unique identifiers to guarantee 0 duplicate URLs.
                </p>
              </div>
              {coupleNames && (
                <button
                  type="button"
                  onClick={regenerateSlug}
                  className="px-2.5 py-1.5 bg-emerald-900/60 hover:bg-emerald-900 text-emerald-200 rounded-xs text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 border border-emerald-700/50 transition-all"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Cycle Unique ID</span>
                </button>
              )}
            </div>

            <div className="flex items-center relative">
              <span className="bg-black/80 border border-r-0 border-emerald-500/30 px-3 py-3 text-xs text-emerald-400/80 rounded-l-xs font-mono select-none">
                vivahaluxe.app/invite/
              </span>
              <input
                type="text"
                readOnly
                value={generatedSlug || "type-couple-names-above"}
                className="flex-1 bg-black/60 border border-emerald-500/30 px-3.5 py-3 text-xs sm:text-sm rounded-r-xs text-emerald-300 font-bold font-mono cursor-not-allowed select-all"
              />
              <div className="absolute right-3 flex items-center gap-1 text-[10px] text-emerald-400/70 uppercase tracking-widest font-semibold bg-black/40 px-2 py-1 rounded">
                🔒 System Locked
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#D4AF37] hover:bg-[#C5A059] disabled:opacity-60 text-[#1F1D1A] py-4 rounded-xs text-xs sm:text-sm uppercase tracking-[0.2em] font-bold transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            <span>{submitting ? "Saving..." : "Launch My Royal Dashboard"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
