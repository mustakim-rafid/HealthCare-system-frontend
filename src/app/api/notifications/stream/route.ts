import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

/** Proxies the backend Server-Sent Events stream (the client falls back to polling if this fails). */
export async function GET(req: NextRequest) {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) return new Response("Unauthorized", { status: 401 });
  try {
    const upstream = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/stream`, {
      headers: { Cookie: `accessToken=${token}`, Accept: "text/event-stream" },
      signal: req.signal,
      cache: "no-store",
    });
    if (!upstream.ok || !upstream.body) return new Response("Upstream unavailable", { status: 502 });
    return new Response(upstream.body, {
      headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" },
    });
  } catch {
    return new Response("Upstream unavailable", { status: 502 });
  }
}
