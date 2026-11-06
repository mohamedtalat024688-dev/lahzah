"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronRight, ChevronLeft, Heart, X } from "lucide-react";
import { TemplateConfig } from "@/lib/templates";
import { CouplePhoto } from "@/lib/validations/event";

interface CouplePhotosSectionProps {
  photos: CouplePhoto[];
  template: TemplateConfig;
  coupleNames: string;
}

export default function CouplePhotosSection({
  photos,
  template,
  coupleNames,
}: CouplePhotosSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // If no photos exist, collapse completely (no empty placeholder)
  if (!photos || photos.length === 0) {
    return null;
  }

  // Sort photos by custom order
  const sortedPhotos = [...photos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const accent = template.theme.accentColor;
  const currentPhoto = sortedPhotos[currentIndex] || sortedPhotos[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % sortedPhotos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + sortedPhotos.length) % sortedPhotos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Swipe left (next in RTL) / swipe right
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    setTouchStart(null);
  };

  // Case 1: Single Photo (Portrait / Hero Frame)
  if (sortedPhotos.length === 1) {
    const singlePhoto = sortedPhotos[0];
    return (
      <section className="space-y-4 max-w-lg mx-auto animate-fadeIn">
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest block opacity-75" style={{ color: accent }}>
            لحظات لا تُنسى
          </span>
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-px opacity-30" style={{ backgroundColor: accent }} />
            <Heart className="w-3.5 h-3.5 fill-current" style={{ color: accent }} />
            <span className="w-8 h-px opacity-30" style={{ backgroundColor: accent }} />
          </div>
        </div>

        <div
          onClick={() => setLightboxOpen(true)}
          className="relative aspect-[4/5] sm:aspect-[3/4] w-full rounded-3xl overflow-hidden border shadow-xl cursor-pointer group transition-all duration-500 hover:shadow-2xl"
          style={{
            borderColor: `${accent}40`,
          }}
        >
          <Image
            src={singlePhoto.url}
            alt={singlePhoto.caption || coupleNames}
            fill
            sizes="(max-width: 640px) 100vw, 500px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          {singlePhoto.caption && (
            <div className="absolute inset-x-0 bottom-0 p-5 text-center">
              <p className="text-xs sm:text-sm font-display text-white font-medium drop-shadow-md">
                «{singlePhoto.caption}»
              </p>
            </div>
          )}
        </div>

        {/* Single Photo Lightbox */}
        {lightboxOpen && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 left-5 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-2xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center">
              <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden">
                <Image
                  src={singlePhoto.url}
                  alt={singlePhoto.caption || coupleNames}
                  fill
                  className="object-contain"
                />
              </div>
              {singlePhoto.caption && (
                <p className="text-sm font-display text-white mt-4 text-center">
                  «{singlePhoto.caption}»
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }

  // Case 2: Multiple Photos (Interactive Swipeable Carousel)
  return (
    <section className="space-y-4 max-w-xl mx-auto animate-fadeIn">
      <div className="text-center space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-widest block opacity-75" style={{ color: accent }}>
          أجمل الذكريات
        </span>
        <div className="flex items-center justify-center gap-2">
          <span className="w-8 h-px opacity-30" style={{ backgroundColor: accent }} />
          <Heart className="w-3.5 h-3.5 fill-current" style={{ color: accent }} />
          <span className="w-8 h-px opacity-30" style={{ backgroundColor: accent }} />
        </div>
      </div>

      <div
        className="relative aspect-[4/5] sm:aspect-[16/11] w-full rounded-3xl overflow-hidden border shadow-xl select-none"
        style={{ borderColor: `${accent}40` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentPhoto.url}
          alt={currentPhoto.caption || coupleNames}
          fill
          sizes="(max-width: 640px) 100vw, 600px"
          className="object-cover transition-opacity duration-500 cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pointer-events-none" />

        {/* Counter Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-black/50 text-white backdrop-blur-md border border-white/20">
          {currentIndex + 1} / {sortedPhotos.length}
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
          <button
            onClick={handlePrev}
            type="button"
            aria-label="الصورة السابقة"
            className="p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all pointer-events-auto backdrop-blur-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            type="button"
            aria-label="الصورة التالية"
            className="p-2.5 rounded-full bg-black/40 text-white hover:bg-black/70 transition-all pointer-events-auto backdrop-blur-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Caption Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-5 text-center pointer-events-none">
          {currentPhoto.caption && (
            <p className="text-xs sm:text-sm font-display text-white font-medium drop-shadow-md mb-2">
              «{currentPhoto.caption}»
            </p>
          )}

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pointer-events-auto">
            {sortedPhotos.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`الانتقال إلى صورة ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox for Carousel */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="إغلاق عرض الصورة"
            className="absolute top-5 left-5 p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-3xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden">
              <Image
                src={currentPhoto.url}
                alt={currentPhoto.caption || coupleNames}
                fill
                className="object-contain"
              />
            </div>
            {currentPhoto.caption && (
              <p className="text-sm font-display text-white mt-4 text-center">
                «{currentPhoto.caption}»
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
