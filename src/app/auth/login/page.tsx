"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import CelebrationPetals from "@/components/ui/CelebrationPetals";
import LahzahLogo from "@/components/ui/LahzahLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "فشل تسجيل الدخول");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "حدث خطأ أثناء الدخول";
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F4] text-[#493B3B] flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#790D20]/15 selection:text-[#390E19]">
      <CelebrationPetals />

      <div className="w-full max-w-md bg-[#FFFDFC] border border-[#EFE4DC] rounded-[2rem] p-8 sm:p-10 shadow-soft-lg relative z-10 text-right">
        {/* Logo */}
        <div className="text-center mb-8 space-y-2">
          <Link href="/" className="inline-block mb-2 group">
            <LahzahLogo size="lg" variant="stacked" showSubtitle={false} />
          </Link>
          <h2 className="text-xl font-bold font-serif text-[#390E19]">تسجيل الدخول</h2>
          <p className="text-xs text-[#8B7778]">
            مرحباً بعودتك! تابع إدارة دعواتك وذكريات مناسباتك
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 text-xs bg-[#FFF0F0] border border-[#F1DEDF] text-[#A82323] rounded-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#A82323]" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-[#493B3B]">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#FFF9F5] border border-[#EFE4DC] text-[#493B3B] placeholder-[#8B7778] focus:outline-none focus:border-[#790D20] text-xs text-right transition-colors min-h-[44px]"
              />
              <Mail className="w-4 h-4 text-[#8B7778] absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5 text-right">
            <label className="text-xs font-semibold text-[#493B3B]">كلمة المرور</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                dir="ltr"
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#FFF9F5] border border-[#EFE4DC] text-[#493B3B] placeholder-[#8B7778] focus:outline-none focus:border-[#790D20] text-xs text-right transition-colors min-h-[44px]"
              />
              <Lock className="w-4 h-4 text-[#8B7778] absolute right-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-[#790D20] text-white font-bold text-xs hover:bg-[#630A19] transition-all flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(121,13,32,0.25)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mt-3 min-h-[44px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>دخول الاستوديو</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login Box */}
        <div className="mt-8 pt-6 border-t border-[#EFE4DC] text-center space-y-2.5">
          <p className="text-[11px] font-medium text-[#8B7778]">حسابات تجريبية سريعة:</p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("ahmed@lahzah.com", "ahmed123456")}
              className="text-[11px] px-3.5 py-1.5 rounded-full bg-[#FFF9F5] border border-[#EFE4DC] text-[#493B3B] hover:text-[#790D20] hover:border-[#790D20] transition-colors"
            >
              أحمد (صاحب دعوة)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin@lahzah.com", "admin123456")}
              className="text-[11px] px-3.5 py-1.5 rounded-full bg-[#FFF9F5] border border-[#EFE4DC] text-[#493B3B] hover:text-[#790D20] hover:border-[#790D20] transition-colors"
            >
              مسؤول النظام (Admin)
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#8B7778] mt-6">
          ليس لديك حساب بعد؟{" "}
          <Link href="/auth/register" className="text-[#790D20] hover:underline font-bold">
            صمم بطاقتك الآن
          </Link>
        </p>
      </div>
    </div>
  );
}
