# DECISIONS.md - Architectural & Product Decisions

## ADR 001: Next.js App Router with TypeScript
- **Context:** Fast SSR for public invitations (critical for WhatsApp OpenGraph previews and fast mobile loading) combined with rich interactive dashboards for event owners.
- **Decision:** Use Next.js 16 (App Router) + TypeScript.
- **Consequence:** Full-stack capabilities in one clean codebase, unified API routes/Server Actions, and zero boilerplate.

## ADR 002: Local Zero-Config Database with Prisma (SQLite default, PostgreSQL ready)
- **Context:** Autonomous development should work instantly without requiring external database provisioning or cloud credentials on the local host.
- **Decision:** Configure Prisma with SQLite (`dev.db`) as the local development default while maintaining standard relational models easily portable to PostgreSQL via simple provider change.
- **Consequence:** 100% runnable, self-contained, and testable on any developer machine.

## ADR 003: Stateless JWT Cookie-Based Authentication
- **Context:** Event owners need easy, frictionless registration and login with no 3rd-party OAuth blockers.
- **Decision:** Use `bcryptjs` for password hashing and `jose` for encrypted/signed JWTs stored in HTTP-only cookies.
- **Consequence:** Zero external service dependencies, high security, role checking (`OWNER` vs `ADMIN`).

## ADR 004: Public Guest Experience (Zero-Auth)
- **Context:** Guests at weddings will not register or download an app to RSVP or upload a photo.
- **Decision:** Guests interact via `/e/[slug]` and `/e/[slug]/upload` without authentication. Security is maintained by:
  - Event slug obfuscation / capability URL
  - Strict photo upload validation
  - Default `PENDING` state for all uploads, requiring owner approval before appearing in the public gallery.

## ADR 005: Luxury Arabic Design System
- **Context:** Arabic weddings in Egypt and the Gulf are high-emotion, high-luxury events. Generic SaaS design fails the product promise.
- **Decision:** Implement rich Arabic fonts (Cairo, Amiri), RTL layout with LTR toggle, gold-foil gradients, emerald/velvet themes, and smooth micro-interactions.

## ADR 006: Server-Side File Signature & Magic Bytes Validation
- **Context:** Malicious guests or bots could upload arbitrary executables disguised as image extensions (`.png`, `.jpg`).
- **Decision:** Validate binary magic bytes (JPEG `FF D8 FF`, PNG `89 50 4E 47`, WebP `RIFF...WEBP`, HEIC/HEIF `ftyp...`) on the raw file buffer before writing to disk or cloud storage.
- **Consequence:** 100% defense against spoofed MIME type attacks. Invalid files fail immediately with HTTP 400.

## ADR 007: Pluggable Storage & Payment Gateway Provider Interfaces
- **Context:** The application needs to run frictionlessly in local development without mandatory cloud credentials, while remaining completely enterprise-ready for AWS S3 / Cloudflare R2 and Paymob / Fawry payment gateways.
- **Decision:** Created `IStorageProvider` and `IPaymentGateway` contracts with environment-based factory selection (`STORAGE_PROVIDER`, `PAYMENT_PROVIDER`).
- **Consequence:** Seamless transition from local simulation to live production without touching business or route logic.

## ADR 008: Edge Middleware Route & Role Isolation
- **Context:** Unauthenticated users attempting to access `/dashboard` or normal owners attempting to access `/admin` need server-side route interception before rendering.
- **Decision:** Implemented Next.js route middleware (`src/middleware.ts`) verifying JWT session cookies, redirecting unauthorized users to `/auth/login` (preserving redirect URL) and non-admins to `/dashboard`.
- **Consequence:** Instant route protection and zero leakage of dashboard or admin UI shells.

## ADR 009: Composite Database Indexes & Pagination
- **Context:** Commercial weddings may attract hundreds of RSVPs and thousands of photo uploads. Loading all records in single queries hurts response times and memory.
- **Decision:** Added composite indexes (`@@index([eventId, status])`, `@@index([eventId, createdAt])`, `@@index([eventId, attendanceStatus])`) and cursor/offset pagination (`page`, `limit`) to both photo and RSVP APIs.
- **Consequence:** Constant-time index scans and scalable data transfer even with thousands of active guests.

## ADR 010: Database-Backed Payment Transactions & HMAC Webhooks
- **Context:** Simulated payments cannot be trusted in production, and frontend-only tier upgrades are insecure.
- **Decision:** Created `PaymentTransaction` database model tracking (`PENDING`, `PAID`, `FAILED`, `REFUNDED`), linked to `Event`. Added Paymob API adapter and server-side HMAC-SHA512 webhook handler at `/api/payments/webhook`.
- **Consequence:** Real-world commercial payment integration architecture ready to process live transactions with authentic server-side confirmation.

## ADR 011: Sliding-Window In-Memory Rate Limiting
- **Context:** Public endpoints for guest photo uploads, RSVP submissions, and authentication are exposed to spam bots, brute-force attempts, and denial of service.
- **Decision:** Implemented an in-memory sliding window rate limiter (`src/lib/rateLimit.ts`) enforcing configurable request ceilings per IP address (login: 15/min, upload: 40/5min, rsvp: 30/5min), automatically purging stale client records every 5 minutes.
- **Consequence:** Zero external infrastructure dependency for development, immediate protection against spam, and clean upgrade path to Redis/Upstash for multi-instance production.

## ADR 012: Cascade Physical Asset Deletion
- **Context:** Deleting an event or rejecting/deleting a photo from the database could leave orphaned image binaries on the local filesystem or S3 bucket, wasting storage and risking data privacy leaks.
- **Decision:** Ensured all photo and event deletion endpoints explicitly iterate through associated media URLs and invoke `deleteUploadedFile()` prior to database deletion.
- **Consequence:** 100% clean disk and object storage hygiene with zero dangling media files.


