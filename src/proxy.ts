import { NextResponse, NextRequest } from 'next/server'
import jwt from "jsonwebtoken"
import { cookies } from 'next/headers';
import { UserRole } from './types/common';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute } from './utils/auth-utils';

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const accessToken = request.cookies.get("accessToken")?.value || null;

  let userRole: UserRole | null = null

  if (accessToken) {
    const verifyToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
    const cookieStore = await cookies()
    if (typeof verifyToken === "string") {
      cookieStore.delete("accessToken")
      cookieStore.delete("refreshToken")
      return NextResponse.redirect(new URL("/login", request.url))
    }
    userRole = verifyToken.role
  }

  const routeOwner = getRouteOwner(pathname)

  if (!accessToken && userRole === null && routeOwner ) {
    const redirectPath = pathname
    return NextResponse.redirect(new URL(`/login?redirect=${redirectPath}`, request.url))
  }

  if (accessToken && userRole && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url))
  }

  if (routeOwner === null) {
    return NextResponse.next()
  }

  if (accessToken && routeOwner === "COMMON") {
    return NextResponse.next()
  }

  if ((routeOwner === "ADMIN" || routeOwner === "DOCTOR" || routeOwner === "PATIENT") && userRole !== null) {
    if (routeOwner !== userRole) {
      return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url))
    }
    return NextResponse.next()
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
}