"use client";

import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Camera, X, ZoomIn, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  src: string;
  caption?: string;
  category?: "ceremony" | "reception" | "portraits" | "engagement" | "all";
}

interface GallerySectionProps {
  images?: Array<string | GalleryImage>;
  accentClass?: string;
}

export function GallerySection({
  images = [
    { src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop", caption: "Sacred Mandap Setup", category: "ceremony" },
    { src: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1974&auto=format&fit=crop", caption: "Evening Gala Toast", category: "reception" },
    { src: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop", caption: "Sunset Engagement", category: "engagement" },
    { src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?q=80&w=2070&auto=format&fit=crop", caption: "Royal Portraits", category: "portraits" },
    { src: "https://images.unsplash.com/photo-1545232972-9bb88a5b6dcc?q=80&w=2070&auto=format&fit=crop", caption: "Vedic Traditions", category: "ceremony" },
    { src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=2070&auto=format&fit=crop", caption: "First Dance", category: "reception" },
  ],
  accentClass = "text-[#D4AF37]",
}: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Touch tracking refs for swipe gesture
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  if (!images || images.length === 0) return null;

  // Normalize image data
  const normalizedImages: GalleryImage[] = images.map((img) => {
    if (typeof img === "string") {
      return { src: img, caption: "Sacred Moment", category: "ceremony" };
    }
    return {
      src: img.src,
      caption: img.caption || "Sacred Moment",
      category: img.category || "ceremony",
    };
  });

  const filteredImages =
    activeFilter === "all"
      ? normalizedImages
      : normalizedImages.filter((img) => img.category === activeFilter);

  const categories = ["all", "ceremony", "reception", "portraits", "engagement"];

  // Lightbox navigation
  const goNext = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev + 1) % filteredImages.length;
    });
  }, [filteredImages.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => {
      if (prev === null) return null;
      return (prev - 1 + filteredImages.length) % filteredImages.length;
    });
  }, [filteredImages.length]);

  // Keyboard navigation in lightbox
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
    if (e.key === "Escape") setSelectedIndex(null);
  }, [goNext, goPrev]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    // Only register horizontal swipe if it's clearly more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) goNext(); // swipe left → next
      else goPrev();            // swipe right → prev
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const selectedImg = selectedIndex !== null ? filteredImages[selectedIndex] : null;

  return (
    <section id="gallery" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className={`w-4 h-4 ${accentClass}`} />
          <span className="text-xs uppercase tracking-[0.3em] opacity-75">Bespoke Editorial Feature</span>
          <Sparkles className={`w-4 h-4 ${accentClass}`} />
        </div>
        <h2 className="font-serif text-3xl sm:text-5xl uppercase tracking-wide">Masonry Photo Portfolio</h2>
        <p className="text-xs uppercase tracking-widest opacity-70">Filter moments by celebration milestone</p>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-semibold border transition-all ${
                activeFilter === cat
                  ? "bg-[#D4AF37] text-[#141311] border-[#D4AF37] font-bold shadow-md"
                  : "border-current/20 opacity-70 hover:opacity-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((item, idx) => (
          <div
            key={item.src || idx}
            onClick={() => item.src && setSelectedIndex(idx)}
            className="group relative aspect-4/3 rounded-sm overflow-hidden border border-current/15 cursor-pointer shadow-xs hover:shadow-xl transition-all bg-black/5"
          >
            {item.src ? (
              <Image
                src={item.src}
                alt={item.caption || `Celebration Moment ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-black/10 flex items-center justify-center text-xs opacity-40">No image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-300 font-semibold">
                    {item.category}
                  </span>
                  <p className="font-serif text-lg leading-tight">{item.caption}</p>
                </div>
                <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg shrink-0">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal with Swipe + Arrow Navigation */}
      {selectedImg && selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedIndex(null)}
          onKeyDown={handleKeyDown}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          role="dialog"
          aria-label="Image lightbox"
        >
          {/* Close Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setSelectedIndex(null); }}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-50"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/20 z-50">
            {selectedIndex + 1} / {filteredImages.length}
          </div>

          {/* Prev Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all z-50 backdrop-blur-sm border border-white/20 active:scale-95"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next Arrow */}
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white transition-all z-50 backdrop-blur-sm border border-white/20 active:scale-95"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Image */}
          <div
            className="relative max-w-5xl max-h-[80vh] w-full h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={selectedImg.src} alt={selectedImg.caption || "Expanded Lightbox View"} fill className="object-contain" />
          </div>

          {/* Caption */}
          {selectedImg.caption && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-50">
              <p className="text-white font-serif text-lg">{selectedImg.caption}</p>
              <p className="text-amber-300 text-[10px] uppercase tracking-widest mt-0.5">{selectedImg.category}</p>
            </div>
          )}

          {/* Swipe hint on mobile */}
          <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 text-[10px] uppercase tracking-widest sm:hidden">
            Swipe to navigate
          </p>
        </div>
      )}
    </section>
  );
}
