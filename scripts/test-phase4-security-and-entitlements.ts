import assert from "assert";
import {
  getPaymentGateway,
  UnconfiguredProductionPaymentGateway,
  isPaymobReady,
  getPaymobConfigStatus,
} from "../src/lib/packages";
import {
  getJwtSecretKey,
  validateProductionJwtSecret,
  createSessionToken,
  verifySessionToken,
} from "../src/lib/auth";
import { isTemplateAllowedForPackage, getAllowedTemplateTiers } from "../src/lib/templates";
import { prisma } from "../src/lib/prisma";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function runTests() {
  console.log("==================================================");
  console.log("🔒 PHASE 4.2: SECURITY & BUSINESS LOGIC REGRESSION TESTS");
  console.log("==================================================\n");

  const originalEnv = { ...process.env };

  try {
    // -------------------------------------------------------------------------
    // 1. PAYMENT GATEWAY PRODUCTION FAIL-CLOSED & SIMULATION REMOVAL (FIX 1)
    // -------------------------------------------------------------------------
    console.log("Test 1: Payment Simulation Security & Complete Prod Disablement (Fix 1)...");

    // Test 1a: In production without Paymob configured, gateway must fail closed
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    delete process.env.PAYMENT_PROVIDER;
    delete process.env.ALLOW_SIMULATION_IN_PROD;
    delete process.env.PAYMOB_API_KEY;
    delete process.env.PAYMOB_INTEGRATION_ID;
    delete process.env.PAYMOB_IFRAME_ID;
    delete process.env.PAYMOB_HMAC_SECRET;

    const prodGateway = getPaymentGateway();
    assert(
      prodGateway instanceof UnconfiguredProductionPaymentGateway,
      "Production gateway must be UnconfiguredProductionPaymentGateway when unconfigured"
    );

    let prodChargeError: Error | null = null;
    try {
      await prodGateway.charge("dummy-event-id", "PREMIUM");
    } catch (err: unknown) {
      prodChargeError = err as Error;
    }
    assert(prodChargeError !== null, "Production charge must throw an error when Paymob is unconfigured");
    assert(
      prodChargeError.message.includes("بوابة الدفع غير مهيأة للإنتاج"),
      `Expected production fail-closed message, got: ${prodChargeError.message}`
    );
    console.log("  ✔ Verified: Simulated payment strictly blocked in production (fails closed)");

    // Test 1b: Even if ALLOW_SIMULATION_IN_PROD=true is supplied, simulation remains strictly disabled in prod
    (process.env as Record<string, string | undefined>).NODE_ENV = "production";
    process.env.ALLOW_SIMULATION_IN_PROD = "true";
    process.env.PAYMENT_PROVIDER = "simulation";

    const bypassedGateway = getPaymentGateway();
    assert(
      bypassedGateway instanceof UnconfiguredProductionPaymentGateway,
      "ALLOW_SIMULATION_IN_PROD must NOT enable simulation in production environment"
    );

    let bypassError: Error | null = null;
    try {
      await bypassedGateway.charge("dummy-event-id", "PREMIUM");
    } catch (err: unknown) {
      bypassError = err as Error;
    }
    assert(bypassError !== null, "Production charge must still fail closed even when ALLOW_SIMULATION_IN_PROD=true");
    console.log("  ✔ Verified: ALLOW_SIMULATION_IN_PROD cannot bypass production fail-closed gateway");

    // Test 1c: In development/test, simulation gateway is permitted
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
    process.env.PAYMENT_PROVIDER = "simulation";
    const devGateway = getPaymentGateway();
    assert(
      !(devGateway instanceof UnconfiguredProductionPaymentGateway),
      "Development gateway must permit simulation"
    );
    console.log("  ✔ Verified: Simulation gateway permitted only in non-production environments");

    // -------------------------------------------------------------------------
    // 2. JWT CONFIGURATION & SECRET ENFORCEMENT TESTS (FIX 3)
    // -------------------------------------------------------------------------
    console.log("\nTest 2: JWT Configuration & Secret Strength Enforcement (Fix 3)...");

    (process.env as Record<string, string | undefined>).NODE_ENV = "production";

    // Test 2a: Missing JWT_SECRET in production must be rejected
    delete process.env.JWT_SECRET;
    const missingCheck = validateProductionJwtSecret(undefined);
    assert.strictEqual(missingCheck.valid, false, "validateProductionJwtSecret must fail on undefined");
    assert(missingCheck.reason?.includes("missing"), "Reason should indicate missing secret");

    let secretErrorMissing: Error | null = null;
    try {
      getJwtSecretKey();
    } catch (err: unknown) {
      secretErrorMissing = err as Error;
    }
    assert(secretErrorMissing !== null, "getJwtSecretKey must throw when JWT_SECRET is missing in production");
    console.log("  ✔ Verified: Missing JWT_SECRET in production fails closed");

    // Test 2b: Whitespace-only JWT_SECRET in production must be rejected
    process.env.JWT_SECRET = "            ";
    const whitespaceCheck = validateProductionJwtSecret(process.env.JWT_SECRET);
    assert.strictEqual(whitespaceCheck.valid, false, "validateProductionJwtSecret must fail on whitespace-only");
    assert(whitespaceCheck.reason?.includes("whitespace-only"), "Reason should indicate whitespace-only secret");

    let secretErrorWhitespace: Error | null = null;
    try {
      getJwtSecretKey();
    } catch (err: unknown) {
      secretErrorWhitespace = err as Error;
    }
    assert(secretErrorWhitespace !== null, "getJwtSecretKey must throw on whitespace-only JWT_SECRET in production");
    console.log("  ✔ Verified: Whitespace-only JWT_SECRET in production fails closed");

    // Test 2c: Short JWT_SECRET (< 32 characters) in production must be rejected
    process.env.JWT_SECRET = "short-secret-key-12345"; // 22 chars
    const shortCheck = validateProductionJwtSecret(process.env.JWT_SECRET);
    assert.strictEqual(shortCheck.valid, false, "validateProductionJwtSecret must fail on short secret");
    assert(shortCheck.reason?.includes("Minimum 32 characters"), "Reason should indicate minimum 32 characters requirement");

    let secretErrorShort: Error | null = null;
    try {
      getJwtSecretKey();
    } catch (err: unknown) {
      secretErrorShort = err as Error;
    }
    assert(secretErrorShort !== null, "getJwtSecretKey must throw on short JWT_SECRET in production");
    // Ensure no secret value was printed in error message
    assert(!secretErrorShort.message.includes("short-secret-key-12345"), "Secret value must NEVER be printed in error message");
    console.log("  ✔ Verified: Short (< 32 chars) JWT_SECRET in production fails closed without leaking secret");

    // Test 2d: Valid JWT_SECRET (>= 32 characters) must be accepted
    const validSecret = "lahzah-super-secure-production-jwt-key-2026-very-high-entropy-64bytes";
    process.env.JWT_SECRET = validSecret;
    const validCheck = validateProductionJwtSecret(validSecret);
    assert.strictEqual(validCheck.valid, true, "validateProductionJwtSecret must pass for valid 32+ char secret");

    const testPayload = { userId: "user-123", email: "test@example.com", role: "OWNER" as const };
    const token = await createSessionToken(testPayload);
    assert(typeof token === "string" && token.length > 20, "Token must be a valid JWT string");

    const decoded = await verifySessionToken(token);
    assert(decoded !== null, "Token must decode successfully with matching secret");
    assert.strictEqual(decoded.userId, "user-123");
    assert.strictEqual(decoded.email, "test@example.com");
    console.log("  ✔ Verified: 32+ character production secret passes validation, signs and verifies sessions securely");

    // Restore environment before continuing
    (process.env as Record<string, string | undefined>).NODE_ENV = "development";
    process.env.PAYMENT_PROVIDER = originalEnv.PAYMENT_PROVIDER || "simulation";
    process.env.JWT_SECRET = originalEnv.JWT_SECRET || "lahzah-super-secret-jwt-key-2026-very-secure-replace-in-prod";

    // -------------------------------------------------------------------------
    // 3. PAYMOB CONFIGURATION VERIFICATION (FIX 4)
    // -------------------------------------------------------------------------
    console.log("\nTest 3: Paymob Full Configuration Verification (Fix 4)...");

    // Test 3a: Completely unconfigured
    delete process.env.PAYMOB_API_KEY;
    delete process.env.PAYMOB_INTEGRATION_ID;
    delete process.env.PAYMOB_IFRAME_ID;
    delete process.env.PAYMOB_HMAC_SECRET;

    const unconfiguredStatus = getPaymobConfigStatus();
    assert.strictEqual(unconfiguredStatus.isReady, false, "Paymob must not be ready when unconfigured");
    assert.strictEqual(unconfiguredStatus.missingVariables.length, 4, "Must identify all 4 missing Paymob variables");
    assert.strictEqual(isPaymobReady(), false, "isPaymobReady() must return false when unconfigured");
    console.log("  ✔ Verified: Completely unconfigured Paymob reports isReady=false and 4 missing variables");

    // Test 3b: Partially configured (missing HMAC secret)
    process.env.PAYMOB_API_KEY = "test_api_key";
    process.env.PAYMOB_INTEGRATION_ID = "123456";
    process.env.PAYMOB_IFRAME_ID = "78910";
    delete process.env.PAYMOB_HMAC_SECRET;

    const partialStatus = getPaymobConfigStatus();
    assert.strictEqual(partialStatus.isReady, false, "Paymob must not be ready when HMAC secret is missing");
    assert.deepStrictEqual(partialStatus.missingVariables, ["PAYMOB_HMAC_SECRET"], "Must identify PAYMOB_HMAC_SECRET as missing");
    assert.strictEqual(isPaymobReady(), false, "isPaymobReady() must return false when partial");
    console.log("  ✔ Verified: Incomplete Paymob configuration (missing HMAC) reports isReady=false");

    // Test 3c: Fully configured
    process.env.PAYMOB_HMAC_SECRET = "test_hmac_secret";
    const fullStatus = getPaymobConfigStatus();
    assert.strictEqual(fullStatus.isReady, true, "Paymob must be ready when all 4 variables are present");
    assert.strictEqual(fullStatus.missingVariables.length, 0, "No missing variables when fully configured");
    assert.strictEqual(isPaymobReady(), true, "isPaymobReady() must return true when fully configured");
    console.log("  ✔ Verified: Fully configured Paymob reports isReady=true");

    // Clean up Paymob test env
    delete process.env.PAYMOB_API_KEY;
    delete process.env.PAYMOB_INTEGRATION_ID;
    delete process.env.PAYMOB_IFRAME_ID;
    delete process.env.PAYMOB_HMAC_SECRET;

    // -------------------------------------------------------------------------
    // 4. TEMPLATE & PACKAGE ENTITLEMENT TESTS (SERVER-SIDE)
    // -------------------------------------------------------------------------
    console.log("\nTest 4: Template & Package Entitlements Server-Side Validation...");

    assert.deepStrictEqual(getAllowedTemplateTiers("BASIC"), ["BASIC"]);
    assert.deepStrictEqual(getAllowedTemplateTiers("PREMIUM"), ["BASIC", "PREMIUM"]);
    assert.deepStrictEqual(getAllowedTemplateTiers("LUXURY"), ["BASIC", "PREMIUM", "LUXURY"]);

    assert.strictEqual(isTemplateAllowedForPackage("ivory-minimal", "BASIC"), true);
    assert.strictEqual(isTemplateAllowedForPackage("royal-gold", "BASIC"), false);
    assert.strictEqual(isTemplateAllowedForPackage("luxury-maison", "BASIC"), false);
    assert.strictEqual(isTemplateAllowedForPackage("luxury-maison", "PREMIUM"), false);
    assert.strictEqual(isTemplateAllowedForPackage("luxury-maison", "LUXURY"), true);
    console.log("  ✔ Verified: Template tier mapping strictly isolates BASIC, PREMIUM, and LUXURY");

    // Register test user for API tests
    const timestamp = Date.now();
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: `phase4_${timestamp}@lahzah.com`,
        password: "Password123!",
        name: "مستخدم اختبار المرحلة الرابعة",
      }),
    });
    const cookie = regRes.headers.get("set-cookie")?.split(";")[0] || "";

    // Test 4b: Creating event with forbidden template/package combo (BASIC + luxury-maison)
    const forbiddenCreateRes = await fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        groomName: "عمر",
        brideName: "نور",
        eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        venueName: "قاعة الاختبار",
        templateId: "luxury-maison", // Requires LUXURY
        packageTier: "BASIC", // Attempting BASIC
      }),
    });
    assert.strictEqual(forbiddenCreateRes.status, 400, "Must reject LUXURY template for BASIC package tier");
    const forbiddenCreateData = await forbiddenCreateRes.json();
    assert.strictEqual(forbiddenCreateData.code, "TEMPLATE_ENTITLEMENT_MISMATCH");
    console.log("  ✔ Verified: POST /api/events rejects forbidden template/package combinations (HTTP 400)");

    // Test 4c: Creating event with permitted combination (BASIC + ivory-minimal)
    const permittedCreateRes = await fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        groomName: "عمر",
        brideName: "نور",
        eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
        venueName: "قاعة الاختبار",
        templateId: "ivory-minimal", // Matches BASIC
        packageTier: "BASIC",
      }),
    });
    assert.strictEqual(permittedCreateRes.status, 201, "Must allow permitted BASIC template");
    const permittedEventData = await permittedCreateRes.json();
    const eventId = permittedEventData.event.id;
    const eventSlug = permittedEventData.event.slug;
    console.log("  ✔ Verified: POST /api/events accepts permitted template/package tier (HTTP 201)");

    // Test 4d: Attempting to update existing BASIC event with a LUXURY template
    const forbiddenUpdateRes = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        templateId: "luxury-maison", // Forbidden on BASIC
      }),
    });
    assert.strictEqual(forbiddenUpdateRes.status, 403, "PUT must reject template upgrade without package upgrade");
    const forbiddenUpdateData = await forbiddenUpdateRes.json();
    assert.strictEqual(forbiddenUpdateData.code, "TEMPLATE_ENTITLEMENT_REQUIRED");
    console.log("  ✔ Verified: PUT /api/events/[id] enforces server-side template entitlement (HTTP 403)");

    // Test 4e: Upgrading event to PREMIUM allows PREMIUM template
    const upgradeRes = await fetch(`${BASE_URL}/api/events/${eventId}/upgrade`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ packageCode: "PREMIUM" }),
    });
    assert.strictEqual(upgradeRes.status, 200, "Upgrade to PREMIUM must succeed");

    // Now updating to royal-gold (PREMIUM) succeeds
    const permittedUpdateRes = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ templateId: "royal-gold" }),
    });
    assert.strictEqual(permittedUpdateRes.status, 200, "PUT must succeed with now-permitted template");
    console.log("  ✔ Verified: Event update succeeds after legitimate package upgrade");

    // Test 4f: Attempting to downgrade package tier from PREMIUM to BASIC
    const downgradeRes = await fetch(`${BASE_URL}/api/events/${eventId}/upgrade`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ packageCode: "BASIC" }),
    });
    assert.strictEqual(downgradeRes.status, 400, "Package downgrade must be rejected");
    const downgradeData = await downgradeRes.json();
    assert.strictEqual(downgradeData.code, "DOWNGRADE_NOT_ALLOWED");
    console.log("  ✔ Verified: POST /api/events/[id]/upgrade prevents accidental tier downgrade");

    // Publish the event for public URL test
    const publishRes = await fetch(`${BASE_URL}/api/events/${eventId}/publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
    });
    assert.strictEqual(publishRes.status, 200, "Publishing paid PREMIUM event must succeed");

    // -------------------------------------------------------------------------
    // 5. CHECKOUT PACKAGE/TEMPLATE COMPATIBILITY GATE (FIX 2)
    // -------------------------------------------------------------------------
    console.log("\nTest 5: Checkout Package/Template Compatibility Gate (Fix 2)...");

    // Create a new event with royal-gold (requires PREMIUM)
    const premiumEventRes = await fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({
        groomName: "طارق",
        brideName: "سارة",
        eventDate: new Date(Date.now() + 86400000 * 45).toISOString(),
        venueName: "فندق الفيرمونت",
        templateId: "royal-gold", // Requires PREMIUM
        packageTier: "PREMIUM",
      }),
    });
    assert.strictEqual(premiumEventRes.status, 201, "Create PREMIUM event must succeed");
    const premiumEventData = await premiumEventRes.json();
    const chkEventId = premiumEventData.event.id;

    // Record pre-checkout database state
    const preDbEvent = await prisma.event.findUnique({ where: { id: chkEventId } });
    assert(preDbEvent !== null, "Event must exist in DB");
    assert.strictEqual(preDbEvent.isPaid, false, "Event must initially be unpaid");
    const preDbPayments = await prisma.paymentTransaction.findMany({ where: { eventId: chkEventId } });
    assert.strictEqual(preDbPayments.length, 0, "No initial payments");

    // Test 5a: Attempt checkout with BASIC package on royal-gold event (incompatible)
    const incompatibleCheckoutRes = await fetch(`${BASE_URL}/api/events/${chkEventId}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ packageCode: "BASIC" }),
    });
    assert.strictEqual(
      incompatibleCheckoutRes.status,
      400,
      "Checkout with incompatible package must return HTTP 400"
    );
    const incompatibleData = await incompatibleCheckoutRes.json();
    assert.strictEqual(
      incompatibleData.code,
      "PACKAGE_INCOMPATIBLE_WITH_TEMPLATE",
      "Must return stable error code PACKAGE_INCOMPATIBLE_WITH_TEMPLATE"
    );
    console.log("  ✔ Verified: POST checkout with incompatible package rejected with HTTP 400 (PACKAGE_INCOMPATIBLE_WITH_TEMPLATE)");

    // Test 5b: Verify database state remained completely unchanged
    const postDbEvent = await prisma.event.findUnique({ where: { id: chkEventId } });
    assert.strictEqual(postDbEvent?.isPaid, false, "Event must remain UNPAID after rejected checkout");
    assert.strictEqual(postDbEvent?.packageTier, "PREMIUM", "Event packageTier must remain unchanged");
    const postDbPayments = await prisma.paymentTransaction.findMany({ where: { eventId: chkEventId } });
    assert.strictEqual(postDbPayments.length, 0, "Payment processor was NOT invoked, zero payments created");
    console.log("  ✔ Verified: Database state untouched after incompatible checkout rejection (isPaid=false, 0 payments)");

    // Test 5c: Legitimate checkout with compatible package (PREMIUM)
    const compatibleCheckoutRes = await fetch(`${BASE_URL}/api/events/${chkEventId}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: JSON.stringify({ packageCode: "PREMIUM" }),
    });
    assert.strictEqual(compatibleCheckoutRes.status, 200, "Compatible checkout must succeed");
    const compatibleData = await compatibleCheckoutRes.json();
    assert.strictEqual(compatibleData.success, true, "Checkout response indicates success");
    const paidDbEvent = await prisma.event.findUnique({ where: { id: chkEventId } });
    assert.strictEqual(paidDbEvent?.isPaid, true, "Event is marked paid after valid checkout");
    console.log("  ✔ Verified: Compatible checkout succeeds and processes payment properly");

    // -------------------------------------------------------------------------
    // 6. PUBLIC INVITATION TEMPLATE INTEGRITY TESTS
    // -------------------------------------------------------------------------
    console.log("\nTest 6: Public Invitation Saved Template Integrity...");

    // Event was saved with royal-gold (accent color: #c5a880)
    // Request with query override ?template=rose-romance (accent color: #f472b6)
    const publicUrlWithOverride = `${BASE_URL}/e/${encodeURIComponent(eventSlug)}?template=rose-romance`;
    const pubRes = await fetch(publicUrlWithOverride);
    assert.strictEqual(pubRes.status, 200, "Public invitation must be accessible");
    const pubHtml = await pubRes.text();

    // Verify it renders the SAVED template (royal-gold #c5a880), NOT the query override (#f472b6)
    assert(
      pubHtml.includes("#c5a880"),
      "Public invitation MUST render the saved template's accent color (#c5a880)"
    );
    assert(
      !pubHtml.includes("#f472b6"),
      "Public invitation MUST NOT render the query override template's accent color (#f472b6)"
    );
    console.log("  ✔ Verified: Public /e/[slug]?template=... strictly ignores query parameter override and preserves saved template");

    console.log("\n==================================================");
    console.log("🎉 ALL PHASE 4.2 SECURITY & ENTITLEMENT TESTS PASSED 100%!");
    console.log("==================================================");
  } finally {
    process.env = originalEnv;
  }
}

runTests().catch((err) => {
  console.error("\n❌ PHASE 4.2 TESTS FAILED:", err);
  process.exit(1);
});
