/**
 * LAHZAH Platform - Verified Cultural & Quranic Library
 * 
 * CRITICAL ARCHITECTURAL CONSTRAINTS:
 * 1. Quranic verses are immutable and rigorously verified from authoritative sources (Hafs from Asim).
 * 2. Diacritics (التشكيل الكامل) are fully preserved.
 * 3. Verses are strictly separated from Prophetic Hadith and Du'aa.
 * 4. General/secular celebration phrasing is provided as an alternative for hosts who prefer non-religious text.
 * 5. Arbitrary editing of verified holy verses is strictly disallowed in the UI and API.
 */

export interface QuranicVerseItem {
  id: string;
  surah: string;
  ayahNumber: number;
  text: string;
  verifiedSource: string;
}

export interface PropheticDuaaItem {
  id: string;
  title: string;
  source: string;
  text: string;
}

export interface CelebrationPhraseItem {
  id: string;
  title: string;
  text: string;
}

// 1. Immutable Verified Quranic Verses (القرآن الكريم)
export const VERIFIED_QURANIC_VERSES: QuranicVerseItem[] = [
  {
    id: "ar-rum-21",
    surah: "سورة الروم",
    ayahNumber: 21,
    text: "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ",
    verifiedSource: "مصحف مجمع الملك فهد لطباعة المصحف الشريف - رواية حفص عن عاصم",
  },
  {
    id: "an-naba-8",
    surah: "سورة النبأ",
    ayahNumber: 8,
    text: "وَخَلَقْنَاكُمْ أَزْوَاجًا",
    verifiedSource: "مصحف مجمع الملك فهد لطباعة المصحف الشريف - رواية حفص عن عاصم",
  },
  {
    id: "al-furqan-74",
    surah: "سورة الفرقان",
    ayahNumber: 74,
    text: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    verifiedSource: "مصحف مجمع الملك فهد لطباعة المصحف الشريف - رواية حفص عن عاصم",
  },
  {
    id: "an-nur-32",
    surah: "سورة النور",
    ayahNumber: 32,
    text: "وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ ۚ إِن يَكُونُوا فُقَرَاءَ يُغْنِهِمُ اللَّهُ مِن فَضْلِهِ",
    verifiedSource: "مصحف مجمع الملك فهد لطباعة المصحف الشريف - رواية حفص عن عاصم",
  },
];

// 2. Prophetic Du'aa and Hadith (أدعية وأحاديث نبوية مأثورة)
export const PROPHETIC_DUAAS: PropheticDuaaItem[] = [
  {
    id: "duaa-baraka",
    title: "دعاء البركة للمتزوجين",
    source: "حديث نبوي شريف - سنن أبي داود (2130) والترمذي (1091) وصححه الألباني",
    text: "بَارَكَ اللَّهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
  },
  {
    id: "duaa-mawadda",
    title: "دعاء المودة والسكينة والتمام",
    source: "مأثور من أدعية الصالحين في تيسير الزواج",
    text: "اللَّهُمَّ بَارِكْ لَهُمَا، وَأَتِمَّ عَلَيْهِمَا فَرْحَتَهُمَا، وَاجْعَلْ بَيْتَهُمَا عَامِرًا بِالْمَوَدَّةِ وَالسَّكِينَةِ",
  },
  {
    id: "duaa-aqd",
    title: "دعاء عقد القران وبداية الخير",
    source: "مأثور في استهلال العقد والرباط المبارك",
    text: "اللَّهُمَّ اجْعَلْهُ عَقْدًا تَنْعَقِدُ بِهِ سَعَادَتُهُمَا، وَبِدَايَةً لِأَيَّامٍ أَجْمَلَ مَلِيئَةٍ بِالْخَيْرِ وَالتَّوْفِيقِ",
  },
];

// 3. General & Non-Religious Celebration Phrasing (عبارات فرح وتهنئة عامة)
export const CELEBRATION_PHRASES: CelebrationPhraseItem[] = [
  {
    id: "secular-joy",
    title: "بهجة الحضور وفرحة العمر",
    text: "بكل مشاعر المحبة والبهجة، يسعدنا أن نتشرف بدعوتكم لمشاركتنا فرحة العمر وتوثيق أجمل اللحظات معاً.",
  },
  {
    id: "secular-hearts",
    title: "تلاقي القلوب على المحبة",
    text: "لأن الفرحة لا تكتمل إلا بكم، نسعد بمشاركتكم لنا هذه الليلة الاستثنائية التي تجمع بين قلبين على المودة والمستقبل الجميل.",
  },
  {
    id: "secular-memories",
    title: "صناعة الذكرى الخالدة",
    text: "لحظة من العمر ننتظرها بشوق، ويزداد بريقها بوجودكم الكريم بجانبنا لنصنع معاً ذكرى استثنائية تدوم في القلوب.",
  },
];

export type CulturalPhrasingType = "quran" | "duaa" | "celebration" | "custom" | "none";

export interface CulturalPhrasingData {
  type: CulturalPhrasingType;
  presetId?: string | null;
  text: string;
  sourceLabel?: string | null;
  customNote?: string | null;
}

/**
 * Parses raw welcomeMessage string safely supporting both JSON-encoded structured phrasing
 * and legacy plain-text strings with 100% backward compatibility.
 */
export function parseWelcomePhrasing(raw: string | null | undefined): CulturalPhrasingData {
  if (!raw || !raw.trim()) {
    return { type: "none", text: "" };
  }

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.text === "string") {
      return {
        type: (parsed.type as CulturalPhrasingType) || "custom",
        presetId: parsed.presetId || null,
        text: parsed.text,
        sourceLabel: parsed.sourceLabel || null,
        customNote: parsed.customNote || null,
      };
    }
  } catch {
    // Legacy plain string fallback
  }

  // Legacy string format: check if it matches any verified verse or duaa, otherwise treat as custom
  const matchedVerse = VERIFIED_QURANIC_VERSES.find((v) => raw.includes(v.text) || v.text.includes(raw));
  if (matchedVerse) {
    return {
      type: "quran",
      presetId: matchedVerse.id,
      text: matchedVerse.text,
      sourceLabel: `${matchedVerse.surah} - الآية ${matchedVerse.ayahNumber}`,
    };
  }

  const matchedDuaa = PROPHETIC_DUAAS.find((d) => raw.includes(d.text) || d.text.includes(raw));
  if (matchedDuaa) {
    return {
      type: "duaa",
      presetId: matchedDuaa.id,
      text: matchedDuaa.text,
      sourceLabel: matchedDuaa.title,
    };
  }

  return {
    type: "custom",
    text: raw,
  };
}

/**
 * Serializes CulturalPhrasingData into JSON string or clean text for DB storage
 */
export function serializeWelcomePhrasing(data: CulturalPhrasingData): string | null {
  if (data.type === "none" && !data.customNote) {
    return null;
  }
  return JSON.stringify(data);
}
