import { INavMain } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute } from "./auth-utils";
import { UserRole } from "@/types/common";

export const adminNavMainItems: INavMain[] = [
  {
    title: "User management",
    icon: "Users",
    isActive: false,
    items: [
      {
        title: "Admins",
        url: "/admin/dashboard/admin-management",
      },
      {
        title: "Doctors",
        url: "/admin/dashboard/doctor-management",
      },
      {
        title: "Patients",
        url: "/admin/dashboard/patient-management",
      },
    ],
  },
  {
    title: "Hospital management",
    icon: "Hospital",
    isActive: false,
    items: [
      {
        title: "Specialities",
        url: "/admin/dashboard/speciality-management",
      },
      {
        title: "Schedules",
        url: "/admin/dashboard/schedule-management",
      },
    ],
  },
];

export const doctorNavMainItems: INavMain[] = [
  {
    title: "Appointment",
    icon: "Stethoscope",
    isActive: false,
    items: [
      {
        title: "Appointments",
        url: "/doctor/dashboard/appointments",
      },
      {
        title: "My Schedules",
        url: "/doctor/dashboard/my-schedules",
      },
    ],
  },
];

export const patientNavMainItems: INavMain[] = [
  {
    title: "Appointment",
    icon: "Stethoscope",
    isActive: false,
    items: [
      {
        title: "Book appointment",
        url: "/consultation"
      },
      {
        title: "My appointments",
        url: "/dashboard/my-appointments",
      },
    ],
  },
  {
    title: "Medical record",
    icon: "FileHeart",
    isActive: false,
    items: [
      {
        title: "My prescriptions",
        url: "/dashboard/my-prescriptions",
      },
    ],
  },
];

export const getCommonNavMainItemsByRole = (userRole: UserRole): INavMain[] => {
  return [
    {
      title: "Home",
      icon: "Home",
      isActive: true,
      items: [
        {
          title: "Home page",
          url: "/"
        },
        {
          title: "Overview",
          url: getDefaultDashboardRoute(userRole),
        },
      ],
    },
    {
      title: "Settings",
      icon: "Settings",
      isActive: false,
      items: [
        {
          title: "My profile",
          url: "/my-profile",
        },
        {
          title: "Change password",
          url: "/change-password",
        },
      ],
    },
  ];
};

export const getNavMainItemsByRole = (userRole: UserRole): INavMain[] => {
  switch (userRole) {
    case "ADMIN":
      return [...getCommonNavMainItemsByRole(userRole), ...adminNavMainItems];
    case "DOCTOR":
      return [...getCommonNavMainItemsByRole(userRole), ...doctorNavMainItems];
    case "PATIENT":
      return [...getCommonNavMainItemsByRole(userRole), ...patientNavMainItems];
  }
};
