"use client";

import React, { useState, useMemo } from "react";
import { FONT_PAIRINGS, FontPairing, getFontPairingById } from "@/lib/fonts";
import { Sparkles, Search, Check, ChevronDown, Type } from "lucide-react";

interface FontSelectorProps {
  currentFontId: string;
  onSelectFont: (fontId: string) => void;
  className?: string;
}

export function FontSelector({ currentFontId, onSelectFont, className = "" }: FontSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const currentPairing = getFontPairingById(currentFontId);

  const filteredPairings = useMemo(() => {
    if (!searchQuery.trim()) return FONT_PAIRINGS;
    const q = searchQuery.toLowerCase();
    return FONT_PAIRINGS.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.headingFont.toLowerCase().includes(q) ||
        p.bodyFont.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    filteredPairings.forEach((p) => cats.add(p.category));
    return Array.from(cats);
  }, [filteredPairings]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-[#4A453F] uppercase tracking-wider flex items-center gap-1.5">
          <Type className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Invitation Typography & Calligraphy Style</span>
        </label>
        
        {/* Dropdown trigger button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 text-left bg-white border border-[#E8E2D9] rounded-sm shadow-xs hover:border-[#D4AF37] focus:outline-hidden focus:ring-2 focus:ring-[#D4AF37]/50 transition-all flex items-center justify-between"
        >
          <div className="flex flex-col truncate pr-2">
            <span className="text-sm font-medium text-[#22201E] flex items-center gap-2">
              <span>{currentPairing.label}</span>
              {currentPairing.isPremium && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-bold bg-[#D4AF37]/15 text-[#9C7B1C] rounded-full uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5" /> Premium
                </span>
              )}
            </span>
            <span className="text-xs text-[#66625D] truncate">{currentPairing.description}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-[#66625D] shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Searchable Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-[#E8E2D9] rounded-sm shadow-2xl overflow-hidden animate-fade-in max-h-[420px] flex flex-col">
          {/* Search Header */}
          <div className="p-3 border-b border-[#E8E2D9] bg-[#FAF8F5] sticky top-0 z-10 flex items-center gap-2">
            <Search className="w-4 h-4 text-[#8C857B] shrink-0" />
            <input
              type="text"
              placeholder="Search fonts (e.g. Bickham, Cormorant, Great Vibes, Canela)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-[#22201E] placeholder:text-[#8C857B] focus:outline-hidden"
              autoFocus
            />
          </div>

          {/* Grouped Options */}
          <div className="overflow-y-auto divide-y divide-[#F0EBE3] p-2 space-y-3">
            {categories.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#8C857B]">
                No font pairings found matching "{searchQuery}"
              </div>
            ) : (
              categories.map((cat) => {
                const items = filteredPairings.filter((p) => p.category === cat);
                return (
                  <div key={cat} className="pt-2 first:pt-0">
                    <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#9C7B1C] bg-[#D4AF37]/10 rounded-xs mb-1.5 flex items-center justify-between">
                      <span>{cat}</span>
                      <span className="text-[10px] opacity-75">{items.length} options</span>
                    </div>
                    <div className="space-y-1">
                      {items.map((pairing) => {
                        const isSelected = pairing.id === currentFontId;
                        return (
                          <button
                            key={pairing.id}
                            type="button"
                            onClick={() => {
                              onSelectFont(pairing.id);
                              setIsOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xs transition-all flex items-start justify-between gap-3 ${
                              isSelected
                                ? "bg-[#FAF3E0] border border-[#D4AF37]/40 text-[#22201E] shadow-xs"
                                : "hover:bg-[#FAF8F5] text-[#4A453F]"
                            }`}
                          >
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-2">
                                <span
                                  className="text-sm font-medium text-[#22201E]"
                                  style={{ fontFamily: pairing.headingFont.split(",")[0].replace(/'/g, "") }}
                                >
                                  {pairing.label}
                                </span>
                                {pairing.isPremium && (
                                  <span className="px-1.5 py-0.2 text-[9px] font-bold bg-[#D4AF37]/20 text-[#8C6B10] rounded-full uppercase tracking-wider">
                                    PRO / LUXE
                                  </span>
                                )}
                              </div>
                              <span
                                className="text-xs text-[#66625D] line-clamp-1"
                                style={{ fontFamily: pairing.bodyFont.split(",")[0].replace(/'/g, "") }}
                              >
                                {pairing.description}
                              </span>
                              <div className="flex items-center gap-3 text-[10px] text-[#8C857B] mt-1 font-mono">
                                <span>Heading: {pairing.headingFont.split(",")[0]}</span>
                                <span>•</span>
                                <span>Body: {pairing.bodyFont.split(",")[0]}</span>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-1" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
