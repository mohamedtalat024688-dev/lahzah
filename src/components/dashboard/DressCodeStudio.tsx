"use client";

import React, { useState } from "react";
import {
  Shirt,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
  X,
  Ban,
  Palette,
} from "lucide-react";
import { DressCode } from "@/lib/validations/event";

interface DressCodeStudioProps {
  eventId: string;
  initialDressCode: DressCode | null;
  onSaveSuccess?: (updated: DressCode) => void;
}

const STYLE_PRESETS: Array<{
  id: string;
  name: string;
  title: string;
  description: string;
  preferred: string[];
  prohibited: string[];
}> = [
  {
    id: "saudi-formal",
    name: "الزي السعودي الرسمي (ثوب وبشت)",
    title: "الزي الرسمي السعودي (بشت وثوب رسمي)",
    description: "يسعدنا ويشرفنا حضوركم بالزي السعودي الرسمي الكامل (الثوب والبشت) لمشاركتنا أبهى ليالي العمر.",
    preferred: ["#1C1B1A", "#8B6B23", "#D4AF37", "#E0D5C1"],
    prohibited: ["#FF0000", "#FFFF00"],
  },
  {
    id: "black-tie",
    name: "سهرة راقية (Black Tie)",
    title: "زي السهرة الفاخر (Black Tie)",
    description: "نتشرف بحضوركم ببدلات السهرة الرسمية والفساتين الراقية.",
    preferred: ["#1C1B1A", "#1B2A4A", "#5C131D", "#D4AF37"],
    prohibited: ["#FFFFFF", "#FAF8F5"],
  },
  {
    id: "pastel-elegance",
    name: "ألوان الباستيل الناعمة",
    title: "ألوان الباستيل الهادئة والمبهجة",
    description: "نرجو من ضيوفنا الكرام مشاركتنا ألوان الفرح بدرجات الباستيل الهادئة والمبهجة.",
    preferred: ["#E8B4B8", "#D1C4E9", "#B2DFDB", "#FFE0B2"],
    prohibited: ["#FFFFFF", "#FAF8F5"],
  },
];

export default function DressCodeStudio({
  eventId,
  initialDressCode,
  onSaveSuccess,
}: DressCodeStudioProps) {
  const [title, setTitle] = useState(initialDressCode?.title || "الزي الرسمي الأنيق");
  const [description, setDescription] = useState(
    initialDressCode?.description || "يسعدنا حضوركم وتشريفكم بأبهى حلة لمشاركتنا فرحة العمر."
  );
  const [preferredColors, setPreferredColors] = useState<string[]>(
    initialDressCode?.preferredColors || ["#1B2A4A", "#D4AF37", "#5C131D"]
  );
  const [prohibitedColors, setProhibitedColors] = useState<string[]>(
    initialDressCode?.prohibitedColors || ["#FFFFFF", "#FAF8F5"]
  );

  const [customPreferred, setCustomPreferred] = useState("#D4AF37");
  const [customProhibited, setCustomProhibited] = useState("#FFFFFF");

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Check white/ivory bridal reservation status
  const isWhiteProhibited =
    prohibitedColors.includes("#FFFFFF") ||
    prohibitedColors.includes("الأبيض") ||
    prohibitedColors.includes("#FAF8F5");

  const handleApplyPreset = (preset: typeof STYLE_PRESETS[0]) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setPreferredColors([...preset.preferred]);
    setProhibitedColors([...preset.prohibited]);
    setStatus(null);
  };

  const handleToggleBrideWhiteExclusivity = () => {
    if (isWhiteProhibited) {
      setProhibitedColors((prev) =>
        prev.filter((c) => c !== "#FFFFFF" && c !== "#FAF8F5" && c !== "الأبيض" && c !== "السكري")
      );
    } else {
      setProhibitedColors((prev) => Array.from(new Set([...prev, "#FFFFFF", "#FAF8F5"])));
    }
    setStatus(null);
  };

  const handleAddPreferred = (color: string) => {
    if (!preferredColors.includes(color) && preferredColors.length < 8) {
      setPreferredColors((prev) => [...prev, color]);
      setStatus(null);
    }
  };

  const handleRemovePreferred = (color: string) => {
    setPreferredColors((prev) => prev.filter((c) => c !== color));
    setStatus(null);
  };

  const handleAddProhibited = (color: string) => {
    if (!prohibitedColors.includes(color) && prohibitedColors.length < 8) {
      setProhibitedColors((prev) => [...prev, color]);
      setStatus(null);
    }
  };

  const handleRemoveProhibited = (color: string) => {
    setProhibitedColors((prev) => prev.filter((c) => c !== color));
    setStatus(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);

    const payload: DressCode = {
      title: title.trim(),
      description: description.trim() || null,
      preferredColors,
      prohibitedColors,
      imageUrl: null,
    };

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dressCode: payload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل حفظ إعدادات الزي");
      }

      setStatus({ type: "success", text: "تم حفظ قواعد الزي والألوان بنجاح! ✨" });
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
    <div className="space-y-6" data-testid="dress-code-studio">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#790D20] mb-1">
            <Shirt className="w-4 h-4" />
            <span>قواعد وألوان الزي (Dress Code Studio)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#390E19]">
            تخصيص قواعد اللباس وألوان الحضور
          </h2>
          <p className="text-xs text-[#8B7778] mt-1">
            وجّه ضيوفك لاختيار الألوان المتناغمة مع ثيم الزفاف، واستثنِ الألوان المحجوزة للعروس.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {status && (
            <div
              data-testid="dresscode-save-status"
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
            data-testid="save-dresscode-btn"
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
                <span>حفظ قواعد الزي</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Style Presets */}
      <div className="p-5 rounded-2xl bg-[#FAF6F2] border border-[#EFE4DC] space-y-3">
        <span className="text-xs font-bold text-[#390E19] block">
          نماذج سريعة جاهزة لقواعد الزي:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {STYLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              data-testid={`preset-dresscode-${preset.id}`}
              onClick={() => handleApplyPreset(preset)}
              className="p-3.5 min-h-[44px] rounded-xl bg-[#FFFDFC] border border-[#EFE4DC] hover:border-[#790D20] text-right transition-all flex flex-col justify-between gap-2 shadow-sm"
            >
              <div>
                <span className="text-xs font-bold text-[#390E19] block">{preset.name}</span>
                <span className="text-[11px] text-[#8B7778] line-clamp-1">{preset.title}</span>
              </div>
              <div className="flex items-center gap-1">
                {preset.preferred.map((hex, i) => (
                  <span
                    key={i}
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bride White Exclusivity Highlight Box */}
      <div
        data-testid="bride-white-exclusivity-card"
        className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isWhiteProhibited
            ? "bg-[#FAF3E5] border-[#D6B77A]/60"
            : "bg-[#FFFDFC] border-[#EFE4DC]"
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#790D20]/10 text-[#790D20] flex items-center justify-center shrink-0">
            👰
          </div>
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-[#390E19] flex items-center gap-2">
              <span>تخصيص اللون الأبيض والعاجي للعروس حصراً</span>
              {isWhiteProhibited && (
                <span className="px-2 py-0.5 rounded-full bg-[#790D20] text-white text-[10px] font-bold">
                  مفعّل في الدعوة
                </span>
              )}
            </h4>
            <p className="text-xs text-[#8B7778]">
              تنبيه الضيوف الكرام بلباقة بعدم ارتداء درجات الأبيض أو العاجي حتى تتفرد العروس بإطلالتها الخاصة.
            </p>
          </div>
        </div>

        <button
          type="button"
          data-testid="toggle-bride-white-btn"
          onClick={handleToggleBrideWhiteExclusivity}
          className={`min-h-[44px] px-5 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm ${
            isWhiteProhibited
              ? "bg-[#790D20] text-white hover:bg-[#390E19]"
              : "bg-[#FFFDFC] text-[#790D20] border border-[#790D20] hover:bg-[#790D20]/5"
          }`}
        >
          {isWhiteProhibited ? "إلغاء استثناء الأبيض" : "تفعيل استثناء الأبيض للعروس"}
        </button>
      </div>

      {/* Main Form Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Texts */}
        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-[#390E19] flex items-center gap-2">
            <Shirt className="w-4 h-4 text-[#790D20]" />
            <span>عنوان وتوجيهات الزي</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-[#8B7778] mb-1.5">
              عنوان اللباس (يظهر في كرت الدعوة) *
            </label>
            <input
              type="text"
              data-testid="dresscode-title-input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setStatus(null);
              }}
              placeholder="الزي الرسمي الفاخر / Black Tie"
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/40 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#8B7778] mb-1.5">
              وصف وتفاصيل التوجيه (اختياري)
            </label>
            <textarea
              rows={3}
              data-testid="dresscode-desc-input"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setStatus(null);
              }}
              placeholder="نرجو تشريفنا بأبهى إطلالة تليق بهذه المناسبة السعيدة..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/40 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
            />
          </div>
        </div>

        {/* Color Management */}
        <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm space-y-6">
          {/* Section 1: Preferred Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#2E6827] flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                <span>الألوان المفضلة والمقترحة للحضور:</span>
              </span>
              <span className="text-[11px] text-[#8B7778]">{preferredColors.length}/8</span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {preferredColors.map((col, idx) => (
                <span
                  key={idx}
                  data-testid={`preferred-chip-${idx}`}
                  className="px-3 py-1.5 min-h-[44px] rounded-full text-xs font-mono font-semibold border flex items-center gap-2 shadow-xs"
                  style={{ backgroundColor: `${col}15`, borderColor: col, color: col }}
                >
                  <span
                    className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                    style={{ backgroundColor: col }}
                  />
                  <span>{col}</span>
                  <button
                    type="button"
                    aria-label={`إزالة اللون ${col}`}
                    onClick={() => handleRemovePreferred(col)}
                    className="w-8 h-8 -mr-1.5 rounded-full hover:bg-black/10 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Preferred */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={customPreferred}
                onChange={(e) => setCustomPreferred(e.target.value)}
                className="w-9 h-9 rounded-lg border border-[#EFE4DC] cursor-pointer p-0.5 bg-white"
              />
              <button
                type="button"
                data-testid="add-preferred-color-btn"
                onClick={() => handleAddPreferred(customPreferred)}
                disabled={preferredColors.length >= 8}
                className="px-3 py-1.5 min-h-[44px] rounded-full bg-[#FAF6F2] border border-[#EFE4DC] hover:border-[#2E6827] text-xs font-medium text-[#2E6827] flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة لون مفضل ({customPreferred})</span>
              </button>
            </div>
          </div>

          <div className="border-t border-[#F5EDE6]" />

          {/* Section 2: Prohibited Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#9E1C1C] flex items-center gap-1.5">
                <Ban className="w-3.5 h-3.5" />
                <span>الألوان المستثناة / غير المرغوبة (تجنب ارتدائها):</span>
              </span>
              <span className="text-[11px] text-[#8B7778]">{prohibitedColors.length}/8</span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {prohibitedColors.length === 0 ? (
                <span className="text-[11px] text-[#8B7778] italic">
                  لا توجد ألوان مستثناة حالياً (كافة الألوان مرحب بها)
                </span>
              ) : (
                prohibitedColors.map((col, idx) => (
                  <span
                    key={idx}
                    data-testid={`prohibited-chip-${idx}`}
                    className="px-3 py-1.5 min-h-[44px] rounded-full text-xs font-mono font-semibold border border-[#F8B4B4] bg-[#FDF2F2] text-[#9E1C1C] flex items-center gap-2 shadow-xs"
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: col }}
                    />
                    <span>{col === "#FFFFFF" ? "أبيض (العروس)" : col === "#FAF8F5" ? "عاجي (العروس)" : col}</span>
                    <button
                      type="button"
                      aria-label={`إزالة اللون المستثنى ${col}`}
                      onClick={() => handleRemoveProhibited(col)}
                      className="w-8 h-8 -mr-1.5 rounded-full hover:bg-red-100 flex items-center justify-center cursor-pointer transition-colors text-[#9E1C1C] shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Add Custom Prohibited */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={customProhibited}
                onChange={(e) => setCustomProhibited(e.target.value)}
                className="w-9 h-9 rounded-lg border border-[#EFE4DC] cursor-pointer p-0.5 bg-white"
              />
              <button
                type="button"
                data-testid="add-prohibited-color-btn"
                onClick={() => handleAddProhibited(customProhibited)}
                disabled={prohibitedColors.length >= 8}
                className="px-3 py-1.5 min-h-[44px] rounded-full bg-[#FAF6F2] border border-[#EFE4DC] hover:border-[#9E1C1C] text-xs font-medium text-[#9E1C1C] flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة لون مستثنى ({customProhibited})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
