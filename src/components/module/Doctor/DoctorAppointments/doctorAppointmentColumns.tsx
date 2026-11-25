/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "@/components/shared/ManagementTable";
import { Badge } from "@/components/ui/badge";
import {
  AppointmentStatus,
  IAppointment, STATUS_META } from "@/types/appointments.interface";
import { format } from "@/utils/datetime";
import AppointmentCountdown from "../../Patient/PatientAppointment/AppointmentCountdown";

export const doctorAppointmentColumns: Column<IAppointment>[] = [
  {
    header: "Patient",
    accessor: (appointment) => (
      <div className="flex items-center gap-2">
        <div>
          <p className="font-medium">{appointment.patient?.name || "N/A"}</p>
          <p className="text-xs text-muted-foreground">
            {appointment.patient?.email || ""}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Date & Time",
    accessor: (appointment) => {
      if (!appointment.schedule?.startDateTime) return "N/A";
      return (
        <div className="text-sm space-y-1">
          <p className="font-medium">
            {format(
              new Date(appointment.schedule.startDateTime),
              "MMM d, yyyy"
            )}
          </p>
          <p className="text-muted-foreground">
            {format(new Date(appointment.schedule.startDateTime), "h:mm a")} -{" "}
            {format(new Date(appointment.schedule.endDateTime), "h:mm a")}
          </p>
          {[AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(appointment.status) &&
            appointment.schedule.startDateTime && (
              <div className="pt-1">
                <AppointmentCountdown
                  appointmentDateTime={appointment.schedule.startDateTime}
                  className="text-xs"
                />
              </div>
            )}
        </div>
      );
    },
  },
  {
    header: "Status",
    accessor: (appointment) => {
      const config = STATUS_META[appointment.status] ?? { label: appointment.status, className: "" };
      return (
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      );
    },
  },
  {
    header: "Payment",
    accessor: (appointment) => {
      const isPaid = appointment.paymentStatus === "PAID";
      return (
        <Badge
          variant={isPaid ? "default" : "secondary"}
          className={isPaid ? "bg-green-500" : ""}
        >
          {isPaid ? "Paid" : "Unpaid"}
        </Badge>
      );
    },
  },
  {
    header: "Prescription",
    accessor: (appointment) => {
      return appointment.prescription ? (
        <Badge variant="outline" className="bg-green-50 text-green-700">
          Provided
        </Badge>
      ) : appointment.status === AppointmentStatus.COMPLETED ? (
        <Badge variant="outline" className="bg-amber-50 text-amber-700">
          Pending
        </Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
];
