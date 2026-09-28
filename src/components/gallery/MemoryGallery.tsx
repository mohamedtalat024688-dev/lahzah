"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Download,
  X,
  User,
  Sparkles,
  Image as ImageIcon,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Share2,
} from "lucide-react";

export interface GalleryPhoto {
  id: string;
  url: string;
  guestName?: string | null;
  message?: string | null;
  createdAt: string | Date;
}

interface MemoryGalleryProps {
  photos: GalleryPhoto[];
  coupleNames: string;
  accentColor?: string;
  cardClass?: string;
}

export default function MemoryGallery({
  photos,
  coupleNames,
  cardClass,
}: MemoryGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedPhotoId, setCopiedPhotoId] = useState<string | null>(null);

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  const handleNextPhoto = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % photos.length);
    }
  }, [selectedIndex, photos.length]);

  const handlePrevPhoto = useCallback(() => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
    }
  }, [selectedIndex, photos.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNextPhoto(); // RTL next
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, handleNextPhoto, handlePrevPhoto]);

  const handleSharePhoto = (photo: GalleryPhoto) => {
    const shareUrl = `${window.location.origin}${photo.url}`;
    if (navigator.share) {
      navigator.share({
        title: `ذكرى من حفل ${coupleNames}`,
        text: photo.message || `صورة من حفل ${coupleNames}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedPhotoId(photo.id);
      setTimeout(() => setCopiedPhotoId(null), 2500);
    }
  };

  if (photos.length === 0) {
    return (
      <div
        className={`text-center py-12 px-6 rounded-3xl border ${
          cardClass || "border-[#d4af37]/20 bg-[#14120f]/60"
        } max-w-lg mx-auto shadow-xl backdrop-blur-md`}
      >
        <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4 shadow-inner">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-white calligraphy-font">ألبوم ذكريات الحفل الحي</h4>
        <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
          لم تُنشر صور بعد في ألبوم الذكريات. كن أول من يوثّق فرحة {coupleNames} من خلال مسح الـ QR ومشاركة لقطاتك المميزة!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <h3 className="text-2xl font-bold text-white calligraphy-font">ألبوم ذكرياتنا</h3>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#f3e5ab] border border-[#d4af37]/30">
          {photos.length} لقطة معتمدة
        </span>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-[#d4af37]/20 hover:border-[#d4af37] cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#d4af37]/15"
          >
            <Image
              src={photo.url}
              alt={photo.guestName || "ذكرى من الحفل"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-right">
              {photo.guestName && (
                <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                  <User className="w-3 h-3 text-[#d4af37]" />
                  <span>{photo.guestName}</span>
                </p>
              )}
              {photo.message && (
                <p className="text-[10px] text-neutral-300 line-clamp-1 italic">
                  «{photo.message}»
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="عرض الصورة بالحجم الكامل"
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            aria-label="إغلاق العارض (Esc)"
            className="absolute top-4 left-4 z-20 p-2.5 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 transition-colors shadow-lg"
            title="إغلاق (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous & Next Controls */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPhoto();
                }}
                className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all shadow-xl"
                title="الصورة السابقة"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPhoto();
                }}
                className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all shadow-xl"
                title="الصورة التالية"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Modal Container */}
          <div className="relative max-w-4xl w-full max-h-[92vh] flex flex-col md:flex-row bg-[#11100e] border border-[#d4af37]/30 rounded-3xl overflow-hidden shadow-2xl">
            {/* Image Container */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[450px] md:min-h-[550px] bg-black flex items-center justify-center">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.guestName || "صورة من الحفل"}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-80 p-5 sm:p-6 flex flex-col justify-between border-t md:border-t-0 md:border-r border-[#d4af37]/20 text-right bg-[#151310]">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 border-b border-neutral-800 pb-3">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">
                      {selectedPhoto.guestName || "ضيف عزيز"}
                    </h4>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(selectedPhoto.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {selectedPhoto.message ? (
                  <div className="p-3.5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-xs text-neutral-200 leading-relaxed italic">
                    <MessageCircle className="w-4 h-4 text-[#d4af37] mb-1 inline ml-1.5" />
                    «{selectedPhoto.message}»
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic">لحظة لا تُنسى من الحفل ❤️</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2">
                <a
                  href={selectedPhoto.url}
                  download={`lahzah-${selectedPhoto.id}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-full bg-[#201d17] border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37]/20 text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل الصورة بدقة أصلية</span>
                </a>

                <button
                  onClick={() => handleSharePhoto(selectedPhoto)}
                  className="w-full py-2.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4 text-[#d4af37]" />
                  <span>{copiedPhotoId === selectedPhoto.id ? "تم نسخ الرابط!" : "مشاركة الصورة"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
