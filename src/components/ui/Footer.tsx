import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#070605] border-t border-[#d4af37]/15 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#aa7c11] via-[#d4af37] to-[#f3e5ab] flex items-center justify-center p-[1px]">
            <div className="w-full h-full bg-[#0d0c0a] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
            </div>
          </div>
          <div>
            <p className="text-xl font-bold calligraphy-font text-white">لـحـظـة</p>
            <p className="text-xs text-[#d4af37]/80">من دعوة… إلى ذكرى لا تُنسى</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
          <Link href="/#features" className="hover:text-[#d4af37] transition-colors">
            المميزات
          </Link>
          <Link href="/#templates" className="hover:text-[#d4af37] transition-colors">
            القوالب
          </Link>
          <Link href="/#pricing" className="hover:text-[#d4af37] transition-colors">
            الأسعار
          </Link>
          <Link href="/e/ahmed-and-sara" className="hover:text-[#d4af37] transition-colors">
            نموذج دعوة
          </Link>
        </div>

        <div className="text-xs text-neutral-500 text-center md:text-left flex items-center gap-1.5">
          <span>صُنعت بكل</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          <span>لحفلات ومناسبات الوطن العربي © {new Date().getFullYear()} لحظة</span>
        </div>
      </div>
    </footer>
  );
}
