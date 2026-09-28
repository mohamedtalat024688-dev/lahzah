"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  CreditCard,
  Sparkles,
  Lock,
  Loader2,
  AlertCircle,
  Share2,
  ExternalLink,
  Download,
  Copy,
  Check,
  Zap,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { PACKAGES, PackageTier } from "@/lib/packages";

interface EventData {
  id: string;
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venueName: string;
  isPaid: boolean;
  isPublished: boolean;
  packageTier: string;
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [event, setEvent] = useState<EventData | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>("PREMIUM");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [published, setPublished] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [urls, setUrls] = useState<{ invitation: string; upload: string; qr: string } | null>(null);
  const [gatewayInfo, setGatewayInfo] = useState<{ provider: string; isLive: boolean; modeNotice: string }>({
    provider: "SIMULATION",
    isLive: false,
    modeNotice: "بوابة المحاكاة التجريبية",
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // 1. Fetch Event and Checkout details
    fetch(`/api/events/${id}/checkout`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.event) {
          setEvent(data.event);
          const initialTier = searchParams.get("package")?.toUpperCase() || data.event.packageTier || "PREMIUM";
          if (PACKAGES[initialTier]) {
            setSelectedTier(initialTier);
          }
          if (data.paymentGateway) {
            setGatewayInfo(data.paymentGateway);
          }
          if (data.event.isPaid) {
            setPaymentSuccess(true);
          }
          if (data.event.isPublished) {
            setPublished(true);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Also check if returned from Paymob redirect
    if (searchParams.get("payment") === "success") {
      setPaymentSuccess(true);
    }
  }, [id, searchParams]);

  // Load URLs once paid
  useEffect(() => {
    if (paymentSuccess) {
      fetch(`/api/events/${id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.urls) {
            setUrls(data.urls);
          }
          if (data?.event?.isPublished) {
            setPublished(true);
          }
        });
    }
  }, [paymentSuccess, id]);

  const currentPkg: PackageTier = PACKAGES[selectedTier] || PACKAGES.PREMIUM;

  const handlePay = async () => {
    setPaying(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/events/${id}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageCode: selectedTier }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشلت عملية الدفع");
      }

      if (data.checkoutUrl) {
        // Real Paymob Redirect
        window.location.href = data.checkoutUrl;
        return;
      }

      // Simulation / Direct Verified Success
      setPaymentSuccess(true);
      if (data.event) {
        setEvent(data.event);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء معالجة الدفع";
      setErrorMessage(msg);
    } finally {
      setPaying(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/events/${id}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل نشر المناسبة");
      }

      setPublished(true);
      if (data.urls) {
        setUrls(data.urls);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء النشر";
      setErrorMessage(msg);
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyLink = () => {
    if (urls?.invitation) {
      navigator.clipboard.writeText(urls.invitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-20">
          <p className="text-lg">المناسبة غير موجودة</p>
          <Link href="/dashboard" className="text-[#d4af37] text-sm mt-2 inline-block">
            العودة للوحة التحكم
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between selection:bg-[#d4af37]/30 selection:text-[#f3e5ab]">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/dashboard/events/${id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#d4af37] bg-[#d4af37]/10 hover:bg-[#d4af37]/20 px-3.5 py-1.5 rounded-full border border-[#d4af37]/30 transition-all font-semibold"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لإدارة المناسبة</span>
          </Link>

          <span className="text-xs text-neutral-400 font-mono">
            {published ? "منشورة ونشطة" : paymentSuccess ? "مدفوعة وجاهزة للنشر" : "مسودة بانتظار الدفع"}
          </span>
        </div>

        {/* Commercial Step Tracker */}
        <div className="mb-8 p-4 rounded-2xl bg-[#14120e] border border-[#d4af37]/20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>1. إنشاء المناسبة</span>
            </div>
            <div className={`p-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 ${
              paymentSuccess
                ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                : "bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab]"
            }`}>
              {paymentSuccess ? <Check className="w-3.5 h-3.5" /> : <CreditCard className="w-3.5 h-3.5 text-[#d4af37]" />}
              <span>2. اختيار الباقة</span>
            </div>
            <div className={`p-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 ${
              paymentSuccess
                ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                : "bg-neutral-900 border border-neutral-800 text-neutral-400"
            }`}>
              {paymentSuccess ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
              <span>3. الدفع والتحقق</span>
            </div>
            <div className={`p-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 ${
              published
                ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-300"
                : paymentSuccess
                ? "bg-[#d4af37]/20 border border-[#d4af37]/50 text-[#f3e5ab] animate-pulse"
                : "bg-neutral-900 border border-neutral-800 text-neutral-400"
            }`}>
              {published ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />}
              <span>4. النشر والـ QR</span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE 3: EVENT PAID & PUBLISHED -> SHOW INVITATION LINK + QR + SHARE */}
        {/* ========================================================================= */}
        {published ? (
          <div className="bg-[#13110e] border border-emerald-500/40 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn text-right">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-bold calligraphy-font text-white">
                ألف مبروك! دعوتك منشورة الآن وجاهزة للمشاركة
              </h2>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                تم تفعيل باقة ({currentPkg.nameAr}) بنجاح. أصبحت بطاقة الدعوة التفاعلية ورمز الـ QR الخاص بجمع الصور نشطة فوراً لجميع ضيوفك.
              </p>
            </div>

            {/* Quick Actions Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-2xl bg-[#0a0908] border border-neutral-800">
              {/* QR Preview */}
              {urls?.qr && (
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl text-center shadow-xl border-2 border-[#d4af37]">
                  <Image
                    src={urls.qr}
                    alt="رمز QR للدعوة"
                    width={180}
                    height={180}
                    className="rounded-lg"
                  />
                  <span className="text-[11px] font-bold text-neutral-800 mt-2">
                    رمز QR المخصص لرفع الصور
                  </span>
                  <a
                    href={urls.qr}
                    download={`lahzah-qr-${event.slug}.png`}
                    className="mt-3 px-4 py-1.5 rounded-full bg-[#13110e] text-[#f3e5ab] text-[11px] font-bold border border-[#d4af37]/40 hover:bg-[#d4af37]/20 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل الـ QR عالي الجودة</span>
                  </a>
                </div>
              )}

              {/* Links & Sharing */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-neutral-400">رابط بطاقة الدعوة التفاعلية:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={urls?.invitation || ""}
                      className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono text-xs dir-ltr"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2.5 rounded-xl bg-[#d4af37] text-[#0d0c0a] font-bold text-xs hover:brightness-110 flex items-center gap-1 shrink-0"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "تم النسخ" : "نسخ"}</span>
                    </button>
                  </div>
                </div>

                {/* Share Actions */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `يسعدنا ويشرفنا حضوركم حفلنا ومشاركتنا أجمل اللحظات. رابط الدعوة الإلكترونية: ${urls?.invitation}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة عبر واتساب (WhatsApp)</span>
                  </a>

                  <Link
                    href={`/e/${event.slug}`}
                    target="_blank"
                    className="w-full py-3 rounded-full bg-[#1b1915] border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37]/20 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                  >
                    <span>فتح ومعاينة بطاقة الدعوة المنشورة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/dashboard/events/${id}`}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                  >
                    <span>الانتقال للوحة إدارة الحفل وتأكيد الحضور (RSVP)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : paymentSuccess ? (
          /* ========================================================================= */
          /* STATE 2: PAID BUT NOT YET PUBLISHED -> READY TO PUBLISH BUTTON            */
          /* ========================================================================= */
          <div className="bg-[#13110e] border border-[#d4af37]/40 rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn text-right">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold calligraphy-font text-white">
                تم استلام الدفع وتأكيد الحجز بنجاح!
              </h2>
              <p className="text-xs text-neutral-300 max-w-lg mx-auto">
                باقة ({currentPkg.nameAr}) مفعلة لمناسبتك. خطوتك الأخيرة هي الضغط على زر النشر لإطلاق بطاقة الدعوة ورمز الـ QR ليتمكن الضيوف من الوصول إليها وتأكيد الحضور.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] text-neutral-400 block">المناسبة جاهزة للنشر:</span>
                <span className="font-bold text-white text-sm">{event.groomName} & {event.brideName}</span>
                <span className="text-xs text-[#d4af37] block font-mono">الباقة: {currentPkg.nameAr} ({currentPkg.price} ج.م)</span>
              </div>

              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-sm shadow-xl shadow-[#d4af37]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {publishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري نشر المناسبة وتوليد الـ QR...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>نشر بطاقة الدعوة وتفعيل الـ QR الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STATE 1: UNPAID DRAFT -> CHOOSE PACKAGE & COMPLETE SECURE CHECKOUT        */
          /* ========================================================================= */
          <div className="space-y-8">
            {/* Header info */}
            <div className="bg-[#13110e] border border-[#d4af37]/25 rounded-3xl p-6 sm:p-8 space-y-4 text-right">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <span className="text-[11px] text-amber-400 font-bold bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30 inline-block mb-1">
                    مسودة غير منشورة
                  </span>
                  <h2 className="text-2xl font-bold calligraphy-font text-white">
                    إتمام الطلب وتفعيل دعوة {event.groomName} و {event.brideName}
                  </h2>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-xs text-neutral-400 block font-mono">
                    تاريخ الحفل: {new Date(event.eventDate).toLocaleDateString("ar-EG")}
                  </span>
                  <span className="text-xs text-neutral-400 block">{event.venueName}</span>
                </div>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                اختر الباقة المناسبة لمناسبتك لإتمام عملية الدفع وتفعيل الدعوة التفاعلية والـ QR فوراً. الدفع آمن ومحمي 100%.
              </p>
            </div>

            {/* Package Selector */}
            <div className="space-y-3 text-right">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                <span>اختر باقة التفعيل:</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.values(PACKAGES).map((pkg) => {
                  const isSelected = selectedTier === pkg.code;
                  return (
                    <div
                      key={pkg.code}
                      onClick={() => setSelectedTier(pkg.code)}
                      className={`rounded-2xl p-5 border text-right cursor-pointer transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#1e1a14] border-[#d4af37] shadow-xl shadow-[#d4af37]/15 ring-2 ring-[#d4af37]/60"
                          : "bg-[#110f0c] border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      {pkg.isPopular && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-[10px]">
                          الأكثر اختياراً
                        </span>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-bold text-base text-white calligraphy-font">{pkg.nameAr}</h4>
                          <div
                            className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                              isSelected ? "border-[#d4af37] bg-[#d4af37]" : "border-neutral-600"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 text-[#0d0c0a] stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-[11px] text-neutral-400 mb-3">{pkg.taglineAr}</p>

                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-3xl font-black text-[#f3e5ab] font-mono">{pkg.price}</span>
                          <span className="text-xs text-neutral-400">{pkg.currency}</span>
                        </div>

                        <ul className="space-y-2 text-xs text-neutral-300">
                          {pkg.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Invoice & Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Methods */}
              <div className="bg-[#13110e] border border-neutral-800 rounded-3xl p-6 space-y-4 text-right">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-[#d4af37]" />
                  <span>طريقة الدفع الآمنة</span>
                </h3>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-black/40 border border-[#d4af37]/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          البطاقات البنكية والمحافظ الإلكترونية
                        </span>
                        <span className="text-[10px] text-neutral-400 block">
                          فيزا، ماستركارد، ميزة، فودافون كاش
                        </span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      مفعل
                    </span>
                  </div>

                  {/* Mode indicator */}
                  <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{gatewayInfo.modeNotice}</span>
                    </div>
                    <p className="text-[10px] text-neutral-500">
                      {gatewayInfo.isLive
                        ? "يتم تشفير وتأكيد المعاملات مباشرة عبر بوابة Paymob المرخصة من البنك المركزي المصري بمعايير PCI-DSS العالمية."
                        : "وضع التطوير والمحاكاة: يوفر لك تجربة كاملة وفورية لتدفق الدفع وتفعيل الباقة والنشر بدون سحب حقيقي."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Breakdown */}
              <div className="bg-[#13110e] border border-neutral-800 rounded-3xl p-6 space-y-4 text-right flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white mb-4">ملخص الفاتورة</h3>

                  <div className="space-y-2 text-xs divide-y divide-neutral-800/80">
                    <div className="flex justify-between items-center pb-2">
                      <span className="text-neutral-400">الباقة المختارة:</span>
                      <span className="font-bold text-white">{currentPkg.nameAr}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-neutral-400">سعر الباقة الأساسي:</span>
                      <span className="font-mono text-neutral-200">{currentPkg.price} ج.م</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-neutral-400">الضرائب والمصاريف الإدارية:</span>
                      <span className="font-mono text-emerald-400">0.00 ج.م (مجاناً)</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 text-sm">
                      <span className="font-bold text-white">الإجمالي المستحق:</span>
                      <span className="font-mono font-black text-xl text-[#f3e5ab]">
                        {currentPkg.price} {currentPkg.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handlePay}
                    disabled={paying}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-sm shadow-xl shadow-[#d4af37]/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>جاري الاتصال ببوابة الدفع...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current" />
                        <span>تأكيد الحجز والدفع الآن ({currentPkg.price} ج.م)</span>
                      </>
                    )}
                  </button>

                  <span className="text-[10px] text-neutral-500 text-center block mt-2">
                    دفع آمن ومحمي 100% • تفعيل فوري وبدون اشتراكات متجددة
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
