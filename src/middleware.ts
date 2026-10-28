import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const DEV_FALLBACK_SECRET = "lahzah-dev-test-only-secret-do-not-use-in-prod";

function getMiddlewareSecretKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  const isProd = process.env.NODE_ENV === "production";

  if (isProd) {
    // In production, reject missing, whitespace-only, or insufficiently long secrets (< 32 chars)
    // Never print or leak secret contents.
    if (!secret || secret.trim().length < 32) {
      return null;
    }
    return new TextEncoder().encode(secret);
  }

  if (!secret || secret.trim().length === 0) {
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }

  return new TextEncoder().encode(secret);
}

const SESSION_COOKIE = "lahzah_session";

interface SessionPayload {
  userId: string;
  email: string;
  role: "OWNER" | "ADMIN";
}

async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const secretKey = getMiddlewareSecretKey();
    if (!secretKey) return null;
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifyToken(token) : null;

  // 1. Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Protect /admin routes
  if (pathname.startsWith("/admin")) {
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (session.role !== "ADMIN") {
      // Forbidden: redirect normal owner to their dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 3. Redirect logged-in users away from /auth/login and /auth/register
  if (pathname === "/auth/login" || pathname === "/auth/register") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
