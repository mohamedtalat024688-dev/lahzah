"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
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
import RealisticInvitationCard from "@/components/templates/RealisticInvitationCard";

interface EventData {
  id: string;
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  eventType?: string;
  eventDate: string;
  venueName: string;
  address?: string;
  welcomeMessage?: string;
  templateId?: string;
  isPaid: boolean;
  isPublished: boolean;
  packageTier: string;
}

export default function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();

  const [event, setEvent] = useState<EventData | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>("PREMIUM");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(
    () => searchParams.get("payment") === "success"
  );
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
  }, [id, searchParams]);

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
        throw new Error(data.error || "فشل بدء عملية الدفع");
      }

      if (data.gatewayUrl) {
        window.location.href = data.gatewayUrl;
        return;
      }

      if (data.success && data.payment?.status === "PAID") {
        setPaymentSuccess(true);
        if (data.urls) setUrls(data.urls);
        if (data.event?.isPublished) setPublished(true);
      } else {
        throw new Error("لم تكتمل عملية الدفع");
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
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل نشر المناسبة");
      }

      setPublished(true);
      if (data.urls) setUrls(data.urls);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء محاولة النشر";
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
      <div className="min-h-screen bg-[#FFF8F4] flex items-center justify-center text-[#390E19]">
        <Loader2 className="w-8 h-8 animate-spin text-[#790D20]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#FFF8F4] text-[#493B3B] flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-24 space-y-3">
          <p className="text-base text-[#8B7778]">المناسبة غير موجودة</p>
          <Link href="/dashboard" className="text-[#790D20] text-xs hover:underline inline-block font-semibold">
            العودة للوحة التحكم
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F4] text-[#493B3B] flex flex-col justify-between selection:bg-[#790D20]/15 selection:text-[#390E19] font-sans">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href={`/dashboard/events/${id}`}
            className="inline-flex items-center gap-1.5 text-xs text-[#8B7778] hover:text-[#790D20] transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            <span>العودة لاستوديو المناسبة</span>
          </Link>

          <span className="text-[11px] text-[#390E19] font-semibold bg-[#FFFDFC] px-3 py-1 rounded-full border border-[#EFE4DC]">
            {published ? "منشورة ونشطة" : paymentSuccess ? "مدفوعة وجاهزة للنشر" : "مسودة بانتظار الدفع"}
          </span>
        </div>

        {/* Commercial Step Tracker */}
        <div className="mb-8 p-3 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-[#F0F7EE] border border-[#C5DEC0] text-[#2E6827] font-semibold flex items-center justify-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#5B9C51]" />
              <span>1. إنشاء المناسبة</span>
            </div>
            <div
              className={`p-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 ${
                paymentSuccess
                  ? "bg-[#F0F7EE] border border-[#C5DEC0] text-[#2E6827]"
                  : "bg-[#F1DEDF]/50 border border-[#D8B8B8] text-[#390E19]"
              }`}
            >
              {paymentSuccess ? <Check className="w-3.5 h-3.5 text-[#5B9C51]" /> : <CreditCard className="w-3.5 h-3.5 text-[#790D20]" />}
              <span>2. اختيار الباقة</span>
            </div>
            <div
              className={`p-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 ${
                paymentSuccess
                  ? "bg-[#F0F7EE] border border-[#C5DEC0] text-[#2E6827]"
                  : "bg-[#FFFDFC] border border-[#EFE4DC] text-[#8B7778]"
              }`}
            >
              {paymentSuccess ? <Check className="w-3.5 h-3.5 text-[#5B9C51]" /> : <Lock className="w-3.5 h-3.5 text-[#8B7778]" />}
              <span>3. الدفع الآمن</span>
            </div>
            <div
              className={`p-2 rounded-xl font-semibold flex items-center justify-center gap-1.5 ${
                published
                  ? "bg-[#F0F7EE] border border-[#C5DEC0] text-[#2E6827]"
                  : paymentSuccess
                  ? "bg-[#F1DEDF]/50 border border-[#D8B8B8] text-[#390E19]"
                  : "bg-[#FFFDFC] border border-[#EFE4DC] text-[#8B7778]"
              }`}
            >
              {published ? <Check className="w-3.5 h-3.5 text-[#5B9C51]" /> : <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />}
              <span>4. النشر والـ QR</span>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F1DEDF]/50 border border-[#D8B8B8] text-[#790D20] text-xs flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-[#790D20] shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STATE 3: PUBLISHED */}
        {published ? (
          <div className="bg-[#FFFDFC] border border-[#C5DEC0] rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn text-right shadow-sm">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#F0F7EE] border border-[#C5DEC0] text-[#2E6827] flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8 text-[#5B9C51]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#390E19]">
                ألف مبروك! دعوتكم منشورة الآن وجاهزة للمشاركة
              </h2>
              <p className="text-xs text-[#8B7778] max-w-md mx-auto leading-relaxed">
                تم تفعيل باقة ({currentPkg.nameAr}) بنجاح. أصبحت بطاقة الدعوة التفاعلية ورمز الـ QR الخاص
                بجمع الصور نشطة فوراً لجميع ضيوفكم.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 rounded-2xl bg-[#FFF9F5] border border-[#EFE4DC]">
              {/* QR Preview */}
              {urls?.qr && (
                <div className="flex flex-col items-center justify-center p-6 bg-[#FFFDFC] rounded-2xl text-center shadow-md border border-[#EFE4DC]">
                  <Image
                    src={urls.qr}
                    alt="رمز QR للدعوة"
                    width={180}
                    height={180}
                    className="rounded-lg"
                  />
                  <span className="text-[11px] font-bold text-[#390E19] mt-2">
                    رمز الـ QR المخصص لرفع الصور
                  </span>
                  <a
                    href={urls.qr}
                    download={`lahzah-qr-${event.slug}.png`}
                    className="mt-3 px-4 py-2 min-h-[44px] rounded-full bg-[#790D20] text-white text-[11px] font-bold hover:bg-[#390E19] flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>تنزيل الـ QR للطباعة</span>
                  </a>
                </div>
              )}

              {/* Links & Sharing */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#390E19]">
                    رابط بطاقة الدعوة التفاعلية:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={urls?.invitation || ""}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#EFE4DC] text-[#493B3B] font-mono text-xs dir-ltr"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-4 py-2 min-h-[40px] rounded-xl bg-[#790D20] text-white font-bold text-xs hover:bg-[#390E19] flex items-center gap-1 shrink-0 shadow-sm transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "تم النسخ" : "نسخ"}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2.5">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `يسعدنا ويشرفنا حضوركم حفلنا ومشاركتنا أجمل اللحظات. رابط الدعوة الإلكترونية: ${urls?.invitation}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 min-h-[44px] rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>مشاركة عبر واتساب (WhatsApp)</span>
                  </a>

                  <Link
                    href={`/e/${event.slug}`}
                    target="_blank"
                    className="w-full py-3 min-h-[44px] rounded-full bg-[#FFFDFC] border border-[#EFE4DC] text-[#390E19] hover:border-[#790D20] font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>معاينة بطاقة الدعوة الحية</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#D6B77A]" />
                  </Link>

                  <Link
                    href={`/dashboard/events/${id}`}
                    className="w-full py-3 min-h-[44px] rounded-full bg-[#790D20] hover:bg-[#390E19] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>الانتقال لاستوديو إدارة الحفل وتأكيد الحضور (RSVP)</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : paymentSuccess ? (
          /* STATE 2: PAID BUT NOT PUBLISHED */
          <div className="bg-[#FFFDFC] border border-[#C5DEC0] rounded-3xl p-6 sm:p-10 space-y-8 animate-fadeIn text-right shadow-sm">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[#F0F7EE] border border-[#C5DEC0] text-[#2E6827] flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-8 h-8 text-[#5B9C51]" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#390E19]">
                تم استلام الدفع وتأكيد الحجز بنجاح!
              </h2>
              <p className="text-xs text-[#8B7778] max-w-lg mx-auto">
                باقة ({currentPkg.nameAr}) مفعلة لمناسبتكم. اضغط على زر النشر لإطلاق بطاقة الدعوة وتفعيل
                رمز الـ QR فوراً.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#EFE4DC] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] text-[#8B7778] block">المناسبة جاهزة للنشر:</span>
                <span className="font-bold font-serif text-[#390E19] text-base">
                  {event.groomName} & {event.brideName}
                </span>
                <span className="text-xs text-[#D6B77A] block font-mono font-semibold">
                  الباقة: {currentPkg.nameAr} ({currentPkg.price} ج.م)
                </span>
              </div>

              <button
                onClick={handlePublish}
                disabled={publishing}
                className="w-full sm:w-auto px-8 py-3.5 min-h-[44px] rounded-full bg-[#790D20] hover:bg-[#390E19] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
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
          /* STATE 1: UNPAID DRAFT -> SELECT PACKAGE & PAY */
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* INVITATION PREVIEW COLUMN (Desktop 5 cols) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="text-right">
                  <span className="text-xs font-serif tracking-wide text-[#D6B77A] uppercase block font-semibold">
                    بطاقة دعوتكم
                  </span>
                  <p className="text-xs text-[#8B7778]">
                    هذه المعاينة الحية لبطاقتكم التي ستُنشر فور إتمام السداد
                  </p>
                </div>

                <div className="sticky top-6">
                  <RealisticInvitationCard
                    templateId={event.templateId || "890434e0-e5a6-4bf5-a367-309aa074414d"}
                    groomName={event.groomName}
                    brideName={event.brideName}
                    eventDate={event.eventDate}
                    venueName={event.venueName}
                    address={event.address}
                    welcomeMessage={event.welcomeMessage}
                    eventType={event.eventType}
                    interactive={false}
                    className="w-full shadow-xl"
                  />
                </div>
              </div>

              {/* PACKAGE SELECTION & PAYMENT COLUMN (Desktop 7 cols) */}
              <div className="lg:col-span-7 space-y-6 text-right">
                {/* Header info */}
                <div className="bg-[#FFFDFC] border border-[#EFE4DC] rounded-3xl p-6 space-y-2 shadow-sm">
                  <span className="text-[11px] text-[#790D20] font-semibold bg-[#F1DEDF]/50 px-2.5 py-0.5 rounded-full border border-[#D8B8B8] inline-block">
                    مسودة بانتظار السداد
                  </span>
                  <h2 className="text-2xl font-bold font-serif text-[#390E19]">
                    اختر باقة التفعيل وانشر دعوتكم
                  </h2>
                  <p className="text-xs text-[#8B7778] leading-relaxed">
                    اختر الباقة المناسبة لمناسبتكم لإتمام عملية السداد وتفعيل الدعوة التفاعلية والـ QR فوراً.
                    الدفع مشفر وآمن 100%.
                  </p>
                </div>

                {/* Package Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-semibold text-[#390E19] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
                    <span>اختر الباقة:</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {Object.values(PACKAGES).map((pkg) => {
                      const isSelected = selectedTier === pkg.code;
                      return (
                        <div
                          key={pkg.code}
                          onClick={() => setSelectedTier(pkg.code)}
                          className={`rounded-2xl p-4 border text-right cursor-pointer transition-all relative flex flex-col justify-between ${
                            isSelected
                              ? "bg-[#F1DEDF]/40 border-[#790D20] ring-1 ring-[#790D20]/30 shadow-md"
                              : "bg-[#FFFDFC] border-[#EFE4DC] hover:border-[#D6B77A] shadow-sm"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <h4 className="font-bold text-sm font-serif text-[#390E19]">
                                {pkg.nameAr}
                              </h4>
                              <div
                                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? "border-[#790D20] bg-[#790D20]" : "border-[#EFE4DC]"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                              </div>
                            </div>

                            <p className="text-[10px] text-[#8B7778] mb-2">{pkg.taglineAr}</p>

                            <div className="flex items-baseline gap-1 mb-3">
                              <span className="text-2xl font-black text-[#390E19] font-mono">
                                {pkg.price}
                              </span>
                              <span className="text-[10px] text-[#8B7778]">{pkg.currency}</span>
                            </div>

                            <ul className="space-y-1.5 text-[11px] text-[#493B3B]">
                              {pkg.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="flex items-start gap-1">
                                  <Check className="w-3 h-3 text-[#790D20] shrink-0 mt-0.5" />
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

                {/* Invoice Breakdown & Payment Button */}
                <div className="bg-[#FFFDFC] border border-[#EFE4DC] rounded-3xl p-6 space-y-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#EFE4DC] pb-3">
                    <span className="text-xs text-[#8B7778]">ملخص التكلفة:</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black font-mono text-[#790D20]">
                        {currentPkg.price}
                      </span>
                      <span className="text-xs text-[#390E19] font-semibold">جنيه مصري</span>
                    </div>
                  </div>

                  {/* Payment Gateway Info Badge */}
                  <div className="p-3 rounded-xl bg-[#FFF9F5] border border-[#EFE4DC] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#D6B77A]" />
                      <span className="text-[#390E19] font-semibold">بطاقات بنكية / فودافون كاش / إنستاباي</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F0F7EE] border border-[#C5DEC0] text-[#2E6827] font-semibold">
                      {gatewayInfo.provider}
                    </span>
                  </div>

                  {/* Main Action: ادفع وانشر دعوتك */}
                  <div className="space-y-2 pt-1">
                    <button
                      onClick={handlePay}
                      disabled={paying}
                      className="w-full py-4 min-h-[44px] rounded-full bg-[#790D20] hover:bg-[#390E19] text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                    >
                      {paying ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري معالجة الدفع...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 fill-current" />
                          <span>ادفع وانشر دعوتك ({currentPkg.price} ج.م)</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-[#8B7778]">
                      <Lock className="w-3 h-3 text-[#D6B77A]" />
                      <span>دفع إلكتروني فوري وآمن 100% • بدون أي مصاريف خفية</span>
                    </div>
                  </div>
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
