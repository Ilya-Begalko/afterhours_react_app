import type { Category } from './categories.ts'

export type Activity = {
  id: string
  name: string
  category: Category
  date: string
  durationMinutes: number
  notes?: string
}

export type ActivityInput = Omit<Activity, 'id'>
