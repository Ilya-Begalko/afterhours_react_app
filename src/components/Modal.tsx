import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

type ModalProps = {
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, onClose, children }: ModalProps) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-dialog-title"
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-card p-5 sm:m-4 sm:rounded-2xl"
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 id="activity-dialog-title" className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl text-muted transition-colors hover:bg-white/5 hover:text-ink"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
