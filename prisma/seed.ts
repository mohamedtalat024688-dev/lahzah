import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Lahzah platform database...");

  // 1. Create Packages
  const packagesData = [
    {
      code: "BASIC",
      nameAr: "الباقة الأساسية",
      nameEn: "Basic",
      price: 399,
      currency: "ج.م",
      photoLimit: 150,
      isPopular: false,
      features: JSON.stringify([
        "دعوة إلكترونية تفاعلية برابط خاص",
        "تأكيد الحضور (RSVP) وإحصائيات الحضور",
        "رمز QR مخصص للطباعة",
        "مشاركة حتى 150 صورة من الضيوف",
        "لوحة مراجعة وموافقة على الصور",
        "صلاحية المعرض لمدة 3 أشهر",
      ]),
    },
    {
      code: "PREMIUM",
      nameAr: "الباقة المميزة",
      nameEn: "Premium",
      price: 799,
      currency: "ج.م",
      photoLimit: 500,
      isPopular: true,
      features: JSON.stringify([
        "كل مميزات الباقة الأساسية",
        "جميع القوالب الملكية والفاخرة مفتوحة",
        "مشاركة حتى 500 صورة بجودة فائقة",
        "لوحة تحكم متقدمة مع تصدير بيانات الحضور",
        "تصميم بطاقة طاولة جاهزة للطباعة مع الـ QR",
        "صلاحية المعرض مدى الحياة",
        "دعم فني سريع عبر الواتساب",
      ]),
    },
    {
      code: "LUXURY",
      nameAr: "الباقة الملكية الفاخرة",
      nameEn: "Luxury VIP",
      price: 1399,
      currency: "ج.م",
      photoLimit: 2000,
      isPopular: false,
      features: JSON.stringify([
        "كل مميزات الباقة المميزة",
        "مشاركة صور غير محدودة تقريباً (حتى 2000 صورة)",
        "تخصيص رابط مميز مخصص (Custom URL)",
        "شاشة عرض حي للصور خلال الحفل (Live Photo Wall)",
        "تحميل الألبوم بالكامل بضغطة زر بدقة أصلية",
        "تنسيق مخصص من مصممي لحظة المحترفين",
        "دعم ومتابعة مخصصة يوم الحفل",
      ]),
    },
  ];

  for (const pkg of packagesData) {
    await prisma.package.upsert({
      where: { code: pkg.code },
      update: pkg,
      create: pkg,
    });
  }

  // 2. Create Users (Admin and Demo Owner)
  const passwordAdmin = await bcrypt.hash("admin123456", 10);
  const passwordOwner = await bcrypt.hash("ahmed123456", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@lahzah.com" },
    update: {},
    create: {
      email: "admin@lahzah.com",
      name: "مدير منصة لحظة",
      passwordHash: passwordAdmin,
      role: "ADMIN",
    },
  });

  const ownerUser = await prisma.user.upsert({
    where: { email: "ahmed@lahzah.com" },
    update: {},
    create: {
      email: "ahmed@lahzah.com",
      name: "أحمد منصور",
      passwordHash: passwordOwner,
      role: "OWNER",
    },
  });

  // 3. Create Demo Wedding Event: Ahmed & Sara
  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 14); // 14 days in future
  eventDate.setHours(20, 0, 0, 0);

  const demoEvent = await prisma.event.upsert({
    where: { slug: "ahmed-and-sara" },
    update: {},
    create: {
      slug: "ahmed-and-sara",
      title: "حفل زفاف أحمد وسارة",
      eventType: "WEDDING",
      groomName: "أحمد منصور",
      brideName: "سارة الجوهري",
      eventDate: eventDate,
      venueName: "فندق ماريوت مينا هاوس - قاعة الأهرامات",
      address: "شارع الهرم، الجيزة، مصر",
      mapUrl: "https://maps.google.com/?q=Marriott+Mena+House+Cairo",
      welcomeMessage: "بقلوب ملؤها المحبة والسعادة، نتشرف بدعوتكم لمشاركتنا فرحة العمر وتوثيق أجمل اللحظات معنا.",
      description: "تبدأ مراسم الحفل في تمام الساعة الثامنة مساءً بحضور الأهل والأصدقاء.",
      templateId: "royal-gold",
      isPublished: true,
      isPaid: true,
      packageTier: "PREMIUM",
      userId: ownerUser.id,
    },
  });

  // 4. Sample RSVPs
  const sampleRsvps = [
    {
      eventId: demoEvent.id,
      guestName: "د. محمود عبد العزيز",
      phone: "+201012345678",
      attendanceStatus: "ATTENDING",
      guestCount: 2,
      note: "ألف مليون مبروك لأجمل عروسين، نسأل الله أن يبارك لكما ويجمع بينكما في خير!",
    },
    {
      eventId: demoEvent.id,
      guestName: "المهندس كريم الشافعي وعائلته",
      phone: "+201123456789",
      attendanceStatus: "ATTENDING",
      guestCount: 4,
      note: "فرحة العمر يا أحمد، متشوقون جداً للقائكم والاحتفال معكم.",
    },
    {
      eventId: demoEvent.id,
      guestName: "سارة وفهد المهدي",
      phone: "+201234567890",
      attendanceStatus: "MAYBE",
      guestCount: 2,
      note: "سنبذل قصارى جهدنا للحضور إن شاء الله، مبارك مقدماً!",
    },
  ];

  for (const rsvp of sampleRsvps) {
    await prisma.rsvp.create({ data: rsvp });
  }

  // 5. Sample Photos (Memories)
  const samplePhotos = [
    {
      eventId: demoEvent.id,
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
      guestName: "خالد التميمي",
      message: "أجمل عروسين في الكون! حفظكما الله ورعاكما ✨",
      status: "APPROVED",
    },
    {
      eventId: demoEvent.id,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      guestName: "ياسمين ورضوى",
      message: "القاعة خيالية وأنتِ يا سارة كالقمر تبارك الله ❤️❤️",
      status: "APPROVED",
    },
    {
      eventId: demoEvent.id,
      url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80",
      guestName: "أحمد النجار",
      message: "لحظة تقطيع التورتة الرائعة 🎂",
      status: "APPROVED",
    },
    {
      eventId: demoEvent.id,
      url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
      guestName: "عمر الدسوقي",
      message: "صورة عفوية مع العريس الغالي!",
      status: "PENDING", // Pending moderation
    },
  ];

  for (const photo of samplePhotos) {
    await prisma.photo.create({ data: photo });
  }

  console.log("Database seeded successfully with demo users, wedding event, RSVPs, and memories!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
