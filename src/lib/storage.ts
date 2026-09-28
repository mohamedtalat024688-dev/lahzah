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
  mimeType: string;
}

const MAX_FILE_SIZE = 12 * 1024 * 1024; // 12 MB limit

/**
 * Validate image buffer using true file magic bytes (signatures).
 * Prevents file format spoofing and malicious executable uploads.
 */
export function detectMagicMime(buffer: Buffer): { mime: string; ext: string } | null {
  if (buffer.length < 12) return null;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mime: "image/jpeg", ext: ".jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { mime: "image/png", ext: ".png" };
  }

  // WebP: 'RIFF' .... 'WEBP'
  const riff = buffer.subarray(0, 4).toString("ascii");
  const webp = buffer.subarray(8, 12).toString("ascii");
  if (riff === "RIFF" && webp === "WEBP") {
    return { mime: "image/webp", ext: ".webp" };
  }

  // HEIF / HEIC: contains 'ftyp' at offset 4
  const ftyp = buffer.subarray(4, 8).toString("ascii");
  if (ftyp === "ftyp") {
    const brand = buffer.subarray(8, 12).toString("ascii").toLowerCase();
    if (["heic", "heix", "mif1", "msf1", "hevc"].includes(brand)) {
      return { mime: "image/heic", ext: ".heic" };
    }
  }

  return null;
}

export interface IStorageProvider {
  save(buffer: Buffer, filename: string, mimeType: string): Promise<string>;
  delete(url: string): Promise<void>;
}

/**
 * Local filesystem storage provider for zero-friction local development.
 * NOTE: For production multi-instance or serverless deployments, use S3/R2.
 */
class LocalStorageProvider implements IStorageProvider {
  async save(buffer: Buffer, filename: string): Promise<string> {
    await ensureUploadDir();
    const filePath = path.join(UPLOAD_DIR, filename);
    await fs.writeFile(filePath, buffer);
    return `/uploads/${filename}`;
  }

  async delete(url: string): Promise<void> {
    try {
      const filename = path.basename(url);
      const filePath = path.join(UPLOAD_DIR, filename);
      await fs.unlink(filePath);
    } catch {
      // Ignored if file does not exist
    }
  }
}

/**
 * Helper to compute AWS SigV4 signing key
 */
function getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): Buffer {
  const kDate = crypto.createHmac("sha256", "AWS4" + key).update(dateStamp).digest();
  const kRegion = crypto.createHmac("sha256", kDate).update(regionName).digest();
  const kService = crypto.createHmac("sha256", kRegion).update(serviceName).digest();
  return crypto.createHmac("sha256", kService).update("aws4_request").digest();
}

/**
 * Production Object Storage Provider (AWS S3, Cloudflare R2, MinIO, Supabase).
 * Uses native standard AWS Signature Version 4 (SigV4) HTTP requests for high performance
 * and zero additional bulky SDK bundle bloat.
 */
class S3StorageProvider implements IStorageProvider {
  private bucket = process.env.S3_BUCKET_NAME || "";
  private region = process.env.S3_REGION || "us-east-1";
  private accessKey = process.env.S3_ACCESS_KEY_ID || "";
  private secretKey = process.env.S3_SECRET_ACCESS_KEY || "";
  // Optional custom endpoint for Cloudflare R2: e.g., https://<account_id>.r2.cloudflarestorage.com
  private customEndpoint = process.env.S3_ENDPOINT || "";
  private publicDomain = process.env.S3_PUBLIC_DOMAIN || "";

  async save(buffer: Buffer, filename: string, mimeType: string): Promise<string> {
    if (!this.bucket || !this.accessKey || !this.secretKey) {
      throw new Error(
        "S3 Storage requires S3_BUCKET_NAME, S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY configured in environment."
      );
    }

    const host = this.customEndpoint
      ? new URL(this.customEndpoint).host
      : `${this.bucket}.s3.${this.region}.amazonaws.com`;
    const pathname = this.customEndpoint ? `/${this.bucket}/${filename}` : `/${filename}`;
    const url = this.customEndpoint
      ? `${this.customEndpoint.replace(/\/$/, "")}/${this.bucket}/${filename}`
      : `https://${host}/${filename}`;

    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
    const dateStamp = amzDate.substring(0, 8); // YYYYMMDD
    const payloadHash = crypto.createHash("sha256").update(buffer).digest("hex");

    const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
    const canonicalRequest = ["PUT", pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");

    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const stringToSign = [
      "AWS4-HMAC-SHA256",
      amzDate,
      credentialScope,
      crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
    ].join("\n");

    const signingKey = getSignatureKey(this.secretKey, dateStamp, this.region, "s3");
    const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

    const authHeader = `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Host: host,
        "Content-Type": mimeType,
        "x-amz-date": amzDate,
        "x-amz-content-sha256": payloadHash,
        Authorization: authHeader,
      },
      body: new Uint8Array(buffer),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`S3 upload failed: HTTP ${response.status} - ${errText}`);
    }

    // Return public URL or CDN domain if configured
    if (this.publicDomain) {
      return `${this.publicDomain.replace(/\/$/, "")}/${filename}`;
    }
    return url;
  }

  async delete(fileUrl: string): Promise<void> {
    if (!this.bucket || !this.accessKey || !this.secretKey) return;

    try {
      const filename = path.basename(new URL(fileUrl, "http://dummy.local").pathname);
      const host = this.customEndpoint
        ? new URL(this.customEndpoint).host
        : `${this.bucket}.s3.${this.region}.amazonaws.com`;
      const pathname = this.customEndpoint ? `/${this.bucket}/${filename}` : `/${filename}`;
      const url = this.customEndpoint
        ? `${this.customEndpoint.replace(/\/$/, "")}/${this.bucket}/${filename}`
        : `https://${host}/${filename}`;

      const now = new Date();
      const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
      const dateStamp = amzDate.substring(0, 8);
      const payloadHash = crypto.createHash("sha256").update("").digest("hex");

      const canonicalHeaders = `host:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
      const signedHeaders = "host;x-amz-content-sha256;x-amz-date";
      const canonicalRequest = ["DELETE", pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");

      const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
      const stringToSign = [
        "AWS4-HMAC-SHA256",
        amzDate,
        credentialScope,
        crypto.createHash("sha256").update(canonicalRequest).digest("hex"),
      ].join("\n");

      const signingKey = getSignatureKey(this.secretKey, dateStamp, this.region, "s3");
      const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");

      await fetch(url, {
        method: "DELETE",
        headers: {
          Host: host,
          "x-amz-date": amzDate,
          "x-amz-content-sha256": payloadHash,
          Authorization: `AWS4-HMAC-SHA256 Credential=${this.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
        },
      });
    } catch (e) {
      console.error("S3 delete error:", e);
    }
  }
}

function getStorageProvider(): IStorageProvider {
  if (process.env.STORAGE_PROVIDER === "s3" && process.env.S3_BUCKET_NAME) {
    return new S3StorageProvider();
  }
  return new LocalStorageProvider();
}

const storageProvider = getStorageProvider();

export async function saveUploadedFile(file: File): Promise<UploadResult> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("حجم الصورة يتجاوز الحد الأقصى المسموح به (12 ميجابايت)");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Validate magic bytes to prevent spoofed Content-Type attacks
  const detected = detectMagicMime(buffer);
  if (!detected) {
    throw new Error("صيغة الملف غير مدعومة أو غير صالحة. يرجى رفع صورة حقيقية بصيغة JPG أو PNG أو WebP");
  }

  // Derive filename strictly from cryptographically secure random bytes + detected extension
  const uniqueName = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${detected.ext}`;
  const url = await storageProvider.save(buffer, uniqueName, detected.mime);

  return {
    url,
    filename: uniqueName,
    sizeBytes: file.size,
    mimeType: detected.mime,
  };
}

export async function deleteUploadedFile(url: string): Promise<void> {
  await storageProvider.delete(url);
}
