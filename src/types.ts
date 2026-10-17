export const CATEGORIES = ['Work', 'Sport', 'Learning', 'Rest', 'Other'] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_COLOR: Record<Category, string> = {
  Work: '#C6F36B',
  Sport: '#7EE0C6',
  Learning: '#F2D27A',
  Rest: '#9BB0FF',
  Other: '#E7A0C4',
}

export type Activity = {
  id: string
  name: string
  category: Category
  date: string
  durationMinutes: number
  notes?: string
}

export type ActivityInput = Omit<Activity, 'id'>
