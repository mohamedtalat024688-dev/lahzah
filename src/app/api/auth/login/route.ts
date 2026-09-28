import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, setSessionCookie } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`login:${ip}`, { windowMs: 60 * 1000, max: 15 });
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "تجاوزت عدد محاولات الدخول المسموح بها. يرجى الانتظار دقيقة والمحاولة مجدداً." },
        { status: 429 }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "يرجى إدخال البريد الإلكتروني وكلمة المرور" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role as "OWNER" | "ADMIN",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء تسجيل الدخول" },
      { status: 500 }
    );
  }
}
