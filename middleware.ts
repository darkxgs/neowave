import { NextRequest, NextResponse } from "next/server"

// Protected routes that require authentication
const protectedRoutes = ["/admin", "/admin/data-entry"]

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check if the path is protected
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  // Try both possible cookie names
  const authCookie = request.cookies.get("auth_token") || request.cookies.get("auth")

  // Handle protected routes
  if (isProtectedRoute && !authCookie) {
    const url = new URL("/login", request.url)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  // Redirect from login if already authenticated
  if ((path === "/login" || path === "/admin-login" || path === "/user-login") && authCookie) {
    return NextResponse.redirect(new URL("/admin/data-entry", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|uploads).*)",
  ],
}

