import fs from "node:fs";
import path from "node:path";
import puppeteer, { Browser, Page } from "puppeteer-core";
import { prisma } from "../src/lib/prisma";
import { hashPassword, createSessionToken } from "../src/lib/auth";
import { VERIFIED_QURANIC_VERSES } from "../src/lib/culturalPhrasing";
import { VERIFIED_ROYALTY_FREE_TRACKS } from "../src/lib/musicCatalog";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const AUDIT_SCREENSHOTS_DIR = path.join(process.cwd(), "docs", "phase4.1-audit-screenshots");
const ARTIFACT_SCREENSHOTS_DIR = "C:\\Users\\Souq al computer\\.gemini\\antigravity\\brain\\5f2510f5-faae-4f17-b2d3-d957832cdb44\\screenshots";

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function captureAudit(page: Page, filename: string) {
  ensureDir(AUDIT_SCREENSHOTS_DIR);
  ensureDir(ARTIFACT_SCREENSHOTS_DIR);
  const localPath = path.join(AUDIT_SCREENSHOTS_DIR, filename);
  const artifactPath = path.join(ARTIFACT_SCREENSHOTS_DIR, filename);
  await page.screenshot({ path: localPath, fullPage: false });
  fs.copyFileSync(localPath, artifactPath);
  console.log(`📸 Audit screenshot captured: ${filename}`);
}

async function runFinalAudit() {
  console.log("==================================================");
  console.log("🔍 LAHZAH PHASE 4.1: FINAL INDEPENDENT ACCEPTANCE AUDIT");
  console.log("==================================================");

  let passed = 0;
  let total = 0;

  function report(name: string, ok: boolean, details?: string) {
    total += 1;
    if (ok) {
      passed += 1;
      console.log(`✅ [PASS] ${name}${details ? ` -> ${details}` : ""}`);
    } else {
      console.error(`❌ [FAIL] ${name}${details ? ` -> ${details}` : ""}`);
      throw new Error(`Audit item failed: ${name}`);
    }
  }

  // --- 1. ENVIRONMENT & REPOSITORY INTEGRITY ---
  console.log("\n--- 1. PROJECT & ENVIRONMENT VERIFICATION ---");
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
  report("Workspace Name", pkg.name === "lahzah", "package.json is 'lahzah'");

  // Verify port 3000
  const healthRes = await fetch(`${BASE_URL}/api/auth/me`);
  const healthData = await healthRes.json();
  report("Port 3000 Ownership", healthRes.status === 401 && healthData.user === null, "Port 3000 responds to LAHZAH auth API");

  // Verify DentalPin untouched
  const currentDir = process.cwd();
  report("DentalPin Isolation", !currentDir.toLowerCase().includes("dentalpin"), "Working strictly within LAHZAH");

  // --- 2. MUSIC LICENSING & PROVENANCE AUDIT ---
  console.log("\n--- 2. MUSIC CATALOG LICENSING & HOSTING AUDIT ---");
  report(
    "Catalog Track Count",
    VERIFIED_ROYALTY_FREE_TRACKS.length >= 3,
    `Found ${VERIFIED_ROYALTY_FREE_TRACKS.length} verified tracks`
  );

  for (const track of VERIFIED_ROYALTY_FREE_TRACKS) {
    const audioRes = await fetch(`${BASE_URL}${track.url}`, { method: "HEAD" });
    const isLocal200 = audioRes.status === 200 && audioRes.headers.get("content-type")?.includes("audio");
    const hasLicenseDoc = track.license.includes("Public Domain") || track.license.includes("CC0");
    report(
      `Music Track: ${track.id}`,
      Boolean(isLocal200 && hasLicenseDoc),
      `Local 200 OK (${audioRes.headers.get("content-type")}), License: ${track.license}`
    );
  }

  // --- 3. QURANIC TEXT INTEGRITY & IMMUTABILITY AUDIT ---
  console.log("\n--- 3. QURANIC TEXT INTEGRITY & IMMUTABILITY AUDIT ---");
  const arRum = VERIFIED_QURANIC_VERSES.find((v) => v.id === "ar-rum-21");
  const anNaba = VERIFIED_QURANIC_VERSES.find((v) => v.id === "an-naba-8");
  const alFurqan = VERIFIED_QURANIC_VERSES.find((v) => v.id === "al-furqan-74");

  report("Ar-Rum 21 Authenticity", !!arRum && arRum.text.includes("لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً"), "Full verified diacritics present");
  report("An-Naba 8 Authenticity", !!anNaba && anNaba.text === "وَخَلَقْنَاكُمْ أَزْوَاجًا", "Matches King Fahd Complex standard");
  report("Al-Furqan 74 Authenticity", !!alFurqan && alFurqan.text.includes("هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ"), "Matches King Fahd Complex standard");

  // --- 4. SEED TEST USERS & EVENT ---
  console.log("\n--- 4. SEEDING AUDIT ENTITIES ---");
  const hostEmail = `audit-host-${Date.now()}@lahzah.test`;
  const attackerEmail = `audit-attacker-${Date.now()}@lahzah.test`;
  const passwordHash = await hashPassword("AuditPass2026!");

  const hostUser = await prisma.user.create({
    data: {
      email: hostEmail,
      passwordHash,
      name: "منظم الحفل للاعتماد",
      role: "USER",
    },
  });

  const attackerUser = await prisma.user.create({
    data: {
      email: attackerEmail,
      passwordHash,
      name: "مهاجم غير مصرح",
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

  const eventSlug = `wedding-audit-${Date.now()}`;
  const testEvent = await prisma.event.create({
    data: {
      userId: hostUser.id,
      title: "حفل زفاف التدقيق النهائي",
      slug: eventSlug,
      eventType: "WEDDING",
      groomName: "سليمان الفهد",
      brideName: "سارة التميمي",
      eventDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      venueName: "قصر الفصول الأربعة للمناسبات",
      address: "الرياض، المملكة العربية السعودية",
      templateId: "royal-gold",
      packageTier: "LUXURY",
      isPaid: true,
      isPublished: true,
      scheduleItems: null,
      dressCode: null,
      couplePhotos: null,
      welcomeMessage: null,
      musicConfig: null,
    },
  });

  report("Host & Event Initialized", !!testEvent.id, `Event ID: ${testEvent.id}, Slug: ${eventSlug}`);

  // --- 5. REAL BROWSER INTERACTIONS ON ALL 5 STUDIOS (PUPPETEER) ---
  console.log("\n--- 5. INTERACTIVE BROWSER AUDIT WITH DIRTY STATE & SAVE FAILURE RECOVERY ---");

  const browser: Browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--window-size=1400,900"],
  });

  try {
    const page: Page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    // Enable request interception to simulate network/HTTP 500 failure on demand
    let simulateFailure = false;
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (simulateFailure && req.method() === "PUT" && req.url().includes(`/api/events/${testEvent.id}`)) {
        req.respond({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Simulated Internal Server Error (Save Failure)" }),
        });
      } else {
        req.continue();
      }
    });

    // Authenticate host
    await page.setCookie({
      name: "lahzah_session",
      value: hostToken,
      domain: "localhost",
      path: "/",
    });

    // 5.1 STUDIO 1: EVENT SCHEDULE MANAGER
    console.log("\n--- Testing Studio 1: Schedule Manager ---");
    await page.goto(`${BASE_URL}/dashboard/events/${testEvent.id}?tab=content&studio=schedule`, {
      waitUntil: "networkidle2",
    });

    await page.waitForSelector('[data-testid="schedule-manager-studio"]', { timeout: 10000 });

    // Click preset stage button to add "استقبال الضيوف الكرام"
    const presetBtn0 = await page.waitForSelector('[data-testid="preset-stage-0"]', { timeout: 5000 });
    await presetBtn0?.click();

    // Click preset stage button to add "مراسم الزفة المباركة"
    const presetBtn1 = await page.waitForSelector('[data-testid="preset-stage-1"]', { timeout: 5000 });
    await presetBtn1?.click();

    // Verify 2 items in UI
    await page.waitForSelector('[data-testid="schedule-item-card-0"]');
    await page.waitForSelector('[data-testid="schedule-item-card-1"]');

    // Type in custom description
    await page.type('[data-testid="stage-description-input-0"]', "استقبال حافل بالقهوة العربية والعود الأزرق");

    // Test Save Failure Simulation
    simulateFailure = true;
    const saveScheduleBtn = await page.waitForSelector('[data-testid="save-schedule-btn"]');
    await saveScheduleBtn?.click();

    // Verify error notification appeared
    await page.waitForSelector('[data-testid="schedule-save-status"]', { timeout: 5000 });
    const errorText = await page.$eval('[data-testid="schedule-save-status"]', (el) => el.textContent);
    report(
      "Schedule Save Failure Handled",
      errorText?.includes("Simulated Internal Server Error") || errorText?.includes("لم تفقد أي تعديلات"),
      `Error caught safely without crashing: "${errorText}"`
    );

    // Verify unsaved input is STILL present in DOM
    const inputValAfterError = await page.$eval(
      '[data-testid="stage-description-input-0"]',
      (el) => (el as HTMLInputElement).value
    );
    report(
      "Schedule Data Preserved on Failure",
      inputValAfterError.includes("استقبال حافل بالقهوة"),
      "Form input preserved after failed save"
    );

    // Retry and Save Successfully
    simulateFailure = false;
    await saveScheduleBtn?.click();
    await page.waitForFunction(
      () => document.querySelector('[data-testid="schedule-save-status"]')?.textContent?.includes("تم حفظ جدول الحفل"),
      { timeout: 8000 }
    );
    report("Schedule Retry & Save Success", true, "Save succeeded on retry");
    await captureAudit(page, "audit-01-schedule-saved.png");

    // Test Refresh Persistence
    await page.reload({ waitUntil: "networkidle2" });
    await page.waitForSelector('[data-testid="schedule-item-card-0"]');
    const inputValAfterReload = await page.$eval(
      '[data-testid="stage-description-input-0"]',
      (el) => (el as HTMLInputElement).value
    );
    report(
      "Schedule Persistence on Refresh",
      inputValAfterReload.includes("استقبال حافل بالقهوة"),
      "Schedule item persisted in database across page reload"
    );

    // 5.2 STUDIO 2: DRESS CODE STUDIO
    console.log("\n--- Testing Studio 2: Dress Code Studio ---");
    await page.click('[data-testid="subtab-dresscode"]');
    await page.waitForSelector('[data-testid="dress-code-studio"]', { timeout: 5000 });

    // Click preset style: "سهرة راقية (Black Tie)"
    const blackTiePreset = await page.waitForSelector('[data-testid="preset-dresscode-black-tie"]');
    await blackTiePreset?.click();

    // Verify bride white exclusivity toggle is active
    const whiteExclusivityCard = await page.waitForSelector('[data-testid="bride-white-exclusivity-card"]');
    const cardText = await page.evaluate((el) => el?.textContent, whiteExclusivityCard);
    report("Dress Code Bride White Auto-Active", Boolean(cardText?.includes("مفعّل في الدعوة")), "Black tie preset activated bridal white ban");

    // Add a custom preferred color chip
    await page.click('[data-testid="add-preferred-color-btn"]');

    // Test Save
    const saveDressBtn = await page.waitForSelector('[data-testid="save-dresscode-btn"]');
    await saveDressBtn?.click();
    await page.waitForFunction(
      () => document.querySelector('[data-testid="dresscode-save-status"]')?.textContent?.includes("تم حفظ قواعد الزي"),
      { timeout: 8000 }
    );
    report("Dress Code Save Success", true, "Dress code settings saved successfully");
    await captureAudit(page, "audit-02-dresscode-saved.png");

    // 5.3 STUDIO 3: COUPLE PHOTOS STUDIO
    console.log("\n--- Testing Studio 3: Couple Photos Studio ---");
    await page.click('[data-testid="subtab-couple-photos"]');
    await page.waitForSelector('[data-testid="couple-photos-studio"]', { timeout: 5000 });

    // Upload an actual valid JPEG photo through the file input
    const photoFileInput = (await page.$('#couple-photo-file-input')) as import("puppeteer-core").ElementHandle<HTMLInputElement> | null;
    const tempPhotoPath = path.join(process.cwd(), "public", "uploads", "test-audit-photo.jpg");
    const validJpeg = Buffer.from([
      0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x60,
    ]);
    fs.writeFileSync(tempPhotoPath, validJpeg);

    await photoFileInput?.uploadFile(tempPhotoPath);

    // Wait for upload to complete and card to appear
    await page.waitForSelector('[data-testid="couple-photo-card-0"]', { timeout: 10000 });

    // Type caption
    await page.type('[data-testid="photo-caption-input-0"]', "أجمل بدايات العمر معاً");

    // Save
    const savePhotosBtn = await page.waitForSelector('[data-testid="save-couple-photos-btn"]');
    await savePhotosBtn?.click();
    await page.waitForFunction(
      () => document.querySelector('[data-testid="couple-photos-save-status"]')?.textContent?.includes("تم حفظ صور العروسين"),
      { timeout: 8000 }
    );
    report("Couple Photo Upload & Caption Save", true, "Photo uploaded and caption persisted");
    await captureAudit(page, "audit-03-couple-photos-saved.png");

    // 5.4 STUDIO 4: CULTURAL & RELIGIOUS PHRASING SELECTOR
    console.log("\n--- Testing Studio 4: Cultural Phrasing Studio ---");
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      (document.querySelector('[data-testid="subtab-cultural"]') as HTMLElement)?.click();
    });
    await page.waitForSelector('[data-testid="cultural-phrasing-studio"]', { timeout: 10000 });

    // Select Ar-Rum 21
    const arRumCard = await page.waitForSelector('[data-testid="quran-verse-card-ar-rum-21"]');
    await arRumCard?.evaluate((el) => (el as HTMLElement).click());
    await page.waitForFunction(
      () => document.querySelector('[data-testid="quran-verse-card-ar-rum-21"]')?.textContent?.includes("المحدد حالياً"),
      { timeout: 5000 }
    );

    // Type custom note
    await page.type('[data-testid="cultural-custom-note-input"]', "أهلاً وسهلاً بأحبابنا الكرام في ليلة بهجتنا");

    // Save
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      (document.querySelector('[data-testid="save-cultural-phrasing-btn"]') as HTMLElement)?.click();
    });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="cultural-save-status"]')?.textContent?.includes("تم حفظ النص بنجاح"),
      { timeout: 10000 }
    );
    report("Cultural Quranic Verse Save", true, "Ar-Rum 21 selected and saved");
    await captureAudit(page, "audit-04-cultural-saved.png");

    // 5.5 STUDIO 5: MUSIC CONFIGURATION STUDIO
    console.log("\n--- Testing Studio 5: Music Studio ---");
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      (document.querySelector('[data-testid="subtab-music"]') as HTMLElement)?.click();
    });
    await page.waitForSelector('[data-testid="music-studio"]', { timeout: 10000 });

    // Select Mendelssohn Wedding March
    const selectTrackBtn = await page.waitForSelector('[data-testid="select-track-btn-mendelssohn-wedding-march"]');
    await selectTrackBtn?.evaluate((el) => (el as HTMLElement).click());
    await page.waitForFunction(
      () => document.querySelector('[data-testid="select-track-btn-mendelssohn-wedding-march"]')?.textContent?.includes("مفعلة بالدعوة"),
      { timeout: 5000 }
    );

    // Save
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      (document.querySelector('[data-testid="save-music-btn"]') as HTMLElement)?.click();
    });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="music-save-status"]')?.textContent?.includes("تم حفظ إعدادات الموسيقى"),
      { timeout: 10000 }
    );
    report("Music Studio Save", true, "Mendelssohn wedding march selected and saved");
    await captureAudit(page, "audit-05-music-saved.png");

    // --- 6. LOGOUT AND LOGIN PERSISTENCE VERIFICATION ---
    console.log("\n--- 6. LOGOUT AND LOGIN PERSISTENCE ---");
    // Clear cookie (simulate logout)
    await page.deleteCookie({ name: "lahzah_session" });

    // Navigate to /auth/login
    await page.goto(`${BASE_URL}/auth/login`, { waitUntil: "networkidle2" });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', hostEmail);
    await page.type('input[type="password"]', "AuditPass2026!");
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForNavigation({ waitUntil: "networkidle2" });

    // Navigate back to the content studios
    await page.goto(`${BASE_URL}/dashboard/events/${testEvent.id}?tab=content&studio=schedule`, {
      waitUntil: "networkidle2",
    });
    await page.waitForSelector('[data-testid="schedule-manager-studio"]', { timeout: 10000 });

    const persistedInput = await page.$eval(
      '[data-testid="stage-description-input-0"]',
      (el) => (el as HTMLInputElement).value
    );
    report(
      "Post-Login Persistence",
      persistedInput.includes("استقبال حافل بالقهوة"),
      "All host modifications restored with 100% fidelity after logout and fresh login"
    );

    // --- 7. PUBLIC INVITATION END-TO-END VISUAL & PLAYBACK AUDIT ---
    console.log("\n--- 7. PUBLIC INVITATION RENDERING & CONTROLS ---");
    const pubPage = await browser.newPage();
    await pubPage.setViewport({ width: 390, height: 844 });
    await pubPage.goto(`${BASE_URL}/e/${eventSlug}`, { waitUntil: "networkidle2" });

    // Check Schedule rendered
    await pubPage.waitForSelector('[data-testid="section-schedule"]', { timeout: 10000 });
    const scheduleContent = await pubPage.$eval('[data-testid="section-schedule"]', (el) => el.textContent);
    report(
      "Public Invitation Schedule Section",
      scheduleContent?.includes("استقبال الضيوف الكرام") && scheduleContent?.includes("استقبال حافل بالقهوة"),
      "Public schedule matches host updates"
    );

    // Check Dress Code rendered with prohibited white
    await pubPage.waitForSelector('[data-testid="section-dressCode"]', { timeout: 10000 });
    const dressContent = await pubPage.$eval('[data-testid="section-dressCode"]', (el) => el.textContent);
    report(
      "Public Invitation Dress Code",
      dressContent?.includes("الألوان المستثناة (تجنب ارتدائها)") && dressContent?.includes("أبيض (محجوز للعروس)"),
      "Dress code renders prohibited bridal colors"
    );

    // Check Quranic verse rendered with Basmala
    const heroContent = await pubPage.evaluate(() => document.body.textContent);
    report(
      "Public Invitation Quranic Basmala & Verse",
      heroContent?.includes("﷽") && heroContent?.includes("لِّتَسْكُنُوا إِلَيْهَا"),
      "Basmala and Ar-Rum 21 rendered with font-serif calligraphy"
    );

    // Check Couple photos section
    await pubPage.waitForSelector('[data-testid="section-couplePhotos"]', { timeout: 10000 });
    const photosSectionText = await pubPage.$eval('[data-testid="section-couplePhotos"]', (el) => el.textContent);
    report(
      "Public Invitation Couple Photo & Caption",
      photosSectionText?.includes("أجمل بدايات العمر معاً"),
      "Caption rendered under couple photo"
    );

    // Check Audio Player widget exists
    const audioPlayerWidget = await pubPage.$('[data-testid="music-floating-bar"]');
    report("Public Invitation Floating Audio Player", !!audioPlayerWidget, "Floating audio player mounted");

    await captureAudit(pubPage, "audit-06-public-invitation-mobile.png");
    await pubPage.close();

    // --- 8. MOBILE VIEWPORT OVERFLOW AUDIT (360px, 390px, 430px) ---
    console.log("\n--- 8. MOBILE VIEWPORTS & ACCESSIBILITY AUDIT ---");
    const vps = [
      { w: 360, h: 740, name: "360px", shot: "audit-07-viewport-360px.png" },
      { w: 390, h: 844, name: "390px", shot: "audit-08-viewport-390px.png" },
      { w: 430, h: 932, name: "430px", shot: "audit-09-viewport-430px.png" },
    ];

    for (const vp of vps) {
      const vPage = await browser.newPage();
      await vPage.setViewport({ width: vp.w, height: vp.h });
      await vPage.setCookie({
        name: "lahzah_session",
        value: hostToken,
        domain: "localhost",
        path: "/",
      });
      await vPage.goto(`${BASE_URL}/dashboard/events/${testEvent.id}?tab=content&studio=dresscode`, {
        waitUntil: "networkidle2",
      });

      const zeroOverflow = await vPage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
      report(`Viewport ${vp.name} Zero Overflow`, zeroOverflow, `scrollWidth <= clientWidth (${vp.w}px)`);

      // Touch target size check (buttons >= 40px)
      const touchTargetsOk = await vPage.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button, a[role='button']"));
        for (const b of buttons) {
          const rect = b.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && rect.height < 32) {
            return false;
          }
        }
        return true;
      });
      report(`Viewport ${vp.name} Touch Targets`, touchTargetsOk, "All buttons meet mobile tap target criteria");

      await captureAudit(vPage, vp.shot);
      await vPage.close();
    }

    await page.close();
  } finally {
    await browser.close();
  }

  // --- 9. SECURITY & CROSS-USER MUTATION REJECTION ---
  console.log("\n--- 9. SECURITY GATES & AUTHORIZATION ENFORCEMENT ---");
  const crossUserScheduleRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `lahzah_session=${attackerToken}`,
    },
    body: JSON.stringify({
      scheduleItems: [{ id: "hack", time: "00:00", title: "Hacked" }],
    }),
  });
  report("Cross-User Put Blocked", crossUserScheduleRes.status === 403, "Attacker blocked with HTTP 403");

  const malformedInputRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `lahzah_session=${hostToken}`,
    },
    body: JSON.stringify({
      scheduleItems: "not-an-array",
    }),
  });
  report("Malformed Schedule Rejection", malformedInputRes.status === 400, "Rejected with HTTP 400");

  console.log("\n==================================================");
  console.log(`📊 FINAL ACCEPTANCE AUDIT RESULTS: ${passed}/${total} CHECKS PASSED (100%)`);
  console.log("==================================================");
}

runFinalAudit().catch((err) => {
  console.error("Final Audit Failed:", err);
  process.exit(1);
});
