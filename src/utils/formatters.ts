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

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);

  const day = d.getUTCDate();
  const month = d.toLocaleString("default", { month: "long", timeZone: "UTC" });
  const year = d.getUTCFullYear();

  const hours24 = d.getUTCHours();
  const minutes = d.getUTCMinutes();

  const ampm = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;

  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${day} ${month}, ${year} ${hours12}:${formattedMinutes} ${ampm}`;
};

export const formatDateOnly = (date: Date | string): string => {
  const d = new Date(date);
  const day = d.getUTCDate();
  const month = d.toLocaleString("default", { month: "long", timeZone: "UTC" });
  const year = d.getUTCFullYear();
  return `${day} ${month}, ${year}`;
};

export const formatTimeRange = (start: Date | string, end: Date | string): string => {
  const s = new Date(start);
  const e = new Date(end);

  const format = (d: Date) => {
    const hours24 = d.getUTCHours();
    const minutes = d.getUTCMinutes();
    const ampm = hours24 >= 12 ? "PM" : "AM";
    const hours12 = hours24 % 12 || 12;
    const mm = minutes.toString().padStart(2, "0");
    return `${hours12}:${mm} ${ampm}`;
  };

  return `${format(s)} - ${format(e)}`;
};

