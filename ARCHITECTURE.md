# ARCHITECTURE.md - Lahzah (لحظة) Platform

## System Architecture

```mermaid
graph TD
    Client[Browser / Mobile Guest & Owner] --> NextApp[Next.js App Router (SSR & API)]
    
    subgraph Core Services
        NextApp --> AuthServ[Auth Service (jose JWT + bcrypt)]
        NextApp --> TemplateEng[Template Engine (5 Wedding Themes)]
        NextApp --> QREng[QR Code Generator (SVG / High-Res PNG)]
        NextApp --> StorageServ[Storage Provider (Local FS / S3 R2)]
        NextApp --> PaymentServ[Payment Gateway Abstraction]
    end

    subgraph Data Layer
        NextApp --> Prisma[Prisma ORM Client]
        Prisma --> DB[(Database: SQLite / PostgreSQL)]
    end
```

## Route Map

### 1. Public & Guest Routes
- `/` - Landing page: Value proposition, template showcase, pricing, how it works.
- `/e/[slug]` - Public Invitation page rendered with selected template (countdown, location map, itinerary, RSVP modal, and memory gallery preview).
- `/e/[slug]/upload` - Mobile-optimized QR landing page for guests during the event to upload photos with optional name and congratulatory note (zero login required).
- `/e/[slug]/gallery` - Dedicated full-screen interactive memory gallery with lightbox.

### 2. Owner Routes (Protected)
- `/auth/login` - Sign in for event owners.
- `/auth/register` - Create owner account.
- `/dashboard` - Main overview: Upcoming events, quick RSVP numbers, pending photo counter.
- `/dashboard/events/new` - Event wizard: Name, type (Wedding, Engagement), date/time, venue details, template picker.
- `/dashboard/events/[id]` - Single event management:
  - Edit details & story
  - Live preview link & QR download (card print format)
  - RSVP attendee management & export
  - Photo moderation inbox (Accept / Reject)
  - Settings & Package upgrade

### 3. Super Admin Routes (Protected - Role: ADMIN)
- `/admin` - Global platform metrics (Total events, photos uploaded, active users).
- `/admin/events` - All events view and moderation override.
- `/admin/packages` - Plan pricing and quotas.

## Domain Model (Prisma)
- **User:** ID, email, passwordHash, name, role (OWNER, ADMIN), createdAt.
- **Event:** ID, slug (unique URL), title, eventType, groomName, brideName, eventDate, venueName, address, mapUrl, coverImage, templateId, isPublished, packageTier, userId.
- **Rsvp:** ID, eventId, guestName, phone, attendanceStatus (ATTENDING, NOT_ATTENDING, MAYBE), guestCount, note, createdAt.
- **Photo:** ID, eventId, url, guestName, message, status (PENDING, APPROVED, REJECTED), createdAt.
- **Package:** ID, name, code, price, currency, photoLimit, features.
- **PaymentTransaction:** ID, eventId, packageCode, amount, currency, status (PENDING, PAID, FAILED, REFUNDED), provider, providerTxnId, metadata, createdAt, updatedAt.

## Route Middleware (Edge Protection)
- `src/middleware.ts` intercepts `/dashboard/*`, `/admin/*`, `/auth/login`, and `/auth/register`.
- Validates JWT tokens using `jose.jwtVerify`.
- Protects `/dashboard` by redirecting unauthenticated users to `/auth/login?redirect=...`.
- Protects `/admin` by strictly restricting access to users with `role: "ADMIN"`, redirecting unauthorized users to `/dashboard`.
- Automatically redirects already authenticated users away from login/register to `/dashboard`.

## Storage & Payment Abstractions
- **Storage (`src/lib/storage.ts`):** `IStorageProvider` interface with `LocalStorageProvider` (dev) and `S3StorageProvider` (AWS S3, Cloudflare R2, Supabase). Binary magic byte validation (`detectMagicMime`) guarantees true file format authentication prior to persistence.
- **Payments (`src/lib/packages.ts`):** `IPaymentGateway` interface with `SimulationPaymentGateway` (local QA demo) and `PaymobPaymentGateway` (production ready).

## Security & Isolation Matrix
- **User Isolation:** All event management APIs (`GET`, `PUT`, `DELETE`, `/upgrade`, `/qr`) enforce `event.userId === user.id || user.role === "ADMIN"`. User A cannot view, edit, or delete User B's events.
- **Guest Restrictions:** Guests cannot approve, reject, or delete photos.
- **Photo Privacy:** Public invitation `/e/[slug]` and photos API `/api/events/[id]/photos` filter strictly by `status === "APPROVED"` for all non-owners. PENDING and REJECTED photos never leak to the public.
- **File Validation:** Magic bytes inspection prevents disguised executables; 12MB size limit strictly enforced on server.
- **Rate Limiting (`src/lib/rateLimit.ts`):** In-memory sliding window rate limiter protects `/api/auth/login`, `/api/events/[id]/photos`, and `/api/events/[id]/rsvp` against brute-force attacks and spam.
- **Physical Asset Cleanup:** Deleting an event or deleting/rejecting a photo cascades to physically delete the binary file from local storage or S3/R2 buckets.
- **Production Database Architecture:** SQLite for local zero-friction development; 100% prepared and documented for PostgreSQL deployment in [`docs/DATABASE_MIGRATION.md`](file:///c:/Users/Souq%20al%20computer/Desktop/lahzah/docs/DATABASE_MIGRATION.md).

