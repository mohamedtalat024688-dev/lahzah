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
  accentColor = "#d4af37",
  buttonClass,
}: RsvpModalProps) {
  const [guestName, setGuestName] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<"ATTENDING" | "NOT_ATTENDING" | "MAYBE">("ATTENDING");
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
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#d4af37", "#f3e5ab", "#ffffff", "#10b981"],
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
      <div className="relative w-full max-w-lg bg-[#14120f] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 shadow-2xl text-right overflow-hidden">
        {/* Background glow decoration */}
        <div
          className="absolute -top-24 -right-24 w-52 h-52 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        <button
          onClick={onClose}
          aria-label="إغلاق نافذة تأكيد الحضور"
          className="absolute top-5 left-5 p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2 animate-bounce">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <h3 id="rsvp-modal-title" className="text-2xl font-bold text-white calligraphy-font">
              {attendanceStatus === "ATTENDING" ? "يسعدنا ويشرفنا حضوركم!" : "شكراً لردكم الكريم"}
            </h3>
            <p className="text-neutral-300 text-sm max-w-xs mx-auto">
              {attendanceStatus === "ATTENDING"
                ? "تم تسجيل تأكيد حضورك بنجاح، ننتظر رؤيتكم بشوق لمشاركتنا فرحة العمر ❤️"
                : "تم استلام اعتذاركم الكريم، وتمنياتنا لكم بكل الخير والسعادة."}
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-8 py-2.5 rounded-full bg-[#201d18] text-[#f3e5ab] border border-[#d4af37]/40 hover:bg-[#d4af37]/20 transition-all text-sm font-medium"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border-b border-[#d4af37]/20 pb-4">
              <h3 id="rsvp-modal-title" className="text-2xl font-bold text-white calligraphy-font">تأكيد الحضور (RSVP)</h3>
              <p className="text-xs text-[#d4af37]/80 mt-1">
                يسعدنا إعلامنا بإمكانية حضوركم لمساعدتنا في الترتيبات
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 text-xs bg-red-950/60 border border-red-500/40 text-red-200 rounded-xl">
                {errorMessage}
              </div>
            )}

            {/* Attendance Choice */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">هل ستشرفنا بالحضور؟</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceStatus("ATTENDING")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "ATTENDING"
                      ? "border-emerald-500 bg-emerald-950/40 text-emerald-300 shadow-md shadow-emerald-950"
                      : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>بكل تأكيد حاضر</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceStatus("MAYBE")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "MAYBE"
                      ? "border-amber-500 bg-amber-950/40 text-amber-300 shadow-md shadow-amber-950"
                      : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>ربما (غير مؤكد)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttendanceStatus("NOT_ATTENDING")}
                  className={`py-3 px-2 rounded-2xl border text-xs font-medium flex flex-col items-center gap-1.5 transition-all ${
                    attendanceStatus === "NOT_ATTENDING"
                      ? "border-rose-500 bg-rose-950/40 text-rose-300 shadow-md shadow-rose-950"
                      : "border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700"
                  }`}
                >
                  <X className="w-4 h-4 text-rose-400" />
                  <span>أعتذر عن الحضور</span>
                </button>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">الاسم الكريم *</label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="مثال: د. أحمد خالد أو عائلة الأستاذ محمد"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm"
              />
            </div>

            {/* Guest Count (if attending) */}
            {attendanceStatus === "ATTENDING" && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
                  <span>عدد الأفراد (معك)</span>
                  <span className="text-[#d4af37] text-xs font-bold">{guestCount} فرد</span>
                </label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-neutral-400" />
                  <div className="grid grid-cols-5 gap-2 w-full">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuestCount(num)}
                        className={`py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                          guestCount === num
                            ? "bg-[#d4af37] text-[#0d0c0a] border-[#d4af37]"
                            : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
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
              <label className="text-xs font-semibold text-neutral-300">
                رقم الهاتف أو الواتساب (اختياري)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 10 1234 5678"
                dir="ltr"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
              />
            </div>

            {/* Note / Wishes */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300">
                كلمة أو تهنئة للعروسين (اختياري)
              </label>
              <textarea
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="ألف مبروك وبالرفاه والبنين..."
                className="w-full px-4 py-2 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                buttonClass ||
                "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] hover:brightness-110"
              } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري تسجيل الرد...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال التأكيد</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
