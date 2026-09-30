"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  Heart,
  Loader2,
  AlertCircle,
  Eye,
  Layers,
  CreditCard,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { TEMPLATES, TemplateConfig } from "@/lib/templates";
import { PACKAGES } from "@/lib/packages";
import RealisticInvitationCard from "@/components/templates/RealisticInvitationCard";

const STEPS = [
  { step: 1, title: "المناسبة والأسماء", subtitle: "أصحاب الحفل" },
  { step: 2, title: "الموعد والمكان", subtitle: "تفاصيل الموقع" },
  { step: 3, title: "القالب والتصميم", subtitle: "الهوية البصرية" },
  { step: 4, title: "الباقة والمراجعة", subtitle: "تأكيد الطلب" },
];

function NewEventStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTemplate = searchParams.get("template") || "royal-gold";
  const initialPackage = searchParams.get("package")?.toUpperCase() || "PREMIUM";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    eventType: "WEDDING",
    groomName: "",
    brideName: "",
    eventDate: "",
    eventTime: "20:00",
    venueName: "",
    address: "",
    mapUrl: "",
    welcomeMessage: "يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة العمر وتوثيق أجمل اللحظات",
    description: "",
    templateId: TEMPLATES[initialTemplate] ? initialTemplate : "royal-gold",
    customSlug: "",
    packageTier: PACKAGES[initialPackage] ? initialPackage : "PREMIUM",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [mobileView, setMobileView] = useState<"form" | "preview">("form");

  const selectedTemplate: TemplateConfig =
    TEMPLATES[formData.templateId] || TEMPLATES["royal-gold"];

  const handleSelectTemplate = (templateId: string) => {
    setFormData((prev) => ({ ...prev, templateId }));
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("template", templateId);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleSelectPackage = (packageTier: string) => {
    setFormData((prev) => ({ ...prev, packageTier }));
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("package", packageTier);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const validateStep = (step: number): boolean => {
    setErrorMessage("");
    if (step === 1) {
      if (!formData.groomName.trim() || !formData.brideName.trim()) {
        setErrorMessage("يرجى كتابة اسم العريس واسم العروس للمتابعة");
        return false;
      }
    } else if (step === 2) {
      if (!formData.eventDate || !formData.venueName.trim()) {
        setErrorMessage("يرجى تحديد تاريخ الحفل واسم القاعة أو الفندق للمتابعة");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setErrorMessage("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2)) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const combinedDateTime = new Date(
        `${formData.eventDate}T${formData.eventTime || "20:00"}:00`
      );

      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: formData.eventType,
          groomName: formData.groomName.trim(),
          brideName: formData.brideName.trim(),
          eventDate: combinedDateTime.toISOString(),
          venueName: formData.venueName.trim(),
          address: formData.address.trim() || formData.venueName.trim(),
          mapUrl: formData.mapUrl.trim() || undefined,
          welcomeMessage: formData.welcomeMessage.trim(),
          description: formData.description.trim() || undefined,
          templateId: formData.templateId,
          slug: formData.customSlug.trim() || undefined,
          packageTier: formData.packageTier,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل إنشاء المناسبة");
      }

      router.push(`/dashboard/events/${data.event.id}/checkout?package=${formData.packageTier}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء الإنشاء";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#faf8f5] flex flex-col justify-between selection:bg-[#c5a880]/30 selection:text-[#f5f2eb]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full flex-1">
        {/* ========================================================================= */}
        {/* 1. EDITORIAL HEADER                                                       */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-[#1c1916]">
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-[#8e877c] hover:text-[#c5a880] transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة للوحة التحكم</span>
            </Link>

            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light font-display text-[#faf8f5] tracking-tight">
                استوديو تصميم الدعوة
              </h1>
              <span className="text-[11px] font-normal font-body px-3 py-1 rounded-full bg-[#181512] text-[#c5a880] border border-[#2b251e] tracking-wide">
                تصميم فوري
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#8e877c] max-w-xl font-light leading-relaxed">
              صمم بطاقة رقمية تعبّر عن رقي وأناقة مناسبتكم بأسلوب تحريري فاخر
            </p>
          </div>

          {/* Mobile Preview Toggle with 44px min touch target */}
          <div className="flex lg:hidden items-center gap-2 p-1.5 bg-[#141210] rounded-full border border-[#26221d] shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setMobileView("form")}
              className={`py-2 px-5 rounded-full text-xs font-medium transition-all min-h-[44px] flex items-center justify-center ${
                mobileView === "form"
                  ? "bg-[#c5a880] text-[#0c0b0a] font-bold shadow"
                  : "text-[#8e877c]"
              }`}
            >
              بيانات الدعوة
            </button>
            <button
              type="button"
              onClick={() => setMobileView("preview")}
              className={`py-2 px-5 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
                mobileView === "preview"
                  ? "bg-[#c5a880] text-[#0c0b0a] font-bold shadow"
                  : "text-[#8e877c]"
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>معاينة البطاقة</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. COMPACT EDITORIAL STEP PROGRESS STRIP                                   */}
        {/* ========================================================================= */}
        <nav aria-label="مراحل تصميم الدعوة" className="mb-10 pb-2 border-b border-[#1a1714]">
          <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2">
            {STEPS.map((s, index) => {
              const isCompleted = currentStep > s.step;
              const isCurrent = currentStep === s.step;

              return (
                <div key={s.step} className="flex items-center flex-1 min-w-0 last:flex-initial">
                  <button
                    type="button"
                    onClick={() => {
                      if (s.step < currentStep) setCurrentStep(s.step);
                    }}
                    disabled={s.step > currentStep}
                    className={`group flex items-center gap-3 py-1.5 text-right transition-all min-h-[44px] ${
                      isCurrent
                        ? "text-[#faf8f5]"
                        : isCompleted
                        ? "text-[#a39c8f] hover:text-[#c5a880] cursor-pointer"
                        : "text-[#544d44] cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-all ${
                        isCurrent
                          ? "bg-[#c5a880] text-[#0c0b0a] font-bold shadow-md shadow-[#c5a880]/20"
                          : isCompleted
                          ? "bg-[#1c1813] border border-[#3d3429] text-[#c5a880]"
                          : "bg-[#141210] border border-[#24201a] text-[#544d44]"
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5 text-[#c5a880]" /> : `0${s.step}`}
                    </span>
                    <div className="flex flex-col truncate">
                      <span
                        className={`text-xs font-medium truncate ${
                          isCurrent
                            ? "font-bold text-[#faf8f5]"
                            : isCompleted
                            ? "text-[#a39c8f]"
                            : "text-[#544d44]"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span className="text-[10px] text-[#787166] hidden md:block">
                        {s.subtitle}
                      </span>
                    </div>
                  </button>

                  {/* Subtle connecting hairline */}
                  {index < STEPS.length - 1 && (
                    <div className="flex-1 mx-4 hidden sm:block h-px bg-gradient-to-l from-[#24201a] via-[#1c1916] to-[#24201a]" />
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {errorMessage && (
          <div className="mb-8 p-4 text-xs bg-[#241312] border border-[#522320] text-[#fca5a5] rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. MAIN ATELIER STUDIO: EDITING CONTROLS + INVITATION HERO                */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* RIGHT COLUMN IN ARABIC RTL: Controls & Steps (7 Cols) */}
          <div
            className={`lg:col-span-7 space-y-8 ${
              mobileView === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* STEP 1: Event Type & Names */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="space-y-1.5 pb-5 border-b border-[#1c1916]">
                    <div className="flex items-center gap-2 text-[#c5a880] text-xs font-mono">
                      <span>01 / 04</span>
                      <span>•</span>
                      <span className="font-sans font-medium text-[#a39c8f]">البيانات الأساسية</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#faf8f5] flex items-center gap-2.5">
                      <Heart className="w-5 h-5 text-[#c5a880]" />
                      <span>نوع المناسبة وأسماء العروسين</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8e877c] font-light">
                      ستظهر هذه الأسماء كعنوان رئيسي متألق في قلب بطاقة الدعوة الرقمية
                    </p>
                  </div>

                  {/* Event Type */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-medium text-[#c4bdaf]">نوع المناسبة</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: "WEDDING", label: "حفل زفاف" },
                        { id: "ENGAGEMENT", label: "حفل خطوبة" },
                        { id: "CELEBRATION", label: "عقد قران" },
                      ].map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, eventType: t.id })}
                          className={`py-3.5 px-3 rounded-2xl border text-xs font-medium transition-all min-h-[46px] ${
                            formData.eventType === t.id
                              ? "border-[#c5a880] bg-[#1a1713] text-[#faf8f5] font-bold shadow-sm ring-1 ring-[#c5a880]/30"
                              : "border-[#24201a] bg-[#12100e] text-[#8e877c] hover:border-[#383129] hover:text-[#faf8f5]"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Names */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                    <div className="space-y-2 text-right">
                      <label className="text-xs font-medium text-[#c4bdaf] flex items-center gap-1">
                        <span>اسم العريس الكريم</span>
                        <span className="text-[#c5a880]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.groomName}
                        onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                        placeholder="مثال: أحمد منصور"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] placeholder-[#6e675d] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right transition-colors"
                      />
                    </div>

                    <div className="space-y-2 text-right">
                      <label className="text-xs font-medium text-[#c4bdaf] flex items-center gap-1">
                        <span>اسم العروس الكريمة</span>
                        <span className="text-[#c5a880]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.brideName}
                        onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                        placeholder="مثال: سارة الجوهري"
                        className="w-full px-4 py-3.5 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] placeholder-[#6e675d] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right transition-colors"
                      />
                    </div>
                  </div>

                  {/* Welcome Message */}
                  <div className="space-y-2 text-right pt-1">
                    <label className="text-xs font-medium text-[#c4bdaf]">
                      عبارة الترحيب والدعوة
                    </label>
                    <textarea
                      rows={3}
                      value={formData.welcomeMessage}
                      onChange={(e) =>
                        setFormData({ ...formData, welcomeMessage: e.target.value })
                      }
                      className="w-full px-4 py-3.5 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] placeholder-[#6e675d] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right resize-none transition-colors leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Date, Time & Venue */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="space-y-1.5 pb-5 border-b border-[#1c1916]">
                    <div className="flex items-center gap-2 text-[#c5a880] text-xs font-mono">
                      <span>02 / 04</span>
                      <span>•</span>
                      <span className="font-sans font-medium text-[#a39c8f]">الموقع والزمان</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#faf8f5] flex items-center gap-2.5">
                      <Calendar className="w-5 h-5 text-[#c5a880]" />
                      <span>الموعد وموقع الاحتفال</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8e877c] font-light">
                      حدد توقيت الحفل ومكانه لتسهيل وصول ضيوفكم وتفعيل العد التنازلي التلقائي
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2 text-right">
                      <label className="text-xs font-medium text-[#c4bdaf] flex items-center gap-1">
                        <span>تاريخ الحفل</span>
                        <span className="text-[#c5a880]">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.eventDate}
                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right transition-colors"
                      />
                    </div>

                    <div className="space-y-2 text-right">
                      <label className="text-xs font-medium text-[#c4bdaf] flex items-center gap-1">
                        <span>وقت بدء استقبال الضيوف</span>
                        <span className="text-[#c5a880]">*</span>
                      </label>
                      <input
                        type="time"
                        required
                        value={formData.eventTime}
                        onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-xs font-medium text-[#c4bdaf] flex items-center gap-1">
                      <span>اسم القاعة أو الفندق</span>
                      <span className="text-[#c5a880]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.venueName}
                      onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                      placeholder="مثال: فندق الفورسيزونز - قاعة البلازا"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] placeholder-[#6e675d] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right transition-colors"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-xs font-medium text-[#c4bdaf]">العنوان بالتفصيل</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="مثال: كورنيش النيل، جاردن سيتي، القاهرة"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] placeholder-[#6e675d] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right transition-colors"
                    />
                  </div>

                  <div className="space-y-2 text-right">
                    <label className="text-xs font-medium text-[#c4bdaf]">
                      رابط الموقع على خرائط جوجل (Google Maps)
                    </label>
                    <input
                      type="url"
                      value={formData.mapUrl}
                      onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                      placeholder="https://maps.google.com/?q=..."
                      dir="ltr"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] placeholder-[#6e675d] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Template & Theme Selection */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="space-y-1.5 pb-5 border-b border-[#1c1916]">
                    <div className="flex items-center gap-2 text-[#c5a880] text-xs font-mono">
                      <span>03 / 04</span>
                      <span>•</span>
                      <span className="font-sans font-medium text-[#a39c8f]">الهوية البصرية</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#faf8f5] flex items-center gap-2.5">
                      <Layers className="w-5 h-5 text-[#c5a880]" />
                      <span>اختيار القالب الفني للدعوة</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8e877c] font-light">
                      اختر النمط الفني الذي يناسب ذوقكم الرفيع. المعاينة المجاورة تتحدث فورياً لاختيارك.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Object.values(TEMPLATES).map((tmpl) => {
                      const isSelected = formData.templateId === tmpl.id;
                      const isLuxury = tmpl.tier === "LUXURY";
                      const isPremium = tmpl.tier === "PREMIUM";
                      return (
                        <div
                          key={tmpl.id}
                          onClick={() => handleSelectTemplate(tmpl.id)}
                          className={`cursor-pointer rounded-2xl p-5 border text-right transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? "border-[#c5a880] bg-[#1a1713] shadow-xl ring-1 ring-[#c5a880]/50"
                              : isLuxury
                              ? "border-[#3d3324] bg-[#14110c] hover:border-[#c5a880]/60 hover:bg-[#1a1610]"
                              : "border-[#24201a] bg-[#12100e] hover:border-[#383129] hover:bg-[#161311]"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                    isLuxury
                                      ? "bg-[#d4af37]/20 text-[#f5d77f] border border-[#d4af37]/50"
                                      : isPremium
                                      ? "bg-[#c5a880]/15 text-[#c5a880] border border-[#c5a880]/30"
                                      : "bg-[#26221d] text-[#a39c8f] border border-[#383129]"
                                  }`}
                                >
                                  {isLuxury ? "VIP فاخر" : isPremium ? "مميز" : "أساسي"}
                                </span>
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#1e1a16] text-[#c5a880]/90 border border-[#2e2720]">
                                  {tmpl.styleTag}
                                </span>
                              </div>
                              <div
                                className="w-4 h-4 rounded-full border border-white/20 shadow-sm shrink-0"
                                style={{ backgroundColor: tmpl.theme.accentColor }}
                              />
                            </div>
                            <h4 className="text-base font-bold font-display text-[#faf8f5]">
                              {tmpl.nameAr}
                            </h4>
                            <p className="text-[10px] text-[#c5a880] font-display mt-0.5">
                              {tmpl.taglineAr}
                            </p>
                            <p className="text-[11px] text-[#8e877c] mt-1.5 leading-relaxed font-light">
                              {tmpl.descriptionAr}
                            </p>
                          </div>

                          <div className="mt-5 pt-3 border-t border-[#1f1b16] flex items-center justify-between text-[11px]">
                            <span className="text-[#5c554b] font-serif">{tmpl.nameEn}</span>
                            {isSelected ? (
                              <span className="text-[#c5a880] font-semibold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>محدد حالياً</span>
                              </span>
                            ) : (
                              <span className="text-[#6b6459] group-hover:text-[#faf8f5] transition-colors">
                                اختيار هذا النمط
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Package, Notes & Review */}
              {currentStep === 4 && (
                <div className="space-y-8">
                  <div className="space-y-1.5 pb-5 border-b border-[#1c1916]">
                    <div className="flex items-center gap-2 text-[#c5a880] text-xs font-mono">
                      <span>04 / 04</span>
                      <span>•</span>
                      <span className="font-sans font-medium text-[#a39c8f]">التأكيد والسداد</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold font-display text-[#faf8f5] flex items-center gap-2.5">
                      <CreditCard className="w-5 h-5 text-[#c5a880]" />
                      <span>اختيار الباقة وتأكيد الطلب</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#8e877c] font-light">
                      دفع لمرة واحدة شامل الاستضافة السحابية ورمز الـ QR وألبوم الذكريات التفاعلي
                    </p>
                  </div>

                  {/* Package Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {Object.values(PACKAGES).map((pkg) => {
                      const isSelected = formData.packageTier === pkg.code;
                      return (
                        <div
                          key={pkg.code}
                          onClick={() => handleSelectPackage(pkg.code)}
                          className={`rounded-2xl p-5 border text-right cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#1a1713] border-[#c5a880] ring-1 ring-[#c5a880]/50 shadow-md"
                              : "bg-[#12100e] border-[#24201a] hover:border-[#383129]"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-sm font-display text-[#faf8f5]">
                                {pkg.nameAr}
                              </h4>
                              {isSelected && <Check className="w-4 h-4 text-[#c5a880]" />}
                            </div>

                            <div className="flex items-baseline gap-1 mb-2">
                              <span className="text-2xl font-black text-[#faf8f5] font-mono">
                                {pkg.price}
                              </span>
                              <span className="text-xs text-[#8e877c]">{pkg.currency}</span>
                            </div>

                            <p className="text-[11px] text-[#8e877c] mb-4 font-light">{pkg.taglineAr}</p>

                            <ul className="space-y-2 text-[11px] text-[#c4bdaf]">
                              {pkg.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <span className="w-1 h-1 rounded-full bg-[#c5a880]" />
                                  <span className="line-clamp-1">{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Special Notes / Guest Guideline */}
                  <div className="space-y-2 text-right pt-1">
                    <label className="text-xs font-medium text-[#c4bdaf]">
                      ملاحظات أو تنويهات خاصة للضيوف (اختياري)
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="مثال: نرجو الالتزام بالموعد، مع أطيب التمنيات..."
                      className="w-full px-4 py-3 rounded-xl bg-[#12100e] border border-[#24201a] text-[#faf8f5] placeholder-[#6e675d] focus:outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-sm text-right resize-none transition-colors"
                    />
                  </div>

                  {/* Order Summary Box */}
                  <div className="p-5 rounded-2xl bg-[#12100e] border border-[#24201a] space-y-3 text-right">
                    <div className="flex items-center justify-between text-xs pb-3 border-b border-[#1c1916]">
                      <span className="text-[#8e877c]">إجمالي المستحق للباقة:</span>
                      <span className="font-mono font-bold text-[#c5a880] text-base">
                        {PACKAGES[formData.packageTier]?.price || 799}{" "}
                        {PACKAGES[formData.packageTier]?.currency || "ج.م"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs text-[#8e877c]">
                      <div>
                        العروسان:{" "}
                        <span className="text-[#faf8f5] font-medium">
                          {formData.groomName || "العريس"} و {formData.brideName || "العروس"}
                        </span>
                      </div>
                      <div>
                        القالب الفني:{" "}
                        <span className="text-[#c5a880] font-medium">{selectedTemplate.nameAr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#141210] border border-[#24201a] text-xs text-[#8e877c] flex items-start gap-3 text-right">
                    <ShieldCheck className="w-4 h-4 text-[#c5a880] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      سيتم حفظ مناسبتكم بأمان كامل، ونقلكم لصفحة السداد الآمن. فور إتمام الدفع، ستتمكنون
                      مباشرة من نشر بطاقة الدعوة وتحميل رمز الـ QR عالي الدقة.
                    </span>
                  </div>
                </div>
              )}

              {/* Step Navigation Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-[#1c1916] gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="py-3 px-6 rounded-full bg-[#141210] border border-[#24201a] text-[#8e877c] hover:text-[#faf8f5] hover:border-[#383129] font-medium text-xs transition-colors flex items-center gap-2 min-h-[44px]"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>السابق</span>
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="py-3.5 px-8 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center gap-2 shadow-sm min-h-[46px]"
                  >
                    <span>المتابعة للخطوة التالية</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="py-3.5 px-8 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center gap-2 shadow-md disabled:opacity-60 min-h-[46px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري حفظ المناسبة وتجهيز الدفع...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>
                          حفظ والمتابعة للدفع ({PACKAGES[formData.packageTier]?.price || 799} ج.م)
                        </span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* LEFT COLUMN IN ARABIC RTL: The Visual Hero Invitation Atelier (5 Cols) */}
          <div
            className={`lg:col-span-5 sticky top-24 space-y-4 ${
              mobileView === "form" ? "hidden lg:block" : "block"
            }`}
          >
            {/* Atelier Studio Label Header */}
            <div className="flex items-center justify-between text-xs text-[#8e877c] px-2">
              <span className="flex items-center gap-2 font-medium text-[#c4bdaf]">
                <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                <span className="text-[11px] tracking-wider uppercase">معاينة حية للدعوة الرقمية</span>
              </span>
              <span className="text-[11px] font-display text-[#c5a880] px-2.5 py-0.5 rounded-full bg-[#161310] border border-[#2b251e]">
                {selectedTemplate.nameAr}
              </span>
            </div>

            {/* Realistic Digital Invitation Card floating naturally on studio canvas */}
            <div className="relative py-2 flex justify-center">
              <RealisticInvitationCard
                template={selectedTemplate}
                templateId={selectedTemplate.id}
                groomName={formData.groomName}
                brideName={formData.brideName}
                eventDate={formData.eventDate}
                eventTime={formData.eventTime}
                venueName={formData.venueName}
                address={formData.address}
                welcomeMessage={formData.welcomeMessage}
                eventType={formData.eventType}
                interactive={true}
              />
            </div>

            {/* Mobile return button */}
            <div className="block lg:hidden pt-3">
              <button
                type="button"
                onClick={() => setMobileView("form")}
                className="w-full py-3.5 rounded-full bg-[#161310] border border-[#2e2720] text-xs text-[#faf8f5] font-medium min-h-[44px] flex items-center justify-center shadow-sm"
              >
                العودة لتعديل البيانات
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function NewEventPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0c0b0a] text-[#faf8f5] flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#8e877c]">جاري تجهيز استوديو التصميم...</p>
          </div>
        </div>
      }
    >
      <NewEventStudio />
    </Suspense>
  );
}
