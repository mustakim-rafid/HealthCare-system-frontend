import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { verifyPayment } from "@/services/patient/appointment.service";

export const metadata: Metadata = { title: "Payment" };

/**
 * Stripe redirects here after checkout. The session is verified on the server (never trusting the
 * redirect alone); the webhook does the same idempotently, so whichever arrives first confirms.
 */
export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; appointmentId?: string }>;
}) {
  const { session_id, appointmentId } = await searchParams;
  const result = session_id ? await verifyPayment(session_id) : { success: false, message: "Missing payment session" };
  const status: string | undefined = result.data?.status;
  const id = result.data?.appointmentId ?? appointmentId;

  const confirmed = result.success && (status === "confirmed" || status === "already_confirmed");
  const processing = result.success && status === "unpaid";

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <Card>
        <CardContent className="space-y-4 pt-8 text-center">
          {confirmed ? (
            <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" aria-hidden />
          ) : processing ? (
            <Clock className="mx-auto h-14 w-14 text-amber-500" aria-hidden />
          ) : (
            <AlertCircle className="mx-auto h-14 w-14 text-destructive" aria-hidden />
          )}
          <h1 className="text-2xl font-bold">
            {confirmed ? "Payment successful — booking confirmed" : processing ? "Payment is processing" : status === "refunded" ? "Slot no longer available" : "We could not confirm the payment"}
          </h1>
          <p className="text-muted-foreground">
            {confirmed
              ? "You will get a reminder 10 minutes before the consultation. Your doctor will share the Google Meet link on the booking page."
              : processing
                ? "Your bank is still processing the payment. We will notify you as soon as it is confirmed."
                : status === "refunded"
                  ? "The payment arrived after your hold expired and the slot was taken, so it was refunded in full."
                  : result.message || "If you were charged, your booking will be confirmed automatically shortly."}
          </p>
          <div className="flex flex-col justify-center gap-2 sm:flex-row">
            {id && (
              <Button asChild>
                <Link href={`/dashboard/my-appointments/${id}`}>View booking</Link>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/dashboard/my-appointments">All appointments</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
