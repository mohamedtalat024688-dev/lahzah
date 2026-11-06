import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { CreateGuestInviteSchema } from "@/lib/validations/event";

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
      return NextResponse.json({ error: "غير مصرح لك بإدارة دعوات هذه المناسبة" }, { status: 403 });
    }

    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const invites = await prisma.guestInvite.findMany({
      where: { eventId },
      orderBy: { createdAt: "desc" },
      include: {
        rsvp: {
          select: {
            id: true,
            guestName: true,
            guestCount: true,
            attendanceStatus: true,
            createdAt: true,
          },
        },
      },
    });

    const enrichedInvites = invites.map((inv) => ({
      ...inv,
      inviteUrl: `${hostUrl}/e/${event.slug}?invite=${inv.token}`,
    }));

    return NextResponse.json({
      invites: enrichedInvites,
      totalCount: invites.length,
      usedCount: invites.filter((i) => i.isUsed).length,
    });
  } catch (error) {
    console.error("Fetch guest invites error:", error);
    return NextResponse.json({ error: "فشل استرجاع الدعوات المخصصة" }, { status: 500 });
  }
}

export async function POST(
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
      return NextResponse.json({ error: "غير مصرح لك بإنشاء دعوات لهذه المناسبة" }, { status: 403 });
    }

    const body = await request.json();
    const result = CreateGuestInviteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "بيانات الدعوة غير صالحة", details: result.error.format() },
        { status: 400 }
      );
    }

    const { guestName, phone, maxSeats } = result.data;

    // Generate secure random token
    const token = crypto.randomBytes(16).toString("hex");

    const invite = await prisma.guestInvite.create({
      data: {
        eventId,
        token,
        guestName: guestName.trim(),
        phone: phone ? phone.trim() : null,
        maxSeats,
      },
    });

    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const inviteUrl = `${hostUrl}/e/${event.slug}?invite=${token}`;

    return NextResponse.json(
      {
        success: true,
        invite: {
          ...invite,
          inviteUrl,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create guest invite error:", error);
    return NextResponse.json({ error: "فشل إنشاء الدعوة المخصصة" }, { status: 500 });
  }
}

