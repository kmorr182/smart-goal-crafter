/** Formats a `YYYY-MM-DD` value as e.g. "Mar 1, 2027". Returns null for an empty value. */
export function formatDate(value: string): string | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Days between today and a `YYYY-MM-DD` value, or null for an empty value. */
export function daysFromToday(value: string): number | null {
  if (!value) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(`${value}T00:00:00`)
  return Math.round((date.getTime() - today.getTime()) / 86_400_000)
}

/** Today's date as a `YYYY-MM-DD` string, for a date input's `min`. */
export function todayIso(): string {
  return new Date().toISOString().slice(0, 10)
}
