export const CATEGORIES = ['Work', 'Sport', 'Learning', 'Rest', 'Other'] as const

export type Category = (typeof CATEGORIES)[number]

export const CATEGORY_COLOR: Record<Category, string> = {
  Work: '#C6F36B',
  Sport: '#8ED9C4',
  Learning: '#F0D48A',
  Rest: '#A9B7E8',
  Other: '#E2B1C8',
}
