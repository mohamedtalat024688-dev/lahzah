# PROJECT_CONTEXT.md

## 1. Project Overview
- **Project Name:** Lahzah (لحظة)
- **Tagline:** "من دعوة… إلى ذكرى" (From an invitation to a memory)
- **Core Concept:** A digital invitation, real-time event experience, and guest memories platform tailored for the Arab and Egyptian market (weddings, engagements, and special celebrations).
- **Core Workflow:**
  1. **Before Event:** Owner creates bespoke digital invitation with countdown, map, schedule, and RSVP.
  2. **During Event:** Unique QR code displayed on venue tables; guests scan with mobile cameras to upload candid photos and wishes instantly without needing an account.
  3. **After Event:** Owner moderates and approves photos in dashboard; public memory gallery preserves the celebration forever.

## 2. Target Market & Languages
- Primary market: Egypt & Arabic-speaking region (MENA).
- First-class RTL support, Arabic typography (Cairo & Amiri Google Fonts), cultural wedding terminology.

## 3. Technology Stack
- **Framework:** Next.js 16 (App Router with Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4, custom luxury Arab design tokens (Emerald, Gold shimmer, Warm Sand, Velvet Noir)
- **Icons & Micro-interactions:** Lucide React, Canvas Confetti
- **Database & ORM:** Prisma ORM 6.4.1 with SQLite (`dev.db`) for zero-friction local persistence, fully migratable to PostgreSQL
- **Authentication:** Custom cryptographically secure session system (`jose` JWT + `bcryptjs` password hashing) with HTTP-only cookies, role-based access (`OWNER`, `ADMIN`)
- **QR Code Engine:** `qrcode` with SVG and high-resolution downloadable PNG generation
- **Storage:** Pluggable storage abstraction with local disk storage in `public/uploads`
- **Payments:** Provider-agnostic payment abstraction (Basic, Premium, Luxury tiers) with server-side upgrade verification

## 4. Current Development Phase & Completed Features
- [x] **Phase 0 & 1:** Project foundation, architecture & memory files
- [x] **Phase 2:** Database schema & Prisma migrations (`User`, `Event`, `Rsvp`, `Photo`, `Package`)
- [x] **Phase 3:** Authentication & Session management (`/auth/login`, `/auth/register`, `/api/auth/*`)
- [x] **Phase 4:** Event management & Creation wizard (`/dashboard/events/new`)
- [x] **Phase 5:** Template Engine with 5 luxury Arabic themes:
  - `royal-gold` (الملكي الذهبي)
  - `emerald-elegance` (الزمرد الفاخر)
  - `rose-romance` (زهور ربيعية)
  - `modern-minimal` (المعاصر الهادئ)
  - `desert-calligraphy` (الأصالة العربية)
- [x] **Phase 6:** Public Invitation experience (`/e/[slug]`) with live countdown, map, schedule, and music toggle
- [x] **Phase 7:** Guest RSVP system with live guest count and celebratory confetti
- [x] **Phase 8:** QR generation & printable table card download (SVG & PNG)
- [x] **Phase 9:** Mobile-first guest photo upload page (`/e/[slug]/upload`) with direct camera capture
- [x] **Phase 10:** Owner photo moderation inbox with 1-click Approve / Reject / Delete
- [x] **Phase 11:** Interactive Memory Gallery with masonry grid, lightbox, and photo download
- [x] **Phase 12:** Owner Dashboard (`/dashboard` & `/dashboard/events/[id]`) with live metrics
- [x] **Phase 13 & 14:** Package management & tier upgrades (`BASIC`, `PREMIUM`, `LUXURY`)
- [x] **Phase 15:** Super Admin Panel (`/admin`) for system oversight
- [x] **Phase 16:** Next.js Route Middleware (`src/middleware.ts`) protecting `/dashboard` and `/admin`
- [x] **Phase 17:** Security Hardening & Storage provider abstraction with magic-byte file signature validation
- [x] **Phase 18:** Automated E2E Acceptance Test Suite (`scripts/test-e2e.ts`) passing 100%
- [x] **Phase 19:** Comprehensive Security & Authorization Test Suite (`scripts/test-security.ts`) passing 100%
- [x] **Phase 20:** Database-backed Payment Transactions (`PaymentTransaction`), Paymob v1 API integration with HMAC-SHA512 webhook handler (`/api/payments/webhook`), and automated test suite (`scripts/test-payments.ts`) passing 100%
- [x] **Phase 21:** Enterprise Object Storage abstraction with `S3StorageProvider` (zero-bloat native AWS SigV4 for AWS S3 & Cloudflare R2) and `LocalStorageProvider`
- [x] **Phase 22:** Commercial UI/UX Polish (4-step Arabic event creation wizard, streamlined guest experience "شاركنا لحظتك ❤️" / "تم استلام صورتك ❤️", full-screen gallery lightbox, and responsive mobile navigation drawer)
- [x] **Phase 23:** Complete Commercial Payment & Publishing Flow (`Create Event → Choose Package → Checkout → Verified Payment → Publish → Invitation URL + QR`)
  - Server-side security gate: Events default to `isPaid: false` & `isPublished: false`. Unpaid events cannot publish via UI or direct API calls (`PUT` or `POST /publish` returns HTTP 402).
  - Dedicated Customer Checkout page (`/dashboard/events/[id]/checkout`) with package comparison, price breakdown, and Paymob/Simulation gateway selection.
  - Payment verification atomically updates `isPaid: true` and `packageTier`. Failed/pending payments strictly leave events unpublished.
  - Publishing reveals live invitation link, QR Studio (PNG & SVG vector download), and direct WhatsApp share API.
  - 10/10 automated commercial flow tests passing in `scripts/test-commercial-flow.ts`.
- [x] **Phase 24:** Complete Premium UI/UX Redesign (Editorial Arabic Wedding Brand)
  - Redesigned visual language: Warm charcoal (`#0c0b0a`, `#141210`), warm ivory (`#faf8f5`), restrained champagne gold accents (`#c5a880`), subtle hairline dividers (`#26221d`), and editorial Arabic typography (`Amiri` serif display + `Cairo` sans UI).
- [x] **Phase 25:** Visual UX Transformation (Personal Wedding Studio & Physical Invitation Stationery)
  - **Stationery Paper Composition:** Built `RealisticInvitationCard` with realistic invitation paper proportions, royal monogram medallion, Bismillah calligraphy, template-specific ornamental corners (Arabian geometric/floral, romantic curves, royal brackets, blind-debossed ivory linen), and realistic drop shadow.
  - **7 Luxury Template Identities:** Royal Gold, Emerald Elegance, Rose Romance, Ivory Minimal (light paper with dark ink), Burgundy Grandeur, Modern Black, and Arabian Heritage.
  - **Landing Page Hero & Gallery:** Asymmetric editorial composition with zero dead black space; template gallery where invitations float proudly as stationery pieces without heavy nested SaaS wrappers.
  - **Personal Wedding Studio Dashboard:** The customer dashboard prominently features the real wedding invitation card alongside status badges, event details, and contextual "ادفع وانشر دعوتك" / "إدارة ومتابعة الحضور" actions.
  - **Checkout Redesign:** 2-column split layout with realistic invitation preview on one side, package selector + EGP pricing + payment gateway badge + clear "ادفع وانشر دعوتك" primary button.
  - **Quality Verification:** 100% passing tests (34/34), 0 ESLint errors/warnings, Next.js 16 build passing cleanly.
- [x] **Phase 26:** Template Preview System & Comprehensive Mobile Interaction Audit
  - **Bug #1 Fix (Template Previews & Studio Selection):**
    - Single source of truth in `src/lib/templates.ts`.
    - Dedicated `/preview?template=${tmpl.id}` page featuring live template switcher chips, dual viewing mode (Stationery Card vs Full Interactive Web Invitation), and "استخدم هذا التصميم" action button.
    - Public `/e/[slug]?template=${tmpl.id}` support for dynamic preview overrides.
    - Invitation Studio (`/dashboard/events/new`) reads `template` and `package` from URL query string on load, updates live preview immediately, and syncs choices via `window.history.replaceState`.
    - `RealisticInvitationCard` accepts `template?: TemplateConfig` directly and renders template-specific ornaments for all 7 designs.
  - **Bug #2 Fix (Mobile Interaction Audit across 360px, 390px, 430px):**
    - Audited and updated all interactive buttons and triggers to meet the minimum 44px touch-target standard (`min-h-[44px]`).
    - Fixed mobile hamburger menu drawer reset on logout (`setIsMobileMenuOpen(false)`).
    - Fixed Invitation Studio mobile view toggle ("البيانات" / "المعاينة الحية") touch targets and responsiveness.
    - Updated RSVP Modal and Memory Gallery lightbox controls for mobile touch safety.
  - **Testing & Verification:**
    - 53/53 tests passing across 5 suites (`npm test`).
    - `npx eslint src/` passing with 0 errors and 0 warnings.
    - `npm run build` compiling cleanly with 0 TypeScript errors across all 17 routes.
    - `scripts/verify-pages.ts` and `scripts/test-templates-and-mobile.ts` passing 100%.

## 5. Security & Isolation Matrix
- Strict owner data isolation: User A cannot view, modify, delete, or upgrade User B's events (enforced at API and middleware levels).
- Role-based authorization: Only users with `role: "ADMIN"` can access `/admin` and `/api/admin/metrics`.
- Safe file upload validation: Binary magic bytes inspection (JPEG, PNG, WebP, HEIC) blocks spoofed malicious files; 12MB limit strictly enforced.
- Physical file deletion: Deleting or rejecting a photo cleans up the stored file from disk/bucket.
- Memory privacy: All guest uploads enter `PENDING` state and require owner approval before appearing in public galleries.
- Rate limits & bounds: Event names, guest counts, and notes have bounds checking.
- Webhook signature authentication: HMAC-SHA512 mandated alphabetical key ordering verification for payment confirmations.

