"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ExternalLink,
  Users,
  Camera,
  CheckCircle,
  XCircle,
  Trash2,
  Download,
  Share2,
  Loader2,
  Check,
  ShieldAlert,
  CreditCard,
  Sparkles,
  PauseCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { PACKAGES } from "@/lib/packages";
import { TEMPLATES } from "@/lib/templates";
import RealisticInvitationCard from "@/components/templates/RealisticInvitationCard";

interface EventDetails {
  id: string;
  slug: string;
  title: string;
  eventType: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venueName: string;
  address: string;
  mapUrl?: string | null;
  welcomeMessage?: string | null;
  description?: string | null;
  templateId: string;
  isPublished: boolean;
  isPaid: boolean;
  packageTier: string;
  rsvps: Array<{
    id: string;
    guestName: string;
    phone?: string | null;
    attendanceStatus: string;
    guestCount: number;
    note?: string | null;
    createdAt: string;
  }>;
  photos: Array<{
    id: string;
    url: string;
    guestName?: string | null;
    message?: string | null;
    status: string;
    createdAt: string;
  }>;
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [urls, setUrls] = useState<{ invitation: string; upload: string; qr: string } | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "photos" | "rsvps" | "qr" | "package">(
    "overview"
  );
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upgradeSuccess] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("payment") === "success") {
        return "تم تأكيد وسداد الباقة بنجاح! أصبحت دعوتكم جاهزة للنشر الآن.";
      }
    }
    return null;
  });
  const [publishMessage, setPublishMessage] = useState<string | null>(null);

  const fetchEventData = () => {
    fetch(`/api/events/${id}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.event) {
          setEvent(data.event);
          setUrls(data.urls);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEventData();
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      if (sp.get("payment") === "failed") {
        alert("لم تكتمل عملية الدفع أو تم إلغاؤها. يمكنك المحاولة مجدداً في أي وقت.");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handlePublish = async () => {
    setPublishLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/publish`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "فشل نشر المناسبة");
        return;
      }
      setPublishMessage("تم نشر بطاقة الدعوة وتفعيل الـ QR بنجاح! ✨");
      fetchEventData();
      setTimeout(() => setPublishMessage(null), 5000);
    } catch {
      alert("حدث خطأ أثناء محاولة النشر");
    } finally {
      setPublishLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm("هل أنت متأكد من رغبتك في إيقاف نشر الدعوة مؤقتاً؟ لن يتمكن الضيوف من فتحها."))
      return;
    setPublishLoading(true);
    try {
      const res = await fetch(`/api/events/${id}/unpublish`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "فشل إيقاف النشر");
        return;
      }
      setPublishMessage("تم إيقاف النشر وتحويل المناسبة إلى مسودة خاصة.");
      fetchEventData();
      setTimeout(() => setPublishMessage(null), 5000);
    } catch {
      alert("حدث خطأ أثناء محاولة إيقاف النشر");
    } finally {
      setPublishLoading(false);
    }
  };

  const handleModeratePhoto = async (photoId: string, status: "APPROVED" | "REJECTED") => {
    setActionLoading(photoId);
    try {
      const res = await fetch(`/api/photos/${photoId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setEvent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            photos: prev.photos.map((p) => (p.id === photoId ? { ...p, status } : p)),
          };
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الصورة نهائياً؟")) return;
    setActionLoading(photoId);
    try {
      const res = await fetch(`/api/photos/${photoId}/status`, { method: "DELETE" });
      if (res.ok) {
        setEvent((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            photos: prev.photos.filter((p) => p.id !== photoId),
          };
        });
      }
    } finally {
      setActionLoading(null);
    }
  };

  const copyInvitationLink = () => {
    if (urls?.invitation) {
      navigator.clipboard.writeText(urls.invitation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0b0a] flex items-center justify-center text-[#faf8f5]">
        <Loader2 className="w-8 h-8 animate-spin text-[#c5a880]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0c0b0a] text-[#faf8f5] flex flex-col justify-between">
        <Navbar />
        <div className="text-center py-24 space-y-3">
          <p className="text-base text-[#8e877c]">المناسبة غير موجودة أو تم حذفها</p>
          <Link
            href="/dashboard"
            className="text-[#c5a880] hover:underline text-xs inline-block font-medium"
          >
            العودة للوحة التحكم
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const pendingPhotos = event.photos.filter((p) => p.status === "PENDING");
  const approvedPhotos = event.photos.filter((p) => p.status === "APPROVED");
  const attendingGuests = event.rsvps
    .filter((r) => r.attendanceStatus === "ATTENDING")
    .reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#faf8f5] flex flex-col justify-between selection:bg-[#c5a880]/30 selection:text-[#f5f2eb]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Header Breadcrumb & Status */}
        <div className="mb-8 pb-6 border-b border-[#26221d] flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-[#8e877c] hover:text-[#c5a880] transition-colors mb-1"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لجميع المناسبات</span>
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold font-display text-[#faf8f5] tracking-wide">
                {event.groomName} <span className="text-[#c5a880] font-normal font-serif">&</span>{" "}
                {event.brideName}
              </h1>
              {!event.isPaid ? (
                <span className="px-3 py-1 rounded-full bg-[#291717] border border-[#522525] text-[#fca5a5] text-xs font-medium flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#f87171]" />
                  <span>مسودة غير مدفوعة</span>
                </span>
              ) : !event.isPublished ? (
                <span className="px-3 py-1 rounded-full bg-[#2a241a] border border-[#4d3d22] text-[#fcd34d] text-xs font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#fcd34d]" />
                  <span>مدفوعة • بانتظار النشر</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-[#16271c] border border-[#23482d] text-[#86efac] text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#86efac]" />
                  <span>منشورة ومتاحة للضيوف</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-[#8e877c] pt-1">
              <span>{event.venueName}</span>
              <span>•</span>
              <span>
                {new Date(event.eventDate).toLocaleDateString("ar-EG", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Quick Studio Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!event.isPaid ? (
              <Link
                href={`/dashboard/events/${event.id}/checkout?package=${event.packageTier}`}
                className="px-5 py-2.5 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>سداد الباقة وتفعيل الدعوة</span>
              </Link>
            ) : !event.isPublished ? (
              <button
                onClick={handlePublish}
                disabled={publishLoading}
                className="px-5 py-2.5 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center gap-1.5 shadow-sm"
              >
                {publishLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>نشر بطاقة الدعوة الآن</span>
              </button>
            ) : (
              <button
                onClick={handleUnpublish}
                disabled={publishLoading}
                className="px-4 py-2 rounded-full bg-[#171412] border border-[#2e2924] text-[#8e877c] hover:text-[#f87171] hover:border-[#522525] text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>إيقاف النشر مؤقتاً</span>
              </button>
            )}

            {event.isPublished && (
              <button
                onClick={copyInvitationLink}
                className="px-4 py-2 rounded-full bg-[#171412] border border-[#2e2924] text-[#c5a880] hover:border-[#c5a880] text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#86efac]" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                <span>{copied ? "تم النسخ!" : "نسخ الرابط"}</span>
              </button>
            )}

            <Link
              href={`/e/${event.slug}`}
              target="_blank"
              className="px-4 py-2 rounded-full bg-[#171412] border border-[#2e2924] hover:border-[#3d3630] text-[#faf8f5] text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <span>معاينة كرت الدعوة</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
            </Link>
          </div>
        </div>

        {/* Notifications and Banners */}
        {!event.isPaid ? (
          <div className="mb-6 p-4 rounded-2xl bg-[#1f1716] border border-[#4a2422] text-[#fca5a5] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[#f87171] shrink-0" />
              <span>
                <strong>هذه المناسبة مسودة غير مدفوعة:</strong> رابط الدعوة ورمز الـ QR غير متاحين
                للضيوف حتى إتمام الدفع ونشر المناسبة.
              </span>
            </div>
            <Link
              href={`/dashboard/events/${event.id}/checkout?package=${event.packageTier}`}
              className="px-5 py-2.5 min-h-[44px] rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all shrink-0 text-center shadow-sm flex items-center justify-center"
            >
              الانتقال لصفحة الدفع
            </Link>
          </div>
        ) : !event.isPublished ? (
          <div className="mb-6 p-4 rounded-2xl bg-[#1c1a15] border border-[#423824] text-[#fcd34d] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-[#c5a880] shrink-0" />
              <span>
                <strong>تم سداد الباقة بنجاح!</strong> مناسبتكم جاهزة للنشر الآن ليتمكن المدعوون من
                الوصول لبطاقة الدعوة وتأكيد الحضور ومشاركة الصور.
              </span>
            </div>
            <button
              onClick={handlePublish}
              disabled={publishLoading}
              className="px-5 py-2.5 min-h-[44px] rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all shrink-0 text-center shadow-sm flex items-center justify-center"
            >
              نشر الدعوة والـ QR الآن
            </button>
          </div>
        ) : null}

        {publishMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#142318] border border-[#23482d] text-[#86efac] text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-[#86efac] shrink-0" />
            <span>{publishMessage}</span>
          </div>
        )}

        {upgradeSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-[#142318] border border-[#23482d] text-[#86efac] text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-[#86efac] shrink-0" />
            <span>{upgradeSuccess}</span>
          </div>
        )}

        {/* Tab Navigation (Minimal Line Style) */}
        <div className="flex items-center gap-2 border-b border-[#26221d] pb-2 mb-8 overflow-x-auto text-xs">
          {[
            { id: "overview", label: "نظرة عامة والبيانات" },
            {
              id: "photos",
              label: `ألبوم الذكريات (${pendingPhotos.length} معلقة)`,
              badge: pendingPhotos.length > 0 ? pendingPhotos.length : undefined,
            },
            { id: "rsvps", label: `تأكيدات الحضور (${event.rsvps.length})` },
            { id: "qr", label: "رمز الـ QR وبطاقة الطاولة" },
            { id: "package", label: `باقة المناسبة (${event.packageTier})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2.5 rounded-full transition-all shrink-0 flex items-center gap-2 ${
                activeTab === tab.id
                  ? "bg-[#c5a880] text-[#0c0b0a] font-bold shadow-sm"
                  : "bg-[#141210] text-[#8e877c] hover:text-[#faf8f5] hover:bg-[#1c1916]"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-4 h-4 rounded-full bg-[#f87171] text-black font-extrabold text-[10px] flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#141210] border border-[#26221d] space-y-1">
                <span className="text-[11px] text-[#8e877c] block">الضيوف المؤكد حضورهم</span>
                <span className="text-2xl font-bold font-mono text-[#faf8f5]">
                  {attendingGuests} فرد
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-[#141210] border border-[#26221d] space-y-1">
                <span className="text-[11px] text-[#8e877c] block">إجمالي ردود الـ RSVP</span>
                <span className="text-2xl font-bold font-mono text-[#faf8f5]">
                  {event.rsvps.length} رد
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-[#141210] border border-[#26221d] space-y-1">
                <span className="text-[11px] text-[#8e877c] block">صور بانتظار الاعتماد</span>
                <span className="text-2xl font-bold font-mono text-[#c5a880]">
                  {pendingPhotos.length} صورة
                </span>
              </div>
              <div className="p-5 rounded-2xl bg-[#141210] border border-[#26221d] space-y-1">
                <span className="text-[11px] text-[#8e877c] block">ذكريات منشورة بالمعرض</span>
                <span className="text-2xl font-bold font-mono text-[#faf8f5]">
                  {approvedPhotos.length} ذكرى
                </span>
              </div>
            </div>

            {/* Pending Photos Prompt */}
            {pendingPhotos.length > 0 && (
              <div className="p-5 rounded-2xl bg-[#1c1814] border border-[#3d3223] flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-[#faf8f5] text-sm flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-[#c5a880]" />
                    <span>يوجد {pendingPhotos.length} صور جديدة شاركها الضيوف</span>
                  </h4>
                  <p className="text-xs text-[#8e877c]">
                    راجع الصور واعتمدها لتظهر فوراً في معرض ذكريات الحفل الحي.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("photos")}
                  className="px-5 py-2 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-colors shadow-sm"
                >
                  مراجعة الصور الآن
                </button>
              </div>
            )}

            {/* Event Studio Details & Live Card Showcase */}
            <div className="bg-[#141210] border border-[#26221d] rounded-3xl p-6 sm:p-10 relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
                {/* Left/Preview Column (5 cols) */}
                <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
                  <div className="w-full max-w-sm">
                    <RealisticInvitationCard
                      templateId={event.templateId}
                      groomName={event.groomName}
                      brideName={event.brideName}
                      eventDate={event.eventDate}
                      venueName={event.venueName}
                      address={event.address}
                      welcomeMessage={event.welcomeMessage}
                      eventType={event.eventType}
                      interactive={false}
                      className="w-full shadow-2xl"
                    />
                  </div>
                </div>

                {/* Right/Info Column (7 cols) */}
                <div className="lg:col-span-7 space-y-6 text-right order-1 lg:order-2">
                  <div>
                    <span className="text-xs font-display tracking-widest text-[#c5a880] uppercase block">
                      بطاقة المناسبة المعتمدة
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#faf8f5] mt-1">
                      {event.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-[#0c0b0a] border border-[#26221d] space-y-1">
                      <span className="text-[#8e877c] text-[11px] block">القالب المعتمد:</span>
                      <span className="font-bold text-[#c5a880]">
                        {TEMPLATES[event.templateId]?.nameAr || event.templateId}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0c0b0a] border border-[#26221d] space-y-1">
                      <span className="text-[#8e877c] text-[11px] block">باقة الاشتراك:</span>
                      <span className="font-bold text-[#faf8f5]">باقة {event.packageTier}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0c0b0a] border border-[#26221d] space-y-1">
                      <span className="text-[#8e877c] text-[11px] block">مكان وتفاصيل القاعة:</span>
                      <span className="text-[#faf8f5] font-medium block">{event.venueName}</span>
                      <span className="text-[#8e877c] text-[11px]">{event.address}</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#0c0b0a] border border-[#26221d] space-y-1">
                      <span className="text-[#8e877c] text-[11px] block">رابط الحفل المباشر:</span>
                      <span className="font-mono text-[#c5a880] dir-ltr text-right block text-[11px]">
                        /e/{event.slug}
                      </span>
                    </div>
                  </div>

                  {event.welcomeMessage && (
                    <div className="p-4 rounded-xl bg-[#171412] border border-[#26221d] text-xs">
                      <span className="text-[#8e877c] text-[11px] block mb-1">رسالة الترحيب بالضيوف:</span>
                      <p className="text-[#c4bdaf] italic leading-relaxed">{event.welcomeMessage}</p>
                    </div>
                  )}

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/e/${event.slug}`}
                      target="_blank"
                      className="px-5 py-2.5 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center gap-2 shadow-sm"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>عرض بطاقة الدعوة الحية للضيوف</span>
                    </Link>

                    <button
                      onClick={() => setActiveTab("qr")}
                      className="px-4 py-2.5 rounded-full bg-[#1c1916] border border-[#2e2924] text-[#faf8f5] hover:border-[#3d3630] text-xs font-medium transition-colors"
                    >
                      تنزيل بطاقة الـ QR للطباعة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PHOTO MODERATION */}
        {activeTab === "photos" && (
          <div className="space-y-8">
            {/* Pending Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#26221d] pb-3">
                <h3 className="text-base font-bold font-display text-[#faf8f5] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#c5a880]" />
                  <span>صور بانتظار المراجعة والاعتماد ({pendingPhotos.length})</span>
                </h3>
                <span className="text-xs text-[#8e877c]">لن تظهر هذه الصور حتى تعتمدها بنفسك</span>
              </div>

              {pendingPhotos.length === 0 ? (
                <div className="p-8 text-center bg-[#141210] border border-[#26221d] rounded-2xl text-xs text-[#8e877c]">
                  لا توجد صور بانتظار المراجعة حالياً. عندما يمسح ضيوفكم رمز الـ QR سيرفعون لقطاتهم
                  هنا.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {pendingPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-[#141210] border border-[#2e2924] rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between"
                    >
                      <div className="relative aspect-square w-full bg-black">
                        <Image src={photo.url} alt="صورة الضيف" fill className="object-cover" />
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-xs font-bold text-[#faf8f5] block">
                            {photo.guestName || "ضيف كريم"}
                          </span>
                          {photo.message && (
                            <p className="text-xs text-[#8e877c] italic mt-1 bg-[#0c0b0a] p-2 rounded-lg">
                              «{photo.message}»
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#1c1916]">
                          <button
                            onClick={() => handleModeratePhoto(photo.id, "APPROVED")}
                            disabled={actionLoading === photo.id}
                            className="flex-1 py-2 rounded-xl bg-[#c5a880] text-[#0c0b0a] hover:bg-[#d8be99] font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-sm"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>موافقة ونشر</span>
                          </button>
                          <button
                            onClick={() => handleModeratePhoto(photo.id, "REJECTED")}
                            disabled={actionLoading === photo.id}
                            className="py-2 px-3 rounded-xl bg-[#171412] hover:bg-[#241312] text-[#f87171] border border-[#2e2924] text-xs font-medium transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>رفض</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Approved Section */}
            <div className="space-y-4 pt-6 border-t border-[#26221d]">
              <h3 className="text-base font-bold font-display text-[#faf8f5] flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#86efac]" />
                <span>الذكريات المنشورة في المعرض العام ({approvedPhotos.length})</span>
              </h3>

              {approvedPhotos.length === 0 ? (
                <div className="p-8 text-center bg-[#141210] border border-[#26221d] rounded-2xl text-xs text-[#8e877c]">
                  لم يتم نشر أي صور بعد في المعرض
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {approvedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-[#141210] border border-[#26221d]"
                    >
                      <Image src={photo.url} alt="ذكرى" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-right">
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="self-start p-1.5 rounded-full bg-[#f87171]/80 text-white hover:bg-[#f87171] transition-colors"
                          title="حذف الصورة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white">{photo.guestName}</p>
                          {photo.message && (
                            <p className="text-[10px] text-neutral-300 truncate">
                              «{photo.message}»
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RSVPS */}
        {activeTab === "rsvps" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#26221d] pb-3">
              <h3 className="text-base font-bold font-display text-[#faf8f5] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#c5a880]" />
                <span>سجل تأكيدات الحضور (RSVP)</span>
              </h3>
              <span className="text-xs font-medium text-[#c5a880] px-3 py-1 rounded-full bg-[#1c1814] border border-[#2e2924]">
                {attendingGuests} فرد أكدوا حضورهم
              </span>
            </div>

            {event.rsvps.length === 0 ? (
              <div className="p-12 text-center bg-[#141210] border border-[#26221d] rounded-3xl text-[#8e877c] text-xs">
                لم يتم تسجيل أي ردود بعد. شارك رابط الدعوة مع الأهل والأصدقاء ليؤكدوا حضورهم.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#26221d] bg-[#141210]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#171412] text-[#8e877c] border-b border-[#26221d]">
                    <tr>
                      <th className="py-3 px-4">اسم الضيف</th>
                      <th className="py-3 px-4">حالة الحضور</th>
                      <th className="py-3 px-4">عدد الأفراد</th>
                      <th className="py-3 px-4">رقم الهاتف</th>
                      <th className="py-3 px-4">التهنئة / الملاحظات</th>
                      <th className="py-3 px-4">تاريخ الرد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1c1916]">
                    {event.rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-[#1a1714] transition-colors">
                        <td className="py-3 px-4 font-bold text-[#faf8f5]">{rsvp.guestName}</td>
                        <td className="py-3 px-4">
                          {rsvp.attendanceStatus === "ATTENDING" ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#16271c] text-[#86efac] border border-[#23482d] font-medium text-[11px]">
                              حاضر بإذن الله
                            </span>
                          ) : rsvp.attendanceStatus === "MAYBE" ? (
                            <span className="px-2.5 py-1 rounded-full bg-[#2a241a] text-[#fcd34d] border border-[#4d3d22] font-medium text-[11px]">
                              ربما
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-[#291717] text-[#fca5a5] border border-[#522525] font-medium text-[11px]">
                              معتذر
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#faf8f5]">
                          {rsvp.attendanceStatus === "ATTENDING" ? `${rsvp.guestCount} أفراد` : "-"}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#8e877c] dir-ltr text-right">
                          {rsvp.phone || "-"}
                        </td>
                        <td className="py-3 px-4 text-[#8e877c] max-w-xs truncate">
                          {rsvp.note || "-"}
                        </td>
                        <td className="py-3 px-4 text-[#5c554b]">
                          {new Date(rsvp.createdAt).toLocaleDateString("ar-EG")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: QR STUDIO */}
        {activeTab === "qr" && urls?.qr && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            {/* Printable Table Card Preview (Editorial Luxury Aesthetic) */}
            <div className="bg-[#faf8f5] text-[#141210] p-8 sm:p-10 rounded-3xl shadow-2xl border border-[#c5a880]/40 text-center space-y-5">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#8e877c] font-bold block">
                  شاركنا فرحتنا ولحظاتك الجميلة
                </span>
                <h3 className="text-3xl font-bold font-display text-[#141210]">
                  {event.groomName} <span className="text-[#c5a880] font-normal font-serif">&</span>{" "}
                  {event.brideName}
                </h3>
              </div>

              {/* QR Image */}
              <div className="w-56 h-56 mx-auto bg-white p-3 rounded-2xl border border-neutral-200 shadow-sm flex items-center justify-center">
                <Image
                  src={urls.qr}
                  alt="رمز QR لرفع الصور"
                  width={210}
                  height={210}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-[#141210]">امسح الكود بكاميرا هاتفك</p>
                <p className="text-[11px] text-[#5c554b]">
                  وارفع صورك وتهنئتك لتظهر في ألبوم ذكريات الحفل فوراً
                </p>
              </div>

              <div className="pt-3 border-t border-neutral-200/80">
                <span className="text-[10px] text-[#8e877c] font-display">
                  منصة لحظة • من دعوة… إلى ذكرى لا تُنسى
                </span>
              </div>
            </div>

            {/* Actions & Instructions */}
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-2xl font-bold font-display text-[#faf8f5]">
                  بطاقة الطاولة ورمز الـ QR
                </h3>
                <p className="text-xs text-[#8e877c] mt-2 leading-relaxed">
                  اطبع هذا الرمز وضعه على طاولات المدعوين في القاعة. بمجرد أن يمسح أي ضيف الكود
                  بكاميرا هاتفه، سيفتح له رابط مباشر لرفع الصور دون الحاجة لإنشاء حساب أو تثبيت
                  تطبيقات.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={urls.qr}
                  download={`lahzah-qr-${event.slug}.png`}
                  className="w-full py-3.5 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل الـ QR عالي الدقة للطباعة (PNG)</span>
                </a>

                <a
                  href={`/api/events/${event.id}/qr?format=svg`}
                  download={`lahzah-qr-${event.slug}.svg`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-full bg-[#171412] border border-[#2e2924] text-[#faf8f5] hover:border-[#3d3630] font-medium text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#c5a880]" />
                  <span>تنزيل بصيغة فيكتور للمطابع (SVG)</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-[#141210] border border-[#26221d] text-xs space-y-1">
                <span className="font-medium text-[#c5a880] block">
                  رابط رفع الصور المباشر للضيوف:
                </span>
                <span className="font-mono text-[11px] text-[#8e877c] break-all">{urls.upload}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PACKAGES & BILLING */}
        {activeTab === "package" && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs text-[#c5a880] font-medium uppercase tracking-wider">
                باقات منصة لحظة
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-[#faf8f5]">
                اختر الباقة المناسبة لمناسبتكم
              </h3>
              <p className="text-xs text-[#8e877c]">
                باقتكم الحالية:{" "}
                <span className="font-bold text-[#faf8f5]">
                  {PACKAGES[event.packageTier]?.nameAr || event.packageTier}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.values(PACKAGES).map((pkg) => {
                const isCurrent = event.packageTier === pkg.code;
                return (
                  <div
                    key={pkg.code}
                    className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between border transition-all relative ${
                      pkg.isPopular
                        ? "bg-[#171412] border-[#c5a880] shadow-xl shadow-[#0c0b0a]"
                        : "bg-[#141210] border-[#26221d]"
                    }`}
                  >
                    <div>
                      <h4 className="text-xl font-bold font-display text-[#faf8f5]">
                        {pkg.nameAr}
                      </h4>
                      <p className="text-xs text-[#8e877c] mt-1 mb-4">{pkg.taglineAr}</p>

                      <div className="flex items-baseline gap-1 my-4">
                        <span className="text-3xl font-extrabold text-[#faf8f5] font-mono">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-[#8e877c]">{pkg.currency}</span>
                      </div>

                      <ul className="space-y-2.5 text-xs text-[#c4bdaf] my-6">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-[#c5a880] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {!event.isPaid ? (
                      <Link
                        href={`/dashboard/events/${event.id}/checkout?package=${pkg.code}`}
                        className={`w-full py-3.5 rounded-full font-bold text-xs text-center transition-all block ${
                          pkg.isPopular
                            ? "bg-[#c5a880] text-[#0c0b0a] hover:bg-[#d8be99] shadow-sm"
                            : "bg-[#1a1714] text-[#faf8f5] border border-[#2e2924] hover:border-[#3d3630]"
                        }`}
                      >
                        اختيار وسداد {pkg.nameAr} ({pkg.price} {pkg.currency})
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/events/${event.id}/checkout?package=${pkg.code}`}
                        className={`w-full py-3 rounded-full font-medium text-xs text-center transition-all block ${
                          isCurrent
                            ? "bg-[#171412] text-[#5c554b] border border-[#26221d] pointer-events-none"
                            : pkg.isPopular
                            ? "bg-[#c5a880] text-[#0c0b0a] hover:bg-[#d8be99] shadow-sm"
                            : "bg-[#1a1714] text-[#faf8f5] border border-[#2e2924] hover:border-[#3d3630]"
                        }`}
                      >
                        {isCurrent ? "الباقة المفعلة حالياً" : `ترقية إلى ${pkg.nameAr}`}
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
