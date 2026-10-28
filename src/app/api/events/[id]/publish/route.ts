import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateQrDataUrl } from "@/lib/qr";
import { TEMPLATES, isTemplateAllowedForPackage } from "@/lib/templates";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بنشر هذه المناسبة" }, { status: 403 });
    }

    // SERVER/API Security Gate: Unpaid events CANNOT be published
    if (!event.isPaid) {
      return NextResponse.json(
        {
          error: "لا يمكن نشر المناسبة قبل اختيار الباقة وسداد قيمتها بنجاح.",
          code: "PAYMENT_REQUIRED",
          isPaid: false,
        },
        { status: 402 }
      );
    }

    // SERVER/API Security Gate: Verify template entitlement against trusted package tier
    if (!isTemplateAllowedForPackage(event.templateId, event.packageTier)) {
      const tmpl = TEMPLATES[event.templateId];
      return NextResponse.json(
        {
          error: `لا يمكن نشر المناسبة لأن القالب المختار (${tmpl?.nameAr || event.templateId}) يتطلب باقة أعلى من باقة المناسبة الحالية (${event.packageTier}).`,
          code: "TEMPLATE_ENTITLEMENT_REQUIRED",
          requiredTier: tmpl?.tier,
          currentTier: event.packageTier,
        },
        { status: 403 }
      );
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { isPublished: true },
    });

    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invitationUrl = `${hostUrl}/e/${updated.slug}`;
    const uploadUrl = `${hostUrl}/e/${updated.slug}/upload`;
    const qrDataUrl = await generateQrDataUrl(uploadUrl);

    return NextResponse.json({
      success: true,
      message: "تم نشر بطاقة الدعوة وتفعيل الـ QR بنجاح!",
      event: updated,
      urls: {
        invitation: invitationUrl,
        upload: uploadUrl,
        qr: qrDataUrl,
      },
    });
  } catch (error) {
    console.error("Publish event error:", error);
    return NextResponse.json({ error: "فشل نشر المناسبة" }, { status: 500 });
  }
}
