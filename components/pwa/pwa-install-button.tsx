"use client";

import React, { useState, useEffect } from "react";
import { Smartphone, Download, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PwaIosModal } from "./pwa-ios-modal";

interface PwaInstallButtonProps {
  appName?: string;
  className?: string;
  variant?: "primary" | "secondary" | "outline" | "card";
  size?: "sm" | "md" | "lg";
  label?: string;
}

export function PwaInstallButton({
  appName = "VivahaLuxe",
  className = "",
  variant = "primary",
  size = "md",
  label,
}: PwaInstallButtonProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if running in standalone installed app
    const standalone =
      typeof window !== "undefined" &&
      (window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true);
    setIsStandalone(standalone);

    // Check if device is iOS Safari
    const ios =
      typeof window !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream &&
      !standalone;
    setIsIOS(ios);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Also check global event captured by PwaRegister if any
    if (typeof window !== "undefined" && (window as any).__pwaDeferredPrompt) {
      setDeferredPrompt((window as any).__pwaDeferredPrompt);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  if (!mounted) return null;

  const handleClick = async () => {
    if (isStandalone) {
      toast.success(`${appName} is already installed and running on your device!`);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast.success(`${appName} successfully installed!`);
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIosModal(true);
    } else {
      // Desktop / unsupported browser direct hint
      toast.info(`To install ${appName}, click the Install icon (⊕) in your browser address bar right at the top right, or select 'Install App' from your browser menu.`);
    }
  };

  // Base styling per size
  const sizeClasses = {
    sm: "px-3 py-1.5 text-[11px] gap-1.5",
    md: "px-4 py-2.5 text-xs gap-2",
    lg: "px-6 py-3.5 text-sm gap-2.5",
  }[size];

  // Base styling per variant
  const variantClasses = {
    primary: "bg-[#D4AF37] hover:bg-[#C5A059] text-[#141210] font-bold uppercase tracking-wider shadow-md rounded-lg transition-all active:scale-95",
    secondary: "bg-[#112A21] hover:bg-[#1C4435] text-[#FAF8F5] font-serif tracking-wide border border-[#D4AF37]/50 rounded-lg shadow-sm transition-all",
    outline: "border border-current/30 hover:border-current/60 bg-current/5 hover:bg-current/10 font-medium uppercase tracking-wider rounded-lg transition-all",
    card: "w-full bg-[#1F1D1A] border-2 border-[#D4AF37] text-[#FAF8F5] p-5 rounded-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-[#E6C35C] transition-all",
  }[variant];

  if (variant === "card") {
    return (
      <>
        <div className={`pwa-install-card ${variantClasses} ${className}`}>
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0 font-serif font-bold text-xl">
              V
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37]">Offline PWA Ready</span>
                {isStandalone && (
                  <span className="bg-emerald-950 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Installed
                  </span>
                )}
              </div>
              <h4 className="font-serif text-lg font-bold text-white mt-0.5">
                Install {appName} App
              </h4>
              <p className="text-xs text-[#C4B7A6] max-w-md">
                Add this royal celebration guide straight to your phone home screen for instant offline itinerary maps and faster loading!
              </p>
            </div>
          </div>

          <button
            onClick={handleClick}
            disabled={isStandalone}
            className="bg-[#D4AF37] hover:bg-[#C5A059] disabled:bg-emerald-900 disabled:text-emerald-100 text-[#141210] px-5 py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shrink-0 transition-transform active:scale-95 shadow-lg w-full sm:w-auto"
          >
            {isStandalone ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Installed App</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{label || "Install to Phone"}</span>
              </>
            )}
          </button>
        </div>
        <PwaIosModal isOpen={showIosModal} onClose={() => setShowIosModal(false)} appName={appName} />
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`inline-flex items-center justify-center ${sizeClasses} ${variantClasses} ${className}`}
        title={`Install ${appName} to your device`}
      >
        {isStandalone ? (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Installed</span>
          </>
        ) : (
          <>
            <Smartphone className="w-3.5 h-3.5" />
            <span>{label || "Install App"}</span>
          </>
        )}
      </button>
      <PwaIosModal isOpen={showIosModal} onClose={() => setShowIosModal(false)} appName={appName} />
    </>
  );
}
