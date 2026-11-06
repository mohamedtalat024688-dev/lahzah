// src/lib/templates.ts
// Lahzah Invitation Design System - Typography, Ornaments, Materials & Art Direction

export type TemplateTier = "BASIC" | "PREMIUM" | "LUXURY";
export type TemplateStyle = "classic" | "botanical" | "romantic" | "minimal" | "heritage" | "couture" | "aristocratic" | "craft";

export type EventType =
  | "ALL"
  | "ENGAGEMENT"
  | "FATIHIA"
  | "KATB_KITAB"
  | "WEDDING"
  | "BIRTHDAY"
  | "GRADUATION"
  | "SEBOU"
  | "HENNA"
  | "OTHER";

export interface EventTypeConfig {
  id: EventType;
  labelAr: string;
  labelEn: string;
  badgeLabelAr: string;
}

export const EVENT_TYPES: EventTypeConfig[] = [
  { id: "ALL", labelAr: "جميع المناسبات", labelEn: "All Events", badgeLabelAr: "جميع المناسبات" },
  { id: "ENGAGEMENT", labelAr: "خطوبة", labelEn: "Engagement", badgeLabelAr: "حفل خطوبة مبارك" },
  { id: "FATIHIA", labelAr: "قراءة فاتحة", labelEn: "Fatiha", badgeLabelAr: "مراسم قراءة الفاتحة" },
  { id: "KATB_KITAB", labelAr: "كتب كتاب", labelEn: "Katb Kitab", badgeLabelAr: "مراسم عقد القران وكتب الكتاب" },
  { id: "WEDDING", labelAr: "زفاف / فرح", labelEn: "Wedding", badgeLabelAr: "حفل زفاف مبارك" },
  { id: "BIRTHDAY", labelAr: "عيد ميلاد", labelEn: "Birthday", badgeLabelAr: "احتفال عيد ميلاد سعيد" },
  { id: "GRADUATION", labelAr: "تخرج", labelEn: "Graduation", badgeLabelAr: "حفل تخرج ومسيرة نجاح" },
  { id: "SEBOU", labelAr: "سبوع واستقبال مولود", labelEn: "Sebou / Newborn", badgeLabelAr: "احتفال سبوع واستقبال مولود" },
  { id: "HENNA", labelAr: "حنة", labelEn: "Henna Night", badgeLabelAr: "ليلة الحنة المباركة" },
  { id: "OTHER", labelAr: "مناسبات أخرى", labelEn: "Other Events", badgeLabelAr: "دعوة خاصة لمناسبة مميزة" },
];


export interface TemplateOrnamentConfig {
  type: "royal" | "botanical" | "floral" | "minimal" | "vintage" | "heritage" | "couture" | "arch" | "embossed" | "art-line";
  symbol: string;
  divider: string;
  cornerStyle: "lotus-corner" | "ornate" | "botanical-corner" | "soft-curve" | "hairline-bracket" | "regal-crown" | "geometric-star" | "couture-cross" | "arch-header" | "embossed-crest";
  monogramStyle: "lotus-crest" | "circle-seal" | "flourish-crest" | "oval-cameo" | "minimal-clean" | "vintage-shield" | "octagon-star" | "couture-serif" | "arch-keystone" | "embossed-wax";
}

export interface TemplateTypographyConfig {
  coupleFont: string; // Tailwind class or font family declaration
  headerStyle: string;
  bodyStyle: string;
  monogramText: string;
  dateStyle: string;
  letterSpacing?: string;
}

export interface TemplateLayoutConfig {
  alignment: "center" | "asymmetric-left" | "editorial-split" | "architectural-grid";
  frameStyle: "dashed-gold" | "double-regal" | "botanical-thin" | "hairline-single" | "geometric-double" | "couture-border" | "arch-dome" | "deckle-edge";
  aspectRatio: string;
  innerPadding: string;
  paperTexture: string; // Material appearance & shadow depth
  headerTreatment: "bismillah-calligraphy" | "bismillah-minimal" | "bismillah-regal" | "bismillah-couture";
}

export interface TemplateConfig {
  id: string;
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  descriptionAr: string;
  styleTag: string;
  tier: TemplateTier;
  style: TemplateStyle;
  eventTypes: EventType[];
  htmlFile?: string;
  featured?: boolean;
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
    paperClass: string;
    isLight?: boolean;
  };
  typography: TemplateTypographyConfig;
  ornaments: TemplateOrnamentConfig;
  layout: TemplateLayoutConfig;
}

export const TEMPLATES: Record<string, TemplateConfig> = {
  // =========================================================================
  // 1. ROYAL GOLD — الملكي الذهبي (CLASSIC EGYPTIAN ROYAL WEDDING)
  // TIER: PREMIUM
  // =========================================================================
  "royal-gold": {
    id: "royal-gold",
    nameAr: "الملكي الذهبي",
    nameEn: "Royal Gold",
    taglineAr: "فخامة الزفاف الملكي الكلاسيكي",
    descriptionAr: "ورق قطني عاجي داكن مع خطوط ذهبية هندسية مستوحاة من قصور مصر الخديوية، يعكس الفخامة الملكية الأصيلة بهدوء وتوازن.",
    styleTag: "ملوكي كلاسيكي",
    tier: "PREMIUM",
    style: "classic",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    featured: true,
    theme: {
      background: "bg-[#0c0b0a]",
      cardBackground: "bg-[#14120f]",
      accentColor: "#c5a880",
      accentGradient: "from-[#f5e7c8] via-[#c5a880] to-[#9e7d53]",
      textColor: "text-[#faf8f5]",
      subtitleColor: "text-[#c5a880]/90",
      borderColor: "border-[#c5a880]/35",
      ornamentColor: "#c5a880",
      buttonClass: "bg-[#c5a880] text-[#0c0b0a] hover:bg-[#d8bd96]",
      paperClass: "bg-[#14120f] text-[#faf8f5] border border-[#c5a880]/30 shadow-2xl shadow-black/80",
      isLight: false,
    },
    typography: {
      coupleFont: "font-display font-bold tracking-wide",
      headerStyle: "font-display tracking-[0.2em] font-medium text-xs",
      bodyStyle: "font-body font-light text-xs sm:text-sm leading-relaxed",
      monogramText: "font-display font-bold tracking-widest text-base",
      dateStyle: "font-display font-medium text-sm tracking-wide",
    },
    ornaments: {
      type: "royal",
      symbol: "✦",
      divider: "✦ ────── ❖ ────── ✦",
      cornerStyle: "ornate",
      monogramStyle: "circle-seal",
    },
    layout: {
      alignment: "center",
      frameStyle: "dashed-gold",
      aspectRatio: "aspect-[1/1.42]",
      innerPadding: "p-7 sm:p-10",
      paperTexture: "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-[#c5a880]/20",
      headerTreatment: "bismillah-regal",
    },
  },

  // =========================================================================
  // 2. EMERALD ELEGANCE — الزمرد الإمبراطوري (ROYAL BOTANICAL)
  // TIER: PREMIUM
  // =========================================================================
  "emerald-elegance": {
    id: "emerald-elegance",
    nameAr: "الزمرد الإمبراطوري",
    nameEn: "Emerald Elegance",
    taglineAr: "سحر الحدائق الملكية الخالدة",
    descriptionAr: "عمق الزمرد الملكي المنسوج بلمسات الشمبانيا، وتكوين رأسي انسيابي مستلهم من النباتات المخملية للأسر الحاكمة.",
    styleTag: "أناقة ملكية",
    tier: "PREMIUM",
    style: "botanical",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    theme: {
      background: "bg-[#06120d]",
      cardBackground: "bg-[#091a13]",
      accentColor: "#34d399",
      accentGradient: "from-[#a7f3d0] via-[#34d399] to-[#059669]",
      textColor: "text-[#f0fdf4]",
      subtitleColor: "text-[#6ee7b7]",
      borderColor: "border-[#10b981]/30",
      ornamentColor: "#34d399",
      buttonClass: "bg-[#10b981] text-[#041d14] hover:bg-[#34d399]",
      paperClass: "bg-[#091a13] text-[#f0fdf4] border border-[#34d399]/30 shadow-2xl shadow-emerald-950/80",
      isLight: false,
    },
    typography: {
      coupleFont: "font-display font-semibold tracking-wider",
      headerStyle: "font-sans uppercase tracking-[0.25em] font-medium text-[11px]",
      bodyStyle: "font-body font-light text-xs sm:text-sm leading-relaxed",
      monogramText: "font-display font-bold tracking-widest text-base",
      dateStyle: "font-display font-medium text-sm",
    },
    ornaments: {
      type: "botanical",
      symbol: "◆",
      divider: "🌿 ───── ◆ ───── 🌿",
      cornerStyle: "botanical-corner",
      monogramStyle: "flourish-crest",
    },
    layout: {
      alignment: "center",
      frameStyle: "botanical-thin",
      aspectRatio: "aspect-[1/1.44]",
      innerPadding: "p-7 sm:p-10",
      paperTexture: "shadow-[0_25px_60px_-15px_rgba(4,29,20,0.9)] ring-1 ring-[#34d399]/25",
      headerTreatment: "bismillah-calligraphy",
    },
  },

  // =========================================================================
  // 3. ROSE ROMANCE — الورد والحرير (MODERN ROMANTIC COUTURE)
  // TIER: PREMIUM
  // =========================================================================
  "rose-romance": {
    id: "rose-romance",
    nameAr: "الورد والحرير",
    nameEn: "Rose Romance",
    taglineAr: "نعومة الحرير وعطر البودرة الرقيق",
    descriptionAr: "إحساس رومانسي ناعم بلون الورد الترابي والعاج الدافئ مع تكوين شاعري وأقواس أنثوية تفيض بالرقة والشاعرية.",
    styleTag: "رومانسي ناعم",
    tier: "PREMIUM",
    style: "romantic",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    theme: {
      background: "bg-[#140b10]",
      cardBackground: "bg-[#1a0e15]",
      accentColor: "#f472b6",
      accentGradient: "from-[#fce7f3] via-[#f472b6] to-[#db2777]",
      textColor: "text-[#fff1f2]",
      subtitleColor: "text-[#fbcfe8]",
      borderColor: "border-[#f472b6]/30",
      ornamentColor: "#f472b6",
      buttonClass: "bg-[#ec4899] text-white hover:bg-[#f472b6]",
      paperClass: "bg-[#1a0e15] text-[#fff1f2] border border-[#f472b6]/30 shadow-2xl shadow-pink-950/80",
      isLight: false,
    },
    typography: {
      coupleFont: "font-display font-medium tracking-normal",
      headerStyle: "font-display tracking-wider font-light text-xs",
      bodyStyle: "font-body font-light text-xs sm:text-sm leading-relaxed",
      monogramText: "font-display font-medium tracking-widest text-base",
      dateStyle: "font-display font-normal text-sm",
    },
    ornaments: {
      type: "floral",
      symbol: "❀",
      divider: "❀ ────── ❧ ────── ❀",
      cornerStyle: "soft-curve",
      monogramStyle: "oval-cameo",
    },
    layout: {
      alignment: "center",
      frameStyle: "deckle-edge",
      aspectRatio: "aspect-[1/1.42]",
      innerPadding: "p-7 sm:p-10",
      paperTexture: "shadow-[0_25px_60px_-15px_rgba(26,14,21,0.95)] ring-1 ring-[#f472b6]/25",
      headerTreatment: "bismillah-calligraphy",
    },
  },

  // =========================================================================
  // 4. IVORY MINIMAL — العاجي الأنيق (LUXURY EDITORIAL)
  // TIER: BASIC
  // =========================================================================
  "ivory-minimal": {
    id: "ivory-minimal",
    nameAr: "العاجي الأنيق",
    nameEn: "Ivory Minimal",
    taglineAr: "بساطة تحريرية بنقاء ورق الكتان",
    descriptionAr: "ملمس ورق الكتان العاجي الخالص مع تجريد هندسي أنيق، خطوط طباعية عربية فسيحة وهوامش عريضة مستوحاة من دور الأزياء.",
    styleTag: "عاجي تحريري",
    tier: "BASIC",
    style: "minimal",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    theme: {
      background: "bg-[#141311]",
      cardBackground: "bg-[#fbf9f4]",
      accentColor: "#a8824f",
      accentGradient: "from-[#c5a880] via-[#a8824f] to-[#7c5f34]",
      textColor: "text-[#1c1917]",
      subtitleColor: "text-[#786c5e]",
      borderColor: "border-[#e0d6c3]",
      ornamentColor: "#a8824f",
      buttonClass: "bg-[#1c1917] text-[#fbf9f4] hover:bg-[#2d2925]",
      paperClass: "bg-[#fbf9f4] text-[#1c1917] border border-[#dfd6c4] shadow-2xl shadow-black/60",
      isLight: true,
    },
    typography: {
      coupleFont: "font-display font-light tracking-wide",
      headerStyle: "font-sans uppercase tracking-[0.28em] font-semibold text-[10px]",
      bodyStyle: "font-body font-light text-xs sm:text-sm text-[#4a4036] leading-relaxed",
      monogramText: "font-display font-light tracking-[0.3em] text-sm",
      dateStyle: "font-display font-medium text-sm text-[#1c1917]",
    },
    ornaments: {
      type: "minimal",
      symbol: "•",
      divider: "─── / ───",
      cornerStyle: "hairline-bracket",
      monogramStyle: "minimal-clean",
    },
    layout: {
      alignment: "center",
      frameStyle: "hairline-single",
      aspectRatio: "aspect-[1/1.42]",
      innerPadding: "p-8 sm:p-12",
      paperTexture: "shadow-[0_20px_50px_-10px_rgba(0,0,0,0.25)] ring-1 ring-[#e0d6c3]",
      headerTreatment: "bismillah-minimal",
    },
  },

  // =========================================================================
  // 5. BURGUNDY GRANDEUR — العنابي الملكي (OLD MONEY WEDDING)
  // TIER: PREMIUM
  // =========================================================================
  "burgundy-grandeur": {
    id: "burgundy-grandeur",
    nameAr: "العنابي الملكي",
    nameEn: "Burgundy Grandeur",
    taglineAr: "دفء المخمل الأرستقراطي العريق",
    descriptionAr: "مخمل عنابي معتق بحواشي مذهبة كلاسيكية، مستوحى من بطاقات العائلات العريقة في حفلات الزفاف التاريخية الكبرى.",
    styleTag: "فخامة عريقة",
    tier: "PREMIUM",
    style: "classic",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    theme: {
      background: "bg-[#14070a]",
      cardBackground: "bg-[#1c080d]",
      accentColor: "#e0a96d",
      accentGradient: "from-[#fcd34d] via-[#e0a96d] to-[#b45309]",
      textColor: "text-[#fff1f2]",
      subtitleColor: "text-[#e0a96d]",
      borderColor: "border-[#e0a96d]/30",
      ornamentColor: "#e0a96d",
      buttonClass: "bg-[#e0a96d] text-[#14070a] hover:bg-[#ebd5ab]",
      paperClass: "bg-[#1c080d] text-[#fff1f2] border border-[#e0a96d]/35 shadow-2xl shadow-red-950/80",
      isLight: false,
    },
    typography: {
      coupleFont: "font-display font-extrabold tracking-wide",
      headerStyle: "font-display tracking-widest font-semibold text-xs",
      bodyStyle: "font-body font-light text-xs sm:text-sm leading-relaxed",
      monogramText: "font-display font-bold tracking-widest text-base",
      dateStyle: "font-display font-semibold text-sm",
    },
    ornaments: {
      type: "vintage",
      symbol: "⚜",
      divider: "⚜ ────── ✦ ────── ⚜",
      cornerStyle: "regal-crown",
      monogramStyle: "vintage-shield",
    },
    layout: {
      alignment: "center",
      frameStyle: "double-regal",
      aspectRatio: "aspect-[1/1.42]",
      innerPadding: "p-7 sm:p-10",
      paperTexture: "shadow-[0_25px_60px_-15px_rgba(28,8,13,0.95)] ring-1 ring-[#e0a96d]/25",
      headerTreatment: "bismillah-regal",
    },
  },

  // =========================================================================
  // 6. MODERN BLACK — الأسود المعاصر (CONTEMPORARY LUXURY)
  // TIER: BASIC
  // =========================================================================
  "modern-minimal": {
    id: "modern-minimal",
    nameAr: "الأسود المعاصر",
    nameEn: "Modern Black",
    taglineAr: "جرأة السواد المعماري الفاحم",
    descriptionAr: "سواد ليل نقي بحواشي بلاتينية دقيقة وخطوط عصرية حادة تخاطب محبي الفن المعماري والتصميم المعاصر الخالي من الزوائد.",
    styleTag: "مودرن معاصر",
    tier: "BASIC",
    style: "minimal",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    theme: {
      background: "bg-[#08080a]",
      cardBackground: "bg-[#101014]",
      accentColor: "#cbd5e1",
      accentGradient: "from-[#ffffff] via-[#e2e8f0] to-[#94a3b8]",
      textColor: "text-[#f8fafc]",
      subtitleColor: "text-slate-400",
      borderColor: "border-slate-800",
      ornamentColor: "#cbd5e1",
      buttonClass: "bg-slate-100 text-slate-950 hover:bg-white",
      paperClass: "bg-[#101014] text-[#f8fafc] border border-slate-800 shadow-2xl shadow-black/90",
      isLight: false,
    },
    typography: {
      coupleFont: "font-display font-bold tracking-wider",
      headerStyle: "font-sans uppercase tracking-[0.25em] font-semibold text-[11px]",
      bodyStyle: "font-body font-light text-xs sm:text-sm text-slate-300 leading-relaxed",
      monogramText: "font-mono font-medium tracking-[0.3em] text-sm",
      dateStyle: "font-mono font-normal text-xs text-slate-200",
    },
    ornaments: {
      type: "minimal",
      symbol: "—",
      divider: "── // ──",
      cornerStyle: "hairline-bracket",
      monogramStyle: "minimal-clean",
    },
    layout: {
      alignment: "center",
      frameStyle: "hairline-single",
      aspectRatio: "aspect-[1/1.42]",
      innerPadding: "p-8 sm:p-11",
      paperTexture: "shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] ring-1 ring-slate-800",
      headerTreatment: "bismillah-minimal",
    },
  },

  // =========================================================================
  // 7. ARABIAN HERITAGE — الأصالة التراثية (MODERN ARABIC HERITAGE)
  // TIER: PREMIUM
  // =========================================================================
  "desert-calligraphy": {
    id: "desert-calligraphy",
    nameAr: "الأصالة التراثية",
    nameEn: "Arabian Heritage",
    taglineAr: "عراقة الخط العربي ونقوش المشربية",
    descriptionAr: "دفء رمال الجزيرة الموشاة بزخارف مشربية دقيقة وتدرجات العنبر والذهب، تمنح المناسبة طابعاً عربياً أصيلاً ومعاصراً في آن واحد.",
    styleTag: "تراثي أصيل",
    tier: "PREMIUM",
    style: "heritage",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    theme: {
      background: "bg-[#140e08]",
      cardBackground: "bg-[#1a110a]",
      accentColor: "#e6c367",
      accentGradient: "from-[#fcedc7] via-[#e6c367] to-[#b3851b]",
      textColor: "text-[#fff8eb]",
      subtitleColor: "text-[#e6c367]/80",
      borderColor: "border-[#c29b38]/30",
      ornamentColor: "#e6c367",
      buttonClass: "bg-[#e6c367] text-[#140e08] hover:bg-[#fae49d]",
      paperClass: "bg-[#1a110a] text-[#fff8eb] border border-[#e6c367]/30 shadow-2xl shadow-amber-950/80",
      isLight: false,
    },
    typography: {
      coupleFont: "font-display font-bold tracking-wide",
      headerStyle: "font-display tracking-widest text-xs font-semibold",
      bodyStyle: "font-body font-light text-xs sm:text-sm leading-relaxed",
      monogramText: "font-display font-bold tracking-widest text-base",
      dateStyle: "font-display font-medium text-sm",
    },
    ornaments: {
      type: "heritage",
      symbol: "۞",
      divider: "✦ ❖ ✦ ❖ ✦",
      cornerStyle: "geometric-star",
      monogramStyle: "octagon-star",
    },
    layout: {
      alignment: "center",
      frameStyle: "geometric-double",
      aspectRatio: "aspect-[1/1.42]",
      innerPadding: "p-7 sm:p-10",
      paperTexture: "shadow-[0_25px_60px_-15px_rgba(26,17,10,0.95)] ring-1 ring-[#e6c367]/25",
      headerTreatment: "bismillah-calligraphy",
    },
  },

  // =========================================================================
  // 8. NEW LUXURY 01: "MAISON" — ميزون الباريسي (PARISIAN COUTURE WEDDING)
  // TIER: LUXURY
  // =========================================================================
  "luxury-maison": {
    id: "luxury-maison",
    nameAr: "ميزون كوتور",
    nameEn: "Maison Couture",
    taglineAr: "أناقة دور الأزياء الباريسية الراقية",
    descriptionAr: "تصميم كوتور متفرد بأسماء عملاقة وهوامش فسيحة مستوحاة من دعوات عروض الأزياء الراقية في باريس، مزيج أبيض عاجي وأسود فاحم.",
    styleTag: "كوتور فاخر",
    tier: "LUXURY",
    style: "couture",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    featured: true,
    theme: {
      background: "bg-[#09090b]",
      cardBackground: "bg-[#fcfaf7]",
      accentColor: "#171717",
      accentGradient: "from-[#262626] via-[#171717] to-[#0a0a0a]",
      textColor: "text-[#0a0a0a]",
      subtitleColor: "text-[#737373]",
      borderColor: "border-[#d4d4d4]",
      ornamentColor: "#171717",
      buttonClass: "bg-[#0a0a0a] text-[#fafafa] hover:bg-[#262626]",
      paperClass: "bg-[#fcfaf7] text-[#0a0a0a] border border-[#e5e5e5] shadow-2xl shadow-black/70",
      isLight: true,
    },
    typography: {
      coupleFont: "font-display font-extralight tracking-tight",
      headerStyle: "font-sans uppercase tracking-[0.35em] font-semibold text-[9px] text-[#525252]",
      bodyStyle: "font-body font-light text-xs text-[#525252] leading-loose max-w-[260px]",
      monogramText: "font-display font-light tracking-[0.4em] text-xs",
      dateStyle: "font-mono uppercase tracking-[0.25em] text-xs font-medium text-[#262626]",
    },
    ornaments: {
      type: "couture",
      symbol: "+",
      divider: "─── + ───",
      cornerStyle: "couture-cross",
      monogramStyle: "couture-serif",
    },
    layout: {
      alignment: "editorial-split",
      frameStyle: "couture-border",
      aspectRatio: "aspect-[1/1.45]",
      innerPadding: "p-9 sm:p-14",
      paperTexture: "shadow-[0_30px_70px_-10px_rgba(0,0,0,0.3)] ring-1 ring-[#e5e5e5]",
      headerTreatment: "bismillah-couture",
    },
  },

  // =========================================================================
  // 9. NEW LUXURY 02: "MAJLIS" — المجلس الأرستقراطي (CONTEMPORARY ARAB ARISTOCRACY)
  // TIER: LUXURY
  // =========================================================================
  "luxury-majlis": {
    id: "luxury-majlis",
    nameAr: "المجلس الأرستقراطي",
    nameEn: "Majlis Aristocratic",
    taglineAr: "هيبة القصور العربية المعاصرة",
    descriptionAr: "إطار معماري قوسي مستوحى من واجهات القصور الملكية، وتناغم هندسي متقن يجمع بين الخط العربي الرصين وخلفية الكشمير الداكنة.",
    styleTag: "أرستقراطي فاخر",
    tier: "LUXURY",
    style: "aristocratic",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    featured: true,
    theme: {
      background: "bg-[#0d0c0a]",
      cardBackground: "bg-[#171512]",
      accentColor: "#d4af37",
      accentGradient: "from-[#fef3c7] via-[#d4af37] to-[#92400e]",
      textColor: "text-[#faf6f0]",
      subtitleColor: "text-[#d4af37]/90",
      borderColor: "border-[#d4af37]/35",
      ornamentColor: "#d4af37",
      buttonClass: "bg-[#d4af37] text-[#0d0c0a] hover:bg-[#e6c86e]",
      paperClass: "bg-[#171512] text-[#faf6f0] border border-[#d4af37]/30 shadow-2xl shadow-black/85",
      isLight: false,
    },
    typography: {
      coupleFont: "font-display font-bold tracking-wide",
      headerStyle: "font-display tracking-[0.25em] font-medium text-xs",
      bodyStyle: "font-body font-light text-xs sm:text-sm text-[#d6cec3] leading-relaxed",
      monogramText: "font-display font-bold tracking-widest text-base",
      dateStyle: "font-display font-semibold text-sm",
    },
    ornaments: {
      type: "arch",
      symbol: "⚜",
      divider: "❖ ────── ⚜ ────── ❖",
      cornerStyle: "arch-header",
      monogramStyle: "arch-keystone",
    },
    layout: {
      alignment: "center",
      frameStyle: "arch-dome",
      aspectRatio: "aspect-[1/1.48]",
      innerPadding: "p-8 sm:p-12",
      paperTexture: "shadow-[0_30px_70px_-15px_rgba(0,0,0,0.95)] ring-1 ring-[#d4af37]/25",
      headerTreatment: "bismillah-regal",
    },
  },

  // =========================================================================
  // 10. NEW LUXURY 03: "ATELIER" — أتيليه الحرفي (HAND-CRAFTED BESPOKE STATIONERY)
  // TIER: LUXURY
  // =========================================================================
  "luxury-atelier": {
    id: "luxury-atelier",
    nameAr: "أتيليه يدوي",
    nameEn: "Atelier Hand-Crafted",
    taglineAr: "إحساس الورق اليدوي البارز وختم الشمع",
    descriptionAr: "محاكاة واقعية لورق قطني يدوي معتق بحواف مموجة وأختام بارزة وتفاصيل خطية معدنية مشغولة وكأنها طُبعت بمطبعة يدوية خاصة.",
    styleTag: "حرفي مخصص",
    tier: "LUXURY",
    style: "craft",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
    featured: true,
    theme: {
      background: "bg-[#121110]",
      cardBackground: "bg-[#f5f1e8]",
      accentColor: "#8b6f47",
      accentGradient: "from-[#b89f77] via-[#8b6f47] to-[#5e492d]",
      textColor: "text-[#2e2720]",
      subtitleColor: "text-[#7a6b5c]",
      borderColor: "border-[#d8cebe]",
      ornamentColor: "#8b6f47",
      buttonClass: "bg-[#8b6f47] text-[#f5f1e8] hover:bg-[#9f8257]",
      paperClass: "bg-[#f5f1e8] text-[#2e2720] border-2 border-[#d8cebe] shadow-2xl shadow-black/50",
      isLight: true,
    },
    typography: {
      coupleFont: "font-display font-medium tracking-normal",
      headerStyle: "font-serif tracking-widest italic text-xs text-[#7a6b5c]",
      bodyStyle: "font-body font-light text-xs sm:text-sm text-[#4d4237] leading-relaxed",
      monogramText: "font-display font-bold tracking-widest text-base",
      dateStyle: "font-serif font-medium text-sm text-[#2e2720]",
    },
    ornaments: {
      type: "embossed",
      symbol: "✧",
      divider: "─── ✧ ───",
      cornerStyle: "embossed-crest",
      monogramStyle: "embossed-wax",
    },
    layout: {
      alignment: "center",
      frameStyle: "deckle-edge",
      aspectRatio: "aspect-[1/1.42]",
      innerPadding: "p-8 sm:p-12",
      paperTexture: "shadow-[0_25px_60px_-10px_rgba(0,0,0,0.3)] ring-1 ring-[#c7bcab]",
      headerTreatment: "bismillah-calligraphy",
    },
  },
};

// Backward compatibility alias for legacy seeded events & tests
TEMPLATES["emerald-luxury"] = {
  ...TEMPLATES["emerald-elegance"],
  id: "emerald-luxury",
  tier: "BASIC",
};

export const DEFAULT_TEMPLATE_ID = "royal-gold";

export function getTemplate(id?: string): TemplateConfig {
  if (id && TEMPLATES[id]) {
    return TEMPLATES[id];
  }
  return TEMPLATES[DEFAULT_TEMPLATE_ID];
}

// Helper to filter templates by tier
export function getTemplatesByTier(tier: TemplateTier): TemplateConfig[] {
  return Object.values(TEMPLATES).filter((tmpl) => tmpl.tier === tier);
}

// Package tier to allowed template tiers mapping
export function getAllowedTemplateTiers(packageCode?: string | null): TemplateTier[] {
  switch (packageCode?.toUpperCase()) {
    case "LUXURY":
      return ["BASIC", "PREMIUM", "LUXURY"];
    case "PREMIUM":
      return ["BASIC", "PREMIUM"];
    case "BASIC":
    default:
      return ["BASIC"];
  }
}

// Check whether a specific template is allowed for a package tier
export function isTemplateAllowedForPackage(templateId: string, packageCode?: string | null): boolean {
  const tmpl = TEMPLATES[templateId];
  if (!tmpl) return false;
  const allowedTiers = getAllowedTemplateTiers(packageCode);
  return allowedTiers.includes(tmpl.tier);
}


export const FALLBACK_BLANK_TEMPLATE: TemplateConfig = {
  id: "default",
  nameAr: "قالب افتراضي",
  nameEn: "Default Template",
  taglineAr: "قالب أساسي",
  descriptionAr: "قالب أساسي هادئ",
  styleTag: "افتراضي",
  tier: "BASIC",
  style: "classic",
    eventTypes: ["WEDDING", "KATB_KITAB", "ENGAGEMENT", "FATIHIA", "OTHER"],
  featured: false,
  theme: {
    background: "bg-[#14120f]",
    cardBackground: "bg-[#FFFDFC]",
    accentColor: "#790D20",
    accentGradient: "from-[#f5e7c8] via-[#c5a880] to-[#9e7d53]",
    textColor: "text-[#390E19]",
    subtitleColor: "text-[#8B7778]",
    borderColor: "border-[#EFE4DC]",
    ornamentColor: "#790D20",
    buttonClass: "bg-[#790D20] text-white hover:bg-[#5e0a19] shadow-md",
    paperClass: "bg-[#FFFDFC] text-[#390E19] border border-[#EFE4DC] shadow-xl",
    isLight: true,
  },
  typography: {
    coupleFont: "font-serif font-bold text-3xl sm:text-4xl",
    headerStyle: "font-serif text-sm text-[#790D20]",
    bodyStyle: "font-sans text-xs sm:text-sm text-[#390E19]",
    monogramText: "font-serif font-bold text-base",
    dateStyle: "font-serif font-bold text-sm",
  },
  ornaments: {
    type: "minimal",
    symbol: "✦",
    divider: "✦ ──── ✦",
    cornerStyle: "soft-curve",
    monogramStyle: "minimal-clean",
  },
  layout: {
    alignment: "center",
    frameStyle: "hairline-single",
    aspectRatio: "3/4",
    innerPadding: "p-6 sm:p-8",
    paperTexture: "shadow-sm",
    headerTreatment: "bismillah-minimal",
  },
};

TEMPLATES["default"] = FALLBACK_BLANK_TEMPLATE;

export function getUniqueTemplates(): TemplateConfig[] {
  const seen = new Set<string>();
  return Object.values(TEMPLATES).filter((tmpl) => {
    if (seen.has(tmpl.id)) return false;
    seen.add(tmpl.id);
    return true;
  });
}

export function getEventTypeLabel(eventType?: string): string {
  switch (eventType) {
    case "ENGAGEMENT":
      return "حفل خطوبة مبارك";
    case "FATIHIA":
      return "مراسم قراءة الفاتحة المباركة";
    case "KATB_KITAB":
      return "مراسم عقد القران وكتب الكتاب";
    case "WEDDING":
      return "حفل زفاف مبارك";
    case "BIRTHDAY":
      return "احتفال عيد ميلاد سعيد";
    case "GRADUATION":
      return "حفل تخرج ومسيرة نجاح";
    case "SEBOU":
      return "احتفال سبوع واستقبال مولود مبارك";
    case "HENNA":
      return "ليلة الحنة المباركة";
    case "OTHER":
      return "دعوة خاصة لمناسبة مميزة";
    default:
      return "حفل زفاف مبارك";
  }
}

export function getTemplatesByEventType(eventType: EventType | string): TemplateConfig[] {
  const templates = getUniqueTemplates();
  if (!eventType || eventType === "ALL") return templates;
  return templates.filter((tmpl) => tmpl.eventTypes && tmpl.eventTypes.includes(eventType as EventType));
}

export function getTemplateCountsByEventType(): Record<string, number> {
  const templates = getUniqueTemplates();
  const counts: Record<string, number> = {
    ALL: templates.length,
  };
  EVENT_TYPES.forEach((evt) => {
    if (evt.id !== "ALL") {
      counts[evt.id] = templates.filter((tmpl) => tmpl.eventTypes && tmpl.eventTypes.includes(evt.id)).length;
    }
  });
  return counts;
}
