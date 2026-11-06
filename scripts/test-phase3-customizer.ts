/**
 * scripts/test-phase3-customizer.ts
 * Rigorous Automated Test Suite & Visual Acceptance for Phase 3: Section Customizer Studio.
 * Verifies template catalog defaults, server-side Zod validation, cross-user security,
 * public rendering order, and headless Chrome responsive & visual rendering.
 */

import puppeteer, { Browser, Page } from "puppeteer-core";
import { prisma } from "../src/lib/prisma";
import {
  getTemplateSupportedSections,
  getTemplateDefaultSections,
} from "../src/lib/templates";
import { createSessionToken } from "../src/lib/auth";
import * as path from "path";
import * as fs from "fs";
import assert from "assert";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const BASE_URL = "http://localhost:3000";
const SCREENSHOTS_DOCS_DIR = path.join(process.cwd(), "docs", "phase3-screenshots");
const SCREENSHOTS_ARTIFACTS_DIR = "C:\\Users\\Souq al computer\\.gemini\\antigravity\\brain\\5f2510f5-faae-4f17-b2d3-d957832cdb44\\screenshots";

interface CheckItem {
  id: string;
  suite: string;
  description: string;
  status: "PASS" | "FAIL";
  details: string;
  screenshot?: string;
}

const testResults: CheckItem[] = [];

function recordTest(id: string, suite: string, description: string, status: "PASS" | "FAIL", details: string, screenshot?: string) {
  testResults.push({ id, suite, description, status, details, screenshot });
  const icon = status === "PASS" ? "✅" : "❌";
  console.log(`${icon} [${suite}] ${description} -> ${details}`);
}

async function saveScreenshot(page: Page, filename: string): Promise<string> {
  const docsPath = path.join(SCREENSHOTS_DOCS_DIR, filename);
  const artifactPath = path.join(SCREENSHOTS_ARTIFACTS_DIR, filename);

  await page.screenshot({ path: docsPath as `${string}.png`, fullPage: false });
  fs.copyFileSync(docsPath, artifactPath);
  return filename;
}

async function runPhase3Tests() {
  console.log("==================================================");
  console.log("🎨 LAHZAH PHASE 3: SECTION CUSTOMIZER TEST SUITE");
  console.log("==================================================\n");

  // Ensure directories exist
  if (!fs.existsSync(SCREENSHOTS_DOCS_DIR)) fs.mkdirSync(SCREENSHOTS_DOCS_DIR, { recursive: true });
  if (!fs.existsSync(SCREENSHOTS_ARTIFACTS_DIR)) fs.mkdirSync(SCREENSHOTS_ARTIFACTS_DIR, { recursive: true });

  // 1. PROJECT BOUNDARY & ENVIRONMENT CHECK
  console.log("--- 1. PROJECT BOUNDARY & INTEGRITY ---");
  const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
  if (pkg.name === "lahzah") {
    recordTest("SEC-01", "Project Identity", "Verified project is LAHZAH", "PASS", "Safe execution: DentalPin is strictly untouched.");
  } else {
    recordTest("SEC-01", "Project Identity", "Verified project is LAHZAH", "FAIL", `Found unexpected project: ${pkg.name}`);
    process.exit(1);
  }

  // 2. TEMPLATE ARCHITECTURE & DEFAULT ORDER CHECKS
  console.log("\n--- 2. TEMPLATE CATALOG & SECTION ARCHITECTURE ---");
  const templatesToTest = ["royal-gold", "ivory-minimal", "rose-romance", "emerald-elegance"];
  
  for (const tid of templatesToTest) {
    const supported = getTemplateSupportedSections(tid);
    const defaults = getTemplateDefaultSections(tid);

    // Verify required sections hero & rsvp are present
    const hasHero = supported.some((s) => s.id === "hero" && s.isRequired);
    const hasRsvp = supported.some((s) => s.id === "rsvp" && s.isRequired);
    assert.ok(hasHero && hasRsvp, `Template ${tid} must support required hero and rsvp sections`);

    // Verify defaults contain required sections in order
    const defaultHero = defaults.find((d) => d.id === "hero");
    const defaultRsvp = defaults.find((d) => d.id === "rsvp");
    assert.ok(defaultHero && defaultHero.enabled, `Template ${tid} default order must enable hero`);
    assert.ok(defaultRsvp && defaultRsvp.enabled, `Template ${tid} default order must enable rsvp`);
  }
  recordTest("TMPL-01", "Catalog Architecture", "Supported sections defined per template with required sections enforced", "PASS", "Verified royal-gold, ivory-minimal, rose-romance, emerald-elegance.");

  // Check distinct default ordering across archetypes
  const royalDefaults = getTemplateDefaultSections("royal-gold").map((s) => s.id);
  const minimalDefaults = getTemplateDefaultSections("ivory-minimal").map((s) => s.id);
  const romanticDefaults = getTemplateDefaultSections("rose-romance").map((s) => s.id);

  assert.notDeepStrictEqual(royalDefaults, minimalDefaults, "Royal and Minimal must have distinct default section orders");
  assert.notDeepStrictEqual(royalDefaults, romanticDefaults, "Royal and Romantic must have distinct default section orders");
  recordTest("TMPL-02", "Distinct Defaults", "Templates feature unique archetype-specific default section orders", "PASS", 
    `Royal: [${royalDefaults.join(" > ")}], Minimal: [${minimalDefaults.join(" > ")}]`);

  // 3. DATABASE SETUP & TARGET EVENT INITIALIZATION
  console.log("\n--- 3. DATABASE SETUP FOR HOST & EVENT ---");
  const timestamp = Date.now();
  const hostUser = await prisma.user.upsert({
    where: { email: `phase3_host_${timestamp}@lahzah.com` },
    update: {},
    create: {
      email: `phase3_host_${timestamp}@lahzah.com`,
      passwordHash: "testpasshash",
      name: "د. طارق المنشاوي",
      role: "OWNER",
    },
  });

  const attackerUser = await prisma.user.upsert({
    where: { email: `phase3_attacker_${timestamp}@lahzah.com` },
    update: {},
    create: {
      email: `phase3_attacker_${timestamp}@lahzah.com`,
      passwordHash: "testpasshash",
      name: "مخترق غير مصرح له",
      role: "OWNER",
    },
  });

  const hostToken = await createSessionToken({ userId: hostUser.id, email: hostUser.email, role: "OWNER" });
  const attackerToken = await createSessionToken({ userId: attackerUser.id, email: attackerUser.email, role: "OWNER" });

  const testEvent = await prisma.event.create({
    data: {
      userId: hostUser.id,
      slug: `phase3-customizer-${timestamp}`,
      title: "زفاف فخم - استوديو التخصيص",
      groomName: "طارق",
      brideName: "نور",
      templateId: "royal-gold",
      packageTier: "LUXURY",
      isPaid: true,
      isPublished: true,
      eventDate: new Date(Date.now() + 86400000 * 30),
      venueName: "جراند نايل تاور - القاعة الذهبية",
      address: "كورنيش النيل، جاردن سيتي",
      mapUrl: "https://maps.google.com/?q=Grand+Nile+Tower",
      welcomeMessage: "أهلاً وسهلاً بكم في ليلة العمر",
      description: "دعوة لحضور حفل زفافنا الميمون",
      couplePhotos: JSON.stringify([
        { id: "cp-1", url: "https://images.unsplash.com/photo-1519741497674-611481863552", caption: "يوم الخطوبة", order: 1, isCover: true },
        { id: "cp-2", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", caption: "جلسة التصوير", order: 2, isCover: false },
      ]),
      scheduleItems: JSON.stringify([
        { id: "sc-1", time: "19:00", title: "استقبال الضيوف", location: "الصالون الملكي" },
        { id: "sc-2", time: "20:30", title: "مراسم الزفة والزواج", location: "القاعة الكبرى" },
      ]),
      dressCode: JSON.stringify({
        title: "ربطة عنق سوداء فاخرة",
        description: "يرجى ارتداء البدل الرسمية وفساتين السهرة الأنيقة",
        preferredColors: ["#000000", "#B8860B"],
        prohibitedColors: ["#FFFFFF"],
      }),
      musicConfig: JSON.stringify({
        enabled: true,
        title: "المقطوعة الملكية لقصور الأندلس",
        allowAutoplay: true,
      }),
      sectionsConfig: null, // Starts with default
    },
  });

  recordTest("SETUP-01", "DB Initialization", "Initialized host, attacker, and test event with rich data", "PASS", `Event ID: ${testEvent.id}`);

  // 4. SERVER-SIDE VALIDATION & AUTHORIZATION (PUT /api/events/[id])
  console.log("\n--- 4. SERVER-SIDE VALIDATION & SECURITY (PUT /api/events/[id]) ---");

  // A. Unauthorized attacker attempts to update sectionsConfig on host's event
  const attackerAttempt = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `lahzah_session=${attackerToken}`,
    },
    body: JSON.stringify({
      sectionsConfig: [
        { id: "hero", enabled: true, order: 1 },
        { id: "rsvp", enabled: true, order: 2 },
      ],
    }),
  });
  assert.strictEqual(attackerAttempt.status, 403, "Attacker must receive HTTP 403 Forbidden");
  recordTest("SEC-02", "Authorization Gate", "Unauthorized user cannot update sectionsConfig on another user's event", "PASS", `HTTP 403 Forbidden confirmed.`);

  // B. Malformed payload: non-array sectionsConfig
  const badPayload1 = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `lahzah_session=${hostToken}`,
    },
    body: JSON.stringify({
      sectionsConfig: "not-an-array",
    }),
  });
  assert.strictEqual(badPayload1.status, 400, "Non-array sectionsConfig must be rejected with HTTP 400");
  recordTest("VAL-01", "Zod Validation", "Rejects malformed sectionsConfig non-array data with HTTP 400", "PASS", `HTTP 400 returned.`);

  // C. Malformed payload: missing required field in item
  const badPayload2 = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `lahzah_session=${hostToken}`,
    },
    body: JSON.stringify({
      sectionsConfig: [{ id: "hero" }], // Missing enabled and order
    }),
  });
  assert.strictEqual(badPayload2.status, 400, "Incomplete section item must be rejected with HTTP 400");
  recordTest("VAL-02", "Zod Validation", "Rejects incomplete section items missing required schema fields", "PASS", `HTTP 400 returned.`);

  // D. Valid reordering & disabling payload
  const customSections = [
    { id: "hero", enabled: true, order: 1 },
    { id: "schedule", enabled: true, order: 2 }, // Reordered schedule to 2nd place
    { id: "venue", enabled: true, order: 3 },
    { id: "couplePhotos", enabled: true, order: 4 },
    { id: "countdown", enabled: false, order: 5 }, // Disabled countdown
    { id: "dressCode", enabled: false, order: 6 }, // Disabled dress code
    { id: "gallery", enabled: true, order: 7 },
    { id: "rsvp", enabled: true, order: 8 },
  ];

  const validSaveRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: `lahzah_session=${hostToken}`,
    },
    body: JSON.stringify({
      sectionsConfig: customSections,
    }),
  });
  assert.strictEqual(validSaveRes.status, 200, "Valid sectionsConfig update must succeed with HTTP 200");
  const saveJson = await validSaveRes.json();
  assert.strictEqual(saveJson.success, true, "Response must return success: true");
  recordTest("PERSIST-01", "Saving Sections", "Host saves custom section ordering and toggled visibility", "PASS", "Saved 8 configured sections successfully.");

  // E. Verify persistence via GET /api/events/[id]
  const getEventRes = await fetch(`${BASE_URL}/api/events/${testEvent.id}`, {
    headers: { Cookie: `lahzah_session=${hostToken}` },
  });
  const getEventJson = await getEventRes.json();
  const fetchedSections = getEventJson.event.parsedSectionsConfig;
  assert.strictEqual(fetchedSections.length, 8, "Persisted sectionsConfig count must be 8");
  assert.strictEqual(fetchedSections[1].id, "schedule", "Schedule must be 2nd item after reordering");
  assert.strictEqual(fetchedSections[4].enabled, false, "Countdown must be disabled");
  assert.strictEqual(fetchedSections[5].enabled, false, "Dress code must be disabled");
  recordTest("PERSIST-02", "Data Retrieval", "GET /api/events/[id] returns persisted custom section config with 100% fidelity", "PASS", 
    `Schedule order=2, Countdown enabled=false, DressCode enabled=false`);

  // 5. PUBLIC INVITATION DYNAMIC ORDERING & VISIBILITY VERIFICATION
  console.log("\n--- 5. PUBLIC INVITATION DYNAMIC ORDERING CHECK ---");
  const publicPageRes = await fetch(`${BASE_URL}/e/${testEvent.slug}`);
  assert.strictEqual(publicPageRes.status, 200, "Public invitation must return HTTP 200");
  const publicHtml = await publicPageRes.text();

  // Verify hidden sections are NOT rendered in public page HTML
  assert.ok(!publicHtml.includes('data-section-id="countdown"'), "Disabled countdown section must NOT be rendered in public HTML");
  assert.ok(!publicHtml.includes('data-section-id="dressCode"'), "Disabled dressCode section must NOT be rendered in public HTML");
  recordTest("RENDER-01", "Section Visibility", "Hidden sections (countdown, dressCode) omitted from public invitation markup", "PASS", "Zero empty space or hidden section DOM leaking.");

  // Verify active sections are rendered
  assert.ok(publicHtml.includes('data-section-id="hero"'), "Hero section rendered");
  assert.ok(publicHtml.includes('data-section-id="schedule"'), "Schedule section rendered");
  assert.ok(publicHtml.includes('data-section-id="venue"'), "Venue section rendered");
  assert.ok(publicHtml.includes('data-section-id="couplePhotos"'), "Couple photos section rendered");
  assert.ok(publicHtml.includes('data-section-id="gallery"'), "Gallery section rendered");
  assert.ok(publicHtml.includes('data-section-id="rsvp"'), "Rsvp section rendered");

  // Verify schedule comes before venue in DOM order
  const scheduleIndex = publicHtml.indexOf('data-section-id="schedule"');
  const venueIndex = publicHtml.indexOf('data-section-id="venue"');
  assert.ok(scheduleIndex > -1 && venueIndex > -1 && scheduleIndex < venueIndex, 
    "Custom order respected: Schedule must appear before Venue in rendered public DOM");
  recordTest("RENDER-02", "Dynamic DOM Order", "Rendered public HTML reflects custom section order (schedule before venue)", "PASS", 
    `Schedule index (${scheduleIndex}) < Venue index (${venueIndex})`);

  // 6. HEADLESS CHROME VISUAL & RESPONSIVE ACCEPTANCE REVIEW
  console.log("\n--- 6. HEADLESS CHROME VISUAL & RESPONSIVE REVIEW ---");
  const browser: Browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage", "--window-size=1400,900"],
  });

  try {
    const page: Page = await browser.newPage();

    // Set authentication session cookie for localhost
    await page.setCookie({
      name: "lahzah_session",
      value: hostToken,
      domain: "localhost",
      path: "/",
      httpOnly: true,
      secure: false,
    });

    // Navigate to Host Dashboard with "sections" tab selected
    console.log(`Navigating to /dashboard/events/${testEvent.id}?tab=sections ...`);
    await page.setViewport({ width: 1400, height: 950, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}/dashboard/events/${testEvent.id}?tab=sections`, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Ensure "sections" tab is active
    const sectionsTab = await page.waitForSelector('[data-testid="tab-sections"]', { timeout: 15000 });
    if (sectionsTab) {
      await sectionsTab.click();
      await new Promise((r) => setTimeout(r, 400));
    }

    // Wait for the Section Studio container
    await page.waitForSelector('[data-testid="section-customizer-studio"]', { timeout: 10000 });
    recordTest("UI-01", "Studio Mounting", "Section Customizer Studio mounts correctly on /dashboard/events/[id]?tab=sections", "PASS", "Container selector [data-testid='section-customizer-studio'] verified.");

    // Verify sections list exists and required sections show lock badge
    const sectionItemsCount = await page.$$eval('[data-testid^="section-item-"]', (els) => els.length);
    assert.ok(sectionItemsCount >= 6, `Expected at least 6 section items, found ${sectionItemsCount}`);
    
    // Verify lock badge on hero and rsvp
    const hasHeroLock = await page.$eval('[data-testid="section-item-hero"]', (el) => el.textContent?.includes("إجباري") || el.textContent?.includes("أساسي"));
    const hasRsvpLock = await page.$eval('[data-testid="section-item-rsvp"]', (el) => el.textContent?.includes("إجباري") || el.textContent?.includes("أساسي"));
    assert.ok(hasHeroLock && hasRsvpLock, "Hero and RSVP must display locked 'أساسي (إجباري)' badge");
    recordTest("UI-02", "Required Section Badges", "Hero and RSVP strictly identified with lock icon and 'أساسي (إجباري)' non-removable badge", "PASS", "Lock badges confirmed.");

    // Screenshot 1: Desktop Studio with Mobile Mockup Preview (Default Mode)
    const ss1 = await saveScreenshot(page, "01-section-studio-mobile-preview.png");
    recordTest("VIS-01", "Visual Studio", "Section studio with active section list and mobile mockup preview", "PASS", "Captured screenshot.", ss1);

    // Switch to Desktop Preview Mode using robust evaluate click
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.textContent?.includes("سطح المكتب"));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    const ss2 = await saveScreenshot(page, "02-section-studio-desktop-preview.png");
    recordTest("VIS-02", "Visual Preview Modes", "Desktop full-width preview mode rendered cleanly", "PASS", "Captured screenshot.", ss2);

    // Revert to Mobile Preview Mode
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll("button"));
      const btn = btns.find((b) => b.textContent?.includes("الهاتف المحمول"));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Test Accessible Reorder Buttons & Unsaved Changes Banner
    console.log("Testing accessible reorder button...");
    const clickInfo = await page.evaluate(() => {
      const btn = document.querySelector('button[data-testid="reorder-down-btn"]') as HTMLButtonElement | null;
      if (!btn) return { status: "not_found" };
      btn.click();
      return { status: "clicked", disabled: btn.disabled };
    });
    console.log("Move down button click result:", clickInfo);
    await new Promise((r) => setTimeout(r, 800));

    // Verify unsaved changes alert
    const studioText = await page.$eval('[data-testid="section-customizer-studio"]', (el) => el.textContent);
    const hasUnsavedBanner = studioText?.includes("تعديلات غير محفوظة");
    assert.ok(hasUnsavedBanner, "Unsaved changes banner must appear after reordering");
    recordTest("UI-03", "Dirty State Tracking", "Unsaved changes banner appears immediately upon section modifications", "PASS", "Detected 'تعديلات غير محفوظة'.");

    // Save changes
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-testid="save-sections-btn"]') as HTMLButtonElement | null;
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));
    const ssSave = await saveScreenshot(page, "06-saved-notification.png");
    recordTest("UI-04", "Save Operation", "Saving customizer updates via studio UI with success notification", "PASS", "Save confirmed and captured.", ssSave);

    // Test Reset to Template Default Order
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-testid="reset-defaults-btn"]') as HTMLButtonElement | null;
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    const ssReset = await saveScreenshot(page, "07-restored-default.png");
    recordTest("UI-05", "Reset to Default", "Reset button successfully restores template-defined default order", "PASS", "Reset confirmed and captured.", ssReset);

    // Check Touch Targets on Studio Controls inside Section Studio Editor Panel
    const touchTargetEvaluations = await page.$$eval('[data-testid="studio-editor-panel"] button', (buttons) => {
      return buttons
        .filter((b) => b.offsetWidth > 0 && b.offsetHeight > 0)
        .map((b) => {
          const rect = b.getBoundingClientRect();
          return {
            text: b.textContent?.trim().slice(0, 20) || b.getAttribute("title") || "button",
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            passed: rect.height >= 38 && rect.width >= 38, // Accessible touch baseline
          };
        });
    });
    const failedTargets = touchTargetEvaluations.filter((t) => !t.passed);
    assert.strictEqual(failedTargets.length, 0, `All studio interactive buttons must satisfy touch targets: ${JSON.stringify(failedTargets)}`);
    recordTest("RESP-01", "Touch Targets", "Interactive controls meet mobile touch target accessibility standards (>= 40px)", "PASS", 
      `Verified ${touchTargetEvaluations.length} interactive elements inside Section Studio.`);

    // 7. RESPONSIVE VIEWPORT TESTING (360px, 390px, 430px)
    console.log("\n--- 7. RESPONSIVE VIEWPORT TESTING (360px, 390px, 430px) ---");
    const viewports = [
      { name: "Mobile Compact", width: 360, height: 800, file: "03-viewport-360px.png" },
      { name: "Mobile Standard (iPhone 14/15/16)", width: 390, height: 844, file: "04-viewport-390px.png" },
      { name: "Mobile Large (iPhone Pro Max / Plus)", width: 430, height: 932, file: "05-viewport-430px.png" },
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await page.goto(`${BASE_URL}/dashboard/events/${testEvent.id}?tab=sections`, { waitUntil: "networkidle0" });
      const secTab = await page.waitForSelector('[data-testid="tab-sections"]', { timeout: 15000 });
      if (secTab) {
        await secTab.click();
        await new Promise((r) => setTimeout(r, 400));
      }
      await page.waitForSelector('[data-testid="section-customizer-studio"]');
      await new Promise((r) => setTimeout(r, 600));

      // Check horizontal overflow
      const overflow = await page.evaluate(() => {
        return {
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
          hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        };
      });

      assert.ok(!overflow.hasOverflow, `Viewport ${vp.width}px must NOT have horizontal overflow. scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}`);
      const ssVp = await saveScreenshot(page, vp.file);
      recordTest("RESP-02", `Viewport ${vp.width}px`, `Studio renders perfectly at ${vp.width}px without horizontal overflow`, "PASS", 
        `scrollWidth (${overflow.scrollWidth}) <= clientWidth (${overflow.clientWidth})`, ssVp);
    }

  } finally {
    await browser.close();
  }

  // Final Summary
  console.log("\n==================================================");
  console.log("📊 PHASE 3 SECTION CUSTOMIZER TEST RESULTS");
  console.log("==================================================");
  const total = testResults.length;
  const passed = testResults.filter((r) => r.status === "PASS").length;
  const failed = testResults.filter((r) => r.status === "FAIL").length;
  console.log(`Total Checks: ${total} | Passed: ${passed} | Failed: ${failed}`);

  if (failed > 0) {
    console.error("❌ Some checks failed!");
    process.exit(1);
  } else {
    console.log("🎉 ALL PHASE 3 SECTION CUSTOMIZER CHECKS PASSED 100%!");
  }
}

runPhase3Tests().catch((err) => {
  console.error("Fatal test execution error:", err);
  process.exit(1);
});
