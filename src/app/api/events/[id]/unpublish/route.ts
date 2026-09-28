import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بتعديل هذه المناسبة" }, { status: 403 });
    }

    const updated = await prisma.event.update({
      where: { id },
      data: { isPublished: false },
    });

    return NextResponse.json({
      success: true,
      message: "تم إيقاف نشر الدعوة بنجاح (أصبحت مسودة خاصة)",
      event: updated,
    });
  } catch (error) {
    console.error("Unpublish event error:", error);
    return NextResponse.json({ error: "فشل إيقاف نشر المناسبة" }, { status: 500 });
  }
}
