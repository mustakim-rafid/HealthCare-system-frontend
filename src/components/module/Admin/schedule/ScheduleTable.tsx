"use client";

import ManagementTable from "@/components/shared/ManagementTable";
import { ISchedule } from "@/types/schedule.interface";
import React, { useTransition } from "react";
import { scheduleTableColumn } from "./scheduleTableColumn";
import { deleteSchedule } from "@/services/admin/scheduleManagement";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ScheduleTableProps {
  scheduleData: ISchedule[];
}

const ScheduleTable = ({ scheduleData }: ScheduleTableProps) => {
  const handleGetRowKey = (schedule: ISchedule) => schedule.id;
  const [isPending, startTransition] = useTransition();
  const router = useRouter()

  const handleDeleteSchedule = async (schedule: ISchedule) => {
    const result = await deleteSchedule(schedule.id)
    if (result.success) {
      toast.success(result.message);
      startTransition(() => {
        router.refresh();
      });
    } else {
      toast.error(result.message);
    } 
  }

  return (
    <ManagementTable
      data={scheduleData}
      columns={scheduleTableColumn}
      getRowKey={handleGetRowKey}
      onDelete={handleDeleteSchedule}
      emptyMessage="No schedule found"
    />
  );
};

export default ScheduleTable;
