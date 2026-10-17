import { useEffect, useMemo, useState } from 'react'
import { ActivityCard } from '../components/ActivityCard'
import { CategoryBreakdown } from '../components/CategoryBreakdown'
import { StatCard } from '../components/StatCard'
import { WeeklyChart } from '../components/WeeklyChart'
import { addDays, startOfWeek } from '../domain/dates'
import { formatDuration, formatShortDate, formatTrend, formatWeekRange } from '../domain/format'
import { activitiesInRange, categoryBreakdown, percentChange, sumMinutes, weeklySeries } from '../domain/stats'
import { useActivityStore } from '../store/useActivityStore'
import type { Activity } from '../types'

type DashboardPageProps = {
  onEdit: (activity: Activity) => void
}

export function DashboardPage({ onEdit }: DashboardPageProps) {
  const activities = useActivityStore((state) => state.activities)
  const deleteActivity = useActivityStore((state) => state.deleteActivity)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [weekStart] = useState(() => startOfWeek(new Date()))

  useEffect(() => {
    document.title = 'Dashboard · AfterHours'
  }, [])
  const currentWeek = useMemo(
    () => activitiesInRange(activities, weekStart, addDays(weekStart, 7)),
    [activities, weekStart],
  )
  const previousWeek = useMemo(
    () => activitiesInRange(activities, addDays(weekStart, -7), weekStart),
    [activities, weekStart],
  )
  const currentMinutes = useMemo(() => sumMinutes(currentWeek), [currentWeek])
  const previousMinutes = useMemo(() => sumMinutes(previousWeek), [previousWeek])
  const series = useMemo(() => weeklySeries(activities, weekStart), [activities, weekStart])
  const categories = useMemo(() => categoryBreakdown(currentWeek), [currentWeek])
  const trend = formatTrend(percentChange(currentMinutes, previousMinutes))
  const selectedBar = series.find((bar) => bar.iso === selectedDate) ?? null

  const recent = useMemo(() => {
    const source = selectedDate ? activities.filter((activity) => activity.date === selectedDate) : activities
    const sorted = [...source].sort((left, right) => right.date.localeCompare(left.date))
    return selectedDate ? sorted : sorted.slice(0, 6)
  }, [activities, selectedDate])

  const selectDate = (isoDate: string) => {
    setSelectedDate((current) => (current === isoDate ? null : isoDate))
  }

  return (
    <div className="space-y-4">
      <header className="pb-2">
        <p className="text-sm text-muted">Week of {formatWeekRange(weekStart)}</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total this week" value={formatDuration(currentMinutes)} detail={trend.text} detailTone={trend.tone} />
        <StatCard label="Daily average" value={formatDuration(Math.round(currentMinutes / 7))} detail="Tracked time" />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <article className="min-w-0 rounded-2xl border border-white/10 bg-card p-5 lg:col-span-3">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Weekly activity</h2>
              <p className="mt-1 text-sm text-muted">Click a bar to filter the journal.</p>
            </div>
            {selectedBar ? (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-sm text-muted transition-colors hover:text-ink"
              >
                Show all
              </button>
            ) : null}
          </div>
          <WeeklyChart data={series} selectedDate={selectedDate} onSelectDate={selectDate} />
        </article>

        <article className="rounded-2xl border border-white/10 bg-card p-5 lg:col-span-2">
          <h2 className="text-lg font-semibold">Time by category</h2>
          <p className="mt-1 mb-5 text-sm text-muted">Share of this week</p>
          <CategoryBreakdown items={categories} />
        </article>
      </section>

      <section className="rounded-2xl border border-white/10 bg-bg">
        <div className="mb-3 flex items-end justify-between gap-3">
          <h2 className="text-lg font-semibold">Recent activities</h2>
          {selectedBar ? (
            <p className="text-sm text-muted">
              {selectedBar.label} · {formatShortDate(selectedBar.iso)}
            </p>
          ) : null}
        </div>
        {recent.length === 0 ? (
          <p className="rounded-2xl border border-white/10 bg-card px-4 py-8 text-center text-sm text-muted">
            {selectedDate ? 'No activities on this day.' : 'No activities yet. Use Add activity to start tracking.'}
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3">
            {recent.map((activity) => (
              <li key={activity.id}>
                <ActivityCard activity={activity} onEdit={onEdit} onDelete={deleteActivity} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
