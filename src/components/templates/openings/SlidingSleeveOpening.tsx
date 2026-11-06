"use client";

import React, { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
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

export default function SlidingSleeveOpening({
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
  const [stage, setStage] = useState<"sleeved" | "sliding" | "opened">("sleeved");
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
    if (stage !== "sleeved") return;

    if (isReducedMotion) {
      setStage("opened");
      onOpened();
      return;
    }

    setStage("sliding");
    setTimeout(() => {
      setStage("opened");
      onOpened();
    }, 800);
  };

  if (stage === "opened") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="طقوس فتح دعوة السليف الفاخرة"
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-700 ${
        stage === "sliding" ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundColor: isLight ? "rgba(245, 243, 240, 0.96)" : "rgba(12, 11, 10, 0.96)",
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

      {/* Main Luxury Sleeve Container */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-auto select-none">
        {/* Inner Card (Stationery reveal) */}
        <div
          className={`relative rounded-3xl p-7 text-center border shadow-2xl space-y-4 transition-transform duration-700 ease-out ${
            isLight
              ? "bg-[#FFFDFC] border-[#E8E0D0] text-[#1C1917]"
              : "bg-[#161412] border-[#2E2822] text-[#FAF8F5]"
          }`}
          style={{ minHeight: "420px" }}
        >
          <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: `${accent}30` }}>
            <span className="text-[10px] uppercase font-mono tracking-widest" style={{ color: accent }}>
              {getEventTypeLabel(eventType)}
            </span>
            <span className="text-xs font-serif" style={{ color: accent }}>✦ ⚜ ✦</span>
          </div>

          <div className="py-6 space-y-3">
            <span
              className="text-xs font-mono uppercase tracking-widest block"
              style={{ color: accent }}
            >
              Maison de Célébration
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-light tracking-wide">
              {groomName}
            </h2>
            <p className="text-sm font-serif italic" style={{ color: accent }}>&</p>
            <h2 className="text-3xl sm:text-4xl font-display font-light tracking-wide">
              {brideName}
            </h2>
          </div>

          <div className="w-12 h-px mx-auto opacity-40" style={{ backgroundColor: accent }} />

          <p className={`text-xs ${isLight ? "text-[#786C5E]" : "text-[#A89F91]"}`}>
            {formattedDate}
          </p>

          {venueName && (
            <p className={`text-xs font-medium ${isLight ? "text-[#786C5E]" : "text-[#C5A880]"}`}>
              {venueName}
            </p>
          )}

          {welcomeMessage && (
            <p className={`text-[11px] italic line-clamp-2 pt-2 ${isLight ? "text-[#9E8F7C]" : "text-[#8E877C]"}`}>
              «{welcomeMessage}»
            </p>
          )}
        </div>

        {/* Sliding Outer Sleeve with Cutout Window */}
        <div
          onClick={handleOpen}
          className={`absolute inset-0 rounded-3xl border shadow-2xl cursor-pointer overflow-hidden flex flex-col justify-between p-7 transition-all duration-800 ease-in-out ${
            stage === "sliding"
              ? "-translate-x-full opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100 hover:shadow-3xl"
          }`}
          style={{
            backgroundColor: isLight ? "#FAF5EE" : "#1B1713",
            borderColor: `${accent}60`,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.4)`,
          }}
        >
          {/* Subtle Metallic Foil Shimmer Strip */}
          <div
            className="absolute top-0 right-0 bottom-0 w-3 opacity-75"
            style={{
              background: `linear-gradient(to bottom, ${accent}, #FFF4E0, ${accent})`,
            }}
          />

          {/* Sleeve Top Bar */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: accent }}>
              دعوة خاصة
            </span>
            <Sparkles className="w-3.5 h-3.5" style={{ color: accent }} />
          </div>

          {/* Die-cut Oval / Arch Cutout Window showing Monogram */}
          <div className="my-auto py-8 flex flex-col items-center justify-center space-y-4">
            <div
              className="w-24 h-24 rounded-full border-2 flex items-center justify-center shadow-inner relative group"
              style={{
                borderColor: `${accent}80`,
                background: isLight
                  ? "radial-gradient(circle, #FAF7F2 40%, #EDE4D3 100%)"
                  : "radial-gradient(circle, #241F1A 40%, #161310 100%)",
              }}
            >
              <span
                className="text-xl sm:text-2xl font-display font-bold tracking-widest"
                style={{ color: accent }}
              >
                {groomInitial} • {brideInitial}
              </span>

              {/* Shimmer overlay */}
              <div
                className="absolute inset-0 rounded-full border border-dashed opacity-40 animate-spin"
                style={{
                  borderColor: accent,
                  animationDuration: "25s",
                }}
              />
            </div>

            <div className="text-center space-y-1">
              <p
                className={`text-sm font-display font-medium ${
                  isLight ? "text-[#1C1917]" : "text-[#FAF8F5]"
                }`}
              >
                {groomName} & {brideName}
              </p>
              <p className={`text-[11px] ${isLight ? "text-[#786C5E]" : "text-[#8E877C]"}`}>
                {formattedDate}
              </p>
            </div>
          </div>

          {/* Interactive Pull-Tab at Bottom / Slide Indicator */}
          <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: `${accent}30` }}>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: accent }} />
              <span
                className="text-xs font-medium tracking-wide"
                style={{ color: accent }}
              >
                اسحب أو اضغط لفتح الغلاف
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpen}
              aria-label="اسحب أو اضغط لفتح الغلاف"
              className="flex items-center gap-1 text-xs py-1.5 px-3 rounded-full font-semibold border shadow-sm transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: accent,
                color: isLight ? "#FFFFFF" : "#0C0B0A",
                borderColor: accent,
              }}
            >
              <span>فتح</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

