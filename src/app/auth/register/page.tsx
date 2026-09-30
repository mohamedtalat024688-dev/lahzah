"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
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

      router.push("/dashboard/events/new");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء التسجيل";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0b0a] text-[#faf8f5] flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#c5a880]/30 selection:text-[#f5f2eb]">
      <div className="w-full max-w-md bg-[#141210] border border-[#26221d] rounded-3xl p-8 shadow-2xl relative z-10 text-right">
        {/* Logo */}
        <div className="text-center mb-8 space-y-1.5">
          <Link href="/" className="inline-block mb-2">
            <span className="text-3xl font-bold font-display text-[#faf8f5] tracking-wide">
              لـحـظـة
            </span>
          </Link>
          <h2 className="text-lg font-bold font-display text-[#faf8f5]">إنشاء حساب جديد</h2>
          <p className="text-xs text-[#8e877c]">
            ابدأ بتصميم بطاقة دعوة زفافك وتوثيق أجمل لحظاتكم
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 text-xs bg-[#241312] border border-[#522320] text-[#fca5a5] rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#f87171]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-medium text-[#c4bdaf]">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أحمد علي"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#1a1714] border border-[#2e2924] text-[#faf8f5] placeholder-[#5c554b] focus:outline-none focus:border-[#c5a880] text-xs text-right transition-colors"
              />
              <User className="w-4 h-4 text-[#8e877c] absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-medium text-[#c4bdaf]">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#1a1714] border border-[#2e2924] text-[#faf8f5] placeholder-[#5c554b] focus:outline-none focus:border-[#c5a880] text-xs text-right transition-colors"
              />
              <Mail className="w-4 h-4 text-[#8e877c] absolute right-3.5 top-3" />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-medium text-[#c4bdaf]">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-[#1a1714] border border-[#2e2924] text-[#faf8f5] placeholder-[#5c554b] focus:outline-none focus:border-[#c5a880] text-xs text-right transition-colors"
              />
              <Lock className="w-4 h-4 text-[#8e877c] absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-full bg-[#c5a880] text-[#0c0b0a] font-bold text-xs hover:bg-[#d8be99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إنشاء الحساب...</span>
              </>
            ) : (
              <span>إنشاء الحساب والبدء</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#8e877c] mt-6">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-[#c5a880] hover:underline font-medium">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
