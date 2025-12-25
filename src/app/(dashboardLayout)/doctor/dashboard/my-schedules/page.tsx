import MySchedulesFilters from "@/components/module/Doctor/MySchedules/MyScheduleFilters";
import MySchedulesHeader from "@/components/module/Doctor/MySchedules/MyScheduleHeader";
import MySchedulesTable from "@/components/module/Doctor/MySchedules/MyScheduleTable";
import { TableSkeleton } from "@/components/shared/skeleton/TableSkeleton";
import TablePagination from "@/components/shared/TablePagination";
import { getAvailableSchedules, getDoctorOwnSchedules } from "@/services/doctor/doctorSchedule.service";
import { formatQueryParams } from "@/utils/formatters";
import { Suspense } from "react";

interface DoctorMySchedulesPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    isBooked?: string;
  }>;
}

const DoctorMySchedulesPage = async ({
  searchParams,
}: DoctorMySchedulesPageProps) => {
  const params = await searchParams;

  const queryString = formatQueryParams(params);
  const myDoctorsScheduleResponse = await getDoctorOwnSchedules(queryString);
  const availableSchedulesResponse = await getAvailableSchedules();

  const schedules = myDoctorsScheduleResponse?.data || [];
  const meta = myDoctorsScheduleResponse?.meta;
  const totalPages = Math.ceil((meta?.total || 1) / (meta?.limit || 1));

  return (
    <div className="space-y-6 p-4">
      <MySchedulesHeader
        availableSchedules={availableSchedulesResponse?.data || []}
      />

      <MySchedulesFilters />

      <Suspense fallback={<TableSkeleton columns={5} rows={10} />}>
        <MySchedulesTable schedules={schedules} />
        <TablePagination
          currentPage={meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default DoctorMySchedulesPage;
