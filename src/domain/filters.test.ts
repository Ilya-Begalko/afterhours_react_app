import { describe, expect, it } from 'vitest'
import { filterActivities } from './filters'
import type { Activity } from '../types'

const activities: Activity[] = [
  { id: '1', name: 'Deep work', category: 'Work', date: '2026-10-17', durationMinutes: 90 },
  { id: '2', name: 'Evening run', category: 'Sport', date: '2026-10-16', durationMinutes: 40 },
  { id: '3', name: 'Morning run', category: 'Sport', date: '2026-10-15', durationMinutes: 30 },
]

describe('filterActivities', () => {
  it('filters by category, date, and name', () => {
    expect(
      filterActivities(activities, { search: 'run', category: 'Sport', date: '2026-10-16', sort: 'newest' }).map(
        (activity) => activity.name,
      ),
    ).toEqual(['Evening run'])
  })

  it('searches names without case sensitivity', () => {
    expect(
      filterActivities(activities, { search: 'DEEP', category: 'All', date: '', sort: 'newest' }).map(
        (activity) => activity.id,
      ),
    ).toEqual(['1'])
  })

  it('sorts by date', () => {
    const newest = filterActivities(activities, { search: '', category: 'All', date: '', sort: 'newest' })
    const oldest = filterActivities(activities, { search: '', category: 'All', date: '', sort: 'oldest' })

    expect(newest.map((activity) => activity.date)).toEqual(['2026-10-17', '2026-10-16', '2026-10-15'])
    expect(oldest.map((activity) => activity.date)).toEqual(['2026-10-15', '2026-10-16', '2026-10-17'])
  })
})
