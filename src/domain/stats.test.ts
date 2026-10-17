import { describe, expect, it } from 'vitest'
import { addDays, startOfWeek, toISODate } from './dates'
import { formatDuration } from './format'
import { createSeedActivities } from './seed'
import { activitiesInRange, categoryBreakdown, percentChange, sumMinutes, weeklySeries } from './stats'

describe('weekly statistics', () => {
  const today = new Date(2026, 9, 17)
  const activities = createSeedActivities(today)
  const weekStart = startOfWeek(today)

  it('starts the week on Monday', () => {
    expect(toISODate(startOfWeek(new Date(2026, 9, 17)))).toBe('2026-10-12')
    expect(toISODate(startOfWeek(new Date(2026, 9, 18)))).toBe('2026-10-12')
    expect(toISODate(startOfWeek(new Date(2026, 9, 12)))).toBe('2026-10-12')
  })

  it('calculates this week, last week, and the daily average from saved activities', () => {
    const current = sumMinutes(activitiesInRange(activities, weekStart, addDays(weekStart, 7)))
    const previous = sumMinutes(activitiesInRange(activities, addDays(weekStart, -7), weekStart))

    expect(current).toBe(1400)
    expect(previous).toBe(1296)
    expect(percentChange(current, previous)).toBe(8)
    expect(formatDuration(current)).toBe('23h 20m')
    expect(formatDuration(Math.round(current / 7))).toBe('3h 20m')
  })

  it('splits the week into Monday–Sunday bars', () => {
    const series = weeklySeries(activities, weekStart)
    expect(series.map((bar) => bar.minutes)).toEqual([195, 270, 220, 270, 195, 250, 0])
    expect(series.reduce((total, bar) => total + bar.minutes, 0)).toBe(1400)
  })

  it('calculates each category share of the week', () => {
    const current = activitiesInRange(activities, weekStart, addDays(weekStart, 7))
    const shares = categoryBreakdown(current)
    const work = shares.find((item) => item.category === 'Work')

    expect(work?.minutes).toBe(900)
    expect(work?.share).toBeCloseTo(900 / 1400)
    expect(shares.find((item) => item.category === 'Other')?.minutes).toBe(0)
  })

  it('formats durations', () => {
    expect(formatDuration(0)).toBe('0m')
    expect(formatDuration(40)).toBe('40m')
    expect(formatDuration(60)).toBe('1h')
    expect(formatDuration(100)).toBe('1h 40m')
  })

  it('returns null when last week has no tracked time', () => {
    expect(percentChange(80, 0)).toBeNull()
    expect(percentChange(0, 0)).toBe(0)
  })
})
