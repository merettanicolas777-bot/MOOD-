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
    setNewOnly(false)
    navigate('/catalogo')
  }

  return (
    <section className="bg-white text-ink">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5 border-b border-ink/10 pb-7">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-ink/40">
                Recién llegado
              </p>
              <h2 className="mt-3 text-[clamp(2rem,5vw,3.4rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
                Nuevos ingresos
              </h2>
            </div>
            <button
              type="button"
              onClick={seeAll}
              className="group flex w-full items-center justify-between gap-3 border border-ink/15 px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-ink/70 transition hover:border-ink hover:text-ink sm:w-auto sm:border-0 sm:px-0 sm:py-0"
            >
              Ver catálogo completo
              <span className="grid size-9 place-items-center border border-ink/20 transition group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                <ArrowRight size={14} />
              </span>
            </button>
          </div>
        </Reveal>

        {loading ? (
          <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[3/4] w-full bg-mist" />
                <div className="mt-3 h-3 w-2/3 bg-mist" />
              </div>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </section>
  )
}
