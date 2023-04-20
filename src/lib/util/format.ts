import type { Dayjs } from "dayjs";

export function formatDate(d: Dayjs): string {
  return d.format('YYYY-MM-DD')
}