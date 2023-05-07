import type { Dayjs } from "dayjs";

export function formatDate(d: Dayjs): string {
  return d.format('YYYY-MM-DD')
}

export function formatPercent(double: number): string {
  return isNaN(double) ? "error" : Math.floor(double * 100) + '%'
}