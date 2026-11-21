import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, X } from 'lucide-react'
import { cn } from '../lib/format'
import { ALL_SIZES } from '../data/seed'
import { useStore } from '../context/StoreContext'
import ProductCard from './ProductCard'
import Reveal from './Reveal'

const SORTS = [
  { value: 'nuevos', label: 'Más nuevos' },
  { value: 'precio-asc', label: 'Menor precio' },
  { value: 'precio-desc', label: 'Mayor precio' },
  { value: 'nombre', label: 'A–Z' },
]

export default function Catalog() {
  const {
    products,
    categories,
    loading,
    search,
    setSearch,
    newOnly,
    setNewOnly,
  } = useStore()
  const [category, setCategory] = useState('Todos')
  const [size, setSize] = useState('')
  const [sort, setSort] = useState('nuevos')

  const availableSizes = useMemo(() => {
    const used = new Set(products.flatMap((product) => product.sizes || []))
    const ordered = ALL_SIZES.filter((item) => used.has(item))
    const extra = [...used].filter((item) => !ALL_SIZES.includes(item))
    return [...ordered, ...extra]
  }, [products])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()

    const result = products.filter((product) => {
      if (category !== 'Todos' && product.category !== category) return false
      if (size && !(product.sizes || []).includes(size)) return false
      if (newOnly && !product.isNew) return false
      if (term) {
        const haystack =
          `${product.name} ${product.category} ${product.description} ${product.sizes?.join(' ')}`.toLowerCase()
        if (!haystack.includes(term)) return false
      }
      return true
    })

    return result.sort((a, b) => {
      if (sort === 'precio-asc') return a.price - b.price
      if (sort === 'precio-desc') return b.price - a.price
      if (sort === 'nombre') return a.name.localeCompare(b.name, 'es')
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [products, category, size, newOnly, search, sort])

  const filtersActive =
    category !== 'Todos' || Boolean(size) || newOnly || Boolean(search.trim())

  const resetFilters = () => {
    setCategory('Todos')
    setSize('')
    setSort('nuevos')
    setNewOnly(false)
    setSearch('')
  }

  // Al entrar desde "Nuevos ingresos" el filtro viene activo desde el navbar.
  useEffect(() => {
    if (newOnly) setSort('nuevos')
  }, [newOnly])

  return (
    <section id="catalogo" className="bg-white text-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:px-0">
              {['Todos', ...categories].map((item) => {
                const active = category === item
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setCategory(item)}
                    className={cn(
                      'shrink-0 border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition',
                      active
                        ? 'border-ink bg-ink text-white'
                        : 'border-ink/15 text-ink/60 hover:border-ink/50 hover:text-ink',
                    )}
                    aria-pressed={active}
                  >
                    {item}
                  </button>
                )
              })}
            </div>

            <div className="flex shrink-0 items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-ink/40">
              <span>
                {filtered.length} {filtered.length === 1 ? 'prenda' : 'prendas'}
              </span>
              {filtersActive && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 border-b border-ink/30 pb-0.5 text-ink transition hover:border-ink"
                >
                  <X size={11} /> Limpiar filtros
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-1 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ink/35">
                <SlidersHorizontal size={12} /> Talle
              </span>
              <button
                type="button"
                onClick={() => setSize('')}
                className={cn(
                  'min-w-9 border px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition',
                  !size ? 'border-ink bg-ink text-white' : 'border-ink/15 text-ink/50 hover:border-ink/40',
                )}
              >
                Todos
              </button>
              {availableSizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSize(size === item ? '' : item)}
                  className={cn(
                    'min-w-9 border px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition',
                    size === item
                      ? 'border-ink bg-ink text-white'
                      : 'border-ink/15 text-ink/50 hover:border-ink/40',
                  )}
                  aria-pressed={size === item}
                >
                  {item}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setNewOnly(!newOnly)}
                className={cn(
                  'ml-1 border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] transition',
                  newOnly
                    ? 'border-ink bg-ink text-white'
                    : 'border-ink/15 text-ink/50 hover:border-ink/40',
                )}
                aria-pressed={newOnly}
              >
                Nuevos
              </button>
            </div>

            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-[10px] uppercase tracking-[0.18em] text-ink/35">
                Orden
              </label>
              <div className="relative">
                <select
                  id="sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="appearance-none border border-ink/15 bg-transparent py-2 pl-3 pr-8 text-[11px] font-medium uppercase tracking-[0.12em] text-ink outline-none transition focus:border-ink"
                >
                  {SORTS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[8px] text-ink/50">
                  ▼
                </span>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] w-full bg-mist" />
                <div className="mt-3 h-3 w-2/3 bg-mist" />
                <div className="mt-2 h-3 w-1/3 bg-mist" />
              </div>
            ))}
          </div>
        ) : filtered.length ? (
          <div className="mt-9 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product, index) => (
              <Reveal key={product.id} delay={Math.min(index * 45, 270)}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center border border-dashed border-ink/15 px-6 py-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Sin resultados</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink/50">
              No encontramos prendas con esos filtros. Probá con otro talle o categoría.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 bg-ink px-6 py-3 text-[10px] font-bold uppercase tracking-[0.22em] text-white transition hover:bg-carbon"
            >
              Ver todo el catálogo
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
