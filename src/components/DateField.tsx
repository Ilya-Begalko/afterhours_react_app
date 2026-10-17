import { Calendar } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/style.css'
import { parseISODate, toISODate } from '../domain/dates'
import { formatShortDate } from '../domain/format'
import { fieldClassName } from '../styles'

type DateFieldProps = {
  id: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  invalid?: boolean
  describedBy?: string
}

type PopoverPosition = {
  top: number
  left: number
}

function popoverPosition(rect: DOMRect): PopoverPosition {
  const width = 312
  const height = 380
  const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)
  const below = rect.bottom + 8
  const top = below + height > window.innerHeight ? Math.max(8, rect.top - height - 8) : below
  return { top, left }
}

export function DateField({
  id,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  invalid = false,
  describedBy,
}: DateFieldProps) {
  const [open, setOpen] = useState(false)
  const [today] = useState(() => new Date())
  const [position, setPosition] = useState<PopoverPosition>({ top: 0, left: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const selected = value ? parseISODate(value) : undefined

  useEffect(() => {
    if (!open) return

    const place = () => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (rect) setPosition(popoverPosition(rect))
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (rootRef.current?.contains(target) || popoverRef.current?.contains(target)) return
      setOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setOpen(false)
    }

    place()
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown, true)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown, true)
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  const openCalendar = () => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (rect) setPosition(popoverPosition(rect))
    setOpen((current) => !current)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        onClick={openCalendar}
        className={`${fieldClassName} flex items-center justify-between gap-3 text-left ${invalid ? 'border-danger' : ''}`}
      >
        <span className={value ? 'text-ink' : 'text-muted/70'}>{value ? formatShortDate(value) : placeholder}</span>
        <Calendar className="size-4 shrink-0 text-muted" />
      </button>
      {open
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="Choose a date"
              className="afterhours-calendar fixed z-[60] w-[312px] rounded-2xl border border-white/10 bg-card p-3 shadow-2xl"
              style={{ top: position.top, left: position.left }}
            >
              <DayPicker
                mode="single"
                weekStartsOn={1}
                showOutsideDays
                selected={selected}
                defaultMonth={selected ?? today}
                onSelect={(day) => {
                  if (!day) return
                  onChange(toISODate(day))
                  setOpen(false)
                }}
              />
              {value ? (
                <button
                  type="button"
                  className="mt-1 w-full rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-white/5 hover:text-ink"
                  onClick={() => {
                    onChange('')
                    setOpen(false)
                  }}
                >
                  Clear date
                </button>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
