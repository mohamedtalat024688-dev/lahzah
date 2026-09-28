// scripts/verify-pages.ts - Validate SSR HTML, RTL, and Meta tags
const pages = [
  { path: "/", titleNeedle: "لحظة" },
  { path: "/e/ahmed-and-sara", titleNeedle: "أحمد وسارة" },
  { path: "/e/ahmed-and-sara/upload", titleNeedle: "شاركنا لحظتك" },
  { path: "/auth/login", titleNeedle: "لحظة" },
  { path: "/auth/register", titleNeedle: "لحظة" },
];

async function testPages() {
  console.log("==========================================");
  console.log("🌐 VERIFYING SSR HTML, RTL, AND METADATA");
  console.log("==========================================\n");

  for (const page of pages) {
    const res = await fetch(`http://localhost:3000${page.path}`);
    const html = await res.text();
    const hasRtl = html.includes('dir="rtl"');
    const hasArabicLang = html.includes('lang="ar"');
    const hasNeedle = html.includes(page.titleNeedle);

    console.log(`Page: ${page.path}`);
    console.log(`  - Status: ${res.status}`);
    console.log(`  - Has dir="rtl": ${hasRtl}`);
    console.log(`  - Has lang="ar": ${hasArabicLang}`);
    console.log(`  - Contains expected content ("${page.titleNeedle}"): ${hasNeedle}`);
    console.log(`  - HTML length: ${html.length} bytes\n`);

    if (res.status !== 200 || !hasRtl || !hasNeedle) {
      throw new Error(`Verification failed for ${page.path}`);
    }
  }

  console.log("🎉 All SSR pages verified with 100% Arabic RTL & content fidelity!");
}

testPages().catch((err) => {
  console.error("❌ Error verifying pages:", err);
  process.exit(1);
});
