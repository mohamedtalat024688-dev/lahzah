"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Users,
  Calendar,
  Camera,
  CheckCircle,
  ExternalLink,
  Loader2,
  Sparkles,
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

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/metrics")
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "غير مصرح لك بالدخول");
        }
        return res.json();
      })
      .then((d) => setData(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0908] text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex-1">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white calligraphy-font">لوحة إدارة النظام (Super Admin)</h1>
            <p className="text-xs text-neutral-400">إحصائيات المنصة الشاملة ومراقبة كافة المناسبات</p>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#d4af37]" />
            <p className="text-xs text-neutral-400">جاري تحميل بيانات الإدارة...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-950/40 border border-red-500/40 rounded-3xl text-center max-w-md mx-auto space-y-3">
            <ShieldAlert className="w-10 h-10 text-red-400 mx-auto" />
            <p className="text-sm font-semibold text-white">{error}</p>
            <p className="text-xs text-neutral-400">
              يرجى تسجيل الدخول بحساب المدير: <span className="font-mono text-white">admin@lahzah.com</span>
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-3 px-6 py-2 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-colors"
            >
              تسجيل الدخول كمدير
            </Link>
          </div>
        ) : (
          data && (
            <div className="space-y-8">
              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#13110e] border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 mb-1">
                    <span className="text-xs">المستخدمين المسجلين</span>
                    <Users className="w-4 h-4 text-sky-400" />
                  </div>
                  <span className="text-2xl font-bold text-white font-mono">{data.metrics.totalUsers}</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#13110e] border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 mb-1">
                    <span className="text-xs">إجمالي المناسبات</span>
                    <Calendar className="w-4 h-4 text-[#d4af37]" />
                  </div>
                  <span className="text-2xl font-bold text-white font-mono">{data.metrics.totalEvents}</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#13110e] border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 mb-1">
                    <span className="text-xs">إجمالي تأكيدات الحضور</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-2xl font-bold text-emerald-400 font-mono">{data.metrics.totalRsvps}</span>
                </div>

                <div className="p-5 rounded-2xl bg-[#13110e] border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 mb-1">
                    <span className="text-xs">إجمالي الصور المرفوعة</span>
                    <Camera className="w-4 h-4 text-rose-400" />
                  </div>
                  <span className="text-2xl font-bold text-rose-400 font-mono">{data.metrics.totalPhotos}</span>
                </div>
              </div>

              {/* Recent Events Table */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#d4af37]" />
                  <span>أحدث المناسبات المنشأة على المنصة</span>
                </h3>

                <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-[#13110e]">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-neutral-900/80 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="py-3 px-4">عنوان المناسبة</th>
                        <th className="py-3 px-4">صاحب الحساب</th>
                        <th className="py-3 px-4">الباقة</th>
                        <th className="py-3 px-4">الردود (RSVP)</th>
                        <th className="py-3 px-4">الصور</th>
                        <th className="py-3 px-4">تاريخ الإنشاء</th>
                        <th className="py-3 px-4">معاينة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {data.recentEvents.map((evt) => (
                        <tr key={evt.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{evt.title}</td>
                          <td className="py-3 px-4 text-neutral-300">
                            <div>{evt.user.name}</div>
                            <div className="text-[10px] text-neutral-500 font-mono">{evt.user.email}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f3e5ab] text-[10px] font-bold">
                              {evt.packageTier}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-emerald-400">{evt._count.rsvps}</td>
                          <td className="py-3 px-4 font-mono text-[#f3e5ab]">{evt._count.photos}</td>
                          <td className="py-3 px-4 text-neutral-500">
                            {new Date(evt.createdAt).toLocaleDateString("ar-EG")}
                          </td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/e/${evt.slug}`}
                              target="_blank"
                              className="text-[#d4af37] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>زيارة</span>
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
          )
        )}
      </main>

      <Footer />
    </div>
  );
}
