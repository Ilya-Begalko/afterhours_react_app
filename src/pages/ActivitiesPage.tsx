import { useEffect, useMemo, useState } from 'react'
import { ActivityCard } from '../components/ActivityCard'
import { DateField } from '../components/DateField'
import { SelectField } from '../components/SelectField'
import { filterActivities, type CategoryFilter, type DateSort } from '../domain/filters'
import { fieldClassName } from '../styles'
import { useActivityStore } from '../store/useActivityStore'
import { CATEGORIES, CATEGORY_COLOR, type Activity } from '../types'

type ActivitiesPageProps = {
  onEdit: (activity: Activity) => void
}

export function ActivitiesPage({ onEdit }: ActivitiesPageProps) {
  const activities = useActivityStore((state) => state.activities)
  const deleteActivity = useActivityStore((state) => state.deleteActivity)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('All')
  const [date, setDate] = useState('')
  const [sort, setSort] = useState<DateSort>('newest')

  useEffect(() => {
    document.title = 'Activities · AfterHours'
  }, [])

  const visible = useMemo(
    () => filterActivities(activities, { search, category, date, sort }),
    [activities, search, category, date, sort],
  )
  const hasFilters = search.trim() !== '' || category !== 'All' || date !== ''

  const clearFilters = () => {
    setSearch('')
    setCategory('All')
    setDate('')
  }

  return (
    <div className="space-y-4">
      <header className="pb-2">
        <h1 className="text-2xl font-semibold tracking-tight">Activities</h1>
        <p className="mt-1 text-sm text-muted">The full journal of tracked time.</p>
      </header>

      <section className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-card p-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <label htmlFor="activity-search" className="block text-sm text-muted">
            Search
          </label>
          <input
            id="activity-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Activity name"
            className={fieldClassName}
          />
        </div>
        <div>
          <label htmlFor="activity-filter-category" className="block text-sm text-muted">
            Filter by category
          </label>
          <SelectField
            id="activity-filter-category"
            value={category}
            onChange={(next) => setCategory(next as CategoryFilter)}
            options={[
              { value: 'All', label: 'All' },
              ...CATEGORIES.map((item) => ({ value: item, label: item, color: CATEGORY_COLOR[item] })),
            ]}
          />
        </div>
        <div>
          <label htmlFor="activity-filter-date" className="block text-sm text-muted">
            Filter by date
          </label>
          <DateField id="activity-filter-date" value={date} onChange={setDate} />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {visible.length} {visible.length === 1 ? 'activity' : 'activities'}
        </p>
        <div className="flex items-center gap-3">
          {hasFilters ? (
            <button type="button" onClick={clearFilters} className="text-sm text-muted transition-colors hover:text-ink">
              Clear filters
            </button>
          ) : null}
          <div className="flex items-center gap-2">
            <label htmlFor="activity-sort" className="text-sm text-muted">
              Sort by date
            </label>
            <SelectField
              id="activity-sort"
              inline
              value={sort}
              onChange={(next) => setSort(next as DateSort)}
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
              ]}
            />
          </div>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-card px-4 py-10 text-center text-sm text-muted">
          {activities.length === 0
            ? 'No activities yet. Use Add activity to track the first block.'
            : 'No activities match these filters.'}
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-3">
          {visible.map((activity) => (
            <li key={activity.id}>
              <ActivityCard activity={activity} onEdit={onEdit} onDelete={deleteActivity} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
