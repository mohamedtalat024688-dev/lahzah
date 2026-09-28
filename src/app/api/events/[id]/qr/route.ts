import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateQrDataUrl, generateQrSvg } from "@/lib/qr";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "dataUrl";

    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event) {
      return NextResponse.json({ error: "المناسبة غير موجودة" }, { status: 404 });
    }

    const hostUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const uploadUrl = `${hostUrl}/e/${event.slug}/upload`;

    if (format === "svg") {
      const svg = await generateQrSvg(uploadUrl);
      return new Response(svg, {
        headers: { "Content-Type": "image/svg+xml" },
      });
    }

    const dataUrl = await generateQrDataUrl(uploadUrl, 800);
    return NextResponse.json({
      dataUrl,
      targetUrl: uploadUrl,
      eventTitle: event.title,
    });
  } catch (error) {
    console.error("QR generation error:", error);
    return NextResponse.json({ error: "فشل توليد رمز الاستجابة السريعة QR" }, { status: 500 });
  }
}
