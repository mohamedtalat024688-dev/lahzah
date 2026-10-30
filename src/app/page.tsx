"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  ChevronLeft,
  Check,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import CelebrationPetals from "@/components/ui/CelebrationPetals";
import InteractiveHeroInvitation from "@/components/home/InteractiveHeroInvitation";
import { fireCelebrationConfetti } from "@/components/ui/ConfettiEffect";
import { TEMPLATES } from "@/lib/templates";
import { PACKAGES } from "@/lib/packages";
import RealisticInvitationCard from "@/components/templates/RealisticInvitationCard";

export default function HomePage() {
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>("ALL");

  const templatesList = Object.values(TEMPLATES);

  const filteredTemplates = templatesList.filter((tmpl) => {
    if (selectedStyleFilter === "ALL") return true;
    if (selectedStyleFilter === "CLASSIC")
      return tmpl.style === "classic" || tmpl.style === "aristocratic";
    if (selectedStyleFilter === "ROMANTIC")
      return tmpl.style === "romantic" || tmpl.style === "botanical";
    if (selectedStyleFilter === "MINIMAL")
      return tmpl.style === "minimal" || tmpl.style === "couture";
    if (selectedStyleFilter === "HERITAGE")
      return tmpl.style === "heritage" || tmpl.style === "craft";
    return true;
  });

  const handleCtaClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    fireCelebrationConfetti({ x, y });
  };

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#493B3B] selection:bg-[#790D20]/15 selection:text-[#390E19] overflow-x-hidden font-body">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: EDITORIAL WEDDING ATELIER COMPOSITION                    */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 pb-20 sm:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <CelebrationPetals />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* RIGHT COLUMN (RTL): Evocative Arabic Headline & Value Proposition (5 cols) */}
          <div className="lg:col-span-5 space-y-7 text-right">
            {/* Fine Hairline Burgundy & Champagne Tag */}
            <div className="flex items-center gap-3 text-[11px] font-serif uppercase tracking-widest text-[#790D20]">
              <span className="w-8 h-[1px] bg-[#790D20]" />
              <span>لحظة • أتيلييه الدعوات والذكريات</span>
            </div>

            {/* Emotional, Memorable Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif text-[#390E19] leading-[1.2]">
                كل حكاية جميلة <br />
                <span className="text-[#790D20] italic font-normal">تبدأ بدعوة استثنائية.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#6E5D59] font-normal leading-relaxed max-w-lg">
                صمّموا دعوتكم الرقمية الفاخرة التي تليق بليلة العمر، شاركوها بلمسة واحدة مع أحبابكم على واتساب، واجمعوا أجمل صور وتهاني ليلة الفرح في ألبوم حي لا يُنسى.
              </p>
            </div>

            {/* Unmistakable Primary CTA & Editorial Secondary Link */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <Link
                href="/dashboard/events/new"
                onClick={handleCtaClick}
                className="px-8 py-4 rounded-full bg-[#790D20] hover:bg-[#630A19] text-white font-bold text-sm shadow-[0_10px_25px_-3px_rgba(121,13,32,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 min-h-[48px]"
              >
                <span>اصنع دعوتك الآن</span>
                <ArrowLeft className="w-4 h-4 text-[#D8B8B8]" />
              </Link>

              <Link
                href="#designs"
                className="px-6 py-4 text-xs font-semibold text-[#493B3B] hover:text-[#790D20] transition-colors flex items-center justify-center gap-1.5"
              >
                <span>اكتشف التصاميم</span>
                <ChevronLeft className="w-4 h-4 text-[#790D20]" />
              </Link>
            </div>

            {/* Three Authentic Value Foundations */}
            <div className="pt-7 border-t border-[#EFE4DC] grid grid-cols-3 gap-4 text-right">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#390E19] block">تأكيد الحضور (RSVP)</span>
                <p className="text-[11px] text-[#8B7778] leading-relaxed">
                  تأكيد الأفراد بضغطة واحدة
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#390E19] block">رمز QR للطاولات</span>
                <p className="text-[11px] text-[#8B7778] leading-relaxed">
                  مسح مباشر بكاميرا الهاتف
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#390E19] block">ألبوم ذكريات حي</span>
                <p className="text-[11px] text-[#8B7778] leading-relaxed">
                  حفظ الصور بأعلى دقة أصلية
                </p>
              </div>
            </div>
          </div>

          {/* LEFT COLUMN (RTL): Interactive Cinematic Wedding Invitation Browser Showcase (7 cols) */}
          <div className="lg:col-span-7 relative flex justify-center w-full">
            <InteractiveHeroInvitation />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. THE LAHZAH EXPERIENCE: TWO-ACT EDITORIAL NARRATIVE                     */}
      {/* ========================================================================= */}
      <section id="experience" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#EFE4DC]">
        {/* Section Header */}
        <div className="max-w-2xl text-right mb-16 space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-serif uppercase tracking-widest text-[#790D20]">
            <span className="w-8 h-[1px] bg-[#790D20]" />
            <span>٠١ / التجربة الكاملة</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#390E19]">
            من وصول الدعوة… إلى ختام ليلة العمر
          </h2>
          <p className="text-sm text-[#8B7778] leading-relaxed">
            صممنا لحظة لتجمع بين فخامة القرطاسية المترفة وسهولة التقنية الرقمية
          </p>
        </div>

        {/* Two-Act Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Act I: The Digital Invitation */}
          <div className="bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between text-right shadow-soft-sm relative overflow-hidden">
            <div className="space-y-6">
              <span className="font-serif text-3xl text-[#D6B77A] font-light">الفصل الأول</span>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#390E19]">
                  بطاقة دعوة تفاعلية تصل لأحبابكم على واتساب
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5D59] leading-relaxed">
                  تصل رسالة الدعوة بأسمائكم وصياغة راقية تليق بالمقام. بلمسة واحدة يفتح الضيف بطاقة زفافكم التفاعلية،
                  ليجد تفاصيل الحفل، وعداداً تنازلياً لموعد ليلتكم، وموقع القاعة على خرائط جوجل، مع زر فوري لتأكيد الحضور وعدد المرافقين.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 pt-4 border-t border-[#EFE4DC] text-xs text-[#493B3B] font-semibold">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#790D20]" />
                  <span>تأكيد الحضور التلقائي (RSVP) مع حصر عدد الأفراد بدقة</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#790D20]" />
                  <span>توجيه فوري لموقع القاعة عبر خرائط Google Maps</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#790D20]" />
                  <span>إمكانية إضافة موعد الحفل إلى تقويم هاتف الضيف بنقرة زر</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/preview?template=royal-gold"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#790D20] hover:text-[#630A19] transition-colors"
              >
                <span>شاهد نموذجاً حياً لبطاقة الدعوة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Act II: The Live Memories & QR */}
          <div className="bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2.5rem] p-8 sm:p-12 flex flex-col justify-between text-right shadow-soft-sm relative overflow-hidden">
            <div className="space-y-6">
              <span className="font-serif text-3xl text-[#790D20] font-light">الفصل الثاني</span>
              <div className="space-y-2">
                <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#390E19]">
                  رمز الـ QR للطاولات وألبوم الذكريات الحي
                </h3>
                <p className="text-xs sm:text-sm text-[#6E5D59] leading-relaxed">
                  اطبعوا بطاقات الطاولة الأنيقة المتضمنة رمز الـ QR. أثناء الحفل، يمسح ضيوفكم الكود بكاميرات هواتفهم لرفع صورهم العفوية ومقاطع الفرح دون تثبيت أي برامج، لتصل إلى لوحة تحكمكم لاعتمادها وتنزيلها بالكامل بأعلى دقة.
                </p>
              </div>

              {/* Feature Checklist */}
              <ul className="space-y-3 pt-4 border-t border-[#EFE4DC] text-xs text-[#493B3B] font-semibold">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3D7A42]" />
                  <span>بطاقة طاولة جاهزة للطباعة بصيغتي PNG و SVG للمطابع</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3D7A42]" />
                  <span>خصوصية تامة: أنتم من يعتمد الصور قبل ظهورها في الألبوم العام</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3D7A42]" />
                  <span>تنزيل كامل الألبوم الأصلي بعد انتهاء الفرح لتخليده للأبد</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Link
                href="/dashboard/events/new"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#790D20] hover:text-[#630A19] transition-colors"
              >
                <span>ابدأ بتجهيز بطاقة زفافكم ورمز الـ QR</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TEMPLATE ATELIER: CURATED WEDDING STYLES                              */}
      {/* ========================================================================= */}
      <section id="designs" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#EFE4DC]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 text-right">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3 text-[11px] font-serif uppercase tracking-widest text-[#790D20]">
              <span className="w-8 h-[1px] bg-[#790D20]" />
              <span>٠٢ / أتيليه التصاميم</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#390E19]">
              تصاميم صُممت بروح الفخامة
            </h2>
            <p className="text-sm text-[#8B7778]">
              كل قالب يعكس شخصية مختلفة من أرقى مراسم الأعراس الملكية والعصرية
            </p>
          </div>

          {/* Typographic Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            {[
              { id: "ALL", label: "جميع التصاميم" },
              { id: "CLASSIC", label: "ملوكي" },
              { id: "ROMANTIC", label: "رومانسي" },
              { id: "MINIMAL", label: "عصري" },
              { id: "HERITAGE", label: "تراثي" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStyleFilter(tab.id)}
                className={`px-4 py-2 rounded-full transition-all min-h-[40px] ${
                  selectedStyleFilter === tab.id
                    ? "bg-[#790D20] text-white shadow-soft-sm"
                    : "bg-white text-[#8B7778] border border-[#EFE4DC] hover:text-[#790D20]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 items-start">
          {filteredTemplates.map((tmpl) => (
            <div
              key={tmpl.id}
              className="group flex flex-col bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2rem] p-5 shadow-soft-sm hover:shadow-soft-md transition-all duration-500"
            >
              {/* Template Header Info */}
              <div className="w-full flex items-center justify-between mb-4 px-2 text-right">
                <div>
                  <h3 className="font-bold font-serif text-lg text-[#390E19]">
                    {tmpl.nameAr}
                  </h3>
                  <span className="text-[11px] text-[#790D20] font-serif block">
                    {tmpl.taglineAr}
                  </span>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#FFF9F5] text-[#8B7778] border border-[#EFE4DC]">
                  {tmpl.styleTag}
                </span>
              </div>

              {/* Realistic Invitation Paper Preview */}
              <div className="w-full transition-transform duration-500 group-hover:-translate-y-1">
                <RealisticInvitationCard
                  templateId={tmpl.id}
                  groomName="أحمد منصور"
                  brideName="سارة الجوهري"
                  venueName="فندق الفورسيزونز - قاعة البلازا"
                  interactive={false}
                  className="w-full shadow-[0_8px_20px_rgba(57,14,25,0.1)]"
                />
              </div>

              {/* Card Actions */}
              <div className="w-full mt-6 flex items-center gap-2.5 px-1">
                <Link
                  href={`/dashboard/events/new?template=${tmpl.id}`}
                  className="flex-1 py-3 px-4 rounded-full bg-[#790D20] hover:bg-[#630A19] text-white font-bold text-xs shadow-soft-xs transition-all text-center min-h-[44px] flex items-center justify-center"
                >
                  اختيار هذا التصميم
                </Link>

                <Link
                  href={`/preview?template=${tmpl.id}`}
                  className="py-3 px-4 rounded-full bg-white border border-[#EFE4DC] text-[#493B3B] hover:text-[#790D20] hover:border-[#790D20] text-xs font-semibold transition-all flex items-center gap-1.5 min-h-[44px]"
                >
                  <span>معاينة</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#D6B77A]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. THE 3-STEP FLOW: CLEAR, REASSURING STEPS                               */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#EFE4DC]">
        {/* Section Header */}
        <div className="max-w-xl text-right mb-16 space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-serif uppercase tracking-widest text-[#790D20]">
            <span className="w-8 h-[1px] bg-[#790D20]" />
            <span>٠٣ / كيف نعمل</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#390E19]">
            رحلتكم مع لحظة في ثلاث خطوات
          </h2>
          <p className="text-sm text-[#8B7778]">
            صممنا المنصة لتكون غاية في البساطة والسرعة لكما ولضيوفكما
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2rem] p-8 sm:p-10 space-y-4 text-right shadow-soft-xs">
            <span className="font-serif text-4xl font-light text-[#D6B77A] block">٠١</span>
            <h3 className="text-xl font-bold font-serif text-[#390E19]">
              اختر التصميم وخصّص التفاصيل
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5D59] leading-relaxed">
              اختر قالباً يعبر عن ذوقكما، أدخل أسماء العروسين، الموعد، ورابط القاعة على الخريطة في أقل من دقيقتين.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2rem] p-8 sm:p-10 space-y-4 text-right shadow-soft-xs">
            <span className="font-serif text-4xl font-light text-[#790D20] block">٠٢</span>
            <h3 className="text-xl font-bold font-serif text-[#390E19]">
              شارك الدعوة واطبع الـ QR
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5D59] leading-relaxed">
              أرسل رابط الدعوة الفاخر عبر الواتساب مع تأكيد الحضور الفوري، واطبع بطاقات الطاولة برمز الـ QR الخاص بحفلكم.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2rem] p-8 sm:p-10 space-y-4 text-right shadow-soft-xs">
            <span className="font-serif text-4xl font-light text-[#3D7A42] block">٠٣</span>
            <h3 className="text-xl font-bold font-serif text-[#390E19]">
              اجمع اللحظات وخلد الذكريات
            </h3>
            <p className="text-xs sm:text-sm text-[#6E5D59] leading-relaxed">
              يرفع الضيوف صورهم ليلة الحفل بكاميراتهم، تراجعون اللقطات وتعتمدونها، وتحفظون الألبوم بالكامل بخصوصية تامة للأبد.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PRICING AS A BESPOKE COMMISSION MENU                                   */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#EFE4DC]">
        {/* Section Header */}
        <div className="max-w-xl text-right mb-16 space-y-2">
          <div className="flex items-center gap-3 text-[11px] font-serif uppercase tracking-widest text-[#790D20]">
            <span className="w-8 h-[1px] bg-[#790D20]" />
            <span>٠٤ / الباقات والاستثمار</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold font-serif text-[#390E19]">
            باقات واضحة • استثمار لمرة واحدة
          </h2>
          <p className="text-sm text-[#8B7778]">
            سعر ثابت شامل تصميم الدعوة، وتأكيد الحضور، واستضافة الصور ليلة العمر دون أي اشتراكات متكررة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {Object.values(PACKAGES).map((pkg) => {
            const isPopular = pkg.isPopular;
            return (
              <div
                key={pkg.code}
                className={`rounded-[2.2rem] p-7 sm:p-9 flex flex-col justify-between border text-right transition-all relative ${
                  isPopular
                    ? "bg-[#FFFDFC] border-[#790D20] shadow-[0_15px_35px_-5px_rgba(121,13,32,0.2)] scale-[1.02] z-10"
                    : "bg-[#FFFDFC] border-[#EFE4DC] shadow-soft-xs"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#790D20] text-white font-bold text-[11px] shadow-sm">
                    الأكثر طلباً للأعراس ✦
                  </span>
                )}

                <div className="space-y-5">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold font-serif text-[#390E19]">
                      {pkg.nameAr}
                    </h3>
                    <p className="text-xs text-[#8B7778]">{pkg.taglineAr}</p>
                  </div>

                  <div className="flex items-baseline gap-1 py-1">
                    <span className="text-4xl font-extrabold font-mono text-[#390E19]">
                      {pkg.price}
                    </span>
                    <span className="text-xs font-semibold text-[#8B7778]">{pkg.currency}</span>
                  </div>

                  <ul className="space-y-3 text-xs text-[#493B3B] pt-4 border-t border-[#EFE4DC]">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#790D20] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={`/dashboard/events/new?package=${pkg.code}`}
                    className={`w-full py-3.5 rounded-full font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 min-h-[46px] ${
                      isPopular
                        ? "bg-[#790D20] text-white hover:bg-[#630A19] shadow-soft-xs"
                        : "bg-[#FFF9F5] text-[#390E19] border border-[#EFE4DC] hover:border-[#790D20]"
                    }`}
                  >
                    <span>اختر {pkg.nameAr}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. EDITORIAL CLOSING STATEMENT IN DEEP WINE                               */}
      {/* ========================================================================= */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-br from-[#390E19] via-[#4A0A16] to-[#270810] text-white rounded-[3rem] p-10 sm:p-16 shadow-[0_25px_60px_-15px_rgba(57,14,25,0.4)] space-y-6 relative overflow-hidden">
          {/* Subtle Champagne Radial Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-radial from-[#D6B77A]/15 to-transparent blur-3xl pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <span className="text-xs font-serif uppercase tracking-widest text-[#D6B77A] block font-semibold">
              ليلة الفرح لا تتكرر
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold font-serif text-white leading-tight">
              ابدأوا اليوم بدعوة تليق بمقام ليلتكم
            </h2>
            <p className="text-sm text-[#D8B8B8] max-w-lg mx-auto leading-relaxed">
              انضموا إلى عائلات وثقت أسعد لحظاتها وشاركت بهجة ليلة زفافها برقي وسهولة مع لحظة
            </p>
          </div>

          <div className="pt-4 relative z-10">
            <Link
              href="/dashboard/events/new"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#790D20] text-white font-bold text-sm hover:bg-[#9B1A31] shadow-[0_10px_25px_-3px_rgba(121,13,32,0.5)] hover:scale-105 active:scale-95 transition-all min-h-[48px]"
            >
              <span>ابدأ تصميم دعوتك الآن</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
