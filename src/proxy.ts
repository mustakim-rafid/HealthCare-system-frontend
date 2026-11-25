import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { UserRole } from "./types/common";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute } from "./utils/auth-utils";

const COOKIE_OPTS = { httpOnly: true, secure: true, sameSite: "none" as const, path: "/" };

const decodeRole = (token: string | null): UserRole | null => {
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    return typeof payload === "string" ? null : (payload.role as UserRole);
  } catch {
    return null; // expired or tampered
  }
};

/** Exchange the refresh token for a new access token (silent session renewal). */
const refreshAccessToken = async (refreshToken: string): Promise<{ token: string; maxAge: number } | null> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { Cookie: `refreshToken=${refreshToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    for (const c of res.headers.getSetCookie()) {
      const match = c.match(/^accessToken=([^;]+)/);
      if (match) {
        const maxAge = Number(c.match(/Max-Age=(\d+)/i)?.[1] ?? 3600);
        return { token: match[1], maxAge };
      }
    }
    return null;
  } catch {
    return null;
  }
};

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const routeOwner = getRouteOwner(pathname);

  let accessToken = request.cookies.get("accessToken")?.value || null;
  const refreshToken = request.cookies.get("refreshToken")?.value || null;
  let userRole = decodeRole(accessToken);
  let renewed: { token: string; maxAge: number } | null = null;

  // Access token missing/expired but a refresh token exists → renew silently
  if (!userRole && refreshToken) {
    renewed = await refreshAccessToken(refreshToken);
    if (renewed) {
      accessToken = renewed.token;
      userRole = decodeRole(accessToken);
    }
  }

  const withCookies = (res: NextResponse) => {
    if (renewed) res.cookies.set("accessToken", renewed.token, { ...COOKIE_OPTS, maxAge: renewed.maxAge });
    return res;
  };

  // Session is invalid → clear cookies; protected routes go to login with a redirect back
  if (!userRole) {
    if (routeOwner) {
      const url = new URL("/login", request.url);
      url.searchParams.set("redirect", pathname);
      if (accessToken || refreshToken) url.searchParams.set("expired", "1");
      const res = NextResponse.redirect(url);
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
    const res = NextResponse.next();
    if (accessToken) {
      res.cookies.delete("accessToken");
    }
    return res;
  }

  if (isAuthRoute(pathname)) {
    return withCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url)));
  }

  if (routeOwner === "ADMIN" || routeOwner === "DOCTOR" || routeOwner === "PATIENT") {
    if (routeOwner !== userRole) {
      return withCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole), request.url)));
    }
  }

  // Forward the renewed token to server components in this same request
  if (renewed) {
    const headers = new Headers(request.headers);
    const others = request.cookies
      .getAll()
      .filter((c) => c.name !== "accessToken")
      .map((c) => `${c.name}=${c.value}`);
    headers.set("cookie", [...others, `accessToken=${renewed.token}`].join("; "));
    return withCookies(NextResponse.next({ request: { headers } }));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|.well-known).*)"],
};
