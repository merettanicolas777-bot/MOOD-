import { useState } from 'react'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useStore } from '../../context/StoreContext'

export default function AdminCategories() {
  const { categories, products, createCategory, deleteCategory } = useStore()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [busy, setBusy] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await createCategory(name)
      setName('')
    } catch {
      // el error ya se muestra como toast
    } finally {
      setSaving(false)
    }
  }

  const remove = async (category) => {
    const used = products.filter((product) => product.category === category).length
    if (used > 0) {
      window.alert(
        `No podés eliminar "${category}" porque tiene ${used} ${
          used === 1 ? 'prenda asignada' : 'prendas asignadas'
        }. Cambiá esas prendas de categoría primero.`,
      )
      return
    }
    const confirmed = window.confirm(`¿Eliminar la categoría "${category}"?`)
    if (!confirmed) return

    setBusy(category)
    try {
      await deleteCategory(category)
    } catch {
      // el error ya se muestra como toast
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={submit} className="flex gap-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nueva categoría (ej: Camisas)"
          className="field"
          maxLength={40}
        />
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="inline-flex shrink-0 items-center gap-2 bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-white/90 disabled:opacity-40"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Agregar
        </button>
      </form>

      <div className="mt-6 overflow-hidden border border-white/10 bg-carbon">
        <ul className="divide-y divide-white/8">
          {categories.map((category) => {
            const used = products.filter((product) => product.category === category).length
            return (
              <li
                key={category}
                className="flex items-center justify-between gap-4 px-4 py-4"
              >
                <div>
                  <p className="text-sm font-semibold">{category}</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/30">
                    {used} {used === 1 ? 'prenda' : 'prendas'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(category)}
                  disabled={busy === category}
                  className="grid size-9 place-items-center border border-white/12 text-white/50 transition hover:border-white hover:bg-white hover:text-ink disabled:opacity-40"
                  aria-label={`Eliminar categoría ${category}`}
                >
                  {busy === category ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} strokeWidth={1.7} />
                  )}
                </button>
              </li>
            )
          })}
          {categories.length === 0 && (
            <li className="px-4 py-10 text-center text-xs text-white/40">
              No hay categorías todavía.
            </li>
          )}
        </ul>
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-white/25">
        Las categorías se usan en los filtros del catálogo. Para quitarlas, primero reasigná sus
        prendas.
      </p>
    </div>
  )
}
