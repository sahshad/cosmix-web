import { NextRequest, NextResponse } from "next/server"

export function proxy(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value
  const { pathname } = req.nextUrl

  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup")

  const isProtectedRoute =
    pathname === "/" || pathname.startsWith("/profile")

  if (refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  if (!refreshToken && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/profile/:path*", "/login", "/signup"],
}