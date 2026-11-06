"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Users,
  Camera,
  PlusCircle,
  ExternalLink,
  Share2,
  ChevronLeft,
  Loader2,
  Clock,
  Heart,
  ArrowRight,
  Sparkles,
  CreditCard,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import RealisticInvitationCard from "@/components/templates/RealisticInvitationCard";
import CelebrationPetals from "@/components/ui/CelebrationPetals";
import { getEventTypeLabel } from "@/lib/templates";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  eventType: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venueName: string;
  templateId: string;
  packageTier: string;
  isPublished: boolean;
  isPaid: boolean;
  stats: {
    totalRsvps: number;
    attendingGuests: number;
    pendingPhotos: number;
    approvedPhotos: number;
    totalPhotos: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (res.status === 401) {
          router.push("/auth/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.events) setEvents(data.events);
      })
      .catch((err) => console.error("Error loading events:", err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleShare = async (event: EventItem) => {
    const url = `${window.location.origin}/e/${event.slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: `يسعدنا حضوركم ومشاركتنا فرحتنا: ${event.title}`,
          url,
        });
      } catch {
        // User cancelled share
      }
    } else {
      navigator.clipboard.writeText(url);
      setCopiedSlug(event.slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const primaryEvent = events[0];
  const otherEvents = events.slice(1);

  return (
    <div className="min-h-screen bg-[#FFF8F4] text-[#493B3B] flex flex-col justify-between selection:bg-[#790D20]/15 selection:text-[#390E19] font-body relative overflow-x-hidden">
      <CelebrationPetals />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1 relative z-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#EFE4DC]">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#390E19]">
              أهلاً بكم في استوديو لحظة ✦
            </h1>
            <p className="text-xs sm:text-sm text-[#8B7778]">
              تابعوا بطاقة دعوتكم الرقمية وتأكيدات الحضور وألبوم ذكريات ضيوفكم
            </p>
          </div>

          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#630A19] transition-all shadow-[0_4px_12px_rgba(121,13,32,0.25)] hover:scale-[1.01] active:scale-[0.99] min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء مناسبة جديدة</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center text-[#8B7778] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#790D20]" />
            <p className="text-xs">جاري تجهيز استوديو مناسباتكم...</p>
          </div>
        ) : events.length === 0 ? (
          /* Empty State: Warm Burgundy Luxury */
          <div className="py-16 px-6 text-center bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2.5rem] max-w-xl mx-auto space-y-5 shadow-soft-sm">
            <div className="w-16 h-16 rounded-full bg-[#FAF2F3] text-[#790D20] border border-[#F1DEDF] flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-7 h-7 text-[#790D20] fill-[#790D20]/20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-serif text-[#390E19]">
                من هنا تبدأ أولى ذكرياتكم السعيدة
              </h3>
              <p className="text-[#8B7778] text-xs leading-relaxed max-w-md mx-auto">
                لم تقم بإنشاء أي بطاقة دعوة بعد. صمم بطاقة رقمية تفاعلية تليق بمقام ليلتكم وشاركها مع
                الأهل والأحباب بكل فخامة.
              </p>
            </div>
            <Link
              href="/dashboard/events/new"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#630A19] transition-all shadow-[0_4px_12px_rgba(121,13,32,0.25)] hover:scale-105 active:scale-95 min-h-[44px]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ابدأ تصميم بطاقتكم الأولى</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Primary Event Showcase */}
            {primaryEvent && (
              <section className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#8B7778] px-1">
                  <span className="font-semibold text-[#390E19] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#790D20]" />
                    <span>استوديو مناسبتكم القادمة</span>
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white border border-[#EFE4DC] text-[#390E19]">
                    باقة {primaryEvent.packageTier}
                  </span>
                </div>

                <div className="bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden shadow-soft-sm">
                  {/* Subtle corner aura */}
                  <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-[#F1DEDF]/30 via-[#D8B8B8]/15 to-transparent rounded-br-full pointer-events-none" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
                    {/* LEFT / PREVIEW COLUMN (Desktop 5 cols) */}
                    <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
                      <div className="w-full max-w-sm">
                        <RealisticInvitationCard
                          templateId={primaryEvent.templateId}
                          groomName={primaryEvent.groomName}
                          brideName={primaryEvent.brideName}
                          eventDate={primaryEvent.eventDate}
                          venueName={primaryEvent.venueName}
                          interactive={false}
                          className="w-full transform hover:scale-[1.01] transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* RIGHT / STUDIO CONTROLS COLUMN (Desktop 7 cols) */}
                    <div className="lg:col-span-7 space-y-6 text-right order-1 lg:order-2">
                      {/* Status Badge & Studio Link */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2">
                          {primaryEvent.isPublished ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#F0F7F1] text-[#3D7A42] border border-[#D5EAD7] text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>منشورة ومتاحة للضيوف ✦</span>
                            </span>
                          ) : primaryEvent.isPaid ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#FEF9EE] text-[#B37D22] border border-[#F6E5BF] text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                              <Clock className="w-3.5 h-3.5" />
                              <span>مسودة مدفوعة • جاهزة للنشر</span>
                            </span>
                          ) : (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#FFF0F0] text-[#A82323] border border-[#F1DEDF] text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>مسودة • غير مدفوعة</span>
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/dashboard/events/${primaryEvent.id}`}
                          className="px-4 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-full bg-[#FFF9F5] border border-[#EFE4DC] text-[#390E19] hover:text-[#790D20] hover:border-[#790D20] text-xs transition-colors flex items-center justify-center gap-1 font-semibold shadow-soft-xs"
                        >
                          <span>استوديو الإدارة الكاملة</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Couple Names & Event Details */}
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider font-semibold text-[#790D20]">
                          {getEventTypeLabel(primaryEvent.eventType)}
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-[#390E19] tracking-wide leading-tight">
                          {primaryEvent.groomName}
                          <span className="text-[#790D20] mx-3 font-serif font-normal">&</span>
                          {primaryEvent.brideName}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#8B7778] pt-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#D6B77A]" />
                            <span>
                              {new Date(primaryEvent.eventDate).toLocaleDateString("ar-EG", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#EFE4DC]" />
                            <span>{primaryEvent.venueName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contextual Action Area */}
                      <div className="pt-2">
                        {!primaryEvent.isPaid ? (
                          <div className="p-5 rounded-2xl bg-[#FFF9F5] border border-[#EFE4DC] space-y-3 text-right">
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-[#390E19]">
                                بطاقة دعوتكم جاهزة بانتظار التفعيل
                              </p>
                              <p className="text-[11px] text-[#8B7778] leading-relaxed">
                                أكمل سداد باقة المناسبة لتفعيل الرابط ورمز الـ QR وبدء استقبال تأكيدات الحضور والصور.
                              </p>
                            </div>
                            <Link
                              href={`/dashboard/events/${primaryEvent.id}/checkout?package=${primaryEvent.packageTier}`}
                              className="w-full py-3.5 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#630A19] transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(121,13,32,0.25)] min-h-[44px]"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>ادفع وانشر دعوتك الآن</span>
                            </Link>
                          </div>
                        ) : !primaryEvent.isPublished ? (
                          <div className="p-5 rounded-2xl bg-[#FAF4E8] border border-[#D6B77A]/40 space-y-3 text-right">
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-[#390E19]">
                                تم سداد الباقة بنجاح! المناسبة جاهزة للنشر
                              </p>
                              <p className="text-[11px] text-[#8B7778]">
                                انشر بطاقة الدعوة الآن ليتمكن الضيوف من فتحها وتأكيد الحضور.
                              </p>
                            </div>
                            <Link
                              href={`/dashboard/events/${primaryEvent.id}`}
                              className="w-full py-3.5 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#630A19] transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(121,13,32,0.25)] min-h-[44px]"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>نشر الدعوة وتفعيل الرابط</span>
                            </Link>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/dashboard/events/${primaryEvent.id}`}
                              className="px-6 py-3 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#630A19] transition-all flex items-center gap-2 shadow-[0_4px_12px_rgba(121,13,32,0.25)] min-h-[44px]"
                            >
                              <span>إدارة ومتابعة الحضور</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/e/${primaryEvent.slug}`}
                              target="_blank"
                              className="px-5 py-3 rounded-full bg-[#FFF9F5] border border-[#EFE4DC] text-[#390E19] hover:text-[#790D20] font-semibold text-xs transition-colors flex items-center gap-2 min-h-[44px] shadow-soft-xs"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#D6B77A]" />
                              <span>عرض كرت الدعوة</span>
                            </Link>
                            <button
                              onClick={() => handleShare(primaryEvent)}
                              className="px-4 py-3 rounded-full bg-[#FFF9F5] border border-[#EFE4DC] text-[#8B7778] hover:text-[#790D20] text-xs font-semibold transition-colors flex items-center gap-1.5 min-h-[44px] shadow-soft-xs"
                            >
                              <Share2 className="w-3.5 h-3.5 text-[#790D20]" />
                              <span>{copiedSlug === primaryEvent.slug ? "تم النسخ!" : "مشاركة"}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Organic Activity Indicators */}
                      <div className="pt-4 border-t border-[#EFE4DC] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[11px] text-[#8B7778] flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#790D20]" />
                            <span>تأكيدات الحضور (RSVP)</span>
                          </span>
                          <p className="font-mono text-base font-bold text-[#390E19]">
                            {primaryEvent.stats.attendingGuests} فرد مؤكد
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] text-[#8B7778] flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-[#D6B77A]" />
                            <span>ألبوم الذكريات</span>
                          </span>
                          <p className="font-mono text-base font-bold text-[#390E19]">
                            {primaryEvent.stats.approvedPhotos} ذكرى منشورة
                          </p>
                        </div>

                        {primaryEvent.stats.pendingPhotos > 0 && (
                          <div className="space-y-1 col-span-2 sm:col-span-1">
                            <span className="text-[11px] text-[#790D20] font-semibold flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#790D20]" />
                              <span>صور بانتظار المراجعة</span>
                            </span>
                            <Link
                              href={`/dashboard/events/${primaryEvent.id}?tab=photos`}
                              className="font-mono text-sm font-bold text-[#790D20] hover:underline block"
                            >
                              {primaryEvent.stats.pendingPhotos} صور جديدة
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Other Events List */}
            {otherEvents.length > 0 && (
              <section className="space-y-4 pt-6">
                <h3 className="text-lg font-bold font-serif text-[#390E19]">
                  مناسباتكم الأخرى
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] hover:border-[#790D20] transition-all flex flex-col justify-between shadow-soft-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] text-[#8B7778]">
                            {new Date(evt.eventDate).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                              evt.isPublished
                                ? "bg-[#F0F7F1] text-[#3D7A42]"
                                : "bg-[#FAF4E8] text-[#B37D22]"
                            }`}
                          >
                            {evt.isPublished ? "منشورة" : "مسودة"}
                          </span>
                        </div>
                        <h4 className="font-bold font-serif text-base text-[#390E19]">
                          {evt.groomName} & {evt.brideName}
                        </h4>
                        <p className="text-xs text-[#8B7778]">{evt.venueName}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EFE4DC] flex items-center justify-between text-xs">
                        <span className="text-[#8B7778] text-[11px]">
                          {evt.stats.attendingGuests} ضيف • {evt.stats.approvedPhotos} صورة
                        </span>
                        <Link
                          href={`/dashboard/events/${evt.id}`}
                          className="text-[#790D20] hover:text-[#630A19] font-bold flex items-center gap-1 min-h-[44px]"
                        >
                          <span>إدارة</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
