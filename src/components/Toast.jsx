import { Check, TriangleAlert, X } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Toast() {
  const { toast } = useStore()
  if (!toast) return null

  const isError = toast.tone === 'error'

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[120] flex justify-center px-4">
      <div
        key={toast.id}
        className="anim-rise pointer-events-auto flex max-w-sm items-center gap-3 rounded-full border border-white/10 bg-ink/95 px-4 py-3 text-sm text-white shadow-2xl backdrop-blur"
        role="status"
      >
        <span
          className={`grid size-6 shrink-0 place-items-center rounded-full ${
            isError ? 'bg-white text-ink' : 'bg-brand text-ink'
          }`}
        >
          {isError ? <X size={14} /> : <Check size={14} />}
        </span>
        <p className="pr-1">{toast.message}</p>
      </div>
    </div>
  )
}
