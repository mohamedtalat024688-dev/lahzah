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
