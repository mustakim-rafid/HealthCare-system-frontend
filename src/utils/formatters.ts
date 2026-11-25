import { format as tzFormat } from "@/utils/datetime";

export const getInitials = (name: string): string => {
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.toLocaleString("default", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatQueryParams = (params: {
  [key: string]: string | string[] | undefined;
}): string => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined)
    .flatMap(([key, value]) =>
      Array.isArray(value)
        ? value.map(
            (v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
          )
        : [`${encodeURIComponent(key)}=${encodeURIComponent(value!)}`]
    )
    .join("&");
};

// Always rendered in the app timezone (see utils/datetime.ts) so server and browser agree.
export const formatDateTime = (date: Date | string): string => tzFormat(date, "d MMMM, yyyy h:mm a");

export const formatDateOnly = (date: Date | string): string => tzFormat(date, "d MMMM, yyyy");

export const formatTimeRange = (start: Date | string, end: Date | string): string =>
  `${tzFormat(start, "h:mm a")} - ${tzFormat(end, "h:mm a")}`;
