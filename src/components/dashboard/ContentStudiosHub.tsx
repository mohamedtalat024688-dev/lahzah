"use client";

import React, { useState } from "react";
import {
  Clock,
  Shirt,
  Heart,
  BookOpen,
  Music,
} from "lucide-react";
import ScheduleManager from "./ScheduleManager";
import DressCodeStudio from "./DressCodeStudio";
import CouplePhotosStudio from "./CouplePhotosStudio";
import CulturalPhrasingSelector from "./CulturalPhrasingSelector";
import MusicStudio from "./MusicStudio";
import {
  ScheduleItem,
  DressCode,
  CouplePhoto,
  MusicConfig,
} from "@/lib/validations/event";

export type ContentStudioId =
  | "schedule"
  | "dresscode"
  | "couple-photos"
  | "cultural"
  | "music";

interface ContentStudiosHubProps {
  event: {
    id: string;
    slug: string;
    title: string;
    welcomeMessage?: string | null;
    parsedScheduleItems?: ScheduleItem[];
    parsedDressCode?: DressCode | null;
    parsedCouplePhotos?: CouplePhoto[];
    parsedMusicConfig?: MusicConfig | null;
  };
  onEventUpdated?: () => void;
}

export default function ContentStudiosHub({
  event,
  onEventUpdated,
}: ContentStudiosHubProps) {
  const [activeStudio, setActiveStudio] = useState<ContentStudioId>(() => {
    if (typeof window !== "undefined") {
      const studio = new URLSearchParams(window.location.search).get("studio");
      if (
        studio === "schedule" ||
        studio === "dresscode" ||
        studio === "couple-photos" ||
        studio === "cultural" ||
        studio === "music"
      ) {
        return studio as ContentStudioId;
      }
    }
    return "schedule";
  });

  const handleStudioChange = (id: ContentStudioId) => {
    setActiveStudio(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("studio", id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const scheduleCount = event.parsedScheduleItems?.length ?? 0;
  const photosCount = event.parsedCouplePhotos?.length ?? 0;
  const isMusicActive = event.parsedMusicConfig?.enabled !== false;
  const isDressCodeActive = !!event.parsedDressCode?.title;
  const isCulturalActive = !!event.welcomeMessage;

  const studios = [
    {
      id: "schedule" as const,
      label: "جدول الحفل",
      subLabel: "المحطات والتوقيت",
      icon: Clock,
      badge: scheduleCount > 0 ? `${scheduleCount} محطات` : undefined,
    },
    {
      id: "dresscode" as const,
      label: "قواعد وألوان الزي",
      subLabel: "Dress Code والممنوعات",
      icon: Shirt,
      badge: isDressCodeActive ? "محدد" : undefined,
    },
    {
      id: "couple-photos" as const,
      label: "صور العروسين",
      subLabel: "الألبوم وقصة البداية",
      icon: Heart,
      badge: photosCount > 0 ? `${photosCount} صور` : undefined,
    },
    {
      id: "cultural" as const,
      label: "الآيات والنصوص",
      subLabel: "القرآن، الأدعية، التهنئة",
      icon: BookOpen,
      badge: isCulturalActive ? "محدد" : undefined,
    },
    {
      id: "music" as const,
      label: "الموسيقى والخلفية",
      subLabel: "المقطوعات المرخصة",
      icon: Music,
      badge: isMusicActive ? "مفعل" : "معطل",
    },
  ];

  return (
    <div className="space-y-6" data-testid="content-studios-hub">
      {/* Studio Selector Pills Bar */}
      <div className="p-2 rounded-2xl bg-[#FFFDFC] border border-[#EFE4DC] shadow-sm flex items-center gap-2 overflow-x-auto">
        {studios.map((s) => {
          const Icon = s.icon;
          const isActive = activeStudio === s.id;
          return (
            <button
              key={s.id}
              type="button"
              data-testid={`subtab-${s.id}`}
              onClick={() => handleStudioChange(s.id)}
              className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
                isActive
                  ? "bg-[#790D20] text-white shadow-sm"
                  : "bg-[#FAF6F2] text-[#8C7772] hover:text-[#390E19] hover:bg-white border border-[#EFE4DC]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <div className="text-right">
                <span className="block font-bold">{s.label}</span>
              </div>
              {s.badge && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#EFE4DC] text-[#790D20]"
                  }`}
                >
                  {s.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Studio View */}
      <div className="transition-all">
        {activeStudio === "schedule" && (
          <ScheduleManager
            eventId={event.id}
            initialItems={event.parsedScheduleItems || []}
            onSaveSuccess={() => onEventUpdated?.()}
          />
        )}

        {activeStudio === "dresscode" && (
          <DressCodeStudio
            eventId={event.id}
            initialDressCode={event.parsedDressCode || null}
            onSaveSuccess={() => onEventUpdated?.()}
          />
        )}

        {activeStudio === "couple-photos" && (
          <CouplePhotosStudio
            eventId={event.id}
            initialPhotos={event.parsedCouplePhotos || []}
            onSaveSuccess={() => onEventUpdated?.()}
          />
        )}

        {activeStudio === "cultural" && (
          <CulturalPhrasingSelector
            eventId={event.id}
            initialWelcomeMessage={event.welcomeMessage}
            onSaveSuccess={() => onEventUpdated?.()}
          />
        )}

        {activeStudio === "music" && (
          <MusicStudio
            eventId={event.id}
            initialMusicConfig={event.parsedMusicConfig}
            onSaveSuccess={() => onEventUpdated?.()}
          />
        )}
      </div>
    </div>
  );
}
