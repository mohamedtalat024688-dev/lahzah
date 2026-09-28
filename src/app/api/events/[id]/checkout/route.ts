import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { processPayment, PACKAGES } from "@/lib/packages";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const { id: eventId } = await params;
    const url = new URL(request.url);
    const packageCode = (url.searchParams.get("package") || "PREMIUM").toUpperCase();

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        payments: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بالوصول لبيانات الدفع لهذه المناسبة" }, { status: 403 });
    }

    const selectedPkg = PACKAGES[packageCode] || PACKAGES.PREMIUM;
    const isPaymobLive = process.env.PAYMENT_PROVIDER === "paymob" && !!process.env.PAYMOB_API_KEY;

    return NextResponse.json({
      event: {
        id: event.id,
        title: event.title,
        isPaid: event.isPaid,
        isPublished: event.isPublished,
        packageTier: event.packageTier,
      },
      package: selectedPkg,
      allPackages: Object.values(PACKAGES),
      pricing: {
        subtotal: selectedPkg.price,
        tax: 0,
        total: selectedPkg.price,
        currency: selectedPkg.currency,
      },
      paymentGateway: {
        provider: isPaymobLive ? "PAYMOB" : "SIMULATION",
        isLive: isPaymobLive,
        modeNotice: isPaymobLive
          ? "بوابة الدفع الإلكتروني المباشرة والآمنة (Paymob)"
          : "بيئة تجريبية للاختبار والتطوير (Simulation Gateway)",
      },
      recentTransactions: event.payments,
    });
  } catch (error) {
    console.error("Checkout GET error:", error);
    return NextResponse.json({ error: "فشل استرجاع بيانات الدفع" }, { status: 500 });
  }
}

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
    const body = await request.json();
    const { packageCode } = body;

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بالدفع لهذه المناسبة" }, { status: 403 });
    }

    if (!packageCode || !PACKAGES[packageCode]) {
      return NextResponse.json({ error: "يرجى اختيار باقة صالحة" }, { status: 400 });
    }

    // Process payment through gateway abstraction (Paymob or Simulation)
    const payment = await processPayment(eventId, packageCode);

    if (!payment.success) {
      return NextResponse.json(
        { error: payment.message || "فشلت عملية معالجة الدفع", status: payment.status },
        { status: 400 }
      );
    }

    const updatedEvent = await prisma.event.findUnique({ where: { id: eventId } });

    return NextResponse.json({
      success: true,
      message: payment.message || "تمت معالجة الدفع بنجاح",
      status: payment.status,
      transactionId: payment.transactionId,
      checkoutUrl: payment.checkoutUrl,
      isSimulated: payment.isSimulated,
      event: updatedEvent,
    });
  } catch (error) {
    console.error("Checkout POST error:", error);
    return NextResponse.json({ error: "حدث خطأ أثناء معالجة عملية الشراء" }, { status: 500 });
  }
}
