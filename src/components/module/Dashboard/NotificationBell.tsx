"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string;
};

const POLL_MS = 30_000;

/**
 * Notification bell with unread counter. Real-time via SSE (proxied through /api/notifications/stream),
 * with polling as a fallback when the stream is unavailable (e.g. serverless timeouts).
 */
export default function NotificationBell({ allHref }: { allHref: string }) {
  const router = useRouter();
  const [items, setItems] = useState<NotificationItem[] | null>(null);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const sseOk = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=8", { cache: "no-store" });
      if (res.status === 401) return;
      const json = await res.json();
      if (json.success) {
        setItems(json.data);
        setUnread(json.meta?.unread ?? 0);
        setError(false);
      } else setError(true);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    void load();
    let es: EventSource | null = null;
    try {
      es = new EventSource("/api/notifications/stream");
      es.addEventListener("ready", () => (sseOk.current = true));
      es.addEventListener("notification", (e) => {
        const n = JSON.parse((e as MessageEvent).data) as NotificationItem;
        setItems((prev) => [n, ...(prev ?? [])].slice(0, 8));
        setUnread((u) => u + 1);
        toast(n.title, {
          description: n.message,
          action: n.link ? { label: "Open", onClick: () => router.push(n.link!) } : undefined,
        });
        router.refresh();
      });
      es.onerror = () => {
        sseOk.current = false;
        es?.close();
      };
    } catch {
      sseOk.current = false;
    }
    // Polling fallback (also keeps counts fresh if the stream silently drops)
    const t = setInterval(() => {
      if (!sseOk.current || document.visibilityState === "visible") void load();
    }, POLL_MS);
    return () => {
      clearInterval(t);
      es?.close();
    };
  }, [load, router]);

  const markRead = async (n: NotificationItem) => {
    if (!n.isRead) {
      setItems((prev) => prev?.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)) ?? null);
      setUnread((u) => Math.max(0, u - 1));
      fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ action: "read", id: n.id }) }).catch(() => undefined);
    }
    setOpen(false);
    if (n.link) router.push(n.link);
  };

  const markAll = async () => {
    setItems((prev) => prev?.map((x) => ({ ...x, isRead: true })) ?? null);
    setUnread(0);
    await fetch("/api/notifications", { method: "PATCH", body: JSON.stringify({ action: "read-all" }) }).catch(() => undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}>
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[22rem] p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="font-semibold">Notifications</p>
          <Button variant="ghost" size="sm" onClick={markAll} disabled={!unread}>
            <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
          </Button>
        </div>
        <div className="max-h-96 overflow-y-auto" role="list">
          {items === null && !error && (
            <div className="flex justify-center p-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Loading" />
            </div>
          )}
          {error && items === null && <p className="p-4 text-sm text-destructive">Could not load notifications.</p>}
          {items?.length === 0 && <p className="p-6 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>}
          {items?.map((n) => (
            <button
              key={n.id}
              role="listitem"
              onClick={() => markRead(n)}
              className={cn("flex w-full gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none", !n.isRead && "bg-primary/5")}
            >
              <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.isRead ? "bg-transparent" : "bg-primary")} aria-hidden />
              <span className="min-w-0">
                <span className="block text-sm font-medium">{n.title}</span>
                <span className="line-clamp-2 block text-xs text-muted-foreground">{n.message}</span>
                <span className="mt-1 block text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full" asChild onClick={() => setOpen(false)}>
            <Link href={allHref}>View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
