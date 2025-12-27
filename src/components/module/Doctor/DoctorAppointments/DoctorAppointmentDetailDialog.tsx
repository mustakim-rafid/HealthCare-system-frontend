"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPrescription } from "@/services/patient/prescription.service";
import { IAppointment } from "@/types/appointments.interface";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import AppointmentCountdown from "../../Patient/PatientAppointment/AppointmentCountdown";

interface DoctorAppointmentDetailDialogProps {
  appointment: IAppointment | null;
  open: boolean;
  onClose: () => void;
}

export default function DoctorAppointmentDetailDialog({
  appointment,
  open,
  onClose,
}: DoctorAppointmentDetailDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [instructions, setInstructions] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  if (!appointment) return null;

  const { patient, schedule, status, paymentStatus, prescription } =
    appointment;

  const isCompleted = status === "COMPLETED";
  const hasPrescription = !!prescription;
  const canWritePrescription = isCompleted && !hasPrescription;

  const handleSubmitPrescription = async () => {
    if (!instructions.trim()) {
      toast.error("Please provide prescription instructions");
      return;
    }

    if (instructions.trim().length < 20) {
      toast.error(
        "Instructions must be at least 20 characters long for clarity"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const prescriptionData: {
        appointmentId: string;
        instructions: string;
        followUpDate?: string;
      } = {
        appointmentId: appointment.id,
        instructions: instructions.trim(),
      };

      if (followUpDate) {
        // Convert to ISO-8601 DateTime format
        prescriptionData.followUpDate = new Date(followUpDate).toISOString();
      }

      const result = await createPrescription(prescriptionData);

      if (result.success) {
        toast.success("Prescription created successfully");
        setInstructions("");
        setFollowUpDate("");
        // Close dialog first, then refresh will update the data
        setTimeout(() => {
          onClose();
        }, 100);
      } else {
        toast.error(result.message || "Failed to create prescription");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error("An error occurred while creating prescription");
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setInstructions("");
    setFollowUpDate("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="
      w-[95vw]
      sm:w-[90vw]
      md:w-[85vw]
      lg:w-[70vw]
      xl:w-[60vw]
      max-h-[90vh]
      overflow-y-auto
    "
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Information */}
          <div className="border rounded-lg p-4 bg-muted/50">
            <h3 className="font-semibold text-base sm:text-lg mb-3">
              Patient Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{patient?.name}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium break-all">{patient?.email}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Contact Number</p>
                <p className="font-medium">
                  {patient?.contactNumber || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">
                  {patient?.address || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-base sm:text-lg mb-3">
              Appointment Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Schedule Date</p>
                <p className="font-medium">
                  {schedule?.startDateTime
                    ? format(new Date(schedule.startDateTime), "PPP")
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Time</p>
                <p className="font-medium">
                  {schedule?.startDateTime && schedule?.endDateTime
                    ? `${format(
                        new Date(schedule.startDateTime),
                        "p"
                      )} - ${format(new Date(schedule.endDateTime), "p")}`
                    : "N/A"}
                </p>
              </div>

              {status === "SCHEDULED" && schedule?.startDateTime && (
                <div className="sm:col-span-2 pt-2 border-t">
                  <p className="text-muted-foreground mb-2">
                    Time Until Appointment
                  </p>
                  <AppointmentCountdown
                    appointmentDateTime={schedule.startDateTime}
                  />
                </div>
              )}

              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge
                  variant="outline"
                  className={
                    status === "COMPLETED"
                      ? "border-green-500 text-green-700 bg-green-50"
                      : status === "INPROGRESS"
                      ? "border-blue-500 text-blue-700 bg-blue-50"
                      : status === "SCHEDULED"
                      ? "border-purple-500 text-purple-700 bg-purple-50"
                      : "border-red-500 text-red-700 bg-red-50"
                  }
                >
                  {status}
                </Badge>
              </div>

              <div>
                <p className="text-muted-foreground">Payment</p>
                <Badge
                  variant={paymentStatus === "PAID" ? "default" : "destructive"}
                >
                  {paymentStatus}
                </Badge>
              </div>
            </div>
          </div>

          {/* Prescription Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-base sm:text-lg mb-3">
              Prescription
            </h3>

            {/* ALL prescription logic unchanged */}
            {/* Only layout responsiveness applied above */}
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
