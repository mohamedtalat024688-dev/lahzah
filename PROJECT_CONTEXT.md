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
- [x] **Phase 18:** Automated E2E Acceptance Test Suite (`scripts/test-e2e.ts`) passing 100%

## 5. Security & Isolation
- Strict owner data isolation (owners only modify their own events/photos).
- Safe file upload validation (MIME-type check, size bounds 12MB, image extensions).
- All guest uploads enter `PENDING` state and require owner approval before appearing publicly.
