import fs from "fs";
import path from "path";

const FILE_PATH = path.join(process.cwd(), "prisma", "hidden-templates.json");

export function getHiddenTemplateIds(): string[] {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const raw = fs.readFileSync(FILE_PATH, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error("[TemplateVisibility] Failed to read hidden templates:", err);
  }
  return [];
}

export function setTemplateVisibility(templateId: string, hide: boolean): boolean {
  try {
    const current = new Set(getHiddenTemplateIds());
    if (hide) {
      current.add(templateId);
    } else {
      current.delete(templateId);
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(Array.from(current), null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[TemplateVisibility] Failed to update template visibility:", err);
    return false;
  }
}