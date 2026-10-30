"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Smartphone,
  Eye,
} from "lucide-react";
import { TEMPLATES, getTemplate, TemplateConfig } from "@/lib/templates";
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
  const queryTemplateId = searchParams.get("template") || "royal-gold";
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"card" | "full">("card");

  const activeTemplateId =
    selectedTemplateId || (TEMPLATES[queryTemplateId] ? queryTemplateId : "royal-gold");
  const activeTemplate: TemplateConfig = getTemplate(activeTemplateId);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("template", templateId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const previewEventData = {
    ...PREVIEW_EVENT,
    templateConfig: activeTemplate,
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#493B3B] selection:bg-[#790D20]/15 selection:text-[#390E19] flex flex-col font-sans">
      {/* ========================================================================= */}
      {/* 1. TOP STICKY PREVIEW BAR (UX CONTROLS)                                   */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF9F5]/90 border-b border-[#EFE4DC] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Right: Breadcrumb & Title */}
            <div className="flex items-center justify-between md:justify-start gap-4">
              <Link
                href="/#templates"
                className="inline-flex items-center gap-1.5 text-xs text-[#8B7778] hover:text-[#790D20] transition-colors py-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للقوالب</span>
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

            {/* Center: Template Switcher Carousel / Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar text-xs">
              {Object.values(TEMPLATES).map((tmpl) => {
                const isActive = tmpl.id === activeTemplate.id;
                const isLuxury = tmpl.tier === "LUXURY";
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleTemplateChange(tmpl.id)}
                    className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all flex items-center gap-1.5 font-medium shrink-0 min-h-[38px] ${
                      isActive
                        ? "bg-[#790D20] text-white font-bold shadow-sm"
                        : "bg-[#FFFDFC] border border-[#EFE4DC] text-[#8B7778] hover:text-[#390E19] hover:border-[#D6B77A]"
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: tmpl.theme.accentColor }}
                    />
                    <span>{tmpl.nameAr}</span>
                    {isLuxury && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#FAF3E5] text-[#D6B77A] border border-[#D6B77A]/40 font-mono">
                        VIP
                      </span>
                    )}
                  </button>
                );
              })}
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
              </div>

              {/* Use This Template Button */}
              <Link
                href={`/dashboard/events/new?template=${activeTemplate.id}`}
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
        {viewMode === "card" ? (
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
                welcomeMessage="يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة العمر وتوثيق أجمل اللحظات"
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
