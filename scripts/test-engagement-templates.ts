import { TEMPLATES, getTemplatesByEventType } from "../src/lib/templates";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function main() {
  console.log("==================================================");
  console.log("💍 TESTING 8 BESPOKE ENGAGEMENT TEMPLATES SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`  ✔ ${msg}`);
      passed++;
    } else {
      console.error(`  ❌ FAILED: ${msg}`);
      failed++;
    }
  }

  const expectedEngagementTemplates = [
    {
      id: "engagement-romantic",
      nameAr: "الرومانسي المخملي",
      nameEn: "The Romantic",
      tier: "PREMIUM",
      style: "romantic",
      accent: "#B86B77",
    },
    {
      id: "engagement-floral-garden",
      nameAr: "حديقة الزهور العاجية",
      nameEn: "The Floral Garden",
      tier: "PREMIUM",
      style: "botanical",
      accent: "#74836D",
    },
    {
      id: "engagement-royal",
      nameAr: "الخطوبة الملكية",
      nameEn: "The Royal Engagement",
      tier: "LUXURY",
      style: "aristocratic",
      accent: "#D6B77A",
    },
    {
      id: "engagement-minimalist",
      nameAr: "المينيمال العصري",
      nameEn: "The Minimalist",
      tier: "BASIC",
      style: "minimal",
      accent: "#790D20",
    },
    {
      id: "engagement-editorial",
      nameAr: "الإيديتوريال الأوروبي",
      nameEn: "The European Editorial",
      tier: "LUXURY",
      style: "couture",
      accent: "#9A8057",
    },
    {
      id: "engagement-vintage",
      nameAr: "الرومانسية الكلاسيكية",
      nameEn: "The Vintage Romance",
      tier: "PREMIUM",
      style: "heritage",
      accent: "#8A3D43",
    },
    {
      id: "engagement-blush",
      nameAr: "الوردي المعاصر",
      nameEn: "The Modern Blush",
      tier: "BASIC",
      style: "minimal",
      accent: "#D6B77A",
    },
    {
      id: "engagement-arabic-luxury",
      nameAr: "الفخامة العربية الأصيلة",
      nameEn: "The Arabic Luxury",
      tier: "LUXURY",
      style: "heritage",
      accent: "#E0C07A",
    },
  ];

  // 1. Verify existence and metadata in TEMPLATES
  console.log("\nTest 1: Verifying 8 Engagement Templates in TEMPLATES registry...");
  expectedEngagementTemplates.forEach((exp) => {
    const tmpl = TEMPLATES[exp.id];
    assert(!!tmpl, `Template registered: ${exp.nameAr} (${exp.id})`);
    if (tmpl) {
      assert(tmpl.nameAr === exp.nameAr, `NameAr matches: "${tmpl.nameAr}"`);
      assert(tmpl.nameEn === exp.nameEn, `NameEn matches: "${tmpl.nameEn}"`);
      assert(tmpl.tier === exp.tier, `Tier matches: ${tmpl.tier}`);
      assert(tmpl.style === exp.style, `Style matches: ${tmpl.style}`);
      assert(
        tmpl.eventTypes?.includes("ENGAGEMENT"),
        `Includes ENGAGEMENT eventType: [${tmpl.eventTypes?.join(", ")}]`
      );
      assert(tmpl.theme.accentColor === exp.accent, `Accent matches: ${tmpl.theme.accentColor}`);
      assert(!!tmpl.taglineAr, `Has Arabic tagline: "${tmpl.taglineAr}"`);
      assert(!!tmpl.descriptionAr, `Has Arabic description: "${tmpl.descriptionAr.slice(0, 40)}..."`);
    }
  });

  // 2. Verify Filtering By ENGAGEMENT returns all 8
  console.log("\nTest 2: Verifying getTemplatesByEventType('ENGAGEMENT')...");
  const engagementList = getTemplatesByEventType("ENGAGEMENT");
  assert(engagementList.length === 8, `Found exactly 8 engagement templates (found ${engagementList.length})`);
  expectedEngagementTemplates.forEach((exp) => {
    assert(
      engagementList.some((t) => t.id === exp.id),
      `engagementList contains ${exp.id}`
    );
  });

  // 3. Test Preview Page for all 8 templates
  console.log("\nTest 3: Testing dedicated /preview for all 8 templates...");
  for (const exp of expectedEngagementTemplates) {
    const res = await fetch(`${BASE_URL}/preview?template=${exp.id}&eventType=ENGAGEMENT`);
    assert(res.status === 200, `/preview?template=${exp.id} returned HTTP 200`);
    const html = await res.text();
    assert(html.includes(exp.nameAr), `/preview contains template name: ${exp.nameAr}`);
    assert(html.includes("حفل خطوبة مبارك"), `/preview adapts occasion header to: "حفل خطوبة مبارك"`);
  }

  // 4. Test Event Creation with one of the new engagement templates
  console.log("\nTest 4: Creating new Engagement Event using 'engagement-royal'...");
  const eventPayload = {
    title: "حفل خطوبة كريم وسلمى الملكي",
    eventType: "ENGAGEMENT",
    groomName: "كريم الألفي",
    brideName: "سلمى المنصوري",
    eventDate: new Date(Date.now() + 86400000 * 20).toISOString(),
    venueName: "قصر البارون إمبان - حديقة القصر",
    address: "مصر الجديدة، القاهرة",
    templateId: "engagement-royal",
    packageTier: "LUXURY",
    welcomeMessage: "نتشرف بدعوتكم لمشاركتنا فرحة خطوبتنا المباركة وبداية قصة حبنا",
  };

  const email = `engagement_test_${Date.now()}@lahzah.com`;
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      password: "password123456",
      name: "كريم الألفي",
    }),
  });
  assert(regRes.status === 200 || regRes.status === 201, `User registered: ${email}`);
  const cookie = regRes.headers.get("set-cookie") || "";

  const createRes = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify(eventPayload),
  });

  assert(createRes.status === 201, `Engagement event created successfully with HTTP 201`);
  const createdEvent = await createRes.json();
  assert(createdEvent.event?.templateId === "engagement-royal", `Saved templateId is 'engagement-royal'`);
  assert(createdEvent.event?.eventType === "ENGAGEMENT", `Saved eventType is 'ENGAGEMENT'`);

  // 5. Test Homepage filter displays engagement templates
  console.log("\nTest 5: Checking Homepage filter contains engagement templates...");
  const homeRes = await fetch(`${BASE_URL}/`);
  assert(homeRes.status === 200, `Homepage responded with HTTP 200`);
  const homeHtml = await homeRes.text();
  assert(homeHtml.includes("خطوبة"), `Homepage includes 'خطوبة' filter pill`);
  assert(homeHtml.includes("الرومانسي المخملي"), `Homepage rendered 'الرومانسي المخملي'`);
  assert(homeHtml.includes("الخطوبة الملكية"), `Homepage rendered 'الخطوبة الملكية'`);

  console.log("\n==================================================");
  if (failed === 0) {
    console.log(`🎉 ALL ${passed} ENGAGEMENT TEMPLATE TESTS PASSED 100%!`);
    console.log("==================================================");
    process.exitCode = 0;
  } else {
    console.error(`❌ ${failed} TESTS FAILED! (${passed} passed)`);
    console.log("==================================================");
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error("Test runner crashed:", e);
  process.exitCode = 1;
});
