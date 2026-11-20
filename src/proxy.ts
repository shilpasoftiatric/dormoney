import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/session";
import { verifyToken } from "@/lib/auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const isLocalSubdomain = hostname.startsWith("admin.localhost") || hostname.startsWith("members.localhost");
  const isLocalhost = (hostname.includes("localhost") || hostname.includes("127.0.0.1") || hostname.includes("192.168.")) && !isLocalSubdomain;

  // ── 1. Subdomain & Hostname Routing ──────────────────────────────────────────
  const isVercel = hostname.includes("vercel.app");

  if (!isLocalhost && !isVercel) {
    const isAdminDomain =
      hostname.startsWith("admin.dormoney.com") ||
      hostname.startsWith("admin.schoolari.com") ||
      hostname.startsWith("admin.localhost");

    const isMemberDomain =
      hostname.startsWith("app.dormoney.com") ||
      hostname.startsWith("members.dormoney.com") ||
      hostname.startsWith("members.schoolari.com") ||
      hostname.startsWith("members.localhost");

    if (isAdminDomain) {
      if (pathname === "/" || pathname === "/admin") {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
      }

      if (!pathname.startsWith("/admin") && !pathname.startsWith("/api") && !pathname.startsWith("/_next")) {
        const url = request.nextUrl.clone();
        url.hostname = isLocalSubdomain ? "members.localhost" : "app.dormoney.com";
        url.port = isLocalSubdomain ? request.nextUrl.port || "3000" : "";
        url.protocol = isLocalSubdomain ? request.nextUrl.protocol || "http:" : "https:";
        return NextResponse.redirect(url);
      }
    }

    if (isMemberDomain && pathname.startsWith("/admin")) {
      const url = request.nextUrl.clone();
      url.hostname = isLocalSubdomain ? "admin.localhost" : "admin.dormoney.com";
      url.port = isLocalSubdomain ? request.nextUrl.port || "3000" : "";
      url.protocol = isLocalSubdomain ? request.nextUrl.protocol || "http:" : "https:";
      if (pathname === "/admin") {
        url.pathname = "/admin/login";
      }
      return NextResponse.redirect(url);
    }
  }

  // Redirect bare /admin to /admin/login on any environment
  if (pathname === "/admin") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  // ── 2. Allow Public Assets & Auth Endpoints ────────────────────────────────
  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/videos") ||
    pathname === "/favicon.ico" ||
    pathname === "/icon.png" ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".webp");

  if (isPublicAsset) {
    return NextResponse.next();
  }

  const isPublicAuthRoute =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/onboarding" ||
    pathname === "/admin/login" ||
    pathname === "/terms" ||
    pathname === "/privacy" ||
    pathname === "/sms-terms" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/auth");

  // ── 3. Session Validation ──────────────────────────────────────────────────
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const payload = token ? verifyToken(token) : null;

  // Protect Admin Routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
    const isStaff = payload.role === "admin" || payload.role === "super_admin";
    if (!isStaff) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }
  }

  // Protect Member Routes (Dashboard, etc.)
  if (pathname.startsWith("/dashboard")) {
    if (!payload) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // If already logged in and visiting /login or /signup, redirect to /dashboard
  if (payload && (pathname === "/login" || pathname === "/signup")) {
    const isStaff = payload.role === "admin" || payload.role === "super_admin";
    const url = request.nextUrl.clone();
    url.pathname = isStaff ? "/admin/dashboard" : "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
