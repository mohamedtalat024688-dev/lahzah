// scripts/test-security.ts - Comprehensive Security and Authorization Verification
import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runSecurityTests() {
  console.log("==================================================");
  console.log("🛡️ STARTING LAHZAH SECURITY & AUTHORIZATION TESTS");
  console.log("==================================================\n");

  const timestamp = Date.now();

  // Helper to register a user and return cookie + user data
  async function registerUser(name: string, email: string) {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: "password123456" }),
    });
    assert.ok(res.ok, `Failed to register ${email}: ${res.status}`);
    const cookie = res.headers.get("set-cookie")?.split(";")[0] || "";
    const data = await res.json();
    return { cookie, user: data.user };
  }

  // 1. SETUP: Create User A and User B
  console.log("Setup: Registering User A (Alice) and User B (Bob)...");
  const userA = await registerUser("User A", `user_a_${timestamp}@lahzah.com`);
  const userB = await registerUser("User B", `user_b_${timestamp}@lahzah.com`);
  console.log("  ✔ Users registered.\n");

  // 2. SETUP: User A creates an Event
  console.log("Setup: User A creates Event A...");
  const createRes = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
    body: JSON.stringify({
      title: "مناسبة المستخدم أ الخاصة",
      eventType: "WEDDING",
      groomName: "العريس أ",
      brideName: "العروس أ",
      eventDate: new Date(Date.now() + 86400000 * 10).toISOString(),
      venueName: "قاعة النور",
      templateId: "emerald-luxury",
    }),
  });
  const createData = await createRes.json();
  assert.strictEqual(createRes.status, 201);
  const eventA = createData.event;
  console.log(`  ✔ Event A created with ID: ${eventA.id}\n`);

  // 3. TEST: User B cannot access User A's event management API (GET /api/events/[id])
  console.log("Test 1: User B attempting to view User A's private event management data...");
  const userBGetEventRes = await fetch(`${BASE_URL}/api/events/${eventA.id}`, {
    headers: { Cookie: userB.cookie },
  });
  assert.strictEqual(userBGetEventRes.status, 403, "User B should be forbidden (403) from accessing User A's event");
  console.log("  ✔ PASS: User B blocked with 403 Forbidden.\n");

  // 4. TEST: User B cannot update User A's event (PATCH /api/events/[id])
  console.log("Test 2: User B attempting to modify User A's event...");
  const userBPatchRes = await fetch(`${BASE_URL}/api/events/${eventA.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: userB.cookie,
    },
    body: JSON.stringify({ title: "محاولة اختراق العنوان" }),
  });
  assert.strictEqual(userBPatchRes.status, 403, "User B should be forbidden from modifying User A's event");
  console.log("  ✔ PASS: User B modification blocked with 403 Forbidden.\n");

  // 5. TEST: User B cannot delete User A's event (DELETE /api/events/[id])
  console.log("Test 3: User B attempting to delete User A's event...");
  const userBDeleteRes = await fetch(`${BASE_URL}/api/events/${eventA.id}`, {
    method: "DELETE",
    headers: { Cookie: userB.cookie },
  });
  assert.strictEqual(userBDeleteRes.status, 403, "User B should be forbidden from deleting User A's event");
  console.log("  ✔ PASS: User B deletion blocked with 403 Forbidden.\n");

  // 6. TEST: User B cannot upgrade User A's package (POST /api/events/[id]/upgrade)
  console.log("Test 4: User B attempting to trigger package upgrade for User A's event...");
  const userBUpgradeRes = await fetch(`${BASE_URL}/api/events/${eventA.id}/upgrade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: userB.cookie,
    },
    body: JSON.stringify({ packageCode: "LUXURY" }),
  });
  assert.strictEqual(userBUpgradeRes.status, 403, "User B should be forbidden from upgrading User A's event");
  console.log("  ✔ PASS: User B upgrade blocked with 403 Forbidden.\n");

  // 7. SETUP: Guest uploads a photo to Event A
  console.log("Setup: Guest uploads a photo without account to Event A...");
  const samplePixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const form = new FormData();
  form.append("file", new Blob([samplePixel], { type: "image/png" }), "guest_photo.png");
  form.append("guestName", "ضيف اختبار");
  const uploadRes = await fetch(`${BASE_URL}/api/events/${eventA.id}/photos`, {
    method: "POST",
    body: form,
  });
  assert.strictEqual(uploadRes.status, 201);
  const photoData = await uploadRes.json();
  const photoId = photoData.photo.id;
  assert.strictEqual(photoData.photo.status, "PENDING");
  console.log(`  ✔ Photo uploaded with status PENDING (ID: ${photoId})\n`);

  // 8. TEST: Pending photo must NOT appear in public gallery
  console.log("Test 5: Checking that PENDING photo is NOT accessible to public gallery...");
  const publicPhotosRes = await fetch(`${BASE_URL}/api/events/${eventA.id}/photos`);
  const publicPhotosData = await publicPhotosRes.json();
  const pendingVisiblePublic = publicPhotosData.photos.some((p: { id: string }) => p.id === photoId);
  assert.strictEqual(pendingVisiblePublic, false, "Pending photo must not be visible in public gallery");
  console.log("  ✔ PASS: Pending photo is hidden from public.\n");

  // 9. TEST: Guest / Unauthenticated user CANNOT approve photos
  console.log("Test 6: Unauthenticated guest attempting to approve photo...");
  const guestApproveRes = await fetch(`${BASE_URL}/api/photos/${photoId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: "APPROVED" }),
  });
  assert.strictEqual(guestApproveRes.status, 401, "Guest must receive 401 Unauthorized");
  console.log("  ✔ PASS: Guest approval blocked with 401 Unauthorized.\n");

  // 10. TEST: User B CANNOT approve photo belonging to User A's event
  console.log("Test 7: User B attempting to approve photo from User A's event...");
  const userBApproveRes = await fetch(`${BASE_URL}/api/photos/${photoId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: userB.cookie,
    },
    body: JSON.stringify({ status: "APPROVED" }),
  });
  assert.strictEqual(userBApproveRes.status, 403, "User B must receive 403 Forbidden");
  console.log("  ✔ PASS: User B approval blocked with 403 Forbidden.\n");

  // 11. TEST: Normal user cannot access Admin metrics
  console.log("Test 8: Normal User A attempting to access /api/admin/metrics...");
  const userAAdminRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: { Cookie: userA.cookie },
  });
  assert.strictEqual(userAAdminRes.status, 403, "Normal user must receive 403 Forbidden for admin metrics");
  console.log("  ✔ PASS: Normal user blocked from admin metrics with 403 Forbidden.\n");

  // 12. TEST: Server-side file validation blocks fake extension / spoofed MIME
  console.log("Test 9: Upload validation against spoofed malicious file (exe disguised as png)...");
  const fakeForm = new FormData();
  const fakeExeBytes = Buffer.from("MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00", "binary");
  fakeForm.append("file", new Blob([fakeExeBytes], { type: "image/png" }), "malicious.png");
  fakeForm.append("guestName", "مهاجم محتمل");
  const badUploadRes = await fetch(`${BASE_URL}/api/events/${eventA.id}/photos`, {
    method: "POST",
    body: fakeForm,
  });
  assert.strictEqual(badUploadRes.status, 400, "Malicious file without valid magic bytes must be rejected with 400");
  const badUploadData = await badUploadRes.json();
  console.log(`  ✔ PASS: Spoofed executable correctly rejected: "${badUploadData.error}"\n`);

  // 13. TEST: Rejecting a photo marks it REJECTED, and it is NOT visible in public gallery
  console.log("Test 10: Owner rejects a photo; verify it never appears publicly...");
  const ownerRejectRes = await fetch(`${BASE_URL}/api/photos/${photoId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: userA.cookie,
    },
    body: JSON.stringify({ status: "REJECTED" }),
  });
  assert.strictEqual(ownerRejectRes.status, 200);
  const publicAfterRejectRes = await fetch(`${BASE_URL}/api/events/${eventA.id}/photos`);
  const publicAfterRejectData = await publicAfterRejectRes.json();
  const rejectedVisible = publicAfterRejectData.photos.some((p: { id: string }) => p.id === photoId);
  assert.strictEqual(rejectedVisible, false, "Rejected photo must never appear in public gallery");
  console.log("  ✔ PASS: Rejected photo confirmed not visible in public gallery.\n");

  // 14. TEST: Middleware Route Protection
  console.log("Test 11: Testing Middleware redirects on protected routes...");
  // Unauthenticated access to /dashboard should redirect to /auth/login
  const unauthDashboardRes = await fetch(`${BASE_URL}/dashboard`, { redirect: "manual" });
  assert.strictEqual(unauthDashboardRes.status, 307, "Unauthenticated /dashboard should 307 redirect");
  assert.ok(
    unauthDashboardRes.headers.get("location")?.includes("/auth/login"),
    "Redirect should point to /auth/login"
  );
  console.log("  ✔ PASS: Unauthenticated /dashboard redirected to /auth/login.\n");

  // Normal user access to /admin should redirect to /dashboard
  const userAdminRes = await fetch(`${BASE_URL}/admin`, {
    headers: { Cookie: userA.cookie },
    redirect: "manual",
  });
  assert.strictEqual(userAdminRes.status, 307, "Normal user accessing /admin should 307 redirect");
  assert.ok(
    userAdminRes.headers.get("location")?.includes("/dashboard"),
    "Redirect should point to /dashboard"
  );
  console.log("  ✔ PASS: Normal user attempting /admin redirected to /dashboard.\n");

  console.log("==================================================");
  console.log("🎉 ALL 11 SECURITY & AUTHORIZATION TESTS PASSED 100%!");
  console.log("==================================================");
}

runSecurityTests().catch((err) => {
  console.error("❌ Security test failed:", err);
  process.exit(1);
});
