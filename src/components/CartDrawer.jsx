import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Check,
  Minus,
  MessageCircle,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  Truck,
  X,
} from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { cn, formatPrice } from '../lib/format'
import { buildOrderMessage, whatsappLink } from '../lib/whatsapp'

const DELIVERIES = [
  { id: 'retiro', label: 'Retiro en el local', hint: 'Sta. Fe 1141', icon: Store },
  { id: 'envio', label: 'Envío a domicilio', hint: 'Resistencia', icon: Truck },
]

const PAYMENTS = ['Efectivo', 'Transferencia', 'Tarjeta']

export default function CartDrawer({ onClose }) {
  const { cart, cartCount, cartTotal, setQty, removeFromCart, clearCart } = useStore()
  const [name, setName] = useState('')
  const [delivery, setDelivery] = useState('retiro')
  const [payment, setPayment] = useState('Efectivo')
  const [address, setAddress] = useState('')
  const [error, setError] = useState('')
  const [sentLink, setSentLink] = useState('')

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const handleConfirm = () => {
    if (!cart.length) return
    if (!name.trim()) {
      setError('Ingresá tu nombre para continuar')
      return
    }

    const message = buildOrderMessage({
      items: cart,
      total: cartTotal,
      name: name.trim(),
      delivery,
      payment,
      address: address.trim(),
    })

    const link = whatsappLink(message)
    window.open(link, '_blank', 'noopener,noreferrer')
    setSentLink(link)
    clearCart()
  }

  return (
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={onClose}
        className="anim-fade absolute inset-0 cursor-default bg-black/70 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="anim-slide absolute right-0 top-0 flex h-full w-full flex-col border-l border-white/10 bg-ink sm:max-w-[440px]"
      >
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={17} strokeWidth={1.7} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.24em]">Tu pedido</h2>
            {cartCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-bold leading-5 text-ink">
                {cartCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center border border-white/15 text-white/70 transition hover:border-white/40 hover:text-white"
            aria-label="Cerrar"
          >
            <X size={17} />
          </button>
        </header>

        {sentLink ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full border border-white/20">
              <Check size={24} strokeWidth={1.5} />
            </span>
            <h3 className="mt-6 text-xl font-bold uppercase tracking-tight">Pedido listo</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Abrimos WhatsApp con el detalle completo. Confirmá el mensaje y coordinamos el pago
              y la entrega.
            </p>
            <a
              href={sentLink}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 bg-white px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white/90"
            >
              <MessageCircle size={16} /> Abrir WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-white/50 transition hover:text-white"
            >
              Seguir comprando <ArrowRight size={13} />
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full border border-white/15 text-white/50">
              <ShoppingBag size={22} strokeWidth={1.5} />
            </span>
            <h3 className="mt-6 text-lg font-semibold uppercase tracking-wide">
              Tu carrito está vacío
            </h3>
            <p className="mt-2 text-sm text-white/45">
              Sumá prendas desde el catálogo para armar tu pedido.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex items-center gap-2 bg-white px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-ink transition hover:bg-white/90"
            >
              Ver catálogo <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.key} className="flex gap-3.5 border-b border-white/8 pb-4">
                    <div className="h-24 w-19 shrink-0 overflow-hidden bg-carbon">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold leading-snug">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.16em] text-white/40">
                            Talle {item.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          className="shrink-0 p-1 text-white/35 transition hover:text-white"
                          aria-label={`Quitar ${item.name}`}
                        >
                          <Trash2 size={14} strokeWidth={1.6} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                        <div className="flex items-center border border-white/15">
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            className="grid size-7 place-items-center text-white/60 transition hover:bg-white hover:text-ink"
                            aria-label="Restar una unidad"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs tabular-nums">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            className="grid size-7 place-items-center text-white/60 transition hover:bg-white hover:text-ink"
                            aria-label="Sumar una unidad"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-semibold tabular-nums">
                          {formatPrice(item.price * item.qty)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-7 space-y-6">
                <div>
                  <label
                    htmlFor="customer-name"
                    className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45"
                  >
                    Tu nombre
                  </label>
                  <input
                    id="customer-name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value)
                      if (error) setError('')
                    }}
                    placeholder="Nombre y apellido"
                    autoComplete="name"
                    className="mt-2 w-full border border-white/15 bg-white/[0.03] px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/50"
                  />
                  {error && (
                    <p className="anim-shake mt-2 text-[11px] text-white/80">{error}</p>
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    ¿Cómo lo recibís?
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {DELIVERIES.map((option) => {
                      const Icon = option.icon
                      const active = delivery === option.id
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setDelivery(option.id)}
                          className={cn(
                            'flex flex-col items-start gap-2 border p-3 text-left transition',
                            active
                              ? 'border-white bg-white/[0.06]'
                              : 'border-white/12 hover:border-white/30',
                          )}
                          aria-pressed={active}
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.6}
                            className={active ? 'text-white' : 'text-white/45'}
                          />
                          <span className="text-[11px] font-semibold leading-tight text-white">
                            {option.label}
                          </span>
                          <span className="text-[10px] leading-none text-white/40">
                            {option.hint}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {delivery === 'envio' && (
                    <input
                      value={address}
                      onChange={(event) => setAddress(event.target.value)}
                      placeholder="Dirección (opcional)"
                      autoComplete="street-address"
                      className="anim-fade mt-2 w-full border border-white/15 bg-white/[0.03] px-3 py-3 text-sm outline-none transition placeholder:text-white/25 focus:border-white/50"
                    />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    Medio de pago
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {PAYMENTS.map((option) => {
                      const active = payment === option
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setPayment(option)}
                          className={cn(
                            'border px-2 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] transition',
                            active
                              ? 'border-white bg-white text-ink'
                              : 'border-white/12 text-white/60 hover:border-white/30 hover:text-white',
                          )}
                          aria-pressed={active}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <footer className="border-t border-white/10 bg-carbon px-5 pb-5 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/45">
                  Subtotal
                </span>
                <span className="text-xl font-bold tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
              <p className="mt-1 text-[10px] text-white/35">
                Envío a coordinar por WhatsApp según la zona.
              </p>
              <button
                type="button"
                onClick={handleConfirm}
                className="group mt-4 inline-flex w-full items-center justify-center gap-2.5 bg-white px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white/90"
              >
                <MessageCircle size={16} strokeWidth={1.9} />
                Confirmar por WhatsApp
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
