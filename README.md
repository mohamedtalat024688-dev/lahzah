# لحظة (Lahzah) - منصة دعوات الزفاف وتوثيق الذكريات

> **"من دعوة… إلى ذكرى"**  
> المنصة التجارية المتكاملة لدعوات المناسبات الفاخرة، ومشاركة اللحظات، وألبومات الذكريات التفاعلية للوطن العربي.

---

## 🌟 مميزات المنصة (Key Features)

### 1. قبل المناسبة (Before the Event)
- **بطاقات دعوة رقمية فاخرة:** قوالب تفاعلية مصممة بأعلى معايير الفخامة (ملكي ذهبي، زمردي، زهور ربيعية، أصالة عربية، ومودرن مينيمال).
- **إدارة الحضور (RSVP):** تأكيد الحضور، عدد المرافقين، والاعتذار مع إحصائيات فورية للمنظم.
- **تفاصيل متكاملة:** عد تنازلي، خريطة الموقع، وبرنامج الحفل.

### 2. خلال المناسبة (During the Event)
- **رمز QR مخصص:** يُعرض على طاولات الحفل أو عند المدخل.
- **رفع الصور الفوري للضيوف:** يمسح الضيف الرمز ويشارك صوره وتهنئته فوراً **دون الحاجة لإنشاء حساب**.
- **صندوق مراجعة للداعي:** تصل الصور بحالة (قيد المراجعة) ليوافق عليها صاحب الحفل قبل النشر.

### 3. بعد المناسبة (After the Event)
- **ألبوم ذكريات حي:** معرض صور فاخر مع عارض شاشة كاملة (Lightbox) وتنزيل بجودة عالية يخلّد اللحظات للأبد.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)
- **Frontend & Backend:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4, Arabic Luxury Design System
- **Database & ORM:** Prisma ORM, SQLite (local) / PostgreSQL ready
- **Auth:** JWT HTTP-only Cookie Auth with `jose` & `bcryptjs`
- **QR Engine:** `qrcode` generator with SVG & high-res PNG export
- **Icons:** `lucide-react`

---

## 🚀 تشغيل المشروع محلياً (Local Setup)

```bash
# تثبيت الحزم
npm install

# توليد قاعدة البيانات
npx prisma db push

# تشغيل خادم التطوير
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

## 📂 توثيق المشروع (Project Memory)
- [`PROJECT_CONTEXT.md`](file:///c:/Users/Souq%20al%20computer/Desktop/lahzah/PROJECT_CONTEXT.md) - الحالة الشاملة للمشروع.
- [`ARCHITECTURE.md`](file:///c:/Users/Souq%20al%20computer/Desktop/lahzah/ARCHITECTURE.md) - المعمارية، مسارات الويب، والمخططات.
- [`DECISIONS.md`](file:///c:/Users/Souq%20al%20computer/Desktop/lahzah/DECISIONS.md) - القرارات الهندسية.
- [`HANDOFF.md`](file:///c:/Users/Souq%20al%20computer/Desktop/lahzah/HANDOFF.md) - توجيهات التسليم للوكيل التالي.
