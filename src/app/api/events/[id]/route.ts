import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateQrDataUrl } from "@/lib/qr";
import { deleteUploadedFile } from "@/lib/storage";
import { TEMPLATES, isTemplateAllowedForPackage } from "@/lib/templates";
import {
  ScheduleItemsArraySchema,
  DressCodeSchema,
  CouplePhotosArraySchema,
  MusicConfigSchema,
  SectionsConfigArraySchema,
  parseScheduleItems,
  parseDressCode,
  parseCouplePhotos,
  parseMusicConfig,
  parseSectionsConfig,
} from "@/lib/validations/event";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        rsvps: {
          orderBy: { createdAt: "desc" },
        },
        photos: {
          orderBy: { createdAt: "desc" },
        },
        guestInvites: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بالوصول لهذه المناسبة" }, { status: 403 });
    }

    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const uploadUrl = `${hostUrl}/e/${event.slug}/upload`;
    const invitationUrl = `${hostUrl}/e/${event.slug}`;
    const qrDataUrl = await generateQrDataUrl(uploadUrl);

    return NextResponse.json({
      event: {
        ...event,
        parsedScheduleItems: parseScheduleItems(event.scheduleItems),
        parsedDressCode: parseDressCode(event.dressCode),
        parsedCouplePhotos: parseCouplePhotos(event.couplePhotos),
        parsedMusicConfig: parseMusicConfig(event.musicConfig),
        parsedSectionsConfig: parseSectionsConfig(event.sectionsConfig),
      },
      urls: {
        invitation: invitationUrl,
        upload: uploadUrl,
        qr: qrDataUrl,
      },
    });
  } catch (error) {
    console.error("Get event error:", error);
    return NextResponse.json({ error: "فشل استرجاع بيانات المناسبة" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (existing.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بتعديل هذه المناسبة" }, { status: 403 });
    }

    // SERVER/API Security: Prevent publishing an unpaid event
    if (body.isPublished === true && !existing.isPaid) {
      return NextResponse.json(
        { error: "لا يمكن نشر الدعوة قبل سداد قيمة الباقة وتفعيل الاشتراك" },
        { status: 402 }
      );
    }

    // SERVER/API Security: Validate template entitlement derived strictly from trusted DB packageTier
    if (body.templateId !== undefined && body.templateId !== existing.templateId) {
      const tmpl = TEMPLATES[body.templateId];
      if (!tmpl) {
        return NextResponse.json({ error: "القالب المختار غير موجود" }, { status: 400 });
      }

      if (!isTemplateAllowedForPackage(body.templateId, existing.packageTier)) {
        return NextResponse.json(
          {
            error: `القالب المختار (${tmpl.nameAr}) يتطلب باقة ${tmpl.tier}، بينما باقة المناسبة الحالية هي ${existing.packageTier}. يرجى ترقية الباقة لاستخدام هذا القالب.`,
            code: "TEMPLATE_ENTITLEMENT_REQUIRED",
            requiredTier: tmpl.tier,
            currentTier: existing.packageTier,
          },
          { status: 403 }
        );
      }
    }

    // Phase 1 Schema Validations (Zod)
    let validatedScheduleItems = existing.scheduleItems;
    if (body.scheduleItems !== undefined) {
      if (body.scheduleItems === null) {
        validatedScheduleItems = null;
      } else {
        const parsed = typeof body.scheduleItems === "string" ? JSON.parse(body.scheduleItems) : body.scheduleItems;
        const result = ScheduleItemsArraySchema.safeParse(parsed);
        if (!result.success) {
          return NextResponse.json(
            { error: "بيانات جدول الحفل غير صالحة", details: result.error.format() },
            { status: 400 }
          );
        }
        validatedScheduleItems = JSON.stringify(result.data);
      }
    }

    let validatedDressCode = existing.dressCode;
    if (body.dressCode !== undefined) {
      if (body.dressCode === null) {
        validatedDressCode = null;
      } else {
        const parsed = typeof body.dressCode === "string" ? JSON.parse(body.dressCode) : body.dressCode;
        const result = DressCodeSchema.safeParse(parsed);
        if (!result.success) {
          return NextResponse.json(
            { error: "بيانات كود الملابس غير صالحة", details: result.error.format() },
            { status: 400 }
          );
        }
        validatedDressCode = JSON.stringify(result.data);
      }
    }

    let validatedCouplePhotos = existing.couplePhotos;
    if (body.couplePhotos !== undefined) {
      if (body.couplePhotos === null) {
        validatedCouplePhotos = null;
      } else {
        const parsed = typeof body.couplePhotos === "string" ? JSON.parse(body.couplePhotos) : body.couplePhotos;
        const result = CouplePhotosArraySchema.safeParse(parsed);
        if (!result.success) {
          return NextResponse.json(
            { error: "بيانات صور العروسين غير صالحة", details: result.error.format() },
            { status: 400 }
          );
        }
        validatedCouplePhotos = JSON.stringify(result.data);
      }
    }

    let validatedMusicConfig = existing.musicConfig;
    if (body.musicConfig !== undefined) {
      if (body.musicConfig === null) {
        validatedMusicConfig = null;
      } else {
        const parsed = typeof body.musicConfig === "string" ? JSON.parse(body.musicConfig) : body.musicConfig;
        const result = MusicConfigSchema.safeParse(parsed);
        if (!result.success) {
          return NextResponse.json(
            { error: "إعدادات الموسيقى غير صالحة", details: result.error.format() },
            { status: 400 }
          );
        }
        validatedMusicConfig = JSON.stringify(result.data);
      }
    }

    let validatedSectionsConfig = existing.sectionsConfig;
    if (body.sectionsConfig !== undefined) {
      if (body.sectionsConfig === null) {
        validatedSectionsConfig = null;
      } else {
        const parsed = typeof body.sectionsConfig === "string" ? JSON.parse(body.sectionsConfig) : body.sectionsConfig;
        const result = SectionsConfigArraySchema.safeParse(parsed);
        if (!result.success) {
          return NextResponse.json(
            { error: "تنسيق ترتيب الأقسام غير صالح", details: result.error.format() },
            { status: 400 }
          );
        }
        validatedSectionsConfig = JSON.stringify(result.data);
      }
    }

    let validatedDefaultMaxSeats = existing.defaultMaxSeats;
    if (body.defaultMaxSeats !== undefined) {
      const parsed = parseInt(body.defaultMaxSeats, 10);
      if (isNaN(parsed) || parsed < 1 || parsed > 20) {
        return NextResponse.json(
          { error: "الحد الأقصى للمقاعد الافتراضية يجب أن يكون بين 1 و 20" },
          { status: 400 }
        );
      }
      validatedDefaultMaxSeats = parsed;
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        eventType: body.eventType ?? existing.eventType,
        groomName: body.groomName ?? existing.groomName,
        brideName: body.brideName ?? existing.brideName,
        eventDate: body.eventDate ? new Date(body.eventDate) : existing.eventDate,
        venueName: body.venueName ?? existing.venueName,
        address: body.address ?? existing.address,
        mapUrl: body.mapUrl !== undefined ? body.mapUrl : existing.mapUrl,
        welcomeMessage: body.welcomeMessage ?? existing.welcomeMessage,
        description: body.description !== undefined ? body.description : existing.description,
        templateId: body.templateId ?? existing.templateId,
        isPublished: body.isPublished !== undefined ? body.isPublished : existing.isPublished,
        scheduleItems: validatedScheduleItems,
        dressCode: validatedDressCode,
        couplePhotos: validatedCouplePhotos,
        musicConfig: validatedMusicConfig,
        sectionsConfig: validatedSectionsConfig,
        defaultMaxSeats: validatedDefaultMaxSeats,
      },
    });

    return NextResponse.json({
      success: true,
      event: {
        ...updated,
        parsedScheduleItems: parseScheduleItems(updated.scheduleItems),
        parsedDressCode: parseDressCode(updated.dressCode),
        parsedCouplePhotos: parseCouplePhotos(updated.couplePhotos),
        parsedMusicConfig: parseMusicConfig(updated.musicConfig),
        parsedSectionsConfig: parseSectionsConfig(updated.sectionsConfig),
      },
    });
  } catch (error) {
    console.error("Update event error:", error);
    return NextResponse.json({ error: "فشل تحديث بيانات المناسبة" }, { status: 500 });
  }
}

export const PATCH = PUT;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (existing.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    // Clean up physical photo assets from storage (S3/local)
    const photos = await prisma.photo.findMany({
      where: { eventId: id },
      select: { url: true },
    });

    for (const p of photos) {
      if (p.url) {
        await deleteUploadedFile(p.url).catch(() => {});
      }
    }

    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "تم حذف المناسبة وجميع وسائطها بنجاح" });
  } catch (error) {
    console.error("Delete event error:", error);
    return NextResponse.json({ error: "فشل حذف المناسبة" }, { status: 500 });
  }
}
