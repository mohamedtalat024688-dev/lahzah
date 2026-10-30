"use client";

import confetti from "canvas-confetti";

export function fireCelebrationConfetti(origin?: { x: number; y: number }) {
  if (typeof window === "undefined") return;

  const count = 40;
  const defaults = {
    origin: origin || { y: 0.7, x: 0.5 },
    colors: ["#790D20", "#390E19", "#D8B8B8", "#D6B77A", "#F1DEDF", "#FFF9F5"],
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 45,
    scalar: 0.8,
  });

  fire(0.2, {
    spread: 60,
    scalar: 1,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.7,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
