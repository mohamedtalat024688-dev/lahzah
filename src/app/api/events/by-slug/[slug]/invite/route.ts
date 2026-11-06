import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token || !token.trim()) {
      return NextResponse.json({ error: "رمز الدعوة مطلوب" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { slug: decodeURIComponent(slug) },
      select: { id: true, isPublished: true, title: true, defaultMaxSeats: true },
    });

    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    const invite = await prisma.guestInvite.findUnique({
      where: { token: token.trim() },
      select: {
        id: true,
        eventId: true,
        guestName: true,
        maxSeats: true,
        isUsed: true,
      },
    });

    if (!invite || invite.eventId !== event.id) {
      return NextResponse.json({ error: "رمز الدعوة غير صالح لهذه المناسبة" }, { status: 404 });
    }

    return NextResponse.json({
      valid: true,
      guestName: invite.guestName,
      maxSeats: invite.maxSeats,
      isUsed: invite.isUsed,
    });
  } catch (error) {
    console.error("Lookup invite token error:", error);
    return NextResponse.json({ error: "فشل التحقق من رمز الدعوة" }, { status: 500 });
  }
}

