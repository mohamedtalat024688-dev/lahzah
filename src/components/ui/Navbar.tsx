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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0c0b0a]/85 border-b border-[#24211b] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex flex-col text-right">
            <span className="text-2xl font-bold tracking-tight text-[#faf8f5] font-display">
              لـحـظـة
            </span>
            <span className="text-[11px] tracking-wider text-[#9c9488] font-body -mt-1 font-light">
              من دعوة… إلى ذكرى
            </span>
          </div>
        </Link>

        {/* Public Visitor Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium text-[#c4bdb2]">
          <Link href="/#features" className="hover:text-[#faf8f5] transition-colors">
            المميزات
          </Link>
          <Link href="/#templates" className="hover:text-[#faf8f5] transition-colors">
            القوالب
          </Link>
          <Link href="/#how-it-works" className="hover:text-[#faf8f5] transition-colors">
            كيف تعمل
          </Link>
          <Link href="/#pricing" className="hover:text-[#faf8f5] transition-colors">
            الأسعار
          </Link>
        </nav>

        {/* Action Controls (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {loading ? (
            <div className="w-24 h-9 bg-neutral-800/40 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-medium hover:bg-rose-900/40 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>الإدارة</span>
                </Link>
              )}

              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#181613] border border-[#2c2821] text-[#e8e4dc] hover:text-white hover:border-[#c5a880]/40 text-xs font-semibold transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>لوحة التحكم</span>
              </Link>

              <Link
                href="/dashboard/events/new"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8bd96] shadow-sm transition-all"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>مناسبة جديدة</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-neutral-400 hover:text-rose-300 hover:bg-neutral-900 transition-colors"
                title="تسجيل الخروج"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-xs font-medium text-[#c4bdb2] hover:text-white transition-colors px-2 py-1.5"
              >
                دخول
              </Link>

              <Link
                href="/dashboard/events/new"
                className="px-5 py-2.5 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8bd96] shadow-sm transition-all"
              >
                صمّم دعوتك
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button with 44px min touch target */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden min-w-[44px] min-h-[44px] p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors flex items-center justify-center"
          aria-label="القائمة"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#24211b] bg-[#0c0b0a] px-5 py-6 space-y-4 animate-fadeIn">
          <nav className="flex flex-col gap-1 text-sm font-medium text-[#c4bdb2]">
            <Link
              href="/#features"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-2 min-h-[44px] flex items-center hover:text-[#faf8f5] border-b border-[#1c1a16] transition-colors"
            >
              المميزات
            </Link>
            <Link
              href="/#templates"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-2 min-h-[44px] flex items-center hover:text-[#faf8f5] border-b border-[#1c1a16] transition-colors"
            >
              القوالب
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-2 min-h-[44px] flex items-center hover:text-[#faf8f5] border-b border-[#1c1a16] transition-colors"
            >
              كيف تعمل
            </Link>
            <Link
              href="/#pricing"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-3 px-2 min-h-[44px] flex items-center hover:text-[#faf8f5] transition-colors"
            >
              الأسعار
            </Link>
          </nav>

          <div className="pt-3 border-t border-[#24211b] flex flex-col gap-2.5">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 min-h-[44px] rounded-full bg-[#181613] border border-[#2c2821] text-[#e8e4dc] font-semibold text-xs text-center flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-[#c5a880]" />
                  <span>لوحة التحكم</span>
                </Link>

                <Link
                  href="/dashboard/events/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 min-h-[44px] rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs text-center flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>صمّم مناسبة جديدة</span>
                </Link>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-3 min-h-[44px] text-center text-xs text-rose-400 hover:text-rose-300 flex items-center justify-center"
                >
                  تسجيل الخروج
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 min-h-[44px] rounded-full border border-[#2c2821] text-[#e8e4dc] text-xs font-semibold text-center hover:bg-neutral-900 flex items-center justify-center"
                >
                  دخول
                </Link>

                <Link
                  href="/dashboard/events/new"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 min-h-[44px] rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs text-center shadow-md flex items-center justify-center"
                >
                  صمّم دعوتك
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
