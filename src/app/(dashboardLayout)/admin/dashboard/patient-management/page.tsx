import PatientsFilter from "@/components/module/Admin/PatientsManagement/PatientsFilter";
import PatientsTable from "@/components/module/Admin/PatientsManagement/PatientsTable";
import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { TableSkeleton } from "@/components/shared/skeleton/TableSkeleton";
import TablePagination from "@/components/shared/TablePagination";
import { getPatients } from "@/services/admin/patientManagement";
import { formatQueryParams } from "@/utils/formatters";
import { Suspense } from "react";

const AdminPatientsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = formatQueryParams(searchParamsObj);
  const patientsResult = await getPatients(queryString);

  const totalPages = Math.ceil(
    (patientsResult?.meta?.total || 1) / (patientsResult?.meta?.limit || 1)
  );

  return (
    <div className="space-y-6 p-4">
      <ManagementPageHeader
        title="Patients Management"
        description="Manage patients information and details"
      />

      {/* Search, Filters */}
      <PatientsFilter />

      <Suspense fallback={<TableSkeleton columns={10} rows={10} />}>
        <PatientsTable patients={patientsResult?.data || []} />
        <TablePagination
          currentPage={patientsResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default AdminPatientsManagementPage;
