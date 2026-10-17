import { Clock, Plus } from 'lucide-react'
import { NavLink } from 'react-router-dom'

type HeaderProps = {
  onAdd: () => void
}

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/activities', label: 'Activities', end: false },
]

function linkClassName({ isActive }: { isActive: boolean }) {
  return [
    'rounded-full px-3 py-1.5 text-sm transition-colors',
    isActive ? 'bg-accent font-semibold text-bg' : 'text-muted hover:text-ink',
  ].join(' ')
}

export function Header({ onAdd }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-4 sm:px-6">
        <NavLink to="/" className="mr-1 flex items-center gap-2 text-base font-semibold tracking-tight">
          <span className="grid size-8 place-items-center rounded-xl bg-accent text-bg">
            <Clock className="size-4" />
          </span>
          AfterHours
        </NavLink>
        <nav className="order-3 flex w-full gap-1 sm:order-none sm:w-auto" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClassName}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={onAdd}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-bg"
        >
          <Plus className="size-4" />
          Add activity
        </button>
      </div>
    </header>
  )
}
