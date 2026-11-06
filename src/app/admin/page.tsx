"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Calendar,
  Camera,
  CheckCircle,
  ExternalLink,
  Loader2,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Layers,
  Eye,
  Search,
  Check,
  X,
} from "lucide-react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

interface AdminData {
  metrics: {
    totalUsers: number;
    totalEvents: number;
    totalRsvps: number;
    totalPhotos: number;
    approvedPhotos: number;
    pendingPhotos: number;
  };
  recentEvents: Array<{
    id: string;
    slug: string;
    title: string;
    groomName: string;
    brideName: string;
    packageTier: string;
    createdAt: string;
    user: { name: string; email: string };
    _count: { rsvps: number; photos: number };
  }>;
}

interface AdminTemplate {
  id: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  styleTag: string;
  tier: "BASIC" | "PREMIUM" | "LUXURY";
  style: string;
  eventTypes: string[];
  htmlFile: string | null;
  accentColor: string;
  cardBackground: string;
  isLight: boolean;
  isHidden: boolean;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"events" | "templates">("events");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Templates Management State
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateStatusFilter, setTemplateStatusFilter] = useState<"ALL" | "ACTIVE" | "HIDDEN">("ALL");
  const [templateToDelete, setTemplateToDelete] = useState<AdminTemplate | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const showToast = (text: string, type: "success" | "error" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "غير مصرح لك بالوصول للإدارة");
        }
        return res.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fetchTemplates = useCallback(() => {
    setTemplatesLoading(true);
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then((d) => {
        if (d.templates) setTemplates(d.templates);
      })
      .catch((err) => {
        console.error("Error fetching templates:", err);
        showToast("فشل في تحميل قائمة القوالب", "error");
      })
      .finally(() => setTemplatesLoading(false));
  }, []);

  useEffect(() => {
    if (activeTab === "templates" && templates.length === 0) {
      // Async trigger to avoid synchronous setState inside effect body
      const timer = setTimeout(() => {
        fetchTemplates();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeTab, templates.length, fetchTemplates]);

  const handleToggleVisibility = async (templateId: string, hide: boolean) => {
    setActionInProgress(templateId);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId, hide }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "فشلت العملية");

      setTemplates((prev) => prev.map((t) => (t.id === templateId ? { ...t, isHidden: hide } : t)));
      setTemplateToDelete(null);
      showToast(
        hide
          ? "تم حذف وإخفاء القالب من العرض والاختيار بنجاح"
          : "تمت استعادة القالب وأصبح معروضاً للجميع بنجاح",
        "success"
      );
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "حدث خطأ أثناء تحديث حالة القالب";
      showToast(message, "error");
    } finally {
      setActionInProgress(null);
    }
  };

  const activeTemplatesCount = templates.filter((t) => !t.isHidden).length;
  const hiddenTemplatesCount = templates.filter((t) => t.isHidden).length;

  const filteredTemplates = templates.filter((t) => {
    if (templateStatusFilter === "ACTIVE" && t.isHidden) return false;
    if (templateStatusFilter === "HIDDEN" && !t.isHidden) return false;
    if (templateSearch.trim()) {
      const q = templateSearch.toLowerCase().trim();
      return (
        t.nameAr.toLowerCase().includes(q) ||
        t.nameEn.toLowerCase().includes(q) ||
        t.styleTag.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#493B3B] flex flex-col justify-between selection:bg-[#790D20]/15 selection:text-[#390E19]">
      <Navbar />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-xs sm:text-sm font-semibold px-6 py-3 rounded-full shadow-2xl border flex items-center gap-2 animate-fadeIn transition-all ${
            toastMessage.type === "success"
              ? "bg-[#390E19] text-[#FFFDFC] border-[#D6B77A]"
              : "bg-red-800 text-white border-red-400"
          }`}
        >
          {toastMessage.type === "success" ? (
            <Check className="w-4 h-4 text-[#D6B77A]" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-200" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Header with Title and Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-[#EFE4DC] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF2F3] text-[#790D20] text-xs font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>لوحة التحكم الإدارية</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#390E19]">
              إدارة المنصة والقوالب
            </h1>
            <p className="text-xs sm:text-sm text-[#8B7778] mt-1">
              متابعة إحصائيات المناسبات وإدارة عرض وحذف قوالب الدعوات في الموقع
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab("events")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "events"
                  ? "bg-[#790D20] text-[#FFFDFC] shadow-soft-sm"
                  : "text-[#8B7778] hover:text-[#390E19] hover:bg-[#FAF4E8]/50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>المناسبات والإحصائيات</span>
              {data && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20 font-mono">
                  {data.metrics.totalEvents}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("templates")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "templates"
                  ? "bg-[#790D20] text-[#FFFDFC] shadow-soft-sm"
                  : "text-[#8B7778] hover:text-[#390E19] hover:bg-[#FAF4E8]/50"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>إدارة وحذف القوالب</span>
              {hiddenTemplatesCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 font-mono font-bold">
                  {hiddenTemplatesCount} مخفي
                </span>
              )}
            </button>
          </div>
        </div>

        {/* TAB 1: EVENTS & METRICS */}
        {activeTab === "events" && (
          <>
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#790D20]" />
                <p className="text-sm text-[#8B7778]">جاري جلب إحصائيات المنصة...</p>
              </div>
            ) : error ? (
              <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-center space-y-2 max-w-md mx-auto">
                <ShieldAlert className="w-8 h-8 mx-auto text-red-600" />
                <h3 className="font-bold text-sm">تعذر الوصول للوحة التحكم</h3>
                <p className="text-xs text-red-600">{error}</p>
                <div className="pt-2">
                  <Link
                    href="/dashboard"
                    className="inline-block px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
                  >
                    العودة للوحة حسابي
                  </Link>
                </div>
              </div>
            ) : data ? (
              <div className="space-y-8 animate-fadeIn">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#8B7778]">المستخدمين</span>
                      <Users className="w-4 h-4 text-[#790D20]" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-[#390E19]">
                      {data.metrics.totalUsers}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#8B7778]">المناسبات</span>
                      <Calendar className="w-4 h-4 text-[#790D20]" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-[#390E19]">
                      {data.metrics.totalEvents}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#8B7778]">التأكيدات (RSVP)</span>
                      <CheckCircle className="w-4 h-4 text-[#3D7A42]" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-[#390E19]">
                      {data.metrics.totalRsvps}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#8B7778]">إجمالي الصور</span>
                      <Camera className="w-4 h-4 text-[#9E7A36]" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-[#390E19]">
                      {data.metrics.totalPhotos}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#8B7778]">صور مقبولة</span>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-emerald-700">
                      {data.metrics.approvedPhotos}
                    </span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-[#8B7778]">صور قيد المراجعة</span>
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-2xl font-bold font-mono text-amber-700">
                      {data.metrics.pendingPhotos}
                    </span>
                  </div>
                </div>

                {/* Recent Events Table */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-serif font-bold text-[#390E19]">
                      أحدث المناسبات المنشأة
                    </h2>
                    <span className="text-xs text-[#8B7778]">
                      عرض آخر {data.recentEvents.length} مناسبات
                    </span>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-[#EFE4DC] bg-[#FFFDFC] shadow-soft-xs">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-[#FAF4E8]/60 text-[#8B7778] border-b border-[#EFE4DC]">
                        <tr>
                          <th className="py-3 px-4">المناسبة</th>
                          <th className="py-3 px-4">صاحب الحساب</th>
                          <th className="py-3 px-4">الباقة</th>
                          <th className="py-3 px-4">التأكيدات</th>
                          <th className="py-3 px-4">الصور</th>
                          <th className="py-3 px-4">تاريخ الإنشاء</th>
                          <th className="py-3 px-4 text-left">صفحة الدعوة</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#EFE4DC]/60">
                        {data.recentEvents.map((ev) => (
                          <tr key={ev.id} className="hover:bg-[#FAF4E8]/30 transition-colors">
                            <td className="py-3 px-4 font-semibold text-[#390E19]">
                              <div>{ev.title}</div>
                              <div className="text-[10px] text-[#8B7778] font-normal">
                                {ev.groomName} & {ev.brideName}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-[#390E19]">{ev.user?.name || "بدون اسم"}</div>
                              <div className="text-[10px] text-[#8B7778]">{ev.user?.email}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF2F3] text-[#790D20] border border-[#D8B8B8]/50">
                                {ev.packageTier}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-[#390E19]">
                              {ev._count?.rsvps || 0}
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold text-[#390E19]">
                              {ev._count?.photos || 0}
                            </td>
                            <td className="py-3 px-4 text-[#8B7778] text-[11px]">
                              {new Date(ev.createdAt).toLocaleDateString("ar-EG")}
                            </td>
                            <td className="py-3 px-4 text-left">
                              <Link
                                href={`/e/${ev.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1 text-[#790D20] hover:text-[#390E19] font-medium"
                              >
                                <span>معاينة</span>
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}

        {/* TAB 2: TEMPLATES MANAGEMENT & DELETION */}
        {activeTab === "templates" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Template Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8B7778] block font-medium">إجمالي القوالب</span>
                  <span className="text-2xl font-bold font-mono text-[#390E19]">{templates.length}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF4E8] text-[#9E7A36] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8B7778] block font-medium">القوالب المعروضة (النشطة)</span>
                  <span className="text-2xl font-bold font-mono text-emerald-700">{activeTemplatesCount}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-soft-xs flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8B7778] block font-medium">القوالب المحذوفة / المخفية</span>
                  <span className="text-2xl font-bold font-mono text-[#790D20]">{hiddenTemplatesCount}</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF2F3] text-[#790D20] border border-[#D8B8B8] flex items-center justify-center font-bold">
                  <Trash2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 bg-[#FFFDFC] border border-[#EFE4DC] rounded-2xl shadow-soft-xs flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-[#8B7778] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={templateSearch}
                  onChange={(e) => setTemplateSearch(e.target.value)}
                  placeholder="ابحث باسم القالب أو المعرف أو التصنيف..."
                  className="w-full pr-9 pl-4 py-2 bg-[#FFF9F5] border border-[#EFE4DC] rounded-xl text-xs text-[#390E19] placeholder-[#8B7778] focus:outline-none focus:border-[#790D20] transition-colors"
                />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setTemplateStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    templateStatusFilter === "ALL"
                      ? "bg-[#390E19] text-[#FFFDFC]"
                      : "bg-[#FAF4E8]/80 text-[#8B7778] hover:text-[#390E19]"
                  }`}
                >
                  الكل ({templates.length})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateStatusFilter("ACTIVE")}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    templateStatusFilter === "ACTIVE"
                      ? "bg-emerald-700 text-white"
                      : "bg-[#FAF4E8]/80 text-[#8B7778] hover:text-emerald-800"
                  }`}
                >
                  معروضة ({activeTemplatesCount})
                </button>
                <button
                  type="button"
                  onClick={() => setTemplateStatusFilter("HIDDEN")}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    templateStatusFilter === "HIDDEN"
                      ? "bg-red-700 text-white"
                      : "bg-[#FAF4E8]/80 text-[#8B7778] hover:text-red-800"
                  }`}
                >
                  محذوفة ومخفية ({hiddenTemplatesCount})
                </button>
              </div>
            </div>

            {/* Templates Table */}
            {templatesLoading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-7 h-7 animate-spin text-[#790D20]" />
                <p className="text-xs text-[#8B7778]">جاري تحميل قائمة القوالب...</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-[#EFE4DC] bg-[#FFFDFC] shadow-soft-xs">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#FAF4E8]/60 text-[#8B7778] border-b border-[#EFE4DC]">
                    <tr>
                      <th className="py-3.5 px-4">القالب</th>
                      <th className="py-3.5 px-4">الباقة والتصنيف</th>
                      <th className="py-3.5 px-4">المناسبات المدعومة</th>
                      <th className="py-3.5 px-4">حالة العرض</th>
                      <th className="py-3.5 px-4 text-center">معاينة</th>
                      <th className="py-3.5 px-4 text-left">إجراء الحذف / الاستعادة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE4DC]/60">
                    {filteredTemplates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-[#8B7778]">
                          لا توجد قوالب تطابق معايير البحث المحددة
                        </td>
                      </tr>
                    ) : (
                      filteredTemplates.map((tmpl) => (
                        <tr
                          key={tmpl.id}
                          className={`hover:bg-[#FAF4E8]/30 transition-colors ${
                            tmpl.isHidden ? "bg-red-50/30 opacity-80" : ""
                          }`}
                        >
                          {/* Template Identity */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center shadow-soft-xs border border-black/5 flex-shrink-0"
                                style={{ backgroundColor: tmpl.accentColor || "#790D20" }}
                              >
                                <span
                                  className="text-[10px] font-bold uppercase"
                                  style={{ color: tmpl.isLight ? "#390E19" : "#FFFDFC" }}
                                >
                                  {tmpl.id.slice(0, 2)}
                                </span>
                              </div>
                              <div>
                                <div className="font-bold text-[#390E19] flex items-center gap-1.5">
                                  <span>{tmpl.nameAr}</span>
                                  {tmpl.htmlFile && (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-normal">
                                      قالب خاص HTML
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#8B7778] font-mono">
                                  {tmpl.nameEn} • <span className="opacity-70">{tmpl.id}</span>
                                </div>
                                <div className="text-[10px] text-[#8B7778] mt-0.5 line-clamp-1">
                                  {tmpl.taglineAr}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Tier & Style */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FAF2F3] text-[#790D20] border border-[#D8B8B8]/40">
                                {tmpl.tier === "LUXURY"
                                  ? "فاخرة (Luxury)"
                                  : tmpl.tier === "PREMIUM"
                                  ? "مميزة (Premium)"
                                  : "أساسية (Basic)"}
                              </span>
                              <div className="text-[10px] text-[#8B7778]">
                                التصنيف: <span className="font-medium text-[#390E19]">{tmpl.styleTag}</span>
                              </div>
                            </div>
                          </td>

                          {/* Event Types */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {tmpl.eventTypes?.map((et) => (
                                <span
                                  key={et}
                                  className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-[#FAF4E8] text-[#8B7778] border border-[#EFE4DC]"
                                >
                                  {et === "WEDDING"
                                    ? "زفاف"
                                    : et === "ENGAGEMENT"
                                    ? "خطوبة"
                                    : et === "BIRTHDAY"
                                    ? "ميلاد"
                                    : et === "GRADUATION"
                                    ? "تخرج"
                                    : et}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            {tmpl.isHidden ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700 border border-red-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                <span>محذوف ومخفي</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                <span>معروض في المنصة</span>
                              </span>
                            )}
                          </td>

                          {/* Preview Link */}
                          <td className="py-3.5 px-4 text-center">
                            <Link
                              href={`/preview?template=${tmpl.id}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-[#790D20] hover:bg-[#FAF2F3] border border-transparent hover:border-[#D8B8B8]/40 transition-colors"
                              title="معاينة القالب"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>معاينة</span>
                            </Link>
                          </td>

                          {/* Actions: Delete / Restore */}
                          <td className="py-3.5 px-4 text-left">
                            {tmpl.isHidden ? (
                              <button
                                type="button"
                                onClick={() => handleToggleVisibility(tmpl.id, false)}
                                disabled={actionInProgress === tmpl.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 transition-all disabled:opacity-50"
                              >
                                {actionInProgress === tmpl.id ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <RotateCcw className="w-3.5 h-3.5" />
                                )}
                                <span>استعادة القالب</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setTemplateToDelete(tmpl)}
                                disabled={actionInProgress === tmpl.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 border border-red-200 transition-all disabled:opacity-50"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف القالب</span>
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Info Callout Banner */}
            <div className="p-4 rounded-2xl bg-[#FAF4E8]/60 border border-[#D6B77A]/40 text-xs text-[#390E19] flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-[#9E7A36] mt-0.5 flex-shrink-0" />
              <div className="leading-relaxed">
                <span className="font-bold">ملاحظة أمان القوالب:</span> حذف القالب يقوم بإخفائه فوراً من واجهة العرض العامة واستوديو إنشاء المناسبات للمستخدمين الجدد. المناسبات الحالية التي تم إنشاؤها مسبقاً بهذا القالب لن تتأثر إطلاقاً وستستمر في العمل بكامل كفاءتها، ويمكنك استعادة القالب في أي وقت بضغطة زر.
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {templateToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FFFDFC] rounded-3xl border border-[#EFE4DC] shadow-2xl max-w-md w-full p-6 text-right space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-[#EFE4DC] pb-4">
              <div className="flex items-center gap-2 text-red-700">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base font-bold text-[#390E19]">تأكيد حذف القالب</h3>
              </div>
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#8B7778] hover:bg-[#FAF4E8]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Template Details Card */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#EFE4DC] flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-soft-xs"
                style={{ backgroundColor: templateToDelete.accentColor || "#790D20" }}
              >
                <span
                  className="text-xs font-bold uppercase"
                  style={{ color: templateToDelete.isLight ? "#390E19" : "#FFFDFC" }}
                >
                  {templateToDelete.id.slice(0, 2)}
                </span>
              </div>
              <div>
                <div className="font-bold text-sm text-[#390E19]">{templateToDelete.nameAr}</div>
                <div className="text-xs text-[#8B7778] font-mono">
                  {templateToDelete.nameEn} ({templateToDelete.id})
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="text-xs text-[#8B7778] leading-relaxed space-y-2">
              <p>
                هل أنت متأكد من رغبتك في حذف قالب <strong className="text-[#390E19]">«{templateToDelete.nameAr}»</strong>؟
              </p>
              <p className="bg-red-50 p-3 rounded-xl border border-red-200 text-red-800">
                سيتم إخفاء هذا القالب فوراً من واجهة المعاينة واستوديو إنشاء المناسبات. المناسبات المنشأة مسبقاً بهذا القالب ستستمر بالعمل بدون مشاكل. يمكنك التراجع عن الحذف واستعادة القالب في أي وقت من هذه اللوحة.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#EFE4DC]">
              <button
                type="button"
                onClick={() => setTemplateToDelete(null)}
                disabled={actionInProgress !== null}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8B7778] hover:bg-[#FAF4E8] transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => handleToggleVisibility(templateToDelete.id, true)}
                disabled={actionInProgress !== null}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-700 text-white hover:bg-red-800 transition-colors shadow-soft-sm disabled:opacity-50"
              >
                {actionInProgress === templateToDelete.id ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>نعم، حذف القالب الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
