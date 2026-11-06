import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { saveUploadedFile, detectMagicMime } from "@/lib/storage";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "غير مصرح، يرجى تسجيل الدخول أولاً" }, { status: 401 });
    }

    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    if (event.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك بإدارة صور هذه المناسبة" }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const caption = (formData.get("caption") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "يرجى تحديد ملف صورة للرفع" }, { status: 400 });
    }

    // Size limit check (12MB)
    const MAX_SIZE = 12 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "حجم الصورة يتجاوز الحد الأقصى المسموح به (12 ميجابايت)" },
        { status: 400 }
      );
    }

    // Magic bytes verification
    const buffer = Buffer.from(await file.arrayBuffer());
    const magic = detectMagicMime(buffer);
    if (!magic) {
      return NextResponse.json(
        { error: "صيغة الملف غير مدعومة. يرجى رفع صورة بصيغة JPG أو PNG أو WebP أو HEIC صالحة." },
        { status: 400 }
      );
    }

    // Save file to storage
    const uploadResult = await saveUploadedFile(file);

    const newPhoto = {
      id: crypto.randomUUID(),
      url: uploadResult.url,
      caption: caption ? caption.trim().slice(0, 300) : null,
      order: 0,
      isCover: false,
    };

    return NextResponse.json({
      success: true,
      photo: newPhoto,
    });
  } catch (error) {
    console.error("Host couple photo upload error:", error);
    return NextResponse.json({ error: "فشل رفع صورة العروسين" }, { status: 500 });
  }
}
