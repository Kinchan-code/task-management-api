import { format, toZonedTime } from "date-fns-tz";

export const formatDateToPST = (date: string) => {
  const timeZone = "Asia/Manila";
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "MM/dd/yyyy HH:mm:ss", { timeZone });
};
