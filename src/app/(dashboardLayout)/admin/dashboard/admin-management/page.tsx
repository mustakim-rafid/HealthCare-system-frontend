import AdminsFilter from "@/components/module/Admin/AdminsManagement/AdminsFilter";
import AdminsManagementHeader from "@/components/module/Admin/AdminsManagement/AdminsManagementHeader";
import AdminsTable from "@/components/module/Admin/AdminsManagement/AdminsTable";
import { TableSkeleton } from "@/components/shared/skeleton/TableSkeleton";
import TablePagination from "@/components/shared/TablePagination";
import { getAdmins } from "@/services/admin/adminManagement";
import { formatQueryParams } from "@/utils/formatters";
import { Suspense } from "react";

const AdminAdminsManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = formatQueryParams(searchParamsObj);
  const adminsResult = await getAdmins(queryString);

  const totalPages = Math.ceil(
    (adminsResult?.meta?.total || 1) / (adminsResult?.meta?.limit || 1)
  );

  return (
    <div className="space-y-6 p-4">
      <AdminsManagementHeader />

      {/* Search, Filters */}
      <AdminsFilter />

      <Suspense fallback={<TableSkeleton columns={8} rows={10} />}>
        <AdminsTable admins={adminsResult?.data || []} />
        <TablePagination
          currentPage={adminsResult?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </Suspense>
    </div>
  );
};

export default AdminAdminsManagementPage;
