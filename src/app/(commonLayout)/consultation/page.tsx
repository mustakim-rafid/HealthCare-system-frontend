export const dynamic = "force-dynamic";

import DoctorGrid from "@/components/module/Consultation/DoctorGrid";
import RefreshButton from "@/components/shared/RefreshButton";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { TableSkeleton } from "@/components/shared/skeleton/TableSkeleton";
import TablePagination from "@/components/shared/TablePagination";
import { getAllDoctors } from "@/services/admin/doctorManagement";
import { getAllSpecialities } from "@/services/admin/specialityManagement";
import { ISpeciality } from "@/types/speciality.interface";
import { formatQueryParams } from "@/utils/formatters";
import { Suspense } from "react";

export const revalidate = 600;

const ConsultationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParamsObj = await searchParams;
  const queryString = formatQueryParams(searchParamsObj);

  const [doctorsResponse, specialitiesResponse] = await Promise.all([
    getAllDoctors(queryString),
    getAllSpecialities(),
  ]);

  const doctors = doctorsResponse?.data || [];
  const specialities = specialitiesResponse?.data || [];
  
  const totalPages = Math.ceil(
    doctorsResponse.meta.total / doctorsResponse.meta.limit
  );

  return (
    <div className="container mx-auto px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find a Doctor</h1>
          <p className="text-muted-foreground mt-2">
            Search and book appointments with our qualified healthcare
            professionals
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <SearchFilter />

          <SelectFilter
            paramName="doctorSpeciality"
            placeholder="Select Speciality"
            options={specialities.map((speciality: ISpeciality) => ({
              label: speciality.title,
              value: speciality.title,
            }))}
          />

          <RefreshButton />
        </div>

        {/* Doctor Grid */}
        <Suspense fallback={<TableSkeleton columns={3} />}>
          <DoctorGrid doctors={doctors} />
        </Suspense>

        {/* Pagination */}
        <TablePagination
          currentPage={doctorsResponse?.meta?.page || 1}
          totalPages={totalPages || 1}
        />
      </div>
    </div>
  );
};

export default ConsultationPage;
