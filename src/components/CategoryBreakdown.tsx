import { formatDuration, formatShare } from '../domain/format'
import type { CategoryShare } from '../domain/stats'
import { CATEGORY_COLOR } from '../types'
import { CategoryBadge } from './CategoryBadge'

type CategoryBreakdownProps = {
  items: CategoryShare[]
}

export function CategoryBreakdown({ items }: CategoryBreakdownProps) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.category}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <CategoryBadge category={item.category} />
            <p className="shrink-0 text-muted">
              <span className="font-medium text-ink">{formatDuration(item.minutes)}</span>
              <span> · {formatShare(item.share)}</span>
            </p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${Math.round(item.share * 100)}%`,
                backgroundColor: CATEGORY_COLOR[item.category],
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}
