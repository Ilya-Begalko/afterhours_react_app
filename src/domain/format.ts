export function formatDuration(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes))
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) return `${rest}m`
  if (rest === 0) return `${hours}h`
  return `${hours}h ${rest}m`
}

export function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}.${month}.${year.slice(2)}`
}

export function formatShare(share: number): string {
  return `${Math.round(share * 100)}%`
}

export function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart)
  end.setDate(end.getDate() + 6)
  const endIso = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
  const startIso = `${weekStart.getFullYear()}-${String(weekStart.getMonth() + 1).padStart(2, '0')}-${String(weekStart.getDate()).padStart(2, '0')}`
  return `${formatShortDate(startIso)} – ${formatShortDate(endIso)}`
}

export function formatTrend(change: number | null): {
  text: string
  tone: 'muted' | 'positive' | 'negative'
} {
  if (change === null) return { text: 'No data last week', tone: 'muted' }
  if (change === 0) return { text: '0% vs last week', tone: 'muted' }
  const sign = change > 0 ? '+' : ''
  return {
    text: `${sign}${change}% vs last week`,
    tone: change > 0 ? 'positive' : 'negative',
  }
}
