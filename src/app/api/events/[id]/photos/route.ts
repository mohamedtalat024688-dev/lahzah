import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { PACKAGES } from "@/lib/packages";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`photo-upload:${ip}`, { windowMs: 5 * 60 * 1000, max: 40 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "تم تجاوز حد رفع الصور المسموح به مؤقتاً. يرجى الانتظار بضع دقائق." },
        { status: 429 }
      );
    }

    const { id: eventId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { photos: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (!event.isPublished) {
      return NextResponse.json({ error: "هذه المناسبة غير منشورة حالياً" }, { status: 403 });
    }

    // Check package photo limits
    const packageConfig = PACKAGES[event.packageTier] || PACKAGES.BASIC;
    if (event._count.photos >= packageConfig.photoLimit) {
      return NextResponse.json(
        {
          error: `تم استهلاك الحد الأقصى المسموح به لرفع الصور لهذه المناسبة (${packageConfig.photoLimit} صورة). يرجى من منظم الحفل ترقية الباقة لزيادة السعة.`,
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const guestName = (formData.get("guestName") as string) || "ضيف عزيز";
    const message = formData.get("message") as string | null;

    if (!file) {
      return NextResponse.json({ error: "يرجى اختيار صورة للرفع" }, { status: 400 });
    }

    // saveUploadedFile validates magic bytes & size
    const uploadResult = await saveUploadedFile(file);

    const newPhoto = await prisma.photo.create({
      data: {
        eventId,
        url: uploadResult.url,
        guestName: guestName.trim().slice(0, 80) || "ضيف عزيز",
        message: message ? message.trim().slice(0, 500) : null,
        status: "PENDING", // Enters pending state for owner moderation
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "شكراً لك! تم استلام صورتك وستظهر في المعرض فور اعتمادها من العروسين ❤️",
        photo: newPhoto,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Photo upload error:", error);
    const message = error instanceof Error ? error.message : "فشل رفع الصورة";
    const isValidationError =
      error instanceof Error &&
      (error.message.includes("حجم الصورة") ||
        error.message.includes("صيغة الملف") ||
        error.message.includes("غير صالحة") ||
        error.message.includes("غير مدعومة"));
    return NextResponse.json({ error: message }, { status: isValidationError ? 400 : 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");

    const user = await getCurrentUser();
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    const isOwner = user && (user.id === event.userId || user.role === "ADMIN");

    // Unpublished event access check
    if (!event.isPublished && !isOwner) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    // Public users can ONLY ever view APPROVED photos regardless of query params
    const filterStatus = isOwner && statusParam ? statusParam : isOwner ? undefined : "APPROVED";

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "100", 10)));
    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      prisma.photo.findMany({
        where: {
          eventId,
          ...(filterStatus ? { status: filterStatus } : {}),
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.photo.count({
        where: {
          eventId,
          ...(filterStatus ? { status: filterStatus } : {}),
        },
      }),
    ]);

    return NextResponse.json({
      photos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Fetch photos error:", error);
    return NextResponse.json({ error: "فشل استرجاع الصور" }, { status: 500 });
  }
}
