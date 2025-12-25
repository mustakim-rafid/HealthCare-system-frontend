import DoctorManagement from "@/components/module/Admin/doctor/DoctorManagement";
import TablePagination from "@/components/shared/TablePagination";
import { getAllDoctors } from "@/services/admin/doctorManagement";
import { getAllSpecialities } from "@/services/admin/specialityManagement";
import { formatQueryParams } from "@/utils/formatters";

const DoctorManagementPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const queryParamsObj = await searchParams;

  const doctors = await getAllDoctors(formatQueryParams(queryParamsObj));

  const specialities = await getAllSpecialities();

  const totalPages = Math.ceil(doctors.meta.total / doctors.meta.limit)

  return (
    <>
      <DoctorManagement
        doctorData={doctors.data}
        specialities={specialities.data}
      />
      <TablePagination 
      totalPages={totalPages}
      currentPage={doctors.meta.page}
      />
    </>
  );
};

export default DoctorManagementPage;
