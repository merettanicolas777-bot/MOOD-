import { Plus } from 'lucide-react'
import { cn, formatPrice } from '../lib/format'
import { navigate } from '../lib/router'

export default function ProductCard({ product }) {
  const [main, second] = product.images || []
  const soldOut = !product.inStock
  const open = () => navigate(`/producto/${encodeURIComponent(product.id)}`)

  return (
    <article className="group">
      <button
        type="button"
        onClick={open}
        className="block w-full text-left"
        aria-label={`Ver ${product.name}`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-mist">
          {main ? (
            <img
              src={main}
              alt={product.name}
              loading="lazy"
              className={cn(
                'absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out',
                second && 'group-hover:scale-[1.03] group-hover:opacity-0',
                !second && 'group-hover:scale-[1.04]',
                soldOut && 'opacity-80',
              )}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-[10px] uppercase tracking-[0.22em] text-muted/60">
              Sin foto
            </div>
          )}

          {second && (
            <img
              src={second}
              alt={`${product.name} — segunda vista`}
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.isNew && !soldOut && (
              <span className="rounded-full bg-brand px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-ink">
                Nuevo
              </span>
            )}
            {product.featured && !soldOut && (
              <span className="rounded-full bg-ink/85 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
                Destacado
              </span>
            )}
          </div>

          {soldOut && (
            <div className="absolute inset-0 grid place-items-center bg-cream/45 backdrop-blur-[1px]">
              <span className="rounded-full bg-ink px-4 py-2 text-[9px] font-bold uppercase tracking-[0.24em] text-white">
                Sin stock
              </span>
            </div>
          )}
        </div>
      </button>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.18em] text-muted">{product.category}</p>
          <h3 className="mt-1.5 line-clamp-2 font-serif text-[15px] leading-snug text-ink sm:text-base">
            {product.name}
          </h3>
          <p className="mt-1 text-[13px] font-semibold tabular-nums text-ink sm:text-sm">
            {formatPrice(product.price)}
          </p>
          <p className="mt-1.5 truncate text-[10px] uppercase tracking-[0.1em] text-muted/80">
            Talles {product.sizes.join(' · ')}
          </p>
        </div>

        <button
          type="button"
          onClick={open}
          disabled={soldOut}
          className="mt-4 grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 text-ink transition hover:border-ink hover:bg-brand disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent"
          aria-label={`Ver ${product.name} y elegir talle`}
        >
          <Plus size={15} strokeWidth={1.9} />
        </button>
      </div>
    </article>
  )
}
