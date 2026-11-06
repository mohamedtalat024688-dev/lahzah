"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  Heart,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Lock,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import {
  VERIFIED_QURANIC_VERSES,
  PROPHETIC_DUAAS,
  CELEBRATION_PHRASES,
  parseWelcomePhrasing,
  serializeWelcomePhrasing,
  CulturalPhrasingData,
} from "@/lib/culturalPhrasing";

interface CulturalPhrasingSelectorProps {
  eventId: string;
  initialWelcomeMessage: string | null | undefined;
  onSaveSuccess?: (updatedData: CulturalPhrasingData) => void;
}

export default function CulturalPhrasingSelector({
  eventId,
  initialWelcomeMessage,
  onSaveSuccess,
}: CulturalPhrasingSelectorProps) {
  const [data, setData] = useState<CulturalPhrasingData>(() =>
    parseWelcomePhrasing(initialWelcomeMessage)
  );
  const [savedData, setSavedData] = useState<CulturalPhrasingData>(() =>
    parseWelcomePhrasing(initialWelcomeMessage)
  );

  const [activeCategory, setActiveCategory] = useState<"quran" | "duaa" | "celebration" | "custom">(
    () => {
      const parsed = parseWelcomePhrasing(initialWelcomeMessage);
      if (parsed.type === "duaa") return "duaa";
      if (parsed.type === "celebration") return "celebration";
      if (parsed.type === "custom") return "custom";
      return "quran";
    }
  );

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const hasUnsavedChanges = JSON.stringify(data) !== JSON.stringify(savedData);

  const handleSelectVerse = (verse: typeof VERIFIED_QURANIC_VERSES[0]) => {
    setData((prev) => ({
      ...prev,
      type: "quran",
      presetId: verse.id,
      text: verse.text,
      sourceLabel: `${verse.surah} - الآية ${verse.ayahNumber}`,
    }));
    setStatus(null);
  };

  const handleSelectDuaa = (duaa: typeof PROPHETIC_DUAAS[0]) => {
    setData((prev) => ({
      ...prev,
      type: "duaa",
      presetId: duaa.id,
      text: duaa.text,
      sourceLabel: duaa.title,
    }));
    setStatus(null);
  };

  const handleSelectCelebration = (phrase: typeof CELEBRATION_PHRASES[0]) => {
    setData((prev) => ({
      ...prev,
      type: "celebration",
      presetId: phrase.id,
      text: phrase.text,
      sourceLabel: phrase.title,
    }));
    setStatus(null);
  };

  const handleSetNone = () => {
    setData({
      type: "none",
      presetId: null,
      text: "",
      sourceLabel: null,
      customNote: data.customNote,
    });
    setStatus(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);

    const serialized = serializeWelcomePhrasing(data);

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          welcomeMessage: serialized,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "فشل حفظ نصوص الدعوة");
      }

      setSavedData(data);
      setStatus({ type: "success", text: "تم حفظ النص بنجاح! ✨" });
      if (onSaveSuccess) {
        onSaveSuccess(data);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الحفظ";
      setStatus({ type: "error", text: `${message} (تم الاحتفاظ بتعديلاتك)` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="cultural-phrasing-studio">
      {/* Studio Header */}
      <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#790D20] mb-1">
            <BookOpen className="w-4 h-4" />
            <span>نصوص الفرح والاستفتاح (Cultural & Religious Phrasing)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#390E19]">
            الآيات القرآنية، الأدعية المأثورة، وعبارات التهنئة
          </h2>
          <p className="text-xs text-[#8B7778] mt-1">
            اختر النص المبارك أو العبارة الترحيبية لتتصدر بطاقة دعوتكم. النصوص القرآنية موثقة ومحكمة بتشكيلها الكامل.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {status && (
            <div
              data-testid="cultural-save-status"
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
            disabled={isSaving || !hasUnsavedChanges}
            data-testid="save-cultural-phrasing-btn"
            className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              hasUnsavedChanges
                ? "bg-[#790D20] text-white hover:bg-[#390E19] cursor-pointer"
                : "bg-[#EFE4DC] text-[#8C7772] cursor-not-allowed opacity-70"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{hasUnsavedChanges ? "حفظ النص المختار" : "تم الحفظ"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          data-testid="category-quran-btn"
          onClick={() => setActiveCategory("quran")}
          className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeCategory === "quran"
              ? "bg-[#790D20] text-white shadow-xs"
              : "bg-[#FFFDFC] text-[#8C7772] hover:text-[#390E19] border border-[#EFE4DC]"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>آيات قرآنية كريمة (محكمة التشكيل)</span>
        </button>

        <button
          type="button"
          data-testid="category-duaa-btn"
          onClick={() => setActiveCategory("duaa")}
          className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeCategory === "duaa"
              ? "bg-[#790D20] text-white shadow-xs"
              : "bg-[#FFFDFC] text-[#8C7772] hover:text-[#390E19] border border-[#EFE4DC]"
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>أدعية نبوية مأثورة</span>
        </button>

        <button
          type="button"
          data-testid="category-celebration-btn"
          onClick={() => setActiveCategory("celebration")}
          className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeCategory === "celebration"
              ? "bg-[#790D20] text-white shadow-xs"
              : "bg-[#FFFDFC] text-[#8C7772] hover:text-[#390E19] border border-[#EFE4DC]"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>عبارات فرح وتهنئة عامة</span>
        </button>

        <button
          type="button"
          data-testid="category-none-btn"
          onClick={handleSetNone}
          className={`px-4 py-2 min-h-[44px] rounded-full text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            data.type === "none"
              ? "bg-[#FAF3E5] text-[#8B6B23] border border-[#D6B77A]"
              : "bg-[#FFFDFC] text-[#8C7772] hover:text-[#390E19] border border-[#EFE4DC]"
          }`}
        >
          <span>بدون نص استفتاحي</span>
        </button>
      </div>

      {/* Main Grid: Options on Right, Live Calligraphy Preview on Left */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Choices List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {activeCategory === "quran" && (
            <div className="space-y-3" data-testid="quran-verses-list">
              <div className="p-3.5 rounded-xl bg-[#FAF3E5] border border-[#D6B77A]/40 flex items-center gap-2 text-xs text-[#8B6B23]">
                <ShieldCheck className="w-4 h-4 text-[#8B6B23] shrink-0" />
                <span>
                  <strong>نصوص قرآنية محكمة:</strong> تم ضبطها ومراجعتها بالتشكيل الكامل من مصحف
                  مجمع الملك فهد، وهي ثابتة غير قابلة للتعديل صوناً لكتاب الله.
                </span>
              </div>

              {VERIFIED_QURANIC_VERSES.map((verse) => {
                const isSelected = data.type === "quran" && data.presetId === verse.id;
                return (
                  <div
                    key={verse.id}
                    data-testid={`quran-verse-card-${verse.id}`}
                    onClick={() => handleSelectVerse(verse)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? "bg-[#FAF6F2] border-[#790D20] ring-1 ring-[#790D20]/30 shadow-sm"
                        : "bg-[#FFFDFC] border-[#EFE4DC] hover:border-[#D8C7BC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#790D20] flex items-center gap-1.5">
                        <Lock className="w-3 h-3 text-[#790D20]" />
                        <span>
                          {verse.surah} • الآية {verse.ayahNumber}
                        </span>
                      </span>

                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-[#790D20] text-white text-[10px] font-bold">
                          المحدد حالياً
                        </span>
                      )}
                    </div>

                    <p className="font-serif text-base text-[#390E19] leading-loose text-right">
                      «{verse.text}»
                    </p>

                    <span className="text-[10px] text-[#8B7778] block text-left">
                      {verse.verifiedSource}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {activeCategory === "duaa" && (
            <div className="space-y-3" data-testid="prophetic-duaas-list">
              {PROPHETIC_DUAAS.map((duaa) => {
                const isSelected = data.type === "duaa" && data.presetId === duaa.id;
                return (
                  <div
                    key={duaa.id}
                    data-testid={`duaa-card-${duaa.id}`}
                    onClick={() => handleSelectDuaa(duaa)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? "bg-[#FAF6F2] border-[#790D20] ring-1 ring-[#790D20]/30 shadow-sm"
                        : "bg-[#FFFDFC] border-[#EFE4DC] hover:border-[#D8C7BC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#790D20]">{duaa.title}</span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-[#790D20] text-white text-[10px] font-bold">
                          المحدد حالياً
                        </span>
                      )}
                    </div>

                    <p className="font-serif text-base text-[#390E19] leading-loose text-right">
                      «{duaa.text}»
                    </p>

                    <span className="text-[10px] text-[#8B7778] block text-left">
                      {duaa.source}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {activeCategory === "celebration" && (
            <div className="space-y-3" data-testid="celebration-phrases-list">
              {CELEBRATION_PHRASES.map((phrase) => {
                const isSelected = data.type === "celebration" && data.presetId === phrase.id;
                return (
                  <div
                    key={phrase.id}
                    data-testid={`celebration-card-${phrase.id}`}
                    onClick={() => handleSelectCelebration(phrase)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? "bg-[#FAF6F2] border-[#790D20] ring-1 ring-[#790D20]/30 shadow-sm"
                        : "bg-[#FFFDFC] border-[#EFE4DC] hover:border-[#D8C7BC]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#790D20]">{phrase.title}</span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-[#790D20] text-white text-[10px] font-bold">
                          المحدد حالياً
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-[#390E19] leading-relaxed text-right">
                      «{phrase.text}»
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Optional Host Welcome Note */}
          <div className="p-5 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#390E19]">
              <MessageSquare className="w-4 h-4 text-[#790D20]" />
              <span>ملاحظة أو ترحيب إضافي خاص من العروسين (اختياري)</span>
            </div>
            <p className="text-[11px] text-[#8B7778]">
              يمكنك كتابة كلمة ترحيبية خاصة ومستقلة تماماً عن النص الديني تظهر للضيوف بأسلوبك الشخصي.
            </p>
            <textarea
              rows={2}
              data-testid="cultural-custom-note-input"
              value={data.customNote || ""}
              onChange={(e) => {
                setData((prev) => ({ ...prev, customNote: e.target.value.slice(0, 300) }));
                setStatus(null);
              }}
              placeholder="مثال: نسعد ونشرف بحضوركم الكريم لمشاركتنا فرحة العمر ونسأل الله أن يديم أفراحكم..."
              className="w-full px-4 py-2.5 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/30 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
            />
          </div>
        </div>

        {/* Live Calligraphy / Invitation Preview (5 cols) */}
        <div className="lg:col-span-5">
          <div
            data-testid="cultural-calligraphy-preview"
            className="sticky top-6 p-8 rounded-3xl bg-gradient-to-b from-[#FAF6F2] to-[#FFFDFC] border border-[#E0D6C3] shadow-md text-center space-y-6"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#D4AF37] block">
                معاينة النص في بطاقة الدعوة
              </span>
              <div className="w-12 h-px bg-[#D4AF37]/50 mx-auto" />
            </div>

            {/* Basmala Calligraphy Ornament */}
            {data.type !== "none" && (
              <div className="text-[#790D20] font-serif text-lg opacity-90 select-none">
                ﷽
              </div>
            )}

            {/* Rendered Text */}
            {data.type === "none" ? (
              <div className="py-8 text-xs text-[#8B7778] italic">
                (تم اختيار عدم تضمين نص استفتاحي)
              </div>
            ) : (
              <div className="space-y-3">
                <blockquote className="font-serif text-base sm:text-lg text-[#390E19] leading-loose">
                  «{data.text}»
                </blockquote>

                {data.sourceLabel && (
                  <span className="text-[11px] font-sans text-[#8B7778] block">
                    — {data.sourceLabel}
                  </span>
                )}
              </div>
            )}

            {/* Custom Note Preview if present */}
            {data.customNote && (
              <div className="pt-4 border-t border-[#EFE4DC] text-xs text-[#790D20] font-medium leading-relaxed">
                {data.customNote}
              </div>
            )}

            <div className="pt-2 text-[10px] text-[#8B7778]">
              يظهر هذا النص في مطلع بطاقة الدعوة بخط فاخر يناسب هوية القالب المختار
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
