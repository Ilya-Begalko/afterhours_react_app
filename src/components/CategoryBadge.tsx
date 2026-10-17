import { CATEGORY_COLOR, type Category } from '../types'

type CategoryBadgeProps = {
  category: Category
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-ink">
      <span className="size-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLOR[category] }} />
      {category}
    </span>
  )
}
