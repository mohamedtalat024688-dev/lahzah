import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import puppeteer, { Browser, Page } from "puppeteer-core";
import { prisma } from "../src/lib/prisma";
import { hashPassword, createSessionToken } from "../src/lib/auth";
import { VERIFIED_QURANIC_VERSES, PROPHETIC_DUAAS, CELEBRATION_PHRASES } from "../src/lib/culturalPhrasing";
import { VERIFIED_ROYALTY_FREE_TRACKS } from "../src/lib/musicCatalog";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const SCREENSHOTS_DIR = path.join(process.cwd(), "docs", "phase4.1-screenshots");
const ARTIFACT_SCREENSHOTS_DIR = "C:\\Users\\Souq al computer\\.gemini\\antigravity\\brain\\5f2510f5-faae-4f17-b2d3-d957832cdb44\\screenshots";

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function captureAndSave(page: Page, filename: string) {
  ensureDir(SCREENSHOTS_DIR);
  ensureDir(ARTIFACT_SCREENSHOTS_DIR);
  const localPath = path.join(SCREENSHOTS_DIR, filename);
  const artifactPath = path.join(ARTIFACT_SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`📸 Screenshot captured: ${filename}`);
}

async function runPhase41TestSuite() {
  console.log("==================================================");
  console.log("🏛️ LAHZAH PHASE 4.1: HOST CONTENT STUDIOS TEST SUITE");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function reportCheck(desc: string, ok: boolean, details?: string) {
    total += 1;
    if (ok) {
      passed += 1;
      console.log(`✅ [${desc}] Passed${details ? ` -> ${details}` : ""}`);
    } else {
      console.error(`❌ [${desc}] FAILED${details ? ` -> ${details}` : ""}`);
      throw new Error(`Check failed: ${desc}`);
    }
  }

  // --- 1. PROJECT & REPOSITORY INTEGRITY ---
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
  reportCheck("Project Identity", pkg.name === "lahzah", "Target workspace confirmed as LAHZAH");

  // --- 2. SEED USERS & EVENTS ---
  console.log("\n--- 2. DATABASE INITIALIZATION ---");
  const hostEmail = `host-p41-${Date.now()}@lahzah.test`;
  const attackerEmail = `attacker-p41-${Date.now()}@lahzah.test`;
  const passwordHash = await hashPassword("LahzahSecure2026!");

  const hostUser = await prisma.user.create({
    data: {
      email: hostEmail,
      passwordHash,
      name: "منظم الحفل المعتمد",
      role: "USER",
    },
  });

  const attackerUser = await prisma.user.create({
    data: {
      email: attackerEmail,
      passwordHash,
      name: "مستخدم غير مصرح",
      role: "USER",
    },
  });

  const hostToken = await createSessionToken({
    userId: hostUser.id,
    email: hostUser.email,
    role: "OWNER",
  });

  const attackerToken = await createSessionToken({
    userId: attackerUser.id,
    email: attackerUser.email,
    role: "OWNER",
  });

  const eventSlug = `wedding-p41-${Date.now()}`;
  const testEvent = await prisma.event.create({
    data: {
      userId: hostUser.id,
      title: "حفل زفاف كريم ونور الفاخر",
      slug: eventSlug,
      eventType: "WEDDING",
      groomName: "كريم المنصور",
      brideName: "نور الأحمد",
      eventDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      venueName: "قصر الثريا للمناسبات الكبرى",
      address: "طريق الملك فهد، الرياض",
      templateId: "royal-gold",
      packageTier: "LUXURY",
      isPaid: true,
      isPublished: true,
      sectionsConfig: null,
    },
  });

  reportCheck("Database Setup", !!testEvent.id, `Created test event: ${testEvent.id} (slug: ${eventSlug})`);

  // --- 3. SECURITY & AUTHORIZATION TESTS ---
  console.log("\n--- 3. SECURITY & PHOTO UPLOAD RESTRICTIONS ---");

  // Test 3.1: Attacker cannot upload couple photos to Host's event
  const fakePngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d]);
  const fdAttacker = new FormData();
  fdAttacker.append("file", new Blob([fakePngBuffer], { type: "image/png" }), "couple.png");

  const attackerUploadRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}/couple-photos`, {
    method: "POST",
    headers: {
      Cookie: `lahzah_session=${attackerToken}`,
    },
    body: fdAttacker,
  });
  reportCheck(
    "Photo Upload Authorization",
    attackerUploadRes.status === 403,
    "Attacker strictly blocked with HTTP 403"
  );

  // Test 3.2: Malicious spoofed file rejected with magic bytes check
  const fakeExeBuffer = Buffer.from("MZThisIsAnExecutableNotAnImageFile");
  const fdSpoofed = new FormData();
  fdSpoofed.append("file", new Blob([fakeExeBuffer], { type: "image/png" }), "malicious.png");

  const spoofedUploadRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}/couple-photos`, {
    method: "POST",
    headers: {
      Cookie: `lahzah_session=${hostToken}`,
    },
    body: fdSpoofed,
  });
  reportCheck(
    "Magic Bytes Anti-Spoofing",
    spoofedUploadRes.status === 400,
    "Spoofed executable rejected with HTTP 400"
  );

  // Test 3.3: Legitimate host photo upload succeeds
  const validJpegBuffer = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x60,
  ]);
  const fdValid = new FormData();
  fdValid.append("file", new Blob([validJpegBuffer], { type: "image/jpeg" }), "couple-hero.jpg");
  fdValid.append("caption", "أولى لحظات الفرح في يومنا المشهود");

  const validUploadRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}/couple-photos`, {
    method: "POST",
    headers: {
      Cookie: `lahzah_session=${hostToken}`,
    },
    body: fdValid,
  });
  const validUploadData = await validUploadRes.json();
  reportCheck(
    "Host Photo Upload Success",
    validUploadRes.status === 200 && !!validUploadData.photo?.url,
    `Uploaded file successfully saved to: ${validUploadData.photo?.url}`
  );

  // --- 4. CRUD FOR ALL 5 HOST CONTENT STUDIOS VIA API ---
  console.log("\n--- 4. API PERSISTENCE & DATA INTEGRITY ---");

  // 4.1 Schedule Items
  const sampleSchedule = [
    {
      id: "stage-1",
      time: "08:00 م",
      title: "استقبال الضيوف الكرام بالبخور والعود",
      description: "في بهو القصر الملكي الرئيسي",
      location: "البوابة الشرقية",
      icon: "coffee",
    },
    {
      id: "stage-2",
      time: "09:30 م",
      title: "مراسم الزفة والطلة المباركة",
      description: "زفة تراثية ملكية",
      location: "القاعة الكبرى",
      icon: "sparkles",
    },
    {
      id: "stage-3",
      time: "10:30 م",
      title: "وليمة العشاء الفاخرة",
      description: "بوفيه مفتوح مع أشهى الأطباق التراثية والعالمية",
      location: "صالة الطعام الملكية",
      icon: "utensils",
    },
  ];

  // 4.2 Dress Code (Preferred + Prohibited)
  const sampleDressCode = {
    title: "الزي الرسمي الفاخر (Black Tie / ثوب وبشت)",
    description: "يسعدنا حضوركم وتشريفكم بأبهى حلة تليق بهذه المناسبة السعيدة.",
    preferredColors: ["#1C1B1A", "#1B2A4A", "#D4AF37", "#5C131D"],
    prohibitedColors: ["#FFFFFF", "#FAF8F5", "#FF0000"],
    imageUrl: null,
  };

  // 4.3 Couple Photos
  const sampleCouplePhotos = [
    {
      id: validUploadData.photo.id,
      url: validUploadData.photo.url,
      caption: "أولى لحظات الفرح في يومنا المشهود",
      order: 0,
      isCover: true,
    },
    {
      id: "photo-sample-2",
      url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      caption: "خطواتنا الأولى نحو الغد",
      order: 1,
      isCover: false,
    },
  ];

  // 4.4 Cultural Phrasing (Immutable Quranic verse)
  const quranVerse = VERIFIED_QURANIC_VERSES[0]; // Ar-Rum 21
  const sampleCulturalPhrasing = JSON.stringify({
    type: "quran",
    presetId: quranVerse.id,
    text: quranVerse.text,
    sourceLabel: `${quranVerse.surah} - الآية ${quranVerse.ayahNumber}`,
    customNote: "نسعد بحضوركم وتشريفكم الكريم ليلة فرحنا",
  });

  // 4.5 Music Configuration (Verified Royalty-Free Track)
  const royaltyFreeTrack = VERIFIED_ROYALTY_FREE_TRACKS[0];
  const sampleMusicConfig = {
    enabled: true,
    trackUrl: royaltyFreeTrack.url,
    title: royaltyFreeTrack.title,
    allowAutoplay: true,
  };

  // Execute Host Update via PUT /api/events/[id]
  const updateRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `lahzah_session=${hostToken}`,
    },
    body: JSON.stringify({
      scheduleItems: sampleSchedule,
      dressCode: sampleDressCode,
      couplePhotos: sampleCouplePhotos,
      welcomeMessage: sampleCulturalPhrasing,
      musicConfig: sampleMusicConfig,
    }),
  });

  const updateData = await updateRes.json();
  reportCheck("Host Content API Save", updateRes.status === 200 && updateData.success === true, "PUT /api/events/[id] updated successfully");

  // Verify DB Persistence via GET /api/events/[id]
  const getEventRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    headers: {
      Cookie: `lahzah_session=${hostToken}`,
    },
  });
  const getEventData = await getEventRes.json();
  const dbEvent = getEventData.event;

  reportCheck(
    "Schedule Persistence",
    dbEvent.parsedScheduleItems?.length === 3 && dbEvent.parsedScheduleItems[1].icon === "sparkles",
    `Saved 3 schedule items with icon '${dbEvent.parsedScheduleItems?.[1]?.icon}'`
  );

  reportCheck(
    "Dress Code Prohibited Colors",
    dbEvent.parsedDressCode?.prohibitedColors?.includes("#FFFFFF") &&
      dbEvent.parsedDressCode?.prohibitedColors?.includes("#FAF8F5"),
    "Prohibited bridal colors preserved (#FFFFFF, #FAF8F5)"
  );

  reportCheck(
    "Couple Photos Persistence",
    dbEvent.parsedCouplePhotos?.length === 2 && dbEvent.parsedCouplePhotos[0].isCover === true,
    "Couple photos preserved with cover photo flag"
  );

  reportCheck(
    "Immutable Quranic Verse Integrity",
    dbEvent.welcomeMessage?.includes(quranVerse.text),
    "Ar-Rum 21 verified with full diacritics"
  );

  reportCheck(
    "Music Configuration Persistence",
    dbEvent.parsedMusicConfig?.trackUrl === royaltyFreeTrack.url && dbEvent.parsedMusicConfig?.allowAutoplay === true,
    `Music configured with track: ${royaltyFreeTrack.title}`
  );

  // --- 5. PUBLIC INVITATION END-TO-END RENDERING (/e/[slug]) ---
  console.log("\n--- 5. PUBLIC INVITATION RENDERING (/e/[slug]) ---");
  const publicRes = await fetch(`${BASE_URL}/e/${eventSlug}`);
  const publicHtml = await publicRes.text();

  reportCheck("Public Invitation HTTP 200", publicRes.status === 200, `/e/${eventSlug} loaded successfully`);
  reportCheck(
    "Public Schedule Rendering",
    publicHtml.includes("جدول أوقات الفرح") && publicHtml.includes("مراسم الزفة والطلة المباركة"),
    "Schedule section rendered on public invitation"
  );
  reportCheck(
    "Public Prohibited Colors Rendering",
    publicHtml.includes("الألوان المستثناة (تجنب ارتدائها)") && publicHtml.includes("أبيض (محجوز للعروس)"),
    "Dress code section displays prohibited bridal colors clearly"
  );
  reportCheck(
    "Public Quranic Verse Calligraphy",
    publicHtml.includes("﷽") && publicHtml.includes(quranVerse.text),
    "Public invitation displays Basmala and verified Quranic text"
  );

  // --- 6. BACKWARD COMPATIBILITY WITH LEGACY EVENTS (NULL FIELDS) ---
  console.log("\n--- 6. BACKWARD COMPATIBILITY WITH LEGACY EVENTS ---");
  const legacySlug = `legacy-event-${Date.now()}`;
  const legacyEvent = await prisma.event.create({
    data: {
      userId: hostUser.id,
      title: "مناسبة قديمة تجريبية",
      slug: legacySlug,
      eventType: "WEDDING",
      groomName: "سالم",
      brideName: "منى",
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      venueName: "قاعة ريماس",
      address: "جدة",
      templateId: "ivory-minimal",
      packageTier: "BASIC",
      isPaid: true,
      isPublished: true,
      welcomeMessage: "أهلاً وسهلاً بالجميع في حفلنا المبارك", // Legacy plain string
      scheduleItems: null,
      dressCode: null,
      couplePhotos: null,
      musicConfig: null,
      sectionsConfig: null,
    },
  });

  const legacyPublicRes = await fetch(`${BASE_URL}/e/${legacySlug}`);
  const legacyPublicHtml = await legacyPublicRes.text();

  reportCheck(
    "Legacy Event Zero Crash",
    legacyPublicRes.status === 200,
    "Legacy event with null fields rendered cleanly without error"
  );
  reportCheck(
    "Legacy Welcome Message Backward Compatibility",
    legacyPublicHtml.includes("أهلاً وسهلاً بالجميع في حفلنا المبارك"),
    "Legacy plain welcome message string rendered properly"
  );

  // --- 7. PUPPETEER HEADLESS CHROME VISUAL REVIEW & VIEWPORTS ---
  console.log("\n--- 7. HEADLESS BROWSER AUDIT & SCREENSHOT CAPTURE ---");
  const browser: Browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  });

  try {
    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Set authentication cookie
    await page.setCookie({
      name: "lahzah_session",
      value: hostToken,
      domain: "localhost",
      path: "/",
      httpOnly: false,
      secure: false,
    });

    // Navigate to event dashboard Content tab
    const targetUrl = `${BASE_URL}/dashboard/events/${testEvent.id}?tab=content`;
    console.log(`Navigating to: ${targetUrl}`);
    await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 30000 });

    // 7.1 Verify Content Hub container
    await page.waitForSelector('[data-testid="content-studios-hub"]', { timeout: 10000 });
    reportCheck("Content Hub Mounted", true, "Found [data-testid='content-studios-hub']");

    // 7.2 Screenshot: Schedule Studio
    await page.waitForSelector('[data-testid="schedule-manager-studio"]', { timeout: 10000 });
    await captureAndSave(page, "01-host-schedule-studio-desktop.png");

    // 7.3 Switch to Dress Code Studio
    await page.click('[data-testid="subtab-dresscode"]');
    await page.waitForSelector('[data-testid="dress-code-studio"]', { timeout: 5000 });
    await captureAndSave(page, "02-host-dresscode-studio-desktop.png");

    // Test Bride White toggle in UI
    const whiteToggleBtn = await page.$('[data-testid="toggle-bride-white-btn"]');
    reportCheck("Dress Code White Ban Toggle", !!whiteToggleBtn, "Found toggle-bride-white-btn");

    // 7.4 Switch to Couple Photos Studio
    await page.click('[data-testid="subtab-couple-photos"]');
    await page.waitForSelector('[data-testid="couple-photos-studio"]', { timeout: 5000 });
    await captureAndSave(page, "03-host-couple-photos-studio-desktop.png");

    // 7.5 Switch to Cultural & Quranic Selector Studio
    await page.click('[data-testid="subtab-cultural"]');
    await page.waitForSelector('[data-testid="cultural-phrasing-studio"]', { timeout: 5000 });
    await captureAndSave(page, "04-host-cultural-quran-studio-desktop.png");

    // 7.6 Switch to Music Studio
    await page.click('[data-testid="subtab-music"]');
    await page.waitForSelector('[data-testid="music-studio"]', { timeout: 5000 });
    await captureAndSave(page, "05-host-music-studio-desktop.png");

    // 7.7 Responsive Viewports (360px, 390px, 430px)
    const viewports = [
      { width: 360, height: 740, name: "360px", shot: "06-host-studios-viewport-360px.png" },
      { width: 390, height: 844, name: "390px", shot: "07-host-studios-viewport-390px.png" },
      { width: 430, height: 932, name: "430px", shot: "08-host-studios-viewport-430px.png" },
    ];

    for (const vp of viewports) {
      const vpPage = await browser.newPage();
      await vpPage.setViewport({ width: vp.width, height: vp.height });
      await vpPage.setCookie({
        name: "lahzah_session",
        value: hostToken,
        domain: "localhost",
        path: "/",
      });
      await vpPage.goto(`${BASE_URL}/dashboard/events/${testEvent.id}?tab=content&studio=dresscode`, {
        waitUntil: "networkidle2",
      });

      const overflow = await vpPage.evaluate(() => {
        return document.documentElement.scrollWidth <= window.innerWidth;
      });
      reportCheck(`Mobile Viewport ${vp.name}`, overflow, `Zero horizontal overflow at ${vp.width}px`);
      await captureAndSave(vpPage, vp.shot);
      await vpPage.close();
    }

    // 7.8 Public Invitation Screenshot
    const pubPage = await browser.newPage();
    await pubPage.setViewport({ width: 390, height: 844 });
    await pubPage.goto(`${BASE_URL}/e/${eventSlug}`, { waitUntil: "networkidle2" });
    await captureAndSave(pubPage, "09-public-invitation-p41-mobile.png");
    await pubPage.close();

    await page.close();
  } finally {
    await browser.close();
  }

  console.log("\n==================================================");
  console.log(`📊 PHASE 4.1 TEST SUMMARY: ${passed}/${total} CHECKS PASSED (100%)`);
  console.log("==================================================");
}

runPhase41TestSuite().catch((err) => {
  console.error("Test Suite Execution Failed:", err);
  process.exit(1);
});
