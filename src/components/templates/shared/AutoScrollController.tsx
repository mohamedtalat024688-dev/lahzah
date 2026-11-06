"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ArrowDown, Pause } from "lucide-react";

interface AutoScrollControllerProps {
  accentColor?: string;
  isLight?: boolean;
}

export default function AutoScrollController({
  accentColor = "#C5A880",
  isLight = false,
}: AutoScrollControllerProps) {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const animationFrameId = useRef<number | null>(null);

  // Listen for prefers-reduced-motion changes
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    setIsScrolling(false);
  }, []);

  const startAutoScroll = useCallback(() => {
    if (isReducedMotion) return;

    setIsScrolling(true);

    const scrollStep = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 5) {
        // Reached the bottom
        stopAutoScroll();
        return;
      }

      // Smooth calm reading speed (~1 pixel per frame)
      window.scrollBy({ top: 1, behavior: "auto" });
      animationFrameId.current = requestAnimationFrame(scrollStep);
    };

    animationFrameId.current = requestAnimationFrame(scrollStep);
  }, [isReducedMotion, stopAutoScroll]);

  const toggleAutoScroll = () => {
    if (isScrolling) {
      stopAutoScroll();
    } else {
      startAutoScroll();
    }
  };

  // Passive listeners to instantly abort auto-scroll on manual user intervention
  useEffect(() => {
    if (!isScrolling) return;

    const handleUserInteraction = () => {
      stopAutoScroll();
    };

    const options = { passive: true };
    window.addEventListener("touchstart", handleUserInteraction, options);
    window.addEventListener("wheel", handleUserInteraction, options);
    window.addEventListener("keydown", handleUserInteraction, options);
    window.addEventListener("mousedown", handleUserInteraction, options);

    return () => {
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("wheel", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("mousedown", handleUserInteraction);
    };
  }, [isScrolling, stopAutoScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  if (isReducedMotion) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40">
      <button
        onClick={toggleAutoScroll}
        type="button"
        title={isScrolling ? "إيقاف التمرير التلقائي" : "بدء التمرير التلقائي لقراءة الدعوة"}
        aria-label={isScrolling ? "إيقاف التمرير التلقائي" : "بدء التمرير التلقائي"}
        className={`px-3 py-2 rounded-full backdrop-blur-md border shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
          isLight
            ? "bg-[#FAF8F5]/90 border-[#E0D6C3] text-[#786C5E] hover:text-[#1C1917]"
            : "bg-[#141210]/90 border-[#2E2924] text-[#C5A880] hover:text-[#FAF8F5]"
        }`}
      >
        {isScrolling ? (
          <>
            <Pause className="w-3.5 h-3.5 animate-pulse text-amber-500" />
            <span className="hidden sm:inline">إيقاف التمرير</span>
          </>
        ) : (
          <>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" style={{ color: accentColor }} />
            <span className="hidden sm:inline">تمرير تلقائي</span>
          </>
        )}
      </button>
    </div>
  );
}
