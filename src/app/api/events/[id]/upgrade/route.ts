import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { processPaymentSimulation, PACKAGES } from "@/lib/packages";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const { packageCode } = await request.json();

    if (!packageCode || !PACKAGES[packageCode]) {
      return NextResponse.json({ error: "الباقة المختارة غير صالحة" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بترقية هذه المناسبة" }, { status: 403 });
    }

    // Process payment simulation with server-side transaction logging
    const payment = await processPaymentSimulation(eventId, packageCode);

    if (!payment.success) {
      return NextResponse.json({ error: "فشلت عملية الدفع" }, { status: 400 });
    }

    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { packageTier: packageCode },
    });

    return NextResponse.json({
      success: true,
      message: `تم ترقية المناسبة بنجاح إلى ${PACKAGES[packageCode].nameAr}!`,
      event: updatedEvent,
      transactionId: payment.transactionId,
    });
  } catch (error) {
    console.error("Upgrade package error:", error);
    return NextResponse.json({ error: "فشل ترقية الباقة" }, { status: 500 });
  }
}
