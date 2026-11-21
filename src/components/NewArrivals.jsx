import { useMemo } from 'react'
import { ArrowRight } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { navigate } from '../lib/router'
import ProductCard from './ProductCard'
import Reveal from './Reveal'

export default function NewArrivals() {
  const { products, loading, setNewOnly, setSearch } = useStore()

  const latest = useMemo(
    () =>
      [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
    [products],
  )

  const seeAll = () => {
    setSearch('')
    setNewOnly(true)
    navigate('/catalogo')
  }

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted">Recién llegado</p>
              <h2 className="mt-3 font-serif text-[clamp(2rem,5vw,3.4rem)] font-medium leading-[1.02] tracking-[-0.01em]">
                Nuevos ingresos
              </h2>
            </div>
            <button
              type="button"
              onClick={seeAll}
              className="group inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink"
            >
              Ver todo
              <span className="grid size-9 place-items-center rounded-full border border-ink/20 bg-brand/0 transition group-hover:border-brand group-hover:bg-brand">
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] w-full rounded-xl bg-mist" />
                <div className="mt-3 h-3 w-2/3 rounded bg-mist" />
              </div>
            ))}
          </div>
        ) : latest.length ? (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4">
            {latest.map((product, index) => (
              <Reveal
                key={product.id}
                delay={index * 60}
                className={index >= 2 ? 'hidden sm:block' : ''}
              >
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-xl border border-dashed border-line px-6 py-12 text-center text-sm text-muted">
            Estamos preparando los nuevos ingresos. Volvé pronto ✨
          </p>
        )}
      </div>
    </section>
  )
}
