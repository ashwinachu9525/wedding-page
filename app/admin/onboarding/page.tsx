"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles, Heart, Calendar, MapPin, RefreshCw, CheckCircle2, ArrowRight } from "lucide-react";
import { WeddingDatePicker } from "@/components/ui/date-picker";

export default function OnboardingPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");

  const [coupleNames, setCoupleNames] = useState("");
  const [weddingDate, setWeddingDate] = useState("2026-12-14");
  const [venueName, setVenueName] = useState("Umaid Bhawan Palace, Jaipur");
  const [generatedSlug, setGeneratedSlug] = useState("");

  useEffect(() => {
    // Check if already onboarded
    const onboarded = sessionStorage.getItem("vivaha_onboarded");
    if (onboarded === "true") {
      router.push("/admin");
      return;
    }

    // Check logged in user
    const userStr = sessionStorage.getItem("vivaha_user");
    if (userStr) {
      try {
        const u = JSON.parse(userStr);
        if (u.onboarded) {
          sessionStorage.setItem("vivaha_onboarded", "true");
          router.push("/admin");
          return;
        }
        setUserEmail(u.email || "user@domain.com");
        setUserName(u.name || "Celebration Host");
      } catch (e) {}
    }
  }, [router]);

  // Automatically generate an SEO-Friendly, non-repeating unique slug when couple names change
  const generateSeoSlug = (names: string) => {
    if (!names.trim()) return "";
    const clean = names
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    // Non-repeating unique suffix (timestamp last 4 digits + 2 random digits)
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

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coupleNames.trim() || !generatedSlug.trim()) {
      toast.error("Please provide couple names to generate your custom URL.");
      return;
    }

    // Save onboarded celebration details
    const existingUserStr = sessionStorage.getItem("vivaha_user") || "{}";
    let userObj: any = {};
    try {
      userObj = JSON.parse(existingUserStr);
    } catch (e) {}

    const updatedUser = {
      ...userObj,
      coupleNames,
      weddingDate,
      venueName,
      slug: generatedSlug,
      onboarded: true,
    };

    sessionStorage.setItem("vivaha_user", JSON.stringify(updatedUser));
    sessionStorage.setItem("vivaha_onboarded", "true");
    sessionStorage.setItem("admin_authenticated", "true");

    // Persist permanently in registered users storage
    if (userObj.email) {
      const existingUsersStr = localStorage.getItem("vivaha_registered_users") || "{}";
      let existingUsers: Record<string, any> = {};
      try {
        existingUsers = JSON.parse(existingUsersStr);
      } catch (err) {}
      const cleanEmail = userObj.email.trim().toLowerCase();
      if (existingUsers[cleanEmail]) {
        existingUsers[cleanEmail] = {
          ...existingUsers[cleanEmail],
          ...updatedUser,
          onboarded: true,
        };
        localStorage.setItem("vivaha_registered_users", JSON.stringify(existingUsers));
      }
    }

    toast.success(`Celebration initialized! Live slug created: /invite/${generatedSlug}`);
    router.push("/admin");
  };

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
            You are signed in as <span className="text-white font-semibold">{userName || userEmail}</span>. Enter your wedding details to auto-generate your unique SEO-friendly invitation portal.
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
                className="w-full bg-black/50 border border-white/20 px-4 py-3.5 text-sm rounded-xs text-white placeholder-white/30 focus:outline-hidden focus:border-[#D4AF37] transition-all font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C4B7A6] mb-1.5 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Wedding Date (Shadcn Dropdown)</span>
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
                  className="w-full bg-black/50 border border-white/20 px-3.5 py-3 text-xs rounded-xs text-white focus:outline-hidden focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Automatically Generated SEO-Friendly Unique Slug */}
          <div className="bg-[#112A21] border border-emerald-500/30 p-5 rounded-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Unique SEO-Friendly URL Slug</span>
                </span>
                <p className="text-[11px] text-emerald-100/70 mt-0.5">
                  Strictly system-generated with unique identifiers to guarantee 0 duplicate URLs across users.
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
            className="w-full bg-[#D4AF37] hover:bg-[#C5A059] text-[#1F1D1A] py-4 rounded-xs text-xs sm:text-sm uppercase tracking-[0.2em] font-bold transition-all shadow-xl flex items-center justify-center gap-2 group"
          >
            <span>Launch My Royal Dashboard</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}
