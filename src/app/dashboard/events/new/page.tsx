"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Check,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { TEMPLATES } from "@/lib/templates";

export default function NewEventPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    eventType: "WEDDING",
    groomName: "",
    brideName: "",
    eventDate: "",
    eventTime: "20:00",
    venueName: "",
    address: "",
    mapUrl: "",
    welcomeMessage: "يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا",
    description: "",
    templateId: "royal-gold",
    customSlug: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.groomName || !formData.brideName || !formData.eventDate || !formData.venueName) {
      setErrorMessage("يرجى ملء جميع الحقول المطلوبة (أسماء العروسين، التاريخ، واسم القاعة)");
      return;
    }

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
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل إنشاء المناسبة");
      }

      router.push(`/dashboard/events/${data.event.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء الإنشاء";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 px-3 py-1.5 rounded-full border border-[#d4af37]/30 transition-all font-semibold"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة للوحة التحكم</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center sm:text-right">
          <h1 className="text-3xl font-bold calligraphy-font text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#d4af37]" />
            <span>تصميم بطاقة دعوة جديدة</span>
          </h1>
          <p className="text-xs text-[#d4af37]/80 mt-1">
            أدخل تفاصيل مناسبتك واختر القالب الملكي المناسب لليلة العمر
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 text-xs bg-red-950/60 border border-red-500/40 text-red-200 rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Card 1: Event Type & Names */}
          <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-[#d4af37]/20 pb-3 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#d4af37]" />
              <span>1. نوع المناسبة وأسماء أصحاب الحفل</span>
            </h2>

            {/* Type selector */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "WEDDING", label: "حفل زفاف" },
                { id: "ENGAGEMENT", label: "حفل خطوبة" },
                { id: "CELEBRATION", label: "مناسبة خاصة" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, eventType: t.id })}
                  className={`py-3 rounded-2xl border text-xs font-semibold transition-all ${
                    formData.eventType === t.id
                      ? "border-[#d4af37] bg-[#d4af37]/15 text-[#f3e5ab]"
                      : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-semibold text-neutral-300">اسم العريس الكريم *</label>
                <input
                  type="text"
                  required
                  value={formData.groomName}
                  onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                  placeholder="مثال: أحمد منصور"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Date, Time & Venue */}
          <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-[#d4af37]/20 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#d4af37]" />
              <span>2. الموعد والمكان</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 text-right">
                <label className="text-xs font-semibold text-neutral-300">تاريخ الحفل *</label>
                <input
                  type="date"
                  required
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white focus:outline-none focus:border-[#d4af37] text-sm text-right"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-semibold text-neutral-300">وقت بدء الحفل *</label>
                <input
                  type="time"
                  required
                  value={formData.eventTime}
                  onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white focus:outline-none focus:border-[#d4af37] text-sm text-right"
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
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                />
              </div>

              <div className="space-y-1 text-right">
                <label className="text-xs font-semibold text-neutral-300">العنوان بالتفصيل</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="مثال: كورنيش النيل، القاهرة"
                  className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
                />
              </div>
            </div>

            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-neutral-300">
                رابط الموقع على خرائط جوجل (Google Maps URL)
              </label>
              <input
                type="url"
                value={formData.mapUrl}
                onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                placeholder="https://maps.google.com/?q=..."
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
              />
            </div>
          </div>

          {/* Card 3: Invitation Text */}
          <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-[#d4af37]/20 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>3. رسالة الدعوة والترحيب</span>
            </h2>

            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-neutral-300">عبارة الترحيب الرئيسية</label>
              <input
                type="text"
                value={formData.welcomeMessage}
                onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                placeholder="يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
              />
            </div>

            <div className="space-y-1 text-right">
              <label className="text-xs font-semibold text-neutral-300">
                تفاصيل أو ملاحظات إضافية (اختياري)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="مثال: يرجى الحضور في الموعد المحدد، جنة الأطفال منازلهم..."
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right resize-none"
              />
            </div>
          </div>

          {/* Card 4: Template Selector */}
          <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-[#d4af37]/20 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
              <span>4. اختيار القالب والتصميم الفاخر</span>
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

                    <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20"
                        style={{ backgroundColor: tmpl.theme.accentColor }}
                      />
                      <span className="text-[10px] text-neutral-400">{tmpl.nameEn}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-base shadow-xl shadow-[#d4af37]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري إنشاء المناسبة وتوليد الـ QR...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>نشر بطاقة الدعوة وتوليد الـ QR</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
}
