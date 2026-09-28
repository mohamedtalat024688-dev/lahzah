"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Users,
  Camera,
  PlusCircle,
  ExternalLink,
  QrCode,
  Sparkles,
  ChevronLeft,
  Loader2,
  Clock,
  Heart,
  CheckCircle,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  groomName: string;
  brideName: string;
  eventDate: string;
  venueName: string;
  templateId: string;
  packageTier: string;
  stats: {
    totalRsvps: number;
    attendingGuests: number;
    pendingPhotos: number;
    approvedPhotos: number;
    totalPhotos: number;
  };
}

export default function DashboardPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (res.status === 401) {
          window.location.href = "/auth/login";
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data?.events) setEvents(data.events);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const totalGuests = events.reduce((sum, e) => sum + e.stats.attendingGuests, 0);
  const totalPending = events.reduce((sum, e) => sum + e.stats.pendingPhotos, 0);
  const totalApproved = events.reduce((sum, e) => sum + e.stats.approvedPhotos, 0);

  return (
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold calligraphy-font text-white">لوحة تحكم المناسبات</h1>
            <p className="text-xs text-[#d4af37]/80 mt-1">
              أهلاً بك! راقب دعواتك وتأكيدات الحضور وصور وذكريات ضيوفك
            </p>
          </div>

          <Link
            href="/dashboard/events/new"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-sm shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إنشاء مناسبة جديدة</span>
          </Link>
        </div>

        {/* Global Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-2xl bg-[#13110e] border border-[#d4af37]/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs">إجمالي المناسبات</span>
              <Calendar className="w-4 h-4 text-[#d4af37]" />
            </div>
            <span className="text-2xl font-bold text-white font-mono">{events.length}</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#13110e] border border-[#d4af37]/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs">تأكيد الحضور (ضيوف)</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-2xl font-bold text-emerald-400 font-mono">{totalGuests} فرد</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#13110e] border border-[#d4af37]/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs">صور بانتظار الموافقة</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-2xl font-bold text-amber-400 font-mono">{totalPending} صورة</span>
          </div>

          <div className="p-5 rounded-2xl bg-[#13110e] border border-[#d4af37]/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 mb-2">
              <span className="text-xs">ذكريات منشورة</span>
              <Camera className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-2xl font-bold text-rose-400 font-mono">{totalApproved} ذكرى</span>
          </div>
        </div>

        {/* Events Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span>مناسباتك النشطة</span>
          </h2>

          {loading ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-neutral-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
              <p className="text-xs">جاري تحميل مناسباتك...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-12 text-center bg-[#13110e] border border-[#d4af37]/20 rounded-3xl max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white calligraphy-font">لا توجد مناسبات بعد</h3>
              <p className="text-neutral-400 text-xs">
                ابدأ رحلتك وصمم أول بطاقة دعوة رقمية مخصصة لحفل زفافك أو خطوبتك في دقائق معدودة.
              </p>
              <Link
                href="/dashboard/events/new"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إنشاء بطاقة الدعوة الآن</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-[#13110e] border border-[#d4af37]/25 hover:border-[#d4af37]/60 rounded-3xl p-6 transition-all duration-300 shadow-xl flex flex-col justify-between relative group"
                >
                  {/* Top tags */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#d4af37]/15 text-[#f3e5ab] border border-[#d4af37]/30">
                      باقة {event.packageTier}
                    </span>
                    <span className="text-xs text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>{new Date(event.eventDate).toLocaleDateString("ar-EG")}</span>
                    </span>
                  </div>

                  {/* Title & Names */}
                  <div className="space-y-1 mb-6">
                    <h3 className="text-2xl font-bold text-white calligraphy-font group-hover:text-[#f3e5ab] transition-colors">
                      {event.groomName} & {event.brideName}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate">{event.venueName}</p>
                  </div>

                  {/* Event mini stats */}
                  <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-black/40 border border-neutral-800 text-center mb-6">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">الحضور</span>
                      <span className="text-sm font-bold text-emerald-400">
                        {event.stats.attendingGuests}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">قيد المراجعة</span>
                      <span className="text-sm font-bold text-amber-400">
                        {event.stats.pendingPhotos}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">ذكريات منشورة</span>
                      <span className="text-sm font-bold text-[#f3e5ab]">
                        {event.stats.approvedPhotos}
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2 pt-2 border-t border-neutral-800">
                    <Link
                      href={`/dashboard/events/${event.id}`}
                      className="w-full py-2.5 rounded-full bg-[#201d18] hover:bg-[#2c2720] border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-bold transition-all flex items-center justify-center gap-2"
                    >
                      <span>إدارة ومراجعة الذكريات</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/e/${event.slug}`}
                        target="_blank"
                        className="flex-1 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>رابط الدعوة</span>
                      </Link>

                      <Link
                        href={`/dashboard/events/${event.id}?tab=qr`}
                        className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-[#d4af37] hover:bg-neutral-800 transition-colors"
                        title="رمز QR"
                      >
                        <QrCode className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
