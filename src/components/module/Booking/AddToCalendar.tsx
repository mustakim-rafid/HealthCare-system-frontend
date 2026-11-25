"use client";

import { CalendarPlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const toUtcStamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const escapeIcs = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

interface Props {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  location?: string | null;
}

/** "Add to calendar": Google Calendar link + downloadable .ics (times are UTC, calendars localise them). */
export default function AddToCalendar({ id, title, description, start, end, location }: Props) {
  const google = new URL("https://calendar.google.com/calendar/render");
  google.searchParams.set("action", "TEMPLATE");
  google.searchParams.set("text", title);
  google.searchParams.set("dates", `${toUtcStamp(start)}/${toUtcStamp(end)}`);
  google.searchParams.set("details", description);
  if (location) google.searchParams.set("location", location);

  const downloadIcs = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Health Care//Appointments//EN",
      "BEGIN:VEVENT",
      `UID:${id}@healthcare`,
      `DTSTAMP:${toUtcStamp(new Date())}`,
      `DTSTART:${toUtcStamp(start)}`,
      `DTEND:${toUtcStamp(end)}`,
      `SUMMARY:${escapeIcs(title)}`,
      `DESCRIPTION:${escapeIcs(description)}`,
      location ? `LOCATION:${escapeIcs(location)}` : "",
      "BEGIN:VALARM",
      "TRIGGER:-PT10M",
      "ACTION:DISPLAY",
      "DESCRIPTION:Consultation starts in 10 minutes",
      "END:VALARM",
      "END:VEVENT",
      "END:VCALENDAR",
    ]
      .filter(Boolean)
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `appointment-${id.slice(0, 8)}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" asChild>
        <a href={google.toString()} target="_blank" rel="noopener noreferrer">
          <CalendarPlus className="mr-2 h-4 w-4" aria-hidden /> Google Calendar
        </a>
      </Button>
      <Button variant="outline" size="sm" onClick={downloadIcs}>
        <Download className="mr-2 h-4 w-4" aria-hidden /> Download .ics
      </Button>
    </div>
  );
}
