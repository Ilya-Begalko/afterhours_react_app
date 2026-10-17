import { Pencil, Trash2 } from 'lucide-react'
import { formatDuration, formatShortDate } from '../domain/format'
import type { Activity } from '../types'
import { CategoryBadge } from './CategoryBadge'

type ActivityCardProps = {
  activity: Activity
  onEdit: (activity: Activity) => void
  onDelete: (id: string) => void
}

export function ActivityCard({ activity, onEdit, onDelete }: ActivityCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">{activity.name}</h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <CategoryBadge category={activity.category} />
            <time dateTime={activity.date}>{formatShortDate(activity.date)}</time>
            <span className="font-medium text-ink">{formatDuration(activity.durationMinutes)}</span>
          </div>
          {activity.notes ? <p className="mt-2 text-sm text-muted">{activity.notes}</p> : null}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            aria-label={`Edit ${activity.name}`}
            onClick={() => onEdit(activity)}
            className="grid size-9 place-items-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-ink"
          >
            <Pencil className="size-4" />
          </button>
          <button
            type="button"
            aria-label={`Delete ${activity.name}`}
            onClick={() => onDelete(activity.id)}
            className="grid size-9 place-items-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-danger"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      </div>
    </article>
  )
}
