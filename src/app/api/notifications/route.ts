import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Number(sp.get("page")) || 1;
  const limit = Math.min(50, Number(sp.get("limit")) || 10);
  const unread = sp.get("unread") === "true" ? "&unread=true" : "";
  return proxyToBackend(`/notification?page=${page}&limit=${limit}${unread}`);
}

/** body: { action: "read", id } | { action: "read-all" } */
export async function PATCH(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (body?.action === "read-all") return proxyToBackend(`/notification/read-all`, { method: "PATCH" });
  if (body?.action === "read" && typeof body.id === "string" && /^[0-9a-f-]{36}$/i.test(body.id)) {
    return proxyToBackend(`/notification/${body.id}/read`, { method: "PATCH" });
  }
  return Response.json({ success: false, message: "Invalid action" }, { status: 400 });
}
