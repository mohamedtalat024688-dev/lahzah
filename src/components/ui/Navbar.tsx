"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Sparkles,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
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
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0908]/90 border-b border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#aa7c11] via-[#d4af37] to-[#f3e5ab] flex items-center justify-center p-[1px] shadow-lg shadow-[#d4af37]/20 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0d0c0a] rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
            </div>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-2xl font-bold tracking-tight text-white calligraphy-font">
              لـحـظـة
            </span>
            <span className="text-[10px] tracking-wider text-[#d4af37]/80 font-sans -mt-1">
              من دعوة… إلى ذكرى
            </span>
          </div>
        </Link>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#dcd7cb]">
          <Link href="/#features" className="hover:text-[#d4af37] transition-colors">
            المميزات
          </Link>
          <Link href="/#templates" className="hover:text-[#d4af37] transition-colors">
            قوالب الدعوات
          </Link>
          <Link href="/#how-it-works" className="hover:text-[#d4af37] transition-colors">
            كيف تعمل لحظة
          </Link>
          <Link href="/#pricing" className="hover:text-[#d4af37] transition-colors">
            الباقات والأسعار
          </Link>
          <Link
            href="/e/ahmed-and-sara"
            className="flex items-center gap-1.5 text-[#f3e5ab] bg-[#d4af37]/10 px-3.5 py-1.5 rounded-full border border-[#d4af37]/30 hover:bg-[#d4af37]/20 transition-all text-xs font-semibold"
          >
            <Heart className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
            <span>معاينة حية (زفاف أحمد وسارة)</span>
          </Link>
        </nav>

        {/* Auth Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9 bg-neutral-800/60 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-900/60 transition-all"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>الإدارة</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1915] text-[#f3e5ab] border border-[#d4af37]/40 hover:border-[#d4af37] transition-all text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
                <span>لوحة التحكم</span>
              </Link>
              <Link
                href="/dashboard/events/new"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#0d0c0a] font-bold text-xs hover:brightness-110 transition-all shadow-md shadow-[#d4af37]/10"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إنشاء دعوة</span>
              </Link>
              <button
                onClick={handleLogout}
                title="تسجيل الخروج"
                className="p-2 text-neutral-400 hover:text-red-400 transition-colors rounded-full hover:bg-neutral-800/50"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm text-neutral-300 hover:text-white transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-sm shadow-md shadow-[#d4af37]/20 hover:brightness-110 transition-all"
              >
                ابدأ مجاناً
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-[#1c1915] border border-[#d4af37]/30 text-[#f3e5ab]"
            >
              <LayoutDashboard className="w-5 h-5 text-[#d4af37]" />
            </Link>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white"
            aria-label="قائمة الملاحة"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#d4af37]/20 bg-[#0d0c0a] px-5 py-6 space-y-4 animate-fadeIn text-right">
          <nav className="flex flex-col space-y-3 text-sm text-neutral-300 font-medium">
            <Link
              href="/#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#d4af37] transition-colors border-b border-neutral-800/60"
            >
              المميزات
            </Link>
            <Link
              href="/#templates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#d4af37] transition-colors border-b border-neutral-800/60"
            >
              قوالب الدعوات الملكية
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#d4af37] transition-colors border-b border-neutral-800/60"
            >
              كيف تعمل المنصة
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-[#d4af37] transition-colors border-b border-neutral-800/60"
            >
              الباقات والأسعار
            </Link>
            <Link
              href="/e/ahmed-and-sara"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 text-[#f3e5ab] font-bold flex items-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
              <span>معاينة دعوة حية (زفاف أحمد وسارة)</span>
            </Link>
          </nav>

          <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  href="/dashboard/events/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#0d0c0a] font-bold text-center text-sm shadow-md"
                >
                  تصميم بطاقة جديدة
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-red-400 font-semibold text-center text-xs flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>تسجيل الخروج</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-center text-sm shadow-md"
                >
                  إنشاء حساب مجاناً
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 font-semibold text-center text-xs"
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
