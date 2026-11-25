"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "@/utils/datetime";
import { toast } from "sonner";
import { CalendarClock, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getMyFreeSlots, postponeAppointment, setMeetLink } from "@/services/patient/appointment.service";
import { IAppointment } from "@/types/appointments.interface";
import MessageThread from "../../Booking/MessageThread";

const MEET_REGEX = /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}(\?[\w=&%.-]*)?$/;

/** Doctor-side booking tools: share the Meet link, postpone with a message + new slot, and messages. */
export default function DoctorBookingTools({ appointment }: { appointment: IAppointment }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [link, setLink] = useState(appointment.meetLink ?? "");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [showPostpone, setShowPostpone] = useState(false);
  const [slots, setSlots] = useState<{ scheduleId: string; schedule: { startDateTime: string; endDateTime: string } }[] | null>(null);
  const [slotId, setSlotId] = useState("");
  const [message, setMessage] = useState("");

  const isPaid = appointment.paymentStatus === "PAID";
  const canShareLink = isPaid && ["CONFIRMED", "INPROGRESS", "SCHEDULED"].includes(appointment.status);
  const canPostpone = isPaid && ["CONFIRMED", "SCHEDULED"].includes(appointment.status);

  useEffect(() => {
    if (!showPostpone || slots) return;
    getMyFreeSlots().then((res) => setSlots(res.success ? res.data : []));
  }, [showPostpone, slots]);

  const saveLink = () => {
    const value = link.trim();
    if (!MEET_REGEX.test(value)) {
      setLinkError("Enter a valid Google Meet link, e.g. https://meet.google.com/abc-defg-hij");
      return;
    }
    setLinkError(null);
    startTransition(async () => {
      const res = await setMeetLink(appointment.id, value);
      if (res.success) {
        toast.success("Meet link shared with the patient");
        router.refresh();
      } else toast.error(res.message || "Failed to save link");
    });
  };

  const postpone = () => {
    if (!slotId) return toast.error("Pick a new time slot");
    if (message.trim().length < 5) return toast.error("Write a short message to the patient");
    startTransition(async () => {
      const res = await postponeAppointment(appointment.id, slotId, message.trim());
      if (res.success) {
        toast.success("Appointment postponed — the patient has been notified");
        setShowPostpone(false);
        router.refresh();
      } else toast.error(res.message || "Failed to postpone");
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 rounded-lg border p-4">
        <Label htmlFor={`meet-${appointment.id}`} className="flex items-center gap-2">
          <Link2 className="h-4 w-4" aria-hidden /> Google Meet link
        </Label>
        {canShareLink ? (
          <>
            <div className="flex gap-2">
              <Input
                id={`meet-${appointment.id}`}
                value={link}
                placeholder="https://meet.google.com/abc-defg-hij"
                onChange={(e) => setLink(e.target.value)}
                aria-invalid={!!linkError}
                aria-describedby={linkError ? `meet-err-${appointment.id}` : undefined}
              />
              <Button onClick={saveLink} disabled={pending}>
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : appointment.meetLink ? "Update" : "Share"}
              </Button>
            </div>
            {linkError && (
              <p id={`meet-err-${appointment.id}`} className="text-sm text-destructive">
                {linkError}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Create a meeting at{" "}
              <a className="underline" href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer">
                meet.google.com/new
              </a>{" "}
              and paste the link. The patient sees it on their booking page.
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Available once the booking is paid and confirmed.</p>
        )}
      </div>

      {canPostpone && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-medium">
              <CalendarClock className="h-4 w-4" aria-hidden /> Emergency? Postpone this appointment
            </p>
            <Button variant="outline" size="sm" onClick={() => setShowPostpone((v) => !v)}>
              {showPostpone ? "Close" : "Postpone"}
            </Button>
          </div>
          {showPostpone && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor={`slot-${appointment.id}`}>New time</Label>
                {slots === null ? (
                  <div className="h-9 animate-pulse rounded-md bg-muted" />
                ) : slots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">You have no free future slots. Add slots in “My schedules” first.</p>
                ) : (
                  <select
                    id={`slot-${appointment.id}`}
                    className="h-9 w-full rounded-md border bg-background px-3 text-sm"
                    value={slotId}
                    onChange={(e) => setSlotId(e.target.value)}
                  >
                    <option value="">Select a slot…</option>
                    {slots.map((s) => (
                      <option key={s.scheduleId} value={s.scheduleId}>
                        {format(new Date(s.schedule.startDateTime), "EEE, MMM d · h:mm a")}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor={`pp-msg-${appointment.id}`}>Message to the patient</Label>
                <Textarea
                  id={`pp-msg-${appointment.id}`}
                  value={message}
                  maxLength={1000}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Sorry, I have an emergency. Could we move to this time instead?"
                />
              </div>
              <Button onClick={postpone} disabled={pending || !slotId} className="w-full">
                {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Postpone & notify patient
              </Button>
            </div>
          )}
        </div>
      )}

      {appointment.status === "POSTPONED" && (
        <p className="rounded-md bg-orange-500/10 p-3 text-sm">Waiting for the patient to accept the new time or cancel.</p>
      )}

      <MessageThread appointmentId={appointment.id} viewerRole="DOCTOR" />
    </div>
  );
}
