import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح بالدخول للوحة الإدارة" }, { status: 403 });
    }

    const [totalUsers, totalEvents, totalRsvps, totalPhotos, eventsList] = await Promise.all([
      prisma.user.count(),
      prisma.event.count(),
      prisma.rsvp.count(),
      prisma.photo.count(),
      prisma.event.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { rsvps: true, photos: true } },
        },
      }),
    ]);

    const approvedPhotos = await prisma.photo.count({ where: { status: "APPROVED" } });
    const pendingPhotos = await prisma.photo.count({ where: { status: "PENDING" } });

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalEvents,
        totalRsvps,
        totalPhotos,
        approvedPhotos,
        pendingPhotos,
      },
      recentEvents: eventsList,
    });
  } catch (error) {
    console.error("Admin metrics error:", error);
    return NextResponse.json({ error: "فشل استرجاع بيانات الإدارة" }, { status: 500 });
  }
}
