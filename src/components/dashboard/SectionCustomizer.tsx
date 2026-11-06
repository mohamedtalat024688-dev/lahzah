"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  GripVertical,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Monitor,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
  Lock,
} from "lucide-react";
import {
  getTemplate,
  getTemplateSupportedSections,
  getTemplateDefaultSections,
  MASTER_SECTIONS_CATALOG,
  TemplateSectionId,
  TemplateSectionMeta,
} from "@/lib/templates";
import { SectionConfigItem } from "@/lib/validations/event";
import InvitationView from "../templates/InvitationView";

interface EventDataForCustomizer {
  id: string;
  slug: string;
  title: string;
  eventType: string;
  groomName: string;
  brideName: string;
  eventDate: string | Date;
  venueName: string;
  address: string;
  mapUrl?: string | null;
  welcomeMessage?: string | null;
  description?: string | null;
  coverImage?: string | null;
  templateId: string;
  isPaid: boolean;
  isPublished: boolean;
  packageTier: string;
  parsedCouplePhotos?: Array<{ id: string; url: string; caption?: string | null; order: number; isCover?: boolean }>;
  parsedMusicConfig?: { enabled: boolean; trackUrl?: string | null; title?: string | null; allowAutoplay: boolean; volume?: number; loop?: boolean } | null;
  parsedScheduleItems?: Array<{ id: string; time: string; title: string; description?: string | null; location?: string | null; icon?: string | null }>;
  parsedDressCode?: { title: string; description?: string | null; preferredColors?: string[]; prohibitedColors?: string[]; imageUrl?: string | null } | null;
  parsedSectionsConfig?: SectionConfigItem[];
  photos?: Array<{ id: string; url: string; guestName?: string | null; message?: string | null; status: string; createdAt: string | Date }>;
  rsvps?: Array<{ id: string; guestName: string; attendanceStatus: string; guestCount: number; createdAt: string }>;
}

interface SectionCustomizerProps {
  event: EventDataForCustomizer;
  onSaveSuccess?: () => void;
}

export default function SectionCustomizer({ event, onSaveSuccess }: SectionCustomizerProps) {
  const templateConfig = useMemo(() => getTemplate(event.templateId), [event.templateId]);
  const supportedSections = useMemo(
    () => getTemplateSupportedSections(event.templateId),
    [event.templateId]
  );

  // Initialize sections from event.parsedSectionsConfig or template defaults
  const initialSections = useMemo(() => {
    if (event.parsedSectionsConfig && event.parsedSectionsConfig.length > 0) {
      return [...event.parsedSectionsConfig].sort((a, b) => a.order - b.order);
    }
    return getTemplateDefaultSections(event.templateId);
  }, [event.parsedSectionsConfig, event.templateId]);

  const [sections, setSections] = useState<SectionConfigItem[]>(initialSections);
  const [originalSections, setOriginalSections] = useState<SectionConfigItem[]>(initialSections);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Detect unsaved changes
  const hasUnsavedChanges = useMemo(() => {
    return JSON.stringify(sections) !== JSON.stringify(originalSections);
  }, [sections, originalSections]);

  // Protect against accidental navigation with unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Sections that are currently not in the active list but are supported by the template
  const availableToAdd = useMemo(() => {
    const activeIds = new Set(sections.map((s) => s.id));
    return supportedSections.filter((s) => !activeIds.has(s.id));
  }, [sections, supportedSections]);

  // Reorder: Move Up
  const moveUp = (index: number) => {
    if (index <= 0) return;
    setSections((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  // Reorder: Move Down
  const moveDown = (index: number) => {
    if (index >= sections.length - 1) return;
    setSections((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  // Toggle Visibility
  const toggleVisibility = (id: string) => {
    const meta = MASTER_SECTIONS_CATALOG[id as TemplateSectionId];
    if (meta?.isRequired) return; // Cannot hide required sections (hero, rsvp)

    setSections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  // Remove Optional Section
  const removeSection = (id: string) => {
    const meta = MASTER_SECTIONS_CATALOG[id as TemplateSectionId];
    if (meta?.isRequired) return; // Cannot remove required sections

    setSections((prev) => {
      const next = prev.filter((item) => item.id !== id);
      return next.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
  };

  // Add Supported Section
  const addSection = (meta: TemplateSectionMeta) => {
    setSections((prev) => [
      ...prev,
      {
        id: meta.id,
        enabled: true,
        order: prev.length + 1,
      },
    ]);
  };

  // Reset to Template Default Order
  const resetToDefault = () => {
    const defaults = getTemplateDefaultSections(event.templateId);
    setSections(defaults);
    setSaveMessage({
      type: "success",
      text: "تمت استعادة الترتيب الافتراضي للقالب. يرجى الضغط على حفظ لتأكيد التغييرات.",
    });
    setTimeout(() => setSaveMessage(null), 4000);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    setSections((prev) => {
      const next = [...prev];
      const [draggedItem] = next.splice(draggedIndex, 1);
      next.splice(index, 0, draggedItem);
      return next.map((item, idx) => ({ ...item, order: idx + 1 }));
    });
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Save to backend via PUT /api/events/[id]
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionsConfig: sections,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSaveMessage({
          type: "error",
          text: data.error || "فشل حفظ تخصيص الأقسام",
        });
        return;
      }

      setOriginalSections([...sections]);
      setSaveMessage({
        type: "success",
        text: "تم حفظ وتحديث ترتيب وتخصيص الأقسام بنجاح! ✨",
      });
      if (onSaveSuccess) onSaveSuccess();
      setTimeout(() => setSaveMessage(null), 4000);
    } catch {
      setSaveMessage({
        type: "error",
        text: "حدث خطأ في الاتصال بالخادم أثناء الحفظ",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Synthetic Event Data for Live Preview
  const livePreviewEvent = useMemo(() => {
    return {
      id: event.id,
      slug: event.slug,
      title: event.title,
      eventType: event.eventType,
      groomName: event.groomName,
      brideName: event.brideName,
      eventDate: event.eventDate,
      venueName: event.venueName,
      address: event.address,
      mapUrl: event.mapUrl,
      welcomeMessage: event.welcomeMessage,
      description: event.description,
      coverImage: event.coverImage,
      templateConfig,
      approvedPhotos: (event.photos || []).filter((p) => p.status === "APPROVED"),
      couplePhotos: (event.parsedCouplePhotos || []).map((p) => ({
        id: p.id,
        url: p.url,
        caption: p.caption,
        order: p.order,
        isCover: p.isCover ?? false,
      })),
      musicConfig: event.parsedMusicConfig
        ? {
            enabled: event.parsedMusicConfig.enabled ?? false,
            trackUrl: event.parsedMusicConfig.trackUrl,
            title: event.parsedMusicConfig.title,
            allowAutoplay: event.parsedMusicConfig.allowAutoplay ?? false,
            volume: event.parsedMusicConfig.volume ?? 0.5,
            loop: event.parsedMusicConfig.loop ?? true,
          }
        : null,
      scheduleItems: event.parsedScheduleItems || [],
      dressCode: event.parsedDressCode
        ? {
            title: event.parsedDressCode.title,
            description: event.parsedDressCode.description,
            preferredColors: event.parsedDressCode.preferredColors || [],
            prohibitedColors: event.parsedDressCode.prohibitedColors || [],
            imageUrl: event.parsedDressCode.imageUrl,
          }
        : null,
      sectionsConfig: sections,
      stats: {
        approvedPhotosCount: (event.photos || []).filter((p) => p.status === "APPROVED").length,
        totalRsvps: (event.rsvps || []).length,
      },
    };
  }, [event, templateConfig, sections]);

  return (
    <div className="space-y-6 select-none" data-testid="section-customizer-studio">
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#790D20] animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold font-serif text-[#390E19]">
              استوديو تخصيص وترتيب الأقسام (Section Studio)
            </h2>
          </div>
          <p className="text-xs text-[#8B7778]">
            تحكم في إظهار وإخفاء وترتيب أقسام بطاقة الدعوة وفق هوية قالب «{templateConfig.nameAr}»
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {hasUnsavedChanges && (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FEF9EE] text-[#B37D22] border border-[#B37D22]/30 flex items-center gap-1.5 animate-fadeIn">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B37D22]" />
              <span>تعديلات غير محفوظة</span>
            </span>
          )}

          <button
            onClick={resetToDefault}
            type="button"
            data-testid="reset-defaults-btn"
            title="استعادة الترتيب الأصلي لقالب الدعوة"
            className="px-4 py-2.5 min-h-[44px] rounded-full border border-[#EFE4DC] bg-[#FFFDFC] text-[#493B3B] hover:text-[#790D20] hover:border-[#790D20] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>استعادة الافتراضي</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            type="button"
            data-testid="save-sections-btn"
            className="px-6 py-2.5 min-h-[44px] rounded-full bg-[#790D20] text-white hover:bg-[#630A19] text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? "جاري الحفظ..." : "حفظ الترتيب"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveMessage && (
        <div
          data-testid="save-message-alert"
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 animate-fadeIn shadow-xs ${
            saveMessage.type === "success"
              ? "bg-[#F0F7F1] border-[#C5DEC0] text-[#2E6827]"
              : "bg-[#FFF0F0] border-[#F1DEDF] text-[#A82323]"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {saveMessage.type === "success" ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-[#3D7A42]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-[#A82323]" />
            )}
            <span className="font-medium">{saveMessage.text}</span>
          </div>

          {saveMessage.type === "error" && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              data-testid="retry-save-btn"
              type="button"
              className="px-3 py-1.5 min-h-[36px] rounded-xl bg-[#A82323] text-white hover:bg-[#851919] font-bold text-xs transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>إعادة المحاولة</span>
            </button>
          )}
        </div>
      )}

      {/* Main Studio Grid: Left (Editor Manager) & Right (Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Section Reordering & Management Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4" data-testid="studio-editor-panel">
          <div className="p-5 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFE4DC] pb-3">
              <span className="text-xs font-bold text-[#390E19] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>أقسام الدعوة النشطة ({sections.length})</span>
              </span>
              <span className="text-[11px] text-[#8B7778] font-mono">
                {sections.filter((s) => s.enabled).length} معروضة
              </span>
            </div>

            {/* Draggable & Accessible Sections List */}
            <div className="space-y-2.5" role="list" aria-label="قائمة أقسام الدعوة">
              {sections.map((sec, idx) => {
                const meta = MASTER_SECTIONS_CATALOG[sec.id as TemplateSectionId] || {
                  id: sec.id,
                  titleAr: sec.id,
                  descriptionAr: "",
                  isRequired: false,
                  defaultEnabled: true,
                  defaultOrder: idx + 1,
                };

                const isFirst = idx === 0;
                const isLast = idx === sections.length - 1;

                return (
                  <div
                    key={sec.id}
                    data-testid={`section-item-${sec.id}`}
                    role="listitem"
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 ${
                      draggedIndex === idx
                        ? "opacity-50 border-[#790D20] bg-[#FAF2F3]"
                        : sec.enabled
                        ? "bg-[#FFFDFC] border-[#EFE4DC] hover:border-[#D8B8B8] shadow-xs"
                        : "bg-[#F9F7F5] border-[#EAE3DC] opacity-60"
                    }`}
                  >
                    {/* Drag Handle & Order Badge */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div
                        className="p-1 cursor-grab active:cursor-grabbing text-[#8B7778] hover:text-[#390E19] transition-colors"
                        title="اسحب لإعادة الترتيب"
                      >
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <span className="w-5 h-5 rounded-full bg-[#FAF3EE] border border-[#EFE4DC] text-[10px] font-mono font-bold text-[#390E19] flex items-center justify-center">
                        {idx + 1}
                      </span>
                    </div>

                    {/* Section Information */}
                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-xs font-bold truncate ${
                            sec.enabled ? "text-[#390E19]" : "text-[#8B7778] line-through"
                          }`}
                        >
                          {meta.titleAr}
                        </h4>
                        {meta.isRequired && (
                          <span
                            title="قسم أساسي لا يمكن إخفاؤه أو حذفه"
                            className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#FAF4E8] text-[#9E7A36] border border-[#D6B77A]/40 shrink-0 flex items-center gap-1"
                          >
                            <Lock className="w-2.5 h-2.5" />
                            <span>أساسي (إجباري)</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#8B7778] line-clamp-1 mt-0.5">
                        {meta.descriptionAr}
                      </p>
                    </div>

                    {/* Accessible Action Controls (Touch Targets >= 44px) */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Move Up Button */}
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={isFirst}
                        type="button"
                        data-testid="reorder-up-btn"
                        title="تحريك للأعلى"
                        aria-label={`تحريك قسم ${meta.titleAr} للأعلى`}
                        className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-[#8B7778] hover:text-[#390E19] hover:bg-[#FAF3EE] disabled:opacity-20 disabled:hover:bg-transparent transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>

                      {/* Move Down Button */}
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={isLast}
                        type="button"
                        data-testid="reorder-down-btn"
                        title="تحريك للأسفل"
                        aria-label={`تحريك قسم ${meta.titleAr} للأسفل`}
                        className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-[#8B7778] hover:text-[#390E19] hover:bg-[#FAF3EE] disabled:opacity-20 disabled:hover:bg-transparent transition-colors flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {/* Visibility Toggle Button */}
                      {!meta.isRequired ? (
                        <button
                          onClick={() => toggleVisibility(sec.id)}
                          type="button"
                          title={sec.enabled ? "إخفاء القسم" : "إظهار القسم"}
                          aria-label={sec.enabled ? `إخفاء قسم ${meta.titleAr}` : `إظهار قسم ${meta.titleAr}`}
                          className={`min-w-[44px] min-h-[44px] p-2 rounded-xl transition-colors flex items-center justify-center cursor-pointer ${
                            sec.enabled
                              ? "text-[#3D7A42] hover:bg-[#F0F7F1]"
                              : "text-[#8B7778] hover:bg-[#FAF3EE]"
                          }`}
                        >
                          {sec.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                      ) : (
                        <div className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#D6B77A]">
                          <Lock className="w-3.5 h-3.5 opacity-60" />
                        </div>
                      )}

                      {/* Remove Button (Only for optional sections) */}
                      {!meta.isRequired && (
                        <button
                          onClick={() => removeSection(sec.id)}
                          type="button"
                          title="حذف القسم من الدعوة"
                          aria-label={`حذف قسم ${meta.titleAr}`}
                          className="min-w-[44px] min-h-[44px] p-2 rounded-xl text-[#8B7778] hover:text-[#A82323] hover:bg-[#FFF0F0] transition-colors flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Optional Supported Sections */}
            {availableToAdd.length > 0 && (
              <div className="pt-3 border-t border-[#EFE4DC] space-y-2">
                <span className="text-[11px] font-bold text-[#8B7778] block">
                  أقسام إضافية مدعومة في قالب «{templateConfig.nameAr}»:
                </span>
                <div className="flex flex-wrap gap-2">
                  {availableToAdd.map((meta) => (
                    <button
                      key={meta.id}
                      onClick={() => addSection(meta)}
                      type="button"
                      className="px-3 py-2 min-h-[44px] rounded-full border border-dashed border-[#D6B77A] text-[#790D20] hover:bg-[#FAF4E8] text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة {meta.titleAr}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Synchronized Preview Pane (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-bold text-[#390E19] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>المعاينة الحية الفورية (Live Synchronized Preview)</span>
            </span>

            {/* Device Switcher (Mobile vs Desktop) */}
            <div className="flex items-center gap-1 bg-[#FAF3EE] p-1 rounded-full border border-[#EFE4DC]">
              <button
                onClick={() => setPreviewDevice("mobile")}
                type="button"
                className={`px-3 py-1.5 min-h-[44px] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  previewDevice === "mobile"
                    ? "bg-[#790D20] text-white shadow-xs"
                    : "text-[#8B7778] hover:text-[#390E19]"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>موبايل (390px)</span>
              </button>

              <button
                onClick={() => setPreviewDevice("desktop")}
                type="button"
                className={`px-3 py-1.5 min-h-[44px] rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  previewDevice === "desktop"
                    ? "bg-[#790D20] text-white shadow-xs"
                    : "text-[#8B7778] hover:text-[#390E19]"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>شاشة كاملة</span>
              </button>
            </div>
          </div>

          {/* Preview Viewport Frame */}
          <div
            className={`rounded-3xl border border-[#EFE4DC] bg-[#FAF7F2] p-2 sm:p-4 overflow-hidden transition-all duration-300 shadow-md ${
              previewDevice === "mobile"
                ? "max-w-[420px] mx-auto rounded-[3rem] border-[6px] border-[#2A2320] shadow-2xl"
                : "w-full"
            }`}
          >
            {/* Mobile Notch Bar when in mobile mode */}
            {previewDevice === "mobile" && (
              <div className="w-28 h-4 bg-[#2A2320] rounded-full mx-auto mb-2 opacity-90" />
            )}

            {/* Scrollable Live Invitation Body */}
            <div
              className={`overflow-y-auto rounded-2xl ${
                previewDevice === "mobile" ? "max-h-[720px]" : "max-h-[760px]"
              }`}
            >
              <InvitationView event={livePreviewEvent} isEditorPreview={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
