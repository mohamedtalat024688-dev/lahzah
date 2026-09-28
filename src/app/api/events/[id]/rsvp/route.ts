import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const body = await request.json();

    const { guestName, phone, attendanceStatus, guestCount = 1, note } = body;

    if (!guestName || !attendanceStatus) {
      return NextResponse.json(
        { error: "يرجى كتابة الاسم وتحديد حالة الحضور" },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        eventId,
        guestName: guestName.trim(),
        phone: phone ? phone.trim() : null,
        attendanceStatus,
        guestCount: Math.max(1, parseInt(guestCount) || 1),
        note: note ? note.trim() : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "تم تسجيل ردكم الكريم بنجاح، شكراً لكم!",
      rsvp,
    });
  } catch (error) {
    console.error("RSVP submit error:", error);
    return NextResponse.json({ error: "فشل تسجيل تأكيد الحضور" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بمشاهدة هذه الردود" }, { status: 403 });
    }

    const rsvps = await prisma.rsvp.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
    });

    const attendingTotal = rsvps
      .filter((r) => r.attendanceStatus === "ATTENDING")
      .reduce((sum, r) => sum + r.guestCount, 0);

    const declinedTotal = rsvps.filter((r) => r.attendanceStatus === "NOT_ATTENDING").length;
    const maybeTotal = rsvps.filter((r) => r.attendanceStatus === "MAYBE").length;

    return NextResponse.json({
      rsvps,
      stats: {
        totalResponses: rsvps.length,
        attendingTotal,
        declinedTotal,
        maybeTotal,
      },
    });
  } catch (error) {
    console.error("Fetch RSVPs error:", error);
    return NextResponse.json({ error: "فشل استرجاع بيانات الحضور" }, { status: 500 });
  }
}
