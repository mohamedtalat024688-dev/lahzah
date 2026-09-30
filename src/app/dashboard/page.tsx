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
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  const handleShare = (event: EventItem) => {
    const url = `${window.location.origin}/e/${event.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: `دعوة حفل ${event.groomName} و ${event.brideName}`,
          text: `ندعوكم بكل الحب لمشاركتنا فرحتنا ❤️`,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedSlug(event.slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const primaryEvent = events[0];
  const otherEvents = events.slice(1);

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#faf8f5] flex flex-col justify-between selection:bg-[#c5a880]/30 selection:text-[#f5f2eb]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-[#26221d]">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-[#faf8f5]">
              أهلاً بك في استوديو لحظة 👋
            </h1>
            <p className="text-xs sm:text-sm text-[#8e877c]">
              تابع بطاقة دعوتكم الرقمية وتأكيدات الحضور وألبوم ذكريات ضيوفكم
            </p>
          </div>

          <Link
            href="/dashboard/events/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء مناسبة جديدة</span>
          </Link>
        </div>

        {loading ? (
          <div className="py-24 text-center flex flex-col items-center justify-center text-[#8e877c] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#c5a880]" />
            <p className="text-xs">جاري تجهيز استوديو مناسباتكم...</p>
          </div>
        ) : events.length === 0 ? (
          /* Empty State: Warm & Romantic */
          <div className="py-16 px-6 text-center bg-[#141210] border border-[#26221d] rounded-3xl max-w-xl mx-auto space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#1c1916] text-[#c5a880] border border-[#2e2924] flex items-center justify-center mx-auto">
              <Heart className="w-7 h-7 text-[#c5a880]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold font-display text-[#faf8f5]">
                من هنا تبدأ أولى ذكرياتكم السعيدة
              </h3>
              <p className="text-[#8e877c] text-xs leading-relaxed max-w-md mx-auto">
                لم تقم بإنشاء أي بطاقة دعوة بعد. صمم بطاقة رقمية تفاعلية تليق بمقام ليلتكم وشاركها مع
                الأهل والأحباب بكل فخامة.
              </p>
            </div>
            <Link
              href="/dashboard/events/new"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>ابدأ تصميم بطاقتكم الأولى</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Primary Event Showcase (Personal Wedding Studio with Prominent Realistic Invitation) */}
            {primaryEvent && (
              <section className="space-y-4">
                <div className="flex items-center justify-between text-xs text-[#8e877c] px-1">
                  <span className="font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
                    <span>استوديو مناسبتكم القادمة</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#8e877c]">
                    باقة {primaryEvent.packageTier}
                  </span>
                </div>

                <div className="bg-[#141210] border border-[#26221d] rounded-3xl p-6 sm:p-10 relative overflow-hidden">
                  {/* Subtle corner glow */}
                  <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-br from-[#c5a880]/10 to-transparent rounded-br-full pointer-events-none" />

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
                    {/* LEFT / PREVIEW COLUMN (Desktop 5 cols): The Realistic Wedding Invitation Card */}
                    <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
                      <div className="w-full max-w-sm">
                        <RealisticInvitationCard
                          templateId={primaryEvent.templateId}
                          groomName={primaryEvent.groomName}
                          brideName={primaryEvent.brideName}
                          eventDate={primaryEvent.eventDate}
                          venueName={primaryEvent.venueName}
                          interactive={false}
                          className="w-full transform hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* RIGHT / STUDIO CONTROLS COLUMN (Desktop 7 cols): Details & Actions */}
                    <div className="lg:col-span-7 space-y-6 text-right order-1 lg:order-2">
                      {/* Status Badge & Studio Link */}
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="inline-flex items-center gap-2">
                          {primaryEvent.isPublished ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#16271c] text-[#86efac] border border-[#23482d] text-xs font-medium flex items-center gap-1.5 shadow-sm">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>منشورة ومتاحة للضيوف</span>
                            </span>
                          ) : primaryEvent.isPaid ? (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#2a241a] text-[#fcd34d] border border-[#4d3d22] text-xs font-medium flex items-center gap-1.5 shadow-sm">
                              <Clock className="w-3.5 h-3.5" />
                              <span>مسودة مدفوعة • جاهزة للنشر</span>
                            </span>
                          ) : (
                            <span className="px-3.5 py-1.5 rounded-full bg-[#291717] text-[#fca5a5] border border-[#522525] text-xs font-medium flex items-center gap-1.5 shadow-sm">
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>مسودة • غير مدفوعة</span>
                            </span>
                          )}
                        </div>

                        <Link
                          href={`/dashboard/events/${primaryEvent.id}`}
                          className="px-4 py-2.5 sm:py-1.5 min-h-[44px] sm:min-h-0 rounded-full bg-[#1c1916] border border-[#2e2924] text-[#c5a880] hover:border-[#c5a880] text-xs transition-colors flex items-center justify-center gap-1 font-medium"
                        >
                          <span>استوديو الإدارة الكاملة</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Couple Names & Event Details */}
                      <div className="space-y-3">
                        <p className="text-xs uppercase tracking-wider text-[#8e877c]">
                          {primaryEvent.eventType === "WEDDING"
                            ? "حفل زفاف مبارك"
                            : primaryEvent.eventType === "ENGAGEMENT"
                            ? "حفل خطوبة مبارك"
                            : "مناسبة خاصة"}
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold font-display text-[#faf8f5] tracking-wide leading-tight">
                          {primaryEvent.groomName}
                          <span className="text-[#c5a880] mx-3 font-serif font-normal">&</span>
                          {primaryEvent.brideName}
                        </h2>

                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#8e877c] pt-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#c5a880]" />
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
                            <span className="w-1.5 h-1.5 rounded-full bg-[#3d3630]" />
                            <span>{primaryEvent.venueName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contextual Primary Action Button */}
                      <div className="pt-2">
                        {!primaryEvent.isPaid ? (
                          <div className="p-4 rounded-2xl bg-[#1c1814] border border-[#3d3223] space-y-3">
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-[#faf8f5]">
                                بطاقة دعوتكم جاهزة بانتظار التفعيل
                              </p>
                              <p className="text-[11px] text-[#8e877c] leading-relaxed">
                                أكمل سداد باقة المناسبة لتفعيل الرابط ورمز الـ QR وبدء استقبال تأكيدات الحضور والصور.
                              </p>
                            </div>
                            <Link
                              href={`/dashboard/events/${primaryEvent.id}/checkout?package=${primaryEvent.packageTier}`}
                              className="w-full py-3 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>ادفع وانشر دعوتك الآن</span>
                            </Link>
                          </div>
                        ) : !primaryEvent.isPublished ? (
                          <div className="p-4 rounded-2xl bg-[#1c1814] border border-[#3d3223] space-y-3">
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-[#faf8f5]">
                                تم سداد الباقة بنجاح! المناسبة جاهزة للنشر
                              </p>
                              <p className="text-[11px] text-[#8e877c]">
                                انشر بطاقة الدعوة الآن ليتمكن الضيوف من فتحها وتأكيد الحضور.
                              </p>
                            </div>
                            <Link
                              href={`/dashboard/events/${primaryEvent.id}`}
                              className="w-full py-3 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center justify-center gap-2 shadow-md"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>نشر الدعوة وتفعيل الرابط</span>
                            </Link>
                          </div>
                        ) : (
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/dashboard/events/${primaryEvent.id}`}
                              className="px-6 py-3 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center gap-2 shadow-sm"
                            >
                              <span>إدارة ومتابعة الحضور</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                              href={`/e/${primaryEvent.slug}`}
                              target="_blank"
                              className="px-5 py-3 rounded-full bg-[#1c1916] border border-[#2e2924] text-[#faf8f5] hover:border-[#3d3630] font-medium text-xs transition-colors flex items-center gap-2"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#c5a880]" />
                              <span>عرض كرت الدعوة</span>
                            </Link>
                            <button
                              onClick={() => handleShare(primaryEvent)}
                              className="px-4 py-3 rounded-full bg-[#1c1916] border border-[#2e2924] text-[#8e877c] hover:text-[#faf8f5] text-xs font-medium transition-colors flex items-center gap-1.5"
                            >
                              <Share2 className="w-3.5 h-3.5 text-[#c5a880]" />
                              <span>{copiedSlug === primaryEvent.slug ? "تم النسخ!" : "مشاركة"}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Organic Activity Indicators */}
                      <div className="pt-4 border-t border-[#1c1916] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                        <div className="space-y-1">
                          <span className="text-[11px] text-[#8e877c] flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-[#c5a880]" />
                            <span>تأكيدات الحضور (RSVP)</span>
                          </span>
                          <p className="font-mono text-base font-bold text-[#faf8f5]">
                            {primaryEvent.stats.attendingGuests} فرد مؤكد
                          </p>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] text-[#8e877c] flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-[#c5a880]" />
                            <span>ألبوم الذكريات</span>
                          </span>
                          <p className="font-mono text-base font-bold text-[#faf8f5]">
                            {primaryEvent.stats.approvedPhotos} ذكرى منشورة
                          </p>
                        </div>

                        {primaryEvent.stats.pendingPhotos > 0 && (
                          <div className="space-y-1 col-span-2 sm:col-span-1">
                            <span className="text-[11px] text-[#8e877c] flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-[#c5a880]" />
                              <span>صور بانتظار مراجعتكم</span>
                            </span>
                            <Link
                              href={`/dashboard/events/${primaryEvent.id}?tab=photos`}
                              className="font-mono text-sm font-bold text-[#c5a880] hover:underline block"
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

            {/* Other Events List (if customer has more than 1) */}
            {otherEvents.length > 0 && (
              <section className="space-y-4 pt-6">
                <h3 className="text-lg font-bold font-display text-[#faf8f5]">
                  مناسباتكم الأخرى
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {otherEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-5 rounded-2xl bg-[#141210] border border-[#26221d] hover:border-[#383129] transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] text-[#8e877c]">
                            {new Date(evt.eventDate).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                              evt.isPublished
                                ? "bg-[#16271c] text-[#86efac]"
                                : "bg-[#241d16] text-[#c5a880]"
                            }`}
                          >
                            {evt.isPublished ? "منشورة" : "مسودة"}
                          </span>
                        </div>
                        <h4 className="font-bold font-display text-base text-[#faf8f5]">
                          {evt.groomName} & {evt.brideName}
                        </h4>
                        <p className="text-xs text-[#8e877c]">{evt.venueName}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#1c1916] flex items-center justify-between text-xs">
                        <span className="text-[#8e877c] text-[11px]">
                          {evt.stats.attendingGuests} ضيف • {evt.stats.approvedPhotos} صورة
                        </span>
                        <Link
                          href={`/dashboard/events/${evt.id}`}
                          className="text-[#c5a880] hover:text-[#d8be99] font-medium flex items-center gap-1"
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
