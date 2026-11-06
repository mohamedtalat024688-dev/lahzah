"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";
import { MusicConfig } from "@/lib/validations/event";

interface BackgroundMusicProps {
  musicConfig?: MusicConfig | null;
  accentColor?: string;
  isLight?: boolean;
  autoPlayTriggered?: boolean;
}

export default function BackgroundMusic({
  musicConfig,
  accentColor = "#C5A880",
  isLight = false,
  autoPlayTriggered = false,
}: BackgroundMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // If music is not enabled in config, don't render audio
  const isEnabled = musicConfig?.enabled !== false;
  // If trackUrl is provided, use it; otherwise use a gentle ambient fallback
  const trackUrl = musicConfig?.trackUrl || "https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1110.mp3";

  // Initialize Audio element
  useEffect(() => {
    if (!isEnabled || typeof window === "undefined") return;

    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setAudioError(true);
      setIsPlaying(false);
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audioRef.current = null;
    };
  }, [trackUrl, isEnabled]);

  // Handle Autoplay triggered by user interaction (e.g. opening the invitation)
  useEffect(() => {
    if (autoPlayTriggered && audioRef.current && !isPlaying && !audioError && musicConfig?.allowAutoplay !== false) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay rejected by browser policy; wait for manual user click
            setIsPlaying(false);
          });
      }
    }
  }, [autoPlayTriggered, isPlaying, audioError, musicConfig?.allowAutoplay]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || audioError) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying, audioError]);

  const toggleMute = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!audioRef.current) return;

      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    },
    [isMuted]
  );

  if (!isEnabled || audioError) return null;

  return (
    <div className="fixed top-5 left-5 z-40">
      <div
        className={`flex items-center gap-2 p-1.5 pr-3 rounded-full backdrop-blur-md border shadow-md transition-all ${
          isLight
            ? "bg-[#FAF8F5]/90 border-[#E0D6C3] text-[#786C5E]"
            : "bg-[#141210]/90 border-[#2E2924] text-[#C5A880]"
        }`}
      >
        <button
          onClick={togglePlay}
          type="button"
          title={isPlaying ? "إيقاف الموسيقى مؤقتًا" : "تشغيل الموسيقى"}
          aria-label={isPlaying ? "إيقاف الموسيقى مؤقتًا" : "تشغيل الموسيقى"}
          className="flex items-center gap-2 text-xs font-medium cursor-pointer"
        >
          {isPlaying ? (
            <div className="flex items-center gap-0.5 h-3.5 px-0.5">
              <span className="w-0.5 h-3 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: "0ms" }} />
              <span className="w-0.5 h-4 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: "150ms" }} />
              <span className="w-0.5 h-2 rounded-full animate-bounce" style={{ backgroundColor: accentColor, animationDelay: "300ms" }} />
            </div>
          ) : (
            <Music className="w-3.5 h-3.5 opacity-70" />
          )}
          <span className="hidden sm:inline text-[11px]">
            {isPlaying ? "الموسيقى تعمل" : "الموسيقى"}
          </span>
        </button>

        {isPlaying && (
          <button
            onClick={toggleMute}
            type="button"
            title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
            aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" style={{ color: accentColor }} />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

