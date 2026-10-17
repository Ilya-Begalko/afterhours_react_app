import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSeedActivities } from '../domain/seed'
import type { Activity, ActivityInput } from '../types'

type ActivityState = {
  activities: Activity[]
  addActivity: (input: ActivityInput) => void
  updateActivity: (id: string, input: ActivityInput) => void
  deleteActivity: (id: string) => void
}

function normalize(input: ActivityInput): ActivityInput {
  const notes = input.notes?.trim()
  return {
    name: input.name.trim(),
    category: input.category,
    date: input.date,
    durationMinutes: input.durationMinutes,
    notes: notes ? notes : undefined,
  }
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: createSeedActivities(new Date()),
      addActivity: (input) =>
        set((state) => ({
          activities: [{ id: crypto.randomUUID(), ...normalize(input) }, ...state.activities],
        })),
      updateActivity: (id, input) =>
        set((state) => ({
          activities: state.activities.map((activity) =>
            activity.id === id ? { ...activity, ...normalize(input) } : activity,
          ),
        })),
      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((activity) => activity.id !== id),
        })),
    }),
    {
      name: 'afterhours-activities',
      skipHydration: import.meta.env.MODE === 'test',
      partialize: (state) => ({ activities: state.activities }),
    },
  ),
)
