/**
 * LAHZAH Platform - Commercially Verified Royalty-Free Music Catalog
 * 
 * CRITICAL COMPLIANCE NOTICE:
 * All tracks listed below are sourced from royalty-free libraries under confirmed
 * free commercial licensing terms (Mixkit Stock Music License / CC0), granting rights
 * to embed and playback in commercial digital wedding invitations without attribution requirements.
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
    id: "romantic-moment",
    title: "لحظات رومانسية هادئة (Romantic Moment)",
    artist: "Mixkit Stock Music",
    url: "https://assets.mixkit.co/music/preview/mixkit-romantic-moment-1110.mp3",
    license: "Mixkit Free Commercial License (Permitted for commercial web projects, no royalties)",
    source: "https://mixkit.co/free-stock-music/",
    description: "مقطوعة بيانو هادئة وأوتار رومانسية ناعمة مناسبة لمراسم الزفاف والدعوات الرقمية الفاخرة.",
    tags: ["بيانو", "رومانسي", "هادئ"],
  },
  {
    id: "serene-strings",
    title: "أوتار كلاسيكية حالمة (Dreamy Strings)",
    artist: "Mixkit Stock Music",
    url: "https://assets.mixkit.co/music/preview/mixkit-serene-view-443.mp3",
    license: "Mixkit Free Commercial License (Permitted for commercial web projects, no royalties)",
    source: "https://mixkit.co/free-stock-music/",
    description: "أنغام وترية كلاسيكية تضفي طابعاً ملكياً ودفئاً على تصفح الدعوة وتوثيق اللحظات.",
    tags: ["أوتار", "كلاسيكي", "ملكي"],
  },
  {
    id: "arabic-oud",
    title: "أنغام العود الشرقي الأصيل (Warm Arabic Oud)",
    artist: "Mixkit Stock Music",
    url: "https://assets.mixkit.co/music/preview/mixkit-delicate-touch-576.mp3",
    license: "Mixkit Free Commercial License (Permitted for commercial web projects, no royalties)",
    source: "https://mixkit.co/free-stock-music/",
    description: "مقطوعة عود دافئة ولمسات وترية شرقية تناسب طابع الأعراس العربية والتراثية الفاخرة.",
    tags: ["عود", "شرقي", "تراثي"],
  },
  {
    id: "gentle-piano",
    title: "بيانو وتشيلو رقيق (Gentle Seraph)",
    artist: "Mixkit Stock Music",
    url: "https://assets.mixkit.co/music/preview/mixkit-spirit-of-the-seraph-1090.mp3",
    license: "Mixkit Free Commercial License (Permitted for commercial web projects, no royalties)",
    source: "https://mixkit.co/free-stock-music/",
    description: "لحن انسيابي رقيق يمنح تجربة تصفح هادئة وخالدة تناسب مختلف تصميمات القوالب.",
    tags: ["بيانو", "تشيلو", "ناعم"],
  },
];
