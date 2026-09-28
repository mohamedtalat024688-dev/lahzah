import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { deleteUploadedFile } from "@/lib/storage";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول" }, { status: 401 });
    }

    const { id: photoId } = await params;
    const { status } = await request.json();

    if (!["APPROVED", "REJECTED", "PENDING"].includes(status)) {
      return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
    }

    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { event: true },
    });

    if (!photo) {
      return NextResponse.json({ error: "الصورة غير موجودة" }, { status: 404 });
    }

    // Authorization check: Only event owner or platform ADMIN can moderate
    if (photo.event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بتعديل حالة هذه الصورة" }, { status: 403 });
    }

    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: status === "APPROVED" ? "تمت الموافقة ونشر الصورة بالمعرض" : "تم رفض الصورة",
      photo: updatedPhoto,
    });
  } catch (error) {
    console.error("Photo moderation error:", error);
    return NextResponse.json({ error: "فشل تعديل حالة الصورة" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
    }

    const { id: photoId } = await params;
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
      include: { event: true },
    });

    if (!photo) {
      return NextResponse.json({ error: "الصورة غير موجودة" }, { status: 404 });
    }

    if (photo.event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
    }

    // Clean up physical file from storage (handles local and S3/R2)
    if (photo.url) {
      await deleteUploadedFile(photo.url);
    }

    await prisma.photo.delete({ where: { id: photoId } });

    return NextResponse.json({ success: true, message: "تم حذف الصورة نهائياً" });
  } catch (error) {
    console.error("Delete photo error:", error);
    return NextResponse.json({ error: "فشل حذف الصورة" }, { status: 500 });
  }
}
