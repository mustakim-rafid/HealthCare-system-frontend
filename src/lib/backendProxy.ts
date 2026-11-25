import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

/**
 * Forwards a browser request to the backend with the httpOnly access-token cookie attached.
 * Used by route handlers that need streaming or AbortController support (search, notifications).
 */
export const proxyToBackend = async (path: string, init: RequestInit & { signal?: AbortSignal } = {}) => {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return NextResponse.json({ success: false, message: "You are not logged in" }, { status: 401 });
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", Cookie: `accessToken=${token}`, ...(init.headers ?? {}) },
  });
  const body = await res.text();
  return new NextResponse(body, { status: res.status, headers: { "Content-Type": "application/json" } });
};
