import { addDays, toISODate } from './dates'
import type { Activity, Category } from '../types'
import { CATEGORIES } from '../types'

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export type WeekBar = {
  iso: string
  label: (typeof WEEKDAY_LABELS)[number]
  minutes: number
  hours: number
}

export type CategoryShare = {
  category: Category
  minutes: number
  share: number
}

export function sumMinutes(activities: Activity[]): number {
  return activities.reduce((total, activity) => total + activity.durationMinutes, 0)
}

export function activitiesInRange(activities: Activity[], start: Date, endExclusive: Date): Activity[] {
  const from = toISODate(start)
  const to = toISODate(endExclusive)
  return activities.filter((activity) => activity.date >= from && activity.date < to)
}

export function percentChange(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null
  return Math.round(((current - previous) / previous) * 100)
}

export function weeklySeries(activities: Activity[], weekStart: Date): WeekBar[] {
  return WEEKDAY_LABELS.map((label, index) => {
    const iso = toISODate(addDays(weekStart, index))
    const minutes = sumMinutes(activities.filter((activity) => activity.date === iso))
    return {
      iso,
      label,
      minutes,
      hours: minutes / 60,
    }
  })
}

export function categoryBreakdown(activities: Activity[]): CategoryShare[] {
  const total = sumMinutes(activities)
  return CATEGORIES.map((category) => {
    const minutes = sumMinutes(activities.filter((activity) => activity.category === category))
    return {
      category,
      minutes,
      share: total === 0 ? 0 : minutes / total,
    }
  })
}
