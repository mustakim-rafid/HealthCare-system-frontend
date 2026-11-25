"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "@/utils/datetime";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAppointmentMessages, sendAppointmentMessage } from "@/services/patient/appointment.service";
import { IAppointmentMessage } from "@/types/appointments.interface";
import { cn } from "@/lib/utils";

/** Per-booking message history between doctor and patient (admin can read it too). */
export default function MessageThread({ appointmentId, viewerRole }: { appointmentId: string; viewerRole: "PATIENT" | "DOCTOR" | "ADMIN" }) {
  const [messages, setMessages] = useState<IAppointmentMessage[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [pending, startTransition] = useTransition();
  const endRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const res = await getAppointmentMessages(appointmentId);
    if (res.success) {
      setMessages(res.data);
      setError(null);
    } else setError(res.message || "Could not load messages");
  };

  useEffect(() => {
    void load();
    const t = setInterval(load, 30_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  useEffect(() => endRef.current?.scrollIntoView({ block: "nearest" }), [messages]);

  const submit = () => {
    const text = body.trim();
    if (!text) return;
    startTransition(async () => {
      const res = await sendAppointmentMessage(appointmentId, text);
      if (res.success) {
        setBody("");
        await load();
      } else toast.error(res.message || "Failed to send message");
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MessageSquare className="h-4 w-4" aria-hidden /> Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-72 space-y-2 overflow-y-auto pr-1" aria-live="polite">
          {messages === null && !error && (
            <div className="space-y-2">
              <div className="h-10 w-2/3 animate-pulse rounded-md bg-muted" />
              <div className="ml-auto h-10 w-1/2 animate-pulse rounded-md bg-muted" />
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          {messages?.length === 0 && <p className="text-sm text-muted-foreground">No messages yet.</p>}
          {messages?.map((m) => {
            const mine = m.senderRole === viewerRole;
            return (
              <div key={m.id} className={cn("max-w-[85%] rounded-lg px-3 py-2 text-sm", mine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted")}>
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
                <p className={cn("mt-1 text-[11px]", mine ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {m.senderRole.charAt(0) + m.senderRole.slice(1).toLowerCase()} · {format(new Date(m.createdAt), "MMM d, h:mm a")}
                </p>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <div className="flex gap-2">
          <label htmlFor={`msg-${appointmentId}`} className="sr-only">
            Write a message
          </label>
          <Textarea
            id={`msg-${appointmentId}`}
            value={body}
            maxLength={2000}
            onChange={(e) => setBody(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
            }}
            placeholder="Write a message… (Ctrl+Enter to send)"
            className="min-h-[44px]"
          />
          <Button onClick={submit} disabled={pending || !body.trim()} aria-label="Send message">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
