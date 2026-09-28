"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Heart, Sparkles, User, LogOut, LayoutDashboard, PlusCircle } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0908]/85 border-b border-[#d4af37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#aa7c11] via-[#d4af37] to-[#f3e5ab] flex items-center justify-center p-[1px] shadow-lg shadow-[#d4af37]/20 transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0d0c0a] rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-white calligraphy-font">
              لـحـظـة
            </span>
            <span className="text-[10px] tracking-wider text-[#d4af37]/80 font-sans -mt-1">
              من دعوة… إلى ذكرى
            </span>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#dcd7cb]">
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
            className="flex items-center gap-1.5 text-[#f3e5ab] bg-[#d4af37]/10 px-3 py-1.5 rounded-full border border-[#d4af37]/30 hover:bg-[#d4af37]/20 transition-all text-xs"
          >
            <Heart className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" />
            معاينة دعوة حية
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-24 h-9 bg-neutral-800/60 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1c1915] text-[#f3e5ab] border border-[#d4af37]/40 hover:border-[#d4af37] transition-all text-sm font-medium"
              >
                <LayoutDashboard className="w-4 h-4 text-[#d4af37]" />
                <span className="hidden sm:inline">لوحة التحكم</span>
              </Link>
              <Link
                href="/dashboard/events/new"
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-[#0d0c0a] font-semibold text-xs hover:brightness-110 transition-all"
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
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-semibold text-sm shadow-md shadow-[#d4af37]/20 hover:brightness-110 transition-all"
              >
                ابدأ مجاناً
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
