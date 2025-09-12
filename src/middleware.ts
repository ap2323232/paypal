import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow only specific paths
  const allowedPaths = [
    "/",
    "/payment/success",
    "/payment/cancel",
    "/api/paypal/create-order",
    "/api/paypal/capture-order",
    "/api/paypal/webhook",
    "/favicon.ico",
    "/_next",
    "/api",
  ];

  // Check if the path is allowed
  const isAllowed = allowedPaths.some(
    (path) => pathname === path || pathname.startsWith(path)
  );

  // If not allowed, redirect to home
  if (!isAllowed) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
