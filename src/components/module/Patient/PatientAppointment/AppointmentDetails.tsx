"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format, formatDistanceToNowStrict } from "date-fns";
import { toast } from "sonner";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  Clock,
  CreditCard,
  FileText,
  Loader2,
  Star,
  Stethoscope,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cancelAppointment, payForAppointment, respondToPostponement } from "@/services/patient/appointment.service";
import { IAppointment, PaymentStatus, STATUS_META } from "@/types/appointments.interface";
import AppointmentCountdown from "./AppointmentCountdown";
import ReviewDialog from "./ReviewDialog";
import MessageThread from "../../Booking/MessageThread";
import AddToCalendar from "../../Booking/AddToCalendar";
import JoinMeetingButton from "../../Booking/JoinMeetingButton";

export const StatusBadge = ({ status }: { status: string }) => {
  const meta = STATUS_META[status] ?? { label: status, className: "" };
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
};

const AppointmentDetails = ({ appointment }: { appointment: IAppointment }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [showReview, setShowReview] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [reason, setReason] = useState("");

  const { doctor, schedule, status, paymentStatus } = appointment;
  const start = new Date(schedule!.startDateTime);
  const end = new Date(schedule!.endDateTime);
  const isPaid = paymentStatus === PaymentStatus.PAID;
  const awaitingPayment = (status === "PENDING_PAYMENT" || status === "SCHEDULED") && paymentStatus === PaymentStatus.UNPAID;
  const isActive = ["PENDING_PAYMENT", "SCHEDULED", "CONFIRMED", "POSTPONED"].includes(status);
  const review = appointment.review ?? appointment.Review;
  const canReview = status === "COMPLETED" && isPaid && !review;
  const policy = appointment.policy;
  const cancelBlocked = isPaid && policy && !policy.canCancelWithRefund && status !== "POSTPONED";

  useEffect(() => {
    if (searchParams.get("payment") === "cancelled") toast.info("Payment was cancelled. Your slot is still held for a short time.");
  }, [searchParams]);

  const run = (fn: () => Promise<{ success: boolean; message?: string; data?: any }>, success: string, after?: (data: any) => void) =>
    startTransition(async () => {
      const res = await fn();
      if (res.success) {
        toast.success(success);
        after?.(res.data);
        router.refresh();
      } else toast.error(res.message || "Something went wrong");
    });

  const pay = () =>
    startTransition(async () => {
      const res = await payForAppointment(appointment.id);
      if (res.success && res.data?.paymentUrl) window.location.href = res.data.paymentUrl;
      else toast.error(res.message || "Could not start payment");
    });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="-ml-3 mb-2">
            <Link href="/dashboard/my-appointments">
              <ArrowLeft className="mr-1 h-4 w-4" aria-hidden /> My appointments
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Appointment details</h1>
          <p className="mt-1 text-sm text-muted-foreground">Booking #{appointment.id.slice(0, 8)}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
          <Badge variant="outline">{paymentStatus === "REFUNDED" ? "Refunded" : isPaid ? "Paid" : "Unpaid"}</Badge>
        </div>
      </div>

      {/* Action banners */}
      {awaitingPayment && (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <CreditCard className="mt-0.5 h-5 w-5 text-amber-600" aria-hidden />
              <div>
                <p className="font-semibold">Complete payment to confirm your booking</p>
                <p className="text-sm text-muted-foreground">
                  {appointment.holdExpiresAt
                    ? `Your slot is held for ${formatDistanceToNowStrict(new Date(appointment.holdExpiresAt))}. Unpaid holds are released automatically.`
                    : "Pay now to confirm this appointment."}
                </p>
              </div>
            </div>
            <Button onClick={pay} disabled={pending || policy?.paymentEnabled === false} size="lg">
              {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
              Pay {doctor?.appointmentFee ? `৳${doctor.appointmentFee}` : "now"}
            </Button>
          </CardContent>
        </Card>
      )}

      {status === "POSTPONED" && appointment.proposedSchedule && (
        <Card className="border-orange-500/40 bg-orange-500/5">
          <CardContent className="space-y-4 pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 text-orange-600" aria-hidden />
              <div>
                <p className="font-semibold">Your doctor postponed this appointment</p>
                {appointment.postponeMessage && <p className="mt-1 text-sm italic">“{appointment.postponeMessage}”</p>}
                <p className="mt-2 text-sm">
                  Proposed new time: <strong>{format(new Date(appointment.proposedSchedule.startDateTime), "EEEE, MMM d · h:mm a")}</strong>
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button disabled={pending} onClick={() => run(() => respondToPostponement(appointment.id, "accept"), "New time confirmed")}>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Accept new time
              </Button>
              <Button
                variant="outline"
                disabled={pending}
                onClick={() => run(() => respondToPostponement(appointment.id, "cancel"), "Appointment cancelled and refund requested")}
              >
                <XCircle className="mr-2 h-4 w-4" /> Cancel & refund
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {canReview && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <Star className="mt-0.5 h-5 w-5 text-amber-500" aria-hidden />
              <p className="font-medium">How was your consultation with {doctor?.name}? Leave a quick review.</p>
            </div>
            <Button onClick={() => setShowReview(true)}>Write a review</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarClock className="h-4 w-4" aria-hidden /> Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xl font-semibold">{format(start, "EEEE, MMMM d, yyyy")}</p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" aria-hidden />
                  {format(start, "h:mm a")} – {format(end, "h:mm a")} <span className="text-xs">(your local time)</span>
                </p>
              </div>
              {isActive && start > new Date() && <AppointmentCountdown appointmentDateTime={start} />}
              {(status === "CONFIRMED" || status === "SCHEDULED") && isPaid && (
                <AddToCalendar
                  id={appointment.id}
                  title={`Consultation with ${doctor?.name ?? "your doctor"}`}
                  description={`Health Care video consultation.${appointment.meetLink ? ` Join: ${appointment.meetLink}` : ""}`}
                  start={start}
                  end={end}
                  location={appointment.meetLink}
                />
              )}
              {status === "CANCELLED" && (
                <p className="rounded-md bg-muted p-3 text-sm">
                  Cancelled{appointment.cancelledAt ? ` on ${format(new Date(appointment.cancelledAt), "PPp")}` : ""}
                  {appointment.cancelReason ? ` — ${appointment.cancelReason}` : ""}.
                  {paymentStatus === "REFUNDED" && " Your payment was refunded."}
                </p>
              )}
            </CardContent>
          </Card>

          <MessageThread appointmentId={appointment.id} viewerRole="PATIENT" />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Video consultation</CardTitle>
            </CardHeader>
            <CardContent>
              {appointment.meetLink ? (
                <JoinMeetingButton meetLink={appointment.meetLink} start={start} end={end} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {isPaid && ["CONFIRMED", "SCHEDULED", "INPROGRESS"].includes(status)
                    ? "Your doctor will share the Google Meet link here before the consultation. You will get a notification."
                    : "The meeting link appears here once your booking is paid and confirmed."}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Stethoscope className="h-4 w-4" aria-hidden /> Doctor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="text-base font-semibold">{doctor?.name}</p>
              <p className="text-muted-foreground">{doctor?.designation}</p>
              {doctor?.qualification && <p>{doctor.qualification}</p>}
              {doctor?.currentWorkingPlace && <p className="text-muted-foreground">{doctor.currentWorkingPlace}</p>}
              <p className="pt-2">
                Fee: <strong>৳{appointment.payment?.amount ?? doctor?.appointmentFee}</strong>
              </p>
            </CardContent>
          </Card>

          {appointment.prescription && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" aria-hidden /> Prescription
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="whitespace-pre-wrap">{appointment.prescription.instructions}</p>
                <Button variant="link" className="h-auto p-0" asChild>
                  <Link href="/dashboard/my-prescriptions">View all prescriptions</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {isActive && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Cancellation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  {isPaid
                    ? `Free cancellation with a full refund up to ${policy?.cancellationCutoffHours ?? 24} hours before the start time.`
                    : "Unpaid bookings can be cancelled at any time."}
                </p>
                <Button variant="destructive" className="w-full" disabled={pending || !!cancelBlocked} onClick={() => setConfirmCancel(true)}>
                  Cancel appointment
                </Button>
                {cancelBlocked && <p className="text-xs text-muted-foreground">The cancellation window has passed.</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={confirmCancel} onOpenChange={setConfirmCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              {isPaid ? "Your payment will be refunded in full. " : ""}The slot will be released for other patients.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <label htmlFor="cancel-reason" className="text-sm font-medium">
            Reason (optional)
          </label>
          <Textarea id="cancel-reason" value={reason} maxLength={500} onChange={(e) => setReason(e.target.value)} />
          <AlertDialogFooter>
            <AlertDialogCancel>Keep appointment</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={() => run(() => cancelAppointment(appointment.id, reason || undefined), "Appointment cancelled")}
            >
              Yes, cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {doctor && (
        <ReviewDialog isOpen={showReview} onClose={() => { setShowReview(false); router.refresh(); }} appointmentId={appointment.id} doctorName={doctor.name} />
      )}
    </div>
  );
};

export default AppointmentDetails;
