"use client";

import React, { useId } from "react";

interface CelebrationPetalsProps {
  isOpen?: boolean;
}

type PetalVariant = "burgundy" | "wine" | "dustyRose" | "mutedRose";
type PetalShape = "shape1" | "shape2" | "shape3";

const COLOR_MAP: Record<
  PetalVariant,
  { light: string; mid: string; deep: string; opacity: number }
> = {
  burgundy: {
    light: "#8E1026",
    mid: "#790D20",
    deep: "#5A0917",
    opacity: 0.88,
  },
  wine: {
    light: "#790D20",
    mid: "#630A19",
    deep: "#390E19",
    opacity: 0.82,
  },
  dustyRose: {
    light: "#D899A3",
    mid: "#C27A88",
    deep: "#9E4557",
    opacity: 0.85,
  },
  mutedRose: {
    light: "#E8B8C0",
    mid: "#D899A3",
    deep: "#B86B7A",
    opacity: 0.78,
  },
};

/**
 * Individual Detached Rose Petal Component
 * Pure 2D organic petal silhouette with subtle gradient shading.
 * Free from stems, leaves, complete flowers, sparkles, or icons.
 */
function RosePetal({
  shape = "shape1",
  variant = "burgundy",
  size = 22,
  rotation = 0,
  className = "",
  style = {},
}: {
  shape?: PetalShape;
  variant?: PetalVariant;
  size?: number;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const rawId = useId();
  const gradId = `petal-grad-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const colors = COLOR_MAP[variant];

  return (
    <div
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotation}deg)`,
        opacity: colors.opacity,
        ...style,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-[0_2px_4px_rgba(57,14,25,0.08)]"
      >
        <defs>
          <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor={colors.light} />
            <stop offset="60%" stopColor={colors.mid} />
            <stop offset="100%" stopColor={colors.deep} />
          </linearGradient>
        </defs>

        {shape === "shape1" && (
          <>
            {/* Classic curved cupped rose petal with wider rounded top & narrow basal tip */}
            <path
              d="M12 2.5C8.8 2.5 5 6.2 5.2 12C5.4 16.8 8.8 20.8 11.8 21.8C12.1 21.9 12.4 21.8 12.6 21.6C15.8 18.2 19 14.5 18.8 9.5C18.6 5.2 15.2 2.5 12 2.5Z"
              fill={`url(#${gradId})`}
            />
            {/* Subtle natural interior petal fold line */}
            <path
              d="M12 5C11.3 8.5 11.1 13 12.2 18.5"
              stroke={colors.deep}
              strokeWidth="0.6"
              strokeOpacity="0.25"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {shape === "shape2" && (
          <>
            {/* Asymmetrical natural rose petal, gently curled on one side */}
            <path
              d="M14.5 2.2C10.5 1.8 6.2 5.5 5.5 11C4.8 16 8 20 11.5 21.6C12.2 21.9 13 21.5 13.5 20.8C16.8 16.5 19.2 10.5 17.5 5C16.8 3.5 15.8 2.3 14.5 2.2Z"
              fill={`url(#${gradId})`}
            />
            {/* Gentle contour line for organic realism */}
            <path
              d="M13 4.5C12 9 11.5 14 12.5 19"
              stroke={colors.deep}
              strokeWidth="0.5"
              strokeOpacity="0.22"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {shape === "shape3" && (
          <>
            {/* Drifting romantic rose petal, slightly tilted profile */}
            <path
              d="M7.5 3C5 5.5 4.5 10.5 7 15.5C9.5 20 14 21.2 17.5 19.5C19.8 18.2 20.5 14.5 19 10C17.2 4.8 12.5 2.2 8.5 2.8C8.1 2.9 7.8 2.9 7.5 3Z"
              fill={`url(#${gradId})`}
            />
            {/* Subtle curve accent */}
            <path
              d="M9 5.5C10.5 9.5 13 14 16 17"
              stroke={colors.deep}
              strokeWidth="0.5"
              strokeOpacity="0.22"
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
 * Full Hero Ambient Rose Petals Animation for LAHZAH
 * Covers the entire hero section with authentic drifting rose petals
 * in brand burgundy and dusty-rose tones.
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
      {/* 1. AMBIENT CONTINUOUS FLOATING ROSE PETALS (Full Hero Coverage)    */}
      {/* =================================================================== */}

      {/* Zone A: Upper-Right Sky & Above Headline */}
      <RosePetal
        shape="shape1"
        variant="burgundy"
        size={23}
        rotation={15}
        className="animate-petal-breeze-1"
        style={{
          top: "6%",
          right: "12%",
          animationDuration: "14s",
          animationDelay: "0s",
        }}
      />

      {/* Zone B: Headline Right Margin */}
      <RosePetal
        shape="shape2"
        variant="dustyRose"
        size={19}
        rotation={-25}
        className="animate-petal-breeze-2"
        style={{
          top: "22%",
          right: "2%",
          animationDuration: "16s",
          animationDelay: "1.8s",
        }}
      />

      {/* Zone C: Headline Lower-Right near CTA */}
      <RosePetal
        shape="shape3"
        variant="mutedRose"
        size={20}
        rotation={38}
        className="animate-petal-breeze-3"
        style={{
          top: "44%",
          right: "16%",
          animationDuration: "12s",
          animationDelay: "3.5s",
        }}
      />

      {/* Zone D: Below CTA / Near Feature Badges (Right side) */}
      <RosePetal
        shape="shape1"
        variant="wine"
        size={22}
        rotation={-14}
        className="animate-petal-breeze-4"
        style={{
          top: "72%",
          right: "8%",
          animationDuration: "18s",
          animationDelay: "2.2s",
        }}
      />

      {/* Zone E: Lower Right Margin */}
      <RosePetal
        shape="shape2"
        variant="burgundy"
        size={18}
        rotation={28}
        className="animate-petal-breeze-1"
        style={{
          top: "89%",
          right: "18%",
          animationDuration: "15s",
          animationDelay: "4.8s",
        }}
      />

      {/* Zone F: Upper Center (Open space between columns) */}
      <RosePetal
        shape="shape1"
        variant="wine"
        size={24}
        rotation={-32}
        className="animate-petal-breeze-2"
        style={{
          top: "10%",
          left: "49%",
          animationDuration: "15s",
          animationDelay: "1.2s",
        }}
      />

      {/* Zone G: Mid Center (Between headline and invitation card) */}
      <RosePetal
        shape="shape3"
        variant="dustyRose"
        size={21}
        rotation={22}
        className="animate-petal-breeze-3"
        style={{
          top: "38%",
          left: "44%",
          animationDuration: "13s",
          animationDelay: "2.6s",
        }}
      />

      {/* Zone H: Mid-Lower Center */}
      <RosePetal
        shape="shape2"
        variant="mutedRose"
        size={19}
        rotation={-18}
        className="animate-petal-breeze-4"
        style={{
          top: "64%",
          left: "46%",
          animationDuration: "17s",
          animationDelay: "5.1s",
        }}
      />

      {/* Zone I: Bottom Center */}
      <RosePetal
        shape="shape1"
        variant="burgundy"
        size={20}
        rotation={30}
        className="animate-petal-breeze-1"
        style={{
          top: "85%",
          left: "48%",
          animationDuration: "14s",
          animationDelay: "3.1s",
        }}
      />

      {/* Zone J: Upper Left (Above invitation flatlay) */}
      <RosePetal
        shape="shape2"
        variant="dustyRose"
        size={22}
        rotation={-20}
        className="animate-petal-breeze-2"
        style={{
          top: "7%",
          left: "14%",
          animationDuration: "16s",
          animationDelay: "0.8s",
        }}
      />

      {/* Zone K: Far Left Margin (Beside invitation) */}
      <RosePetal
        shape="shape3"
        variant="wine"
        size={19}
        rotation={42}
        className="animate-petal-breeze-3"
        style={{
          top: "25%",
          left: "3%",
          animationDuration: "12.5s",
          animationDelay: "2.1s",
        }}
      />

      {/* Zone L: Lower Left Margin (Beside envelope) */}
      <RosePetal
        shape="shape1"
        variant="burgundy"
        size={23}
        rotation={-28}
        className="animate-petal-breeze-4"
        style={{
          top: "68%",
          left: "7%",
          animationDuration: "17.5s",
          animationDelay: "4.2s",
        }}
      />

      {/* Zone M: Bottom Left Base */}
      <RosePetal
        shape="shape2"
        variant="mutedRose"
        size={20}
        rotation={16}
        className="animate-petal-breeze-2"
        style={{
          top: "90%",
          left: "19%",
          animationDuration: "15.5s",
          animationDelay: "1.5s",
        }}
      />

      {/* =================================================================== */}
      {/* 2. REVEALED CELEBRATION PETALS (Drifts gently on envelope hover)    */}
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
          size={22}
          rotation={35}
          className="animate-petal-breeze-1"
          style={{
            top: "32%",
            left: "38%",
            animationDuration: "11s",
            animationDelay: "0.3s",
          }}
        />

        {/* Celebration Petal B: Floats above envelope opening */}
        <RosePetal
          shape="shape1"
          variant="dustyRose"
          size={20}
          rotation={-15}
          className="animate-petal-breeze-2"
          style={{
            top: "18%",
            left: "26%",
            animationDuration: "10s",
            animationDelay: "0.6s",
          }}
        />

        {/* Celebration Petal C: Drifts across center toward headline */}
        <RosePetal
          shape="shape2"
          variant="wine"
          size={21}
          rotation={25}
          className="animate-petal-breeze-3"
          style={{
            top: "52%",
            right: "32%",
            animationDuration: "13s",
            animationDelay: "0.9s",
          }}
        />

        {/* Celebration Petal D: Soft Rose Petal lower center */}
        <RosePetal
          shape="shape1"
          variant="dustyRose"
          size={19}
          rotation={-22}
          className="animate-petal-breeze-4"
          style={{
            top: "76%",
            left: "36%",
            animationDuration: "12s",
            animationDelay: "1.2s",
          }}
        />
      </div>
    </div>
  );
}
