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
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import { PACKAGES } from "@/lib/packages";
import { TEMPLATES } from "@/lib/templates";

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
  const [activeTab, setActiveTab] = useState<"overview" | "photos" | "rsvps" | "qr" | "package">("overview");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState<string | null>(null);
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
      if (sp.get("payment") === "success") {
        setUpgradeSuccess("تم تأكيد وسداد الباقة بنجاح! أصبحت مناسبتك جاهزة للنشر الآن.");
      } else if (sp.get("payment") === "failed") {
        alert("لم تكتمل عملية الدفع أو تم إلغاؤها. يمكنك المحاولة مجدداً في أي وقت.");
      }
    }
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
      setPublishMessage("تم نشر بطاقة الدعوة وتفعيل الـ QR بنجاح! 🚀");
      fetchEventData();
      setTimeout(() => setPublishMessage(null), 5000);
    } catch {
      alert("حدث خطأ أثناء محاولة النشر");
    } finally {
      setPublishLoading(false);
    }
  };

  const handleUnpublish = async () => {
    if (!confirm("هل أنت متأكد من رغبتك في إيقاف نشر الدعوة مؤقتاً؟ لن يتمكن الضيوف من فتحها.")) return;
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

  const handleUpgrade = async (packageCode: string) => {
    setActionLoading(packageCode);
    try {
      const res = await fetch(`/api/events/${id}/upgrade`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageCode }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
        setUpgradeSuccess(`تم تفعيل ${PACKAGES[packageCode].nameAr} بنجاح!`);
        fetchEventData();
        setTimeout(() => setUpgradeSuccess(null), 4000);
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
          <p className="text-lg">المناسبة غير موجودة أو تم حذفها</p>
          <Link href="/dashboard" className="text-[#d4af37] text-sm mt-2 inline-block">
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
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Top Header */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors mb-2"
            >
              <ArrowRight className="w-3.5 h-3.5" />
              <span>العودة لجميع المناسبات</span>
            </Link>
            <h1 className="text-3xl font-bold calligraphy-font text-white">
              {event.groomName} & {event.brideName}
            </h1>
            <p className="text-xs text-neutral-400">
              {event.venueName} • {new Date(event.eventDate).toLocaleDateString("ar-EG")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyInvitationLink}
              className="px-4 py-2 rounded-full bg-[#1b1915] border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37]/20 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#d4af37]" />}
              <span>{copied ? "تم النسخ!" : "نسخ رابط الدعوة"}</span>
            </button>

            <Link
              href={`/e/${event.slug}`}
              target="_blank"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
            >
              <span>معاينة كرت الدعوة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {upgradeSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{upgradeSuccess}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 mb-8 overflow-x-auto text-xs font-semibold">
          {[
            { id: "overview", label: "نظرة عامة والمؤشرات" },
            {
              id: "photos",
              label: `مراجعة الصور (${pendingPhotos.length} معلقة)`,
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
                  ? "bg-[#d4af37] text-[#0d0c0a] font-bold shadow-md"
                  : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-black font-extrabold text-[10px] flex items-center justify-center">
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
              <div className="p-5 rounded-2xl bg-[#13110e] border border-[#d4af37]/20">
                <span className="text-xs text-neutral-400 block mb-1">الضيوف المؤكد حضورهم</span>
                <span className="text-2xl font-bold text-emerald-400 font-mono">{attendingGuests} فرد</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#13110e] border border-[#d4af37]/20">
                <span className="text-xs text-neutral-400 block mb-1">إجمالي ردود الـ RSVP</span>
                <span className="text-2xl font-bold text-white font-mono">{event.rsvps.length} رد</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#13110e] border border-[#d4af37]/20">
                <span className="text-xs text-neutral-400 block mb-1">صور بانتظار الاعتماد</span>
                <span className="text-2xl font-bold text-amber-400 font-mono">{pendingPhotos.length} صورة</span>
              </div>
              <div className="p-5 rounded-2xl bg-[#13110e] border border-[#d4af37]/20">
                <span className="text-xs text-neutral-400 block mb-1">ذكريات منشورة بالمعرض</span>
                <span className="text-2xl font-bold text-[#f3e5ab] font-mono">{approvedPhotos.length} ذكرى</span>
              </div>
            </div>

            {/* Quick Actions & Pending Alert */}
            {pendingPhotos.length > 0 && (
              <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>يوجد {pendingPhotos.length} صورة جديدة قام الضيوف بمشاركتها!</span>
                  </h4>
                  <p className="text-xs text-neutral-300">
                    راجع الصور الآن واضغط على موافقة لتظهر فوراً في معرض ذكريات الحفل.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("photos")}
                  className="px-4 py-2 rounded-full bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors"
                >
                  مراجعة الصور الآن
                </button>
              </div>
            )}

            {/* Event Info Details */}
            <div className="bg-[#13110e] border border-[#d4af37]/20 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-bold text-white calligraphy-font">بيانات المناسبة الحالية</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs text-neutral-300">
                <div>
                  <span className="text-neutral-500 block mb-1">القالب المعتمد:</span>
                  <span className="font-bold text-[#d4af37]">
                    {TEMPLATES[event.templateId]?.nameAr || event.templateId}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">القاعة والمكان:</span>
                  <span className="font-bold text-white">{event.venueName}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block mb-1">رابط الحفل:</span>
                  <span className="font-mono text-neutral-300">/e/{event.slug}</span>
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
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-bold text-amber-300 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  <span>صور بانتظار المراجعة والاعتماد ({pendingPhotos.length})</span>
                </h3>
                <span className="text-xs text-neutral-400">لن يرى الضيوف هذه الصور حتى توافق عليها</span>
              </div>

              {pendingPhotos.length === 0 ? (
                <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-xs text-neutral-400">
                  لا توجد صور معلقة حالياً. عندما يمسح الضيوف رمز الـ QR سيرفعون صورهم هنا للمراجعة.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {pendingPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="bg-[#151310] border border-amber-500/40 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                    >
                      <div className="relative aspect-square w-full bg-black">
                        <Image src={photo.url} alt="صورة الضيف" fill className="object-cover" />
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <span className="text-xs font-bold text-white block">{photo.guestName}</span>
                          {photo.message && (
                            <p className="text-xs text-neutral-300 italic mt-1 bg-black/40 p-2 rounded-lg">
                              «{photo.message}»
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-neutral-800">
                          <button
                            onClick={() => handleModeratePhoto(photo.id, "APPROVED")}
                            disabled={actionLoading === photo.id}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>موافقة ونشر</span>
                          </button>
                          <button
                            onClick={() => handleModeratePhoto(photo.id, "REJECTED")}
                            disabled={actionLoading === photo.id}
                            className="py-2 px-3 rounded-xl bg-neutral-800 hover:bg-red-950/60 text-red-400 border border-neutral-700 text-xs font-semibold transition-colors flex items-center gap-1"
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
            <div className="space-y-4 pt-6 border-t border-neutral-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span>الذكريات المنشورة في المعرض العام ({approvedPhotos.length})</span>
              </h3>

              {approvedPhotos.length === 0 ? (
                <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-xs text-neutral-400">
                  لم يتم نشر أي صور بعد
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {approvedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-[#d4af37]/20"
                    >
                      <Image src={photo.url} alt="ذكرى" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between text-right">
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="self-start p-1.5 rounded-full bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                          title="حذف الصورة"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <p className="text-xs font-bold text-white">{photo.guestName}</p>
                          {photo.message && <p className="text-[10px] text-neutral-300 truncate">«{photo.message}»</p>}
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
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>سجل تأكيدات الحضور (RSVP)</span>
              </h3>
              <span className="text-xs font-bold text-emerald-400 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                {attendingGuests} فرد قادمون للاحتفال معكم
              </span>
            </div>

            {event.rsvps.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl text-neutral-400 text-xs">
                لم يتم تسجيل أي ردود بعد. شارك رابط الدعوة مع الأهل والأصدقاء ليؤكدوا حضورهم.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#13110e]">
                <table className="w-full text-right text-xs">
                  <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">اسم الضيف</th>
                      <th className="py-3 px-4">حالة الحضور</th>
                      <th className="py-3 px-4">عدد الأفراد</th>
                      <th className="py-3 px-4">رقم الهاتف</th>
                      <th className="py-3 px-4">التهنئة / الملاحظات</th>
                      <th className="py-3 px-4">تاريخ الرد</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {event.rsvps.map((rsvp) => (
                      <tr key={rsvp.id} className="hover:bg-neutral-900/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{rsvp.guestName}</td>
                        <td className="py-3 px-4">
                          {rsvp.attendanceStatus === "ATTENDING" ? (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-semibold">
                              حاضر بإذن الله
                            </span>
                          ) : rsvp.attendanceStatus === "MAYBE" ? (
                            <span className="px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 font-semibold">
                              ربما
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full bg-rose-950/60 text-rose-300 border border-rose-500/30 font-semibold">
                              معتذر
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-[#f3e5ab]">
                          {rsvp.attendanceStatus === "ATTENDING" ? `${rsvp.guestCount} أفراد` : "-"}
                        </td>
                        <td className="py-3 px-4 font-mono text-neutral-400 dir-ltr text-right">
                          {rsvp.phone || "-"}
                        </td>
                        <td className="py-3 px-4 text-neutral-300 max-w-xs truncate">
                          {rsvp.note || "-"}
                        </td>
                        <td className="py-3 px-4 text-neutral-500">
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
            {/* Printable Table Card Preview */}
            <div className="bg-[#ffffff] text-[#1a1714] p-8 rounded-3xl shadow-2xl border-4 border-[#d4af37] text-center space-y-4">
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-[#aa7c11] font-bold">
                  شاركنا فرحتنا ولحظاتك الجميلة
                </span>
                <h3 className="text-3xl font-extrabold calligraphy-font text-[#1a1714]">
                  {event.groomName} & {event.brideName}
                </h3>
              </div>

              {/* QR Image */}
              <div className="w-56 h-56 mx-auto bg-white p-2 rounded-2xl border border-neutral-200 shadow-inner flex items-center justify-center">
                <Image
                  src={urls.qr}
                  alt="رمز QR لرفع الصور"
                  width={220}
                  height={220}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <p className="text-sm font-bold text-[#1a1714]">امسح الكود بكاميرا هاتفك</p>
                <p className="text-xs text-neutral-600">وارفع صورك وتهنئتك لتظهر في ألبوم ذكريات الحفل فوراً</p>
              </div>

              <div className="pt-2 border-t border-neutral-200">
                <span className="text-[10px] text-neutral-400">منصة لحظة • من دعوة… إلى ذكرى</span>
              </div>
            </div>

            {/* Actions & Instructions */}
            <div className="space-y-6 text-right">
              <div>
                <h3 className="text-2xl font-bold text-white calligraphy-font">بطاقة الطاولة والـ QR</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  اطبع هذا الرمز وضعه على طاولات المدعوين في القاعة. بمجرد أن يمسح أي ضيف الكود بكاميرا هاتفه، سيفتح له رابط مباشر لرفع الصور دون الحاجة لإنشاء حساب أو تثبيت تطبيقات.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={urls.qr}
                  download={`lahzah-qr-${event.slug}.png`}
                  className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل الـ QR عالي الدقة للطباعة (PNG)</span>
                </a>

                <a
                  href={`/api/events/${event.id}/qr?format=svg`}
                  download={`lahzah-qr-${event.slug}.svg`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 rounded-full bg-[#1b1915] border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37]/20 font-semibold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>تنزيل بصيغة فيكتور للمطابع (SVG)</span>
                </a>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 space-y-1">
                <span className="font-semibold text-[#d4af37] block">رابط رفع الصور المباشر:</span>
                <span className="font-mono text-[11px] text-neutral-400 break-all">{urls.upload}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PACKAGES & BILLING */}
        {activeTab === "package" && (
          <div className="space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs text-[#d4af37] font-bold uppercase tracking-wider">
                باقات منصة لحظة
              </span>
              <h3 className="text-3xl font-bold text-white calligraphy-font">
                اختر الباقة المناسبة لمناسبتك
              </h3>
              <p className="text-xs text-neutral-400">
                باقتك الحالية: <span className="font-bold text-[#f3e5ab]">{PACKAGES[event.packageTier]?.nameAr || event.packageTier}</span>
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
                        ? "bg-[#181512] border-[#d4af37] shadow-xl shadow-[#d4af37]/10"
                        : "bg-[#13110e] border-neutral-800"
                    }`}
                  >
                    {pkg.isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#0d0c0a] font-extrabold text-[10px]">
                        الأكثر طلباً واختياراً
                      </span>
                    )}

                    <div>
                      <h4 className="text-xl font-bold text-white calligraphy-font">{pkg.nameAr}</h4>
                      <p className="text-xs text-neutral-400 mt-1 mb-4">{pkg.taglineAr}</p>

                      <div className="flex items-baseline gap-1 my-4">
                        <span className="text-3xl font-extrabold text-[#f3e5ab] font-mono">
                          {pkg.price}
                        </span>
                        <span className="text-xs text-neutral-400">{pkg.currency}</span>
                      </div>

                      <ul className="space-y-2.5 text-xs text-neutral-300 my-6">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#d4af37] shrink-0" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleUpgrade(pkg.code)}
                      disabled={isCurrent || actionLoading === pkg.code}
                      className={`w-full py-3 rounded-full font-bold text-xs transition-all ${
                        isCurrent
                          ? "bg-neutral-800 text-neutral-400 cursor-default"
                          : pkg.isPopular
                          ? "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] hover:brightness-110 shadow-lg"
                          : "bg-[#221f1a] text-[#f3e5ab] border border-[#d4af37]/30 hover:bg-[#d4af37]/20"
                      }`}
                    >
                      {actionLoading === pkg.code ? (
                        <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                      ) : isCurrent ? (
                        "الباقة المفعلة حالياً"
                      ) : (
                        `ترقية إلى ${pkg.nameAr}`
                      )}
                    </button>
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
