"use client";

import React, { useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Coffee,
  Sparkles,
  Utensils,
  Gift,
  Camera,
  Music,
  Heart,
  MapPin,
  Gem,
} from "lucide-react";
import { ScheduleItem } from "@/lib/validations/event";

interface ScheduleManagerProps {
  eventId: string;
  initialItems: ScheduleItem[];
  onSaveSuccess?: (updatedItems: ScheduleItem[]) => void;
}

const AVAILABLE_ICONS = [
  { id: "clock", label: "ساعة", icon: Clock },
  { id: "coffee", label: "استقبال وضيافة", icon: Coffee },
  { id: "sparkles", label: "زفة واحتفال", icon: Sparkles },
  { id: "utensils", label: "عشاء ووليمة", icon: Utensils },
  { id: "gift", label: "هدايا وتوزيعات", icon: Gift },
  { id: "camera", label: "تصوير وذكريات", icon: Camera },
  { id: "music", label: "موسيقى", icon: Music },
  { id: "heart", label: "مودة ومحبة", icon: Heart },
  { id: "gem", label: "خواتم ومجوهرات", icon: Gem },
  { id: "map-pin", label: "موقع", icon: MapPin },
];

const PRESET_STAGES = [
  { time: "08:00 م", title: "استقبال الضيوف الكرام", icon: "coffee", location: "البهو الرئيسي" },
  { time: "09:30 م", title: "مراسم الزفة المباركة", icon: "sparkles", location: "القاعة الكبرى" },
  { time: "10:30 م", title: "وليمة العشاء الفاخرة", icon: "utensils", location: "صالة الطعام" },
  { time: "11:30 م", title: "تقطيع كعكة الفرح", icon: "gift", location: "المنصة الرئيسية" },
  { time: "12:00 ص", title: "جلسة التصوير وتوديع الأحباب", icon: "camera", location: "قاعة التصوير" },
];

let stageCounter = 100;
function generateStageId(count: number): string {
  stageCounter += 1;
  return `stage-${count + 1}-${stageCounter}`;
}

export default function ScheduleManager({
  eventId,
  initialItems,
  onSaveSuccess,
}: ScheduleManagerProps) {
  const [items, setItems] = useState<ScheduleItem[]>(() =>
    initialItems && initialItems.length > 0 ? initialItems : []
  );
  const [savedItems, setSavedItems] = useState<ScheduleItem[]>(() =>
    initialItems && initialItems.length > 0 ? initialItems : []
  );
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const hasUnsavedChanges = JSON.stringify(items) !== JSON.stringify(savedItems);

  const handleAddItem = (preset?: typeof PRESET_STAGES[0]) => {
    const newItem: ScheduleItem = {
      id: generateStageId(items.length),
      time: preset?.time || "08:00 م",
      title: preset?.title || "فقرة جديدة",
      description: null,
      location: preset?.location || null,
      icon: preset?.icon || "clock",
    };
    setItems((prev) => [...prev, newItem]);
    setStatus(null);
  };

  const handleUpdateItem = (id: string, updates: Partial<ScheduleItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    setStatus(null);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setStatus(null);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === items.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;
    setItems(reordered);
    setStatus(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleItems: items,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل حفظ جدول الحفل");
      }

      setSavedItems(items);
      setStatus({ type: "success", text: "تم حفظ جدول الحفل بنجاح! ✨" });
      if (onSaveSuccess) {
        onSaveSuccess(items);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الحفظ";
      setStatus({ type: "error", text: `${message} (لم تفقد أي تعديلات)` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="schedule-manager-studio">
      {/* Studio Header */}
      <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#790D20] mb-1">
            <Clock className="w-4 h-4" />
            <span>جدول وتوقيت الحفل (Event Schedule)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#390E19]">
            إدارة فقرات ومحطات ليلة العمر
          </h2>
          <p className="text-xs text-[#8B7778] mt-1">
            حدد محطات الفرح بالساعة والمكان والأيقونة لإرشاد ضيوفك بوضوح في بطاقة الدعوة.
          </p>
        </div>

        {/* Action Button & Status */}
        <div className="flex flex-wrap items-center gap-3">
          {status && (
            <div
              data-testid="schedule-save-status"
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
            data-testid="save-schedule-btn"
            className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
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
                <span>{hasUnsavedChanges ? "حفظ التغييرات" : "تم الحفظ"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Stage Presets */}
      <div className="p-5 rounded-2xl bg-[#FAF6F2] border border-[#EFE4DC] space-y-3">
        <span className="text-xs font-bold text-[#390E19] block">
          إضافة سريعة من المحطات المألوفة للأعراس:
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_STAGES.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleAddItem(preset)}
              data-testid={`preset-stage-${idx}`}
              className="px-3.5 py-2 min-h-[44px] rounded-full bg-[#FFFDFC] border border-[#EFE4DC] hover:border-[#790D20] text-xs font-medium text-[#390E19] flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#790D20]" />
              <span>{preset.title}</span>
              <span className="text-[10px] text-[#8B7778] bg-[#F3ECE6] px-1.5 py-0.5 rounded">
                {preset.time}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Items List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="p-10 rounded-3xl bg-[#FFFDFC] border border-dashed border-[#D8C7BC] text-center space-y-3">
            <Clock className="w-8 h-8 mx-auto text-[#D8C7BC]" />
            <p className="text-sm font-semibold text-[#8B7778]">
              لم تقم بإضافة أي فقرات لجدول الحفل بعد
            </p>
            <button
              type="button"
              onClick={() => handleAddItem()}
              data-testid="add-first-stage-btn"
              className="px-5 py-2.5 min-h-[44px] rounded-full bg-[#790D20] text-white text-xs font-bold hover:bg-[#390E19] transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة أول محطة في الحفل</span>
            </button>
          </div>
        ) : (
          items.map((item, index) => {
            return (
              <div
                key={item.id}
                data-testid={`schedule-item-card-${index}`}
                className="p-5 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm space-y-4 transition-all"
              >
                {/* Header Row: Stage Number, Reorder, Delete */}
                <div className="flex items-center justify-between border-b border-[#F5EDE6] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FAF3E5] text-[#8B6B23] text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-[#390E19]">
                      {item.title || "فقرة بدون عنوان"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="تحريك لأعلى"
                      data-testid={`stage-move-up-${index}`}
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="p-2 min-h-[44px] min-w-[44px] rounded-lg border border-[#EFE4DC] text-[#8C7772] hover:text-[#390E19] hover:bg-[#FAF6F2] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="تحريك لأسفل"
                      data-testid={`stage-move-down-${index}`}
                      onClick={() => handleMove(index, "down")}
                      disabled={index === items.length - 1}
                      className="p-2 min-h-[44px] min-w-[44px] rounded-lg border border-[#EFE4DC] text-[#8C7772] hover:text-[#390E19] hover:bg-[#FAF6F2] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="حذف الفقرة"
                      data-testid={`stage-delete-${index}`}
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 min-h-[44px] min-w-[44px] rounded-lg border border-[#F5D8D8] text-[#9E1C1C] hover:bg-[#FDF2F2] flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Time Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8B7778] mb-1">
                      الوقت (مثال: 08:30 م) *
                    </label>
                    <input
                      type="text"
                      data-testid={`stage-time-input-${index}`}
                      value={item.time}
                      onChange={(e) => handleUpdateItem(item.id, { time: e.target.value })}
                      placeholder="09:00 م"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/40 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
                    />
                  </div>

                  {/* Title Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8B7778] mb-1">
                      عنوان الفقرة *
                    </label>
                    <input
                      type="text"
                      data-testid={`stage-title-input-${index}`}
                      value={item.title}
                      onChange={(e) => handleUpdateItem(item.id, { title: e.target.value })}
                      placeholder="مراسم الزفة المباركة"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/40 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
                    />
                  </div>

                  {/* Location Input */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8B7778] mb-1">
                      المكان أو الصالة (اختياري)
                    </label>
                    <input
                      type="text"
                      data-testid={`stage-location-input-${index}`}
                      value={item.location || ""}
                      onChange={(e) => handleUpdateItem(item.id, { location: e.target.value })}
                      placeholder="القاعة الكبرى"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/40 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
                    />
                  </div>

                  {/* Icon Selector */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#8B7778] mb-1">
                      رمز الفقرة
                    </label>
                    <select
                      data-testid={`stage-icon-select-${index}`}
                      value={item.icon || "clock"}
                      onChange={(e) => handleUpdateItem(item.id, { icon: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/40 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
                    >
                      {AVAILABLE_ICONS.map((ico) => (
                        <option key={ico.id} value={ico.id}>
                          {ico.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-[11px] font-bold text-[#8B7778] mb-1">
                    تفاصيل إضافية أو ملاحظات للضيوف (اختياري)
                  </label>
                  <input
                    type="text"
                    data-testid={`stage-description-input-${index}`}
                    value={item.description || ""}
                    onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                    placeholder="يرجى من الضيوف الكرام التواجد في بهو الاستقبال في الموعد المحدد"
                    className="w-full px-3.5 py-2 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/40 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
                  />
                </div>
              </div>
            );
          })
        )}

        {/* Add Another Stage Button */}
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => handleAddItem()}
            data-testid="add-new-stage-btn"
            className="w-full py-3.5 min-h-[44px] rounded-2xl border-2 border-dashed border-[#D8C7BC] hover:border-[#790D20] text-xs font-bold text-[#790D20] hover:bg-[#FFFDFC] flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة محطة جديدة إلى جدول الحفل</span>
          </button>
        )}
      </div>
    </div>
  );
}
