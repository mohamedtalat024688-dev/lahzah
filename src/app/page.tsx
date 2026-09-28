"use client";

import Link from "next/link";
import {
  Sparkles,
  Heart,
  QrCode,
  Camera,
  CheckCircle,
  ArrowLeft,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { TEMPLATES } from "@/lib/templates";
import { PACKAGES } from "@/lib/packages";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0908] text-white selection:bg-[#d4af37]/30 selection:text-[#f3e5ab] overflow-x-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-radial from-[#d4af37]/15 via-[#aa7c11]/5 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#10b981]/10 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161411] border border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/10 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="text-xs font-semibold text-[#f3e5ab]">
              المنصة الأولى لدعوات وتوثيق ذكريات الزفاف في الوطن العربي
            </span>
          </div>

          {/* Master Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight calligraphy-font leading-tight sm:leading-snug">
              من دعوة… <span className="gold-shimmer">إلى ذكرى لا تُنسى</span>
            </h1>
            <p className="text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
              ليست مجرد بطاقة دعوة إلكترونية. امنح ضيوفك تجربة ساحرة من لحظة استلام الدعوة، وحتى التقاط ومشاركة صور الحفل عبر الـ QR في ألبوم ذكريات حي يخلّد ليلة العمر.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-base shadow-xl shadow-[#d4af37]/25 hover:brightness-110 hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <span>صمم بطاقتك الآن مجاناً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/e/ahmed-and-sara"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#161411] border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37]/20 font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
              <span>معاينة دعوة حية (زفاف أحمد وسارة)</span>
            </Link>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-2xl mx-auto border-t border-[#d4af37]/15 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#f3e5ab] font-mono">+1,200</span>
              <p className="text-xs text-neutral-400 mt-1">حفل زفاف وخطوبة</p>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">+85,000</span>
              <p className="text-xs text-neutral-400 mt-1">صورة وثّقها الضيوف</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono">100%</span>
              <p className="text-xs text-neutral-400 mt-1">بدون تطبيق للضيوف</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works & Features */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div id="how-it-works" className="scroll-mt-20" />
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs text-[#d4af37] font-bold uppercase tracking-wider">
            دورة حياة الحفل المتكاملة
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold calligraphy-font text-white">
            رحلتك مع لحظة من البداية وحتى ما بعد الحفل
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Phase 1 */}
          <div className="bg-[#12100d] border border-[#d4af37]/25 rounded-3xl p-8 relative hover:border-[#d4af37]/60 transition-all duration-300 shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-[#d4af37] tracking-wider block mb-2">
              المرحلة الأولى: قبل الحفل
            </span>
            <h3 className="text-xl font-bold text-white mb-3 calligraphy-font">
              دعوة رقمية فاخرة وإدارة الحضور
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              اختر قالباً ملكياً، أضف موقع الحفل على الخريطة والعد التنازلي، وشارك الرابط على الواتساب. يتلقى ضيوفك الدعوة ويؤكدون حضورهم وعدد مرافقيهم بضغطة زر.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="bg-[#12100d] border border-[#d4af37]/25 rounded-3xl p-8 relative hover:border-[#d4af37]/60 transition-all duration-300 shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <QrCode className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-emerald-400 tracking-wider block mb-2">
              المرحلة الثانية: ليلة الحفل
            </span>
            <h3 className="text-xl font-bold text-white mb-3 calligraphy-font">
              رمز QR على الطاولات وتوثيق فوري
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              يمسح الضيوف الرمز بكاميرا هواتفهم لرفع الصور العفوية والتهاني مباشرة دون إنشاء حساب. تصلك الصور فوراً في لوحة تحكمك لتعمل على اعتمادها ونشرها.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="bg-[#12100d] border border-[#d4af37]/25 rounded-3xl p-8 relative hover:border-[#d4af37]/60 transition-all duration-300 shadow-xl group">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Camera className="w-7 h-7" />
            </div>
            <span className="text-xs font-bold text-rose-400 tracking-wider block mb-2">
              المرحلة الثالثة: بعد الحفل
            </span>
            <h3 className="text-xl font-bold text-white mb-3 calligraphy-font">
              ألبوم ذكريات رقمي خالد
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              تتحول صفحة الدعوة إلى معرض صور تفاعلي رائع يجمع زوايا الحفل المختلفة من عيون كل ضيوفك، مع إمكانية التنزيل بدقة أصلية للأبد.
            </p>
          </div>
        </div>
      </section>

      {/* Templates Showcase */}
      <section id="templates" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-900 scroll-mt-20">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs text-[#d4af37] font-bold uppercase tracking-wider">
            أناقة وفخامة تليق بك
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold calligraphy-font text-white">
            قوالب ملكية مصممة خصيصاً للمناسبات العربية
          </h2>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto">
            مجموعة منتقاة من أروع التصاميم التي تلائم مختلف الأذواق من الفخامة الكلاسيكية وحتى المودرن الهادئ.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(TEMPLATES).map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-[#13110e] border border-[#d4af37]/25 hover:border-[#d4af37]/70 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#d4af37]/20 text-[#f3e5ab]">
                    {tmpl.styleTag}
                  </span>
                  <div
                    className="w-4 h-4 rounded-full border border-white/30"
                    style={{ backgroundColor: tmpl.theme.accentColor }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-white calligraphy-font mb-2">{tmpl.nameAr}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{tmpl.descriptionAr}</p>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-800 flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-mono">{tmpl.nameEn}</span>
                <Link
                  href="/e/ahmed-and-sara"
                  className="text-xs text-[#d4af37] font-bold hover:underline flex items-center gap-1"
                >
                  <span>معاينة حية</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Packages */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-900 scroll-mt-20">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs text-[#d4af37] font-bold uppercase tracking-wider">
            باقات شفافة وبسيطة
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold calligraphy-font text-white">
            اختر الباقة الأنسب لليلة العمر
          </h2>
          <p className="text-xs text-neutral-400 max-w-lg mx-auto">
            جميع الباقات تشمل بطاقة الدعوة التفاعلية، وتأكيد الحضور، ورمز الـ QR المخصص.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.values(PACKAGES).map((pkg) => (
            <div
              key={pkg.code}
              className={`rounded-3xl p-8 flex flex-col justify-between border transition-all relative ${
                pkg.isPopular
                  ? "bg-[#181512] border-[#d4af37] shadow-2xl shadow-[#d4af37]/15 ring-1 ring-[#d4af37]"
                  : "bg-[#13110e] border-neutral-800"
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-xs shadow-md">
                  الباقة الأكثر طلباً
                </span>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white calligraphy-font">{pkg.nameAr}</h3>
                <p className="text-xs text-neutral-400 mt-1 mb-6">{pkg.taglineAr}</p>

                <div className="flex items-baseline gap-1 my-4">
                  <span className="text-4xl font-extrabold text-[#f3e5ab] font-mono">
                    {pkg.price}
                  </span>
                  <span className="text-xs text-neutral-400">{pkg.currency}</span>
                </div>

                <ul className="space-y-3 text-xs text-neutral-300 my-8">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href="/auth/register"
                className={`w-full py-3.5 rounded-full font-bold text-xs text-center transition-all ${
                  pkg.isPopular
                    ? "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] hover:brightness-110 shadow-lg"
                    : "bg-[#201d18] text-[#f3e5ab] border border-[#d4af37]/40 hover:bg-[#d4af37]/20"
                }`}
              >
                اختر {pkg.nameAr}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-[#1f1a14] via-[#16130f] to-[#1a1510] border border-[#d4af37]/40 rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#d4af37] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-[#d4af37]" />
            <span>ليلة العمر تستحق الأفضل</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold calligraphy-font text-white leading-tight">
            ابدأ بتصميم بطاقتك وتوثيق ذكرياتك اليوم
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto">
            انضم لمئات العرسان الذين اختاروا لحظة لتحويل فرحتهم إلى ألبوم حي ينبض بالحب والجمال.
          </p>

          <div className="pt-2">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-sm shadow-xl hover:brightness-110 transition-all"
            >
              <span>أنشئ بطاقتك الآن مجاناً</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
