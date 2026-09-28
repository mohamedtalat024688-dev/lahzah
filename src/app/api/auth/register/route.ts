import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "يرجى ملء جميع الحقول المطلوبة (الاسم، البريد الإلكتروني، كلمة المرور)" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن لا تقل عن 6 أحرف" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني مسجل بالفعل، يرجى تسجيل الدخول" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        passwordHash,
        role: "OWNER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role as "OWNER" | "ADMIN",
    });

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة مرة أخرى" },
      { status: 500 }
    );
  }
}
