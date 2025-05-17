import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Ambil token dari NextAuth
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // Debug log
  console.log("[MIDDLEWARE] NextAuth Token:", token);

  // Allow NextAuth API routes
  if (request.nextUrl.pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Jika belum login, redirect dari dashboard/api ke home
  if (!token) {
    if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Jika user admin dan akses home, redirect ke dashboard
  if (token.role === "admin" && request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika bukan admin dan akses dashboard/api, redirect ke home
  if (token.role !== "admin") {
    if (request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/api")) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/api/:path*"],
};

// export const config = {};
// export default function () {}