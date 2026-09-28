# DATABASE_MIGRATION.md - SQLite to PostgreSQL Production Migration Guide

## 1. Overview

Lahzah (لحظة) uses **SQLite (`prisma/dev.db`)** for zero-friction local development and testing, allowing developers and automated CI agents to run, test, and build without provisioning external database servers.

For production (Vercel, Railway, AWS, Supabase, Neon), **PostgreSQL** is the required target database engine.

---

## 2. Schema Compatibility Audit

The Prisma schema in [`prisma/schema.prisma`](file:///c:/Users/Souq%20al%20computer/Desktop/lahzah/prisma/schema.prisma) has been engineered for 100% cross-compatibility between SQLite and PostgreSQL:

| Feature | SQLite (Dev) | PostgreSQL (Prod) | Compatibility Notes |
|---|---|---|---|
| Primary Keys | `String @id @default(uuid())` | `String @id @default(uuid())` | Generates standard RFC 4122 UUID v4 |
| Timestamps | `DateTime @default(now())` | `TIMESTAMPTZ` | Handled natively by Prisma ORM |
| Foreign Keys & Cascade | `@relation(..., onDelete: Cascade)` | Native Foreign Key Constraints | Cascading deletes clean up child records atomically |
| Composite Indexes | `@@index([eventId, status])` | B-tree Composite Indexes | High-performance indexed lookups for guest moderation & gallery |
| Unique Constraints | `@unique` on `slug`, `email`, `code`, `providerTxnId` | Native Unique B-tree Indexes | Ensures global uniqueness across all concurrent requests |
| String Enums | Stored as `String` with code validation | Fully supported | Avoids brittle PostgreSQL enum migrations across schema updates |

---

## 3. Step-by-Step Production Migration Instructions

### Step 1: Provision your PostgreSQL Database
Create a PostgreSQL instance on your preferred cloud provider:
- **Supabase / Neon / Railway / AWS RDS / DigitalOcean**
- Ensure connection pooling is enabled if deploying to serverless platforms like Vercel (e.g., using Supabase Transaction pooler on port 6543 or Neon pooled connection string).

### Step 2: Update Environment Variables
In your production hosting environment (e.g. Vercel Project Settings > Environment Variables):
```bash
DATABASE_URL="postgresql://user:password@ep-host.region.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
DIRECT_URL="postgresql://user:password@ep-host.region.supabase.com:5432/postgres?sslmode=require"
```

### Step 3: Switch Datasource Provider in `prisma/schema.prisma`
Change:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```
To:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Optional, for direct migrations if using connection pooler
}
```

### Step 4: Deploy Schema to PostgreSQL
Run:
```bash
# Push schema directly or generate migrations:
npx prisma db push

# Or using Prisma Migrate:
npx prisma migrate deploy
```

### Step 5: Seed Default Administrative Account & Packages
Run:
```bash
npx prisma db seed
```
This populates:
1. Super Admin Account (`admin@lahzah.com` with role `ADMIN`).
2. Demo Event Owner Account (`ahmed@lahzah.com`).
3. The 3 Standard Wedding Packages (`BASIC`, `PREMIUM`, `LUXURY`).
4. Demo wedding invitation (`/e/ahmed-and-sara`).

---

## 4. Optional: Migrating Existing Development Data to PostgreSQL

If you wish to transfer local development data (`dev.db`) to the production PostgreSQL instance:

### Option A: Using `pgloader` (Automated CLI)
```bash
pgloader ./prisma/dev.db postgresql://user:password@host:5432/lahzah
```

### Option B: Export / Import via TypeScript Script
Create a backup export script:
```bash
npx tsx scripts/backup-data.ts
```
And import into PostgreSQL using Prisma Client.

---

## 5. Performance & Index Verification in Production

To verify that indexes are active in PostgreSQL, run in `psql`:
```sql
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Photo';
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Rsvp';
SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'Event';
```
You should see:
- `Photo_eventId_status_idx`
- `Photo_eventId_createdAt_idx`
- `Rsvp_eventId_attendanceStatus_idx`
- `Event_slug_idx`
- `PaymentTransaction_providerTxnId_key`
