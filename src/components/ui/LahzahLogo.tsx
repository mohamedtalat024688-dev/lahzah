"use client";

import React from "react";

interface LahzahLogoProps {
  variant?: "full" | "icon" | "stacked" | "light";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showSubtitle?: boolean;
}

export default function LahzahLogo({
  variant = "full",
  size = "md",
  className = "",
  showSubtitle = true,
}: LahzahLogoProps) {
  // Size mappings
  const emblemSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
  };

  const titleSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-4xl",
  };

  const subtitleSizes = {
    sm: "text-[9px]",
    md: "text-[11px]",
    lg: "text-xs",
    xl: "text-sm",
  };

  const isLight = variant === "light";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* The Circular Burgundy Medallion / Seal */}
      <div
        className={`relative ${emblemSizes[size]} rounded-full bg-gradient-to-br from-[#8E1026] via-[#790D20] to-[#4A0A16] p-[1.5px] shadow-[0_4px_12px_rgba(121,13,32,0.25)] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105`}
        aria-hidden="true"
      >
        {/* Inner Delicate Ring */}
        <div className="w-full h-full rounded-full border border-[#D8B8B8]/30 flex items-center justify-center relative overflow-hidden">
          {/* Subtle Radial Light Glow */}
          <div className="absolute inset-0 bg-radial from-white/15 to-transparent pointer-events-none" />

          {/* Crisp White Emblem / Monogram */}
          <svg
            viewBox="0 0 100 100"
            className="w-[75%] h-[75%] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
            fill="currentColor"
          >
            {/* Elegant Floral Wreath Flourish */}
            <circle
              cx="50"
              cy="50"
              r="44"
              fill="none"
              stroke="#D6B77A"
              strokeWidth="1.2"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            {/* Arabic Calligraphic "ل" with Romantic Loop and Accent Spark */}
            <path
              d="M58 22 C58 20 54 20 52 24 L48 55 C46 64 40 70 30 68 C22 66 20 58 24 50 C26 46 30 46 31 49 C32 52 30 57 26 58 C24 58 25 61 28 62 C34 63 39 58 41 50 L46 22 C48 16 54 16 58 22 Z"
              fill="white"
            />
            {/* Secondary Harmony Flourish "حـظـة" Tail */}
            <path
              d="M48 64 C56 65 68 62 76 54 C78 52 80 54 78 57 C70 68 56 73 45 70 C43 69 44 65 48 64 Z"
              fill="white"
            />
            {/* Elegant Diamond Star Point */}
            <polygon
              points="64,30 67,35 72,36 68,40 69,45 64,42 59,45 60,40 56,36 61,35"
              fill="#D6B77A"
              transform="scale(0.4) translate(70, 20)"
            />
          </svg>
        </div>
      </div>

      {/* Brand Typography Wordmark (unless icon-only) */}
      {variant !== "icon" && (
        <div className="flex flex-col text-right">
          <div className="flex items-baseline gap-2">
            <span
              className={`font-serif font-bold tracking-tight leading-none ${titleSizes[size]} ${
                isLight ? "text-white" : "text-[#790D20]"
              }`}
            >
              لـحـظـة
            </span>
            <span
              className={`text-[9px] uppercase font-serif tracking-[0.2em] font-semibold ${
                isLight ? "text-[#D6B77A]" : "text-[#8B7778]"
              }`}
            >
              LAHZAH
            </span>
          </div>
          {showSubtitle && (
            <span
              className={`font-normal tracking-wide mt-0.5 ${subtitleSizes[size]} ${
                isLight ? "text-white/80" : "text-[#8B7778]"
              }`}
            >
              دعوات زفاف إلكترونية وتوثيق الذكريات
            </span>
          )}
        </div>
      )}
    </div>
  );
}
