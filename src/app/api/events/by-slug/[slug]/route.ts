import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getTemplate } from "@/lib/templates";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const decodedSlug = decodeURIComponent(slug);

    const event = await prisma.event.findUnique({
      where: { slug: decodedSlug },
      include: {
        photos: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            rsvps: true,
            photos: {
              where: { status: "APPROVED" },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (!event.isPublished) {
      return NextResponse.json({ error: "هذه الدعوة لم تنشر بعد" }, { status: 403 });
    }

    const templateConfig = getTemplate(event.templateId);

    return NextResponse.json({
      event: {
        id: event.id,
        slug: event.slug,
        title: event.title,
        eventType: event.eventType,
        groomName: event.groomName,
        brideName: event.brideName,
        eventDate: event.eventDate,
        venueName: event.venueName,
        address: event.address,
        mapUrl: event.mapUrl,
        welcomeMessage: event.welcomeMessage,
        description: event.description,
        coverImage: event.coverImage,
        templateId: event.templateId,
        templateConfig,
        approvedPhotos: event.photos,
        stats: {
          approvedPhotosCount: event._count.photos,
          totalRsvps: event._count.rsvps,
        },
      },
    });
  } catch (error) {
    console.error("Public event by slug error:", error);
    return NextResponse.json({ error: "فشل استرجاع بيانات الدعوة" }, { status: 500 });
  }
}
