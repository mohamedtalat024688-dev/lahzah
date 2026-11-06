"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart } from "lucide-react";
import { GalleryPhoto } from "@/components/gallery/MemoryGallery";
import GalleryLightbox from "./GalleryLightbox";

interface PolaroidPinboardGalleryProps {
  photos: GalleryPhoto[];
  coupleNames: string;
  accentColor?: string;
  isLight?: boolean;
}

export default function PolaroidPinboardGallery({
  photos,
  coupleNames,
  accentColor = "#D6B77A",
  isLight = false,
}: PolaroidPinboardGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Subtle natural staggered rotations for the pinboard
  const getTiltAngle = (idx: number) => {
    const tilts = ["rotate-[-2deg]", "rotate-[1.5deg]", "rotate-[-1deg]", "rotate-[2.5deg]", "rotate-[-2.5deg]"];
    return tilts[idx % tilts.length];
  };

  return (
    <div className="space-y-6">
      {/* Pinboard Header */}
      <div
        className="flex items-center justify-between border-b pb-3 text-xs"
        style={{ borderColor: `${accentColor}30` }}
      >
        <div className="flex items-center gap-2">
          <Heart className="w-3.5 h-3.5 fill-current" style={{ color: accentColor }} />
          <span
            className={`font-display font-semibold ${
              isLight ? "text-[#1C1917]" : "text-[#FAF8F5]"
            }`}
          >
            لوحة الذكريات والتهاني (Polaroid)
          </span>
        </div>
        <span
          className="text-[11px] font-mono opacity-70"
          style={{ color: accentColor }}
        >
          {photos.length} لقطة معتمدة
        </span>
      </div>

      {/* Pinboard Grid with Polaroid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setSelectedIndex(idx)}
            className={`group relative p-2.5 pb-4 rounded-xl cursor-pointer transition-all duration-300 hover:rotate-0 hover:scale-105 hover:z-20 shadow-md hover:shadow-2xl ${getTiltAngle(
              idx
            )} ${
              isLight
                ? "bg-[#FFFDFC] text-[#2C2723] border border-[#E8E2D5]"
                : "bg-[#FAF7F0] text-[#1C1917] border border-[#DDD6C5]"
            }`}
          >
            {/* Washi Tape Accent at Top */}
            <div
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 rounded-xs opacity-75 shadow-xs -rotate-2 pointer-events-none"
              style={{
                backgroundColor: `${accentColor}80`,
                backdropFilter: "blur(2px)",
              }}
            />

            {/* Photo Frame */}
            <div className="relative aspect-square w-full rounded-md overflow-hidden bg-black/10 mb-2">
              <Image
                src={photo.url}
                alt={photo.guestName || "ذكرى من الحفل"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            {/* Handwritten-Style Caption Area */}
            <div className="text-center px-1 space-y-0.5">
              {photo.message ? (
                <p className="text-[11px] sm:text-xs font-display italic text-[#3A322C] line-clamp-1 leading-snug">
                  «{photo.message}»
                </p>
              ) : (
                <p className="text-[10px] font-display text-[#7C6E63] italic">
                  ذكرى من الحفل
                </p>
              )}

              {photo.guestName && (
                <p className="text-[10px] font-semibold text-[#8C6D45] truncate">
                  ~ {photo.guestName}
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
