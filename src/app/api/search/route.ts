import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backendProxy";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 64);
  const limit = req.nextUrl.searchParams.get("limit") ?? "5";
  return proxyToBackend(`/search?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(limit)}`, { signal: req.signal });
}
