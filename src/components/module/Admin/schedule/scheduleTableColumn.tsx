"use client";

import { Column } from "@/components/shared/ManagementTable";
import { ISchedule } from "@/types/schedule.interface";
import { formatDateOnly, formatDateTime, formatTimeRange } from "@/utils/formatters";
import { Calendar, ClockIcon } from "lucide-react";

export const scheduleTableColumn: Column<ISchedule>[] = [
  {
    header: "Date",
    accessor: (schedule: ISchedule) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <span>
          {formatDateOnly(schedule.startDateTime)}
        </span>
      </div>
    ),
  },
  {
    header: "Time",
    accessor: (schedule: ISchedule) => (
      <div className="flex items-center gap-2">
        <ClockIcon className="h-4 w-4 text-muted-foreground" />
        <span>
          {formatTimeRange(schedule.startDateTime, schedule.endDateTime)}
        </span>
      </div>
    ),
  },
];
