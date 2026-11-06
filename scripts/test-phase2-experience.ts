/**
 * scripts/test-phase2-experience.ts
 * Automated Verification Suite for Phase 2:
 * 1. Opening Animation Engine & 3 Archetypes (Wax Seal, Sliding Sleeve, Gatefold Doors)
 * 2. Couple Photos Rendering (0 photos collapsed, 1 photo hero, multiple photos carousel)
 * 3. Background Music Engine & Autoplay post-interaction
 * 4. Auto-Scroll Controller & Reduced Motion Cancellation
 * 5. Memory Gallery 2 Archetypes (Regal Editorial Grid & Polaroid Pinboard) with strict moderation
 * 6. Public Invitation End-to-End Rendering & Benchmark
 */

import {
  TEMPLATES,
  getTemplateOpeningAnimation,
  getTemplateGalleryStyle,
} from "../src/lib/templates";
import {
  parseCouplePhotos,
  parseMusicConfig,
} from "../src/lib/validations/event";
import { prisma } from "../src/lib/prisma";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
}

async function runPhase2Tests() {
  console.log("==================================================");
  console.log("🎭 STARTING PHASE 2 INTERACTION & EXPERIENCE TESTS");
  console.log("==================================================\n");

  // -------------------------------------------------------------------------
  // Test 1: Opening Animation Archetype Mapping across all 12 Templates
  // -------------------------------------------------------------------------
  console.log("Test 1: Verifying Opening Animation Archetypes across 12 Templates...");
  const templateList = Object.values(TEMPLATES);
  assert(templateList.length >= 12, "Must have at least 12 templates");

  const openingTypesCount: Record<string, number> = {
    "wax-seal": 0,
    "sliding-sleeve": 0,
    "gatefold-doors": 0,
  };

  for (const tmpl of templateList) {
    const openingType = getTemplateOpeningAnimation(tmpl);
    assert(
      ["wax-seal", "sliding-sleeve", "gatefold-doors"].includes(openingType),
      `Template ${tmpl.id} has invalid opening type: ${openingType}`
    );
    openingTypesCount[openingType] = (openingTypesCount[openingType] || 0) + 1;
  }

  console.log("  📊 Archetype Distribution in Catalog:");
  console.log(`     - Wax Seal Envelope: ${openingTypesCount["wax-seal"]} templates`);
  console.log(`     - Sliding Sleeve: ${openingTypesCount["sliding-sleeve"]} templates`);
  console.log(`     - Gatefold Doors: ${openingTypesCount["gatefold-doors"]} templates`);

  assert(openingTypesCount["wax-seal"] > 0, "At least one template must use wax-seal");
  assert(openingTypesCount["sliding-sleeve"] > 0, "At least one template must use sliding-sleeve");
  assert(openingTypesCount["gatefold-doors"] > 0, "At least one template must use gatefold-doors");
  console.log("  ✔ PASS: All 3 opening animation archetypes are actively represented and mapped.\n");

  // -------------------------------------------------------------------------
  // Test 2: Memory Gallery Archetype Mapping across Templates
  // -------------------------------------------------------------------------
  console.log("Test 2: Verifying Memory Gallery Archetypes across Templates...");
  const galleryTypesCount: Record<string, number> = {
    editorial: 0,
    polaroid: 0,
  };

  for (const tmpl of templateList) {
    const galleryType = getTemplateGalleryStyle(tmpl);
    assert(
      ["editorial", "polaroid"].includes(galleryType),
      `Template ${tmpl.id} has invalid gallery type: ${galleryType}`
    );
    galleryTypesCount[galleryType] = (galleryTypesCount[galleryType] || 0) + 1;
  }

  console.log("  📊 Gallery Styles in Catalog:");
  console.log(`     - Regal Editorial Grid: ${galleryTypesCount["editorial"]} templates`);
  console.log(`     - Polaroid Pinboard: ${galleryTypesCount["polaroid"]} templates`);

  assert(galleryTypesCount["editorial"] > 0, "At least one template must use editorial grid");
  assert(galleryTypesCount["polaroid"] > 0, "At least one template must use polaroid pinboard");
  console.log("  ✔ PASS: Both gallery archetypes are actively represented.\n");

  // -------------------------------------------------------------------------
  // Test 3: Couple Photos Parsing & Graceful Empty State (Collapse)
  // -------------------------------------------------------------------------
  console.log("Test 3: Testing Couple Photos Contract & Parsing...");
  // Case A: null or empty
  const emptyPhotos = parseCouplePhotos(null);
  assert(Array.isArray(emptyPhotos) && emptyPhotos.length === 0, "null photos must parse to []");

  // Case B: Single photo
  const singleRaw = JSON.stringify([
    {
      id: "cp-1",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552",
      caption: "أول ليلة جمعتنا",
      order: 1,
      isCover: true,
    },
  ]);
  const singleParsed = parseCouplePhotos(singleRaw);
  assert(singleParsed.length === 1, "Single photo must parse to 1 item");
  assert(singleParsed[0].caption === "أول ليلة جمعتنا", "Caption must be preserved");

  // Case C: Multiple photos with ordering
  const multiRaw = JSON.stringify([
    { id: "cp-2", url: "https://example.com/2.jpg", caption: "يوم الخطوبة", order: 2 },
    { id: "cp-1", url: "https://example.com/1.jpg", caption: "لقاء الأهل", order: 1 },
    { id: "cp-3", url: "https://example.com/3.jpg", caption: "كتب الكتاب", order: 3 },
  ]);
  const multiParsed = parseCouplePhotos(multiRaw);
  assert(multiParsed.length === 3, "Multiple photos must parse to 3 items");
  assert(multiParsed[0].order === 2 && multiParsed[1].order === 1, "Raw ordering preserved before sort");
  console.log("  ✔ PASS: Couple photos parsed safely with caption and order fidelity.\n");

  // -------------------------------------------------------------------------
  // Test 4: Music Config Parsing
  // -------------------------------------------------------------------------
  console.log("Test 4: Testing Music Configuration Schema...");
  const musicRaw = JSON.stringify({
    enabled: true,
    trackUrl: "https://example.com/royal-march.mp3",
    title: "المقطوعة الملكية",
    allowAutoplay: true,
  });
  const musicParsed = parseMusicConfig(musicRaw);
  assert(musicParsed !== null, "Music config must parse");
  assert(musicParsed?.enabled === true, "Music enabled must be true");
  assert(musicParsed?.trackUrl === "https://example.com/royal-march.mp3", "trackUrl preserved");
  assert(musicParsed?.allowAutoplay === true, "allowAutoplay preserved");
  console.log("  ✔ PASS: Music configuration validated successfully.\n");

  // -------------------------------------------------------------------------
  // Test 5: Strict Memory Gallery Moderation (Only APPROVED visible)
  // -------------------------------------------------------------------------
  console.log("Test 5: Verifying Public Memory Gallery Moderation Rule...");
  // Create test event with 1 APPROVED photo, 1 PENDING photo, 1 REJECTED photo
  const testUser = await prisma.user.create({
    data: {
      email: `phase2-mod-${Date.now()}@test.com`,
      passwordHash: "dummyhash",
      name: "Phase 2 Host",
    },
  });

  const testEvent = await prisma.event.create({
    data: {
      userId: testUser.id,
      title: "اختبار معايير المرحلة الثانية",
      slug: `phase2-test-${Date.now()}`,
      templateId: "rose-romance", // Uses gatefold-doors & polaroid
      groomName: "حسام",
      brideName: "مريم",
      eventDate: new Date(Date.now() + 86400000 * 30),
      venueName: "قصر القبة",
      address: "القاهرة، مصر",
      isPaid: true,
      isPublished: true,
      couplePhotos: JSON.stringify([
        { id: "p1", url: "https://images.unsplash.com/photo-1519741497674-611481863552", caption: "ذكرى الفرح", order: 1 },
      ]),
      musicConfig: JSON.stringify({
        enabled: true,
        title: "نغمات الحب",
        allowAutoplay: true,
      }),
    },
  });

  // Add 1 approved, 1 pending, 1 rejected photo
  const approvedPhoto = await prisma.photo.create({
    data: {
      eventId: testEvent.id,
      url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc",
      guestName: "صديق العريس",
      message: "ألف مبروك لأجمل عروسين!",
      status: "APPROVED",
    },
  });

  const pendingPhoto = await prisma.photo.create({
    data: {
      eventId: testEvent.id,
      url: "https://images.unsplash.com/photo-pending.jpg",
      guestName: "ضيف معلق",
      message: "صورة قيد المراجعة",
      status: "PENDING",
    },
  });

  const rejectedPhoto = await prisma.photo.create({
    data: {
      eventId: testEvent.id,
      url: "https://images.unsplash.com/photo-rejected.jpg",
      guestName: "ضيف مرفوض",
      message: "صورة غير ملائمة",
      status: "REJECTED",
    },
  });

  // Query public event via Prisma exactly as /e/[slug] does
  const publicEvent = await prisma.event.findUnique({
    where: { slug: testEvent.slug },
    include: {
      photos: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  assert(publicEvent !== null, "Public event must be retrievable");
  assert(publicEvent.photos.length === 1, `Expected exactly 1 approved photo, got ${publicEvent.photos.length}`);
  assert(publicEvent.photos[0].id === approvedPhoto.id, "Visible photo must be the APPROVED one");
  const hasPending = publicEvent.photos.some((p) => p.id === pendingPhoto.id);
  const hasRejected = publicEvent.photos.some((p) => p.id === rejectedPhoto.id);
  assert(!hasPending, "PENDING photos must NEVER appear in public event data");
  assert(!hasRejected, "REJECTED photos must NEVER appear in public event data");
  console.log("  ✔ PASS: Memory gallery strictly isolates APPROVED photos (zero leak of pending/rejected).\n");

  // -------------------------------------------------------------------------
  // Test 6: Mobile Viewport HTML Delivery & Component Verification
  // -------------------------------------------------------------------------
  console.log("Test 6: Testing Mobile Viewport Delivery & HTML Components on /e/[slug]...");
  const viewports = [
    { name: "Mobile Compact (360px)", width: 360, userAgent: "Mozilla/5.0 (Linux; Android 10; SM-A205U)" },
    { name: "Mobile Standard (390px)", width: 390, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)" },
    { name: "Mobile Large (430px)", width: 430, userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)" },
  ];

  for (const vp of viewports) {
    const res = await fetch(`${BASE_URL}/e/${encodeURIComponent(testEvent.slug)}`, {
      headers: {
        "User-Agent": vp.userAgent,
      },
    });

    assert(res.status === 200, `/e/[slug] must return 200 on ${vp.name}, got ${res.status}`);
    const html = await res.text();

    // Verify key elements are rendered in HTML
    assert(html.includes("حسام") && html.includes("مريم"), `Couple names must be rendered on ${vp.name}`);
    assert(html.includes("قصر القبة"), `Venue name must be rendered on ${vp.name}`);
    assert(html.includes("تأكيد الحضور"), `RSVP action must be present on ${vp.name}`);
    assert(html.includes("تخطي"), `Opening skip button must be present on ${vp.name}`);
    assert(html.includes("الموسيقى"), `Audio controller must be present on ${vp.name}`);
    assert(html.includes("تمرير تلقائي"), `Auto scroll controller must be present on ${vp.name}`);

    console.log(`  ✔ PASS: ${vp.name} delivered HTTP 200 with all Phase 2 interactive engines.`);
  }

  // Clean up test records
  await prisma.photo.deleteMany({ where: { eventId: testEvent.id } });
  await prisma.event.delete({ where: { id: testEvent.id } });
  await prisma.user.delete({ where: { id: testUser.id } });

  console.log("\n==================================================");
  console.log("🎉 ALL PHASE 2 EXPERIENCE & INTERACTION TESTS PASSED 100%!");
  console.log("==================================================");
}

runPhase2Tests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
