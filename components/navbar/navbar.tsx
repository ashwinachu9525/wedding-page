"use client";

import React, { useState, useEffect } from "react";
import { coupleInfo } from "@/data/wedding-data";
import { Menu, X, Heart } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { label: "Story", href: "#story" },
  { label: "Details", href: "#events" },
  { label: "Accommodations", href: "#accommodations" },
  { label: "Gallery", href: "#gallery" },
  { label: "Q&A", href: "#faq" },
];

interface NavbarProps {
  onOpenRSVP?: () => void;
}

export function Navbar({ onOpenRSVP }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Sticky header background threshold
      setScrolled(window.scrollY > 50);

      // Scroll progress
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // Active section tracking
      const sections = navLinks.map((link) => link.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace("#", "");
    const elem = document.getElementById(targetId);
    if (elem) {
      const offset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8E2D9] py-4 shadow-xs"
          : "bg-gradient-to-b from-black/40 to-transparent py-6 text-white"
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-[#C4B7A6] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Monogram Brand */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`font-serif text-2xl md:text-3xl tracking-widest uppercase transition-colors duration-300 ${
            scrolled ? "text-[#22201E]" : "text-white drop-shadow-sm"
          }`}
        >
          {coupleInfo.firstNames.partner1.charAt(0)}{" "}
          <span className="italic text-sm md:text-base font-normal mx-1">&amp;</span>{" "}
          {coupleInfo.firstNames.partner2.charAt(0)}
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const id = link.href.substring(1);
            const isActive = activeSection === id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-xs uppercase tracking-[0.2em] transition-all duration-300 relative py-1 ${
                  scrolled
                    ? isActive
                      ? "text-[#22201E] font-medium"
                      : "text-[#66625D] hover:text-[#22201E]"
                    : isActive
                    ? "text-white font-medium"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[1px] transition-all duration-300 ${
                      scrolled ? "bg-[#22201E]" : "bg-white"
                    }`}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          <button
            onClick={() => {
              const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://aswin-and-annapoorna.com";
              const text = `✨ You are joyfully invited to explore the royal wedding celebration website of Aswin K & Annapoorna! Check out event schedules, venue maps, and confirm your RSVP:\n${siteUrl}`;
              window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
            }}
            title="Share via WhatsApp"
            className={`p-2.5 sm:px-3 sm:py-2.5 rounded-sm transition-all flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
              scrolled
                ? "bg-[#25D366]/15 text-[#1B9B4B] hover:bg-[#25D366] hover:text-white border border-[#25D366]/30"
                : "bg-white/15 backdrop-blur-md text-white border border-white/40 hover:bg-[#25D366] hover:border-[#25D366]"
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={onOpenRSVP}
            className={`px-4 sm:px-5 py-2.5 text-xs uppercase tracking-[0.25em] transition-all duration-300 rounded-sm font-medium ${
              scrolled
                ? "bg-[#22201E] text-[#FAF8F5] hover:bg-[#383532] shadow-xs"
                : "bg-white/15 backdrop-blur-md text-white border border-white/40 hover:bg-white hover:text-[#22201E]"
            }`}
          >
            RSVP
          </button>

          {/* Mobile Sheet Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger
                aria-label="Open Navigation Menu"
                className={`p-2 rounded-sm transition-colors cursor-pointer ${
                  scrolled ? "text-[#22201E]" : "text-white"
                }`}
              >
                <Menu className="w-6 h-6" />
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] max-w-sm bg-[#FAF8F5] border-l border-[#E8E2D9] p-8 flex flex-col justify-between"
              >
                <SheetHeader className="text-left border-b border-[#E8E2D9] pb-6">
                  <SheetTitle className="font-serif text-2xl tracking-widest text-[#22201E] uppercase">
                    {coupleInfo.names}
                  </SheetTitle>
                  <p className="text-xs tracking-widest uppercase text-[#88837E] mt-1">
                    {coupleInfo.weddingDateDisplay}
                  </p>
                </SheetHeader>

                <nav className="flex flex-col space-y-6 py-8" aria-label="Mobile Navigation">
                  {navLinks.map((link) => {
                    const id = link.href.substring(1);
                    const isActive = activeSection === id;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        onClick={(e) => scrollToSection(e, link.href)}
                        className={`text-sm uppercase tracking-[0.25em] transition-colors py-1 flex items-center justify-between ${
                          isActive
                            ? "text-[#22201E] font-semibold pl-2 border-l-2 border-[#22201E]"
                            : "text-[#66625D] hover:text-[#22201E]"
                        }`}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </nav>

                <div className="pt-6 border-t border-[#E8E2D9] space-y-4">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenRSVP && onOpenRSVP();
                    }}
                    className="w-full py-3 bg-[#22201E] text-[#FAF8F5] uppercase tracking-[0.25em] text-xs font-medium hover:bg-[#383532] transition-colors rounded-sm shadow-xs"
                  >
                    Respond Online
                  </button>
                  <div className="flex items-center justify-center space-x-2 text-[#88837E] text-xs tracking-wider">
                    <Heart className="w-3.5 h-3.5 text-[#A89A88]" />
                    <span>{coupleInfo.hashtag}</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
