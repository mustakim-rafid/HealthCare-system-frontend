"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import SpecialityFormDialog from "./SpecialityFormDialog";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RefreshButton from "@/components/shared/RefreshButton";
import ManagementTable from "@/components/shared/ManagementTable";
import { specialityTableColumn } from "./specialityTableColumn";
import { toast } from "sonner";
import { deleteSpeciality } from "@/services/admin/specialityManagement";
import { ISpeciality } from "@/types/speciality.interface";

interface SpecialityManagementProps {
  data: ISpeciality[];
}

const SpecialityManagement = ({ data }: SpecialityManagementProps) => {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleGetRowKey = (row: ISpeciality) => row.id;

  const handleDelete = async (row: ISpeciality) => {
    const result = await deleteSpeciality(row.id)
    if (result.success) {
      toast.success(result.message);
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="md:p-5 p-3 space-y-5">
      <ManagementPageHeader
        title="Speciality Management"
        description="Manage and organize medical specialities for easy classification"
      >
        <SpecialityFormDialog
          open={open}
          onOpenChange={setOpen}
          onSuccess={handleSuccess}
        />
      </ManagementPageHeader>

      <RefreshButton />

      <ManagementTable
        data={data}
        columns={specialityTableColumn}
        getRowKey={handleGetRowKey}
        onDelete={handleDelete}
        isRefreshing={isPending}
      />
    </div>
  );
};

export default SpecialityManagement;
