// scripts/test-commercial-flow.ts - Automated verification of complete Commercial Purchase & Publish Flow
import assert from "node:assert";
import { prisma } from "../src/lib/prisma";

const BASE_URL = "http://localhost:3000";

async function runCommercialFlowTests() {
  console.log("==================================================");
  console.log("🛡️ TESTING COMMERCIAL PAYMENT & PUBLISHING FLOW");
  console.log("==================================================\n");

  const timestamp = Date.now();

  // Helper to register user
  async function registerUser(email: string, name: string) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name, password: "password123456" }),
    });
    assert.ok(res.ok, `Failed to register ${email}`);
    const cookie = res.headers.get("set-cookie")?.split(";")[0] || "";
    const data = await res.json();
    return { user: data.user, cookie };
  }

  // 1. Setup User A and User B
  console.log("Setup: Registering User A (Owner) and User B (Attacker)...");
  const userA = await registerUser(`usera_${timestamp}@lahzah.com`, "أحمد العريس");
  const userB = await registerUser(`userb_${timestamp}@lahzah.com`, "مستخدم متطفل");
  console.log("  ✔ Users created successfully.\n");

  // 2. Create Event for User A
  console.log("Test 1: Creating event for User A (must default to isPaid=false, isPublished=false)...");
  const createRes = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
    body: JSON.stringify({
      title: "حفل زفاف تجربة الشراء",
      eventType: "WEDDING",
      groomName: "أحمد",
      brideName: "سارة",
      eventDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      venueName: "فندق الفورسيزونز",
      packageTier: "BASIC",
    }),
  });
  assert.strictEqual(createRes.status, 201);
  const createData = await createRes.json();
  const event = createData.event;
  assert.strictEqual(event.isPublished, false, "New event must be unpublished by default");
  assert.strictEqual(event.isPaid, false, "New event must be unpaid by default");
  console.log(`  ✔ Event created as draft (ID: ${event.id}, isPaid=${event.isPaid}, isPublished=${event.isPublished})\n`);

  // 3. Test: Unpaid event cannot publish via PUT /api/events/[id]
  console.log("Test 2: Server-side check: Attempting to publish unpaid event via PUT /api/events/[id]...");
  const putRes = await fetch(`${BASE_URL}/api/events/${event.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
    body: JSON.stringify({ isPublished: true }),
  });
  assert.strictEqual(putRes.status, 402, "Unpaid event MUST return 402 Payment Required");
  const putErr = await putRes.json();
  assert.ok(putErr.error, "Must return error message");
  console.log(`  ✔ Rejected with HTTP 402: "${putErr.error}"\n`);

  // 4. Test: Unpaid event cannot publish via dedicated POST /api/events/[id]/publish
  console.log("Test 3: Server-side check: Attempting to publish unpaid event via POST /api/events/[id]/publish...");
  const pubRes = await fetch(`${BASE_URL}/api/events/${event.id}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
  });
  assert.strictEqual(pubRes.status, 402, "Publishing unpaid event MUST return 402 Payment Required");
  const pubErr = await pubRes.json();
  assert.strictEqual(pubErr.isPaid, false);
  console.log(`  ✔ Dedicated publish endpoint rejected with HTTP 402: "${pubErr.error}"\n`);

  // 5. Test: Guest cannot access unpaid unpublished event
  console.log("Test 4: Checking public guest accessibility on unpublished draft...");
  const publicRes = await fetch(`${BASE_URL}/api/events/by-slug/${event.slug}`);
  assert.strictEqual(publicRes.status, 403, "Unpublished event must return 403 to guests");
  console.log("  ✔ Public guest route correctly returned 403 Forbidden (Hidden from public)\n");

  // 6. Test: Cross-user isolation: User B cannot checkout or publish User A's event
  console.log("Test 5: Cross-user authorization: User B attempting to checkout and publish User A's event...");
  const userBCheckoutRes = await fetch(`${BASE_URL}/api/events/${event.id}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userB.cookie,
    },
    body: JSON.stringify({ packageCode: "PREMIUM" }),
  });
  assert.strictEqual(userBCheckoutRes.status, 403, "User B must be forbidden (HTTP 403) from checking out User A's event");

  const userBPublishRes = await fetch(`${BASE_URL}/api/events/${event.id}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userB.cookie,
    },
  });
  assert.strictEqual(userBPublishRes.status, 403, "User B must be forbidden (HTTP 403) from publishing User A's event");
  console.log("  ✔ Cross-user tampering strictly blocked with HTTP 403\n");

  // 7. Test: Failed payment does NOT unlock publishing
  console.log("Test 6: Verifying failed or pending payment does NOT set isPaid or allow publishing...");
  // Simulate a failed transaction directly in DB or test payload
  await prisma.paymentTransaction.create({
    data: {
      eventId: event.id,
      packageCode: "PREMIUM",
      amount: 799,
      status: "FAILED",
      provider: "PAYMOB",
      providerTxnId: `PMOB-FAIL-${timestamp}`,
    },
  });
  const eventAfterFail = await prisma.event.findUnique({ where: { id: event.id } });
  assert.strictEqual(eventAfterFail?.isPaid, false, "Failed payment must NOT set isPaid to true");

  const retryPublishRes = await fetch(`${BASE_URL}/api/events/${event.id}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
  });
  assert.strictEqual(retryPublishRes.status, 402, "Publishing must still be blocked after failed payment");
  console.log("  ✔ Verified: Failed payment does not grant publish rights\n");

  // 8. Test: Legitimate Payment via Checkout
  console.log("Test 7: Processing verified payment via checkout for User A...");
  const checkoutRes = await fetch(`${BASE_URL}/api/events/${event.id}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
    body: JSON.stringify({ packageCode: "PREMIUM" }),
  });
  assert.strictEqual(checkoutRes.status, 200, "Checkout must succeed");
  const checkoutData = await checkoutRes.json();
  assert.strictEqual(checkoutData.success, true);
  assert.strictEqual(checkoutData.status, "PAID");
  console.log(`  ✔ Payment processed successfully. Txn ID: ${checkoutData.transactionId}`);

  // Verify in database that isPaid is now true
  const eventAfterPay = await prisma.event.findUnique({ where: { id: event.id } });
  assert.strictEqual(eventAfterPay?.isPaid, true, "Event must be marked isPaid: true in DB");
  assert.strictEqual(eventAfterPay?.packageTier, "PREMIUM");
  console.log("  ✔ Verified in Database: isPaid = true, packageTier = PREMIUM\n");

  // 9. Test: Paid event CAN now be published
  console.log("Test 8: Publishing the paid event via POST /api/events/[id]/publish...");
  const pubSuccessRes = await fetch(`${BASE_URL}/api/events/${event.id}/publish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
  });
  assert.strictEqual(pubSuccessRes.status, 200, "Publishing paid event must succeed (HTTP 200)");
  const pubSuccessData = await pubSuccessRes.json();
  assert.strictEqual(pubSuccessData.success, true);
  assert.strictEqual(pubSuccessData.event.isPublished, true);
  assert.ok(pubSuccessData.urls.invitation, "Must return invitation URL");
  assert.ok(pubSuccessData.urls.qr, "Must return QR code URL");
  console.log(`  ✔ Event published! Invitation URL: ${pubSuccessData.urls.invitation}`);
  console.log(`  ✔ QR Code Data URL generated (${pubSuccessData.urls.qr.slice(0, 30)}...)\n`);

  // 10. Test: Public guest can now view invitation
  console.log("Test 9: Verifying public guest can now access published event...");
  const guestRes = await fetch(`${BASE_URL}/api/events/by-slug/${event.slug}`);
  assert.strictEqual(guestRes.status, 200, "Guest can now view published event");
  const guestData = await guestRes.json();
  assert.strictEqual(guestData.event.isPublished, true);
  console.log(`  ✔ Public invitation is live and accessible to guests\n`);

  // 11. Test: Unpublish functionality
  console.log("Test 10: Testing unpublish functionality (pausing event)...");
  const unpubRes = await fetch(`${BASE_URL}/api/events/${event.id}/unpublish`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
  });
  assert.strictEqual(unpubRes.status, 200);
  const unpubData = await unpubRes.json();
  assert.strictEqual(unpubData.event.isPublished, false);
  console.log("  ✔ Event unpublished successfully to draft mode\n");

  console.log("==================================================");
  console.log("🎉 ALL 10 COMMERCIAL FLOW TESTS PASSED 100%!");
  console.log("==================================================");
}

runCommercialFlowTests().catch((err) => {
  console.error("❌ Commercial flow tests failed:", err);
  process.exit(1);
});
