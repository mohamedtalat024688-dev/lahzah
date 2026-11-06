"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Heart,
  UploadCloud,
  Trash2,
  ChevronUp,
  ChevronDown,
  Star,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2,
  Camera,
} from "lucide-react";
import { CouplePhoto } from "@/lib/validations/event";

interface CouplePhotosStudioProps {
  eventId: string;
  initialPhotos: CouplePhoto[];
  onSaveSuccess?: (updated: CouplePhoto[]) => void;
}

export default function CouplePhotosStudio({
  eventId,
  initialPhotos,
  onSaveSuccess,
}: CouplePhotosStudioProps) {
  const [photos, setPhotos] = useState<CouplePhoto[]>(() =>
    initialPhotos && initialPhotos.length > 0 ? initialPhotos : []
  );
  const [savedPhotos, setSavedPhotos] = useState<CouplePhoto[]>(() =>
    initialPhotos && initialPhotos.length > 0 ? initialPhotos : []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const hasUnsavedChanges = JSON.stringify(photos) !== JSON.stringify(savedPhotos);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 15) {
      setStatus({
        type: "error",
        text: "الحد الأقصى المسموح به لألبوم صور العروسين هو 15 صورة.",
      });
      return;
    }

    setIsUploading(true);
    setStatus(null);

    try {
      const newUploadedList: CouplePhoto[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api/events/${eventId}/couple-photos`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "فشل رفع الصورة");
        }

        newUploadedList.push({
          id: data.photo.id,
          url: data.photo.url,
          caption: null,
          order: photos.length + i,
          isCover: photos.length === 0 && i === 0, // First photo becomes cover by default
        });
      }

      setPhotos((prev) => [...prev, ...newUploadedList]);
      setStatus({
        type: "success",
        text: `تم رفع ${newUploadedList.length} صورة بنجاح! اضغط "حفظ التغييرات" لتثبيتها.`,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء رفع الصور";
      setStatus({ type: "error", text: msg });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, caption: caption.slice(0, 300) } : p))
    );
    setStatus(null);
  };

  const handleSetCover = (id: string) => {
    setPhotos((prev) =>
      prev.map((p) => ({
        ...p,
        isCover: p.id === id,
      }))
    );
    setStatus(null);
  };

  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => {
      const remaining = prev.filter((p) => p.id !== id);
      // If deleted photo was cover, make first remaining photo cover
      if (remaining.length > 0 && !remaining.some((p) => p.isCover)) {
        remaining[0].isCover = true;
      }
      return remaining;
    });
    setStatus(null);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === photos.length - 1)
    ) {
      return;
    }
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const reordered = [...photos];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    // Update order fields
    const updatedWithOrder = reordered.map((item, idx) => ({
      ...item,
      order: idx,
    }));

    setPhotos(updatedWithOrder);
    setStatus(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setStatus(null);

    // Normalize order index
    const normalized = photos.map((p, idx) => ({
      ...p,
      order: idx,
    }));

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couplePhotos: normalized,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل حفظ صور العروسين");
      }

      setSavedPhotos(normalized);
      setStatus({ type: "success", text: "تم حفظ صور العروسين بنجاح! ✨" });
      if (onSaveSuccess) {
        onSaveSuccess(normalized);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء الحفظ";
      setStatus({ type: "error", text: `${message} (تم الاحتفاظ ببياناتك لإعادة المحاولة)` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="couple-photos-studio">
      {/* Studio Banner */}
      <div className="p-6 rounded-3xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#790D20] mb-1">
            <Heart className="w-4 h-4 fill-current" />
            <span>استوديو صور العروسين (Couple Photos Studio)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#390E19]">
            ألبوم صور العروسين وقصة البداية
          </h2>
          <p className="text-xs text-[#8B7778] mt-1">
            ارفع صور جلسة التصوير الخاصة بكما، ورتبها، وحدد صورة الغلاف، وأضف عبارات وذكريات معبرة.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {status && (
            <div
              data-testid="couple-photos-save-status"
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                status.type === "success"
                  ? "bg-[#F0F7EE] text-[#2E6827] border border-[#C5DEC0]"
                  : "bg-[#FDF2F2] text-[#9E1C1C] border border-[#F8B4B4]"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle className="w-3.5 h-3.5 text-[#5B9C51]" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-[#E02424]" />
              )}
              <span>{status.text}</span>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={isSaving || !hasUnsavedChanges}
            data-testid="save-couple-photos-btn"
            className={`min-h-[44px] px-6 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
              hasUnsavedChanges
                ? "bg-[#790D20] text-white hover:bg-[#390E19] cursor-pointer"
                : "bg-[#EFE4DC] text-[#8C7772] cursor-not-allowed opacity-70"
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{hasUnsavedChanges ? "حفظ التغييرات" : "تم الحفظ"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        data-testid="couple-photo-uploader-dropzone"
        className="p-8 rounded-3xl bg-[#FFFDFC] border-2 border-dashed border-[#D8C7BC] hover:border-[#790D20] text-center space-y-3 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
          id="couple-photo-file-input"
        />

        <div className="w-12 h-12 rounded-2xl bg-[#790D20]/10 text-[#790D20] mx-auto flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div>
          <h3 className="text-sm font-bold text-[#390E19]">
            {isUploading ? "جاري رفع ومعالجة الصور..." : "اسحب وأفلت صور العروسين هنا، أو تصفح جهازك"}
          </h3>
          <p className="text-[11px] text-[#8B7778] mt-1">
            يدعم صور JPG و PNG و WebP حتى 12 ميجابايت للصورة (الحد الأقصى 15 صورة)
          </p>
        </div>

        <label
          htmlFor="couple-photo-file-input"
          data-testid="browse-couple-photos-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-full bg-[#FAF6F2] border border-[#EFE4DC] hover:border-[#790D20] text-xs font-bold text-[#790D20] cursor-pointer transition-all shadow-xs"
        >
          <Camera className="w-4 h-4" />
          <span>اختر صوراً من جهازك</span>
        </label>
      </div>

      {/* Photos Grid List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#390E19]">
            الصور الحالية ({photos.length} من 15)
          </span>
          <span className="text-[11px] text-[#8B7778]">
            {photos.length === 0 ? "لا توجد صور مضافة" : "يمكنك إعادة الترتيب وإضافة وصف لكل صورة"}
          </span>
        </div>

        {photos.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] text-center text-xs text-[#8B7778]">
            لم يتم رفع صور للعروسين بعد. يمكنك البدء برفع صورة واحدة أو أكثر بالأعلى.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                data-testid={`couple-photo-card-${index}`}
                className={`p-4 rounded-2xl bg-[#FFFDFC] border transition-all space-y-3 shadow-sm ${
                  photo.isCover ? "border-[#D6B77A] ring-1 ring-[#D6B77A]/40" : "border-[#EFE4DC]"
                }`}
              >
                {/* Image Preview & Cover Badge */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/5">
                  <Image
                    src={photo.url}
                    alt={photo.caption || `صورة ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 300px"
                    className="object-cover"
                  />

                  {photo.isCover && (
                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-[#790D20] text-white text-[10px] font-bold flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current text-[#D6B77A]" />
                      <span>صورة الغلاف</span>
                    </span>
                  )}
                </div>

                {/* Caption Input */}
                <div>
                  <label className="block text-[10px] font-bold text-[#8B7778] mb-1">
                    عبارة / وصف الصورة (اختياري)
                  </label>
                  <input
                    type="text"
                    data-testid={`photo-caption-input-${index}`}
                    value={photo.caption || ""}
                    onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                    placeholder="مثال: أولى خطواتنا معاً..."
                    className="w-full px-3 py-2 rounded-xl border border-[#EFE4DC] bg-[#FFF8F4]/30 text-xs text-[#390E19] focus:outline-none focus:border-[#790D20]"
                  />
                </div>

                {/* Controls Bar: Set Cover, Reorder, Delete */}
                <div className="flex items-center justify-between border-t border-[#F5EDE6] pt-2">
                  <button
                    type="button"
                    data-testid={`set-cover-btn-${index}`}
                    onClick={() => handleSetCover(photo.id)}
                    className={`text-[11px] font-semibold flex items-center gap-1 min-h-[44px] px-2 rounded-lg cursor-pointer ${
                      photo.isCover
                        ? "text-[#D6B77A]"
                        : "text-[#8C7772] hover:text-[#790D20]"
                    }`}
                  >
                    <Star
                      className={`w-3.5 h-3.5 ${
                        photo.isCover ? "fill-current text-[#D6B77A]" : ""
                      }`}
                    />
                    <span>{photo.isCover ? "الغلاف الحالي" : "تعيين كغلاف"}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="تحريك للأمام"
                      data-testid={`photo-move-up-${index}`}
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="p-2 min-h-[44px] min-w-[44px] rounded-lg border border-[#EFE4DC] text-[#8C7772] hover:text-[#390E19] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="تحريك للخلف"
                      data-testid={`photo-move-down-${index}`}
                      onClick={() => handleMove(index, "down")}
                      disabled={index === photos.length - 1}
                      className="p-2 min-h-[44px] min-w-[44px] rounded-lg border border-[#EFE4DC] text-[#8C7772] hover:text-[#390E19] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="حذف الصورة"
                      data-testid={`photo-delete-${index}`}
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="p-2 min-h-[44px] min-w-[44px] rounded-lg border border-[#F5D8D8] text-[#9E1C1C] hover:bg-[#FDF2F2] flex items-center justify-center"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
