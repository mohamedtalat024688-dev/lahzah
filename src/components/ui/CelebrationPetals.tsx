"use client";

import React, { useId } from "react";

interface CelebrationPetalsProps {
  isOpen?: boolean;
}

type PetalVariant = "burgundy" | "wine" | "dustyRose" | "mutedRose";
type PetalShape = "shape1" | "shape2" | "shape3";

const COLOR_MAP: Record<
  PetalVariant,
  { light: string; mid: string; deep: string; defaultOpacity: number }
> = {
  burgundy: {
    light: "#8E1026",
    mid: "#790D20",
    deep: "#5A0917",
    defaultOpacity: 0.88,
  },
  wine: {
    light: "#790D20",
    mid: "#630A19",
    deep: "#390E19",
    defaultOpacity: 0.84,
  },
  dustyRose: {
    light: "#D899A3",
    mid: "#C27A88",
    deep: "#9E4557",
    defaultOpacity: 0.82,
  },
  mutedRose: {
    light: "#E8B8C0",
    mid: "#D899A3",
    deep: "#B86B7A",
    defaultOpacity: 0.76,
  },
};

/**
 * Individual Detached Rose Petal Component
 * Authentic 2D organic petal silhouette with naturally wide rounded apex
 * and tapered basal tip, enhanced with subtle contour shading.
 * Free from stems, leaves, complete flowers, sparkles, or icons.
 */
function RosePetal({
  shape = "shape1",
  variant = "burgundy",
  customColor,
  size = 23,
  rotation = 0,
  opacity,
  className = "",
  style = {},
}: {
  shape?: PetalShape;
  variant?: PetalVariant;
  customColor?: string;
  size?: number;
  rotation?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const rawId = useId();
  const gradId = `petal-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const baseColors = COLOR_MAP[variant];
  const colors = customColor
    ? {
        light: "#F5D4DA",
        mid: customColor,
        deep: "#CF949F",
        defaultOpacity: baseColors.defaultOpacity,
      }
    : baseColors;
  const finalOpacity = opacity ?? colors.defaultOpacity;
  const height = Math.round(size * 1.14);

  return (
    <div
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        width: size,
        height: height,
        transform: `rotate(${rotation}deg)`,
        opacity: finalOpacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 32 36"
        width={size}
        height={height}
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(57,14,25,0.06)]"
      >
        <defs>
          <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="55%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.deep} />
          </linearGradient>
        </defs>

        {shape === "shape1" && (
          <>
            {/* Classic Broad Rose Petal: Wide rounded top with delicate cleft, tapering down to a narrow basal tip */}
            <path
              d="M 16 5.5 C 13.5 3.5 8 3.5 5 7.5 C 2.5 11 2 16 4 21 C 6.5 26.5 11.5 31.5 15.5 33.8 C 15.8 34 16.2 34 16.5 33.8 C 20.5 31.5 25.5 26.5 28 21 C 30 16 29.5 11 27 7.5 C 24 3.5 18.5 3.5 16 5.5 Z"
              fill={`url(#${gradId})`}
            />
            {/* Natural interior petal contour/crease for subtle 2D depth */}
            <path
              d="M 16 8 C 15.6 15 15.6 23 16 31"
              stroke={colors.deep}
              strokeWidth="0.75"
              strokeOpacity="0.28"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {shape === "shape2" && (
          <>
            {/* Asymmetrical Natural Rose Petal: Full rounded left shoulder with curled right flank, tapered tip */}
            <path
              d="M 14 33.5 C 9 29 4 23 3 16 C 2 9.5 7 4 13 4 C 17.5 4 23.5 6 26.5 10 C 29.5 14.5 27.5 20 23.5 25 C 20 28.5 17 31.5 14 33.5 Z"
              fill={`url(#${gradId})`}
            />
            {/* Organic contour line representing petal cupping */}
            <path
              d="M 24 11 C 21 16 19 22 16.5 28"
              stroke={colors.deep}
              strokeWidth="0.65"
              strokeOpacity="0.25"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {shape === "shape3" && (
          <>
            {/* Gracefully Tilted Romantic Petal: Sweeping curved apex tapering to a slender base */}
            <path
              d="M 15 3.5 C 9.5 4 4.5 9 5 15.5 C 5.5 21 9 27 13.5 32.5 C 14.2 33.2 15 33 15.5 32.5 C 19.5 27.5 25 20.5 25.5 14.5 C 26 8.5 21 3.5 15 3.5 Z"
              fill={`url(#${gradId})`}
            />
            {/* Slender curved vein */}
            <path
              d="M 14.5 6.5 C 13.5 13 14 21 15 29"
              stroke={colors.deep}
              strokeWidth="0.65"
              strokeOpacity="0.25"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </div>
  );
}

/**
 * Restrained Full Hero Ambient Rose Petals Animation for LAHZAH
 * 10 carefully positioned individual rose petals floating gently
 * across the hero atmosphere in brand burgundy and dusty-rose tones.
 */
export default function CelebrationPetals({
  isOpen = false,
}: CelebrationPetalsProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-[1] select-none"
      aria-hidden="true"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Soft Ambient Directional Lighting Pools across Hero Section         */}
      {/* ------------------------------------------------------------------- */}
      <div
        className={`absolute -top-32 right-1/4 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-[#F1DEDF]/25 via-[#D8B8B8]/10 to-transparent blur-3xl transition-opacity duration-1000 ${
          isOpen ? "opacity-80" : "opacity-60"
        }`}
      />
      <div className="absolute top-1/4 -left-28 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-[#D6B77A]/10 via-[#FAF4E8]/20 to-transparent blur-3xl opacity-50" />
      <div className="absolute top-3/4 right-8 w-[480px] h-[480px] rounded-full bg-gradient-to-tl from-[#390E19]/5 via-[#F1DEDF]/10 to-transparent blur-3xl opacity-40" />

      {/* =================================================================== */}
      {/* 1. RESTRAINED AMBIENT ROSE PETALS (10 Natural Elements Across Hero) */}
      {/* =================================================================== */}

      {/* Petal 1: Upper-Right Sky (Medium size, burgundy) */}
      <RosePetal
        shape="shape1"
        variant="burgundy"
        size={23}
        rotation={18}
        opacity={0.88}
        className="animate-petal-breeze-1"
        style={{
          top: "6%",
          right: "12%",
          animationDuration: "14s",
          animationDelay: "0s",
        }}
      />

      {/* Petal 2: Right Margin beside Headline (Small size, distant soft dusty rose) */}
      <RosePetal
        shape="shape2"
        variant="dustyRose"
        size={16}
        rotation={-24}
        opacity={0.70}
        className="animate-petal-breeze-2"
        style={{
          top: "22%",
          right: "2%",
          animationDuration: "16s",
          animationDelay: "1.8s",
        }}
      />

      {/* Petal 3: Soft Dusty Pink Petal (#E8B5BE) near 'استثنائية' (Clearance trajectory preserves headline readability) */}
      <RosePetal
        shape="shape3"
        variant="dustyRose"
        customColor="#E8B5BE"
        size={26}
        rotation={26}
        opacity={0.86}
        className="animate-petal-breeze-headline"
        style={{
          top: "45%",
          right: "22%",
          animationDuration: "13s",
          animationDelay: "3.5s",
        }}
      />

      {/* Petal 4: Lower Right near stats (Small-Medium, muted rose) */}
      <RosePetal
        shape="shape1"
        variant="mutedRose"
        size={18}
        rotation={-14}
        opacity={0.78}
        className="animate-petal-breeze-4"
        style={{
          top: "74%",
          right: "8%",
          animationDuration: "17s",
          animationDelay: "2.2s",
        }}
      />

      {/* Petal 5: Upper Center Open Luxury Space (Medium, wine red) */}
      <RosePetal
        shape="shape1"
        variant="wine"
        size={24}
        rotation={-30}
        opacity={0.85}
        className="animate-petal-breeze-2"
        style={{
          top: "10%",
          left: "49%",
          animationDuration: "15s",
          animationDelay: "1.2s",
        }}
      />

      {/* Petal 6: Mid Center Floating between columns (Small, delicate dusty rose) */}
      <RosePetal
        shape="shape2"
        variant="dustyRose"
        size={17}
        rotation={20}
        opacity={0.68}
        className="animate-petal-breeze-3"
        style={{
          top: "39%",
          left: "45%",
          animationDuration: "13.5s",
          animationDelay: "2.6s",
        }}
      />

      {/* Petal 7: Upper Left above Invitation Flatlay (Larger hero accent, dusty rose) */}
      <RosePetal
        shape="shape2"
        variant="dustyRose"
        size={29}
        rotation={-18}
        opacity={0.90}
        className="animate-petal-breeze-1"
        style={{
          top: "7%",
          left: "14%",
          animationDuration: "15s",
          animationDelay: "0.8s",
        }}
      />

      {/* Petal 8: Far Left Margin beside Invitation (Small, muted rose) */}
      <RosePetal
        shape="shape3"
        variant="mutedRose"
        size={17}
        rotation={40}
        opacity={0.72}
        className="animate-petal-breeze-3"
        style={{
          top: "26%",
          left: "3%",
          animationDuration: "12.5s",
          animationDelay: "2.1s",
        }}
      />

      {/* Petal 9: Lower Left beside Envelope (Medium, burgundy) */}
      <RosePetal
        shape="shape1"
        variant="burgundy"
        size={25}
        rotation={-26}
        opacity={0.88}
        className="animate-petal-breeze-4"
        style={{
          top: "68%",
          left: "7%",
          animationDuration: "16.5s",
          animationDelay: "4.2s",
        }}
      />

      {/* Petal 10: Bottom Left / Center Margin (Medium, wine red) */}
      <RosePetal
        shape="shape3"
        variant="wine"
        size={22}
        rotation={14}
        opacity={0.82}
        className="animate-petal-breeze-2"
        style={{
          top: "89%",
          left: "22%",
          animationDuration: "15.5s",
          animationDelay: "1.5s",
        }}
      />

      {/* =================================================================== */}
      {/* 2. REVEALED CELEBRATION PETALS (3 Petals Drift on Envelope Hover)   */}
      {/* =================================================================== */}
      <div
        className={`transition-opacity duration-1000 ease-out ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Celebration Petal A: Floats from envelope towards headline */}
        <RosePetal
          shape="shape3"
          variant="burgundy"
          size={24}
          rotation={32}
          opacity={0.88}
          className="animate-petal-breeze-1"
          style={{
            top: "34%",
            left: "40%",
            animationDuration: "11s",
            animationDelay: "0.3s",
          }}
        />

        {/* Celebration Petal B: Floats above opened envelope flap */}
        <RosePetal
          shape="shape1"
          variant="dustyRose"
          size={19}
          rotation={-16}
          opacity={0.82}
          className="animate-petal-breeze-2"
          style={{
            top: "16%",
            left: "28%",
            animationDuration: "10.5s",
            animationDelay: "0.6s",
          }}
        />

        {/* Celebration Petal C: Drifts across center toward headline */}
        <RosePetal
          shape="shape2"
          variant="wine"
          size={22}
          rotation={24}
          opacity={0.85}
          className="animate-petal-breeze-3"
          style={{
            top: "56%",
            right: "30%",
            animationDuration: "12.5s",
            animationDelay: "0.9s",
          }}
        />
      </div>
    </div>
  );
}
