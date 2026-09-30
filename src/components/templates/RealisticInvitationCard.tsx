"use client";

import React from "react";
import { TemplateConfig, getTemplate } from "@/lib/templates";
import { Sparkles, Calendar, MapPin, Heart, Clock } from "lucide-react";

// =========================================================================
// REUSABLE INVITATION PRIMITIVES
// =========================================================================

/**
 * 1. InvitationFrame: Handles outer paper texture, elevation, ratios, borders,
 *    and corner architectural ornaments.
 */
export function InvitationFrame({
  template,
  children,
  className = "",
}: {
  template: TemplateConfig;
  children: React.ReactNode;
  className?: string;
}) {
  const isLight = template.theme.isLight;
  const accent = template.theme.accentColor;
  const layout = template.layout;
  const ornaments = template.ornaments;

  // Frame Border Styles
  const getInnerBorderStyle = () => {
    switch (layout.frameStyle) {
      case "double-regal":
        return `border-double border-[3px] border-[${accent}]/40 rounded-[2.2rem]`;
      case "dashed-gold":
        return `border-dashed border border-[${accent}]/35 rounded-[2.2rem]`;
      case "botanical-thin":
        return `border-solid border border-[${accent}]/30 rounded-[2.4rem]`;
      case "hairline-single":
        return `border-solid border ${isLight ? "border-[#dfd6c4]" : "border-slate-800"} rounded-2xl`;
      case "geometric-double":
        return `border-2 border-dotted border-[${accent}]/40 rounded-[2rem]`;
      case "couture-border":
        return `border border-[#d4d4d4] rounded-none`;
      case "arch-dome":
        return `border border-[${accent}]/40 rounded-t-[5rem] rounded-b-2xl`;
      case "deckle-edge":
        return `border border-[${accent}]/30 rounded-[2.6rem]`;
      default:
        return `border border-[${accent}]/30 rounded-[2.2rem]`;
    }
  };

  // Corner Ornaments Rendering
  const renderCorners = () => {
    switch (ornaments.cornerStyle) {
      case "couture-cross":
        return (
          <>
            <span className="absolute top-4 right-4 text-xs font-mono text-[#737373] pointer-events-none">+</span>
            <span className="absolute top-4 left-4 text-xs font-mono text-[#737373] pointer-events-none">+</span>
            <span className="absolute bottom-4 right-4 text-xs font-mono text-[#737373] pointer-events-none">+</span>
            <span className="absolute bottom-4 left-4 text-xs font-mono text-[#737373] pointer-events-none">+</span>
          </>
        );
      case "arch-header":
        return (
          <>
            <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none" style={{ color: accent }}>
              <span className="text-xs">✦</span>
              <span className="text-sm">⚜</span>
              <span className="text-xs">✦</span>
            </div>
            <div className="absolute bottom-4 right-4 text-xs opacity-70 pointer-events-none" style={{ color: accent }}>❖</div>
            <div className="absolute bottom-4 left-4 text-xs opacity-70 pointer-events-none" style={{ color: accent }}>❖</div>
          </>
        );
      case "embossed-crest":
        return (
          <>
            <div className="absolute top-3.5 right-3.5 w-7 h-7 border-t-2 border-r-2 rounded-tr-xl opacity-40 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute top-3.5 left-3.5 w-7 h-7 border-t-2 border-l-2 rounded-tl-xl opacity-40 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute bottom-3.5 right-3.5 w-7 h-7 border-b-2 border-r-2 rounded-br-xl opacity-40 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute bottom-3.5 left-3.5 w-7 h-7 border-b-2 border-l-2 rounded-bl-xl opacity-40 pointer-events-none" style={{ borderColor: accent }} />
          </>
        );
      case "regal-crown":
        return (
          <>
            <div className="absolute top-4 right-4 text-xs font-serif opacity-85 pointer-events-none" style={{ color: accent }}>⚜ ✦</div>
            <div className="absolute top-4 left-4 text-xs font-serif opacity-85 pointer-events-none" style={{ color: accent }}>✦ ⚜</div>
            <div className="absolute bottom-4 right-4 text-xs font-serif opacity-85 pointer-events-none" style={{ color: accent }}>⚜ ✦</div>
            <div className="absolute bottom-4 left-4 text-xs font-serif opacity-85 pointer-events-none" style={{ color: accent }}>✦ ⚜</div>
          </>
        );
      case "botanical-corner":
        return (
          <>
            <div className="absolute top-4 right-4 text-xs font-serif opacity-80 pointer-events-none" style={{ color: accent }}>◆ 🌿</div>
            <div className="absolute top-4 left-4 text-xs font-serif opacity-80 pointer-events-none" style={{ color: accent }}>🌿 ◆</div>
            <div className="absolute bottom-4 right-4 text-xs font-serif opacity-80 pointer-events-none" style={{ color: accent }}>◆ 🌿</div>
            <div className="absolute bottom-4 left-4 text-xs font-serif opacity-80 pointer-events-none" style={{ color: accent }}>🌿 ◆</div>
          </>
        );
      case "geometric-star":
        return (
          <>
            <div className="absolute top-4 right-4 text-xs font-serif opacity-80 pointer-events-none" style={{ color: accent }}>✦ ۞</div>
            <div className="absolute top-4 left-4 text-xs font-serif opacity-80 pointer-events-none" style={{ color: accent }}>۞ ✦</div>
            <div className="absolute bottom-4 right-4 text-xs font-serif opacity-80 pointer-events-none" style={{ color: accent }}>✦ ۞</div>
            <div className="absolute bottom-4 left-4 text-xs font-serif opacity-80 pointer-events-none" style={{ color: accent }}>۞ ✦</div>
          </>
        );
      case "soft-curve":
        return (
          <>
            <div className="absolute top-3.5 right-3.5 w-9 h-9 border-t-2 border-r-2 rounded-tr-3xl opacity-60 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute top-3.5 left-3.5 w-9 h-9 border-t-2 border-l-2 rounded-tl-3xl opacity-60 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute bottom-3.5 right-3.5 w-9 h-9 border-b-2 border-r-2 rounded-br-3xl opacity-60 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute bottom-3.5 left-3.5 w-9 h-9 border-b-2 border-l-2 rounded-bl-3xl opacity-60 pointer-events-none" style={{ borderColor: accent }} />
          </>
        );
      case "hairline-bracket":
        return (
          <>
            <div className="absolute top-4 right-4 w-5 h-5 border-t border-r opacity-60 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute top-4 left-4 w-5 h-5 border-t border-l opacity-60 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b border-r opacity-60 pointer-events-none" style={{ borderColor: accent }} />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-b border-l opacity-60 pointer-events-none" style={{ borderColor: accent }} />
          </>
        );
      case "ornate":
      default:
        return (
          <>
            <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 opacity-60 pointer-events-none rounded-tr-lg" style={{ borderColor: accent }} />
            <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 opacity-60 pointer-events-none rounded-tl-lg" style={{ borderColor: accent }} />
            <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 opacity-60 pointer-events-none rounded-br-lg" style={{ borderColor: accent }} />
            <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 opacity-60 pointer-events-none rounded-bl-lg" style={{ borderColor: accent }} />
          </>
        );
    }
  };

  return (
    <div
      className={`relative w-full max-w-[420px] mx-auto text-center transition-all duration-500 overflow-hidden select-none ${
        template.layout.innerPadding
      } ${template.theme.paperClass} ${layout.paperTexture} ${
        layout.frameStyle === "couture-border" ? "rounded-none" : "rounded-[2.6rem]"
      } ${className}`}
    >
      {/* Subtle Studio Lighting Vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-500"
        style={{
          background: isLight
            ? `radial-gradient(ellipse at 50% 25%, ${accent}12 0%, transparent 70%)`
            : `radial-gradient(ellipse at 50% 25%, ${accent}20 0%, transparent 65%)`,
        }}
      />

      {/* Frame Corner Ornaments */}
      {renderCorners()}

      {/* Inner Architectural Border */}
      <div
        className={`absolute inset-3 pointer-events-none ${getInnerBorderStyle()}`}
        style={{ borderColor: `${accent}35` }}
      />

      {/* Content slot */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * 2. InvitationMonogram: Distinctive seals across tiers (wax, oval cameo, crest, circle seal, minimal)
 */
export function InvitationMonogram({
  template,
  groomName,
  brideName,
}: {
  template: TemplateConfig;
  groomName: string;
  brideName: string;
}) {
  const groomInitial = (groomName || "أ").trim().charAt(0);
  const brideInitial = (brideName || "س").trim().charAt(0);
  const accent = template.theme.accentColor;
  const isLight = template.theme.isLight;
  const style = template.ornaments.monogramStyle;

  if (style === "couture-serif") {
    return (
      <div className="flex flex-col items-center justify-center space-y-1 py-1">
        <span className="text-[10px] tracking-[0.4em] font-sans uppercase font-bold text-[#737373]">
          LAHZAH COUTURE
        </span>
        <div className="w-8 h-px bg-[#d4d4d4] my-1" />
      </div>
    );
  }

  if (style === "minimal-clean") {
    return (
      <div className="flex items-center justify-center gap-2 py-1">
        <span className="text-xs font-mono tracking-[0.3em]" style={{ color: accent }}>
          [{groomInitial} & {brideInitial}]
        </span>
      </div>
    );
  }

  if (style === "embossed-wax") {
    return (
      <div
        className="w-14 h-14 rounded-full border-2 mx-auto flex items-center justify-center shadow-inner transition-transform duration-300 hover:scale-105"
        style={{
          borderColor: accent,
          background: `radial-gradient(circle, ${accent}25 0%, #ebe4d5 80%)`,
        }}
      >
        <span className="text-base font-bold font-serif tracking-widest" style={{ color: accent }}>
          {groomInitial} • {brideInitial}
        </span>
      </div>
    );
  }

  if (style === "arch-keystone") {
    return (
      <div
        className="w-15 h-15 rounded-t-full rounded-b-lg border mx-auto flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105"
        style={{
          borderColor: `${accent}70`,
          background: `radial-gradient(circle, ${accent}30 0%, #171512 85%)`,
        }}
      >
        <span className="text-base font-bold font-display tracking-widest" style={{ color: accent }}>
          {groomInitial} ⚜ {brideInitial}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`w-14 h-14 rounded-full border mx-auto flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105`}
      style={{
        borderColor: `${accent}65`,
        background: isLight
          ? `radial-gradient(circle, ${accent}18 0%, #fbf9f4 80%)`
          : `radial-gradient(circle, ${accent}25 0%, #14120f 80%)`,
      }}
    >
      <span className="text-base font-bold font-display tracking-widest" style={{ color: accent }}>
        {groomInitial} • {brideInitial}
      </span>
    </div>
  );
}

/**
 * 3. InvitationHeader: Bismillah opening + occasion type + optional preamble
 */
export function InvitationHeader({
  template,
  eventType,
  welcomeMessage,
}: {
  template: TemplateConfig;
  eventType?: string;
  welcomeMessage?: string | null;
}) {
  const accent = template.theme.accentColor;
  const isLight = template.theme.isLight;
  const textMuted = isLight ? "text-[#786c5e]" : "text-[#8e877c]";
  const textBody = isLight ? "text-[#4a4036]" : "text-[#c4bdaf]";

  const eventLabel =
    eventType === "ENGAGEMENT"
      ? "حفل خطوبة مبارك"
      : eventType === "CELEBRATION"
      ? "عقد قران مبارك"
      : "حفل زفاف مبارك";

  return (
    <div className="space-y-2 text-center">
      {/* Opening Phrase */}
      {template.layout.headerTreatment === "bismillah-couture" ? (
        <span className="text-[10px] font-sans uppercase tracking-[0.35em] block font-semibold text-[#525252]">
          INVITATION D&apos;HONNEUR
        </span>
      ) : template.layout.headerTreatment === "bismillah-minimal" ? (
        <span className="text-xs font-display tracking-widest block font-medium opacity-80" style={{ color: accent }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
      ) : (
        <span className="text-xs sm:text-sm font-display tracking-widest block pt-0.5 font-semibold" style={{ color: accent }}>
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </span>
      )}

      {/* Occasion Subtitle */}
      <span className={`text-[10px] sm:text-xs block ${template.typography.headerStyle} ${textMuted}`}>
        {eventLabel}
      </span>

      {/* Welcome Preamble */}
      <p className={`text-xs sm:text-sm max-w-xs mx-auto leading-relaxed ${textBody}`}>
        {welcomeMessage ||
          "يتشرف العروسان وأهلهما الكرام بدعوتكم لمشاركتهم فرحة العمر وسعادة هذه الليلة"}
      </p>
    </div>
  );
}

/**
 * 4. InvitationNames: The emotional centerpiece of the invitation card.
 */
export function InvitationNames({
  template,
  groomName,
  brideName,
}: {
  template: TemplateConfig;
  groomName: string;
  brideName: string;
}) {
  const accent = template.theme.accentColor;
  const isLight = template.theme.isLight;
  const textHeading = isLight ? "text-[#1c1917]" : "text-[#faf8f5]";
  const fontStyle = template.typography.coupleFont;
  const divider = template.ornaments.divider;

  // Couture Asymmetric Editorial Layout (For Maison)
  if (template.layout.alignment === "editorial-split") {
    return (
      <div className="py-4 space-y-3 text-center sm:text-right">
        <h2 className="text-4xl sm:text-5xl font-display font-light text-[#0a0a0a] tracking-tight">
          {groomName || "اسم العريس"}
        </h2>
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <span className="text-xs font-mono uppercase tracking-[0.3em] text-[#737373]">ET</span>
          <span className="w-12 h-px bg-[#d4d4d4]" />
        </div>
        <h2 className="text-4xl sm:text-5xl font-display font-light text-[#0a0a0a] tracking-tight">
          {brideName || "اسم العروس"}
        </h2>
      </div>
    );
  }

  return (
    <div className="py-2 space-y-1">
      <h2 className={`text-3xl sm:text-4xl md:text-5xl leading-tight ${fontStyle} ${textHeading}`}>
        {groomName || "اسم العريس"}
      </h2>

      <div className="flex items-center justify-center gap-3 py-1">
        <span className="w-7 h-px opacity-40" style={{ backgroundColor: accent }} />
        <span className="text-sm font-display tracking-widest" style={{ color: accent }}>
          {divider}
        </span>
        <span className="w-7 h-px opacity-40" style={{ backgroundColor: accent }} />
      </div>

      <h2 className={`text-3xl sm:text-4xl md:text-5xl leading-tight ${fontStyle} ${textHeading}`}>
        {brideName || "اسم العروس"}
      </h2>
    </div>
  );
}

/**
 * 5. InvitationDetails: Event Date, Time, Venue & Map
 */
export function InvitationDetails({
  template,
  eventDate,
  eventTime,
  venueName,
  address,
}: {
  template: TemplateConfig;
  eventDate?: string | Date;
  eventTime?: string;
  venueName?: string;
  address?: string | null;
}) {
  const accent = template.theme.accentColor;
  const isLight = template.theme.isLight;
  const textHeading = isLight ? "text-[#1c1917]" : "text-[#faf8f5]";
  const textMuted = isLight ? "text-[#786c5e]" : "text-[#8e877c]";

  const displayDate = eventDate
    ? new Date(eventDate).toLocaleDateString("ar-EG", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "الجمعة، ٢٥ أكتوبر ٢٠٢٦";

  return (
    <div
      className="py-3.5 border-y space-y-2 text-xs"
      style={{ borderColor: `${accent}25` }}
    >
      <div className={`flex items-center justify-center gap-2 ${template.typography.dateStyle} ${textHeading}`}>
        <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
        <span>{displayDate}</span>
      </div>

      <div className={`flex items-center justify-center gap-2 text-xs ${textMuted}`}>
        <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
        <span>الساعة {eventTime || "20:00"} مساءً</span>
      </div>

      <div className={`flex items-center justify-center gap-2 font-medium pt-0.5 ${textHeading}`}>
        <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: accent }} />
        <span>{venueName || "فندق الفورسيزونز - قاعة البلازا"}</span>
      </div>
      {address && (
        <p className={`text-[11px] max-w-xs mx-auto ${textMuted}`}>{address}</p>
      )}
    </div>
  );
}

/**
 * 6. InvitationActions: RSVP & Interactive Memory Album Preview CTAs
 */
export function InvitationActions({
  template,
}: {
  template: TemplateConfig;
}) {
  const accent = template.theme.accentColor;
  const isLight = template.theme.isLight;

  return (
    <div className="pt-1 space-y-2.5">
      <div className="flex items-center justify-center gap-2.5">
        <span
          className="px-4 py-1.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          style={{
            backgroundColor: accent,
            color: isLight ? "#ffffff" : "#0c0b0a",
          }}
        >
          <Heart className="w-3 h-3 fill-current" />
          <span>تأكيد الحضور (RSVP)</span>
        </span>

        <span
          className={`px-3.5 py-1.5 rounded-full text-[11px] flex items-center gap-1.5 transition-all ${
            isLight
              ? "bg-[#ede7da] border border-[#d6cbba] text-[#5c5245]"
              : "bg-[#171412] border border-[#2e2924] text-[#8e877c]"
          }`}
        >
          <Sparkles className="w-3 h-3" style={{ color: accent }} />
          <span>ألبوم الذكريات</span>
        </span>
      </div>

      <p className={`text-[10px] font-display ${isLight ? "text-[#8c8072]" : "text-[#696156]"}`}>
        منصة لحظة • بطاقة دعوة رقمية خاصة
      </p>
    </div>
  );
}

// =========================================================================
// MAIN REALISTIC INVITATION CARD COMPONENT (DATA-DRIVEN RENDERER)
// =========================================================================

interface RealisticInvitationCardProps {
  template?: TemplateConfig;
  templateId?: string;
  groomName?: string;
  brideName?: string;
  eventDate?: string | Date;
  eventTime?: string;
  venueName?: string;
  address?: string | null;
  welcomeMessage?: string | null;
  eventType?: string;
  interactive?: boolean;
  className?: string;
}

export default function RealisticInvitationCard({
  template: propTemplate,
  templateId = "royal-gold",
  groomName = "أحمد منصور",
  brideName = "سارة الجوهري",
  eventDate,
  eventTime = "20:00",
  venueName = "فندق الفورسيزونز - قاعة البلازا",
  address,
  welcomeMessage,
  eventType = "WEDDING",
  interactive = true,
  className = "",
}: RealisticInvitationCardProps) {
  const template: TemplateConfig = propTemplate || getTemplate(templateId);

  return (
    <InvitationFrame template={template} className={className}>
      <div className="space-y-6">
        {/* Monogram Seal Crest */}
        <InvitationMonogram
          template={template}
          groomName={groomName}
          brideName={brideName}
        />

        {/* Header / Preamble */}
        <InvitationHeader
          template={template}
          eventType={eventType}
          welcomeMessage={welcomeMessage}
        />

        {/* Majestic Couple Names Display */}
        <InvitationNames
          template={template}
          groomName={groomName}
          brideName={brideName}
        />

        {/* Date, Time & Venue */}
        <InvitationDetails
          template={template}
          eventDate={eventDate}
          eventTime={eventTime}
          venueName={venueName}
          address={address}
        />

        {/* Interactive Features Preview / Wax Seal */}
        {interactive && <InvitationActions template={template} />}
      </div>
    </InvitationFrame>
  );
}
