import { addDays, startOfWeek, toISODate } from './dates'
import type { Activity, Category } from '../types'

type SeedDraft = {
  name: string
  category: Category
  week: 'current' | 'previous'
  dayIndex: number
  durationMinutes: number
  notes?: string
}

const drafts: SeedDraft[] = [
  { name: 'Product sync', category: 'Work', week: 'current', dayIndex: 0, durationMinutes: 150, notes: 'Sprint planning' },
  { name: 'Spanish', category: 'Learning', week: 'current', dayIndex: 0, durationMinutes: 45 },
  { name: 'Deep work', category: 'Work', week: 'current', dayIndex: 1, durationMinutes: 210, notes: 'Dashboard charts' },
  { name: 'Gym', category: 'Sport', week: 'current', dayIndex: 1, durationMinutes: 60 },
  { name: 'Client calls', category: 'Work', week: 'current', dayIndex: 2, durationMinutes: 180 },
  { name: 'Reading', category: 'Learning', week: 'current', dayIndex: 2, durationMinutes: 40, notes: 'Interface patterns' },
  { name: 'Feature build', category: 'Work', week: 'current', dayIndex: 3, durationMinutes: 240 },
  { name: 'Evening walk', category: 'Rest', week: 'current', dayIndex: 3, durationMinutes: 30 },
  { name: 'Code review', category: 'Work', week: 'current', dayIndex: 4, durationMinutes: 120 },
  { name: 'Climbing', category: 'Sport', week: 'current', dayIndex: 4, durationMinutes: 75 },
  { name: 'Side project', category: 'Learning', week: 'current', dayIndex: 5, durationMinutes: 90 },
  { name: 'Cooking', category: 'Rest', week: 'current', dayIndex: 5, durationMinutes: 50 },
  { name: 'Long run', category: 'Sport', week: 'current', dayIndex: 5, durationMinutes: 70 },
  { name: 'Nap', category: 'Rest', week: 'current', dayIndex: 5, durationMinutes: 40 },
  { name: 'Workshop', category: 'Work', week: 'previous', dayIndex: 0, durationMinutes: 240 },
  { name: 'Spec writing', category: 'Work', week: 'previous', dayIndex: 1, durationMinutes: 180 },
  { name: 'Swim', category: 'Sport', week: 'previous', dayIndex: 1, durationMinutes: 60 },
  { name: 'Course module', category: 'Learning', week: 'previous', dayIndex: 2, durationMinutes: 120 },
  { name: 'Bugfixing', category: 'Work', week: 'previous', dayIndex: 2, durationMinutes: 120 },
  { name: 'Planning', category: 'Work', week: 'previous', dayIndex: 3, durationMinutes: 200 },
  { name: 'Stretching', category: 'Rest', week: 'previous', dayIndex: 3, durationMinutes: 40 },
  { name: 'Release prep', category: 'Work', week: 'previous', dayIndex: 4, durationMinutes: 180 },
  { name: 'Football', category: 'Sport', week: 'previous', dayIndex: 4, durationMinutes: 50 },
  { name: 'Notes review', category: 'Learning', week: 'previous', dayIndex: 5, durationMinutes: 70 },
  { name: 'Quiet morning', category: 'Rest', week: 'previous', dayIndex: 6, durationMinutes: 36 },
]

export function createSeedActivities(today: Date): Activity[] {
  const currentStart = startOfWeek(today)
  const previousStart = addDays(currentStart, -7)

  return drafts.map((draft, index) => {
    const start = draft.week === 'current' ? currentStart : previousStart
    return {
      id: `seed-${index + 1}`,
      name: draft.name,
      category: draft.category,
      date: toISODate(addDays(start, draft.dayIndex)),
      durationMinutes: draft.durationMinutes,
      notes: draft.notes,
    }
  })
}
