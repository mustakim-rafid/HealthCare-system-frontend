import type { Metadata } from "next";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";
import { serverFetch } from "@/lib/serverFetch";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import MarkAllReadButton from "./MarkAllReadButton";

export const metadata: Metadata = { title: "Notifications" };

type N = { id: string; title: string; message: string; link?: string | null; isRead: boolean; createdAt: string };

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  const limit = 15;
  let items: N[] = [];
  let meta = { total: 0, unread: 0 };
  let error: string | null = null;
  try {
    const res = await serverFetch.get(`/notification?page=${page}&limit=${limit}`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) {
      items = json.data;
      meta = json.meta;
    } else error = json.message;
  } catch {
    error = "Could not load notifications.";
  }
  const pages = Math.max(1, Math.ceil(meta.total / limit));

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">{meta.unread} unread</p>
        </div>
        <MarkAllReadButton disabled={!meta.unread} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!error && items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
            <Bell className="h-8 w-8" aria-hidden /> No notifications yet.
          </CardContent>
        </Card>
      )}
      <ul className="space-y-2">
        {items.map((n) => (
          <li key={n.id}>
            <Card className={cn(!n.isRead && "border-primary/40 bg-primary/5")}>
              <CardContent className="flex items-start justify-between gap-4 py-4">
                <div className="min-w-0">
                  <p className="font-medium">{n.title}</p>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                </div>
                {n.link && (
                  <Button size="sm" variant="outline" asChild>
                    <Link href={n.link}>Open</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </li>
        ))}
      </ul>
      {pages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
          <Button variant="outline" size="sm" disabled={page <= 1} asChild={page > 1}>
            {page > 1 ? <Link href={`/notifications?page=${page - 1}`}>Previous</Link> : <span>Previous</span>}
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pages}
          </span>
          <Button variant="outline" size="sm" disabled={page >= pages} asChild={page < pages}>
            {page < pages ? <Link href={`/notifications?page=${page + 1}`}>Next</Link> : <span>Next</span>}
          </Button>
        </nav>
      )}
    </div>
  );
}
