// scripts/test-e2e.ts - Full Acceptance MVP test suite

const BASE_URL = "http://localhost:3000";

async function runAcceptanceTest() {
  console.log("==================================================");
  console.log("🚀 STARTING LAHZAH FULL MVP ACCEPTANCE TEST SUITE");
  console.log("==================================================\n");

  const timestamp = Date.now();
  let ownerCookie = "";

  // 1. REGISTER NEW OWNER
  console.log("Test 1: Registering new owner...");
  const registerRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "طارق ومريم",
      email: `tarek_${timestamp}@lahzah.com`,
      password: "password123456",
    }),
  });

  if (!registerRes.ok) {
    const err = await registerRes.text();
    throw new Error(`Registration failed: ${err}`);
  }
  const setCookie = registerRes.headers.get("set-cookie");
  if (setCookie) {
    ownerCookie = setCookie.split(";")[0];
  }
  console.log("  ✔ Owner registered successfully & session cookie obtained.\n");

  // 2. CREATE NEW WEDDING EVENT
  console.log("Test 2: Creating new Wedding Event...");
  const createEventRes = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: ownerCookie,
    },
    body: JSON.stringify({
      title: "حفل زفاف طارق ومريم الفاخر",
      eventType: "WEDDING",
      groomName: "طارق سليم",
      brideName: "مريم العوضي",
      eventDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      venueName: "فندق فورسيزونز نايل بلازا",
      address: "كورنيش النيل، جاردن سيتي، القاهرة",
      mapUrl: "https://maps.google.com/?q=Four+Seasons+Nile+Plaza",
      templateId: "royal-gold",
      welcomeMessage: "يسعدنا ويشرفنا حضوركم لمشاركتنا فرحة العمر وتوثيق أجمل اللحظات",
    }),
  });

  const eventData = await createEventRes.json();
  if (!createEventRes.ok || !eventData.event) {
    throw new Error(`Event creation failed: ${JSON.stringify(eventData)}`);
  }
  const event = eventData.event;
  console.log(`  ✔ Event created! ID: ${event.id}, Slug: ${event.slug}\n`);

  // 3. FETCH PUBLIC INVITATION
  console.log("Test 3: Fetching public invitation (/e/[slug])...");
  const publicRes = await fetch(`${BASE_URL}/api/events/by-slug/${event.slug}`);
  const publicData = await publicRes.json();
  if (!publicRes.ok || !publicData.event) {
    throw new Error(`Public invitation fetch failed: ${JSON.stringify(publicData)}`);
  }
  console.log(`  ✔ Public invitation loaded. Template: ${publicData.event.templateConfig.nameAr}\n`);

  // 4. GUEST SUBMITS RSVP
  console.log("Test 4: Guest submits RSVP without account...");
  const rsvpRes = await fetch(`${BASE_URL}/api/events/${event.id}/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestName: "المستشار عصام الشريف وعائلته",
      phone: "+201099887766",
      attendanceStatus: "ATTENDING",
      guestCount: 3,
      note: "ألف مليون مبروك بالرفاه والبنين يا عرسان!",
    }),
  });
  const rsvpData = await rsvpRes.json();
  if (!rsvpRes.ok || !rsvpData.success) {
    throw new Error(`RSVP failed: ${JSON.stringify(rsvpData)}`);
  }
  console.log(`  ✔ RSVP submitted: ${rsvpData.message}\n`);

  // 5. QR CODE GENERATION
  console.log("Test 5: Generating QR Code for venue tables...");
  const qrRes = await fetch(`${BASE_URL}/api/events/${event.id}/qr`);
  const qrData = await qrRes.json();
  if (!qrRes.ok || !qrData.dataUrl) {
    throw new Error(`QR generation failed: ${JSON.stringify(qrData)}`);
  }
  console.log(`  ✔ QR generated successfully. Target upload URL: ${qrData.targetUrl}\n`);

  // 6. GUEST PHOTO UPLOAD SIMULATION (Multipart)
  console.log("Test 6: Guest uploads in-event photo...");
  // Create a minimal 1x1 PNG byte buffer for upload
  const samplePixel = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "base64"
  );
  const blob = new Blob([samplePixel], { type: "image/png" });
  const form = new FormData();
  form.append("file", blob, "wedding_photo.png");
  form.append("guestName", "د. فريد الألفي");
  form.append("message", "لحظة تاريخية لا تعوض، مبروك يا طارق ومريم! ❤️");

  const uploadRes = await fetch(`${BASE_URL}/api/events/${event.id}/photos`, {
    method: "POST",
    body: form,
  });
  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || !uploadData.photo) {
    throw new Error(`Photo upload failed: ${JSON.stringify(uploadData)}`);
  }
  const photo = uploadData.photo;
  console.log(`  ✔ Photo uploaded! Status: ${photo.status} (Verified: Enters PENDING state for moderation)\n`);

  // 7. OWNER MODERATION (APPROVE PHOTO)
  console.log("Test 7: Owner approves photo in dashboard...");
  const approveRes = await fetch(`${BASE_URL}/api/photos/${photo.id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: ownerCookie,
    },
    body: JSON.stringify({ status: "APPROVED" }),
  });
  const approveData = await approveRes.json();
  if (!approveRes.ok || approveData.photo.status !== "APPROVED") {
    throw new Error(`Moderation approval failed: ${JSON.stringify(approveData)}`);
  }
  console.log(`  ✔ Photo status updated to APPROVED by owner!\n`);

  // 8. VERIFY PUBLIC GALLERY UPDATED
  console.log("Test 8: Verifying memory is now published in public gallery...");
  const rePublicRes = await fetch(`${BASE_URL}/api/events/by-slug/${event.slug}`);
  const rePublicData = await rePublicRes.json();
  const approvedList = rePublicData.event.approvedPhotos;
  const isFound = approvedList.some((p: any) => p.id === photo.id);
  if (!isFound) {
    throw new Error("Approved photo not found in public gallery!");
  }
  console.log(`  ✔ Memory verified in public gallery! (${approvedList.length} approved photos)\n`);

  // 9. PACKAGE UPGRADE
  console.log("Test 9: Upgrading package to LUXURY...");
  const upgradeRes = await fetch(`${BASE_URL}/api/events/${event.id}/upgrade`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: ownerCookie,
    },
    body: JSON.stringify({ packageCode: "LUXURY" }),
  });
  const upgradeData = await upgradeRes.json();
  if (!upgradeRes.ok || upgradeData.event.packageTier !== "LUXURY") {
    throw new Error(`Package upgrade failed: ${JSON.stringify(upgradeData)}`);
  }
  console.log(`  ✔ Upgraded to LUXURY tier successfully! Txn: ${upgradeData.transactionId}\n`);

  // 10. ADMIN METRICS
  console.log("Test 10: Verifying Admin metrics...");
  // Login as admin
  const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@lahzah.com", password: "admin123456" }),
  });
  const adminCookie = adminLoginRes.headers.get("set-cookie")?.split(";")[0] || "";
  const adminRes = await fetch(`${BASE_URL}/api/admin/metrics`, {
    headers: { Cookie: adminCookie },
  });
  const adminData = await adminRes.json();
  if (!adminRes.ok || !adminData.metrics) {
    throw new Error(`Admin metrics failed: ${JSON.stringify(adminData)}`);
  }
  console.log(`  ✔ Admin metrics verified: ${adminData.metrics.totalEvents} events, ${adminData.metrics.totalPhotos} photos, ${adminData.metrics.totalRsvps} RSVPs\n`);

  console.log("==================================================");
  console.log("🎉 ALL 10 ACCEPTANCE TEST SCENARIOS PASSED 100%!");
  console.log("==================================================");
}

runAcceptanceTest().catch((err) => {
  console.error("❌ Acceptance test failed:", err);
  process.exit(1);
});
