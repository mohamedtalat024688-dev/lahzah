"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Heart,
  Clock,
  Sparkles,
  RotateCcw,
  Check,
  ExternalLink,
} from "lucide-react";
import { fireCelebrationConfetti } from "@/components/ui/ConfettiEffect";

export default function InteractiveHeroInvitation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasRsvpd, setHasRsvpd] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      fireCelebrationConfetti({ x, y });
    } else {
      setHasRsvpd(false);
    }
  };

  const handleRsvpToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextRsvp = !hasRsvpd;
    setHasRsvpd(nextRsvp);
    if (nextRsvp) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      fireCelebrationConfetti({ x, y });
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto select-none py-4 sm:py-6">
      {/* Ambient Directional Sunlight & Candlelight Halo */}
      <div
        className="absolute -inset-8 bg-gradient-to-tr from-[#790D20]/15 via-[#D6B77A]/12 to-[#FAF3EE]/40 rounded-[3.5rem] blur-3xl opacity-80 pointer-events-none"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* LUXURY PHYSICAL STATIONERY SUITE (Editorial Flatlay Composition)            */}
      {/* ========================================================================= */}
      <div className="relative flex items-center justify-center perspective-1200 min-h-[460px] sm:min-h-[530px]">
        {/* Decorative Element 1: Hand-Dyed Silk Ribbon Accent in Champagne Gold */}
        <div
          className="absolute -top-4 -right-4 sm:-right-6 w-28 sm:w-36 h-28 sm:h-36 pointer-events-none z-0 opacity-70"
          aria-hidden="true"
        >
          <svg viewBox="0 0 120 120" fill="none" className="w-full h-full drop-shadow-md">
            <path
              d="M10 20C45 10 75 40 100 25C110 20 115 35 105 45C85 65 60 45 40 70C20 95 30 115 15 110C5 105 10 85 20 65C30 45 5 30 10 20Z"
              fill="url(#silkGradient)"
              opacity="0.85"
            />
            <defs>
              <linearGradient id="silkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FAF4E8" />
                <stop offset="50%" stopColor="#D6B77A" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#B89656" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Decorative Element 2: Delicate Olive Branch Botanical Silhouette (Bottom-Left) */}
        <div
          className="absolute -bottom-6 -left-6 sm:-left-8 w-28 sm:w-36 h-28 sm:h-36 pointer-events-none z-0 opacity-45"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#790D20]">
            <path
              d="M10 90 Q 50 70 85 15"
              stroke="#D6B77A"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <ellipse cx="35" cy="70" rx="6" ry="12" transform="rotate(-35 35 70)" fill="#D6B77A" fillOpacity="0.35" />
            <ellipse cx="50" cy="55" rx="5" ry="11" transform="rotate(25 50 55)" fill="#D6B77A" fillOpacity="0.35" />
            <ellipse cx="65" cy="40" rx="5" ry="10" transform="rotate(-40 65 40)" fill="#D6B77A" fillOpacity="0.35" />
            <ellipse cx="78" cy="25" rx="4" ry="8" transform="rotate(20 78 25)" fill="#D6B77A" fillOpacity="0.35" />
          </svg>
        </div>

        {/* Layer 1: Secondary Save-the-Date Stationery Card (Angled Behind) */}
        <div
          className={`absolute -left-4 sm:-left-6 top-8 sm:top-12 w-32 sm:w-44 h-44 sm:h-60 rounded-2xl bg-gradient-to-br from-[#FFFDFC] to-[#FAF3EE] border border-[#EFE4DC] p-3.5 sm:p-4 flex flex-col justify-between -rotate-8 shadow-[0_12px_30px_rgba(57,14,25,0.08)] pointer-events-none transition-all duration-700 z-10 ${
            isOpen ? "opacity-35 -translate-x-2 -rotate-12" : "opacity-60"
          }`}
          aria-hidden="true"
        >
          <div className="border border-dashed border-[#D6B77A]/40 rounded-xl p-2.5 h-full flex flex-col justify-between text-right">
            <span className="text-[9px] font-serif tracking-widest text-[#790D20] font-semibold uppercase">
              Save The Date
            </span>
            <div className="text-center my-auto space-y-1">
              <span className="text-lg sm:text-xl font-serif font-bold text-[#390E19] block">
                ٢٥ • ١٠ • ٢٦
              </span>
              <span className="text-[9px] text-[#8B7778] block">حفل زفاف مبارك</span>
            </div>
            <div className="flex items-center justify-between text-[8px] text-[#8B7778]/80 border-t border-[#EFE4DC] pt-1.5">
              <span>القاهرة • مصر</span>
              <span>LAHZAH</span>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* MAIN HERO STATIONERY: BURGUNDY ENVELOPE + IVORY EMBOSSED INVITATION      */}
        {/* ======================================================================= */}
        <div className="relative z-20 w-full max-w-[340px] sm:max-w-[400px]">
          {/* THE IVORY COTTON INVITATION CARD (Glides Upwards out of Envelope) */}
          <div
            className={`relative rounded-2xl sm:rounded-3xl bg-[#FFFDF9] border border-[#D6B77A]/60 p-5 sm:p-7 shadow-[0_20px_50px_rgba(57,14,25,0.18),0_4px_12px_rgba(57,14,25,0.05),0_0_0_1px_rgba(214,183,122,0.35)] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isOpen
                ? "-translate-y-16 sm:-translate-y-20 scale-100 shadow-[0_28px_65px_rgba(57,14,25,0.24)]"
                : "translate-y-2 scale-[0.96] opacity-95"
            }`}
          >
            {/* Fine Paper Linen Grain Texture */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#D6B77A 0.75px, transparent 0.75px), radial-gradient(#D6B77A 0.75px, #FFFDF9 0.75px)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 8px 8px",
              }}
            />

            {/* Embossed Double-Regal Gold Border with Corner Ornaments */}
            <div className="border border-double border-[3px] border-[#D6B77A]/50 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F5] to-[#FAF3EE]">
              {/* Corner Fleurons */}
              <span className="absolute top-2 right-2 text-xs text-[#D6B77A]">⚜</span>
              <span className="absolute top-2 left-2 text-xs text-[#D6B77A]">⚜</span>
              <span className="absolute bottom-2 right-2 text-xs text-[#D6B77A]">⚜</span>
              <span className="absolute bottom-2 left-2 text-xs text-[#D6B77A]">⚜</span>

              {/* 1. Opening Phrase / Basmala */}
              <div className="mb-2">
                <p className="text-xs font-serif text-[#790D20] font-semibold tracking-wide">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-[10px] text-[#8B7778] mt-0.5 font-sans">
                  يسعدنا ويشرفنا دعوتكم لمشاركتنا فرحة العمر
                </p>
              </div>

              {/* 2. THE EMOTIONAL CENTER: Couple Names */}
              <div className="py-2.5 sm:py-3 space-y-1">
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#390E19] tracking-tight leading-tight">
                  أحمد منصور
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <span className="w-8 h-[1px] bg-[#D6B77A]/50" />
                  <span className="text-sm font-serif text-[#790D20] italic font-normal">
                    &
                  </span>
                  <span className="w-8 h-[1px] bg-[#D6B77A]/50" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#390E19] tracking-tight leading-tight">
                  سارة الجوهري
                </h3>
              </div>

              {/* 3. Wedding Date & Venue Details */}
              <div className="mt-2 pt-2 border-t border-[#D6B77A]/25 space-y-1 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-[#790D20]">
                  <Calendar className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
                  <span>الأحد، ٢٥ أكتوبر ٢٠٢٦ • ٨:٠٠ مساءً</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] text-[#493B3B]">
                  <MapPin className="w-3 h-3 text-[#790D20] shrink-0" />
                  <span>قاعة البلازا — فندق الفورسيزونز، القاهرة</span>
                </div>
              </div>

              {/* 4. Interactive Live Elements: Countdown & RSVP */}
              <div className="mt-3 pt-2.5 border-t border-[#EFE4DC] flex items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-[#8B7778] font-mono text-[10px]">
                  <Clock className="w-3 h-3 text-[#D6B77A] shrink-0" />
                  <span>باقي: ١٢٠ يوماً</span>
                </div>

                <button
                  type="button"
                  onClick={handleRsvpToggle}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all min-h-[32px] flex items-center gap-1 text-[10px] shadow-xs cursor-pointer ${
                    hasRsvpd
                      ? "bg-[#F0F7F1] text-[#3D7A42] border border-[#3D7A42]/40"
                      : "bg-[#790D20] text-white hover:bg-[#630A19]"
                  }`}
                >
                  {hasRsvpd ? (
                    <>
                      <Check className="w-3 h-3 text-[#3D7A42]" />
                      <span>تم تأكيد حضورك (شخصين)</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-3 h-3 fill-current text-[#D8B8B8]" />
                      <span>تأكيد الحضور (RSVP)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* THE HANDCRAFTED BURGUNDY STATIONERY ENVELOPE BASE POCKET                */}
          {/* ======================================================================= */}
          <div
            className={`relative -mt-24 sm:-mt-28 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#790D20] via-[#5F0A18] to-[#390E19] border border-[#D6B77A]/35 p-5 pt-10 shadow-[0_22px_45px_rgba(57,14,25,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)] text-center transition-all duration-700 ${
              isOpen ? "translate-y-8" : "translate-y-0"
            }`}
          >
            {/* Realistic Envelope V-Flap Seam / Top Gold Hairline */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#D6B77A]/60 to-transparent" />

            {/* THE SIGNATURE BURGUNDY WAX SEAL BUTTON & INTERACTION CLASP */}
            <div className="relative -top-14 flex flex-col items-center">
              <button
                type="button"
                onClick={handleToggle}
                aria-label={isOpen ? "إعادة طي مظروف الدعوة" : "فض الختم وفتح بطاقة الدعوة"}
                className={`group/seal relative flex items-center justify-center transition-transform duration-300 focus:outline-none active:scale-95 cursor-pointer ${
                  isOpen ? "scale-95" : "hover:scale-105"
                }`}
              >
                {/* Gentle Pulsing Warm Glow When Closed */}
                {!isOpen && (
                  <span className="absolute -inset-2.5 rounded-full bg-[#D6B77A]/30 blur-md animate-pulse" />
                )}

                {/* Wax Seal Outer Bevel in Primary Burgundy */}
                <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full bg-gradient-to-br from-[#9B1A31] via-[#790D20] to-[#390E19] shadow-[0_8px_25px_rgba(121,13,32,0.65),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-3px_5px_rgba(0,0,0,0.6)] flex items-center justify-center border border-[#D6B77A]/60">
                  {/* Inner Pressed Monogram Ring */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#D6B77A]/70 flex items-center justify-center text-white font-serif bg-[#790D20]/75 shadow-inner">
                    <span className="text-base sm:text-lg font-bold text-[#FAF4E8] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                      ل
                    </span>
                  </div>
                </div>

                {/* Elegant Interactive Tooltip Clasp */}
                <span className="absolute -bottom-7 whitespace-nowrap text-[11px] font-semibold text-[#390E19] bg-[#FFFDFC] px-3 py-0.5 rounded-full border border-[#D8B8B8] shadow-soft-sm flex items-center gap-1 group-hover/seal:border-[#790D20] transition-colors">
                  {isOpen ? (
                    <>
                      <RotateCcw className="w-3 h-3 text-[#790D20]" />
                      <span>إعادة طي الدعوة ↺</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 text-[#D6B77A]" />
                      <span>افتح بطاقة الدعوة ✦</span>
                    </>
                  )}
                </span>
              </button>
            </div>

            {/* Subtle Atelier Note Beneath Seal */}
            <div className="pt-2 flex items-center justify-between text-[10px] text-[#FAF4E8]/80 font-serif border-t border-[#D6B77A]/20">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A]" />
                <span>قرطاسية زفاف فاخرة • لحظة</span>
              </span>

              <Link
                href="/preview?template=royal-gold"
                target="_blank"
                className="hover:text-white hover:underline flex items-center gap-1 text-[#D6B77A]"
              >
                <span>معاينة حية</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
