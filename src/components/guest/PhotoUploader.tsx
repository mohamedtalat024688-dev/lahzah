"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, UploadCloud, CheckCircle2, AlertCircle, Loader2, Sparkles, ImagePlus } from "lucide-react";
import confetti from "canvas-confetti";

interface PhotoUploaderProps {
  eventId: string;
  eventTitle: string;
  coupleNames: string;
}

export default function PhotoUploader({
  eventId,
  eventTitle,
  coupleNames,
}: PhotoUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("يرجى اختيار صورة أولاً");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (guestName.trim()) formData.append("guestName", guestName.trim());
      if (message.trim()) formData.append("message", message.trim());

      const res = await fetch(`/api/events/${eventId}/photos`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل رفع الصورة");
      }

      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.5 },
        colors: ["#d4af37", "#f3e5ab", "#ffffff"],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء رفع الصورة";
      setErrorMessage(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl(null);
    setMessage("");
    setIsSuccess(false);
    setErrorMessage("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#14120f]/90 border border-[#d4af37]/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
      {/* Event Header */}
      <div className="text-center mb-6 space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] border border-[#d4af37]/20 text-xs font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>توثيق الذكريات الحية</span>
        </div>
        <h2 className="text-2xl font-bold text-white calligraphy-font">{eventTitle}</h2>
        <p className="text-xs text-[#d4af37]/80">شارك فرحتك ولحظاتك المميزة مع {coupleNames}</p>
      </div>

      {isSuccess ? (
        <div className="py-8 text-center space-y-4 animate-fadeIn">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto mb-2 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-bold text-white calligraphy-font">وصلتنا صورتك الجميلة!</h3>
          <p className="text-neutral-300 text-xs leading-relaxed max-w-xs mx-auto">
            شكراً لمشاركتك هذه اللحظة الرائعة. ستظهر صورتك في ألبوم ذكريات الحفل فور مراجعتها واعتمادها من العروسين ❤️
          </p>

          <button
            onClick={handleReset}
            className="mt-6 w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-sm shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2"
          >
            <ImagePlus className="w-4 h-4" />
            <span>مشاركة صورة أخرى</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 text-xs bg-red-950/60 border border-red-500/40 text-red-200 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Area / Camera Trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] bg-neutral-900/60 rounded-2xl p-6 text-center transition-all group relative overflow-hidden"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment" // Direct camera access on mobile devices
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner">
                <Image
                  src={previewUrl}
                  alt="معاينة الصورة"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1.5 rounded-full">
                    اضغط لتغيير الصورة
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-16 h-16 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">التقط صورة بكاميرا هاتفك أو اختر من المعرض</p>
                  <p className="text-[11px] text-neutral-400">يدعم JPG و PNG و WebP حتى 12 ميجابايت</p>
                </div>
              </div>
            )}
          </div>

          {/* Guest Name */}
          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold text-neutral-300">اسمك الكريم (اختياري)</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="مثال: م. أحمد أو من أصدقاء العريس"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm"
            />
          </div>

          {/* Message / Caption */}
          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold text-neutral-300">كلمة أو أمنية حلوة للعروسين (اختياري)</label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ألف مليون مبروك لأحلى عروسين! ✨"
              className="w-full px-4 py-2 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className={`w-full py-3 rounded-full font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
              file
                ? "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] hover:brightness-110"
                : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
            }`}
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إرسال الصورة...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>مشاركة اللحظة الآن ❤️</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
