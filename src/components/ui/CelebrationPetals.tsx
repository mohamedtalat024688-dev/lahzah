"use client";

import React from "react";

/**
 * AmbientWarmth: Luxury lighting atmosphere inspired by warm morning light
 * falling on fine burgundy & ivory wedding stationery.
 */
export default function CelebrationPetals() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10" aria-hidden="true">
      {/* Primary Warm Sunlit Pool with Soft Blush & Rose Tint */}
      <div className="absolute -top-32 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#F1DEDF]/35 via-[#D8B8B8]/15 to-transparent blur-3xl opacity-75" />

      {/* Subtle Champagne Reflection on Left */}
      <div className="absolute top-1/4 -left-28 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#D6B77A]/12 via-[#FAF4E8]/30 to-transparent blur-3xl opacity-60" />

      {/* Very Soft Deep Wine Vignette at the Bottom */}
      <div className="absolute top-3/4 right-8 w-[480px] h-[480px] rounded-full bg-gradient-to-tl from-[#390E19]/6 via-[#F1DEDF]/10 to-transparent blur-3xl opacity-50" />
    </div>
  );
}
