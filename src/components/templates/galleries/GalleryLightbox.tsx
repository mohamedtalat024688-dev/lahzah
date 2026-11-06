"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronRight, ChevronLeft, Download, Share2, User } from "lucide-react";
import { GalleryPhoto } from "@/components/gallery/MemoryGallery";

interface GalleryLightboxProps {
  photos: GalleryPhoto[];
  selectedIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
  coupleNames: string;
}

export default function GalleryLightbox({
  photos,
  selectedIndex,
  onClose,
  onSelectIndex,
  coupleNames,
}: GalleryLightboxProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const activePhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  const handleNext = useCallback(() => {
    if (selectedIndex === null) return;
    onSelectIndex((selectedIndex + 1) % photos.length);
  }, [selectedIndex, photos.length, onSelectIndex]);

  const handlePrev = useCallback(() => {
    if (selectedIndex === null) return;
    onSelectIndex((selectedIndex - 1 + photos.length) % photos.length);
  }, [selectedIndex, photos.length, onSelectIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handlePrev(); // RTL natural previous/next
      if (e.key === "ArrowLeft") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNext, handlePrev, onClose]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNext();
    } else if (diff < -45) {
      handlePrev();
    }
    setTouchStart(null);
  };

  const handleShare = () => {
    if (!activePhoto) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}#photo-${activePhoto.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `ذكرى من حفل ${coupleNames}`,
          text: activePhoto.message || `صورة من حفل ${coupleNames}`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownload = async () => {
    if (!activePhoto) return;
    try {
      const response = await fetch(activePhoto.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lahzah-${activePhoto.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      window.open(activePhoto.url, "_blank");
    }
  };

  if (!activePhoto || selectedIndex === null) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="عرض الصورة بالحجم الكامل"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/92 backdrop-blur-lg animate-fadeIn select-none"
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Action Bar */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-6 z-20 flex items-center justify-between pointer-events-none">
        <button
          onClick={onClose}
          type="button"
          aria-label="إغلاق"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors pointer-events-auto flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={handleDownload}
            type="button"
            title="تحميل الصورة"
            aria-label="تحميل الصورة"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={handleShare}
            type="button"
            title="مشاركة الصورة"
            aria-label="مشاركة الصورة"
            className="min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Arrows for desktop / tablet */}
      {photos.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            type="button"
            aria-label="الصورة السابقة"
            className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors items-center justify-center"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            type="button"
            aria-label="الصورة التالية"
            className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors items-center justify-center"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Center Image Container */}
      <div
        className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col items-center justify-center pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[65vh] sm:h-[72vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={activePhoto.url}
            alt={activePhoto.guestName || "ذكرى من الحفل"}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
        </div>

        {/* Caption & Guest Info Panel */}
        <div className="w-full max-w-xl mt-3 px-4 text-center space-y-1 text-white">
          {activePhoto.guestName && (
            <p className="text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 text-amber-200">
              <User className="w-3.5 h-3.5" />
              <span>{activePhoto.guestName}</span>
            </p>
          )}

          {activePhoto.message && (
            <p className="text-xs sm:text-sm font-display italic text-stone-200 line-clamp-2">
              «{activePhoto.message}»
            </p>
          )}

          {copied && (
            <p className="text-[11px] text-emerald-400 font-medium animate-fadeIn">
              تم نسخ رابط الصورة!
            </p>
          )}

          <p className="text-[10px] font-mono text-stone-400 pt-1">
            {selectedIndex + 1} من {photos.length}
          </p>
        </div>
      </div>
    </div>
  );
}
