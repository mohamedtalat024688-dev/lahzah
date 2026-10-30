"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";
import CelebrationPetals from "@/components/ui/CelebrationPetals";

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
    <div className="min-h-screen bg-[#FFF9F0] text-[#493B38] flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#F27D72]/20 selection:text-[#51354F]">
      <CelebrationPetals />

      <div className="w-full max-w-md bg-[#FFFDF9] border border-[#EADBCE] rounded-[2rem] p-8 sm:p-10 shadow-warm-lg relative z-10 text-right">
        {/* Logo */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-block mb-1 group">
            <span className="text-3xl font-bold font-display text-[#51354F] tracking-wide flex items-center justify-center gap-1.5">
              لـحـظـة
              <span className="text-[#F27D72] text-lg">✦</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold font-display text-[#51354F]">إنشاء حساب جديد</h2>
          <p className="text-xs text-[#6E5D59]">
            ابدأ بتصميم بطاقة دعوة زفافك وتوثيق أجمل لحظاتكم
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 text-xs bg-[#FFF4EC] border border-[#FFCBA4] text-[#DE685D] rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#DE685D]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-[#493B38]">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أحمد منصور"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#FFF9F0] border border-[#EADBCE] text-[#493B38] placeholder-[#9B8D89] focus:outline-none focus:border-[#F27D72] text-xs text-right transition-colors min-h-[44px]"
              />
              <User className="w-4 h-4 text-[#9B8D89] absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-[#493B38]">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#FFF9F0] border border-[#EADBCE] text-[#493B38] placeholder-[#9B8D89] focus:outline-none focus:border-[#F27D72] text-xs text-right transition-colors min-h-[44px]"
              />
              <Mail className="w-4 h-4 text-[#9B8D89] absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-[#493B38]">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#FFF9F0] border border-[#EADBCE] text-[#493B38] placeholder-[#9B8D89] focus:outline-none focus:border-[#F27D72] text-xs text-right transition-colors min-h-[44px]"
              />
              <Lock className="w-4 h-4 text-[#9B8D89] absolute right-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-[#F27D72] text-white font-bold text-xs hover:bg-[#DE685D] transition-all flex items-center justify-center gap-2 shadow-coral-glow hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mt-3 min-h-[44px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري إنشاء الحساب...</span>
              </>
            ) : (
              <span>ابدأ تصميم دعوتك</span>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-[#6E5D59] mt-6">
          لديك حساب بالفعل؟{" "}
          <Link href="/auth/login" className="text-[#F27D72] hover:underline font-bold">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
