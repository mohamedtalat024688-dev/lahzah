import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FFFDF9] border-t border-[#EADBCE] py-14 px-4 sm:px-6 lg:px-8 text-right">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand Identity */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8C2419] to-[#63140C] p-[1.5px] shadow-sm flex items-center justify-center">
            <div className="w-full h-full rounded-full border border-[#D9776E]/40 flex items-center justify-center text-white font-serif">
              <span className="text-lg font-bold">ل</span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold font-serif text-[#51354F]">لـحـظـة</span>
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#D6AD65] font-semibold">
                ATELIER
              </span>
            </div>
            <p className="text-xs text-[#786C68]">دعوات زفاف إلكترونية وتوثيق الذكريات</p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-7 text-xs font-semibold text-[#51354F]">
          <Link href="/#experience" className="hover:text-[#F27D72] transition-colors">
            التجربة
          </Link>
          <Link href="/#designs" className="hover:text-[#F27D72] transition-colors">
            التصاميم
          </Link>
          <Link href="/#how-it-works" className="hover:text-[#F27D72] transition-colors">
            كيف نعمل
          </Link>
          <Link href="/#pricing" className="hover:text-[#F27D72] transition-colors">
            الباقات
          </Link>
          <Link href="/preview?template=royal-gold" className="hover:text-[#F27D72] transition-colors">
            معاينة حية
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-[#786C68] text-center md:text-left">
          <span>منصة لحظة © {new Date().getFullYear()} • جميع الحقوق محفوظة</span>
        </div>
      </div>
    </footer>
  );
}
