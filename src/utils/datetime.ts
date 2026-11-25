import { format as dfFormat } from "date-fns";

/**
 * All dates come from the API in UTC. They are always displayed in ONE app timezone
 * (NEXT_PUBLIC_APP_TIMEZONE, default Asia/Dhaka) so server-rendered and browser-rendered
 * pages show the same time, and a slot the admin created for 3 PM shows as 3 PM everywhere.
 */
export const APP_TIMEZONE = process.env.NEXT_PUBLIC_APP_TIMEZONE || "Asia/Dhaka";

const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: APP_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/** Returns a Date whose *local* fields equal the wall-clock time in the app timezone (display only). */
export const toAppZone = (value: Date | string | number) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return date;
  const p = Object.fromEntries(partsFormatter.formatToParts(date).map((x) => [x.type, x.value]));
  return new Date(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
};

/** date-fns `format`, but in the app timezone. Drop-in replacement for display code. */
export const format = (value: Date | string | number, pattern: string) => dfFormat(toAppZone(value), pattern);

/** Calendar day key (yyyy-MM-dd) in the app timezone — use for grouping slots by day. */
export const dayKey = (value: Date | string | number) => format(value, "yyyy-MM-dd");

/** Safe Date for a yyyy-MM-dd key (noon UTC never crosses a day boundary when formatted). */
export const fromDayKey = (key: string) => new Date(`${key}T12:00:00Z`);

/** Short label such as "GMT+6", shown next to times. */
export const TZ_LABEL =
  new Intl.DateTimeFormat("en-US", { timeZone: APP_TIMEZONE, timeZoneName: "short" })
    .formatToParts(new Date())
    .find((p) => p.type === "timeZoneName")?.value ?? APP_TIMEZONE;
