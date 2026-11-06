"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Music,
  Play,
  Pause,
  ShieldCheck,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { VERIFIED_ROYALTY_FREE_TRACKS, MusicTrack } from "@/lib/musicCatalog";
import { MusicConfig } from "@/lib/validations/event";

interface MusicStudioProps {
  eventId: string;
  initialMusicConfig: MusicConfig | null | undefined;
  onSaveSuccess?: (updated: MusicConfig) => void;
}

export default function MusicStudio({
  eventId,
  initialMusicConfig,
  onSaveSuccess,
}: MusicStudioProps) {
  const [enabled, setEnabled] = useState<boolean>(initialMusicConfig?.enabled ?? true);
  const [selectedTrackUrl, setSelectedTrackUrl] = useState<string>(
    initialMusicConfig?.trackUrl || VERIFIED_ROYALTY_FREE_TRACKS[0].url
  );
  const [title, setTitle] = useState<string>(
    initialMusicConfig?.title || VERIFIED_ROYALTY_FREE_TRACKS[0].title
  );
  const [allowAutoplay, setAllowAutoplay] = useState<boolean>(
    initialMusicConfig?.allowAutoplay ?? true
  );
  const [customUrl, setCustomUrl] = useState<string>("");

  // In-Studio Audio Preview Player State
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current = null;
      }
    };
  }, []);

  const handleTogglePreview = (track: MusicTrack) => {
    if (playingTrackId === track.id) {
      if (audioPreviewRef.current) {
        audioPreviewRef.current.pause();
      }
      setPlayingTrackId(null);
      return;
    }

    if (audioPreviewRef.current) {
      audioPreviewRef.current.pause();
    }

    const audio = new Audio(track.url);
    audio.volume = 0.5;
    audioPreviewRef.current = audio;

    audio.onended = () => setPlayingTrackId(null);
    audio.onerror = () => {
      alert("تعذر تشغيل المعاينة الصوتية للمقطوعة.");
      setPlayingTrackId(null);
    };

    audio
      .play()
      .then(() => setPlayingTrackId(track.id))
      .catch(() => setPlayingTrackId(null));
  };

  const handleSelectTrack = (track: MusicTrack) => {
    setSelectedTrackUrl(track.url);
    setTitle(track.title);
    setStatus(null);
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    setSelectedTrackUrl(customUrl.trim());
    setTitle("مقطع صوتي مخصص");
    setStatus(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);

    const payload: MusicConfig = {
      enabled,
      trackUrl: selectedTrackUrl || null,
      title: title || null,
      allowAutoplay,
    };

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          musicConfig: payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل حفظ إعدادات الموسيقى");
      }

      setStatus({ type: "success", text: "تم حفظ إعدادات الموسيقى بنجاح! ✨" });
      if (onSaveSuccess) {
        onSaveSuccess(payload);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الحفظ";
      setStatus({ type: "error", text: `${message} (تم الاحتفاظ ببياناتك لإعادة المحاولة)` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="music-studio">
      {/* Studio Banner */}
      <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#790D20] mb-1">
            <Music className="w-4 h-4" />
            <span>الموسيقى والخلفية الصوتية (Music Configuration Studio)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#390E19]">
            الموسيقى التفاعلية لبطاقة الدعوة
          </h2>
          <p className="text-xs text-[#8B7778] mt-1">
            اختر مقطوعة موسيقية راقية لتعمل تلقائياً عند فتح الضيف للدعوة مع تحكم كامل بالصوت والإيقاف.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {status && (
            <div
              data-testid="music-save-status"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                status.type === "success"
                  ? "bg-[#F0F7EE] text-[#2E6827] border border-[#C5DEC0]"
                  : "bg-[#FDF2F2] text-[#9E1C1C] border border-[#F8B4B4]"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-3.5 h-3.5 text-[#5B9C51]" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-[#E02424]" />
              )}
              <span>{status.text}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving}
            data-testid="save-music-btn"
            className="min-h-[44px] px-6 py-2.5 rounded-full text-xs font-bold bg-[#790D20] text-white hover:bg-[#390E19] transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>حفظ إعدادات الموسيقى</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Licensing Assurance Box */}
      <div className="p-4 rounded-2xl bg-[#F0F7EE] border border-[#C5DEC0] text-[#2E6827] text-xs flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-[#5B9C51] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="block font-bold">مكتبة صوتية مرخصة تجارياً وقانونياً بالكامل:</strong>
          <span>
            جميع المقطوعات المدرجة أدناه خاضعة لرخصة الاستخدام التجاري المجاني الخالي من الحقوق
            (Free Commercial License)، ومصرح باستخدامها قانونياً في بطاقات الدعوة والويب دون قيود ملكية فكرية.
          </span>
        </div>
      </div>

      {/* Main Settings Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Toggle 1: Enable / Disable Music */}
        <div
          data-testid="music-enabled-toggle-card"
          className="p-5 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm flex items-center justify-between gap-4"
        >
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#390E19] block">
              تفعيل الخلفية الموسيقية في الدعوة
            </span>
            <span className="text-[11px] text-[#8B7778]">
              إظهار مشغل الصوت العائم والأزرار لضيوف الحفل
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              data-testid="music-enabled-checkbox"
              checked={enabled}
              onChange={(e) => {
                setEnabled(e.target.checked);
                setStatus(null);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#790D20]"></div>
          </label>
        </div>

        {/* Toggle 2: Autoplay on Open */}
        <div
          data-testid="music-autoplay-toggle-card"
          className="p-5 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm flex items-center justify-between gap-4"
        >
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-[#390E19] block">
              بدء التشغيل التلقائي عند فتح الدعوة
            </span>
            <span className="text-[11px] text-[#8B7778]">
              يبدأ العزف فور ضغط الضيف على زر فتح الدعوة
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer min-h-[44px]">
            <input
              type="checkbox"
              data-testid="music-autoplay-checkbox"
              checked={allowAutoplay}
              onChange={(e) => {
                setAllowAutoplay(e.target.checked);
                setStatus(null);
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#790D20]"></div>
          </label>
        </div>
      </div>

      {/* Verified Tracks Catalog */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#390E19]">
            المقطوعات المعتمدة والمرخصة ({VERIFIED_ROYALTY_FREE_TRACKS.length})
          </span>
          <span className="text-[11px] text-[#8B7778]">
            اضغط على زر التشغيل للاستماع والمعاينة قبل الاختيار
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {VERIFIED_ROYALTY_FREE_TRACKS.map((track) => {
            const isSelected = selectedTrackUrl === track.url;
            const isAudioPlaying = playingTrackId === track.id;

            return (
              <div
                key={track.id}
                data-testid={`music-track-card-${track.id}`}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 shadow-sm ${
                  isSelected
                    ? "bg-[#FAF6F2] border-[#790D20] ring-1 ring-[#790D20]/40"
                    : "bg-[#FFFDFC] border-[#EFE4DC] hover:border-[#D8C7BC]"
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-bold text-[#390E19]">{track.title}</h4>
                      <span className="text-[11px] text-[#8B7778]">{track.artist}</span>
                    </div>

                    {isSelected && (
                      <span className="px-2.5 py-0.5 rounded-full bg-[#790D20] text-white text-[10px] font-bold shrink-0">
                        المقطوعة المختارة
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#6F5E5C] leading-relaxed">
                    {track.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {track.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-[#F3ECE6] text-[10px] font-medium text-[#790D20]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* License Tag & Preview Controls */}
                <div className="border-t border-[#F5EDE6] pt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[10px] text-[#2E6827] font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5B9C51]" />
                    <span>مرخص تجارياً مجاناً</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      data-testid={`preview-play-btn-${track.id}`}
                      onClick={() => handleTogglePreview(track)}
                      className={`min-h-[44px] px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer ${
                        isAudioPlaying
                          ? "bg-[#390E19] text-white"
                          : "bg-[#FAF6F2] text-[#390E19] border border-[#EFE4DC] hover:bg-white"
                      }`}
                    >
                      {isAudioPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 fill-current" />
                          <span>إيقاف المعاينة</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>استماع</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      data-testid={`select-track-btn-${track.id}`}
                      onClick={() => handleSelectTrack(track)}
                      disabled={isSelected}
                      className={`min-h-[44px] px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
                        isSelected
                          ? "bg-[#790D20] text-white cursor-default"
                          : "bg-white text-[#790D20] border border-[#790D20] hover:bg-[#790D20] hover:text-white"
                      }`}
                    >
                      <span>{isSelected ? "مفعلة بالدعوة ✓" : "اختيار للدعوة"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Audio URL Option */}
      <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#390E19]">
          <LinkIcon className="w-4 h-4 text-[#790D20]" />
          <span>استخدام رابط صوتي مخصص (Custom Audio URL)</span>
        </div>
        <p className="text-[11px] text-[#8B7778]">
          إذا كان لديك ملف صوتي مسجل خاص أو زفة خاصة مرفوعة على سيرفرك بصيغة MP3، يمكنك لصق الرابط المباشر هنا:
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="url"
            data-testid="custom-audio-url-input"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://your-domain.com/audio/wedding-song.mp3"
            className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/40 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20] dir-ltr text-left"
          />
          <button
            type="button"
            data-testid="apply-custom-audio-url-btn"
            onClick={handleApplyCustomUrl}
            className="w-full sm:w-auto px-5 py-2.5 min-h-[44px] rounded-xl bg-[#790D20] text-white text-xs font-bold hover:bg-[#390E19] transition-all shrink-0 cursor-pointer shadow-xs"
          >
            اعتماد الرابط المخصص
          </button>
        </div>

        {selectedTrackUrl && !VERIFIED_ROYALTY_FREE_TRACKS.some((t) => t.url === selectedTrackUrl) && (
          <div className="pt-1 text-[11px] text-[#2E6827] font-medium flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-[#5B9C51]" />
            <span>الرابط المخصص المعتمد حالياً: {selectedTrackUrl}</span>
          </div>
        )}
      </div>
    </div>
  );
}
