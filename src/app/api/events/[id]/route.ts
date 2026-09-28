import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateQrDataUrl } from "@/lib/qr";
import { deleteUploadedFile } from "@/lib/storage";

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
      event,
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
      },
    });

    return NextResponse.json({ success: true, event: updated });
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
