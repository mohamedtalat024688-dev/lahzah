import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const guestName = (formData.get("guestName") as string) || "ضيف عزيز";
    const message = formData.get("message") as string | null;

    if (!file) {
      return NextResponse.json({ error: "يرجى اختيار صورة للرفع" }, { status: 400 });
    }

    const uploadResult = await saveUploadedFile(file);

    const newPhoto = await prisma.photo.create({
      data: {
        eventId,
        url: uploadResult.url,
        guestName: guestName.trim() || "ضيف عزيز",
        message: message ? message.trim() : null,
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
    return NextResponse.json({ error: message }, { status: 500 });
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

    // Public users can ONLY view APPROVED photos
    const filterStatus = isOwner && statusParam ? statusParam : isOwner ? undefined : "APPROVED";

    const photos = await prisma.photo.findMany({
      where: {
        eventId,
        ...(filterStatus ? { status: filterStatus } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Fetch photos error:", error);
    return NextResponse.json({ error: "فشل استرجاع الصور" }, { status: 500 });
  }
}
