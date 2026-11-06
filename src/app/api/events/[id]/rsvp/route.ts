import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const VALID_STATUSES = new Set(["ATTENDING", "NOT_ATTENDING", "MAYBE"]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`rsvp:${ip}`, { windowMs: 5 * 60 * 1000, max: 30 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "تم تجاوز عدد طلبات تأكيد الحضور المسموح بها مؤقتاً. يرجى المحاولة لاحقاً." },
        { status: 429 }
      );
    }

    const { id: eventId } = await params;
    const body = await request.json();

    const { guestName, phone, attendanceStatus, guestCount = 1, note, inviteToken } = body;

    if (!guestName || typeof guestName !== "string" || !guestName.trim()) {
      return NextResponse.json({ error: "يرجى كتابة الاسم الكريم" }, { status: 400 });
    }

    if (!attendanceStatus || !VALID_STATUSES.has(attendanceStatus)) {
      return NextResponse.json({ error: "حالة حضور غير صالحة" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (!event.isPublished) {
      return NextResponse.json({ error: "هذه الدعوة غير متاحة لتأكيد الحضور حالياً" }, { status: 403 });
    }

    const requestedSeats = attendanceStatus === "ATTENDING" ? Math.max(1, parseInt(guestCount, 10) || 1) : 0;

    // Database-backed Targeted Invitation Validation
    let targetedInvite: { id: string; maxSeats: number; isUsed: boolean } | null = null;
    if (inviteToken) {
      const cleanToken = String(inviteToken).trim();
      const foundInvite = await prisma.guestInvite.findUnique({
        where: { token: cleanToken },
      });

      if (!foundInvite || foundInvite.eventId !== eventId) {
        return NextResponse.json(
          { error: "رمز الدعوة المخصصة غير صالح أو غير مرتبط بهذه المناسبة" },
          { status: 400 }
        );
      }

      if (foundInvite.isUsed) {
        return NextResponse.json(
          { error: "تم استخدام رمز هذه الدعوة مسبقاً لتأكيد الحضور ولا يمكن إعادة استخدامه" },
          { status: 400 }
        );
      }

      if (attendanceStatus === "ATTENDING" && requestedSeats > foundInvite.maxSeats) {
        return NextResponse.json(
          {
            error: `عدد المقاعد المطلوب (${requestedSeats}) يتجاوز الحد الأقصى المخصص لدعوتكم الكريمة (${foundInvite.maxSeats} مقاعد).`,
            code: "SEAT_LIMIT_EXCEEDED",
            maxAllowedSeats: foundInvite.maxSeats,
          },
          { status: 400 }
        );
      }

      targetedInvite = foundInvite;
    } else {
      // General public open invitation link validation
      const maxAllowed = event.defaultMaxSeats || 3;
      if (attendanceStatus === "ATTENDING" && requestedSeats > maxAllowed) {
        return NextResponse.json(
          {
            error: `الحد الأقصى للمقاعد المسموح به لكل رد هو ${maxAllowed} مقاعد.`,
            code: "PUBLIC_SEAT_LIMIT_EXCEEDED",
            maxAllowedSeats: maxAllowed,
          },
          { status: 400 }
        );
      }
    }

    // Atomic execution with race-condition guard: Create RSVP and consume Targeted Invite token
    const rsvp = await prisma.$transaction(async (tx) => {
      if (targetedInvite) {
        // Concurrency guard: updateMany with isUsed: false ensures atomic single-consumption
        const consumed = await tx.guestInvite.updateMany({
          where: { id: targetedInvite.id, isUsed: false },
          data: {
            isUsed: true,
            usedAt: new Date(),
          },
        });

        if (consumed.count === 0) {
          throw new Error("TOKEN_ALREADY_USED_CONCURRENTLY");
        }
      }

      const newRsvp = await tx.rsvp.create({
        data: {
          eventId,
          guestName: guestName.trim().slice(0, 100),
          phone: phone ? String(phone).trim().slice(0, 30) : null,
          attendanceStatus,
          guestCount: requestedSeats,
          note: note ? String(note).trim().slice(0, 500) : null,
        },
      });

      if (targetedInvite) {
        await tx.guestInvite.update({
          where: { id: targetedInvite.id },
          data: { rsvpId: newRsvp.id },
        });
      }

      return newRsvp;
    });

    return NextResponse.json({
      success: true,
      message: attendanceStatus === "ATTENDING"
        ? "تم تسجيل تأكيد حضورك بنجاح، نتشرف بك وننتظر لقائك!"
        : "تم تسجيل ردكم الكريم بنجاح، شكراً لكم!",
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

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "100", 10)));
    const skip = (page - 1) * limit;

    const [rsvps, totalResponses, allStatuses] = await Promise.all([
      prisma.rsvp.findMany({
        where: { eventId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.rsvp.count({ where: { eventId } }),
      prisma.rsvp.findMany({
        where: { eventId },
        select: { attendanceStatus: true, guestCount: true },
      }),
    ]);

    const attendingTotal = allStatuses
      .filter((r) => r.attendanceStatus === "ATTENDING")
      .reduce((sum, r) => sum + r.guestCount, 0);

    const declinedTotal = allStatuses.filter((r) => r.attendanceStatus === "NOT_ATTENDING").length;
    const maybeTotal = allStatuses.filter((r) => r.attendanceStatus === "MAYBE").length;

    return NextResponse.json({
      rsvps,
      pagination: {
        page,
        limit,
        total: totalResponses,
        totalPages: Math.ceil(totalResponses / limit),
      },
      stats: {
        totalResponses,
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
