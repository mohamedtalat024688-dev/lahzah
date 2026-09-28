"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Calendar,
  Heart,
  Loader2,
  AlertCircle,
  Eye,
  Layers,
  FileCheck,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { TEMPLATES, TemplateConfig } from "@/lib/templates";
import { PACKAGES } from "@/lib/packages";

const STEPS = [
  { step: 1, title: "نوع الحفل والأسماء", icon: Heart },
  { step: 2, title: "الموعد والمكان", icon: Calendar },
  { step: 3, title: "القالب والتصميم", icon: Layers },
  { step: 4, title: "الباقة والمراجعة", icon: CreditCard },
];

export default function NewEventPage() {
  const router = useRouter();

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
    templateId: "royal-gold",
    customSlug: "",
    packageTier: "PREMIUM",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const selectedTemplate: TemplateConfig = TEMPLATES[formData.templateId] || TEMPLATES["royal-gold"];

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
      const combinedDateTime = new Date(`${formData.eventDate}T${formData.eventTime || "20:00"}:00`);

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
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Top Back Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 px-3.5 py-1.5 rounded-full border border-[#d4af37]/30 transition-all font-semibold"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للوحة التحكم</span>
          </Link>

          <span className="text-xs text-neutral-400 font-mono">
            خطوة {currentStep} من 4
          </span>
        </div>

        {/* Wizard Header */}
        <div className="mb-8 text-center sm:text-right">
          <h1 className="text-3xl font-bold calligraphy-font text-white flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-6 h-6 text-[#d4af37]" />
            <span>استوديو تصميم بطاقة الدعوة</span>
          </h1>
          <p className="text-xs text-[#d4af37]/80 mt-1">
            صمم بطاقة رقمية تفاعلية تليق بفرحتكم في 4 خطوات بسيطة وسريعة
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="mb-10">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {STEPS.map((s) => {
              const isCompleted = currentStep > s.step;
              const isCurrent = currentStep === s.step;

              return (
                <div
                  key={s.step}
                  onClick={() => {
                    if (s.step < currentStep) setCurrentStep(s.step);
                  }}
                  className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                    s.step < currentStep ? "cursor-pointer" : ""
                  } ${
                    isCurrent
                      ? "border-[#d4af37] bg-[#1a1714] text-[#f3e5ab] shadow-lg shadow-[#d4af37]/10 ring-1 ring-[#d4af37]"
                      : isCompleted
                      ? "border-emerald-500/40 bg-emerald-950/20 text-emerald-400"
                      : "border-neutral-800 bg-[#12100d]/60 text-neutral-500"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1.5 text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-[#d4af37] text-[#0d0c0a]"
                        : isCompleted
                        ? "bg-emerald-500 text-black"
                        : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.step}
                  </div>
                  <span className="text-[11px] font-semibold hidden sm:inline">{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 text-xs bg-red-950/60 border border-red-500/40 text-red-200 rounded-2xl flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* STEP 1: Type & Names */}
          {currentStep === 1 && (
            <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
              <h2 className="text-lg font-bold text-white border-b border-[#d4af37]/20 pb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#d4af37]" />
                <span>الخطوة 1: نوع المناسبة وأسماء العروسين</span>
              </h2>

              {/* Event Type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">نوع المناسبة</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "WEDDING", label: "حفل زفاف" },
                    { id: "ENGAGEMENT", label: "حفل خطوبة" },
                    { id: "CELEBRATION", label: "عقد قران / مناسبة خاصة" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, eventType: t.id })}
                      className={`py-3.5 px-2 rounded-2xl border text-xs font-semibold transition-all ${
                        formData.eventType === t.id
                          ? "border-[#d4af37] bg-[#d4af37]/15 text-[#f3e5ab] shadow-md shadow-[#d4af37]/10"
                          : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-neutral-300">اسم العريس الكريم *</label>
                  <input
                    type="text"
                    required
                    value={formData.groomName}
                    onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                    placeholder="مثال: أحمد منصور"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-neutral-300">اسم العروس الكريمة *</label>
                  <input
                    type="text"
                    required
                    value={formData.brideName}
                    onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                    placeholder="مثال: سارة الجوهري"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Date, Time & Venue */}
          {currentStep === 2 && (
            <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-6 animate-fadeIn">
              <h2 className="text-lg font-bold text-white border-b border-[#d4af37]/20 pb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <span>الخطوة 2: الموعد ومكان الاحتفال</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-neutral-300">تاريخ الحفل *</label>
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white focus:outline-none focus:border-[#d4af37] text-sm text-right"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-neutral-300">وقت بدء الحفل *</label>
                  <input
                    type="time"
                    required
                    value={formData.eventTime}
                    onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white focus:outline-none focus:border-[#d4af37] text-sm text-right"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-neutral-300">اسم القاعة أو الفندق *</label>
                  <input
                    type="text"
                    required
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    placeholder="مثال: فندق الفورسيزونز - قاعة البلازا"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-neutral-300">العنوان بالتفصيل</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="مثال: كورنيش النيل، جاردن سيتي، القاهرة"
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                  />
                </div>
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-semibold text-neutral-300">
                  رابط الموقع على خرائط جوجل (Google Maps)
                </label>
                <input
                  type="url"
                  value={formData.mapUrl}
                  onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                  placeholder="https://maps.google.com/?q=..."
                  dir="ltr"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Template Selector with Live Card Preview */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-6">
                <h2 className="text-lg font-bold text-white border-b border-[#d4af37]/20 pb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#d4af37]" />
                  <span>الخطوة 3: اختيار القالب الملكي والتصميم</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.values(TEMPLATES).map((tmpl) => {
                    const isSelected = formData.templateId === tmpl.id;
                    return (
                      <div
                        key={tmpl.id}
                        onClick={() => setFormData({ ...formData, templateId: tmpl.id })}
                        className={`cursor-pointer rounded-2xl p-5 border text-right transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? "border-[#d4af37] bg-[#1a1714] shadow-xl shadow-[#d4af37]/20 ring-1 ring-[#d4af37]"
                            : "border-neutral-800 bg-neutral-900/70 hover:border-neutral-700"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-[#d4af37] text-[#0d0c0a] flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f3e5ab] mb-2 inline-block">
                            {tmpl.styleTag}
                          </span>
                          <h4 className="text-base font-bold text-white calligraphy-font">{tmpl.nameAr}</h4>
                          <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                            {tmpl.descriptionAr}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400">{tmpl.nameEn}</span>
                          <div
                            className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                            style={{ backgroundColor: tmpl.theme.accentColor }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Miniature Preview of Card */}
              <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 text-center space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] font-semibold">
                  <Eye className="w-4 h-4" />
                  <span>معاينة حية للقالب المختار: {selectedTemplate.nameAr}</span>
                </div>

                <div
                  className={`max-w-md mx-auto rounded-3xl p-8 border ${selectedTemplate.theme.cardBackground} shadow-2xl relative overflow-hidden`}
                >
                  <span className="text-xs text-[#d4af37] calligraphy-font block mb-3">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold calligraphy-font text-white mb-2">
                    {formData.groomName || "اسم العريس"} & {formData.brideName || "اسم العروس"}
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed max-w-xs mx-auto mb-4">
                    {formData.welcomeMessage}
                  </p>
                  <div className="inline-block py-1.5 px-4 rounded-full text-xs font-bold border border-white/20 bg-black/40 text-neutral-200">
                    {formData.venueName || "اسم القاعة"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Package Selection, Welcome Note & Checkout Progression */}
          {currentStep === 4 && (
            <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-8 animate-fadeIn">
              <div className="border-b border-[#d4af37]/20 pb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#d4af37]" />
                  <span>الخطوة 4: اختيار الباقة المناسبة والمراجعة</span>
                </h2>
                <span className="text-xs text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30">
                  دفع لمرة واحدة • بدون اشتراكات متكررة
                </span>
              </div>

              {/* Package Selection Cards */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-300 block text-right">
                  اختر الباقة المناسبة لحفلك:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(PACKAGES).map((pkg) => {
                    const isSelected = formData.packageTier === pkg.code;
                    return (
                      <div
                        key={pkg.code}
                        onClick={() => setFormData({ ...formData, packageTier: pkg.code })}
                        className={`rounded-2xl p-5 border text-right cursor-pointer transition-all relative flex flex-col justify-between ${
                          isSelected
                            ? "bg-[#1f1b15] border-[#d4af37] shadow-lg shadow-[#d4af37]/15 ring-2 ring-[#d4af37]/50"
                            : "bg-[#0d0c0a] border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        {pkg.isPopular && (
                          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-[10px]">
                            الأكثر اختياراً
                          </span>
                        )}

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-sm text-white calligraphy-font">{pkg.nameAr}</h4>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                isSelected ? "border-[#d4af37] bg-[#d4af37]" : "border-neutral-600"
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-[#0d0c0a] stroke-[3]" />}
                            </div>
                          </div>

                          <p className="text-[11px] text-neutral-400 mb-3">{pkg.taglineAr}</p>

                          <div className="flex items-baseline gap-1 mb-3">
                            <span className="text-2xl font-black text-[#f3e5ab] font-mono">{pkg.price}</span>
                            <span className="text-xs text-neutral-400">{pkg.currency}</span>
                          </div>

                          <ul className="space-y-1.5 text-[11px] text-neutral-300">
                            {pkg.features.slice(0, 4).map((f, i) => (
                              <li key={i} className="flex items-center gap-1.5">
                                <Check className="w-3 h-3 text-[#d4af37] shrink-0" />
                                <span className="line-clamp-1">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Welcome text & notes */}
              <div className="space-y-4 pt-2">
                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-neutral-300">رسالة الترحيب بالضيوف</label>
                  <input
                    type="text"
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                  />
                </div>

                <div className="space-y-1 text-right">
                  <label className="text-xs font-semibold text-neutral-300">
                    ملاحظات أو تنويهات خاصة للضيوف (اختياري)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="مثال: جنة الأطفال منازلهم، يرجى الالتزام بالموعد المحدد..."
                    className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right resize-none"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-black/40 border border-[#d4af37]/20 space-y-3 text-right">
                <h4 className="text-sm font-bold text-[#f3e5ab] flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37]" />
                    <span>ملخص طلب المناسبة</span>
                  </span>
                  <span className="font-mono text-[#d4af37] text-xs">
                    المستحق: {PACKAGES[formData.packageTier]?.price || 799} {PACKAGES[formData.packageTier]?.currency || "ج.م"}
                  </span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-300">
                  <div>
                    <span className="text-neutral-500 block">أصحاب الحفل:</span>
                    <span className="font-semibold text-white">{formData.groomName} و {formData.brideName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">القالب المعتمد:</span>
                    <span className="font-semibold text-[#f3e5ab]">{selectedTemplate.nameAr}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">الموعد:</span>
                    <span className="font-semibold text-white">{formData.eventDate || "غير محدد"}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block">الباقة المختارة:</span>
                    <span className="font-bold text-[#d4af37]">{PACKAGES[formData.packageTier]?.nameAr}</span>
                  </div>
                </div>
              </div>

              {/* Commercial progression notice */}
              <div className="p-4 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-xs text-[#f3e5ab] flex items-start gap-2.5 text-right">
                <ShieldCheck className="w-5 h-5 text-[#d4af37] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-white">الخطوة القادمة: الدفع الآمن ونشر بطاقة الدعوة</p>
                  <p className="text-neutral-400">
                    سيتم حفظ مناسبتك بأمان كمسودة، ثم نقلك لصفحة الدفع الآمن. فور تأكيد السداد ستتمكن فوراً من نشر الدعوة وتنزيل رمز الـ QR عالي الدقة ومشاركته مع الأهل والأحباب.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-4 gap-4">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="py-3 px-6 rounded-full bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-[#d4af37] font-semibold text-xs transition-all flex items-center gap-2"
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
                className="py-3.5 px-8 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-sm shadow-xl shadow-[#d4af37]/15 hover:brightness-110 transition-all flex items-center gap-2"
              >
                <span>المتابعة لاختيار الباقة</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="py-3.5 px-10 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-sm shadow-xl shadow-[#d4af37]/25 hover:brightness-110 transition-all flex items-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري حفظ المناسبة وتجهيز الدفع...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>حفظ والمتابعة للدفع ({PACKAGES[formData.packageTier]?.price || 799} ج.م)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
