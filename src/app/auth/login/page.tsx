"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import CelebrationPetals from "@/components/ui/CelebrationPetals";

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
          <h2 className="text-xl font-bold font-display text-[#51354F]">تسجيل الدخول</h2>
          <p className="text-xs text-[#6E5D59]">
            مرحباً بعودتك! تابع إدارة دعواتك وذكريات مناسباتك
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
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>دخول الاستوديو</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login Box */}
        <div className="mt-8 pt-6 border-t border-[#F3EAE1] text-center space-y-2.5">
          <p className="text-[11px] font-medium text-[#6E5D59]">حسابات تجريبية سريعة للتجربة:</p>
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin("ahmed@lahzah.com", "ahmed123456")}
              className="text-[11px] px-3.5 py-1.5 rounded-full bg-[#FFF9F0] border border-[#EADBCE] text-[#6E5D59] hover:text-[#51354F] hover:border-[#D6AD65] transition-colors"
            >
              أحمد (صاحب دعوة)
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin@lahzah.com", "admin123456")}
              className="text-[11px] px-3.5 py-1.5 rounded-full bg-[#FFF9F0] border border-[#EADBCE] text-[#6E5D59] hover:text-[#51354F] hover:border-[#D6AD65] transition-colors"
            >
              مسؤول النظام (Admin)
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#6E5D59] mt-6">
          ليس لديك حساب بعد؟{" "}
          <Link href="/auth/register" className="text-[#F27D72] hover:underline font-bold">
            صمم بطاقتك الآن
          </Link>
        </p>
      </div>
    </div>
  );
}
