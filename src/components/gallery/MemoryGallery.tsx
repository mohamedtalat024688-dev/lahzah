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
      navigator
        .share({
          title: `ذكرى من حفل ${coupleNames}`,
          text: photo.message || `صورة من حفل ${coupleNames}`,
          url: shareUrl,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedPhotoId(photo.id);
      setTimeout(() => setCopiedPhotoId(null), 2500);
    }
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 px-6 rounded-3xl border border-[#26221d] bg-[#141210] max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#1c1916] text-[#c5a880] border border-[#2e2924] flex items-center justify-center mx-auto mb-3">
          <ImageIcon className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold font-display text-[#faf8f5]">ألبوم الذكريات الحي</h4>
        <p className="text-[#8e877c] text-xs mt-2 leading-relaxed">
          لم تُنشر صور بعد في ألبوم الذكريات. كن أول من يوثّق فرحة {coupleNames} من خلال مشاركة
          لقطاتكم المميزة!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#26221d] pb-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#c5a880]" />
          <span className="font-display font-semibold text-[#faf8f5]">ألبوم اللحظات المشتركة</span>
        </div>
        <span className="text-[11px] text-[#8e877c] font-mono">{photos.length} لقطة معتمدة</span>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-[#141210] border border-[#26221d] hover:border-[#3d3630] cursor-pointer transition-all duration-300"
          >
            <Image
              src={photo.url}
              alt={photo.guestName || "ذكرى من الحفل"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-right">
              {photo.guestName && (
                <p className="text-xs font-medium text-[#faf8f5] truncate flex items-center gap-1">
                  <User className="w-3 h-3 text-[#c5a880]" />
                  <span>{photo.guestName}</span>
                </p>
              )}
              {photo.message && (
                <p className="text-[10px] text-[#8e877c] line-clamp-1 italic mt-0.5">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            aria-label="إغلاق العارض (Esc)"
            className="absolute top-4 left-4 z-20 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-[#1c1916] text-[#8e877c] hover:text-[#faf8f5] transition-colors flex items-center justify-center"
            title="إغلاق (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous & Next Controls */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevPhoto();
                }}
                className="absolute right-2 sm:right-6 z-20 min-w-[44px] min-h-[44px] p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all flex items-center justify-center"
                title="الصورة السابقة"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextPhoto();
                }}
                className="absolute left-2 sm:left-6 z-20 min-w-[44px] min-h-[44px] p-3 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/10 transition-all flex items-center justify-center"
                title="الصورة التالية"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Modal Container */}
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row bg-[#141210] border border-[#26221d] rounded-3xl overflow-hidden shadow-2xl">
            {/* Image Container */}
            <div className="relative flex-1 min-h-[300px] sm:min-h-[450px] md:min-h-[520px] bg-black flex items-center justify-center">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.guestName || "صورة من الحفل"}
                fill
                priority
                className="object-contain"
              />
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-r border-[#26221d] text-right bg-[#171412]">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#26221d] pb-3">
                  <div className="w-9 h-9 rounded-full bg-[#1c1916] border border-[#2e2924] flex items-center justify-center text-[#c5a880] shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#faf8f5] text-xs">
                      {selectedPhoto.guestName || "ضيف عزيز"}
                    </h4>
                    <span className="text-[10px] text-[#8e877c]">
                      {new Date(selectedPhoto.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {selectedPhoto.message ? (
                  <div className="p-3.5 rounded-2xl bg-[#141210] border border-[#26221d] text-xs text-[#c4bdaf] leading-relaxed italic">
                    <MessageCircle className="w-3.5 h-3.5 text-[#c5a880] mb-1 inline ml-1.5" />
                    «{selectedPhoto.message}»
                  </div>
                ) : (
                  <p className="text-xs text-[#8e877c] italic">ذكرى غالية من ليلة العمر</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2">
                <a
                  href={selectedPhoto.url}
                  download={`lahzah-${selectedPhoto.id}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 min-h-[44px] rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تنزيل الصورة بالدقة الأصلية</span>
                </a>

                <button
                  onClick={() => handleSharePhoto(selectedPhoto)}
                  className="w-full py-3 min-h-[44px] rounded-full bg-[#1a1714] hover:bg-[#221e1a] border border-[#2e2924] text-[#8e877c] hover:text-[#faf8f5] text-xs font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span>
                    {copiedPhotoId === selectedPhoto.id ? "تم نسخ الرابط!" : "مشاركة الصورة"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
