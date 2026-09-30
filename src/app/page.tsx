"use client";

import Link from "next/link";
import {
  CheckCircle,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { TEMPLATES } from "@/lib/templates";
import { PACKAGES } from "@/lib/packages";
import RealisticInvitationCard from "@/components/templates/RealisticInvitationCard";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#faf8f5] selection:bg-[#c5a880]/30 selection:text-[#faf8f5] overflow-x-hidden font-body">
      <Navbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: ASYMMETRIC TWO-COLUMN EDITORIAL COMPOSITION              */}
      {/* ========================================================================= */}
      <section className="relative pt-12 sm:pt-16 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle Ambient Atmosphere */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-radial from-[#c5a880]/10 via-[#181613]/5 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* RIGHT COLUMN (RTL): Editorial Copy & CTAs (6 cols) */}
          <div className="lg:col-span-6 space-y-8 text-right">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181613] border border-[#2c2821] text-[11px] text-[#c5a880] tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
              <span>استوديو دعوات الزفاف التفاعلية وتوثيق الذكريات</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight font-display text-[#faf8f5] leading-[1.18]">
                من دعوة… <br />
                <span className="italic font-normal text-[#c5a880]">إلى ذكرى لا تُنسى.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#b8b0a2] font-light leading-relaxed max-w-xl">
                أكثر من مجرد بطاقة دعوة. تجربة متكاملة تبدأ ببطاقة زفاف تفاعلية ساحرة، وتعيش مع ضيوفك
                ليلة الحفل لتجمع صورهم وتهانيهم في ألبوم ذكريات حي يدوم للأبد.
              </p>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Link
                href="/dashboard/events/new"
                className="px-8 py-4 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-sm hover:bg-[#d8bd96] shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <span>صمّم دعوتك الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                href="/preview?template=royal-gold"
                className="px-7 py-4 rounded-full bg-[#161412] border border-[#2e2924] text-[#faf8f5] hover:border-[#c5a880]/60 font-medium text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>شاهد نموذجًا حيّاً</span>
                <ExternalLink className="w-4 h-4 text-[#c5a880]" />
              </Link>
            </div>

            {/* Product Benefits (Real, Honest, Wedding-Centric) */}
            <div className="pt-6 border-t border-[#1f1d19] grid grid-cols-3 gap-4 text-right">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#faf8f5] block">تصاميم ملكية</span>
                <p className="text-[11px] text-[#8e877c] leading-tight">هويات بصرية مستوحاة من فخامة المناسبات العربية</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#faf8f5] block">رمز QR للطاولات</span>
                <p className="text-[11px] text-[#8e877c] leading-tight">يمسحه الضيوف بكاميراتهم لرفع الصور دون أي تطبيق</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#faf8f5] block">ألبوم ذكريات حي</span>
                <p className="text-[11px] text-[#8e877c] leading-tight">لوحة مراجعة للعروسين لاعتماد الصور وتخليدها</p>
              </div>
            </div>
          </div>

          {/* LEFT COLUMN (RTL): LARGE REALISTIC DIGITAL INVITATION (6 cols) */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Background ambient halo */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#c5a880]/20 via-[#c5a880]/5 to-transparent rounded-[3rem] blur-2xl opacity-60 pointer-events-none" />

              {/* The Realistic Invitation Showcase Card */}
              <RealisticInvitationCard
                templateId="royal-gold"
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
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TEMPLATE GALLERY: VISUAL INVITATION DESIGNS (NOT GENERIC CARDS)       */}
      {/* ========================================================================= */}
      <section id="templates" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1c1916]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-display tracking-widest text-[#c5a880] uppercase block">
            مجموعة القوالب الملكية
          </span>
          <h2 className="text-3xl sm:text-5xl font-bold font-display text-[#faf8f5]">
            تصاميم تحاكي فخامة مناسبتكم
          </h2>
          <p className="text-sm text-[#8e877c] font-light">
            كل قالب يتميز بهوية لونية وزخرفية مستقلة صُممت بعناية لتناسب ذوقكم الرفيع
          </p>
        </div>

        {/* Gallery Grid of Realistic Invitations (Stationery Presentation) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 items-start">
          {Object.values(TEMPLATES).map((tmpl) => (
            <div
              key={tmpl.id}
              className="group flex flex-col items-center transition-all duration-300"
            >
              {/* Template Identity Caption */}
              <div className="w-full flex items-center justify-between mb-4 px-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold font-display text-lg text-[#faf8f5]">
                      {tmpl.nameAr}
                    </h3>
                    {tmpl.tier === "LUXURY" && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f5d77f] border border-[#d4af37]/50 uppercase tracking-wider">
                        VIP فاخر
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#c5a880] font-display mt-0.5">{tmpl.taglineAr}</p>
                </div>
                <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#171412] text-[#c5a880] border border-[#2e2924]">
                  {tmpl.styleTag}
                </span>
              </div>

              {/* Realistic Invitation Paper (Dominates the view directly) */}
              <div className="w-full transition-transform duration-500 group-hover:-translate-y-1.5">
                <RealisticInvitationCard
                  templateId={tmpl.id}
                  groomName="أحمد منصور"
                  brideName="سارة الجوهري"
                  venueName="قاعة البلازا الفاخرة"
                  interactive={false}
                  className="w-full"
                />
              </div>

              {/* Minimal Floating Actions */}
              <div className="w-full mt-5 flex items-center gap-3 px-1">
                <Link
                  href={`/dashboard/events/new?template=${tmpl.id}`}
                  className="flex-1 py-2.5 px-4 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8bd96] transition-all text-center shadow-sm"
                >
                  استخدم هذا التصميم
                </Link>

                <Link
                  href={`/preview?template=${tmpl.id}`}
                  className="py-2.5 px-4 rounded-full bg-[#171412] border border-[#2e2924] text-[#8e877c] hover:text-[#faf8f5] text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>معاينة حية</span>
                  <ExternalLink className="w-3 h-3 text-[#c5a880]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. HOW IT WORKS: 3-STEP WEDDING LIFECYCLE                                */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1c1916]">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-display tracking-widest text-[#c5a880] uppercase block">
            تجربة لا تُنسى
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#faf8f5]">
            كيف تعمل منصة لحظة معكم؟
          </h2>
          <p className="text-xs sm:text-sm text-[#8e877c]">
            رحلة مصممة بعناية فائقة لترافقكم من أول دعوة تُرسل حتى تخليد آخر صورة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-[#141210] border border-[#26221d] rounded-3xl p-8 space-y-4 text-right">
            <span className="font-mono text-3xl font-light text-[#c5a880]">01</span>
            <h3 className="text-xl font-bold font-display text-[#faf8f5]">
              صمم بطاقتك وشارك الرابط
            </h3>
            <p className="text-xs text-[#8e877c] leading-relaxed">
              اختر القالب الملكي، حدد الموعد وموقع القاعة عبر خرائط جوجل، وشارك الرابط المخصص مع الأهل
              والأصدقاء عبر الواتساب بنقرة واحدة مع تأكيد الحضور الفوري (RSVP).
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[#141210] border border-[#26221d] rounded-3xl p-8 space-y-4 text-right">
            <span className="font-mono text-3xl font-light text-[#c5a880]">02</span>
            <h3 className="text-xl font-bold font-display text-[#faf8f5]">
              ضع رمز الـ QR على الطاولات
            </h3>
            <p className="text-xs text-[#8e877c] leading-relaxed">
              اطبع بطاقة الطاولة الأنيقة المتضمنة رمز الـ QR عالي الدقة. ليلة الحفل، يمسح الضيوف الرمز
              بكاميرا هواتفهم لرفع صورهم وتهانيهم العفوية مباشرة دون تثبيت تطبيقات.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[#141210] border border-[#26221d] rounded-3xl p-8 space-y-4 text-right">
            <span className="font-mono text-3xl font-light text-[#c5a880]">03</span>
            <h3 className="text-xl font-bold font-display text-[#faf8f5]">
              ألبوم ذكرياتكم الحي للأبد
            </h3>
            <p className="text-xs text-[#8e877c] leading-relaxed">
              راجع الصور واعتمدها بنقرة واحدة لتظهر في ألبوم الذكريات العام، وقم بتنزيل كافة اللقطات
              بأعلى دقة أصلية لتخلد فرحتكم في ألبوم ذكريات رقمي فاخر لا يضيع.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. TRANSPARENT PRICING                                                   */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1c1916]">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-display tracking-widest text-[#c5a880] uppercase block">
            باقات واضحة وبسيطة
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#faf8f5]">
            دفع لمرة واحدة • بدون اشتراكات متجددة
          </h2>
          <p className="text-xs sm:text-sm text-[#8e877c]">
            سعر ثابت شامل تصميم الدعوة، استضافة الحفل، وجمع الذكريات
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
          {Object.values(PACKAGES).map((pkg) => {
            const isPopular = pkg.isPopular;
            return (
              <div
                key={pkg.code}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all text-right relative ${
                  isPopular
                    ? "bg-[#171412] border-[#c5a880] shadow-xl shadow-black/80"
                    : "bg-[#141210] border-[#26221d]"
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-[10px]">
                    الأكثر اختياراً
                  </span>
                )}

                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold font-display text-[#faf8f5]">
                      {pkg.nameAr}
                    </h3>
                    <p className="text-xs text-[#8e877c]">{pkg.taglineAr}</p>
                  </div>

                  <div className="flex items-baseline gap-1 py-2">
                    <span className="text-4xl font-extrabold font-mono text-[#faf8f5]">
                      {pkg.price}
                    </span>
                    <span className="text-xs text-[#8e877c]">{pkg.currency}</span>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#c4bdaf] pt-2 border-t border-[#1c1916]">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#c5a880] shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link
                    href={`/dashboard/events/new?package=${pkg.code}`}
                    className={`w-full py-3.5 rounded-full font-bold text-xs text-center transition-all flex items-center justify-center gap-1.5 ${
                      isPopular
                        ? "bg-[#c5a880] text-[#0c0b0a] hover:bg-[#d8bd96] shadow-sm"
                        : "bg-[#1a1714] text-[#faf8f5] border border-[#2e2924] hover:border-[#3d3630]"
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
      {/* 5. FINAL EMOTIONAL INVITATION CTA                                        */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-bold font-display text-[#faf8f5]">
          ابدأ اليوم بتصميم بطاقة تليق بليلة العمر
        </h2>
        <p className="text-sm text-[#8e877c] max-w-lg mx-auto leading-relaxed">
          انضم لمئات العرسان الذين وثقوا أسعد لحظاتهم وشاركوا فرحتهم بكل فخامة وسهولة
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-2 px-9 py-4 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-sm hover:bg-[#d8bd96] shadow-md transition-all"
          >
            <span>ابدأ تصميم بطاقة دعوتك الآن</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
