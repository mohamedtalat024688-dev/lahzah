"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImagePlus,
  Clock,
  ShieldCheck,
} from "lucide-react";
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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      // Client-side quick size validation
      if (selectedFile.size > 12 * 1024 * 1024) {
        setErrorMessage("حجم الصورة يتجاوز الحد الأقصى المسموح به (12 ميجابايت). يرجى اختيار صورة أصغر.");
        return;
      }

      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage("يرجى التقاط صورة أو اختيار ملف أولاً");
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);
    setErrorMessage("");

    // Smooth upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        return prev + 15;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (guestName.trim()) formData.append("guestName", guestName.trim());
      if (message.trim()) formData.append("message", message.trim());

      const res = await fetch(`/api/events/${eventId}/photos`, {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل رفع الصورة");
      }

      setIsSuccess(true);
      confetti({
        particleCount: 75,
        spread: 65,
        origin: { y: 0.6 },
        colors: ["#790D20", "#390E19", "#D8B8B8", "#D6B77A", "#F1DEDF", "#FFF9F5"],
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء رفع الصورة";
      setErrorMessage(msg);
    } finally {
      clearInterval(progressInterval);
      setIsUploading(false);
      setUploadProgress(0);
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
    <div className="w-full max-w-md mx-auto bg-[#FFFDFC] border border-[#EFE4DC] rounded-3xl p-6 sm:p-8 shadow-xl text-right">
      {/* Event Header */}
      <div className="text-center mb-6 space-y-1.5">
        <span className="text-[11px] font-serif uppercase tracking-widest text-[#D6B77A] font-semibold block">
          شاركنا لحظة من يومنا
        </span>
        <h2 className="text-2xl font-bold font-serif text-[#390E19]">{eventTitle}</h2>
        <p className="text-xs text-[#8B7778]">خلّد أجمل اللحظات مع {coupleNames}</p>
      </div>

      {isSuccess ? (
        <div className="py-6 text-center space-y-4 animate-fadeIn">
          <div className="w-16 h-16 rounded-full bg-[#F0F7EE] text-[#2E6827] border border-[#C5DEC0] flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-8 h-8 text-[#5B9C51]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-bold font-serif text-[#390E19]">تم استلام صورتك الكريمة</h3>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FAF3E5] text-[#8B6B23] text-[11px] font-semibold border border-[#D6B77A]/40">
              <Clock className="w-3 h-3 text-[#D6B77A]" />
              <span>الحالة: بانتظار اعتماد العروسين</span>
            </span>
          </div>

          <p className="text-[#8B7778] text-xs leading-relaxed max-w-xs mx-auto">
            شكراً لمشاركتكم هذه اللحظة الغالية. ستظهر صورتكم في ألبوم ذكريات الحفل فور اعتمادها من
            أصحاب المناسبة.
          </p>

          <div className="p-3 bg-[#FFF9F5] rounded-2xl border border-[#EFE4DC] text-[11px] text-[#8B7778] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#5B9C51]" />
            <span>نحافظ على خصوصية الحفل بمراجعة جميع المشاركات</span>
          </div>

          <button
            onClick={handleReset}
            className="mt-4 w-full py-3 min-h-[44px] rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#390E19] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <ImagePlus className="w-4 h-4" />
            <span>مشاركة صورة أخرى</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3.5 text-xs bg-[#F1DEDF]/50 border border-[#D8B8B8] text-[#790D20] rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-[#790D20]" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Upload Area / Camera Trigger */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border-2 border-dashed border-[#EFE4DC] hover:border-[#790D20] bg-[#FFF9F5] rounded-2xl p-6 text-center transition-all group relative overflow-hidden"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment" // Mobile camera trigger
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl ? (
              <div className="relative w-full h-56 rounded-xl overflow-hidden shadow-inner">
                <Image src={previewUrl} alt="معاينة الصورة" fill className="object-cover" />
                <div className="absolute inset-0 bg-[#390E19]/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-semibold text-white bg-black/70 px-3 py-1.5 rounded-full border border-white/20">
                    اضغط لتغيير الصورة
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-14 h-14 rounded-full bg-[#F1DEDF]/50 border border-[#D8B8B8] text-[#790D20] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform shadow-sm">
                  <Camera className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-[#390E19]">
                    التقط صورة بكاميرا هاتفك أو اختر من المعرض
                  </p>
                  <p className="text-[11px] text-[#8B7778]">JPG أو PNG أو WebP حتى 12 ميجابايت</p>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar during upload */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#8B7778]">
                <span>جاري إرسال الصورة...</span>
                <span className="font-mono text-[#790D20] font-bold">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-[#EFE4DC] rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#790D20] h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Guest Name */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-[#390E19]">اسمك الكريم (اختياري)</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="مثال: من عائلة العريس"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#EFE4DC] text-[#493B3B] placeholder-[#8B7778]/60 focus:outline-none focus:border-[#790D20] text-xs text-right transition-colors"
            />
          </div>

          {/* Message / Caption */}
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-[#390E19]">
              كلمة أو تهنئة للعروسين (اختياري)
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="ألف مليون مبروك لأحلى عروسين! ✨"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#EFE4DC] text-[#493B3B] placeholder-[#8B7778]/60 focus:outline-none focus:border-[#790D20] text-xs text-right resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isUploading || !file}
            className={`w-full py-3.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-all min-h-[44px] shadow-sm ${
              file && !isUploading
                ? "bg-[#790D20] text-white hover:bg-[#390E19] cursor-pointer"
                : "bg-[#EFE4DC] text-[#8B7778]/60 cursor-not-allowed"
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
                <span>مشاركة اللحظة الآن</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
