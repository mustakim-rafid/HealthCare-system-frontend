import ScheduleForm from "@/components/module/Admin/schedule/ScheduleForm";
import ScheduleTable from "@/components/module/Admin/schedule/ScheduleTable";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import RefreshButton from "@/components/shared/RefreshButton";
import TablePagination from "@/components/shared/TablePagination";
import { getAllSchedules } from "@/services/admin/scheduleManagement";
import { formatQueryParams } from "@/utils/formatters";

const ScheduleManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObj = await searchParams

  const result = await getAllSchedules(formatQueryParams(queryParamsObj))

  const totalPages = Math.ceil(result.meta.total / result.meta.limit)

  return (
    <div className="p-4 space-y-6">
      <ManagementPageHeader
        title="Schedule Management"
        description="Manage and organize appointment schedules for seamless planning and tracking."
      />
      <ScheduleForm />
      <RefreshButton />
      <ScheduleTable scheduleData={result.data} />
      <TablePagination 
      currentPage={result.meta.page}
      totalPages={totalPages}
      />
    </div>
  );
};

export default ScheduleManagementPage;
