import StatusBadge from "@/components/shared/cells/StatusBadge";
import UserCell from "@/components/shared/cells/UserCell";
import { Column } from "@/components/shared/ManagementTable";
import { Badge } from "@/components/ui/badge";
import { IDoctor } from "@/types/doctor.interface";
import { formatDate } from "@/utils/formatters";

export const doctorTableColumn: Column<IDoctor>[] = [
  {
    header: "User info",
    accessor: (doctor) => (
      <UserCell
        name={doctor.name}
        email={doctor.email}
        photoUrl={doctor.profilePhoto}
      />
    ),
  },
  {
    header: "Status",
    accessor: (doctor) => <StatusBadge status={doctor?.user?.status || "ACTIVE"} />,
  },
  {
    header: "Specialities",
    accessor: (doctor) => (
      <div className="flex flex-wrap gap-1">
        {doctor.doctorSpeciality.map((spec) => (
          <Badge key={spec.specialityId} variant="outline">
            {spec.speciality.title}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    header: "Experience",
    accessor: (doctor) => `${doctor.experience} years`,
  },
  {
    header: "Qualification",
    accessor: "qualification",
  },
  {
    header: "Designation",
    accessor: "designation",
  },
  {
    header: "Current Workplace",
    accessor: "currentWorkingPlace",
  },
  {
    header: "Fee",
    accessor: (doctor) => `BDT ${doctor.appointmentFee}`,
  },
  {
    header: "Gender",
    accessor: (doctor) =>
      doctor.gender === "MALE" ? "Male" : "Female",
  },
  {
    header: "Joined",
    accessor: (doctor) => formatDate(doctor.createdAt as Date)
  }
];
