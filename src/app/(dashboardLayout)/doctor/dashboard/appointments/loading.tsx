import { TableSkeleton } from "@/components/shared/skeleton/TableSkeleton";

export default function DoctorAppointmentsLoading() {
  return <TableSkeleton columns={8} rows={10} />;
}