# LAHZAH (لحظة) — MASTER TEMPLATE SYSTEM SPECIFICATION
## Permanent Template Design, Interaction, Customization & Guest Experience Standard

> **Document Status:** Permanent Standard & Official Project Architecture  
> **Applicability:** Applies to all templates, builders, invitations, guest touchpoints, and post-event experiences across the LAHZAH platform.  
> **Rule of Engagement:** Whenever a new template design, reference, or layout is added or refactored, it must strictly comply with this specification.

---

## 1. Core Philosophy: Every Template is a Complete Event Lifecycle Experience

Every template in LAHZAH is **not** a static card or a simple skin. It is an end-to-end, digital event experience encompassing 5 lifecycle stages:

1. **Before the Event (Host Configuration & Publishing):** The invitation is configured, personalized with custom content, sections reordered/toggled, previewed in real-time, paid, published, and shared via WhatsApp/links.
2. **First Guest Impression (The Opening Ritual):** When a guest opens the link on mobile or desktop, they encounter a unique, signature opening animation matching the template's artistic identity.
3. **Pre-Event Engagement (Exploration & Attendance):** The guest navigates through the couple's story, countdown, day schedule/itinerary, venue maps, dress code, background music, and confirms RSVP attendance.
4. **During the Event (Instant Memory Capture via QR):** The guest scans the printed table QR code or taps the invitation link to access a friction-free photo/note upload portal without requiring an account.
5. **Post-Event (Curated Living Memory Gallery):** The hosts moderate incoming photos via their dashboard (Approve / Reject). Once approved, memories appear in the template's own bespoke memory gallery layout.

---

## 2. Unique Opening Animation For Every Template

Each template must feature its own recognizable, signature opening ritual:
- **Examples:**
  - An envelope flap unsealing with wax emblem.
  - A multi-fold invitation unfolding with 3D paper depth.
  - A luxury card sliding smoothly from an embossed sleeve.
  - A botanical/floral reveal blooming outwards.
  - An editorial/cinematic gatefold curtain opening.
  - A royal arched entrance with gold filigree flourishes.

### Technical & UX Rules for Animations:
- **Zero Monoculture:** Never reuse the identical opening animation across distinct template archetypes.
- **Performance First:** 60fps hardware-accelerated animations (`transform`, `opacity`). Strictly avoid layout thrashing (`width`, `height`, `margin` transitions).
- **Reduced Motion Support:** Respect `prefers-reduced-motion: reduce`. When enabled, transition gracefully or offer instant reveal.
- **Replay & Skip:** Provide an accessible replay button, and ensure the animation never traps the guest or blocks reading content.
- **Touch-Native:** Built for mobile finger taps and swipes, never relying solely on desktop hover.

---

## 3. Flexible Content Model & Editorial Personalization

Content structure is separated from visual representation:

### Supported Data Attributes:
- **Names & Honorifics:** Groom name, Bride name, Celebrant name (for non-wedding events: Henna, Katb Kitab, Fatiha, Birthday, Sebou, Graduation), parents/family names, and custom honorifics.
- **Date, Time & Countdown:** Hijri/Gregorian date, start time, reception time, end time, and live countdown timer.
- **Locations & Stages:** Venue name, full address, Google Maps coordinate link, and stage-specific locations (e.g. Ceremony venue vs. Reception hall).
- **Invitation Message & Phrasing:** Customizable phrasing presets (Formal Arabic, Romantic, Religious/Quranic, Modern minimalist, or custom free-form host text).
- **Visual Presentation Autonomy:** A template has complete design freedom over how these fields are arranged (centered, asymmetrical editorial, split-column, timeline-integrated, or arch-framed).

---

## 4. Couple Photos & Image Presentations

Templates specify their photo capability matrix:
- **Modes:** `no-photos` | `single-portrait` | `dual-portrait` | `editorial-duo` | `gallery-slideshow` | `background-ambient`.
- **Host Capabilities:** Upload, replace, crop/reorder, set focal cover photo, and toggle photo frame styling.
- **Conditional Visibility:** If a template or event does not use photos, all photo containers and dashboard photo uploaders for cover imagery collapse completely without leaving awkward layout gaps.

---

## 5. Event Itinerary & Day Schedule

- Optional multi-stage schedule containing:
  - Time tag (e.g., 6:00 PM)
  - Activity title (e.g., استقبال الضيوف، كتب الكتاب، زفة العروسين، العشاء)
  - Description / notes
  - Stage location (if different)
  - Visual icon / glyph
- **Template-Specific Visual Presentation:** Vertical timeline with connecting hairline, horizontal sliding cards, minimalist agenda list, or royal ceremonial step milestones.
- Collapses completely when empty.

---

## 6. Dress Code & Guest Guidance

- Optional dress code configuration:
  - Title (e.g., رسمي فاخر، Black Tie، ألوان الباستيل، زي تقليدي)
  - Guidance text & recommendations
  - Color palette swatches (preferred tones)
  - Tones to avoid (e.g., White for wedding guests)
- Collapses completely when disabled or empty.

---

## 7. Ambient Music Experience

- **Host Controls:** Enable/disable music, select authorized classical/oriental audio tracks, or upload custom audio.
- **Mobile Autoplay Compliance:** Modern mobile browsers strictly block unprompted audio autoplay. The system must:
  - Respect browser audio autoplay restrictions without breaking or throwing runtime errors.
  - Present an elegant, floating, non-intrusive sound toggle (Play / Pause / Volume).
  - Stop playback cleanly upon page unmount or navigation.
  - Never gate invitation reading behind audio playback.

---

## 8. Smooth Auto-Scroll & Reading Mode

- Optional feature allowing guests to experience the invitation like a film reel.
- **Behavioral Safeguards:**
  - Clear floating control (Start / Pause Auto-Scroll).
  - Instant deceleration/cancellation when guest touches or scrolls the screen manually.
  - Zero interference with interactive forms (RSVP, text inputs, lightbox).
  - Automatically disabled when `prefers-reduced-motion` is active.

---

## 9. Religious Texts & Cultural Calligraphy

- Support for Quranic verses (e.g., آية المودة والرحمة: «وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا...»), Basmala calligraphy, Du'aa, or secular celebration phrases.
- Placement options: Top header crest, below names, or bottom benediction.
- **Integrity Rule:** Quranic texts must preserve verified diacritics and correct Quranic script; never truncate or paraphrase verses.
- Entirely optional and toggleable by the host.

---

## 10. Robust Mobile-First RSVP Engine

- **Guest Experience:**
  - One-click attendance status: حاضر بإذن الله (Attending) / معتذر بكل حب (Declining) / ربما (Maybe).
  - Name and phone/WhatsApp number.
  - Accompanying guest count (enforcing host-defined seat quotas).
  - Personal congratulatory note.
  - Immediate celebratory confirmation state (e.g., confetti / benediction card).
- **Backend & Host Safeguards:**
  - Strict server-side validation on maximum allowed companion seats.
  - Debounce and anti-spam rate limiting.
  - Real-time attendance rollup in host dashboard.
  - Template-matching visual button and modal theme (accent colors, typography, textures).

---

## 11. Event QR Code & Guest Photo Uploading

- **Physical-to-Digital Connection:**
  - Unique QR code linking to `/e/[slug]/upload`.
  - Exportable printable card format for table placements (e.g., 4x6" table tents).
- **Guest Upload Flow:**
  - Frictionless mobile experience: no sign-up or app installation required.
  - Direct camera capture or gallery selection.
  - Optional guest name and heartfelt wish.
  - File format authentication (JPEG, PNG, WebP, HEIC conversion support) with magic-byte validation.
  - Client & server size limits (12MB max per image) with sliding-window upload rate limiting.
  - Enters `PENDING` moderation queue immediately.

---

## 12. Host Moderation Desk

- Private host studio (`/dashboard/events/[id]`):
  - Tabular and visual review of all incoming guest uploads.
  - 1-click **Approve** (نشر بالمعرض) or **Reject** (رفض / استبعاد).
  - Permanent delete with physical storage file cleanup.
- **Security Invariant:** Zero unapproved photos can ever appear in the public gallery or leak through API endpoints to unauthenticated guests.

---

## 13. Bespoke Memory Gallery per Template

- Every template defines its own living post-event gallery layout:
  - *Royal Archetype:* Framed oil-canvas style gallery with gold hairline trims and serif typography.
  - *Botanical Archetype:* Organic masonry with soft floral accents and warm parchment glow.
  - *Minimalist Archetype:* High-fashion editorial grid with clean negative space.
  - *Vintage Archetype:* Polaroid-inspired pinboard with handwritten-style captions.
- Includes touch-friendly Lightbox viewer with pinch-to-zoom, download original, and social share.

---

## 14. Section Customization & Drag-and-Drop Reordering

- **Host Freedom:**
  - Reorder invitation sections (e.g., move Schedule before Venue, or Countdown to the top).
  - Toggle visibility of optional sections (Hide Dress Code, Hide Countdown, etc.).
  - Add supported sections from the template's section catalog.
  - 1-click "Reset to Template Default" layout.
- **Architectural Principle:** Visual styles remain encapsulated inside template components, while section ordering and toggle states reside in structured configuration (`sectionsOrder`, `hiddenSections`).

---

## 15. Mobile-First Engineering Standard

- 90%+ of guests arrive via WhatsApp links on iOS and Android devices.
- **Hard Constraints:**
  - Minimum 44x44px touch targets on all interactive elements.
  - Zero horizontal page overflow (`overflow-x: clip / hidden`).
  - Native RTL text alignment and Arabic font rendering (`Amiri`, `Alexandria`, `Tajawal`, or system fonts).
  - Responsive validation at standard viewport widths: 360px, 390px, 414px, 430px, 768px, and 1280px+.
  - Lazy loading of heavy image assets below the fold.

---

## 16. Permanent Template Interface Architecture

Every new template must provide a configuration adhering to the following structure:

```typescript
export interface TemplateDefinition {
  id: string;                         // Unique UUID or slug
  nameAr: string;                     // e.g. "الملكي الذهبي"
  nameEn: string;                     // e.g. "Royal Gold"
  tier: "BASIC" | "PREMIUM" | "LUXURY";
  style: "classic" | "botanical" | "romantic" | "minimal" | "heritage" | "couture" | "aristocratic" | "craft";
  eventTypes: EventType[];            // Supported occasions
  
  // Visual Theme & Paper Physics
  theme: {
    background: string;
    cardBackground: string;
    accentColor: string;
    accentGradient: string;
    textColor: string;
    subtitleColor: string;
    borderColor: string;
    buttonClass: string;
    paperClass: string;
    isLight: boolean;
  };
  
  // Signature Opening Ritual
  openingAnimation: {
    type: "envelope-wax" | "folded-unfold" | "sleeve-slide" | "botanical-bloom" | "curtain-reveal" | "arched-doors";
    durationMs: number;
    sealIcon?: string;
  };

  // Capabilities & Defaults
  capabilities: {
    supportsPhotos: boolean;
    maxPhotos: number;
    supportsMusic: boolean;
    supportsSchedule: boolean;
    supportsDressCode: boolean;
    supportsAutoScroll: boolean;
    galleryStyle: "editorial-grid" | "masonry" | "polaroid" | "carousel" | "filmstrip";
  };

  // Default Section Architecture
  defaultSections: Array<{
    id: TemplateSectionId;
    titleAr: string;
    isRequired: boolean;
    isEnabledDefault: boolean;
  }>;
}
```

---

## 17. New Template Ingestion Workflow (Standard Operating Procedure)

Whenever a new template design/reference is provided:
1. **Analyze:** Deconstruct color scheme, typography, frame ornaments, opening metaphor, and photo treatment.
2. **Propose:** Present the proposed opening animation, section arrangement, RSVP styling, and gallery layout for user approval.
3. **Reuse vs. Build:** Leverage shared infrastructure (Prisma models, RSVP API, QR engine, Storage provider, Rate limiter) and build only the template's unique visual presentation and animation components.
4. **Implement:** Create the template config, animation component, card renderer, and bespoke gallery layout.
5. **Verify:** Test across mobile (360px-430px), desktop, reduced motion, RSVP submission, QR scan & upload flow, and photo moderation.
6. **Report:** Deliver a structured audit report detailing implementation status, reused assets, and performance metrics.

