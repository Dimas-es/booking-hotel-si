// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// export async function middleware(request: NextRequest) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareClient({ req: request, res });

//   const {
//     data: { session },
//   } = await supabase.auth.getSession();

//   if (!session) {
//     // Redirect if not logged in
//     if (
//       request.nextUrl.pathname.startsWith("/dashboard") ||
//       request.nextUrl.pathname.startsWith("/api")
//     ) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     return res;
//   }

//   const userId = session.user.id;

//   const { data: profile, error } = await supabase
//     .from("users")
//     .select("role")
//     .eq("id", userId)
//     .single();

//   if (error || profile?.role !== "admin") {
//     if (
//       request.nextUrl.pathname.startsWith("/dashboard") ||
//       request.nextUrl.pathname.startsWith("/api")
//     ) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   }

//   return res;
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/api/:path*"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware dinonaktifkan sementara
export async function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};