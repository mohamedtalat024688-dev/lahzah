"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Heart,
  Share2,
  Camera,
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
      navigator
        .share({
          title: event.title,
          text: `ندعوكم بكل الحب لمشاركتنا فرحة ${event.groomName} و ${event.brideName} ❤️`,
          url: window.location.href,
        })
        .catch(() => {});
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

  const isLightPaper = templateConfig.theme.isLight;
  const textPrimary = isLightPaper ? "text-[#1c1917]" : "text-[#faf8f5]";
  const textSecondary = isLightPaper ? "text-[#786c5e]" : "text-[#8e877c]";
  const borderColor = isLightPaper ? "border-[#e0d6c3]" : "border-[#26221d]";

  const groomInitial = (event.groomName || "أ").trim().charAt(0);
  const brideInitial = (event.brideName || "س").trim().charAt(0);
  const ornament = templateConfig.ornaments;
  const typography = templateConfig.typography;

  return (
    <div
      className={`min-h-screen ${theme.background} ${textPrimary} selection:bg-[#c5a880]/30 selection:text-[#f5f2eb] relative overflow-hidden font-body`}
    >
      {/* Subtle Ambient Glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 blur-3xl opacity-15 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${theme.accentColor} 0%, transparent 70%)`,
        }}
      />

      {/* Floating Audio Control (Refined & Minimal) */}
      <div className="fixed top-5 left-5 z-40">
        <button
          onClick={() => setIsPlayingMusic(!isPlayingMusic)}
          title={isPlayingMusic ? "كتم الموسيقى" : "تشغيل الموسيقى"}
          className={`p-3 rounded-full backdrop-blur-md border shadow-md hover:scale-105 transition-all ${
            isLightPaper
              ? "bg-[#faf8f5]/90 border-[#e0d6c3] text-[#a8824f]"
              : "bg-[#141210]/80 border-[#2e2924] text-[#c5a880]"
          }`}
        >
          {isPlayingMusic ? (
            <Volume2 className="w-4 h-4" />
          ) : (
            <VolumeX className="w-4 h-4 opacity-70" />
          )}
        </button>
      </div>

      {/* MAIN EDITORIAL INVITATION BODY */}
      <article className="max-w-2xl mx-auto px-6 py-16 sm:py-24 space-y-20 relative z-10 text-center">
        {/* 1. Grand Opening Section */}
        <section className="space-y-8 animate-fadeIn">
          {/* Royal Monogram Medallion */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div
              className="w-16 h-16 rounded-full border flex items-center justify-center shadow-lg transition-transform hover:scale-105"
              style={{
                borderColor: `${theme.accentColor}70`,
                background: isLightPaper
                  ? `radial-gradient(circle, ${theme.accentColor}20 0%, transparent 80%)`
                  : `radial-gradient(circle, ${theme.accentColor}25 0%, transparent 80%)`,
              }}
            >
              <span
                className="text-lg font-bold font-display tracking-widest"
                style={{ color: theme.accentColor }}
              >
                {groomInitial} • {brideInitial}
              </span>
            </div>

            {/* Bismillah & Quranic Verse */}
            <div className="space-y-2 pt-1">
              <span
                className="text-xs sm:text-sm font-display tracking-widest font-semibold block"
                style={{ color: theme.accentColor }}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <p className={`text-xs sm:text-sm font-display italic max-w-md mx-auto leading-relaxed ${textSecondary}`}>
                «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا
                وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً»
              </p>
            </div>
          </div>

          <div
            className="w-16 h-px mx-auto my-6 opacity-40"
            style={{ backgroundColor: theme.accentColor }}
          />

          {/* Invitation Badge */}
          <div className="space-y-1">
            <p className={`text-xs uppercase tracking-widest ${textSecondary}`}>
              {event.eventType === "WEDDING"
                ? "دعوة لحضور حفل زفاف مبارك"
                : event.eventType === "ENGAGEMENT"
                ? "دعوة لحضور حفل خطوبة مبارك"
                : "دعوة لحضور عقد قران مبارك"}
            </p>
          </div>

          {/* Couple Names (Majestic Display Typography) */}
          <div className="space-y-4 py-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6">
              <h1 className={`text-4xl sm:text-6xl md:text-7xl ${typography.coupleFont} tracking-wide ${textPrimary}`}>
                {event.groomName}
              </h1>
              <span
                className="text-2xl sm:text-4xl font-serif font-normal my-1 sm:my-0"
                style={{ color: theme.accentColor }}
              >
                &
              </span>
              <h1 className={`text-4xl sm:text-6xl md:text-7xl ${typography.coupleFont} tracking-wide ${textPrimary}`}>
                {event.brideName}
              </h1>
            </div>

            {/* Template-specific divider */}
            <div className="flex items-center justify-center gap-3 py-1">
              <span className="w-10 h-px opacity-30" style={{ backgroundColor: theme.accentColor }} />
              <span className="text-sm font-display tracking-widest" style={{ color: theme.accentColor }}>
                {ornament.divider}
              </span>
              <span className="w-10 h-px opacity-30" style={{ backgroundColor: theme.accentColor }} />
            </div>

            {event.welcomeMessage && (
              <p className={`text-sm sm:text-base max-w-md mx-auto leading-relaxed pt-2 ${isLightPaper ? "text-[#4a4036]" : "text-[#c4bdaf]"}`}>
                {event.welcomeMessage}
              </p>
            )}
          </div>

          {/* Wedding Date Display */}
          <div className="space-y-2 pt-2">
            <div className={`text-lg sm:text-xl font-display font-semibold ${textPrimary}`}>
              {formattedDate}
            </div>
            <div className={`text-xs flex items-center justify-center gap-2 ${textSecondary}`}>
              <Clock className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
              <span>الساعة {formattedTime} مساءً</span>
            </div>
          </div>
        </section>

        {/* 2. Countdown Timer (Minimal Hairline Layout, No Heavy Boxes) */}
        <section className={`space-y-4 py-6 border-y ${borderColor}`}>
          <p className="text-xs font-display tracking-widest" style={{ color: theme.accentColor }}>
            العد التنازلي لليلة العمر
          </p>
          <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
            {[
              { label: "يوم", value: timeLeft.days },
              { label: "ساعة", value: timeLeft.hours },
              { label: "دقيقة", value: timeLeft.minutes },
              { label: "ثانية", value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div key={idx} className="space-y-1">
                <span className={`text-2xl sm:text-3xl font-light font-mono block ${textPrimary}`}>
                  {String(unit.value).padStart(2, "0")}
                </span>
                <span className={`text-[10px] tracking-wider block font-sans ${textSecondary}`}>
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Venue & Location Section */}
        <section className="space-y-4">
          <div className="space-y-2">
            <span className={`text-xs uppercase tracking-widest block ${textSecondary}`}>
              مكان الاحتفال
            </span>
            <h3 className={`text-2xl sm:text-3xl font-bold font-display ${textPrimary}`}>
              {event.venueName}
            </h3>
            <p className={`text-xs sm:text-sm max-w-sm mx-auto ${textSecondary}`}>{event.address}</p>
          </div>

          {event.mapUrl && (
            <div className="pt-2">
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 text-xs py-2 px-5 rounded-full border transition-all font-medium ${
                  isLightPaper
                    ? "bg-[#faf8f5] border-[#e0d6c3] text-[#7c5f34] hover:border-[#a8824f]"
                    : "bg-[#171411] border-[#2e2924] text-[#c5a880] hover:text-[#d8be99] hover:border-[#3d3630]"
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>فتح الموقع عبر خرائط جوجل (Google Maps)</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </div>
          )}

          {event.description && (
            <p className={`text-xs italic max-w-md mx-auto pt-4 leading-relaxed ${textSecondary}`}>
              {event.description}
            </p>
          )}
        </section>

        {/* 4. Emotional RSVP & Guest Interactions */}
        <section className={`space-y-4 py-8 border-y ${borderColor}`}>
          <div className="space-y-1">
            <h4 className={`text-xl font-bold font-display ${textPrimary}`}>
              يسعدنا حضوركم وتشريفكم
            </h4>
            <p className={`text-xs ${textSecondary}`}>
              يرجى تأكيد حضوركم لمساعدتنا في ترتيب مقاعدكم الكريمة
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
            <button
              onClick={() => setIsRsvpOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
              style={{
                backgroundColor: theme.accentColor,
                color: isLightPaper ? "#ffffff" : "#0c0b0a",
              }}
            >
              <Heart className="w-4 h-4 fill-current" />
              <span>تأكيد الحضور (RSVP)</span>
            </button>

            <Link
              href={`/e/${event.slug}/upload`}
              className={`w-full sm:w-auto px-6 py-3.5 rounded-full border font-medium text-xs transition-colors flex items-center justify-center gap-2 ${
                isLightPaper
                  ? "bg-[#faf8f5] border-[#e0d6c3] text-[#1c1917] hover:border-[#a8824f]"
                  : "bg-[#171411] border-[#2e2924] text-[#faf8f5] hover:border-[#3d3630]"
              }`}
            >
              <Camera className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span>شاركنا لحظة من يومنا</span>
            </Link>
          </div>

          {/* Social Share actions */}
          <div className={`flex items-center justify-center gap-3 pt-6 text-xs ${textSecondary}`}>
            <button
              onClick={handleWhatsAppShare}
              className={`transition-colors flex items-center gap-1.5 hover:${textPrimary}`}
            >
              <span>مشاركة عبر واتساب</span>
            </button>
            <span className="opacity-40">•</span>
            <button
              onClick={handleShare}
              className={`transition-colors flex items-center gap-1.5 hover:${textPrimary}`}
            >
              {copied ? (
                <span className="text-[#86efac]">تم نسخ رابط الدعوة!</span>
              ) : (
                <>
                  <Share2 className="w-3 h-3" style={{ color: theme.accentColor }} />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 5. Memory Gallery & Guest Wishes */}
        <section className="space-y-6 pt-4">
          <div className="space-y-1">
            <h3 className={`text-2xl font-bold font-display flex items-center justify-center gap-2 ${textPrimary}`}>
              <Sparkles className="w-4 h-4" style={{ color: theme.accentColor }} />
              <span>ألبوم ذكريات الحفل</span>
            </h3>
            <p className={`text-xs ${textSecondary}`}>
              لقطات وتهاني التقطها الأهل والأصدقاء ليخلدوا بها فرحة هذا اليوم
            </p>
          </div>

          <MemoryGallery
            photos={event.approvedPhotos}
            coupleNames={`${event.groomName} و ${event.brideName}`}
            accentColor={theme.accentColor}
          />
        </section>

        {/* 6. Refined Minimal Brand Credit Footer */}
        <footer className={`pt-12 pb-6 border-t space-y-1 ${borderColor}`}>
          <p className={`text-xs ${isLightPaper ? "text-[#786c5e]" : "text-[#5c554b]"}`}>
            تم تصميم هذه الدعوة الفاخرة بواسطة منصة{" "}
            <Link href="/" className="hover:underline font-medium" style={{ color: theme.accentColor }}>
              لحظة
            </Link>
          </p>
          <p className={`text-[10px] font-display ${isLightPaper ? "text-[#a39788]" : "text-[#423d36]"}`}>من دعوة… إلى ذكرى لا تُنسى</p>
        </footer>
      </article>

      {/* RSVP Modal */}
      <RsvpModal
        eventId={event.id}
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        accentColor={theme.accentColor}
      />
    </div>
  );
}
