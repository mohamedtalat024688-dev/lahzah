"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF9F0]/95 border-b border-[#EADBCE]/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark - Luxury Atelier Mark */}
        <Link href="/" className="flex items-center gap-3.5 group">
          {/* Architectural Carmine Monogram Seal */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8C2419] to-[#63140C] p-[1.5px] shadow-[0_2px_8px_rgba(140,36,25,0.25)] flex items-center justify-center group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full border border-[#D9776E]/40 flex items-center justify-center text-white font-serif shadow-inner">
              <span className="text-lg font-bold">ل</span>
            </div>
          </div>

          <div className="flex flex-col text-right">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-[#51354F] font-serif leading-none">
                لـحـظـة
              </span>
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#D6AD65] font-semibold">
                ATELIER
              </span>
            </div>
            <span className="text-[11px] text-[#786C68] font-normal mt-0.5">
              دعوات زفاف إلكترونية وتوثيق الذكريات
            </span>
          </div>
        </Link>

        {/* Public Visitor Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[#51354F]">
          <Link
            href="/#experience"
            className="hover:text-[#F27D72] transition-colors py-1"
          >
            التجربة
          </Link>
          <Link
            href="/#designs"
            className="hover:text-[#F27D72] transition-colors py-1"
          >
            التصاميم
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-[#F27D72] transition-colors py-1"
          >
            كيف نعمل
          </Link>
          <Link
            href="/#pricing"
            className="hover:text-[#F27D72] transition-colors py-1"
          >
            الباقات
          </Link>
        </nav>

        {/* Action Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-3.5">
          {loading ? (
            <div className="w-24 h-9 bg-[#EADBCE]/40 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2.5">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-3.5 py-2 rounded-full text-xs font-semibold text-[#51354F] bg-white border border-[#EADBCE] hover:border-[#51354F] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D6AD65]" />
                  <span>الإدارة</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#51354F] bg-white border border-[#EADBCE] hover:border-[#51354F] transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#51354F]" />
                <span>لوحة التحكم</span>
              </Link>

              <Link
                href="/dashboard/events/new"
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#F27D72] hover:bg-[#DE685D] shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>دعوة جديدة</span>
              </Link>

              <button
                onClick={handleLogout}
                aria-label="تسجيل الخروج"
                className="p-2 rounded-full text-[#786C68] hover:text-[#C24134] hover:bg-[#FFF0EE] transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#51354F] hover:text-[#F27D72] transition-colors"
              >
                دخول
              </Link>

              <Link
                href="/dashboard/events/new"
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#51354F] hover:bg-[#3D283C] shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <span>اصنع دعوتك</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            className="p-2.5 rounded-full text-[#51354F] hover:bg-white border border-[#EADBCE] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#EADBCE] bg-[#FFF9F0] px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-lg">
          <nav className="flex flex-col space-y-1 text-right text-xs font-semibold text-[#51354F]">
            <Link
              href="/#experience"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-white transition-colors"
            >
              التجربة
            </Link>
            <Link
              href="/#designs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-white transition-colors"
            >
              التصاميم
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-white transition-colors"
            >
              كيف نعمل
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl hover:bg-white transition-colors"
            >
              الباقات
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#EADBCE] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full text-center text-xs font-semibold bg-white border border-[#EADBCE] text-[#51354F]"
                >
                  لوحة التحكم
                </Link>
                <Link
                  href="/dashboard/events/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full text-center text-xs font-bold bg-[#F27D72] text-white shadow-sm"
                >
                  اصنع دعوة جديدة
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 text-center text-xs text-[#C24134] font-medium"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/events/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full text-center text-xs font-bold bg-[#51354F] text-white shadow-sm"
                >
                  اصنع دعوتك الآن
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full text-center text-xs font-semibold bg-white border border-[#EADBCE] text-[#51354F]"
                >
                  تسجيل الدخول
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
