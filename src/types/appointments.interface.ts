import { IDoctor } from "./doctor.interface";
import { IPatient } from "./patient.interface";
import { IPrescription } from "./prescription.interface";
import { IReview } from "./review.interface";
import { ISchedule } from "./schedule.interface";

/** Must match the backend AppointmentStatus enum exactly. */
export enum AppointmentStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  SCHEDULED = "SCHEDULED", // legacy (bookings created before the payment lifecycle)
  CONFIRMED = "CONFIRMED",
  POSTPONED = "POSTPONED",
  INPROGRESS = "INPROGRESS",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELLED", // kept for existing imports; the backend value is CANCELLED
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum PaymentStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  REFUNDED = "REFUNDED",
}

export const STATUS_META: Record<string, { label: string; className: string; description: string }> = {
  PENDING_PAYMENT: { label: "Awaiting payment", className: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30", description: "Slot is held while you complete payment." },
  SCHEDULED: { label: "Scheduled", className: "bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30", description: "Booked (legacy). Complete payment to confirm." },
  CONFIRMED: { label: "Confirmed", className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30", description: "Paid and confirmed." },
  POSTPONED: { label: "Postponed", className: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30", description: "The doctor proposed a new time." },
  INPROGRESS: { label: "In progress", className: "bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30", description: "Consultation is running." },
  COMPLETED: { label: "Completed", className: "bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30", description: "Consultation finished." },
  CANCELLED: { label: "Cancelled", className: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30", description: "This booking was cancelled." },
  NO_SHOW: { label: "No-show", className: "bg-zinc-500/15 text-zinc-700 dark:text-zinc-300 border-zinc-500/30", description: "Patient did not attend." },
};

export interface IAppointment {
  id: string;
  patientId: string;
  patient?: IPatient;
  doctorId: string;
  doctor?: IDoctor;
  scheduleId: string;
  schedule?: ISchedule;
  videoCallingId: string;
  status: AppointmentStatus;
  paymentStatus: PaymentStatus;
  meetLink?: string | null;
  holdExpiresAt?: string | null;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  cancelReason?: string | null;
  cancelledBy?: string | null;
  proposedScheduleId?: string | null;
  proposedSchedule?: ISchedule | null;
  postponeMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  prescription?: IPrescription;
  review?: IReview;
  Review?: IReview;
  payment?: { amount: number; paymentStatus: PaymentStatus; paidAt?: string | null; refundedAt?: string | null } | null;
  policy?: { cancellationCutoffHours: number; canCancelWithRefund: boolean; paymentEnabled: boolean };
}

export interface IAppointmentMessage {
  id: string;
  appointmentId: string;
  senderEmail: string;
  senderRole: "ADMIN" | "DOCTOR" | "PATIENT";
  body: string;
  createdAt: string;
}

export interface IPayment {
  id: string;
  appointmentId: string;
  amount: number;
  transactionId: string;
  status: PaymentStatus;
  paymentGatewayData?: any;
  stripeEventId?: string;

  createdAt: string;
  updatedAt: string;
}

export interface IAppointmentFormData {
  doctorId: string;
  scheduleId: string;
}
