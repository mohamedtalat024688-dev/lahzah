export interface TemplateConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  styleTag: string;
  theme: {
    background: string;
    cardBackground: string;
    accentColor: string;
    accentGradient: string;
    textColor: string;
    subtitleColor: string;
    borderColor: string;
    ornamentColor: string;
    buttonClass: string;
  };
}

export const TEMPLATES: Record<string, TemplateConfig> = {
  "royal-gold": {
    id: "royal-gold",
    nameAr: "الملكي الذهبي",
    nameEn: "Royal Gold",
    descriptionAr: "فخامة استثنائية تمزج بين سواد الليل وبريق الذهب الخالص مع نقوش أرابيسك ساحرة.",
    styleTag: "فاخر ملوكي",
    theme: {
      background: "bg-radial from-[#1a1714] via-[#0f0e0c] to-[#070605]",
      cardBackground: "bg-[#181512]/90 backdrop-blur-md border border-[#d4af37]/30 shadow-2xl shadow-[#d4af37]/10",
      accentColor: "#d4af37",
      accentGradient: "from-[#f3e5ab] via-[#d4af37] to-[#aa7c11]",
      textColor: "text-[#f9f6ee]",
      subtitleColor: "text-[#d4af37]/80",
      borderColor: "border-[#d4af37]/30",
      ornamentColor: "#d4af37",
      buttonClass: "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#aa7c11] text-[#0f0e0c] hover:brightness-110",
    },
  },
  "emerald-elegance": {
    id: "emerald-elegance",
    nameAr: "الزمرد الفاخر",
    nameEn: "Emerald Elegance",
    descriptionAr: "سحر الزمرد الأخضر العميق مع لمسات الذهب الوردي لإطلالة ملكية هادئة وجذابة.",
    styleTag: "أناقة ملكية",
    theme: {
      background: "bg-radial from-[#0d231a] via-[#081510] to-[#030806]",
      cardBackground: "bg-[#0b1d16]/90 backdrop-blur-md border border-[#10b981]/30 shadow-2xl shadow-[#10b981]/10",
      accentColor: "#34d399",
      accentGradient: "from-[#a7f3d0] via-[#34d399] to-[#059669]",
      textColor: "text-[#f0fdf4]",
      subtitleColor: "text-[#6ee7b7]",
      borderColor: "border-[#10b981]/30",
      ornamentColor: "#34d399",
      buttonClass: "bg-gradient-to-r from-[#059669] via-[#34d399] to-[#10b981] text-[#041d14] hover:brightness-110",
    },
  },
  "rose-romance": {
    id: "rose-romance",
    nameAr: "زهور ربيعية ورومانسية",
    nameEn: "Rose Romance",
    descriptionAr: "نعومة درجات الوردي الفاتح والعاجي مع لمسات ذهبية رقيقة تناسب ليالي العمر الشاعرية.",
    styleTag: "رومانسي ناعم",
    theme: {
      background: "bg-radial from-[#2a171f] via-[#1a0e14] to-[#0e070b]",
      cardBackground: "bg-[#201018]/90 backdrop-blur-md border border-[#f472b6]/30 shadow-2xl shadow-[#f472b6]/10",
      accentColor: "#f472b6",
      accentGradient: "from-[#fce7f3] via-[#f472b6] to-[#db2777]",
      textColor: "text-[#fff1f2]",
      subtitleColor: "text-[#fbcfe8]",
      borderColor: "border-[#f472b6]/30",
      ornamentColor: "#f472b6",
      buttonClass: "bg-gradient-to-r from-[#db2777] via-[#f472b6] to-[#ec4899] text-white hover:brightness-110",
    },
  },
  "modern-minimal": {
    id: "modern-minimal",
    nameAr: "المعاصر الهادئ",
    nameEn: "Modern Minimal",
    descriptionAr: "تصميم عصري فائق البساطة بدرجات الرمادي الفضي واللؤلؤي مع خطوط نظيفة وحديثة.",
    styleTag: "مودرن راقي",
    theme: {
      background: "bg-radial from-[#1e232a] via-[#14181e] to-[#0c0e12]",
      cardBackground: "bg-[#181d24]/90 backdrop-blur-md border border-slate-600/40 shadow-2xl shadow-slate-900/30",
      accentColor: "#94a3b8",
      accentGradient: "from-[#f8fafc] via-[#cbd5e1] to-[#94a3b8]",
      textColor: "text-[#f8fafc]",
      subtitleColor: "text-slate-400",
      borderColor: "border-slate-700/60",
      ornamentColor: "#94a3b8",
      buttonClass: "bg-gradient-to-r from-slate-200 via-white to-slate-300 text-slate-900 hover:brightness-105",
    },
  },
  "desert-calligraphy": {
    id: "desert-calligraphy",
    nameAr: "الأصالة العربية",
    nameEn: "Arabian Heritage",
    descriptionAr: "دفء رمال الصحراء الذهبية مع فخامة الخط العربي الكلاسيكي والزخارف التراثية الراقية.",
    styleTag: "تراثي أصيل",
    theme: {
      background: "bg-radial from-[#281d13] via-[#1b120a] to-[#0e0904]",
      cardBackground: "bg-[#21160c]/90 backdrop-blur-md border border-[#c29b38]/30 shadow-2xl shadow-[#c29b38]/15",
      accentColor: "#e6c367",
      accentGradient: "from-[#fcedc7] via-[#e6c367] to-[#b3851b]",
      textColor: "text-[#fff8eb]",
      subtitleColor: "text-[#e6c367]/80",
      borderColor: "border-[#c29b38]/30",
      ornamentColor: "#e6c367",
      buttonClass: "bg-gradient-to-r from-[#b3851b] via-[#e6c367] to-[#d4a838] text-[#1b120a] hover:brightness-110",
    },
  },
};

export const DEFAULT_TEMPLATE_ID = "royal-gold";

export function getTemplate(id?: string): TemplateConfig {
  if (id && TEMPLATES[id]) {
    return TEMPLATES[id];
  }
  return TEMPLATES[DEFAULT_TEMPLATE_ID];
}
