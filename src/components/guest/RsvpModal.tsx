"use client";

import { useState } from "react";
import {
  X,
  Check,
  HelpCircle,
  Users,
  Send,
  Loader2,
  HeartHandshake,
} from "lucide-react";

interface RsvpModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  accentColor?: string;
}

export default function RsvpModal({
  isOpen,
  onClose,
  eventId,
  accentColor = "#790D20",
}: RsvpModalProps) {
  const [guestName, setGuestName] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<
    "ATTENDING" | "NOT_ATTENDING" | "MAYBE"
  >("ATTENDING");
  const [guestCount, setGuestCount] = useState(1);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          attendanceStatus,
          guestCount: attendanceStatus === "ATTENDING" ? guestCount : 1,
          phone: phone || undefined,
          note: note || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل الرد");
      }

      setIsSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء الإرسال";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-[#FFFDFC] border border-[#EFE4DC] rounded-3xl p-6 sm:p-8 shadow-2xl text-right overflow-hidden">
        {/* Background glow decoration */}
        <div
          className="absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <button
          onClick={onClose}
          aria-label="إغلاق نافذة تأكيد الحضور"
          className="absolute top-4 left-4 min-w-[44px] min-h-[44px] p-2 text-[#8B7778] hover:text-[#390E19] rounded-full hover:bg-[#FFF9F5] transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#F0F7EE] text-[#2E6827] border border-[#C5DEC0] flex items-center justify-center mx-auto mb-2">
              <HeartHandshake className="w-8 h-8 text-[#5B9C51]" />
            </div>
            <h3
              id="rsvp-modal-title"
              className="text-2xl font-bold font-serif text-[#390E19]"
            >
              {attendanceStatus === "ATTENDING" ? "يسعدنا ويشرفنا حضوركم!" : "شكراً لردكم الكريم"}
            </h3>
            <p className="text-[#8B7778] text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
              {attendanceStatus === "ATTENDING"
                ? "تم تسجيل تأكيد حضورك بنجاح، ننتظر رؤيتكم بشوق لمشاركتنا فرحة العمر."
                : "تم استلام اعتذاركم الكريم، وتمنياتنا لكم بكل الخير والسعادة."}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-2.5 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#630A19] transition-all shadow-sm"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-[#EFE4DC] pb-4">
              <h3
                id="rsvp-modal-title"
                className="text-2xl font-bold font-serif text-[#390E19]"
              >
                تأكيد الحضور (RSVP)
              </h3>
              <p className="text-xs text-[#8B7778] mt-1">
                يسعدنا إعلامنا بإمكانية حضوركم لمساعدتنا في ترتيبات الاستقبال الكريمة
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 text-xs bg-[#FFF0F0] border border-[#F1DEDF] text-[#A82323] rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Attendance Choice */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#493B3B]">
                هل ستشرفنا بالحضور؟
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceStatus("ATTENDING")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "ATTENDING"
                      ? "border-[#3D7A42] bg-[#F0F7EE] text-[#2E6827]"
                      : "border-[#EFE4DC] bg-[#FFF9F5] text-[#8B7778] hover:border-[#790D20]"
                  }`}
                >
                  <Check className="w-4 h-4 text-[#2E6827]" />
                  <span>حاضر بإذن الله</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceStatus("MAYBE")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "MAYBE"
                      ? "border-[#D6B77A] bg-[#FAF3E5] text-[#8B6B23]"
                      : "border-[#EFE4DC] bg-[#FFF9F5] text-[#8B7778] hover:border-[#790D20]"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-[#8B6B23]" />
                  <span>ربما (غير مؤكد)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceStatus("NOT_ATTENDING")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "NOT_ATTENDING"
                      ? "border-[#F1DEDF] bg-[#FFF0F0] text-[#A82323]"
                      : "border-[#EFE4DC] bg-[#FFF9F5] text-[#8B7778] hover:border-[#790D20]"
                  }`}
                >
                  <X className="w-4 h-4 text-[#A82323]" />
                  <span>أعتذر عن الحضور</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#493B3B]">الاسم الكريم *</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="مثال: د. أحمد خالد أو عائلة الأستاذ محمد"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#EFE4DC] text-[#390E19] placeholder-[#8B7778] focus:outline-none focus:border-[#790D20] text-xs transition-colors"
              />
            </div>

            {/* Guest Count (if attending) */}
            {attendanceStatus === "ATTENDING" && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-[#493B3B] flex items-center justify-between">
                  <span>عدد الأفراد (معك)</span>
                  <span className="text-[#790D20] text-xs font-bold font-mono">{guestCount} فرد</span>
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8B7778]" />
                  <div className="grid grid-cols-5 gap-2 w-full">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`py-2.5 min-h-[44px] flex items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
                          guestCount === num
                            ? "bg-[#790D20] text-white border-[#790D20]"
                            : "bg-[#FFF9F5] border-[#EFE4DC] text-[#8B7778] hover:border-[#790D20]"
                        }`}
                      >
                        {num === 5 ? "5+" : num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#493B3B]">
                رقم الهاتف أو الواتساب (اختياري)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 10 1234 5678"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#EFE4DC] text-[#390E19] placeholder-[#8B7778] focus:outline-none focus:border-[#790D20] text-xs text-right transition-colors"
              />
            </div>

            {/* Note / Wishes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#493B3B]">
                كلمة أو تهنئة للعروسين (اختياري)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="بارك الله لكما وبارك عليكما وجمع بينكما في خير..."
                className="w-full px-4 py-2 rounded-xl bg-[#FFF9F5] border border-[#EFE4DC] text-[#390E19] placeholder-[#8B7778] focus:outline-none focus:border-[#790D20] text-xs text-right resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 min-h-[44px] rounded-full bg-[#790D20] text-white hover:bg-[#630A19] font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تسجيل الرد...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>إرسال تأكيد الحضور</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}