import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { TEMPLATES } from "@/lib/templates";
import { getHiddenTemplateIds, setTemplateVisibility } from "@/lib/templateVisibility.server";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح بالوصول للوحة الإدارة" }, { status: 403 });
    }

    const hiddenIds = new Set(getHiddenTemplateIds());
    // Extract unique templates based on id
    const seen = new Set<string>();
    const templatesList = Object.values(TEMPLATES).filter((tmpl) => {
      if (seen.has(tmpl.id)) return false;
      seen.add(tmpl.id);
      return true;
    }).map((tmpl) => ({
      id: tmpl.id,
      nameAr: tmpl.nameAr,
      nameEn: tmpl.nameEn,
      taglineAr: tmpl.taglineAr,
      styleTag: tmpl.styleTag,
      tier: tmpl.tier,
      style: tmpl.style,
      eventTypes: tmpl.eventTypes,
      htmlFile: tmpl.htmlFile || null,
      accentColor: tmpl.theme.accentColor,
      cardBackground: tmpl.theme.cardBackground,
      isLight: tmpl.theme.isLight ?? false,
      isHidden: hiddenIds.has(tmpl.id),
    }));

    return NextResponse.json({
      templates: templatesList,
      totalCount: templatesList.length,
      hiddenCount: templatesList.filter(t => t.isHidden).length,
    });
  } catch (err) {
    console.error("Admin templates GET error:", err);
    return NextResponse.json({ error: "فشل استرجاع بيانات القوالب" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح بالوصول للوحة الإدارة" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { templateId, hide } = body;

    if (!templateId || typeof hide !== "boolean") {
      return NextResponse.json({ error: "معرف القالب والحالة مطلوبان" }, { status: 400 });
    }

    const success = setTemplateVisibility(templateId, hide);
    if (!success) {
      return NextResponse.json({ error: "تعذر تحديث حالة القالب" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      templateId,
      isHidden: hide,
      message: hide ? "تم إخفاء وحذف القالب من العرض بنجاح" : "تمت استعادة القالب للعرض بنجاح",
    });
  } catch (err) {
    console.error("Admin templates POST error:", err);
    return NextResponse.json({ error: "فشل تحديث حالة القالب" }, { status: 500 });
  }
}