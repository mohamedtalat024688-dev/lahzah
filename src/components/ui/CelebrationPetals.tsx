"use client";

import React from "react";

/**
 * AmbientWarmth: Luxury lighting atmosphere inspired by morning sunlight
 * falling on bespoke wedding stationery. Free from generic floating SVG clipart.
 */
export default function CelebrationPetals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Primary Warm Sunlit Pool */}
      <div className="absolute -top-32 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#FFCBA4]/20 via-[#F5B5C8]/10 to-transparent blur-3xl opacity-75" />

      {/* Gentle Morning Light on Left Side */}
      <div className="absolute top-1/4 -left-24 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#FAF3E5]/40 via-[#FFF4EC]/25 to-transparent blur-3xl opacity-60" />

      {/* Subtle Champagne Reflection */}
      <div className="absolute top-3/4 right-10 w-[450px] h-[450px] rounded-full bg-gradient-to-tl from-[#D6AD65]/10 via-[#FFF9F0] to-transparent blur-3xl opacity-50" />
    </div>
  );
}
