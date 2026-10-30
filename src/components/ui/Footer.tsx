import Link from "next/link";
import LahzahLogo from "./LahzahLogo";

export default function Footer() {
  return (
    <footer className="bg-[#FFFDFC] border-t border-[#EFE4DC] py-16 px-4 sm:px-6 lg:px-8 text-right">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand Identity with Authentic Burgundy Logo */}
        <div className="flex items-center">
          <LahzahLogo size="md" variant="full" />
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-[#493B3B]">
          <Link href="/#experience" className="hover:text-[#790D20] transition-colors">
            التجربة
          </Link>
          <Link href="/#designs" className="hover:text-[#790D20] transition-colors">
            التصاميم
          </Link>
          <Link href="/#how-it-works" className="hover:text-[#790D20] transition-colors">
            كيف نعمل
          </Link>
          <Link href="/#pricing" className="hover:text-[#790D20] transition-colors">
            الباقات
          </Link>
          <Link href="/preview?template=royal-gold" className="hover:text-[#790D20] transition-colors">
            معاينة حية
          </Link>
        </div>

        {/* Copyright & Brand Promise */}
        <div className="text-xs text-[#8B7778] text-center md:text-left space-y-1">
          <p className="font-serif">منصة لحظة • من دعوة… إلى ذكرى لا تُنسى</p>
          <p className="text-[11px] text-[#B4A6A7]">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
