type StatCardProps = {
  label: string
  value: string
  detail: string
  detailTone?: 'muted' | 'positive' | 'negative'
}

const toneClassName = {
  muted: 'text-muted',
  positive: 'text-accent',
  negative: 'text-danger',
}

export function StatCard({ label, value, detail, detailTone = 'muted' }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-card px-5 py-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
      <p className={`mt-2 text-sm ${toneClassName[detailTone]}`}>{detail}</p>
    </article>
  )
}
