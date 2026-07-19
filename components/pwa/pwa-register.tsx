"use client";

import React, { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { PwaIosModal } from "./pwa-ios-modal";

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("PWA ServiceWorker registered with scope:", reg.scope);
          })
          .catch((err) => {
            console.warn("PWA ServiceWorker registration failed:", err);
          });
      });
    }

    // 2. Detect Standalone Mode (Installed PWA)
    const checkStandalone = () => {
      const standalone = typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true);
      setIsStandalone(standalone);
      if (standalone && typeof document !== "undefined") {
        document.body.classList.add("pwa-standalone");
      } else if (typeof document !== "undefined") {
        document.body.classList.remove("pwa-standalone");
      }
      return standalone;
    };

    const standaloneState = checkStandalone();
    if (typeof window !== "undefined") {
      window.matchMedia("(display-mode: standalone)").addEventListener("change", checkStandalone);
    }

    // Check iOS Safari device
    const ios =
      typeof window !== "undefined" &&
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream &&
      !standaloneState;
    setIsIOS(ios);

    // If iOS and not installed and not dismissed, show banner
    const dismissed = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("vivaha_pwa_dismissed") : null;
    if (ios && !dismissed && !standaloneState) {
      setShowInstallBanner(true);
    }

    // 3. Listen for Chrome / Android Install Prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (typeof window !== "undefined") {
        (window as any).__pwaDeferredPrompt = e;
      }
      if (!dismissed && !standaloneState) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        toast.success("VivahaLuxe installed on your device!");
        setShowInstallBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIOS) {
      setShowIosModal(true);
    } else {
      toast.info("To install, click the Install icon (⊕) in your browser address bar.");
    }
  };

  const dismissBanner = () => {
    setShowInstallBanner(false);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem("vivaha_pwa_dismissed", "true");
    }
  };

  if (!showInstallBanner || isStandalone) return null;

  return (
    <>
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 max-w-sm bg-[#1F1D1A]/95 text-[#FAF8F5] border border-[#D4AF37]/50 p-3 sm:p-4 rounded-xl shadow-2xl z-50 backdrop-blur-xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0 font-serif font-bold text-lg">
            V
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
              <span>Install VivahaLuxe</span>
              <Smartphone className="w-3 h-3 text-[#D4AF37]" />
            </p>
            <p className="text-[10px] text-[#C4B7A6] truncate">Instant offline access &amp; faster loading</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleInstallClick}
            className="bg-[#D4AF37] hover:bg-[#C5A059] text-[#141210] px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-transform active:scale-95 shadow-sm flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
          <button
            onClick={dismissBanner}
            className="p-1.5 text-[#888178] hover:text-white transition-colors rounded-lg"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <PwaIosModal isOpen={showIosModal} onClose={() => setShowIosModal(false)} />
    </>
  );
}
