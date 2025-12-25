"use client";

import { useState, useActionState, useEffect, useTransition } from "react";
import { format } from "date-fns";

import { createSchedule } from "@/services/admin/scheduleManagement";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { Field, FieldLabel } from "@/components/ui/field";
import InputFieldError from "@/components/shared/InputFieldError";
import { IErrorMessageState } from "@/utils/fieldErrorMessage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ScheduleForm() {
  const [state, formAction, pending] = useActionState(createSchedule, null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);

  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("00:00");

  const handleSuccess = () => {
    startTransition(() => {
      router.refresh()
    })
  }

  useEffect(() => {
    if (state) {
      if (!state.success && state.error) {
        toast.error(state.message);
      }
      if (state.success && state.data) {
        toast.success(state.message)
        handleSuccess()
      }
    }
  }, [state]);

  return (
    <form
      action={formAction}
      className="flex flex-col md:flex-row gap-3 items-end"
    >
      {/* START DATE */}
      <Field>
        <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
        <Popover open={openStart} onOpenChange={setOpenStart}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="justify-between w-full dark:hover:text-gray-300"
            >
              {startDate ? format(startDate, "PPP") : "Select start date"}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate || undefined}
              onSelect={(date) => {
                setStartDate(date as Date);
                setOpenStart(false);
              }}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          name="startDate"
          value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
        />
        <InputFieldError
          field="startDate"
          state={state as IErrorMessageState}
        />
      </Field>

      {/* END DATE */}
      <Field>
        <FieldLabel htmlFor="endDate">End Date</FieldLabel>
        <Popover open={openEnd} onOpenChange={setOpenEnd}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="justify-between w-full dark:hover:text-gray-300"
            >
              {endDate ? format(endDate, "PPP") : "Select end date"}
              <ChevronDownIcon className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate || undefined}
              onSelect={(date) => {
                setEndDate(date as Date);
                setOpenEnd(false);
              }}
              captionLayout="dropdown"
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          name="endDate"
          value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
        />
        <InputFieldError field="endDate" state={state as IErrorMessageState} />
      </Field>

      {/* START TIME */}
      <Field>
        <FieldLabel htmlFor="startTime">Start Time</FieldLabel>
        <Input
          type="time"
          step="60"
          id="startTime"
          name="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
        <InputFieldError
          field="startTime"
          state={state as IErrorMessageState}
        />
      </Field>

      {/* END TIME */}
      <Field>
        <FieldLabel htmlFor="endTime">End Time</FieldLabel>
        <Input
          type="time"
          id="endTime"
          name="endTime"
          step="60"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
        <InputFieldError field="endTime" state={state as IErrorMessageState} />
      </Field>

      <Button type="submit" disabled={pending || isPending}>
        {pending ? <Loader2 className="animate-spin w-4 h-4" /> : "Create"}
      </Button>
    </form>
  );
}
