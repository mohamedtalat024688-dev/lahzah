"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RotateCcw, FastForward } from "lucide-react";
import {
  TemplateConfig,
  getTemplateOpeningAnimation,
  OpeningAnimationArchetype,
} from "@/lib/templates";
import WaxSealEnvelopeOpening from "./WaxSealEnvelopeOpening";
import SlidingSleeveOpening from "./SlidingSleeveOpening";
import GatefoldDoorsOpening from "./GatefoldDoorsOpening";

interface OpeningEngineProps {
  template: TemplateConfig;
  groomName: string;
  brideName: string;
  eventDate: string | Date;
  venueName: string;
  eventType?: string;
  welcomeMessage?: string | null;
  onOpened?: () => void;
  isEditorPreview?: boolean;
  children: React.ReactNode;
}

export default function OpeningEngine({
  template,
  groomName,
  brideName,
  eventDate,
  venueName,
  eventType,
  welcomeMessage,
  onOpened,
  isEditorPreview = false,
  children,
}: OpeningEngineProps) {
  const [isOpen, setIsOpen] = useState(isEditorPreview);
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });

  // Listen for prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const handleOpened = useCallback(() => {
    setIsOpen(true);
    if (onOpened) onOpened();
  }, [onOpened]);

  const handleSkip = useCallback(() => {
    setIsOpen(true);
    if (onOpened) onOpened();
  }, [onOpened]);

  const handleReplay = useCallback(() => {
    setIsOpen(false);
  }, []);

  const animationType: OpeningAnimationArchetype = getTemplateOpeningAnimation(template);
  const accent = template.theme.accentColor;
  const isLight = template.theme.isLight;

  return (
    <>
      {/* 1. Opening Ceremony Overlay (Active when closed) */}
      {!isOpen && (
        <div className="relative z-50">
          {/* Skip Opening Button */}
          <div className="fixed top-5 right-5 z-[60]">
            <button
              onClick={handleSkip}
              type="button"
              aria-label="تخطي حركة فتح الدعوة والانتقال للمحتوى مباشرة"
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 ${
                isLight
                  ? "bg-[#FFFDFC]/90 border-[#E0D6C3] text-[#786C5E] hover:text-[#1C1917]"
                  : "bg-[#141210]/90 border-[#2E2924] text-[#C5A880] hover:text-[#FAF8F5]"
              }`}
            >
              <span>تخطي</span>
              <FastForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Archetype Renderer */}
          {animationType === "sliding-sleeve" && (
            <SlidingSleeveOpening
              template={template}
              groomName={groomName}
              brideName={brideName}
              eventDate={eventDate}
              venueName={venueName}
              eventType={eventType}
              welcomeMessage={welcomeMessage}
              onOpened={handleOpened}
              isReducedMotion={isReducedMotion}
            />
          )}

          {animationType === "gatefold-doors" && (
            <GatefoldDoorsOpening
              template={template}
              groomName={groomName}
              brideName={brideName}
              eventDate={eventDate}
              venueName={venueName}
              eventType={eventType}
              welcomeMessage={welcomeMessage}
              onOpened={handleOpened}
              isReducedMotion={isReducedMotion}
            />
          )}

          {animationType === "wax-seal" && (
            <WaxSealEnvelopeOpening
              template={template}
              groomName={groomName}
              brideName={brideName}
              eventDate={eventDate}
              venueName={venueName}
              eventType={eventType}
              welcomeMessage={welcomeMessage}
              onOpened={handleOpened}
              isReducedMotion={isReducedMotion}
            />
          )}
        </div>
      )}

      {/* 2. Invitation Content Body (Remains mounted in DOM for zero layout shift) */}
      <div
        className={`transition-opacity duration-700 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {children}

        {/* Floating Replay Button */}
        {isOpen && !isEditorPreview && (
          <div className="fixed bottom-5 right-5 z-40">
            <button
              onClick={handleReplay}
              type="button"
              title="إعادة طقوس فتح الدعوة"
              aria-label="إعادة فتح الدعوة"
              className={`p-2.5 sm:px-3.5 sm:py-2 rounded-full backdrop-blur-md border shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-medium ${
                isLight
                  ? "bg-[#FAF8F5]/90 border-[#E0D6C3] text-[#786C5E] hover:text-[#1C1917]"
                  : "bg-[#141210]/90 border-[#2E2924] text-[#C5A880] hover:text-[#FAF8F5]"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" style={{ color: accent }} />
              <span className="hidden sm:inline">إعادة فتح الدعوة</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
