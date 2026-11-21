import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Check,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from 'lucide-react'
import SiteLayout from '../components/SiteLayout'
import { useStore } from '../context/StoreContext'
import { cn, formatPrice } from '../lib/format'
import { navigate } from '../lib/router'
import { STORE_HOURS, whatsappLink } from '../lib/whatsapp'

function Breadcrumb({ name }) {
  return (
    <div className="flex items-center gap-2 overflow-hidden text-[9px] uppercase tracking-[0.18em] text-white/35 sm:text-[10px]">
      <button type="button" onClick={() => navigate('/')} className="shrink-0 transition hover:text-white">
        Inicio
      </button>
      <span className="text-white/20">/</span>
      <button
        type="button"
        onClick={() => navigate('/catalogo')}
        className="shrink-0 transition hover:text-white"
      >
        Catálogo
      </button>
      {name && (
        <>
          <span className="text-white/20">/</span>
          <span className="truncate text-white/55">{name}</span>
        </>
      )}
    </div>
  )
}

export default function ProductPage({ id }) {
  const { products, loading, addToCart, openCart, notify } = useStore()
  const product = products.find((item) => item.id === id)

  const [active, setActive] = useState(0)
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [error, setError] = useState(false)

  useEffect(() => {
    setActive(0)
    setSize('')
    setQty(1)
    setError(false)
  }, [id])

  useEffect(() => {
    if (!product) return undefined
    const previous = document.title
    document.title = `${product.name} — MOOD Indumentaria`
    window.scrollTo(0, 0)
    return () => {
      document.title = previous
    }
  }, [product])

  if (!product) {
    return (
      <SiteLayout>
        <div className="flex min-h-[75vh] flex-col items-center justify-center px-5 pb-16 pt-28 text-center">
          {loading ? (
            <>
              <div className="h-64 w-full max-w-sm animate-pulse bg-carbon" />
              <p className="mt-8 text-[10px] uppercase tracking-[0.24em] text-white/30">
                Cargando prenda…
              </p>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/35">Catálogo</p>
              <h1 className="mt-4 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
                No encontramos esta prenda
              </h1>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/45">
                Puede que ya no esté disponible o que el enlace sea incorrecto.
              </p>
              <button
                type="button"
                onClick={() => navigate('/catalogo')}
                className="mt-7 bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white/90"
              >
                Ver todo el catálogo
              </button>
            </>
          )}
        </div>
      </SiteLayout>
    )
  }

  const images = product.images || []
  const soldOut = !product.inStock
  const buyLink = whatsappLink(
    `Hola MOOD! Me interesa ${product.name} (${formatPrice(product.price)})${
      size ? ` — Talle ${size}` : ''
    }. ¿Me pasás más info?`,
  )

  const handleAdd = () => {
    if (!size) {
      setError(true)
      return
    }
    addToCart(product, size, qty)
    notify(`${product.name} · Talle ${size} agregado`)
    openCart()
  }

  return (
    <SiteLayout>
      <div className="border-b border-white/10 bg-ink pt-20 sm:pt-24">
        <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-10">
          <Breadcrumb name={product.name} />
        </div>
      </div>

      <section className="bg-white text-ink">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.08fr_1fr] lg:gap-16">
            <div>
              <div className="relative h-[58vh] w-full overflow-hidden bg-mist sm:aspect-[3/4] sm:h-auto">
                {images[active] ? (
                  <img
                    src={images[active]}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-[10px] uppercase tracking-[0.25em] text-ink/30">
                    Sin foto
                  </div>
                )}
                {soldOut && (
                  <span className="absolute left-4 top-4 bg-ink px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.25em] text-white">
                    Sin stock
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="mt-3 flex gap-2">
                  {images.map((image, index) => (
                    <button
                      key={image.slice(0, 40) + index}
                      type="button"
                      onClick={() => setActive(index)}
                      className={cn(
                        'relative aspect-[3/4] w-16 overflow-hidden border-2 transition sm:w-20',
                        active === index
                          ? 'border-ink'
                          : 'border-transparent opacity-60 hover:opacity-100',
                      )}
                      aria-label={`Ver foto ${index + 1}`}
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate('/catalogo')}
                className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/45 transition hover:text-ink"
              >
                <ArrowLeft size={14} /> Volver al catálogo
              </button>
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[10px] uppercase tracking-[0.28em] text-ink/40">
                  {product.category}
                </p>
                {product.isNew && (
                  <span className="bg-ink px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-white">
                    Nuevo
                  </span>
                )}
                {product.featured && (
                  <span className="border border-ink/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-ink/60">
                    Destacado
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold tabular-nums">
                {formatPrice(product.price)}
              </p>

              <p className="mt-5 max-w-lg text-sm leading-relaxed text-ink/60">
                {product.description}
              </p>

              <dl className="mt-6 space-y-2.5 border-y border-ink/10 py-5 text-xs">
                {product.fabric && (
                  <div className="flex justify-between gap-4">
                    <dt className="uppercase tracking-[0.16em] text-ink/40">Tela</dt>
                    <dd className="text-right font-medium text-ink/75">{product.fabric}</dd>
                  </div>
                )}
                {product.fit && (
                  <div className="flex justify-between gap-4">
                    <dt className="uppercase tracking-[0.16em] text-ink/40">Calce</dt>
                    <dd className="text-right font-medium text-ink/75">{product.fit}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink/50">
                    Elegí tu talle
                  </p>
                  {error && (
                    <p className="anim-shake text-[10px] font-semibold uppercase tracking-[0.1em] text-ink">
                      Seleccioná un talle
                    </p>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(product.sizes || []).map((item) => (
                    <button
                      key={item}
                      type="button"
                      disabled={soldOut}
                      onClick={() => {
                        setSize(item)
                        setError(false)
                      }}
                      className={cn(
                        'min-w-12 border px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wider transition',
                        size === item
                          ? 'border-ink bg-ink text-white'
                          : 'border-ink/15 text-ink/70 hover:border-ink/60',
                        error && !size && 'border-ink/40',
                        soldOut && 'cursor-not-allowed opacity-40',
                      )}
                      aria-pressed={size === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <div className="flex h-14 w-36 items-center justify-between border border-ink/15">
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    disabled={soldOut}
                    className="grid h-full w-10 place-items-center text-ink/60 transition hover:text-ink disabled:opacity-30"
                    aria-label="Restar una unidad"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-semibold tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((value) => Math.min(10, value + 1))}
                    disabled={soldOut}
                    className="grid h-full w-10 place-items-center text-ink/60 transition hover:text-ink disabled:opacity-30"
                    aria-label="Sumar una unidad"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={soldOut}
                  className="inline-flex h-16 w-full items-center justify-center gap-3 bg-ink px-6 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-carbon disabled:cursor-not-allowed disabled:bg-ink/25 sm:h-14 sm:flex-1 sm:text-[11px] sm:tracking-[0.2em]"
                >
                  <ShoppingBag size={18} strokeWidth={1.8} className="sm:hidden" />
                  <ShoppingBag size={16} strokeWidth={1.8} className="hidden sm:block" />
                  {soldOut ? 'Sin stock' : `Agregar — ${formatPrice(product.price * qty)}`}
                </button>
              </div>

              <a
                href={buyLink}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 flex h-12 items-center justify-center gap-2 border border-ink/15 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/70 transition hover:border-ink hover:text-ink"
              >
                <MessageCircle size={15} strokeWidth={1.8} />
                Consultar por WhatsApp
              </a>

              <ul className="mt-7 space-y-3 border-t border-ink/10 pt-6 text-[11px] text-ink/55">
                <li className="flex items-start gap-2.5">
                  <Truck size={15} strokeWidth={1.6} className="mt-0.5 shrink-0 text-ink/35" />
                  Envíos en Resistencia. El costo se coordina por WhatsApp según la zona.
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} strokeWidth={1.6} className="mt-0.5 shrink-0 text-ink/35" />
                  Retiro sin costo en Sta. Fe 1141 · {STORE_HOURS}
                </li>
                <li className="flex items-start gap-2.5">
                  <Check size={15} strokeWidth={1.6} className="mt-0.5 shrink-0 text-ink/35" />
                  Coordinás el pago por WhatsApp: efectivo, transferencia o tarjeta.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
