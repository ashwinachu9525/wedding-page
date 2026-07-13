"use client";

import React, { useState, useEffect } from "react";
import { useConfetti } from "@/hooks/useConfetti";
import { motion, AnimatePresence } from "framer-motion";

export type EnvelopeTemplate =
  | "classic-gold"
  | "midnight-velvet"
  | "pearl-white"
  | "emerald-green"
  | "hindu-royal"
  | "christian-royal"
  | "arabic-royal";

interface EnvelopeProps {
  children: React.ReactNode;
  enableEnvelope: boolean;
  template?: EnvelopeTemplate;
  guestName?: string;
}

interface TemplateConfig {
  name: string;
  outerBg: string;
  outerBorder: string;
  innerLiningBg: string;
  flapShapeClass: string;
  sealStyle: string;
  sealRingStyle: string;
  sealMotif: React.ReactNode;
  textColor: string;
  cardBg: string;
  cardBorder: string;
  accentText: string;
  patternOverlay?: string;
}

const TEMPLATES: Record<EnvelopeTemplate, TemplateConfig> = {
  "hindu-royal": {
    name: "Hindu Royal (Banarasi Silk & Saffron)",
    outerBg: "bg-gradient-to-br from-[#680A1A] via-[#4A0510] to-[#38030B]",
    outerBorder: "border-2 border-[#D4AF37]/60 shadow-[inset_0_0_25px_rgba(212,175,55,0.25)]",
    innerLiningBg: "bg-[#2D060C] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.25)_1px,transparent_1px)] bg-[size:16px_16px]",
    flapShapeClass: "border-b-[2px] border-[#D4AF37]/80",
    sealStyle: "bg-gradient-to-b from-[#FFE8A3] via-[#D4AF37] to-[#997315] text-[#4A0510] shadow-[0_4px_20px_rgba(212,175,55,0.6)]",
    sealRingStyle: "border-2 border-[#4A0510]/40",
    sealMotif: <span className="font-serif text-3xl font-bold tracking-tight">ॐ</span>,
    textColor: "text-[#FAF8F5]",
    cardBg: "bg-[#FAF6F0]",
    cardBorder: "border-[3px] border-double border-[#D4AF37]",
    accentText: "text-[#8B0000]",
    patternOverlay: "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12)_2px,transparent_2px)] after:bg-[size:28px_28px] after:pointer-events-none",
  },
  "christian-royal": {
    name: "Christian Royal (Embossed Ivory Monogram)",
    outerBg: "bg-gradient-to-br from-[#FFFFFF] via-[#FAF9F6] to-[#EFECE6]",
    outerBorder: "border border-[#DCD6CC] shadow-[inset_0_0_30px_rgba(0,0,0,0.04)]",
    innerLiningBg: "bg-[#F3EFEA] bg-[radial-gradient(#C4B7A6_1px,transparent_1px)] bg-[size:14px_14px]",
    flapShapeClass: "border-b border-[#DCD6CC]",
    sealStyle: "bg-gradient-to-b from-[#2B3E50] via-[#1B2A3A] to-[#111A24] text-[#FAF9F6] shadow-[0_4px_16px_rgba(27,42,58,0.5)]",
    sealRingStyle: "border border-[#D4AF37]/60",
    sealMotif: <span className="font-serif text-2xl italic font-light">V</span>,
    textColor: "text-[#2B3E50]",
    cardBg: "bg-[#FFFFFF]",
    cardBorder: "border border-[#C4B7A6] shadow-[inset_0_0_0_4px_#FFFFFF,inset_0_0_0_5px_#C4B7A6]",
    accentText: "text-[#2B3E50]",
  },
  "arabic-royal": {
    name: "Arabic Royal (Sapphire & Arabesque Gold)",
    outerBg: "bg-gradient-to-br from-[#0B292C] via-[#061B1C] to-[#030D0E]",
    outerBorder: "border-2 border-[#E6C280]/60 shadow-[inset_0_0_30px_rgba(230,194,128,0.2)]",
    innerLiningBg: "bg-[#041213] bg-[linear-gradient(45deg,rgba(230,194,128,0.1)_25%,transparent_25%,transparent_75%,rgba(230,194,128,0.1)_75%,rgba(230,194,128,0.1)),linear-gradient(45deg,rgba(230,194,128,0.1)_25%,transparent_25%,transparent_75%,rgba(230,194,128,0.1)_75%,rgba(230,194,128,0.1))] bg-[size:24px_24px]",
    flapShapeClass: "border-b-[2px] border-[#E6C280]/80",
    sealStyle: "bg-gradient-to-b from-[#F3DFA2] via-[#E6C280] to-[#B89448] text-[#061B1C] shadow-[0_4px_20px_rgba(230,194,128,0.6)]",
    sealRingStyle: "border-2 border-[#061B1C]/40",
    sealMotif: <span className="text-2xl">🌙</span>,
    textColor: "text-[#E6C280]",
    cardBg: "bg-[#061B1C]",
    cardBorder: "border-2 border-[#E6C280]",
    accentText: "text-[#E6C280]",
    patternOverlay: "after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_center,rgba(230,194,128,0.08)_1px,transparent_1px)] after:bg-[size:20px_20px] after:pointer-events-none",
  },
  "classic-gold": {
    name: "Classic Gold (Brushed Metallic & Velvet)",
    outerBg: "bg-gradient-to-br from-[#E8C86B] via-[#D4AF37] to-[#A8861B]",
    outerBorder: "border border-[#FFE599] shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]",
    innerLiningBg: "bg-[#1A1816]",
    flapShapeClass: "border-b border-[#FFE599]",
    sealStyle: "bg-gradient-to-b from-[#8B0000] via-[#660000] to-[#400000] text-[#D4AF37] shadow-[0_4px_16px_rgba(139,0,0,0.6)]",
    sealRingStyle: "border border-[#D4AF37]/50",
    sealMotif: <span className="font-serif text-2xl italic">V</span>,
    textColor: "text-[#1F1D1A]",
    cardBg: "bg-[#FAF8F5]",
    cardBorder: "border border-[#D4AF37]",
    accentText: "text-[#8B0000]",
  },
  "midnight-velvet": {
    name: "Midnight Velvet (Dark Brocade Gold)",
    outerBg: "bg-gradient-to-br from-[#24221F] via-[#141311] to-[#0A0A09]",
    outerBorder: "border border-[#D4AF37]/40 shadow-[inset_0_0_30px_rgba(212,175,55,0.1)]",
    innerLiningBg: "bg-[#2A2621]",
    flapShapeClass: "border-b border-[#D4AF37]/50",
    sealStyle: "bg-gradient-to-b from-[#FFE8A3] via-[#D4AF37] to-[#997315] text-[#141311] shadow-[0_4px_16px_rgba(212,175,55,0.5)]",
    sealRingStyle: "border border-[#141311]/40",
    sealMotif: <span className="font-serif text-2xl italic font-bold">V</span>,
    textColor: "text-[#FAF8F5]",
    cardBg: "bg-[#1C1B18]",
    cardBorder: "border border-[#D4AF37]/60",
    accentText: "text-[#D4AF37]",
  },
  "pearl-white": {
    name: "Pearl White (Minimalist Satin Foil)",
    outerBg: "bg-gradient-to-br from-[#FFFFFF] via-[#FAF8F5] to-[#F0EDE6]",
    outerBorder: "border border-[#E2DDD5]",
    innerLiningBg: "bg-[#EAE6DD]",
    flapShapeClass: "border-b border-[#E2DDD5]",
    sealStyle: "bg-gradient-to-b from-[#FFE8A3] via-[#D4AF37] to-[#997315] text-[#1F1D1A] shadow-[0_4px_16px_rgba(212,175,55,0.4)]",
    sealRingStyle: "border border-[#1F1D1A]/20",
    sealMotif: <span className="font-serif text-2xl italic">V</span>,
    textColor: "text-[#1F1D1A]",
    cardBg: "bg-[#FFFFFF]",
    cardBorder: "border border-[#D1C9BE]",
    accentText: "text-[#9E8B73]",
  },
  "emerald-green": {
    name: "Emerald Green (Heritage Forest & Saffron)",
    outerBg: "bg-gradient-to-br from-[#12382B] via-[#0B211A] to-[#061410]",
    outerBorder: "border border-[#D4AF37]/50 shadow-[inset_0_0_25px_rgba(212,175,55,0.15)]",
    innerLiningBg: "bg-[#183B2F]",
    flapShapeClass: "border-b border-[#D4AF37]/50",
    sealStyle: "bg-gradient-to-b from-[#FFE8A3] via-[#D4AF37] to-[#997315] text-[#0B211A] shadow-[0_4px_16px_rgba(212,175,55,0.5)]",
    sealRingStyle: "border border-[#0B211A]/40",
    sealMotif: <span className="font-serif text-2xl italic font-bold">V</span>,
    textColor: "text-[#FAF8F5]",
    cardBg: "bg-[#0F2921]",
    cardBorder: "border border-[#D4AF37]/70",
    accentText: "text-[#D4AF37]",
  },
};

export const Envelope: React.FC<EnvelopeProps> = ({
  children,
  enableEnvelope,
  template = "classic-gold",
  guestName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const { triggerSidePoppers } = useConfetti();

  useEffect(() => {
    if (!enableEnvelope) {
      setShouldShow(false);
      return;
    }
    const hasOpenedBefore = localStorage.getItem("envelope_opened");
    if (!hasOpenedBefore) {
      setShouldShow(true);
    }
  }, [enableEnvelope]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    triggerSidePoppers();

    // Give time for the luxurious 3D card extraction & flap sequence before transition
    setTimeout(() => {
      setIsRevealed(true);
      localStorage.setItem("envelope_opened", "true");
    }, 2800);
  };

  if (!enableEnvelope || !shouldShow || isRevealed) {
    return <>{children}</>;
  }

  const cfg = TEMPLATES[template] || TEMPLATES["classic-gold"];

  return (
    <AnimatePresence>
      {!isRevealed && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md overflow-hidden p-4 sm:p-6"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main 3D Container with high perspective */}
          <div
            className="relative w-full max-w-lg aspect-[16/11] sm:aspect-[3/2] cursor-pointer group [perspective:1400px]"
            onClick={handleOpen}
          >
            {/* Outer Envelope / Folio Jacket */}
            <motion.div
              className={`relative w-full h-full rounded-lg shadow-[0_35px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col items-center justify-between ${cfg.outerBg} ${cfg.outerBorder} ${cfg.patternOverlay || ""}`}
              animate={isOpen ? { y: "110%", opacity: 0 } : { y: 0, opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Inner Foil/Pattern Lining Box inside the Envelope top portion */}
              <div
                className={`absolute inset-x-2 top-2 h-[45%] rounded-t-md overflow-hidden pointer-events-none z-0 ${cfg.innerLiningBg} border-b border-black/10`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
              </div>

              {/* The Invitation Card sliding OUT from inside the Envelope pocket */}
              <motion.div
                className={`absolute z-10 w-[88%] h-[115%] left-[6%] top-[6%] rounded-md shadow-2xl p-5 sm:p-7 flex flex-col justify-between items-center text-center ${cfg.cardBg} ${cfg.cardBorder}`}
                initial={{ y: "12%" }}
                animate={isOpen ? { y: "-45%", scale: 1.02 } : { y: "12%", scale: 1 }}
                transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Decorative Inner Card Header */}
                <div className="w-full flex flex-col items-center">
                  <div className={`text-[10px] sm:text-xs tracking-[0.3em] uppercase font-bold mb-1.5 ${cfg.accentText}`}>
                    Royal Wedding Invitation
                  </div>
                  <div className="w-12 h-[1px] bg-current opacity-30 mb-3" />
                  <h2 className="font-serif text-2xl sm:text-3xl tracking-wide font-normal">
                    You Are Cordially Invited
                  </h2>
                </div>

                {/* Center Graphic / Text on Card */}
                <div className="my-auto py-3 px-4 flex flex-col items-center">
                  <p className="text-xs sm:text-sm italic opacity-80 max-w-xs leading-relaxed font-serif">
                    “Two souls united in love, tradition, and timeless celebration under auspicious stars.”
                  </p>
                </div>

                {/* Card Footer Note */}
                <div className="w-full pt-3 border-t border-current/15 flex items-center justify-between text-[10px] tracking-widest uppercase opacity-70 font-sans">
                  <span>Special Delivery</span>
                  <span>Open Letter Portal</span>
                </div>
              </motion.div>

              {/* Envelope Bottom Pocket (Covers bottom 62% of card) */}
              <div
                className={`absolute bottom-0 inset-x-0 h-[62%] rounded-b-lg overflow-hidden z-20 pointer-events-none ${cfg.outerBg} ${cfg.outerBorder} ${cfg.patternOverlay || ""}`}
              >
                {/* Diagonal Pocket Seam Lines for authentic envelope look */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20 shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
              </div>

              {/* Top Flap (Curved V or Arch Flap opening upwards with 3D rotation) */}
              <motion.div
                className={`absolute top-0 inset-x-0 h-[52%] origin-top z-30 rounded-t-lg overflow-hidden ${cfg.outerBg} ${cfg.outerBorder} ${cfg.flapShapeClass} ${cfg.patternOverlay || ""}`}
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 30%, 50% 100%, 0 30%)",
                  transformStyle: "preserve-3d",
                }}
                animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.85, ease: [0.33, 1, 0.68, 1] }}
              >
                {/* Flap Shading */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-black/35 pointer-events-none" />
              </motion.div>

              {/* Luxurious 3D Metallic Seal Badge (Positions exactly at flap tip) */}
              <motion.div
                className={`absolute top-[48%] sm:top-[50%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-18 sm:h-18 rounded-full z-40 flex items-center justify-center cursor-pointer transition-transform duration-300 group-hover:scale-105 ${cfg.sealStyle}`}
                animate={isOpen ? { scale: 0, opacity: 0, rotate: 180 } : { scale: 1, opacity: 1, rotate: 0 }}
                transition={{ duration: 0.45, ease: "easeIn" }}
              >
                {/* Inner Embossed Ring of the Seal */}
                <div className={`w-[82%] h-[82%] rounded-full flex items-center justify-center ${cfg.sealRingStyle}`}>
                  {cfg.sealMotif}
                </div>
                {/* Ribbon or shine highlight on seal */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-white/30 rounded-full blur-xs pointer-events-none" />
              </motion.div>

              {/* Guest Name / Addressee Calligraphy overlay (fades out instantly when clicked) */}
              <motion.div
                className={`absolute inset-x-0 bottom-[14%] sm:bottom-[16%] z-30 flex flex-col items-center text-center px-6 pointer-events-none ${cfg.textColor}`}
                animate={isOpen ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {guestName ? (
                  <>
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] opacity-75 font-semibold mb-1">
                      Personalized Delivery For
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-light italic tracking-wide drop-shadow-md">
                      {guestName}
                    </h3>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] opacity-75 font-semibold mb-1">
                      Privileged Invitation
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-light italic tracking-wide drop-shadow-md">
                      Tap To Unseal & Celebrate
                    </h3>
                  </>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Prompt text at bottom of screen */}
          <motion.div
            className="absolute bottom-8 sm:bottom-12 flex flex-col items-center gap-1.5 text-center pointer-events-none"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <p className="text-white text-xs sm:text-sm tracking-[0.25em] uppercase font-serif font-medium">
              {isOpen ? "Unsealing Royal Invitation..." : "Tap Envelope To Unseal"}
            </p>
            <div className="w-8 h-[1px] bg-white/40" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
