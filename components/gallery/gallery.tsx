"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useMedia } from "@/lib/media-context";
import { GalleryImage } from "@/types/wedding";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Maximize2 } from "lucide-react";

const categories = [
  { id: "all", label: "All Portfolio" },
  { id: "mehendi", label: "Mehendi & Sangeet" },
  { id: "ceremony", label: "Muhurtham" },
  { id: "reception", label: "Reception Gala" },
  { id: "engagement", label: "Engagement & Portraits" },
];

export function GallerySection() {
  const { photos } = useMedia();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [index, setIndex] = useState(-1);

  const filteredPhotos =
    selectedCategory === "all"
      ? photos
      : photos.filter((photo) =>
          selectedCategory === "engagement"
            ? photo.category === "engagement" || photo.category === "portraits"
            : selectedCategory === "mehendi"
            ? photo.category === "mehendi" || photo.category === "sangeet"
            : photo.category === selectedCategory
        );

  const slides = filteredPhotos.map((p) => ({
    src: p.src,
    title: p.caption || p.alt,
    description: p.alt,
    width: p.width,
    height: p.height,
  }));

  return (
    <section id="gallery" className="py-24 md:py-36 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-[#88837E] block mb-3">
            Captured Memories
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-[#22201E] tracking-tight mb-6">
            Visual Journal
          </h2>
          <div className="w-16 h-[1px] bg-[#C4B7A6] mx-auto mb-6" />
          <p className="font-serif italic text-lg md:text-xl text-[#66625D] leading-relaxed">
            Glimpses into our journey and the editorial inspiration shaping our wedding weekend.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-16">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2 text-xs uppercase tracking-[0.2em] transition-all duration-300 rounded-full border ${
                  isActive
                    ? "bg-[#22201E] text-[#FAF8F5] border-[#22201E] shadow-xs"
                    : "bg-transparent text-[#66625D] border-[#E8E2D9] hover:border-[#22201E] hover:text-[#22201E]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Responsive Editorial Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo, idx) => {
            return (
              <div
                key={photo.id}
                onClick={() => setIndex(idx)}
                className="break-inside-avoid relative group overflow-hidden rounded-sm bg-[#F0EBE3] cursor-pointer shadow-xs hover:shadow-md transition-all duration-500"
              >
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: `${photo.width} / ${photo.height}`,
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover editorial-image"
                    loading="lazy"
                  />
                </div>

                {/* Hover Caption & Lightbox Trigger */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#C4B7A6] block">
                        {photo.category}
                      </span>
                      <p className="font-serif italic text-base mt-1">
                        {photo.caption || photo.alt}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        <Lightbox
          index={index}
          open={index >= 0}
          close={() => setIndex(-1)}
          slides={slides}
          controller={{ closeOnBackdropClick: true }}
          animation={{ fade: 300, swipe: 250 }}
        />
      </div>
    </section>
  );
}
