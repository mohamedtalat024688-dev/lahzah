"use client";

import React from "react";
import { Sparkles, Camera } from "lucide-react";
import Link from "next/link";
import { TemplateConfig, getTemplateGalleryStyle } from "@/lib/templates";
import { GalleryPhoto } from "@/components/gallery/MemoryGallery";
import RegalEditorialGrid from "./RegalEditorialGrid";
import PolaroidPinboardGallery from "./PolaroidPinboardGallery";

interface TemplateMemoryGalleryProps {
  photos: GalleryPhoto[];
  template: TemplateConfig;
  coupleNames: string;
  eventSlug: string;
}

export default function TemplateMemoryGallery({
  photos,
  template,
  coupleNames,
  eventSlug,
}: TemplateMemoryGalleryProps) {
  const accent = template.theme.accentColor;
  const isLight = template.theme.isLight;
  const galleryStyle = getTemplateGalleryStyle(template);

  // Security & Moderation boundary: Only APPROVED photos are rendered
  const approvedPhotos = (photos || []).filter(
    (photo) => !("status" in photo) || (photo as { status?: string }).status === "APPROVED"
  );

  // If no photos exist yet, show an encouraging empty state
  if (approvedPhotos.length === 0) {
    return (
      <div
        className={`text-center py-12 px-6 rounded-3xl border max-w-md mx-auto shadow-sm space-y-3 ${
          isLight
            ? "bg-[#FAF7F2] border-[#E8E0D0] text-[#1C1917]"
            : "bg-[#161412] border-[#2E2822] text-[#FAF8F5]"
        }`}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-2"
          style={{
            backgroundColor: `${accent}20`,
            color: accent,
            border: `1px solid ${accent}40`,
          }}
        >
          <Camera className="w-6 h-6" />
        </div>
        <h4 className="text-base sm:text-lg font-bold font-display">
          ألبوم الذكريات بانتظار لقطاتكم
        </h4>
        <p
          className={`text-xs max-w-xs mx-auto leading-relaxed ${
            isLight ? "text-[#786C5E]" : "text-[#8E877C]"
          }`}
        >
          كن أول من يوثّق فرحة {coupleNames} ويشاركهم أجمل التهاني والصور التذكارية!
        </p>
        <div className="pt-2">
          <Link
            href={`/e/${eventSlug}/upload`}
            className="inline-flex items-center gap-1.5 text-xs py-2 px-5 rounded-full font-semibold border shadow-sm transition-transform hover:scale-105 active:scale-95"
            style={{
              backgroundColor: accent,
              color: isLight ? "#FFFFFF" : "#0C0B0A",
              borderColor: accent,
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>شاركنا صورتك الأولى</span>
          </Link>
        </div>
      </div>
    );
  }

  // Render archetype according to template identity
  if (galleryStyle === "polaroid") {
    return (
      <PolaroidPinboardGallery
        photos={approvedPhotos}
        coupleNames={coupleNames}
        accentColor={accent}
        isLight={isLight}
      />
    );
  }

  return (
    <RegalEditorialGrid
      photos={approvedPhotos}
      coupleNames={coupleNames}
      accentColor={accent}
      isLight={isLight}
    />
  );
}

