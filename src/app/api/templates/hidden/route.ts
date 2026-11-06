import { NextResponse } from "next/server";
import { getHiddenTemplateIds } from "@/lib/templateVisibility.server";

export async function GET() {
  try {
    const hiddenIds = getHiddenTemplateIds();
    return NextResponse.json({ hiddenIds });
  } catch {
    return NextResponse.json({ hiddenIds: [] });
  }
}