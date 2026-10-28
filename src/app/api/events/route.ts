import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TEMPLATES, isTemplateAllowedForPackage } from "@/lib/templates";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            rsvps: true,
            photos: true,
          },
        },
        rsvps: {
          select: {
            attendanceStatus: true,
            guestCount: true,
          },
        },
        photos: {
          select: {
            status: true,
          },
        },
      },
    });

    const enrichedEvents = events.map((event) => {
      const attendingCount = event.rsvps
        .filter((r) => r.attendanceStatus === "ATTENDING")
        .reduce((sum, r) => sum + (r.guestCount || 1), 0);

      const pendingPhotos = event.photos.filter((p) => p.status === "PENDING").length;
      const approvedPhotos = event.photos.filter((p) => p.status === "APPROVED").length;

      return {
        ...event,
        stats: {
          totalRsvps: event._count.rsvps,
          attendingGuests: attendingCount,
          pendingPhotos,
          approvedPhotos,
          totalPhotos: event._count.photos,
        },
      };
    });

    return NextResponse.json({ events: enrichedEvents });
  } catch (error) {
    console.error("Fetch events error:", error);
    return NextResponse.json({ error: "فشل استرجاع المناسبات" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول أولاً" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      eventType = "WEDDING",
      groomName,
      brideName,
      eventDate,
      venueName,
      address,
      mapUrl,
      welcomeMessage,
      description,
      slug: customSlug,
    } = body;

    if (!groomName || !brideName || !eventDate || !venueName) {
      return NextResponse.json(
        { error: "يرجى ملء جميع الحقول الأساسية: أسماء العروسين، تاريخ الحفل، واسم القاعة" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = customSlug?.trim() || `${groomName}-and-${brideName}`;
    baseSlug = baseSlug
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w\u0621-\u064A-]+/g, "")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug) {
      baseSlug = `event-${Date.now().toString(36)}`;
    }

    let slug = baseSlug;
    let counter = 1;
    while (await prisma.event.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Validate template selection & resolve matching tier
    let selectedTemplateId = body.templateId;
    let selectedPackageTier = body.packageTier && ["BASIC", "PREMIUM", "LUXURY"].includes(body.packageTier)
      ? body.packageTier
      : undefined;

    if (selectedTemplateId) {
      const tmpl = TEMPLATES[selectedTemplateId];
      if (!tmpl) {
        return NextResponse.json({ error: "القالب المختار غير موجود" }, { status: 400 });
      }

      if (selectedPackageTier) {
        if (!isTemplateAllowedForPackage(selectedTemplateId, selectedPackageTier)) {
          return NextResponse.json(
            {
              error: `القالب المختار (${tmpl.nameAr}) يتطلب باقة ${tmpl.tier}، بينما الباقة المحددة هي ${selectedPackageTier}. يرجى اختيار باقة متوافقة أو تغيير القالب.`,
              code: "TEMPLATE_ENTITLEMENT_MISMATCH",
              requiredTier: tmpl.tier,
              packageTier: selectedPackageTier,
            },
            { status: 400 }
          );
        }
      } else {
        // Derive package tier from template tier if not explicitly specified
        selectedPackageTier = tmpl.tier;
      }
    } else {
      // Template omitted: pick default compatible template
      if (selectedPackageTier === "BASIC") {
        selectedTemplateId = "ivory-minimal";
      } else {
        selectedTemplateId = "royal-gold";
        selectedPackageTier = selectedPackageTier || "PREMIUM";
      }
    }

    const newEvent = await prisma.event.create({
      data: {
        title: title || `حفل زفاف ${groomName} و ${brideName}`,
        eventType,
        groomName,
        brideName,
        eventDate: new Date(eventDate),
        venueName,
        address: address || venueName,
        mapUrl: mapUrl || null,
        welcomeMessage: welcomeMessage || "يسعدنا ويشرفنا حضوركم ومشاركتنا فرحتنا",
        description: description || null,
        templateId: selectedTemplateId,
        slug,
        userId: user.id,
        isPublished: false,
        isPaid: false,
        packageTier: selectedPackageTier,
      },
    });

    return NextResponse.json({ success: true, event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("Create event error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء المناسبة" }, { status: 500 });
  }
}
