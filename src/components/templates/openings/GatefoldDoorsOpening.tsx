"use client";

import React, { useState } from "react";
import { Sparkles, Heart } from "lucide-react";
import { TemplateConfig, getEventTypeLabel } from "@/lib/templates";

interface OpeningProps {
  template: TemplateConfig;
  groomName: string;
  brideName: string;
  eventDate: string | Date;
  venueName: string;
  eventType?: string;
  welcomeMessage?: string | null;
  onOpened: () => void;
  isReducedMotion?: boolean;
}

export default function GatefoldDoorsOpening({
  template,
  groomName,
  brideName,
  eventDate,
  venueName,
  eventType,
  welcomeMessage,
  onOpened,
  isReducedMotion = false,
}: OpeningProps) {
  const [stage, setStage] = useState<"closed" | "unfolding" | "opened">("closed");
  const accent = template.theme.accentColor;
  const isLight = template.theme.isLight;

  const groomInitial = (groomName || "أ").trim().charAt(0);
  const brideInitial = (brideName || "س").trim().charAt(0);

  const formattedDate = new Date(eventDate).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleOpen = () => {
    if (stage !== "closed") return;

    if (isReducedMotion) {
      setStage("opened");
      onOpened();
      return;
    }

    setStage("unfolding");
    setTimeout(() => {
      setStage("opened");
      onOpened();
    }, 850);
  };

  if (stage === "opened") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="طقوس فتح دعوة البوابات النباتية المزدوجة"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-700 ${
        stage === "unfolding" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: isLight ? "rgba(248, 246, 242, 0.96)" : "rgba(10, 14, 12, 0.96)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Ambient background glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-96 h-80 sm:h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${accent} 0%, transparent 70%)`,
        }}
      />

      {/* Main Gatefold Stationery Container */}
      <div className="relative w-full max-w-sm sm:max-w-md perspective-1200 mx-auto select-none">
        {/* Inner Floral Invitation Card Peek */}
        <div
          className={`relative rounded-3xl p-7 text-center border shadow-2xl space-y-4 ${
            isLight
              ? "bg-[#FFFDFC] border-[#E5E0D5] text-[#1C1917]"
              : "bg-[#111915] border-[#1F2E25] text-[#FAF8F5]"
          }`}
          style={{ minHeight: "440px" }}
        >
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest" style={{ color: accent }}>
              {getEventTypeLabel(eventType)}
            </span>
            <p className="text-xs font-serif" style={{ color: accent }}>🪷 🌿 🪷</p>
          </div>

          <div className="py-5 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-display font-bold">
              {groomName}
            </h2>
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 h-px opacity-40" style={{ backgroundColor: accent }} />
              <Heart className="w-3.5 h-3.5 fill-current" style={{ color: accent }} />
              <span className="w-8 h-px opacity-40" style={{ backgroundColor: accent }} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold">
              {brideName}
            </h2>
          </div>

          <div className="space-y-1 pt-2">
            <p className={`text-xs font-medium ${isLight ? "text-[#786C5E]" : "text-[#A8B2AA]"}`}>
              {formattedDate}
            </p>
            {venueName && (
              <p className={`text-[11px] ${isLight ? "text-[#9E8F7C]" : "text-[#7D9185]"}`}>
                {venueName}
              </p>
            )}
          </div>

          {welcomeMessage && (
            <p className={`text-[11px] italic line-clamp-2 pt-2 ${isLight ? "text-[#9E8F7C]" : "text-[#8E9A92]"}`}>
              «{welcomeMessage}»
            </p>
          )}
        </div>

        {/* Double-Doors Gatefold Overlay */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-auto">
          {/* Left Door Panel */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 origin-left transition-transform duration-800 ease-in-out border-r transform-style-3d ${
              stage === "unfolding" ? "-rotate-y-110 opacity-30" : "rotate-y-0 opacity-100"
            }`}
            style={{
              backgroundColor: isLight ? "#FAF5EE" : "#131C17",
              borderColor: `${accent}40`,
              boxShadow: "inset -5px 0 15px rgba(0,0,0,0.1)",
            }}
          >
            {/* Left Door Filigree border */}
            <div className="absolute inset-2.5 rounded-l-2xl border border-dashed opacity-30" style={{ borderColor: accent }} />
            <div className="absolute top-4 left-4 text-xs opacity-60" style={{ color: accent }}>🌿</div>
            <div className="absolute bottom-4 left-4 text-xs opacity-60" style={{ color: accent }}>🪷</div>
          </div>

          {/* Right Door Panel */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-1/2 origin-right transition-transform duration-800 ease-in-out border-l transform-style-3d ${
              stage === "unfolding" ? "rotate-y-110 opacity-30" : "rotate-y-0 opacity-100"
            }`}
            style={{
              backgroundColor: isLight ? "#FAF5EE" : "#131C17",
              borderColor: `${accent}40`,
              boxShadow: "inset 5px 0 15px rgba(0,0,0,0.1)",
            }}
          >
            {/* Right Door Filigree border */}
            <div className="absolute inset-2.5 rounded-r-2xl border border-dashed opacity-30" style={{ borderColor: accent }} />
            <div className="absolute top-4 right-4 text-xs opacity-60" style={{ color: accent }}>🌿</div>
            <div className="absolute bottom-4 right-4 text-xs opacity-60" style={{ color: accent }}>🪷</div>
          </div>

          {/* Central Silk Ribbon & Floral Medallion */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center transition-all duration-500 ${
              stage === "unfolding" ? "scale-125 opacity-0" : "scale-100 opacity-100"
            }`}
          >
            {/* Horizontal Satin Ribbon Band across doors */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 w-48 h-8 rounded-sm opacity-85 -z-10 shadow-md"
              style={{
                background: `linear-gradient(90deg, transparent, ${accent}80, ${accent}, ${accent}80, transparent)`,
              }}
            />

            {/* Medallion Button */}
            <button
              onClick={handleOpen}
              type="button"
              aria-label="المس لفك الشريط وفتح الدعوة"
              className="group cursor-pointer p-1 rounded-full outline-none focus:ring-4 transition-transform hover:scale-110 active:scale-95 animate-gentle-pulse"
              style={{
                outlineColor: accent,
              }}
            >
              <div
                className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center shadow-xl border-2"
                style={{
                  background: isLight
                    ? "radial-gradient(circle at 35% 35%, #FFFDFC 0%, #FAF0E1 100%)"
                    : "radial-gradient(circle at 35% 35%, #1F2E25 0%, #111A15 100%)",
                  borderColor: accent,
                  boxShadow: `0 12px 30px -4px rgba(0, 0, 0, 0.4)`,
                }}
              >
                <Sparkles className="w-3.5 h-3.5 mb-0.5 animate-pulse" style={{ color: accent }} />
                <span className="text-xs sm:text-sm font-display font-bold tracking-widest" style={{ color: accent }}>
                  {groomInitial} • {brideInitial}
                </span>
                <span className="text-[9px] tracking-wider font-mono opacity-70" style={{ color: accent }}>
                  فُتحت بحب
                </span>
              </div>
            </button>

            {/* Instruction Cue */}
            <div
              className="mt-4 px-4 py-1 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-sm"
              style={{
                backgroundColor: isLight ? "#FFFDFC" : "#17231D",
                color: accent,
                border: `1px solid ${accent}40`,
              }}
            >
              <span>المس لفك الشريط وفتح الدعوة</span>
              <span className="text-sm">✦</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

