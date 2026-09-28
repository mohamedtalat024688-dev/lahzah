"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل إنشاء الحساب");
      }

      window.location.href = "/dashboard/events/new";
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء التسجيل";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0908] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-[#aa7c11]/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#13110e]/95 border border-[#d4af37]/30 rounded-3xl p-8 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#aa7c11] via-[#d4af37] to-[#f3e5ab] flex items-center justify-center p-[1px]">
              <div className="w-full h-full bg-[#0d0c0a] rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#d4af37]" />
              </div>
            </div>
            <span className="text-3xl font-bold calligraphy-font text-white">لـحـظـة</span>
          </Link>
          <h2 className="text-xl font-bold text-white mt-1">إنشاء حساب جديد</h2>
          <p className="text-xs text-[#d4af37]/80 mt-1">
            ابدأ بتصميم بطاقة دعوة زفافك وتوثيق أجمل لحظاتكم
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3 text-xs bg-red-950/60 border border-red-500/40 text-red-200 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold text-neutral-300">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أحمد علي"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
              />
              <User className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold text-neutral-300">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1 text-right">
            <label className="text-xs font-semibold text-neutral-300">كلمة المرور (6 أحرف فأكثر)</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-neutral-900/80 border border-neutral-700/80 text-white placeholder-neutral-500 focus:outline-none focus:border-[#d4af37] text-sm text-right"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0d0c0a] font-bold text-sm shadow-lg shadow-[#d4af37]/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إنشاء الحساب...</span>
              </>
            ) : (
              <span>إنشاء الحساب ومتابعة التصميم</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-neutral-400">
          <span>لديك حساب بالفعل؟ </span>
          <Link href="/auth/login" className="text-[#d4af37] font-bold hover:underline">
            سجل دخولك الآن
          </Link>
        </div>
      </div>
    </div>
  );
}
