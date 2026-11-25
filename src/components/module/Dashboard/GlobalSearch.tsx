"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "@/utils/datetime";
import { CalendarDays, FileText, Loader2, Search, Stethoscope, Tag, User } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/types/common";

type Item = { id: string; title: string; subtitle?: string; href: string };
type Groups = { doctors: Item[]; patients: Item[]; bookings: Item[]; specialities: Item[] };
const EMPTY: Groups = { doctors: [], patients: [], bookings: [], specialities: [] };

export const PAGES_BY_ROLE: Record<UserRole, { title: string; href: string }[]> = {
  ADMIN: [
    { title: "Dashboard", href: "/admin/dashboard" },
    { title: "Appointments", href: "/admin/dashboard/appointments-management" },
    { title: "Doctors", href: "/admin/dashboard/doctor-management" },
    { title: "Patients", href: "/admin/dashboard/patient-management" },
    { title: "Admins", href: "/admin/dashboard/admin-management" },
    { title: "Schedules", href: "/admin/dashboard/schedule-management" },
    { title: "Specialities", href: "/admin/dashboard/speciality-management" },
    { title: "My profile", href: "/my-profile" },
    { title: "Change password", href: "/change-password" },
  ],
  DOCTOR: [
    { title: "Dashboard", href: "/doctor/dashboard" },
    { title: "Appointments", href: "/doctor/dashboard/appointments" },
    { title: "My schedules", href: "/doctor/dashboard/my-schedules" },
    { title: "My profile", href: "/my-profile" },
    { title: "Change password", href: "/change-password" },
  ],
  PATIENT: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "My appointments", href: "/dashboard/my-appointments" },
    { title: "My prescriptions", href: "/dashboard/my-prescriptions" },
    { title: "Find a doctor", href: "/consultation" },
    { title: "My profile", href: "/my-profile" },
    { title: "Change password", href: "/change-password" },
  ],
};

const bookingSubtitle = (s?: string) => {
  if (!s) return "";
  const [iso, status] = s.split("|");
  const d = new Date(iso);
  return `${Number.isNaN(d.getTime()) ? "" : format(d, "MMM d, h:mm a")} · ${(status ?? "").replace("_", " ").toLowerCase()}`;
};

/**
 * Dashboard-wide search: debounced (250ms), stale requests aborted, role-scoped results from the
 * API (users only get records they may access), grouped suggestions, ↑↓/Enter/Esc via cmdk, Ctrl/Cmd+K.
 */
export default function GlobalSearch({ role }: { role: UserRole }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Groups>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      abortRef.current?.abort();
      setResults(EMPTY);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&limit=5`, { signal: controller.signal });
        const json = await res.json();
        if (json.success) {
          setResults(json.data);
          setError(null);
        } else setError(json.message || "Search failed");
      } catch (err) {
        if ((err as Error).name !== "AbortError") setError("Search failed");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [q]);

  const pages = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PAGES_BY_ROLE[role].filter((p) => !term || p.title.toLowerCase().includes(term));
  }, [q, role]);

  const go = (href: string) => {
    setOpen(false);
    setQ("");
    router.push(href);
  };

  const total = results.doctors.length + results.patients.length + results.bookings.length + results.specialities.length + pages.length;

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full max-w-md justify-start rounded-md bg-muted/40 text-sm font-normal text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Search (Ctrl+K)"
      >
        <Search className="mr-2 h-4 w-4" aria-hidden />
        <span className="truncate">Search doctors, patients, bookings…</span>
        <kbd className="pointer-events-none absolute right-2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] sm:flex">
          Ctrl K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search" description="Search across the dashboard" shouldFilter={false}>
        <CommandInput
          placeholder="Type to search… (Enter to see all results)"
          value={q}
          onValueChange={setQ}
          maxLength={64}
          onKeyDown={(e) => {
            // Enter with nothing highlighted → full results page
            if (e.key === "Enter" && q.trim().length >= 2 && total === 0) go(`/search?q=${encodeURIComponent(q.trim())}`);
          }}
        />
        <CommandList>
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground" role="status">
              <Loader2 className="h-4 w-4 animate-spin" /> Searching…
            </div>
          )}
          {error && <p className="px-4 py-3 text-sm text-destructive">{error}</p>}
          {!loading && <CommandEmpty>{q.trim().length < 2 ? "Type at least 2 characters." : "No results found."}</CommandEmpty>}
          {results.bookings.length > 0 && (
            <CommandGroup heading="Bookings">
              {results.bookings.map((b) => (
                <CommandItem key={b.id} value={`booking-${b.id}`} onSelect={() => go(b.href)}>
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  <span className="truncate">{b.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{bookingSubtitle(b.subtitle)}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {results.doctors.length > 0 && (
            <CommandGroup heading="Doctors">
              {results.doctors.map((d) => (
                <CommandItem key={d.id} value={`doctor-${d.id}`} onSelect={() => go(d.href)}>
                  <Stethoscope className="h-4 w-4" aria-hidden />
                  <span className="truncate">{d.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{d.subtitle}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {results.patients.length > 0 && (
            <CommandGroup heading="Patients">
              {results.patients.map((p) => (
                <CommandItem key={p.id} value={`patient-${p.id}`} onSelect={() => go(p.href)}>
                  <User className="h-4 w-4" aria-hidden />
                  <span className="truncate">{p.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{p.subtitle}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {results.specialities.length > 0 && (
            <CommandGroup heading="Specialities">
              {results.specialities.map((s) => (
                <CommandItem key={s.id} value={`spec-${s.id}`} onSelect={() => go(s.href)}>
                  <Tag className="h-4 w-4" aria-hidden />
                  {s.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {pages.length > 0 && (
            <CommandGroup heading="Pages">
              {pages.map((p) => (
                <CommandItem key={p.href} value={`page-${p.href}`} onSelect={() => go(p.href)}>
                  <FileText className="h-4 w-4" aria-hidden />
                  {p.title}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          {q.trim().length >= 2 && (
            <CommandGroup heading="More">
              <CommandItem value="all-results" onSelect={() => go(`/search?q=${encodeURIComponent(q.trim())}`)}>
                <Search className="h-4 w-4" aria-hidden /> See all results for “{q.trim()}”
              </CommandItem>
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
