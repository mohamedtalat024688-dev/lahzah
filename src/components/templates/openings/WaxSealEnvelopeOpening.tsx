"use client";

import React, { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
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

export default function WaxSealEnvelopeOpening({
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
  const [stage, setStage] = useState<"sealed" | "breaking" | "opening" | "opened">("sealed");
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
    if (stage !== "sealed") return;

    if (isReducedMotion) {
      setStage("opened");
      onOpened();
      return;
    }

    setStage("breaking");
    setTimeout(() => {
      setStage("opening");
      setTimeout(() => {
        setStage("opened");
        onOpened();
      }, 700);
    }, 400);
  };

  if (stage === "opened") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="طقوس فتح دعوة الزفاف الملكية"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-700 ${
        stage === "opening" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: isLight ? "rgba(247, 244, 238, 0.96)" : "rgba(10, 9, 8, 0.96)",
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

      {/* Main Stationery Envelope Container */}
      <div className="relative w-full max-w-sm sm:max-w-md perspective-1200 mx-auto select-none">
        {/* Envelope Envelope Body */}
        <div
          className={`relative rounded-3xl overflow-hidden shadow-2xl border transition-all duration-700 ${
            isLight
              ? "bg-[#FAF7F2] border-[#E2D8C3] shadow-[0_25px_50px_-12px_rgba(57,14,25,0.15)]"
              : "bg-[#161412] border-[#2E2822] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)]"
          }`}
          style={{ minHeight: "440px" }}
        >
          {/* Inner stationery card peek */}
          <div
            className={`absolute inset-x-4 top-4 bottom-14 rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3 transition-transform duration-700 ease-out ${
              stage === "opening" ? "-translate-y-8 scale-105" : "translate-y-0"
            }`}
            style={{
              backgroundColor: isLight ? "#FFFDFC" : "#1B1815",
              border: `1px solid ${accent}30`,
            }}
          >
            <span className="text-[11px] tracking-widest uppercase font-semibold opacity-75" style={{ color: accent }}>
              {getEventTypeLabel(eventType)}
            </span>

            <div className="w-8 h-px mx-auto opacity-40" style={{ backgroundColor: accent }} />

            <div className="space-y-1">
              <h2
                className={`text-2xl sm:text-3xl font-display font-bold ${
                  isLight ? "text-[#1C1917]" : "text-[#FAF8F5]"
                }`}
              >
                {groomName} & {brideName}
              </h2>
              <p className={`text-xs ${isLight ? "text-[#786C5E]" : "text-[#A89F91]"}`}>
                {formattedDate}
              </p>
            </div>

            {venueName && (
              <p className={`text-[11px] font-medium opacity-80 ${isLight ? "text-[#786C5E]" : "text-[#C5A880]"}`}>
                📍 {venueName}
              </p>
            )}

            {welcomeMessage && (
              <p className={`text-[11px] italic line-clamp-2 max-w-xs ${isLight ? "text-[#9E8F7C]" : "text-[#8E877C]"}`}>
                «{welcomeMessage}»
              </p>
            )}
          </div>

          {/* Envelope Bottom Pocket (Obscures bottom of card) */}
          <div
            className={`absolute inset-x-0 bottom-0 h-40 rounded-b-3xl border-t flex flex-col justify-end p-5 text-center ${
              isLight
                ? "bg-[#FAF7F2]/95 border-[#E2D8C3]"
                : "bg-[#141210]/95 border-[#2E2822]"
            }`}
          >
            {/* Subtle decorative hairline */}
            <div className="w-16 h-px mx-auto mb-2 opacity-30" style={{ backgroundColor: accent }} />
            <p className={`text-[10px] tracking-wider uppercase ${isLight ? "text-[#9E8F7C]" : "text-[#8E877C]"}`}>
              دعوة خاصة موجهة لحضرتكم
            </p>
          </div>

          {/* Envelope Top Flap (Folds open in 3D) */}
          <div
            className={`absolute top-0 inset-x-0 h-44 origin-top transition-transform duration-700 ease-in-out transform-style-3d ${
              stage === "opening" || stage === "breaking" ? "-rotate-x-180 opacity-40" : "rotate-x-0"
            }`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              backgroundColor: isLight ? "#EFE7DA" : "#1A1714",
              borderBottom: `1px solid ${accent}40`,
            }}
          />

          {/* Interactive Royal Wax Seal Button */}
          <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <button
              onClick={handleOpen}
              type="button"
              aria-label="المس الختم الملكي لفتح الدعوة"
              className={`relative group cursor-pointer p-1 rounded-full outline-none focus:ring-4 focus:ring-offset-2 transition-all duration-300 ${
                stage === "breaking" ? "scale-125" : "hover:scale-110 active:scale-95 animate-gentle-pulse"
              }`}
              style={{
                outlineColor: accent,
              }}
            >
              {/* Gold Shimmer Ring */}
              <div
                className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity"
                style={{ backgroundColor: accent }}
              />

              {/* 3D Wax Seal Medallion */}
              <div
                className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center shadow-2xl transition-transform"
                style={{
                  background: `radial-gradient(circle at 35% 30%, #B8253E 0%, #790D20 60%, #390E19 100%)`,
                  border: `2px solid ${accent}80`,
                  boxShadow: `0 10px 25px -4px rgba(121, 13, 32, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.4), inset 0 -3px 6px rgba(0, 0, 0, 0.6)`,
                }}
              >
                {/* Wax Seal Rim Embossing */}
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-[#D6B77A]/50 flex flex-col items-center justify-center p-1"
                  style={{
                    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.4)",
                  }}
                >
                  <Sparkles className="w-3 h-3 text-[#FAF4E8]/80 mb-0.5 animate-pulse" />
                  <span className="text-xs sm:text-sm font-display font-bold text-[#FAF4E8] tracking-widest drop-shadow-sm">
                    {groomInitial} • {brideInitial}
                  </span>
                </div>
              </div>
            </button>

            {/* Instruction Cue */}
            <div
              className={`mt-4 px-4 py-1.5 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-sm transition-opacity duration-300 ${
                stage === "breaking" ? "opacity-0" : "opacity-90"
              }`}
              style={{
                backgroundColor: isLight ? "#FFFDFC" : "#1F1B17",
                color: accent,
                border: `1px solid ${accent}40`,
              }}
            >
              <span>المس الختم الملكي لفتح الدعوة</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
