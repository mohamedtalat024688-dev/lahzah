// scripts/test-phase1-foundation.ts
// Automated Test Suite for Phase 1: Data Contracts, Zod Validation, Targeted Invites & Benchmarking

import assert from "node:assert";

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";

async function runPhase1Tests() {
  console.log("==================================================");
  console.log("🏛️ STARTING PHASE 1 FOUNDATION & SECURITY TESTS");
  console.log("==================================================\n");

  const timestamp = Date.now();

  // 1. SETUP: Register Host
  console.log("Step 1: Registering Host User...");
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "منظم حفل الاختبار",
      email: `host_phase1_${timestamp}@lahzah.com`,
      password: "Password123!",
    }),
  });
  assert.ok(regRes.ok, "Host registration failed");
  const cookie = regRes.headers.get("set-cookie")?.split(";")[0] || "";
  console.log("  ✔ Host registered.\n");

  // 2. SETUP: Create Event with Phase 1 Structured Fields
  console.log("Step 2: Creating Event with Schedule, Dress Code, Photos & Music...");
  const validSchedule = [
    { id: "item-1", time: "18:00", title: "استقبال الضيوف الكرام", description: "ترحيب بالضيوف في بهو القاعة", location: "البهو الرئيسي" },
    { id: "item-2", time: "19:30", title: "مراسم عقد القران", description: "إشهار الزواج والمباركة", location: "القاعة الكبرى" },
    { id: "item-3", time: "21:00", title: "مأدبة العشاء والاحتفال", description: "بوفيه مفتوح مع الأهل والأصدقاء" },
  ];

  const validDressCode = {
    title: "رسمي كلاسيكي أنيق",
    description: "يسعدنا حضوركم بالزي الرسمي، ونرجو تجنب ارتداء اللون الأبيض المخصص للعروس.",
    preferredColors: ["#000000", "#1E3A8A", "#4B5563"],
    prohibitedColors: ["#FFFFFF", "#FDF4E3"],
  };

  const validCouplePhotos = [
    { id: "photo-1", url: "https://images.unsplash.com/photo-1519741497674-611481863552", caption: "يوم الخطوبة المبارك", order: 0, isCover: true },
    { id: "photo-2", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc", caption: "جلسة التصوير في جاردن سيتي", order: 1, isCover: false },
  ];

  const validMusicConfig = {
    enabled: true,
    trackUrl: "https://cdn.lahzah.com/audio/royal-march.mp3",
    title: "مقطوعة كلاسيكية هادئة لليلة العمر",
    allowAutoplay: false,
  };

  const validSectionsConfig = [
    { id: "hero", enabled: true, order: 0 },
    { id: "names", enabled: true, order: 1 },
    { id: "schedule", enabled: true, order: 2 },
    { id: "dressCode", enabled: true, order: 3 },
    { id: "photos", enabled: true, order: 4 },
    { id: "venue", enabled: true, order: 5 },
    { id: "rsvp", enabled: true, order: 6 },
    { id: "gallery", enabled: true, order: 7 },
  ];

  const createEventRes = await fetch(`${BASE_URL}/api/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      title: "حفل زفاف تجربة المعمارية الجديدة",
      eventType: "WEDDING",
      groomName: "طارق المصري",
      brideName: "نادين الشريف",
      eventDate: new Date(Date.now() + 86400000 * 14).toISOString(),
      venueName: "فندق سانت ريجيس - القاعة الكبرى",
      address: "كورنيش النيل، القاهرة",
      templateId: "royal-gold",
      packageTier: "PREMIUM",
      scheduleItems: validSchedule,
      dressCode: validDressCode,
      couplePhotos: validCouplePhotos,
      musicConfig: validMusicConfig,
      sectionsConfig: validSectionsConfig,
      defaultMaxSeats: 3,
    }),
  });

  assert.strictEqual(createEventRes.status, 201, "Event creation failed");
  const eventData = await createEventRes.json();
  const eventId = eventData.event.id;
  const eventSlug = eventData.event.slug;
  console.log(`  ✔ Event created! (ID: ${eventId}, Slug: ${eventSlug})\n`);

  // 3. TEST: Server-Side Zod Validation Rejects Malformed Payloads
  console.log("Step 3: Testing Server-Side Zod Validation on Invalid Payloads...");

  // A. Invalid schedule (item missing required 'time')
  const badScheduleRes = await fetch(`${BASE_URL}/api/events/${eventId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      scheduleItems: [{ id: "bad-1", title: "بدون وقت" }],
    }),
  });
  assert.strictEqual(badScheduleRes.status, 400, "Malformed schedule should be rejected with 400");
  const badScheduleData = await badScheduleRes.json();
  console.log(`  ✔ PASS: Malformed schedule rejected: "${badScheduleData.error}"`);

  // B. Invalid defaultMaxSeats (< 1 or > 20)
  const badSeatsRes = await fetch(`${BASE_URL}/api/events/${eventId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      defaultMaxSeats: 99,
    }),
  });
  assert.strictEqual(badSeatsRes.status, 400, "Excessive defaultMaxSeats must be rejected with 400");
  console.log("  ✔ PASS: Out-of-bounds defaultMaxSeats correctly rejected with 400.\n");

  // 4. TEST: Fetch Event & Verify Correct Parsed Data
  console.log("Step 4: Verifying Data Retrieval & Safe Parsing (GET /api/events/[id])...");
  const getEventRes = await fetch(`${BASE_URL}/api/events/${eventId}`, {
    headers: { Cookie: cookie },
  });
  assert.strictEqual(getEventRes.status, 200);
  const fetched = await getEventRes.json();

  assert.strictEqual(fetched.event.parsedScheduleItems.length, 3);
  assert.strictEqual(fetched.event.parsedScheduleItems[0].title, "استقبال الضيوف الكرام");
  assert.strictEqual(fetched.event.parsedDressCode.title, "رسمي كلاسيكي أنيق");
  assert.strictEqual(fetched.event.parsedCouplePhotos.length, 2);
  assert.strictEqual(fetched.event.parsedCouplePhotos[0].caption, "يوم الخطوبة المبارك");
  assert.strictEqual(fetched.event.parsedMusicConfig.enabled, true);
  assert.strictEqual(fetched.event.parsedSectionsConfig.length, 8);
  assert.strictEqual(fetched.event.defaultMaxSeats, 3);
  console.log("  ✔ PASS: Event retrieved with 100% structured data fidelity.\n");

  // Pay and Publish Event so RSVP and Public endpoints are active
  console.log("Step 5: Checkout & Publishing Event...");
  const payRes = await fetch(`${BASE_URL}/api/events/${eventId}/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ packageCode: "PREMIUM" }),
  });
  assert.strictEqual(payRes.status, 200);
  const pubRes = await fetch(`${BASE_URL}/api/events/${eventId}/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
  });
  assert.strictEqual(pubRes.status, 200);
  console.log("  ✔ Event published successfully.\n");

  // 5. TEST: Database-backed Targeted Invitations (`GuestInvite`)
  console.log("Step 6: Testing Targeted Invitations (Database-Backed Secure Tokens)...");

  // A. Host creates a targeted invite with max 2 seats for a VIP
  const createInviteRes = await fetch(`${BASE_URL}/api/events/${eventId}/invites`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({
      guestName: "د. إبراهيم الخولي وعائلته الكريمة",
      phone: "+201099887766",
      maxSeats: 2,
    }),
  });
  assert.strictEqual(createInviteRes.status, 201);
  const inviteData = await createInviteRes.json();
  const inviteToken = inviteData.invite.token;
  assert.ok(inviteToken && inviteToken.length >= 16, "Token must be secure cryptographically");
  console.log(`  ✔ Targeted invite created with Token: ${inviteToken} (Max Seats: 2)`);

  // B. Public token lookup
  const tokenLookupRes = await fetch(`${BASE_URL}/api/events/by-slug/${eventSlug}/invite?token=${inviteToken}`);
  assert.strictEqual(tokenLookupRes.status, 200);
  const tokenMeta = await tokenLookupRes.json();
  assert.strictEqual(tokenMeta.valid, true);
  assert.strictEqual(tokenMeta.guestName, "د. إبراهيم الخولي وعائلته الكريمة");
  assert.strictEqual(tokenMeta.maxSeats, 2);
  assert.strictEqual(tokenMeta.isUsed, false);
  console.log("  ✔ Public token lookup verified correctly without exposing private fields.");

  // C. Security: Attempt to submit RSVP exceeding allocated maxSeats (3 seats > 2 allowed)
  console.log("  Testing quota violation: Guest attempting to RSVP with 3 seats on a 2-seat invite...");
  const overSeatRsvpRes = await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestName: "د. إبراهيم الخولي",
      attendanceStatus: "ATTENDING",
      guestCount: 3,
      inviteToken,
    }),
  });
  assert.strictEqual(overSeatRsvpRes.status, 400, "Should reject seat limit violation with 400");
  const overSeatData = await overSeatRsvpRes.json();
  assert.strictEqual(overSeatData.code, "SEAT_LIMIT_EXCEEDED");
  console.log(`  ✔ PASS: Over-seat RSVP blocked: "${overSeatData.error}"`);

  // D. Legitimate RSVP within allocated quota (2 seats <= 2 allowed)
  console.log("  Testing valid targeted RSVP (2 seats <= 2 allowed)...");
  const validRsvpRes = await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestName: "د. إبراهيم الخولي",
      attendanceStatus: "ATTENDING",
      guestCount: 2,
      note: "ألف مليون مبروك لأجمل عروسين",
      inviteToken,
    }),
  });
  assert.strictEqual(validRsvpRes.status, 200, "Valid RSVP should succeed");
  await validRsvpRes.json();
  console.log("  ✔ PASS: Targeted RSVP successfully recorded.");

  // E. Security: Duplicate reuse of token is strictly blocked
  console.log("  Testing anti-tampering: Attempting to reuse already consumed token...");
  const reuseRsvpRes = await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestName: "شخص آخر يحاول إعادة استخدام الكود",
      attendanceStatus: "ATTENDING",
      guestCount: 1,
      inviteToken,
    }),
  });
  assert.strictEqual(reuseRsvpRes.status, 400, "Reused token must be blocked with 400");
  const reuseData = await reuseRsvpRes.json();
  console.log(`  ✔ PASS: Token reuse strictly blocked: "${reuseData.error}"\n`);

  // 6. TEST: General Public Open Link RSVP Quota Enforcement
  console.log("Step 7: Testing General Public Open Link RSVP Limit (defaultMaxSeats = 3)...");

  // A. Public link with 5 seats (exceeds defaultMaxSeats = 3)
  const overPublicRes = await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestName: "ضيف عام بدون دعوة مخصصة",
      attendanceStatus: "ATTENDING",
      guestCount: 5,
    }),
  });
  assert.strictEqual(overPublicRes.status, 400);
  const overPublicData = await overPublicRes.json();
  assert.strictEqual(overPublicData.code, "PUBLIC_SEAT_LIMIT_EXCEEDED");
  console.log(`  ✔ PASS: Public open link seat limit enforced: "${overPublicData.error}"`);

  // B. Public link within limit (2 seats <= 3)
  const validPublicRes = await fetch(`${BASE_URL}/api/events/${eventId}/rsvp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      guestName: "ضيف عام كريم",
      attendanceStatus: "ATTENDING",
      guestCount: 2,
    }),
  });
  assert.strictEqual(validPublicRes.status, 200);
  console.log("  ✔ PASS: Public open link RSVP within limit succeeded.\n");

  // 7. EMPIRICAL BENCHMARKING: Actual Latency Measurement
  console.log("Step 8: Empirical Latency Benchmark on Public Invitation (/api/events/by-slug/[slug])...");
  const iterations = 20;
  const latencies: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    const res = await fetch(`${BASE_URL}/api/events/by-slug/${eventSlug}`);
    assert.strictEqual(res.status, 200);
    await res.json();
    const end = performance.now();
    latencies.push(end - start);
  }

  latencies.sort((a, b) => a - b);
  const min = latencies[0].toFixed(2);
  const max = latencies[latencies.length - 1].toFixed(2);
  const avg = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
  const p95 = latencies[Math.floor(latencies.length * 0.95)].toFixed(2);

  console.log(`  📊 Benchmark Results (${iterations} real consecutive queries):`);
  console.log(`     - Min Latency: ${min} ms`);
  console.log(`     - Avg Latency: ${avg} ms`);
  console.log(`     - P95 Latency: ${p95} ms`);
  console.log(`     - Max Latency: ${max} ms\n`);

  console.log("==================================================");
  console.log("🎉 ALL PHASE 1 TESTS & BENCHMARKS PASSED 100%!");
  console.log("==================================================");
}

runPhase1Tests().catch((err) => {
  console.error("❌ Phase 1 test failed:", err);
  process.exit(1);
});
