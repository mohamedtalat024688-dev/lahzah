"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Sparkles } from "lucide-react";
import { GalleryPhoto } from "@/components/gallery/MemoryGallery";
import GalleryLightbox from "./GalleryLightbox";

interface RegalEditorialGridProps {
  photos: GalleryPhoto[];
  coupleNames: string;
  accentColor?: string;
  isLight?: boolean;
}

export default function RegalEditorialGrid({
  photos,
  coupleNames,
  accentColor = "#C5A880",
  isLight = false,
}: RegalEditorialGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Editorial Counter Header */}
      <div
        className="flex items-center justify-between border-b pb-3 text-xs"
        style={{ borderColor: `${accentColor}30` }}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <span
            className={`font-display font-semibold ${
              isLight ? "text-[#1C1917]" : "text-[#FAF8F5]"
            }`}
          >
            ألبوم اللحظات الملكية
          </span>
        </div>
        <span
          className="text-[11px] font-mono opacity-70"
          style={{ color: accentColor }}
        >
          {photos.length} لقطة معتمدة
        </span>
      </div>

      {/* Editorial Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setSelectedIndex(idx)}
            className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border shadow-md hover:shadow-xl hover:scale-[1.02] ${
              isLight
                ? "bg-[#FFFDFC] border-[#E2D8C3]"
                : "bg-[#161412] border-[#2E2822]"
            }`}
            style={{
              borderColor: `${accentColor}35`,
            }}
          >
            <Image
              src={photo.url}
              alt={photo.guestName || "ذكرى من الحفل"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-108"
            />

            {/* Gradient Overlay & Caption Reveal */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end text-right">
              {photo.guestName && (
                <p className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                  <User className="w-3 h-3 text-amber-300 shrink-0" />
                  <span className="truncate">{photo.guestName}</span>
                </p>
              )}
              {photo.message && (
                <p className="text-[10px] text-stone-200 line-clamp-1 italic mt-0.5">
                  «{photo.message}»
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Shared Lightbox */}
      <GalleryLightbox
        photos={photos}
        selectedIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
        onSelectIndex={setSelectedIndex}
        coupleNames={coupleNames}
      />
    </div>
  );
}
