import { useEffect, useMemo, useState } from 'react'
import { Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useStore } from '../../context/StoreContext'
import { cn, formatPrice } from '../../lib/format'

function PriceCell({ product }) {
  const { updateProduct } = useStore()
  const [draft, setDraft] = useState(String(product.price))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraft(String(product.price))
  }, [product.price])

  const commit = async () => {
    const value = Number(draft)
    if (!value || value === product.price) {
      setDraft(String(product.price))
      return
    }
    setSaving(true)
    try {
      await updateProduct({ ...product, price: value })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted">
        $
      </span>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value.replace(/[^\d]/g, ''))}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
        inputMode="numeric"
        aria-label={`Precio de ${product.name}`}
        className={cn(
          'w-24 rounded-full border border-line bg-white py-2 pl-6 pr-2 text-[13px] tabular-nums text-ink outline-none transition focus:border-ink',
          saving && 'opacity-50',
        )}
      />
    </div>
  )
}

export default function AdminProducts({ onEdit, onCreate }) {
  const { products, loading, updateProduct, deleteProduct } = useStore()
  const [search, setSearch] = useState('')
  const [busyId, setBusyId] = useState(null)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return products
    return products.filter((product) =>
      `${product.name} ${product.category} ${product.sizes?.join(' ')}`
        .toLowerCase()
        .includes(term),
    )
  }, [products, search])

  const toggleStock = async (product) => {
    setBusyId(product.id)
    try {
      await updateProduct({ ...product, inStock: !product.inStock })
    } finally {
      setBusyId(null)
    }
  }

  const remove = async (product) => {
    const confirmed = window.confirm(
      `¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`,
    )
    if (!confirmed) return
    setBusyId(product.id)
    try {
      await deleteProduct(product.id)
    } catch {
      // el error ya se muestra como toast
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar prenda…"
            className="field pl-9"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.16em] text-muted">
            {filtered.length} de {products.length}
          </span>
          <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink/85"
          >
            <Plus size={14} /> Nueva prenda
          </button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white">
        {loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex animate-pulse items-center gap-4">
                <div className="h-16 w-13 rounded-lg bg-mist" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-mist" />
                  <div className="h-3 w-1/4 rounded bg-mist" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-serif text-lg">
              {products.length ? 'Sin resultados' : 'Todavía no hay prendas'}
            </p>
            <p className="mx-auto mt-2 max-w-xs text-xs leading-relaxed text-muted">
              {products.length
                ? 'Probá con otro nombre o categoría.'
                : 'Publicá tu primera prenda para que aparezca en la tienda.'}
            </p>
            {!products.length && (
              <button
                type="button"
                onClick={onCreate}
                className="mt-5 rounded-full bg-ink px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink/85"
              >
                Agregar prenda
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {filtered.map((product) => (
              <li
                key={product.id}
                className={cn(
                  'flex flex-col gap-4 p-4 transition sm:flex-row sm:items-center',
                  busyId === product.id && 'opacity-50',
                )}
              >
                <div className="flex min-w-0 flex-1 items-center gap-3.5">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-mist">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-[8px] uppercase tracking-wider text-muted">
                        Sin foto
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-serif text-[15px] leading-snug">{product.name}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-[0.1em] text-muted">
                      <span>{product.category}</span>
                      <span className="size-0.5 rounded-full bg-muted/50" />
                      <span>{product.sizes.join(' · ')}</span>
                      {product.featured && (
                        <span className="rounded-full border border-line px-1.5 py-0.5 text-[8px] text-muted">
                          Destacado
                        </span>
                      )}
                      {product.isNew && (
                        <span className="rounded-full bg-brand/40 px-1.5 py-0.5 text-[8px] text-ink">
                          Nuevo
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-[11px] tabular-nums text-muted sm:hidden">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <div className="hidden sm:block">
                    <PriceCell product={product} />
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleStock(product)}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.12em] transition',
                      product.inStock
                        ? 'border-ink bg-brand/30 text-ink hover:bg-brand/50'
                        : 'border-line text-muted hover:border-ink/30 hover:text-ink',
                    )}
                    aria-pressed={product.inStock}
                    title="Activar / desactivar stock"
                  >
                    <span
                      className={cn(
                        'size-1.5 rounded-full',
                        product.inStock ? 'bg-ink' : 'bg-muted/40',
                      )}
                    />
                    {product.inStock ? 'Disponible' : 'Agotado'}
                  </button>

                  <div className="flex sm:hidden">
                    <PriceCell product={product} />
                  </div>

                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink"
                    aria-label={`Editar ${product.name}`}
                  >
                    <Pencil size={14} strokeWidth={1.7} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(product)}
                    className="grid size-9 place-items-center rounded-full border border-line text-muted transition hover:border-ink hover:bg-ink hover:text-white"
                    aria-label={`Eliminar ${product.name}`}
                  >
                    {busyId === product.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} strokeWidth={1.7} />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-3 text-[10px] leading-relaxed text-muted">
        Tip: tocá el precio y escribí el nuevo valor, se guarda solo al salir del campo. El estado
        de stock se cambia con un clic.
      </p>
    </div>
  )
}
