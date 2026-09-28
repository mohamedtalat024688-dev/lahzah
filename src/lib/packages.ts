export interface PackageTier {
  code: "BASIC" | "PREMIUM" | "LUXURY";
  nameAr: string;
  nameEn: string;
  taglineAr: string;
  price: number;
  currency: string;
  photoLimit: number;
  isPopular?: boolean;
  features: string[];
}

export const PACKAGES: Record<string, PackageTier> = {
  BASIC: {
    code: "BASIC",
    nameAr: "الباقة الأساسية",
    nameEn: "Basic",
    taglineAr: "مناسبة للاحتفالات العائلية الصغيرة وعقد القران",
    price: 399,
    currency: "ج.م",
    photoLimit: 150,
    features: [
      "دعوة إلكترونية تفاعلية برابط خاص",
      "تأكيد الحضور (RSVP) وإحصائيات الحضور",
      "رمز QR مخصص للطباعة",
      "مشاركة حتى 150 صورة من الضيوف",
      "لوحة مراجعة وموافقة على الصور",
      "صلاحية المعرض لمدة 3 أشهر",
    ],
  },
  PREMIUM: {
    code: "PREMIUM",
    nameAr: "الباقة المميزة",
    nameEn: "Premium",
    taglineAr: "الخيار المثالي لحفلات الزفاف والخطوبة الراقية",
    price: 799,
    currency: "ج.م",
    photoLimit: 500,
    isPopular: true,
    features: [
      "كل مميزات الباقة الأساسية",
      "جميع القوالب الملكية والفاخرة مفتوحة",
      "مشاركة حتى 500 صورة بجودة فائقة",
      "لوحة تحكم متقدمة مع تصدير بيانات الحضور",
      "تصميم بطاقة طاولة جاهزة للطباعة مع الـ QR",
      "صلاحية المعرض مدى الحياة",
      "دعم فني سريع عبر الواتساب",
    ],
  },
  LUXURY: {
    code: "LUXURY",
    nameAr: "الباقة الملكية",
    nameEn: "Luxury VIP",
    taglineAr: "تجربة ملكية استثنائية متكاملة لأفخم المناسبات",
    price: 1399,
    currency: "ج.م",
    photoLimit: 2000,
    features: [
      "كل مميزات الباقة المميزة",
      "مشاركة صور غير محدودة تقريباً (حتى 2000 صورة)",
      "تخصيص رابط مميز مخصص (Custom URL)",
      "شاشة عرض حي للصور خلال الحفل (Live Photo Wall)",
      "تحميل الألبوم بالكامل بضغطة زر بدقة أصلية",
      "تنسيق مخصص من مصممي لحظة المحترفين",
      "دعم ومتابعة مخصصة يوم الحفل",
    ],
  },
};

export async function processPaymentSimulation(eventId: string, packageCode: string) {
  // In production, integrate Paymob / Fawry / Stripe webhook
  // Mock immediate approval for test/demo environments
  return {
    success: true,
    transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    status: "PAID",
    packageCode,
    eventId,
  };
}
