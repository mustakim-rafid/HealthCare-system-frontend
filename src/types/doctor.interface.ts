import { Status } from "./common";
import { IDoctorSchedule } from "./schedule.interface";

interface DoctorSpecialityObj {
  specialityId: string;
  doctorId: string;
  speciality: {
    id: string;
    title: string;
    icon: string;
  };
}

export interface IDoctor {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  contactNumber?: string;
  experience: number;
  address?: string;
  registrationNumber: string;
  gender: "MALE" | "FEMALE";
  appointmentFee: number;
  qualification: string;
  currentWorkingPlace: string;
  designation: string;
  averageRating: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  doctorSpeciality: DoctorSpecialityObj[];
  user?: {
    status: Status;
  };
  doctorSchedule?: IDoctorSchedule[];
}

export interface IUpdateDoctorPayload {
  name?: string;
  contactNumber?: string | null | undefined;
  address?: string | null | undefined;
  experience?: number | undefined;
  gender?: "MALE" | "FEMALE";
  appointmentFee?: number;
  registrationNumber?: string;
  qualification?: string;
  currentWorkingPlace?: string;
  designation?: string;
  specialities?: string;
}
