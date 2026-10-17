import { useEffect, useRef, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis } from 'recharts'
import { formatDuration } from '../domain/format'
import type { WeekBar } from '../domain/stats'

type WeeklyChartProps = {
  data: WeekBar[]
  selectedDate: string | null
  onSelectDate: (isoDate: string) => void
}

type TooltipPayload = {
  payload?: WeekBar
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: readonly TooltipPayload[] }) {
  const bar = payload?.[0]?.payload
  if (!active || !bar) return null

  return (
    <div className="rounded-xl border border-white/10 bg-bg px-3 py-2 text-sm shadow-lg">
      <p className="text-muted">{bar.label}</p>
      <p className="mt-0.5 font-medium text-accent">{formatDuration(bar.minutes)}</p>
    </div>
  )
}

function useChartSize() {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const update = () => {
      setSize({ width: element.clientWidth, height: element.clientHeight })
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, ...size }
}

export function WeeklyChart({ data, selectedDate, onSelectDate }: WeeklyChartProps) {
  const peak = Math.max(...data.map((item) => item.hours), 1)
  const { ref, width, height } = useChartSize()

  return (
    <div ref={ref} className="h-64 w-full min-w-0 sm:h-72">
      {width > 0 && height > 0 ? (
        <BarChart width={width} height={height} data={data} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="rgba(242,241,234,0.06)" />
          <XAxis dataKey="label" tick={{ fill: '#a7aea4', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            width={36}
            domain={[0, Math.ceil(peak)]}
            tickFormatter={(value: number) => `${value}h`}
            tick={{ fill: '#a7aea4', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: 'rgba(242,241,234,0.04)' }}
            content={(props) => (
              <ChartTooltip active={props.active} payload={props.payload as readonly TooltipPayload[] | undefined} />
            )}
          />
          <Bar
            dataKey="hours"
            radius={[8, 8, 0, 0]}
            maxBarSize={48}
            minPointSize={4}
            isAnimationActive={import.meta.env.MODE !== 'test'}
            onClick={(bar) => {
              const isoDate = typeof bar.payload?.iso === 'string' ? bar.payload.iso : ''
              if (isoDate) onSelectDate(isoDate)
            }}
          >
            {data.map((item) => (
              <Cell
                key={item.iso}
                cursor="pointer"
                fill={item.iso === selectedDate ? '#E8FFAD' : '#C6F36B'}
              />
            ))}
          </Bar>
        </BarChart>
      ) : null}
    </div>
  )
}
