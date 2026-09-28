"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Share2,
  Camera,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import { TemplateConfig } from "@/lib/templates";
import RsvpModal from "../guest/RsvpModal";
import MemoryGallery, { GalleryPhoto } from "../gallery/MemoryGallery";

interface EventData {
  id: string;
  slug: string;
  title: string;
  eventType: string;
  groomName: string;
  brideName: string;
  eventDate: string | Date;
  venueName: string;
  address: string;
  mapUrl?: string | null;
  welcomeMessage?: string | null;
  description?: string | null;
  coverImage?: string | null;
  templateConfig: TemplateConfig;
  approvedPhotos: GalleryPhoto[];
  stats: {
    approvedPhotosCount: number;
    totalRsvps: number;
  };
}

export default function InvitationView({ event }: { event: EventData }) {
  const { templateConfig } = event;
  const theme = templateConfig.theme;

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  useEffect(() => {
    const target = new Date(event.eventDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [event.eventDate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `ندعوكم بكل الحب لمشاركتنا فرحة ${event.groomName} و ${event.brideName} ❤️`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `ندعوكم بكل الحب والسرور لمشاركتنا فرحتنا بمناسبة ${event.title}\n\nتفاصيل الدعوة وتأكيد الحضور عبر الرابط:\n${window.location.href}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const formattedDate = new Date(event.eventDate).toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(event.eventDate).toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className={`min-h-screen ${theme.background} text-[#fbfaf8] py-8 sm:py-16 px-4 relative overflow-hidden`}>
      {/* Decorative Arabesque Corner Motifs */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-bl-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-[#d4af37]/15 to-transparent rounded-br-full pointer-events-none" />

      {/* Floating Action Controls */}
      <div className="fixed top-5 left-5 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          title={isPlayingMusic ? "كتم الموسيقى" : "تشغيل الموسيقى"}
          className="p-3 rounded-full bg-[#161412]/80 backdrop-blur-md border border-[#d4af37]/30 text-[#f3e5ab] hover:scale-105 transition-all shadow-lg"
        >
          {isPlayingMusic ? <Volume2 className="w-4 h-4 text-[#d4af37]" /> : <VolumeX className="w-4 h-4 text-neutral-400" />}
        </button>
      </div>

      <div className="max-w-3xl mx-auto space-y-10 sm:space-y-14 relative z-10">
        {/* Main Invitation Card */}
        <section className={`${theme.cardBackground} rounded-3xl p-6 sm:p-12 text-center relative overflow-hidden border ${theme.borderColor} shadow-2xl`}>
          {/* Top Bismillah / Verse */}
          <div className="space-y-2 mb-8">
            <span className="text-xs sm:text-sm tracking-widest text-[#d4af37]/90 calligraphy-font">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <p className="text-[11px] sm:text-xs text-neutral-400 italic font-serif">
              «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»
            </p>
          </div>

          {/* Invitation Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>دعوة زفاف خاصة</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          {/* Couple Names */}
          <div className="space-y-4 my-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <h1 className="text-4xl sm:text-6xl font-extrabold calligraphy-font text-white tracking-wide">
                {event.groomName}
              </h1>
              <span className="text-2xl sm:text-3xl text-[#d4af37] calligraphy-font">&</span>
              <h1 className="text-4xl sm:text-6xl font-extrabold calligraphy-font text-white tracking-wide">
                {event.brideName}
              </h1>
            </div>

            {event.welcomeMessage && (
              <p className="text-sm sm:text-base text-neutral-300 max-w-lg mx-auto leading-relaxed pt-2">
                {event.welcomeMessage}
              </p>
            )}
          </div>

          {/* Date & Time Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 max-w-xl mx-auto">
            <div className="p-4 rounded-2xl bg-black/30 border border-[#d4af37]/20 flex items-center justify-center gap-3">
              <Calendar className="w-5 h-5 text-[#d4af37] shrink-0" />
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">تاريخ المناسبة</span>
                <span className="text-xs sm:text-sm font-bold text-white">{formattedDate}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-black/30 border border-[#d4af37]/20 flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 text-[#d4af37] shrink-0" />
              <div className="text-right">
                <span className="text-[10px] text-neutral-400 block">موعد الحفل</span>
                <span className="text-xs sm:text-sm font-bold text-white">{formattedTime} مساءً</span>
              </div>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="my-8">
            <p className="text-xs text-[#d4af37] font-semibold mb-3 tracking-wider">
              العد التنازلي لليلة العمر
            </p>
            <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
              {[
                { label: "يوم", value: timeLeft.days },
                { label: "ساعة", value: timeLeft.hours },
                { label: "دقيقة", value: timeLeft.minutes },
                { label: "ثانية", value: timeLeft.seconds },
              ].map((unit, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-4 rounded-2xl bg-[#0f0e0c]/80 border border-[#d4af37]/30 shadow-md flex flex-col items-center justify-center"
                >
                  <span className="text-xl sm:text-3xl font-bold text-[#f3e5ab] font-mono">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs text-neutral-400 mt-1">{unit.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue & Map Card */}
          <div className="p-5 rounded-2xl bg-black/40 border border-[#d4af37]/20 max-w-xl mx-auto my-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-[#d4af37]">
              <MapPin className="w-5 h-5" />
              <span className="font-bold text-sm sm:text-base text-white">{event.venueName}</span>
            </div>
            <p className="text-xs text-neutral-400">{event.address}</p>

            {event.mapUrl && (
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#f3e5ab] bg-[#d4af37]/20 hover:bg-[#d4af37]/30 px-4 py-2 rounded-full border border-[#d4af37]/40 transition-all font-semibold"
              >
                <span>فتح الموقع على Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Primary Action Buttons: RSVP & Upload Photo */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 max-w-md mx-auto">
            <button
              onClick={() => setIsRsvpOpen(true)}
              className={`w-full py-3.5 px-6 rounded-full font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl transition-all ${theme.buttonClass}`}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>تأكيد الحضور (RSVP)</span>
            </button>

            <Link
              href={`/e/${event.slug}/upload`}
              className="w-full py-3.5 px-6 rounded-full bg-[#1b1814] border border-[#d4af37]/40 text-[#f3e5ab] hover:bg-[#d4af37]/20 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4 text-[#d4af37]" />
              <span>شاركنا صورتك بالـ QR</span>
            </Link>
          </div>

          {/* Share Actions */}
          <div className="flex items-center justify-center gap-3 pt-8 border-t border-[#d4af37]/15 mt-8">
            <button
              onClick={handleWhatsAppShare}
              className="px-4 py-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <span>مشاركة عبر الواتساب</span>
            </button>
            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-full bg-neutral-800/80 border border-neutral-700 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "تم نسخ الرابط!" : "نسخ الرابط"}</span>
            </button>
          </div>
        </section>

        {/* Live Memories Gallery Section */}
        <section className={`${theme.cardBackground} rounded-3xl p-6 sm:p-10 border ${theme.borderColor}`}>
          <MemoryGallery
            photos={event.approvedPhotos}
            coupleNames={`${event.groomName} و ${event.brideName}`}
            accentColor={theme.accentColor}
            cardClass={theme.cardBackground}
          />
        </section>

        {/* Footer Brand Credit */}
        <div className="text-center pt-4 pb-12 space-y-1">
          <p className="text-xs text-neutral-500 font-sans">
            تم تصميم هذه الدعوة الفاخرة بواسطة منصة{" "}
            <Link href="/" className="text-[#d4af37] font-bold hover:underline">
              لحظة
            </Link>
          </p>
          <p className="text-[10px] text-neutral-600">من دعوة… إلى ذكرى لا تُنسى</p>
        </div>
      </div>

      {/* RSVP Modal */}
      <RsvpModal
        eventId={event.id}
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        accentColor={theme.accentColor}
        buttonClass={theme.buttonClass}
      />
    </main>
  );
}
