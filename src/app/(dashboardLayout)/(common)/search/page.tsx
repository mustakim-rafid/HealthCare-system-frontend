import type { Metadata } from "next";
import Link from "next/link";
import { serverFetch } from "@/lib/serverFetch";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { PAGES_BY_ROLE } from "@/components/module/Dashboard/GlobalSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Search" };

type Item = { id: string; title: string; subtitle?: string; href: string };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const term = q.trim().slice(0, 64);
  const user = await getUserInfo();
  let data: Record<string, Item[]> | null = null;
  let error: string | null = null;
  if (term.length >= 2) {
    try {
      const res = await serverFetch.get(`/search?q=${encodeURIComponent(term)}&limit=20`, { cache: "no-store" });
      const json = await res.json();
      if (json.success) data = json.data;
      else error = json.message;
    } catch {
      error = "Search is unavailable right now.";
    }
  }
  const pages = user ? PAGES_BY_ROLE[user.role].filter((p) => p.title.toLowerCase().includes(term.toLowerCase())) : [];
  const groups: [string, Item[]][] = data
    ? [
        ["Bookings", data.bookings],
        ["Doctors", data.doctors],
        ["Patients", data.patients],
        ["Specialities", data.specialities],
      ]
    : [];
  const pageItems: Item[] = pages.map((p) => ({ id: p.href, title: p.title, href: p.href }));
  const total = groups.reduce((n, [, items]) => n + items.length, 0) + pageItems.length;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Search results</h1>
        <p className="text-sm text-muted-foreground">
          {term.length < 2 ? "Type at least 2 characters in the search bar (Ctrl/Cmd + K)." : `${total} result(s) for “${term}”`}
        </p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {term.length >= 2 && total === 0 && !error && (
        <Card className="border-dashed">
          <CardContent className="py-10 text-center text-muted-foreground">No matches. Try a doctor or patient name.</CardContent>
        </Card>
      )}
      {[...groups, ["Pages", pageItems] as [string, Item[]]]
        .filter(([, items]) => items.length > 0)
        .map(([heading, items]) => (
          <Card key={heading}>
            <CardHeader>
              <CardTitle className="text-base">{heading}</CardTitle>
            </CardHeader>
            <CardContent className="divide-y p-0">
              {items.map((item) => (
                <Link key={item.id} href={item.href} className="flex items-center justify-between gap-4 px-6 py-3 hover:bg-muted focus-visible:bg-muted focus-visible:outline-none">
                  <span className="font-medium">{item.title}</span>
                  {item.subtitle && <span className="truncate text-sm text-muted-foreground">{item.subtitle.includes("|") ? item.subtitle.split("|")[1] : item.subtitle}</span>}
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}
    </div>
  );
}
