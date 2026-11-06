"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  User,
  X,
  ChevronRight,
  ChevronLeft,
  Share2,
  Download,
  Check,
  MessageCircle,
  Image as ImageIcon,
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
}

export default function MemoryGallery({
  photos,
  coupleNames,
  accentColor = "#D6B77A",
}: MemoryGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [copiedPhotoId, setCopiedPhotoId] = useState<string | null>(null);

  const selectedPhoto = selectedIndex !== null ? photos[selectedIndex] : null;

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + photos.length) % photos.length);
  };

  const handleSharePhoto = (photo: GalleryPhoto) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#photo-${photo.id}`;
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
      <div className="text-center py-12 px-6 rounded-3xl border border-[#EFE4DC] bg-[#FFFDFC] max-w-md mx-auto shadow-soft-xs">
        <div className="w-14 h-14 rounded-full bg-[#FAF2F3] text-[#790D20] border border-[#F1DEDF] flex items-center justify-center mx-auto mb-3">
          <ImageIcon className="w-6 h-6" />
        </div>
        <h4 className="text-lg font-bold font-serif text-[#390E19]">ألبوم الذكريات الحي</h4>
        <p className="text-[#8B7778] text-xs mt-2 leading-relaxed">
          لم تُنشر صور بعد في ألبوم الذكريات. كن أول من يوثّق فرحة {coupleNames} من خلال مشاركة
          لقطاتكم المميزة!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-[#EFE4DC] pb-3 text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
          <span className="font-serif font-semibold text-[#390E19]">ألبوم اللحظات المشتركة</span>
        </div>
        <span className="text-[11px] text-[#8B7778] font-mono">{photos.length} لقطة معتمدة</span>
      </div>

      {/* Editorial Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => setSelectedIndex(idx)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-[#FFFDFC] border border-[#EFE4DC] hover:border-[#790D20] cursor-pointer transition-all duration-300 shadow-soft-xs"
          >
            <Image
              src={photo.url}
              alt={photo.guestName || "ذكرى من الحفل"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#390E19]/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-right">
              {photo.guestName && (
                <p className="text-xs font-medium text-white truncate flex items-center gap-1">
                  <User className="w-3 h-3 text-[#D6B77A]" />
                  <span>{photo.guestName}</span>
                </p>
              )}
              {photo.message && (
                <p className="text-[10px] text-[#EFE4DC] line-clamp-1 italic mt-0.5">
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
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
        >
          {/* Close Button */}
          <button
            onClick={() => setSelectedIndex(null)}
            aria-label="إغلاق عرض الصورة"
            className="absolute top-4 left-4 z-20 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center justify-center"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="الصورة السابقة"
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="الصورة التالية"
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 min-w-[44px] min-h-[44px] p-2.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Modal Container */}
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row bg-[#FFFDFC] border border-[#EFE4DC] rounded-3xl overflow-hidden shadow-2xl">
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
            <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-r border-[#EFE4DC] text-right bg-[#FFFDFC]">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 border-b border-[#EFE4DC] pb-3">
                  <div className="w-9 h-9 rounded-full bg-[#FAF2F3] border border-[#F1DEDF] flex items-center justify-center text-[#790D20] shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#390E19] text-xs">
                      {selectedPhoto.guestName || "ضيف عزيز"}
                    </h4>
                    <span className="text-[10px] text-[#8B7778]">
                      {new Date(selectedPhoto.createdAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {selectedPhoto.message ? (
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EFE4DC] text-xs text-[#493B3B] leading-relaxed italic">
                    <MessageCircle className="w-3.5 h-3.5 text-[#790D20] mb-1 inline ml-1.5" />
                    «{selectedPhoto.message}»
                  </div>
                ) : (
                  <p className="text-xs text-[#8B7778] italic">ذكرى غالية من ليلة العمر</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 space-y-2">
                <a
                  href={selectedPhoto.url}
                  download={`lahzah-${selectedPhoto.id}.jpg`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 min-h-[44px] rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#630A19] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل الصورة الأصلية</span>
                </a>

                <button
                  onClick={() => handleSharePhoto(selectedPhoto)}
                  className="w-full py-2.5 min-h-[44px] rounded-full border border-[#EFE4DC] bg-[#FFF9F5] hover:border-[#790D20] text-[#390E19] text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {copiedPhotoId === selectedPhoto.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#3D7A42]" />
                      <span className="text-[#3D7A42]">تم نسخ رابط الصورة!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5 text-[#790D20]" />
                      <span>مشاركة هذه اللقطة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}