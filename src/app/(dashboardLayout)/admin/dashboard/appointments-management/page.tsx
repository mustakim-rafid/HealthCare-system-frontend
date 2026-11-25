import type { Metadata } from "next";
import Link from "next/link";
import { format } from "date-fns";
import { serverFetch } from "@/lib/serverFetch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { IAppointment, STATUS_META } from "@/types/appointments.interface";

export const metadata: Metadata = { title: "Appointments" };

const STATUSES = ["", "PENDING_PAYMENT", "CONFIRMED", "POSTPONED", "COMPLETED", "CANCELLED", "NO_SHOW"];

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; searchTerm?: string; appointment?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const limit = 15;
  const qs = new URLSearchParams({ page: String(page), limit: String(limit), sortBy: "startDateTime", sortOrder: "desc" });
  if (sp.status && STATUSES.includes(sp.status)) qs.set("status", sp.status);
  const term = (sp.appointment ?? sp.searchTerm ?? "").slice(0, 64);
  if (term) qs.set("searchTerm", term);

  let rows: IAppointment[] = [];
  let total = 0;
  let error: string | null = null;
  try {
    const res = await serverFetch.get(`/appointment?${qs}`, { cache: "no-store" });
    const json = await res.json();
    if (json.success) {
      rows = json.data;
      total = json.meta?.total ?? 0;
    } else error = json.message;
  } catch {
    error = "Could not load appointments.";
  }
  const pages = Math.max(1, Math.ceil(total / limit));
  const link = (p: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams();
    const merged = { status: sp.status, searchTerm: term || undefined, page, ...p };
    Object.entries(merged).forEach(([k, v]) => v !== undefined && v !== "" && next.set(k, String(v)));
    return `/admin/dashboard/appointments-management?${next}`;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="text-sm text-muted-foreground">All bookings across doctors and patients ({total}).</p>
      </div>
      <form className="flex flex-wrap gap-2" action="/admin/dashboard/appointments-management">
        <label htmlFor="appt-search" className="sr-only">
          Search
        </label>
        <input id="appt-search" name="searchTerm" defaultValue={term} placeholder="Doctor, patient or booking id" className="h-9 w-64 rounded-md border bg-background px-3 text-sm" />
        <label htmlFor="appt-status" className="sr-only">
          Status
        </label>
        <select id="appt-status" name="status" defaultValue={sp.status ?? ""} className="h-9 rounded-md border bg-background px-3 text-sm">
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s ? STATUS_META[s].label : "All statuses"}
            </option>
          ))}
        </select>
        <Button type="submit" size="sm" className="h-9">
          Filter
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                    No appointments match these filters.
                  </TableCell>
                </TableRow>
              )}
              {rows.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.schedule ? format(new Date(a.schedule.startDateTime), "MMM d, yyyy · h:mm a") : "—"}</TableCell>
                  <TableCell>{a.patient?.name}</TableCell>
                  <TableCell>{a.doctor?.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_META[a.status]?.className}>
                      {STATUS_META[a.status]?.label ?? a.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{a.paymentStatus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {pages > 1 && (
        <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
          {page > 1 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={link({ page: page - 1 })}>Previous</Link>
            </Button>
          )}
          <span className="text-sm text-muted-foreground">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <Button variant="outline" size="sm" asChild>
              <Link href={link({ page: page + 1 })}>Next</Link>
            </Button>
          )}
        </nav>
      )}
    </div>
  );
}
