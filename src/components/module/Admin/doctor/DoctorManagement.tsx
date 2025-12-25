"use client";

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import RefreshButton from "@/components/shared/RefreshButton";
import ManagementTable from "@/components/shared/ManagementTable";
import { toast } from "sonner";
import DoctorFormDialog from "./DoctorFormDialog";
import { ISpeciality } from "@/types/speciality.interface";
import { IDoctor } from "@/types/doctor.interface";
import SearchFilter from "@/components/shared/SearchFilter";
import SelectFilter from "@/components/shared/SelectFilter";
import { doctorTableColumn } from "./doctorTableColumn";
import { deleteDoctor } from "@/services/admin/doctorManagement";
import DoctorViewDetailsDialog from "./DoctorViewDetailsDialog";

interface DoctorManagementProps {
  doctorData: IDoctor[];
  specialities: ISpeciality[];
}

const DoctorManagement = ({
  doctorData,
  specialities,
}: DoctorManagementProps) => {
  const [open, setOpen] = useState(false);
  const [viewDoctorDialogOpen, setViewDoctorDialogOpen] = useState(false);
  const [editDoctorDialogOpen, setEditDoctorDialogOpen] = useState(false);
  const [editDoctorInfo, setEditDoctorInfo] = useState<Partial<IDoctor>>({ name: "" });
  const [viewingDoctor, setViewingDoctor] = useState<IDoctor>();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleGetRowKey = (doctor: IDoctor) => doctor.id;

  const handleDelete = async (doctor: IDoctor) => {
    const result = await deleteDoctor(doctor.id);
    if (result.success) {
      toast.success(result.message);
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.message);
    }
  };

  const handleViewDoctor = async (doctor: IDoctor) => {
    setViewingDoctor(doctor);
    setViewDoctorDialogOpen(true);
  };

  const handleEditDoctor = async (doctor: IDoctor) => {
    setEditDoctorInfo(doctor);
    setEditDoctorDialogOpen(true);
  };

  return (
    <div className="md:p-5 p-3 space-y-5">
      <ManagementPageHeader
        title="Doctor Management"
        description="Centralize and manage doctor information for seamless administration and categorization"
      >
        <DoctorFormDialog
          key={open ? "open" : "closed"}
          open={open}
          onOpenChange={setOpen}
          onSuccess={handleSuccess}
          specialities={specialities}
        />
      </ManagementPageHeader>

      <div className="flex gap-3">
        <SearchFilter />

        <SelectFilter
          paramName="doctorSpeciality"
          placeholder="Select Speciality"
          options={specialities.map((speciality) => ({
            label: speciality.title,
            value: speciality.title,
          }))}
        />

        <RefreshButton />
      </div>

      <ManagementTable
        data={doctorData}
        columns={doctorTableColumn}
        getRowKey={handleGetRowKey}
        onDelete={handleDelete}
        onView={handleViewDoctor}
        onEdit={handleEditDoctor}
        isRefreshing={isPending}
        emptyMessage="No doctor found"
      />

      <DoctorViewDetailsDialog
        open={viewDoctorDialogOpen}
        onOpenChange={setViewDoctorDialogOpen}
        doctor={viewingDoctor as IDoctor}
      />

      {/* Edit doctor dialog  */}
      {/* {editDoctorDialogOpen && editDoctorInfo && ( */}
        <DoctorFormDialog
          key={editDoctorDialogOpen ? "open" : "closed"}
          open={editDoctorDialogOpen}
          onOpenChange={setEditDoctorDialogOpen}
          onSuccess={handleSuccess}
          specialities={specialities}
          doctor={editDoctorInfo}
        />
      {/* // )} */}
    </div>
  );
};

export default DoctorManagement;
