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
import LahzahLogo from "./LahzahLogo";

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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FFF8F4]/95 border-b border-[#EFE4DC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center group">
          <LahzahLogo size="md" variant="full" />
        </Link>

        {/* Public Visitor Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-9 text-[13.5px] font-medium text-[#493B3B]">
          <Link
            href="/#experience"
            className="hover:text-[#790D20] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#790D20] hover:after:w-full after:transition-all"
          >
            التجربة
          </Link>
          <Link
            href="/#designs"
            className="hover:text-[#790D20] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#790D20] hover:after:w-full after:transition-all"
          >
            التصاميم
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-[#790D20] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#790D20] hover:after:w-full after:transition-all"
          >
            كيف نعمل
          </Link>
          <Link
            href="/#pricing"
            className="hover:text-[#790D20] transition-colors py-1 relative after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-0 after:h-[2px] after:bg-[#790D20] hover:after:w-full after:transition-all"
          >
            الباقات
          </Link>
        </nav>

        {/* Action Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-3.5">
          {loading ? (
            <div className="w-24 h-9 bg-[#EFE4DC]/60 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2.5">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="px-3.5 py-2 rounded-full text-xs font-semibold text-[#493B3B] bg-white border border-[#EFE4DC] hover:border-[#790D20] transition-colors flex items-center gap-1.5 shadow-soft-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D6B77A]" />
                  <span>الإدارة</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#493B3B] bg-white border border-[#EFE4DC] hover:border-[#790D20] transition-colors flex items-center gap-1.5 shadow-soft-xs"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#790D20]" />
                <span>لوحة التحكم</span>
              </Link>

              <Link
                href="/dashboard/events/new"
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#790D20] hover:bg-[#630A19] shadow-[0_4px_12px_rgba(121,13,32,0.25)] hover:shadow-lg transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>دعوة جديدة</span>
              </Link>

              <button
                onClick={handleLogout}
                aria-label="تسجيل الخروج"
                className="p-2 rounded-full text-[#8B7778] hover:text-[#A82323] hover:bg-[#FAF2F3] transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#493B3B] hover:text-[#790D20] transition-colors"
              >
                تسجيل الدخول
              </Link>

              <Link
                href="/dashboard/events/new"
                className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#790D20] hover:bg-[#630A19] shadow-[0_4px_12px_rgba(121,13,32,0.25)] hover:shadow-lg transition-all flex items-center gap-1.5 min-h-[44px]"
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
            className="p-2.5 rounded-full text-[#790D20] hover:bg-white border border-[#EFE4DC] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#EFE4DC] bg-[#FFF9F5] px-4 pt-3 pb-6 space-y-3 animate-fadeIn shadow-lg">
          <nav className="flex flex-col space-y-1 text-right text-xs font-semibold text-[#493B3B]">
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

          <div className="pt-3 border-t border-[#EFE4DC] flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full text-center text-xs font-semibold bg-white border border-[#EFE4DC] text-[#493B3B]"
                >
                  لوحة التحكم
                </Link>
                <Link
                  href="/dashboard/events/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full text-center text-xs font-bold bg-[#790D20] text-white shadow-sm"
                >
                  اصنع دعوة جديدة
                </Link>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-2.5 text-center text-xs text-[#A82323] font-medium"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard/events/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 rounded-full text-center text-xs font-bold bg-[#790D20] text-white shadow-sm"
                >
                  اصنع دعوتك الآن
                </Link>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-full text-center text-xs font-semibold bg-white border border-[#EFE4DC] text-[#493B3B]"
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
