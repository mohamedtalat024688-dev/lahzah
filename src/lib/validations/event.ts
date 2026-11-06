import { z } from "zod";

// =========================================================================
// 1. DAY SCHEDULE ITINERARY SCHEMAS
// =========================================================================
export const ScheduleItemSchema = z.object({
  id: z.string().min(1),
  time: z.string().min(1).max(30),
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional().nullable(),
  location: z.string().max(120).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
});

export const ScheduleItemsArraySchema = z.array(ScheduleItemSchema).max(20);
export type ScheduleItem = z.infer<typeof ScheduleItemSchema>;

// =========================================================================
// 2. DRESS CODE SCHEMAS
// =========================================================================
export const DressCodeSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional().nullable(),
  preferredColors: z.array(z.string().max(40)).max(8).default([]),
  prohibitedColors: z.array(z.string().max(40)).max(8).default([]),
  imageUrl: z.string().max(500).optional().nullable(),
});

export type DressCode = z.infer<typeof DressCodeSchema>;

// =========================================================================
// 3. PRE-EVENT COUPLE PHOTOS SCHEMAS (WITH CAPTIONS)
// =========================================================================
export const CouplePhotoSchema = z.object({
  id: z.string().min(1),
  url: z.string().min(1).max(500),
  caption: z.string().max(300).optional().nullable(),
  order: z.number().int().default(0),
  isCover: z.boolean().default(false),
});

export const CouplePhotosArraySchema = z.array(CouplePhotoSchema).max(15);
export type CouplePhoto = z.infer<typeof CouplePhotoSchema>;

// =========================================================================
// 4. MUSIC CONFIG SCHEMAS
// =========================================================================
export const MusicConfigSchema = z.object({
  enabled: z.boolean().default(false),
  trackUrl: z.string().max(500).optional().nullable(),
  title: z.string().max(120).optional().nullable(),
  allowAutoplay: z.boolean().default(false),
});

export type MusicConfig = z.infer<typeof MusicConfigSchema>;

// =========================================================================
// 5. SECTION CONFIGURATION SCHEMAS (REORDERING & TOGGLEABILITY)
// =========================================================================
export const SectionConfigItemSchema = z.object({
  id: z.string().min(1).max(50),
  enabled: z.boolean().default(true),
  order: z.number().int(),
});

export const SectionsConfigArraySchema = z.array(SectionConfigItemSchema).max(25);
export type SectionConfigItem = z.infer<typeof SectionConfigItemSchema>;

// =========================================================================
// 6. TARGETED INVITATION SCHEMAS (DATABASE-BACKED TOKENS)
// =========================================================================
export const CreateGuestInviteSchema = z.object({
  guestName: z.string().min(1, "اسم الضيف مطلوب").max(100),
  phone: z.string().max(30).optional().nullable(),
  maxSeats: z.number().int().min(1, "يجب تحديد مقعد واحد على الأقل").max(20, "الحد الأقصى للمقاعد 20"),
});

export type CreateGuestInviteInput = z.infer<typeof CreateGuestInviteSchema>;

// =========================================================================
// SAFE PARSING & SERIALIZATION UTILITIES
// =========================================================================
export function parseScheduleItems(raw: string | null | undefined): ScheduleItem[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const res = ScheduleItemsArraySchema.safeParse(parsed);
    return res.success ? res.data : [];
  } catch {
    return [];
  }
}

export function parseDressCode(raw: string | null | undefined): DressCode | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const res = DressCodeSchema.safeParse(parsed);
    return res.success ? res.data : null;
  } catch {
    return null;
  }
}

export function parseCouplePhotos(raw: string | null | undefined): CouplePhoto[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const res = CouplePhotosArraySchema.safeParse(parsed);
    return res.success ? res.data : [];
  } catch {
    return [];
  }
}

export function parseMusicConfig(raw: string | null | undefined): MusicConfig | null {
  if (!raw) return null;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const res = MusicConfigSchema.safeParse(parsed);
    return res.success ? res.data : null;
  } catch {
    return null;
  }
}

export function parseSectionsConfig(raw: string | null | undefined): SectionConfigItem[] {
  if (!raw) return [];
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    const res = SectionsConfigArraySchema.safeParse(parsed);
    return res.success ? res.data : [];
  } catch {
    return [];
  }
}

