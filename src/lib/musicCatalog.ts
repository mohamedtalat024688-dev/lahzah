/**
 * LAHZAH Platform - Commercially Verified Royalty-Free Music Catalog
 * 
 * CRITICAL COMPLIANCE NOTICE:
 * All tracks listed below are verified Public Domain (CC0) compositions and recordings,
 * self-hosted directly within the LAHZAH application under `/audio/` to guarantee
 * zero external CDN dependencies, zero hotlinking restrictions, zero CORS issues,
 * and 100% compliant commercial playback rights for digital wedding invitations.
 */

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  url: string;
  license: string;
  source: string;
  description: string;
  tags: string[];
}

export const VERIFIED_ROYALTY_FREE_TRACKS: MusicTrack[] = [
  {
    id: "mendelssohn-wedding-march",
    title: "مارش الزفاف الملكي (Mendelssohn Wedding March)",
    artist: "Felix Mendelssohn / European Archive",
    url: "/audio/wedding-march-mendelssohn.mp3",
    license: "Public Domain / Creative Commons CC0 (Unrestricted commercial use)",
    source: "https://commons.wikimedia.org/wiki/File:A_Midsummer_Night%27s_Dream_Op._61_Wedding_March_(Mendelssohn)_European_Archive.ogg",
    description: "المارش الأوركسترالي الكلاسيكي الأشهر لزفة ومراسم دخول العروسين، يضفي هيبة وفخامة ملكية متكاملة.",
    tags: ["أوركسترا", "كلاسيكي", "مارش الزفاف", "ملكي"],
  },
  {
    id: "canon-in-d",
    title: "كانون في سلم ري الكبير (Pachelbel's Canon in D)",
    artist: "Johann Pachelbel / European Archive",
    url: "/audio/canon-in-d-pachelbel.mp3",
    license: "Public Domain / Creative Commons CC0 (Unrestricted commercial use)",
    source: "https://commons.wikimedia.org/wiki/File:Pachelbel%27s_Canon.ogg",
    description: "أشهر مقطوعة وترية رومانسية هادئة تعزف في مطلع الأعراس الكلاسيكية، وتمنح تصفح الدعوة جواً شاعرياً دافئاً.",
    tags: ["أوتار", "شاعري", "بيانو", "رومانسي"],
  },
  {
    id: "bridal-chorus-wagner",
    title: "كورال العروس المباركة (Wagner Bridal Chorus)",
    artist: "Richard Wagner / European Archive",
    url: "/audio/bridal-chorus-wagner.mp3",
    license: "Public Domain / Creative Commons CC0 (Unrestricted commercial use)",
    source: "https://commons.wikimedia.org/wiki/File:Wagner_Bridal_Chorus.ogg",
    description: "اللحن التراثي العالمي الشهير لطلة العروسين وبداية حفل الزفاف، يجمع بين الوقار والأناقة العريقة.",
    tags: ["كلاسيكي", "زفة", "تراثي", "طلة العروس"],
  },
];
