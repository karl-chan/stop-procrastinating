import type { Dayjs } from "dayjs";

export function formatDate(d: Dayjs): string {
  return d.format('YYYY-MM-DD')
}

export function formatPercent(double: number): string {
  return Math.floor(double * 100) + '%'
}