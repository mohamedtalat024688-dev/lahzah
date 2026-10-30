"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Heart,
  Clock,
  RotateCcw,
  Check,
  ExternalLink,
} from "lucide-react";
import { fireCelebrationConfetti } from "@/components/ui/ConfettiEffect";

interface InteractiveHeroInvitationProps {
  onOpenChange?: (open: boolean) => void;
}

export default function InteractiveHeroInvitation({ onOpenChange }: InteractiveHeroInvitationProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasRsvpd, setHasRsvpd] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timers on component unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // 1. DESKTOP HOVER: Open smoothly and cinematically on mouse enter
  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (!isOpen) {
      setIsOpen(true);
      onOpenChange?.(true);
    }
  };

  // Slower, graceful closing with safety debounce to prevent jitter
  const handleMouseLeave = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
      setHasRsvpd(false);
      onOpenChange?.(false);
    }, 350);
  };

  // 2. MOBILE / TOUCH & KEYBOARD SUPPORT: Tap to toggle
  const handleSceneClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) {
      return;
    }
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  };

  const handleSealClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setIsOpen((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen((prev) => {
        const next = !prev;
        onOpenChange?.(next);
        return next;
      });
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
    <div className="relative w-full max-w-lg mx-auto select-none py-3 sm:py-6">
      {/* Soft Ambient Directional Lighting */}
      <div
        className="absolute -inset-6 bg-gradient-to-tr from-[#790D20]/10 via-[#D6B77A]/10 to-[#FAF3EE]/35 rounded-[3.5rem] blur-3xl opacity-70 pointer-events-none"
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* EDITORIAL FLATLAY CONTAINER WITH HOVER INTERACTION                        */}
      {/* ========================================================================= */}
      <div
        className="relative flex flex-col items-center justify-center min-h-[510px] sm:min-h-[570px] pb-6 cursor-pointer group/scene focus:outline-none"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleSceneClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="بطاقة ومظروف دعوة زفاف لحظة التفاعلية"
      >
        {/* Decorative Element: Restrained Olive Branch Silhouette (Bottom-Left) */}
        <div
          className="absolute -bottom-2 -left-6 sm:-left-8 w-28 sm:w-34 h-28 sm:h-34 pointer-events-none z-0 opacity-35"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-[#790D20]">
            <path
              d="M10 90 Q 50 70 85 15"
              stroke="#D6B77A"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <ellipse cx="35" cy="70" rx="5" ry="10" transform="rotate(-35 35 70)" fill="#D6B77A" fillOpacity="0.4" />
            <ellipse cx="50" cy="55" rx="4.5" ry="9" transform="rotate(25 50 55)" fill="#D6B77A" fillOpacity="0.4" />
            <ellipse cx="65" cy="40" rx="4" ry="8" transform="rotate(-40 65 40)" fill="#D6B77A" fillOpacity="0.4" />
            <ellipse cx="78" cy="25" rx="3.5" ry="7" transform="rotate(20 78 25)" fill="#D6B77A" fillOpacity="0.4" />
          </svg>
        </div>

        {/* Layer 0: Secondary Save-the-Date Card (Angled Subtly Behind) */}
        <div
          className={`absolute -left-3 sm:-left-6 top-10 sm:top-14 w-28 sm:w-34 h-40 sm:h-50 rounded-2xl bg-gradient-to-br from-[#FFFDFC] to-[#FAF5EF] border border-[#EBE0D8] p-3 flex flex-col justify-between -rotate-6 shadow-[0_10px_24px_rgba(57,14,25,0.06)] pointer-events-none transition-[transform,opacity] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none z-0 ${
            isOpen ? "opacity-30 -translate-x-3 -rotate-10" : "opacity-65 translate-x-0 rotate-[-6deg]"
          }`}
          aria-hidden="true"
        >
          <div className="border border-dashed border-[#D6B77A]/35 rounded-xl p-2 h-full flex flex-col justify-between text-right">
            <span className="text-[8px] font-serif tracking-widest text-[#790D20] font-semibold uppercase">
              Save The Date
            </span>
            <div className="text-center my-auto space-y-0.5">
              <span className="text-base sm:text-lg font-serif font-bold text-[#390E19] block">
                ٢٥ • ١٠ • ٢٦
              </span>
              <span className="text-[8px] text-[#8B7778] block">حفل زفاف مبارك</span>
            </div>
            <div className="flex items-center justify-between text-[7.5px] text-[#8B7778]/80 border-t border-[#EBE0D8] pt-1">
              <span>القاهرة • مصر</span>
              <span className="font-serif font-bold text-[#790D20]">LAHZAH</span>
            </div>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* MULTI-LAYER PHYSICAL ENVELOPE + INVITATION OBJECT                       */}
        {/* ======================================================================= */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] flex items-center justify-center">
          {/* ------------------------------------------------------------------- */}
          {/* LAYER 1: ENVELOPE BACK BODY & INTERIOR LINING                       */}
          {/* ------------------------------------------------------------------- */}
          <div
            className={`absolute bottom-0 w-full h-[220px] sm:h-[240px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#420813] to-[#240309] border border-[#D6B77A]/25 shadow-[0_18px_45px_rgba(28,4,9,0.35)] transition-[transform] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none z-10 ${
              isOpen ? "translate-y-6 sm:translate-y-8" : "translate-y-0"
            }`}
          >
            {/* Fine Champagne Interior Rim Trim */}
            <div className="absolute inset-2 border border-[#D6B77A]/15 rounded-xl pointer-events-none" />
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* LAYER 2: THE IVORY COTTON INVITATION CARD                           */}
          {/* GPU accelerated translate3d with silky smooth easing                */}
          {/* ------------------------------------------------------------------- */}
          <div
            className={`relative w-full rounded-2xl sm:rounded-3xl bg-[#FFFDF9] border border-[#D6B77A]/50 p-4 sm:p-5 transition-[transform,opacity] duration-900 ease-[cubic-bezier(0.22,1,0.32,1)] motion-reduce:transition-none ${
              isOpen
                ? "z-30 [transform:translate3d(0,-6.5rem,0)_scale(1.02)] delay-150"
                : "z-20 [transform:translate3d(0,-1.75rem,0)_scale(0.98)]"
            }`}
            style={{
              boxShadow: isOpen
                ? "0 28px 65px rgba(43,8,16,0.28), 0 8px 20px rgba(43,8,16,0.1)"
                : "0 12px 30px rgba(43,8,16,0.14)",
            }}
          >
            {/* Microscopic Cotton & Linen Paper Texture */}
            <div
              className="absolute inset-0 rounded-2xl sm:rounded-3xl opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(#D6B77A 0.75px, transparent 0.75px), radial-gradient(#D6B77A 0.75px, #FFFDF9 0.75px)",
                backgroundSize: "16px 16px",
                backgroundPosition: "0 0, 8px 8px",
              }}
            />

            {/* Embossed Fine Champagne Border with Architectural Corner Miters */}
            <div className="border border-[#D6B77A]/40 rounded-xl sm:rounded-2xl p-4 sm:p-5 text-center relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FFF9F5] to-[#FAF4EE]">
              {/* Delicate Inset Framing Hairline */}
              <div className="absolute inset-1.5 border border-[#D6B77A]/20 rounded-lg sm:rounded-xl pointer-events-none" />

              {/* Architectural Corner Accent Brackets */}
              <span className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-[#D6B77A]/60 pointer-events-none" />
              <span className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-[#D6B77A]/60 pointer-events-none" />
              <span className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-[#D6B77A]/60 pointer-events-none" />
              <span className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-[#D6B77A]/60 pointer-events-none" />

              {/* 1. Opening Basmala (Always clearly visible in both states) */}
              <div className="mb-2">
                <p className="text-xs font-serif text-[#790D20] font-semibold tracking-wider">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
                <p className="text-[10px] sm:text-[11px] text-[#6E5D59] mt-0.5 font-sans">
                  نتشرف بدعوتكم لمشاركتنا فرحة العمر في ليلة زفاف
                </p>
              </div>

              {/* 2. THE EMOTIONAL CENTER: Couple Names (Grand, Proudly Visible Always) */}
              <div className="py-1 sm:py-1.5 space-y-0.5">
                <h3 className="text-2xl sm:text-[1.85rem] font-bold font-serif text-[#390E19] tracking-tight leading-snug">
                  أحمد منصور
                </h3>
                <div className="flex items-center justify-center gap-2.5 my-0.5">
                  <span className="w-8 h-[1px] bg-gradient-to-l from-[#D6B77A] to-transparent" />
                  <span className="text-sm font-serif text-[#790D20] italic font-normal">
                    &
                  </span>
                  <span className="w-8 h-[1px] bg-gradient-to-r from-[#D6B77A] to-transparent" />
                </div>
                <h3 className="text-2xl sm:text-[1.85rem] font-bold font-serif text-[#390E19] tracking-tight leading-snug">
                  سارة الجوهري
                </h3>
              </div>

              {/* 3. Wedding Date & Venue Details (Fully revealed when emerged) */}
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
              <div className="mt-2.5 pt-2 border-t border-[#EFE4DC] flex items-center justify-between gap-2 text-[10px]">
                <div className="flex items-center gap-1 text-[#8B7778] font-mono text-[9.5px]">
                  <Clock className="w-3 h-3 text-[#D6B77A] shrink-0" />
                  <span>باقي: ١٢٠ يوماً</span>
                </div>

                <button
                  type="button"
                  onClick={handleRsvpToggle}
                  className={`px-3 py-1 rounded-full font-bold transition-all min-h-[30px] flex items-center gap-1 text-[9.5px] shadow-xs cursor-pointer ${
                    hasRsvpd
                      ? "bg-[#F0F7F1] text-[#3D7A42] border border-[#3D7A42]/40"
                      : "bg-[#790D20] text-white hover:bg-[#630A19]"
                  }`}
                >
                  {hasRsvpd ? (
                    <>
                      <Check className="w-3 h-3 text-[#3D7A42]" />
                      <span>تم تأكيد حضورك</span>
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

          {/* ------------------------------------------------------------------- */}
          {/* LAYER 3: ENVELOPE FRONT POCKET (LEFT, RIGHT & BOTTOM FLAPS)         */}
          {/* ------------------------------------------------------------------- */}
          <div
            className={`absolute bottom-0 w-full h-[180px] sm:h-[195px] pointer-events-none transition-[transform,opacity] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              isOpen
                ? "z-10 translate-y-6 sm:translate-y-8 opacity-90"
                : "z-30 translate-y-0 opacity-100"
            }`}
          >
            <svg
              viewBox="0 0 380 195"
              className="w-full h-full drop-shadow-[0_12px_24px_rgba(28,4,9,0.4)]"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                {/* Left Flap Gradient */}
                <linearGradient id="pocketLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6C0C1C" />
                  <stop offset="100%" stopColor="#4A0813" />
                </linearGradient>

                {/* Right Flap Gradient */}
                <linearGradient id="pocketRight" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#620A19" />
                  <stop offset="100%" stopColor="#420711" />
                </linearGradient>

                {/* Bottom Triangular Pocket Flap Gradient */}
                <linearGradient id="pocketBottom" x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#7E0D22" />
                  <stop offset="50%" stopColor="#5E0A19" />
                  <stop offset="100%" stopColor="#3B060F" />
                </linearGradient>

                {/* Metallic Gold Hairline Flap Edge */}
                <linearGradient id="goldSeam" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D6B77A" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#D6B77A" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#D6B77A" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Left Folded Triangular Flap */}
              <polygon points="0,0 170,110 0,195" fill="url(#pocketLeft)" />

              {/* Right Folded Triangular Flap */}
              <polygon points="380,0 210,110 380,195" fill="url(#pocketRight)" />

              {/* Bottom Overlapping Pocket Flap (V-Shape Notch) */}
              <polygon points="0,195 190,55 380,195" fill="url(#pocketBottom)" />

              {/* Fine Gold Beveled Seam Line across the Front Pocket Edge */}
              <polyline
                points="0,195 190,55 380,195"
                stroke="url(#goldSeam)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>

            {/* Subtle Brand Message Bar on Envelope Base */}
            <div className="absolute bottom-2 inset-x-4 flex items-center justify-between text-[9px] sm:text-[9.5px] text-[#FAF4E8]/80 font-serif border-t border-[#D6B77A]/20 pt-1 pointer-events-auto">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A]" />
                <span>دعوات زفاف رقمية • ذكريات تدوم</span>
              </span>

              <Link
                href="/preview?template=royal-gold"
                target="_blank"
                className="hover:text-white hover:underline flex items-center gap-1 text-[#D6B77A] py-0.5 px-1 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#D6B77A]"
              >
                <span>معاينة حية</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* LAYER 4: ENVELOPE TOP FOLDING FLAP WITH ATTACHED WAX SEAL           */}
          {/* GPU accelerated 3D rotation without CPU drop-shadow filters         */}
          {/* ------------------------------------------------------------------- */}
          <div
            className={`absolute bottom-0 w-full h-[180px] sm:h-[195px] transition-[transform] duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none pointer-events-none ${
              isOpen
                ? "z-10 translate-y-6 sm:translate-y-8"
                : "z-30 translate-y-0"
            }`}
          >
            {/* The Top Triangular Flap: Anchored at top line of pocket (y=0) */}
            <div
              className={`absolute top-0 inset-x-0 h-[100px] sm:h-[110px] origin-top transition-[transform] duration-800 ease-[cubic-bezier(0.25,0.9,0.3,1)] motion-reduce:transition-none [backface-visibility:hidden] [transform-style:preserve-3d] ${
                isOpen ? "[transform:rotate3d(1,0,0,180deg)]" : "[transform:rotate3d(1,0,0,0deg)]"
              }`}
            >
              {/* Outer Burgundy Flap Shape (vector shaded without expensive filters) */}
              <svg
                viewBox="0 0 380 110"
                className="w-full h-full"
                preserveAspectRatio="none"
                fill="none"
              >
                <defs>
                  <linearGradient id="flapTopGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#8A1027" />
                    <stop offset="60%" stopColor="#690C1E" />
                    <stop offset="100%" stopColor="#4A0815" />
                  </linearGradient>
                </defs>

                {/* Pointed Downward Flap */}
                <polygon points="0,0 380,0 190,105" fill="url(#flapTopGrad)" />

                {/* Beveled Edge Highlight */}
                <polyline
                  points="0,0 190,105 380,0"
                  stroke="#D6B77A"
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                />
              </svg>

              {/* THE WAX SEAL: Attached Directly to the Apex of the Top Flap */}
              <div
                className={`absolute top-[82px] sm:top-[88px] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.2,0.9,0.3,1)] ${
                  isOpen ? "opacity-0 scale-70 pointer-events-none" : "opacity-100 scale-100 delay-150"
                }`}
              >
                <button
                  type="button"
                  onClick={handleSealClick}
                  aria-label="ختم شمع لحظة الملكي"
                  className="relative flex items-center justify-center transition-transform duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] focus-visible:ring-offset-2 active:scale-95 cursor-pointer hover:scale-105"
                >
                  {/* Subtle Candlelight Warm Glow (When closed) */}
                  {!isOpen && (
                    <span className="absolute -inset-2 rounded-full bg-[#D6B77A]/25 blur-md animate-pulse pointer-events-none" />
                  )}

                  {/* Organic Burgundy Pressed Wax Seal */}
                  <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-[47%_53%_51%_49%] bg-gradient-to-br from-[#8E1026] via-[#6E0C1C] to-[#380710] shadow-[0_6px_18px_rgba(43,8,16,0.65),inset_0_2px_3px_rgba(255,255,255,0.4),inset_0_-3px_5px_rgba(0,0,0,0.7)] flex items-center justify-center border border-[#D6B77A]/55">
                    {/* Stamped Die Depression with Clean LAHZAH Star Emblem */}
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#D6B77A]/70 flex items-center justify-center bg-[#540815] shadow-[inset_0_2px_4px_rgba(0,0,0,0.65),inset_0_-1px_1px_rgba(255,255,255,0.2)]">
                      <svg
                        viewBox="0 0 40 40"
                        className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#FAF4E8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                        fill="none"
                        aria-hidden="true"
                      >
                        <circle
                          cx="20"
                          cy="20"
                          r="17"
                          stroke="#D6B77A"
                          strokeWidth="0.8"
                          strokeDasharray="1.5 1.5"
                          opacity="0.85"
                        />
                        {/* Iconic Clean 8-Point Gold Diamond Star */}
                        <polygon
                          points="20,8 22,16.5 30.5,17 24,22 26.5,30 20,25 13.5,30 16,22 9.5,17 18,16.5"
                          fill="url(#sealStarGold)"
                        />
                        <circle cx="20" cy="19.5" r="1" fill="#FFFDF9" />
                        <defs>
                          <linearGradient id="sealStarGold" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#FFFDF7" />
                            <stop offset="50%" stopColor="#D6B77A" />
                            <stop offset="100%" stopColor="#A88242" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Replay Action when opened (Ensures clear mobile/touch reversibility) */}
        {isOpen && (
          <div className="mt-4 flex items-center justify-center animate-fade-in z-40">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setHasRsvpd(false);
                onOpenChange?.(false);
              }}
              className="text-xs font-serif font-semibold text-[#790D20] hover:text-[#5F0A18] bg-[#FFFDFC]/95 px-4 py-1.5 rounded-full border border-[#D8B8B8] shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#790D20]" />
              <span>إعادة إغلاق المظروف ↺</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
