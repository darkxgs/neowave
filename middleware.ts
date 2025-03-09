import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Define protected routes
  const protectedRoutes = ["/admin"]

  // Check if the path is protected
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route))

  const authCookie = request.cookies.get("auth")

  // Handle protected routes
  if (isProtectedRoute && !authCookie) {
    const url = new URL("/admin/auth", request.url)
    url.searchParams.set("from", path)
    return NextResponse.redirect(url)
  }

  // Redirect from login if already authenticated
  if (path === "/admin/auth" && authCookie) {
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

