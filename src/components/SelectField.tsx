import { Check, ChevronDown } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { fieldClassName } from '../styles'

type SelectOption = {
  value: string
  label: string
  color?: string
}

type SelectFieldProps = {
  id: string
  value: string
  options: readonly SelectOption[]
  onChange: (value: string) => void
  inline?: boolean
  invalid?: boolean
}

type MenuPosition = {
  top: number
  left: number
  width: number
}

function menuPosition(rect: DOMRect, optionCount: number): MenuPosition {
  const height = Math.min(optionCount * 40 + 16, 280)
  const width = Math.max(rect.width, 180)
  const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)
  const below = rect.bottom + 8
  const top = below + height > window.innerHeight ? Math.max(8, rect.top - height - 8) : below
  return { top, left, width }
}

export function SelectField({ id, value, options, onChange, inline = false, invalid = false }: SelectFieldProps) {
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(0)
  const [position, setPosition] = useState<MenuPosition>({ top: 0, left: 0, width: 180 })
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listId = useId()
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))
  const selected = options[selectedIndex]

  useEffect(() => {
    if (!open) return

    const place = () => {
      const rect = rootRef.current?.getBoundingClientRect()
      if (rect) setPosition(menuPosition(rect, options.length))
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        setOpen(false)
        buttonRef.current?.focus()
        return
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
        event.preventDefault()
        setHighlight((current) => {
          if (event.key === 'Home') return 0
          if (event.key === 'End') return options.length - 1
          const next = event.key === 'ArrowDown' ? current + 1 : current - 1
          return (next + options.length) % options.length
        })
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        const option = options[highlight]
        if (!option) return
        onChange(option.value)
        setOpen(false)
        buttonRef.current?.focus()
      }
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
  }, [highlight, onChange, open, options])

  const openMenu = () => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (rect) setPosition(menuPosition(rect, options.length))
    setHighlight(selectedIndex)
    setOpen((current) => !current)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-invalid={invalid || undefined}
        onClick={openMenu}
        onKeyDown={(event) => {
          if (open) return
          if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          openMenu()
        }}
        style={inline ? { marginTop: 0, width: 'auto', minWidth: '9rem' } : undefined}
        className={`${fieldClassName} flex items-center justify-between gap-3 text-left ${invalid ? 'border-danger' : ''}`}
      >
        <span className="inline-flex min-w-0 items-center gap-2">
          {selected?.color ? (
            <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: selected.color }} />
          ) : null}
          <span className="truncate">{selected?.label ?? value}</span>
        </span>
        <ChevronDown className={`size-4 shrink-0 text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open
        ? createPortal(
            <div
              ref={menuRef}
              id={listId}
              role="listbox"
              aria-labelledby={id}
              className="fixed z-[60] rounded-2xl border border-white/10 bg-card p-1.5 shadow-2xl"
              style={{ top: position.top, left: position.left, width: position.width }}
            >
              {options.map((option, index) => {
                const isSelected = option.value === value
                const isHighlighted = index === highlight
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlight(index)}
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                      buttonRef.current?.focus()
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${
                      isSelected ? 'text-accent' : 'text-ink'
                    } ${isHighlighted ? 'bg-white/5' : ''}`}
                  >
                    {option.color ? (
                      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: option.color }} />
                    ) : (
                      <span className="size-1.5 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1 truncate">{option.label}</span>
                    {isSelected ? <Check className="size-4 shrink-0" /> : null}
                  </button>
                )
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
