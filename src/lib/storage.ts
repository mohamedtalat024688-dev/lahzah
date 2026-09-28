import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // Already exists
  }
}

export interface UploadResult {
  url: string;
  filename: string;
  sizeBytes: number;
}

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB limit

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("حجم الصورة يتجاوز الحد الأقصى المسموح به (12 ميجابايت)");
  }

  if (file.type && !ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error("صيغة الملف غير مدعومة. يرجى رفع صورة بصيغة JPG أو PNG أو WebP");
  }

  await ensureUploadDir();

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = path.extname(file.name) || ".jpg";
  const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const filePath = path.join(UPLOAD_DIR, uniqueName);

  await fs.writeFile(filePath, buffer);

  return {
    url: `/uploads/${uniqueName}`,
    filename: uniqueName,
    sizeBytes: file.size,
  };
}
