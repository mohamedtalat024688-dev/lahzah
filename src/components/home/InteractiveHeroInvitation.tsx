"use client";

import React, { useState } from "react";
import RealisticInvitationCard from "@/components/templates/RealisticInvitationCard";
import { fireCelebrationConfetti } from "@/components/ui/ConfettiEffect";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function InteractiveHeroInvitation() {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (e: React.MouseEvent) => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      fireCelebrationConfetti({ x, y });
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background Studio Shadow & Warm Ambient Glow */}
      <div
        className="absolute -inset-6 bg-gradient-to-b from-[#F5B5C8]/15 via-[#FFCBA4]/20 to-[#D6AD65]/10 rounded-[3rem] blur-3xl opacity-70 pointer-events-none transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Main Luxury Stationery Envelope & Card Assembly */}
      <div className="relative mx-auto">
        {/* Layer 1: Envelope Pocket Base */}
        <div
          className={`relative bg-[#FBF6EE] border border-[#E4D6C6] rounded-[2.5rem] p-4 sm:p-6 shadow-[0_25px_60px_-15px_rgba(81,53,79,0.12),0_4px_12px_rgba(81,53,79,0.04)] transition-all duration-700 ${
            isOpen ? "pb-8" : "hover:shadow-[0_30px_70px_-12px_rgba(81,53,79,0.16)]"
          }`}
        >
          {/* Subtle Fine-Linen Stationery Texture Lines */}
          <div
            className="absolute inset-0 rounded-[2.5rem] opacity-30 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(#C5A059 0.75px, transparent 0.75px), radial-gradient(#C5A059 0.75px, #FBF6EE 0.75px)",
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px",
            }}
          />

          {/* Top Envelope Flap / Header Accent */}
          <div className="relative z-10 flex items-center justify-between mb-4 pb-3 border-b border-[#E8DC CE]/80 text-[11px] text-[#786C68]">
            <span className="font-serif tracking-widest uppercase text-[#9A7B38] font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6AD65]" />
              بطاقة دعوة زفاف خاصة
            </span>
            <span className="font-serif text-[#51354F] font-bold">لحظة • أتيلييه الدعوات</span>
          </div>

          {/* The Physical Invitation Card */}
          <div
            className={`relative z-10 transition-all duration-700 ease-out transform ${
              isOpen
                ? "translate-y-0 scale-100 rotate-0"
                : "-translate-y-2 hover:-translate-y-3 rotate-[-0.5deg]"
            }`}
          >
            <RealisticInvitationCard
              templateId="royal-gold"
              groomName="أحمد منصور"
              brideName="سارة الجوهري"
              eventDate="2026-10-25"
              eventTime="20:00"
              venueName="فندق الفورسيزونز - قاعة البلازا"
              address="كورنيش النيل، جاردن سيتي، القاهرة"
              welcomeMessage="يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة العمر وتوثيق أجمل اللحظات"
              interactive={true}
              className="w-full shadow-[0_15px_35px_-5px_rgba(0,0,0,0.25)] rounded-[2rem]"
            />
          </div>

          {/* Envelope Seal & Interaction Controller */}
          <div className="relative z-20 -mt-6 flex flex-col items-center">
            {/* The Carmine Wax Seal Button */}
            <button
              onClick={handleToggle}
              type="button"
              aria-label={isOpen ? "إغلاق مظروف الدعوة" : "فض ختم الشمع وفتح الدعوة"}
              className={`group/seal relative flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#F27D72]/30 active:scale-95 ${
                isOpen ? "translate-y-2" : "translate-y-0 hover:scale-105"
              }`}
            >
              {/* Wax Seal Outer Bevel */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#A83226] via-[#8C2419] to-[#63140C] shadow-[0_8px_20px_rgba(140,36,25,0.4),inset_0_2px_3px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.5)] flex items-center justify-center border border-[#7A1E14]">
                {/* Inner Pressed Monogram Ring */}
                <div className="w-10 h-10 rounded-full border border-[#D9776E]/40 flex items-center justify-center text-white/95 font-serif shadow-inner">
                  <span className="text-xl font-bold tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    ل
                  </span>
                </div>
              </div>

              {/* Seal Ring Label Tooltip */}
              <span className="absolute -bottom-7 whitespace-nowrap text-[11px] font-semibold tracking-wide text-[#51354F] bg-[#FFFDF9]/95 px-3 py-0.5 rounded-full border border-[#EADBCE] shadow-sm backdrop-blur-sm group-hover/seal:text-[#8C2419] transition-colors">
                {isOpen ? "اضغط لإغلاق المظروف" : "المس الختم لفتح الدعوة ✦"}
              </span>
            </button>
          </div>

          {/* Revealed Action Footer when Open */}
          {isOpen && (
            <div className="relative z-10 mt-10 pt-4 border-t border-[#EADBCE]/80 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-xs text-[#51354F] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#5B9C51]" />
                <span>تأكيد الحضور (RSVP) مفعّل فورياً للضيوف</span>
              </div>
              <Link
                href="/dashboard/events/new"
                className="px-5 py-2 rounded-full bg-[#51354F] hover:bg-[#3D283C] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>صمم مثل هذه البطاقة</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Tactile Stationery Detail Flap Behind */}
        <div
          className="absolute -bottom-3 inset-x-6 h-6 bg-[#EFE4D6] border border-[#DECDBB] rounded-[2rem] -z-10 shadow-sm"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
