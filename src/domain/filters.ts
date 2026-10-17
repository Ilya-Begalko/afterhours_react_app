import type { Activity, Category } from '../types'

export type CategoryFilter = Category | 'All'
export type DateSort = 'newest' | 'oldest'

export type ActivityFilters = {
  search: string
  category: CategoryFilter
  date: string
  sort: DateSort
}

export function filterActivities(activities: Activity[], filters: ActivityFilters): Activity[] {
  const search = filters.search.trim().toLowerCase()
  const matched = activities.filter((activity) => {
    const matchesCategory = filters.category === 'All' || activity.category === filters.category
    const matchesDate = filters.date === '' || activity.date === filters.date
    const matchesSearch = search === '' || activity.name.toLowerCase().includes(search)
    return matchesCategory && matchesDate && matchesSearch
  })

  return [...matched].sort((left, right) => {
    const order = left.date.localeCompare(right.date)
    return filters.sort === 'newest' ? -order : order
  })
}
