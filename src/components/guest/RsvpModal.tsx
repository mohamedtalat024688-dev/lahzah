"use client";

import { useState, useEffect } from "react";
import { Check, X, HelpCircle, Users, Send, HeartHandshake, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

interface RsvpModalProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  accentColor?: string;
  buttonClass?: string;
}

export default function RsvpModal({
  eventId,
  isOpen,
  onClose,
  accentColor = "#c5a880",
}: RsvpModalProps) {
  const [guestName, setGuestName] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<"ATTENDING" | "NOT_ATTENDING" | "MAYBE">(
    "ATTENDING"
  );
  const [guestCount, setGuestCount] = useState(1);
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMessage("يرجى كتابة الاسم الكريم");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestName.trim(),
          phone: phone.trim() || undefined,
          attendanceStatus,
          guestCount: attendanceStatus === "ATTENDING" ? guestCount : 0,
          note: note.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل الرد");
      }

      setIsSuccess(true);
      if (attendanceStatus === "ATTENDING") {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#c5a880", "#faf8f5", "#86efac"],
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ أثناء الإرسال";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rsvp-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="relative w-full max-w-lg bg-[#141210] border border-[#26221d] rounded-3xl p-6 sm:p-8 shadow-2xl text-right overflow-hidden">
        {/* Background glow decoration */}
        <div
          className="absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <button
          onClick={onClose}
          aria-label="إغلاق نافذة تأكيد الحضور"
          className="absolute top-4 left-4 min-w-[44px] min-h-[44px] p-2 text-[#8e877c] hover:text-[#faf8f5] rounded-full hover:bg-[#1c1916] transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#16271c] text-[#86efac] border border-[#23482d] flex items-center justify-center mx-auto mb-2">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3
              id="rsvp-modal-title"
              className="text-2xl font-bold font-display text-[#faf8f5]"
            >
              {attendanceStatus === "ATTENDING" ? "يسعدنا ويشرفنا حضوركم!" : "شكراً لردكم الكريم"}
            </h3>
            <p className="text-[#8e877c] text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
              {attendanceStatus === "ATTENDING"
                ? "تم تسجيل تأكيد حضورك بنجاح، ننتظر رؤيتكم بشوق لمشاركتنا فرحة العمر."
                : "تم استلام اعتذاركم الكريم، وتمنياتنا لكم بكل الخير والسعادة."}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-2.5 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-[#26221d] pb-4">
              <h3
                id="rsvp-modal-title"
                className="text-2xl font-bold font-display text-[#faf8f5]"
              >
                تأكيد الحضور (RSVP)
              </h3>
              <p className="text-xs text-[#8e877c] mt-1">
                يسعدنا إعلامنا بإمكانية حضوركم لمساعدتنا في ترتيبات الاستقبال الكريمة
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 text-xs bg-[#241312] border border-[#522320] text-[#fca5a5] rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Attendance Choice */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#c4bdaf]">
                هل ستشرفنا بالحضور؟
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceStatus("ATTENDING")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "ATTENDING"
                      ? "border-[#23482d] bg-[#16271c] text-[#86efac]"
                      : "border-[#26221d] bg-[#171412] text-[#8e877c] hover:border-[#383129]"
                  }`}
                >
                  <Check className="w-4 h-4 text-[#86efac]" />
                  <span>حاضر بإذن الله</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceStatus("MAYBE")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "MAYBE"
                      ? "border-[#4d3d22] bg-[#2a241a] text-[#fcd34d]"
                      : "border-[#26221d] bg-[#171412] text-[#8e877c] hover:border-[#383129]"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-[#fcd34d]" />
                  <span>ربما (غير مؤكد)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceStatus("NOT_ATTENDING")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "NOT_ATTENDING"
                      ? "border-[#522525] bg-[#291717] text-[#fca5a5]"
                      : "border-[#26221d] bg-[#171412] text-[#8e877c] hover:border-[#383129]"
                  }`}
                >
                  <X className="w-4 h-4 text-[#f87171]" />
                  <span>أعتذر عن الحضور</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#c4bdaf]">الاسم الكريم *</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="مثال: د. أحمد خالد أو عائلة الأستاذ محمد"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1a1714] border border-[#2e2924] text-[#faf8f5] placeholder-[#5c554b] focus:outline-none focus:border-[#c5a880] text-xs transition-colors"
              />
            </div>

            {/* Guest Count (if attending) */}
            {attendanceStatus === "ATTENDING" && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-medium text-[#c4bdaf] flex items-center justify-between">
                  <span>عدد الأفراد (معك)</span>
                  <span className="text-[#c5a880] text-xs font-bold font-mono">{guestCount} فرد</span>
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8e877c]" />
                  <div className="grid grid-cols-5 gap-2 w-full">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`py-2.5 min-h-[44px] flex items-center justify-center rounded-xl border text-xs font-semibold transition-all ${
                          guestCount === num
                            ? "bg-[#c5a880] text-[#0c0b0a] border-[#c5a880]"
                            : "bg-[#171412] border-[#26221d] text-[#8e877c] hover:border-[#383129]"
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
              <label className="text-xs font-medium text-[#c4bdaf]">
                رقم الهاتف أو الواتساب (اختياري)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 10 1234 5678"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1a1714] border border-[#2e2924] text-[#faf8f5] placeholder-[#5c554b] focus:outline-none focus:border-[#c5a880] text-xs text-right transition-colors"
              />
            </div>

            {/* Note / Wishes */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#c4bdaf]">
                كلمة أو تهنئة للعروسين (اختياري)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="بارك الله لكما وبارك عليكما وجمع بينكما في خير..."
                className="w-full px-4 py-2 rounded-xl bg-[#1a1714] border border-[#2e2924] text-[#faf8f5] placeholder-[#5c554b] focus:outline-none focus:border-[#c5a880] text-xs text-right resize-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 min-h-[44px] rounded-full bg-[#c5a880] text-[#0c0b0a] hover:bg-[#d8be99] font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
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
