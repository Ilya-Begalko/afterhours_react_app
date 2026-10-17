export function startOfDay(date: Date): Date {
  const copy = new Date(date)
  copy.setHours(0, 0, 0, 0)
  return copy
}

export function addDays(date: Date, amount: number): Date {
  const copy = new Date(date)
  copy.setDate(copy.getDate() + amount)
  return copy
}

/** Monday is the first day of the week. */
export function startOfWeek(date: Date): Date {
  const start = startOfDay(date)
  const weekday = start.getDay()
  const daysFromMonday = weekday === 0 ? 6 : weekday - 1
  start.setDate(start.getDate() - daysFromMonday)
  return start
}

export function parseISODate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function toISODate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
