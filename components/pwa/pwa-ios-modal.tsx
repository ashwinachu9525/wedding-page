"use client";

import React from "react";
import { X, Share, PlusSquare, Smartphone, CheckCircle2 } from "lucide-react";

interface PwaIosModalProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
}

export function PwaIosModal({ isOpen, onClose, appName = "VivahaLuxe" }: PwaIosModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FAF8F5] text-[#22201E] border-2 border-[#D4AF37] rounded-2xl p-6 shadow-2xl space-y-5 overflow-hidden animate-in slide-in-from-bottom-6 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D9] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#112A21] text-[#D4AF37] flex items-center justify-center font-serif font-bold text-xl shadow-md border border-[#D4AF37]/40">
              V
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#112A21]">Install {appName}</h3>
              <p className="text-[11px] text-[#888178] uppercase tracking-wider font-semibold">
                iOS • Safari Home Screen Setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888178] hover:text-[#22201E] rounded-full hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits text */}
        <p className="text-xs text-[#55514C] leading-relaxed">
          Add <strong className="text-[#112A21]">{appName}</strong> to your iPhone or iPad home screen for full-screen royal aesthetics, instant offline itinerary access, and lightning-fast loading!
        </p>

        {/* Instructions list */}
        <div className="space-y-3.5 bg-white p-4 rounded-xl border border-[#E8E2D9] shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#D4AF37] text-[#112A21] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#112A21] flex items-center gap-1.5">
                <span>Tap the Share button</span>
                <span className="inline-flex items-center justify-center bg-gray-100 p-1 rounded text-blue-600 border border-gray-300">
                  <Share className="w-3.5 h-3.5" />
                </span>
              </p>
              <p className="text-[#888178] text-[11px] mt-0.5">
                Located at the bottom of Safari (or top right on iPad).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 pt-2 border-t border-[#FAF8F5]">
            <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#D4AF37] text-[#112A21] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#112A21] flex items-center gap-1.5">
                <span>Select &apos;Add to Home Screen&apos;</span>
                <span className="inline-flex items-center justify-center bg-gray-100 p-1 rounded text-gray-700 border border-gray-300">
                  <PlusSquare className="w-3.5 h-3.5" />
                </span>
              </p>
              <p className="text-[#888178] text-[11px] mt-0.5">
                Scroll down the share menu to find the plus icon option.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 pt-2 border-t border-[#FAF8F5]">
            <div className="w-7 h-7 rounded-full bg-[#FAF8F5] border border-[#D4AF37] text-[#112A21] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="text-xs">
              <p className="font-semibold text-[#112A21]">Tap &apos;Add&apos; in the top right</p>
              <p className="text-[#888178] text-[11px] mt-0.5">
                VivahaLuxe will appear as an app right on your home screen!
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <button
          onClick={onClose}
          className="w-full bg-[#112A21] hover:bg-[#1C4435] text-[#FAF8F5] py-3 rounded-xl font-serif font-bold tracking-wider uppercase text-xs shadow-md transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
          <span>Got It, Let&apos;s Install!</span>
        </button>
      </div>
    </div>
  );
}
