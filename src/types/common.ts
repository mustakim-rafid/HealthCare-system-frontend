import { IDoctor } from "./doctor.interface";

export type UserRole = "ADMIN" | "PATIENT" | "DOCTOR"

export type Status = "ACTIVE" | "INACTIVE" | "DELETED"

export interface DoctorSuggestion {
  suggestedDoctor: string;
  specialization: string;
  reason: string;
  rating: number;
  doctorInfo: IDoctor;
}