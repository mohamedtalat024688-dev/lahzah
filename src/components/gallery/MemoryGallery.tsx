"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, X, Heart, MessageCircle, User, Sparkles, Image as ImageIcon } from "lucide-react";

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
  accentColor = "#d4af37",
  cardClass,
}: MemoryGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);

  if (photos.length === 0) {
    return (
      <div className={`text-center py-12 px-6 rounded-3xl border ${cardClass || "border-[#d4af37]/20 bg-[#14120f]/60"} max-w-lg mx-auto`}>
        <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-white calligraphy-font">ألبوم ذكريات الحفل</h4>
        <p className="text-neutral-400 text-xs mt-2 leading-relaxed">
          لم يتم نشر صور بعد. كن أول من يخلد هذه اللحظة الاستثنائية مع {coupleNames} من خلال مسح الـ QR ومشاركة صورتك!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#d4af37]/20 pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#d4af37]" />
          <h3 className="text-2xl font-bold text-white calligraphy-font">ذكرياتنا المشتركة</h3>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#f3e5ab] border border-[#d4af37]/30">
          {photos.length} لحظة موثقة
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-[#d4af37]/20 hover:border-[#d4af37]/60 cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-[#d4af37]/10"
          >
            <Image
              src={photo.url}
              alt={photo.guestName || "ذكرى من الحفل"}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-right">
              {photo.guestName && (
                <p className="text-xs font-bold text-white truncate flex items-center gap-1">
                  <User className="w-3 h-3 text-[#d4af37]" />
                  <span>{photo.guestName}</span>
                </p>
              )}
              {photo.message && (
                <p className="text-[10px] text-neutral-300 line-clamp-1 italic">
                  "{photo.message}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-5 left-5 z-10 p-2.5 rounded-full bg-neutral-800/80 text-white hover:bg-neutral-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row bg-[#11100e] border border-[#d4af37]/30 rounded-3xl overflow-hidden shadow-2xl">
            {/* Large Image Container */}
            <div className="relative flex-1 min-h-[350px] md:min-h-[550px] bg-black flex items-center justify-center">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.guestName || "صورة من الحفل"}
                fill
                className="object-contain"
              />
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-80 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-r border-[#d4af37]/20 text-right bg-[#151310]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
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
                    "{selectedPhoto.message}"
                  </div>
                ) : (
                  <p className="text-xs text-neutral-500 italic">لحظة سعيدة ومميزة من الحفل ❤️</p>
                )}
              </div>

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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
