"use client";

import { Suspense, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Smartphone,
  Eye,
  ExternalLink,
} from "lucide-react";
import { TEMPLATES, getTemplate, TemplateConfig, EventType } from "@/lib/templates";
import RealisticInvitationCard from "@/components/templates/RealisticInvitationCard";
import InvitationView from "@/components/templates/InvitationView";

// High-fidelity sample wedding data for previews
const PREVIEW_EVENT = {
  id: "preview-event-demo",
  slug: "ahmed-and-sara-demo",
  title: "حفل زفاف أحمد وسارة",
  eventType: "WEDDING",
  groomName: "أحمد منصور",
  brideName: "سارة الجوهري",
  eventDate: new Date("2026-10-25T20:00:00Z"),
  venueName: "فندق الفورسيزونز - قاعة البلازا الفاخرة",
  address: "كورنيش النيل، جاردن سيتي، القاهرة",
  mapUrl: "https://maps.google.com/?q=Four+Seasons+Hotel+Cairo+at+Nile+Plaza",
  welcomeMessage:
    "يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة العمر وتوثيق أجمل اللحظات بين الأهل والأحباب",
  description:
    "ليلة العمر تجمعنا بكم في أجواء مفعمة بالحب والفرح. نسعد بوجودكم وبتوثيق ذكرياتكم معنا عبر ألبوم الحفل الرقمي.",
  coverImage: null,
  approvedPhotos: [
    {
      id: "demo-photo-1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      guestName: "د. طارق المنصور",
      message: "ألف مبروك لأجمل عروسين! بارك الله لكما وجمع بينكما في خير",
      createdAt: new Date().toISOString(),
    },
    {
      id: "demo-photo-2",
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      guestName: "سارة الخالدي",
      message: "ليلة ساحرة وعروس فائقة الجمال، دامت دياركم عامرة بالأفراح",
      createdAt: new Date().toISOString(),
    },
  ],
  stats: {
    approvedPhotosCount: 2,
    totalRsvps: 184,
  },
};

function TemplatePreviewContent() {
  const searchParams = useSearchParams();

  // Read initial template from query parameter or default to royal-gold
  const queryTemplateId = searchParams.get("template") || "890434e0-e5a6-4bf5-a367-309aa074414d";
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "full" | "html">("card");

  const activeTemplateId =
    selectedTemplateId || (TEMPLATES[queryTemplateId] ? queryTemplateId : "890434e0-e5a6-4bf5-a367-309aa074414d");
  const activeTemplate: TemplateConfig = getTemplate(activeTemplateId);
  const queryEventType = searchParams.get("eventType") || (activeTemplate.eventTypes?.[0] || "WEDDING");
  const [activeCategory, setActiveCategory] = useState<string>(queryEventType === "ENGAGEMENT" ? "ENGAGEMENT" : "ALL");

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("template", templateId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const [hiddenIds, setHiddenIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/templates/hidden")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d?.hiddenIds)) setHiddenIds(d.hiddenIds);
      })
      .catch(() => {});
  }, []);

  const templatesList = useMemo(() => {
    const seen = new Set<string>();
    return Object.values(TEMPLATES).filter((tmpl) => {
      if (seen.has(tmpl.id)) return false;
      seen.add(tmpl.id);
      if (hiddenIds.includes(tmpl.id)) return false;
      if (activeCategory === "ALL") return true;
      return tmpl.eventTypes && tmpl.eventTypes.includes(activeCategory as EventType);
    });
  }, [hiddenIds, activeCategory]);

  const previewEventData = {
    ...PREVIEW_EVENT,
    eventType: queryEventType,
    title: queryEventType === "ENGAGEMENT" ? "حفل خطوبة أحمد وسارة" : "حفل زفاف أحمد وسارة",
    welcomeMessage: queryEventType === "ENGAGEMENT" ? "يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة الخطوبة السعيدة وبداية رحلة العمر" : PREVIEW_EVENT.welcomeMessage,
    templateConfig: activeTemplate,
  };

  return (
    <div className="min-h-screen bg-[#FFF8F4] text-[#493B3B] selection:bg-[#790D20]/15 selection:text-[#390E19] flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP STICKY PREVIEW BAR (UX CONTROLS)                                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF8F4]/95 border-b border-[#EFE4DC] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Right: Breadcrumb & Title */}
            <div className="flex items-center justify-between md:justify-start gap-4">
              <Link
                href="/#designs"
                className="inline-flex items-center gap-1.5 text-xs text-[#8C7772] hover:text-[#790D20] transition-colors py-2 font-medium"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للأتيليه</span>
              </Link>

              <div className="h-4 w-px bg-[#EFE4DC] hidden sm:block" />

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-serif text-[#390E19]">
                  معاينة حية:
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FFFDFC] text-[#390E19] border border-[#EFE4DC] flex items-center gap-1.5 shadow-sm">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: activeTemplate.theme.accentColor }}
                  />
                  <span>{activeTemplate.nameAr}</span>
                </span>
              </div>
            </div>

            {/* Center: Style Filter Tabs & Template Carousel */}
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-semibold bg-[#FFFDFC] border border-[#EFE4DC] rounded-full p-0.5">
                {[
                  { id: "ALL", label: "الكل" },
                  { id: "ENGAGEMENT", label: "خطوبة 💍" },
                  { id: "WEDDING", label: "زفاف" },
                  { id: "KATB_KITAB", label: "كتب كتاب" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-2.5 py-1 rounded-full transition-all ${
                      activeCategory === cat.id
                        ? "bg-[#790D20] text-white"
                        : "text-[#8C7772] hover:text-[#390E19]"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs max-w-sm sm:max-w-md">
                {templatesList.map((tmpl) => {
                  const isActive = tmpl.id === activeTemplate.id;
                  const isLuxury = tmpl.tier === "LUXURY";
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleTemplateChange(tmpl.id)}
                      className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 font-medium shrink-0 min-h-[36px] ${
                        isActive
                          ? "bg-[#790D20] text-white font-bold shadow-sm"
                          : "bg-[#FFFDFC] border border-[#EFE4DC] text-[#8C7772] hover:text-[#390E19] hover:border-[#D6B77A]"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: tmpl.theme.accentColor }}
                      />
                      <span>{tmpl.nameAr}</span>
                      {isLuxury && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FAF4E8] text-[#9E7A36] border border-[#D6B77A]/40 font-mono">
                          VIP
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Left: View Mode Toggle & Primary CTA Button */}
            <div className="flex items-center justify-between md:justify-end gap-3 pt-1 md:pt-0 border-t md:border-t-0 border-[#EFE4DC]">
              {/* View Mode Toggle */}
              <div className="flex items-center p-1 bg-[#FFFDFC] rounded-full border border-[#EFE4DC] shadow-sm">
                <button
                  type="button"
                  onClick={() => setViewMode("card")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px] ${
                    viewMode === "card"
                      ? "bg-[#790D20] text-white shadow-sm"
                      : "text-[#8B7778] hover:text-[#390E19]"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">بطاقة الدعوة</span>
                  <span className="sm:hidden">البطاقة</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("full")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px] ${
                    viewMode === "full"
                      ? "bg-[#790D20] text-white shadow-sm"
                      : "text-[#8B7778] hover:text-[#390E19]"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">صفحة الحفل التفاعلية</span>
                  <span className="sm:hidden">التفاعلية</span>
                </button>
                {activeTemplate.htmlFile && (
                  <button
                    type="button"
                    onClick={() => setViewMode("html")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all min-h-[36px] ${viewMode === "html" ? "bg-[#790D20] text-white shadow-sm" : "text-[#8B7778] hover:text-[#390E19]"}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">القالب الأصلي (HTML)</span>
                    <span className="sm:hidden">الأصلي</span>
                  </button>
                )}
              </div>

              {/* Use This Template Button */}
              <Link
                href={`/dashboard/events/new?template=${activeTemplate.id}&eventType=${queryEventType}`}
                className="px-5 py-2.5 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#390E19] shadow-sm transition-all flex items-center gap-1.5 min-h-[44px] shrink-0 hover:scale-105 active:scale-95"
              >
                <span>استخدم هذا التصميم</span>
                <Sparkles className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. PREVIEW CANVAS CONTAINER                                               */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full relative">
        {templatesList.length === 0 ? (
          <div className="py-24 px-4 text-center max-w-md mx-auto space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-[#FAF4E8] text-[#9E7A36] flex items-center justify-center mx-auto shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold font-serif text-[#390E19]">لا توجد قوالب معروضة حالياً</h2>
            <p className="text-xs sm:text-sm text-[#8B7778] leading-relaxed">
              تم تفريغ وحذف كافة القوالب القديمة بنجاح، والمنصة مهيأة تماماً لبناء قوالبك وتصميماتك الجديدة كلياً.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard/events/new"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#790D20] text-white text-xs font-bold shadow-soft-sm hover:bg-[#630A19] transition-all"
              >
                <span>إنشاء مناسبة جديدة</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
                {viewMode === "html" && activeTemplate.htmlFile ? (
          <div className="py-8 px-4 max-w-5xl mx-auto flex flex-col items-center justify-center space-y-4 animate-fadeIn">
            <div className="w-full flex items-center justify-between p-3.5 bg-white border border-[#EFE4DC] rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-[#390E19]">
                  معاينة النسخة الأصلية المستقلة (HTML كامل مع الصوت والمؤثرات دون أي تعديل)
                </span>
              </div>
              <a
                href={activeTemplate.htmlFile}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#790D20] hover:text-white hover:bg-[#790D20] bg-[#FAF2F3] px-3.5 py-1.5 rounded-full border border-[#D8B8B8] flex items-center gap-1.5 transition-all"
              >
                <span>فتح في نافذة كاملة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="w-full h-[780px] bg-white rounded-[2.5rem] overflow-hidden border-4 border-[#390E19] shadow-2xl relative">
              <iframe
                src={activeTemplate.htmlFile}
                className="w-full h-full border-0"
                title={activeTemplate.nameAr}
              />
            </div>
          </div>
        ) : viewMode === "card" ? (
          /* Stationery Card Showcase */
          <div className="py-12 sm:py-16 px-4 max-w-4xl mx-auto flex flex-col items-center justify-center space-y-8 animate-fadeIn">
            {/* Template Description Header */}
            <div className="text-center max-w-lg space-y-2">
              <span className="text-xs font-bold tracking-widest uppercase block text-[#790D20]">
                {activeTemplate.styleTag}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold font-serif text-[#390E19]">
                قالب {activeTemplate.nameAr}
              </h1>
              <p className="text-xs sm:text-sm text-[#8B7778] leading-relaxed">
                {activeTemplate.descriptionAr}
              </p>
              {activeTemplate.htmlFile && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("html")}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FAF2F3] text-[#790D20] border border-[#D8B8B8] hover:bg-[#790D20] hover:text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <span>معاينة صفحة الـ HTML الأصلية الكاملة لهذا القالب</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* The Realistic Stationery Paper Invitation Card */}
            <div className="w-full max-w-md relative transition-transform duration-500 hover:scale-[1.01]">
              <div
                className="absolute -inset-4 rounded-[3rem] blur-2xl opacity-35 pointer-events-none transition-all duration-500"
                style={{
                  background: `radial-gradient(ellipse at center, ${activeTemplate.theme.accentColor} 0%, transparent 70%)`,
                }}
              />
              <RealisticInvitationCard
                template={activeTemplate}
                groomName="أحمد منصور"
                brideName="سارة الجوهري"
                eventDate="2026-10-25"
                eventTime="20:00"
                venueName="فندق الفورسيزونز - قاعة البلازا"
                address="كورنيش النيل، جاردن سيتي، القاهرة"
                welcomeMessage={queryEventType === "ENGAGEMENT" ? "يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة الخطوبة السعيدة وبداية رحلة العمر" : "يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة العمر وتوثيق أجمل اللحظات"}
                eventType={queryEventType}
                interactive={true}
              />
            </div>

            {/* Bottom Actions Floating Bar */}
            <div className="flex items-center gap-3 pt-4">
              <Link
                href={`/dashboard/events/new?template=${activeTemplate.id}`}
                className="px-8 py-3.5 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#390E19] shadow-sm transition-all flex items-center gap-2 min-h-[44px]"
              >
                <span>صمم دعوتك بهذا القالب</span>
                <Sparkles className="w-3.5 h-3.5 fill-current" />
              </Link>
            </div>
          </div>
        ) : (
          /* Full Interactive Event Page Simulation (Mobile Mockup Frame) */
          <div className="py-8 px-4 flex flex-col items-center justify-center animate-fadeIn">
            <div className="w-full max-w-md mx-auto border-[10px] border-[#390E19] rounded-[3rem] shadow-2xl overflow-hidden bg-black relative">
              {/* Phone Speaker Notch */}
              <div className="w-32 h-4 bg-[#390E19] mx-auto rounded-b-xl relative z-30" />

              {/* Real Event Page Container */}
              <div className="max-h-[750px] overflow-y-auto no-scrollbar">
                <InvitationView
                  event={previewEventData}
                />
              </div>
            </div>
          </div>
        )}
      </>
        )}
      </main>
    </div>
  );
}

export default function TemplatePreviewStudio() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center text-[#390E19]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 animate-spin text-[#790D20]" />
            <span className="text-sm font-semibold">جاري تجهيز استوديو المعاينة...</span>
          </div>
        </div>
      }
    >
      <TemplatePreviewContent />
    </Suspense>
  );
}
