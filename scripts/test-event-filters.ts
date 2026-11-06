import {
  TEMPLATES,
  EVENT_TYPES,
  getTemplatesByEventType,
  getTemplateCountsByEventType,
  getEventTypeLabel,
} from "../src/lib/templates";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function main() {
  console.log("==================================================");
  console.log("🌸 TESTING EVENT OCCASION FILTERS SYSTEM");
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

  // 1. Check EVENT_TYPES definitions
  console.log("\nTest 1: Verifying the 10 Required Event Types in EVENT_TYPES...");
  const expectedTypes = [
    { id: "ALL", labelAr: "جميع المناسبات" },
    { id: "ENGAGEMENT", labelAr: "خطوبة" },
    { id: "FATIHIA", labelAr: "قراءة فاتحة" },
    { id: "KATB_KITAB", labelAr: "كتب كتاب" },
    { id: "WEDDING", labelAr: "زفاف / فرح" },
    { id: "BIRTHDAY", labelAr: "عيد ميلاد" },
    { id: "GRADUATION", labelAr: "تخرج" },
    { id: "SEBOU", labelAr: "سبوع واستقبال مولود" },
    { id: "HENNA", labelAr: "حنة" },
    { id: "OTHER", labelAr: "مناسبات أخرى" },
  ];

  assert(EVENT_TYPES.length === 10, `EVENT_TYPES has exactly 10 categories (found ${EVENT_TYPES.length})`);
  expectedTypes.forEach((expected, index) => {
    const item = EVENT_TYPES[index];
    assert(
      item && item.id === expected.id && item.labelAr === expected.labelAr,
      `Category #${index + 1}: ${expected.id} -> ${expected.labelAr}`
    );
  });

  // 2. Check each template has eventTypes
  console.log("\nTest 2: Verifying every TemplateConfig has explicit eventTypes...");
  const templates = Object.values(TEMPLATES);
  templates.forEach((tmpl) => {
    assert(
      Array.isArray(tmpl.eventTypes) && tmpl.eventTypes.length > 0,
      `Template "${tmpl.nameAr}" (${tmpl.id}) has ${tmpl.eventTypes?.length || 0} event types: [${tmpl.eventTypes?.join(", ")}]`
    );
    // Verify legacy style property is preserved
    assert(!!tmpl.style, `Template "${tmpl.id}" preserves legacy style: "${tmpl.style}"`);
  });

  // 3. Check dynamic counts
  console.log("\nTest 3: Checking dynamic template counts per event type...");
  const counts = getTemplateCountsByEventType();
  assert(counts.ALL === templates.length, `Count for ALL equals total templates (${counts.ALL})`);
  expectedTypes.forEach((evt) => {
    assert(
      typeof counts[evt.id] === "number" && counts[evt.id] >= 0,
      `Count for ${evt.labelAr} (${evt.id}): ${counts[evt.id]} designs`
    );
  });

  // 4. Test filtering logic
  console.log("\nTest 4: Testing getTemplatesByEventType filtering logic...");
  const weddingTemplates = getTemplatesByEventType("WEDDING");
  assert(
    weddingTemplates.every((t) => t.eventTypes.includes("WEDDING")),
    `All returned templates for WEDDING include WEDDING eventType (${weddingTemplates.length} found)`
  );

  const engagementTemplates = getTemplatesByEventType("ENGAGEMENT");
  assert(
    engagementTemplates.every((t) => t.eventTypes.includes("ENGAGEMENT")),
    `All returned templates for ENGAGEMENT include ENGAGEMENT eventType (${engagementTemplates.length} found)`
  );

  const katbKitabTemplates = getTemplatesByEventType("KATB_KITAB");
  assert(
    katbKitabTemplates.every((t) => t.eventTypes.includes("KATB_KITAB")),
    `All returned templates for KATB_KITAB include KATB_KITAB eventType (${katbKitabTemplates.length} found)`
  );

  // 5. Test Ceremony Labels
  console.log("\nTest 5: Testing Arabic Ceremony Labels...");
  assert(getEventTypeLabel("WEDDING") === "حفل زفاف مبارك", "WEDDING label correct");
  assert(getEventTypeLabel("ENGAGEMENT") === "حفل خطوبة مبارك", "ENGAGEMENT label correct");
  assert(getEventTypeLabel("FATIHIA") === "مراسم قراءة الفاتحة المباركة", "FATIHIA label correct");
  assert(getEventTypeLabel("KATB_KITAB") === "مراسم عقد القران وكتب الكتاب", "KATB_KITAB label correct");
  assert(getEventTypeLabel("BIRTHDAY") === "احتفال عيد ميلاد سعيد", "BIRTHDAY label correct");
  assert(getEventTypeLabel("GRADUATION") === "حفل تخرج ومسيرة نجاح", "GRADUATION label correct");
  assert(getEventTypeLabel("SEBOU") === "احتفال سبوع واستقبال مولود مبارك", "SEBOU label correct");
  assert(getEventTypeLabel("HENNA") === "ليلة الحنة المباركة", "HENNA label correct");
  assert(getEventTypeLabel("OTHER") === "دعوة خاصة لمناسبة مميزة", "OTHER label correct");

  // 6. Test Landing Page HTML renders all 10 pills and badges
  console.log("\nTest 6: Testing Landing Page HTML from live server...");
  const res = await fetch(`${BASE_URL}/`);
  assert(res.status === 200, `Landing page responds with HTTP 200`);
  const html = await res.text();

  expectedTypes.forEach((evt) => {
    assert(html.includes(evt.labelAr), `Landing page contains filter pill for: "${evt.labelAr}"`);
  });

  // Verify responsive and styling classes
  assert(html.includes("overflow-x-auto"), `Filter bar contains horizontal scroll container (overflow-x-auto)`);
  assert(html.includes("no-scrollbar"), `Filter bar contains no-scrollbar class for clean mobile appearance`);
  assert(html.includes("#790D20"), `Filter bar contains signature Burgundy #790D20 styling`);

  console.log("\n==================================================");
  if (failed === 0) {
    console.log(`🎉 ALL ${passed} EVENT FILTER TESTS PASSED SUCCESSFULLY!`);
    console.log("==================================================");
    process.exitCode = 0;
  } else {
    console.error(`❌ ${failed} TESTS FAILED! (${passed} passed)`);
    console.log("==================================================");
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("Test runner crashed:", e);
  process.exit(1);
});
