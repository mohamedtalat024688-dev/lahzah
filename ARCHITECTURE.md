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

## Storage Abstraction
- Unified interface: `uploadFile(file: Buffer, filename: string, mimeType: string): Promise<string>`
- Default implementation: Local disk in `public/uploads` for local dev without external cloud dependencies.
- Extensible to AWS S3, Supabase Storage, or Cloudflare R2 without touching controller logic.
