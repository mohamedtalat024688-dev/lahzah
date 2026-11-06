import Link from "next/link";
import { ShieldCheck, Heart, Sparkles } from "lucide-react";
import LahzahLogo from "./LahzahLogo";

export default function Footer() {
  return (
    <footer className="bg-[#FFFDFC] border-t border-[#EFE4DC] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-right font-body">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Atelier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Brand Presentation (Col 5) */}
          <div className="lg:col-span-5 space-y-5">
            <Link href="/" className="inline-block group">
              <LahzahLogo size="md" variant="full" />
            </Link>

            <p className="text-sm text-[#6E5D59] font-normal leading-[1.8] max-w-md">
              أتيليه رقمي فاخر متخصص في تصميم دعوات الزفاف والمناسبات الراقية وتوثيق أسعد اللحظات. نجمع بين فخامة القرطاسية المترفة وسهولة التجربة الرقمية لتخليد ليلة العمر.
            </p>

            {/* Trust Reassurance Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9F5] border border-[#EFE4DC] text-xs font-medium text-[#493B3B]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3D7A42]" />
                <span>خصوصية وأمان تام</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9F5] border border-[#EFE4DC] text-xs font-medium text-[#493B3B]">
                <Sparkles className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>دقة أصلية للصور</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF9F5] border border-[#EFE4DC] text-xs font-medium text-[#493B3B]">
                <Heart className="w-3.5 h-3.5 text-[#790D20]" />
                <span>استثمار لمرة واحدة</span>
              </span>
            </div>
          </div>

          {/* Nav Column 1: The Atelier & Designs (Col 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold font-serif text-[#390E19] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#790D20]" />
              <span>التصاميم والقوالب</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6E5D59]">
              <li>
                <Link href="/preview" className="hover:text-[#790D20] transition-colors">
                  الملكي الذهبي
                </Link>
              </li>
              <li>
                <Link href="/preview?template=burgundy-grandeur" className="hover:text-[#790D20] transition-colors">
                  العنابي الملكي
                </Link>
              </li>
              <li>
                <Link href="/preview?template=rose-romance" className="hover:text-[#790D20] transition-colors">
                  الورد والحرير
                </Link>
              </li>
              <li>
                <Link href="/preview?template=desert-calligraphy" className="hover:text-[#790D20] transition-colors">
                  الأصالة التراثية
                </Link>
              </li>
              <li>
                <Link href="/preview" className="hover:text-[#790D20] text-[#790D20] font-semibold transition-colors">
                  استعراض كافة القوالب ←
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2: The Experience (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold font-serif text-[#390E19] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#790D20]" />
              <span>التجربة والمزايا</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6E5D59]">
              <li>
                <Link href="/#experience" className="hover:text-[#790D20] transition-colors">
                  بطاقة دعوة تفاعلية على واتساب
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-[#790D20] transition-colors">
                  تأكيد الحضور الذكي (RSVP)
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-[#790D20] transition-colors">
                  بطاقات رمز الـ QR للطاولات
                </Link>
              </li>
              <li>
                <Link href="/#experience" className="hover:text-[#790D20] transition-colors">
                  ألبوم الذكريات الحي واعتماد الصور
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#790D20] transition-colors">
                  كيف تعمل المنصة
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 3: Investment & Studio (Col 2) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold font-serif text-[#390E19] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#790D20]" />
              <span>الباقات والاستوديو</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-[#6E5D59]">
              <li>
                <Link href="/#pricing" className="hover:text-[#790D20] transition-colors">
                  قائمة الباقات والاستثمار
                </Link>
              </li>
              <li>
                <Link href="/dashboard/events/new" className="hover:text-[#790D20] font-medium transition-colors">
                  صناعة دعوة جديدة
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-[#790D20] transition-colors">
                  دخول استوديو الإدارة
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-[#790D20] transition-colors">
                  إنشاء حساب عروسين
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Hairline Divider */}
        <div className="hairline-gold opacity-50" />

        {/* Bottom Bar: Copyright & Handcrafted Note */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8B7778]">
          <p className="font-serif text-[13px]">
            منصة لحظة • من دعوة… إلى ذكرى لا تُنسى
          </p>

          <p className="text-[11px] text-[#A69794]">
            © {new Date().getFullYear()} LAHZAH Wedding Atelier. صُممت بحب وفخامة لتوثيق أسعد اللحظات.
          </p>
        </div>
      </div>
    </footer>
  );
}
