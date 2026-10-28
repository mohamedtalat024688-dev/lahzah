import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

const DEV_FALLBACK_SECRET = "lahzah-dev-test-only-secret-do-not-use-in-prod";

/**
 * Validates JWT secret strength for production environments.
 * Requirements:
 * - Must not be null or undefined.
 * - Must not be whitespace-only.
 * - Must be at least 32 characters (evaluated after whitespace normalization).
 *
 * NOTE: Length alone does not guarantee entropy. A cryptographically random secret
 * (e.g., generated with `openssl rand -base64 32`) is required in production.
 * Whitespace is normalized solely for validation; the secret value itself is never mutated
 * or trimmed during key derivation, preserving exact user-configured secrets.
 * Secret values are NEVER logged or printed.
 */
export function validateProductionJwtSecret(secret?: string | null): { valid: boolean; reason?: string } {
  if (!secret) {
    return { valid: false, reason: "JWT_SECRET is missing." };
  }
  const trimmed = secret.trim();
  if (trimmed.length === 0) {
    return { valid: false, reason: "JWT_SECRET is empty or whitespace-only." };
  }
  if (trimmed.length < 32) {
    return {
      valid: false,
      reason: `JWT_SECRET is too short (${trimmed.length} characters). Minimum 32 characters required.`,
    };
  }
  return { valid: true };
}

export function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    const validation = validateProductionJwtSecret(secret);
    if (!validation.valid) {
      throw new Error(
        `[CRITICAL SECURITY] JWT_SECRET is invalid in production environment (${validation.reason}). Refusing to operate with fallback key.`
      );
    }
    return new TextEncoder().encode(secret!);
  }

  if (!secret || secret.trim().length === 0) {
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }

  return new TextEncoder().encode(secret);
}

const SESSION_COOKIE = "lahzah_session";

export interface SessionPayload {
  userId: string;
  email: string;
  role: "OWNER" | "ADMIN";
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secretKey = getJwtSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = getJwtSecretKey();
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<{ id: string; email: string; name: string; role: string } | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    return user;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload): Promise<string> {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
