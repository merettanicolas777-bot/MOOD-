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
  { id: 'retiro', label: 'Retiro en el local', hint: 'Arturo Frondizi 174', icon: Store },
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
        className="anim-fade absolute inset-0 cursor-default bg-ink/50 backdrop-blur-[2px]"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className="anim-slide absolute right-0 top-0 flex h-full w-full flex-col border-l border-line bg-cream text-ink sm:max-w-[440px]"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={17} strokeWidth={1.8} />
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em]">Tu pedido</h2>
            {cartCount > 0 && (
              <span className="grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold leading-5 text-ink">
                {cartCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full border border-ink/15 text-muted transition hover:border-ink hover:text-ink"
            aria-label="Cerrar"
          >
            <X size={17} />
          </button>
        </header>

        {sentLink ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-brand">
              <Check size={24} strokeWidth={1.8} />
            </span>
            <h3 className="mt-6 font-serif text-2xl">Pedido listo</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Abrimos WhatsApp con el detalle completo. Confirmá el mensaje y coordinamos el pago
              y la entrega.
            </p>
            <a
              href={sentLink}
              target="_blank"
              rel="noreferrer"
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-brand-deep"
            >
              <MessageCircle size={16} /> Abrir WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-2 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-muted transition hover:text-ink"
            >
              Seguir comprando <ArrowRight size={13} />
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full border border-ink/15 text-muted">
              <ShoppingBag size={22} strokeWidth={1.6} />
            </span>
            <h3 className="mt-6 font-serif text-xl">Tu carrito está vacío</h3>
            <p className="mt-2 text-sm text-muted">
              Sumá prendas desde el catálogo para armar tu pedido.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-ink/85"
            >
              Ver catálogo <ArrowRight size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.key} className="flex gap-3.5 border-b border-line pb-4">
                    <div className="h-24 w-19 shrink-0 overflow-hidden rounded-lg bg-mist">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-serif text-[15px] leading-snug">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-muted">
                            Talle {item.size}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.key)}
                          className="shrink-0 p-1 text-muted transition hover:text-ink"
                          aria-label={`Quitar ${item.name}`}
                        >
                          <Trash2 size={14} strokeWidth={1.7} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-end justify-between gap-2 pt-2">
                        <div className="flex items-center rounded-full border border-ink/15">
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty - 1)}
                            className="grid size-7 place-items-center rounded-full text-muted transition hover:bg-ink hover:text-white"
                            aria-label="Restar una unidad"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-7 text-center text-xs tabular-nums">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => setQty(item.key, item.qty + 1)}
                            className="grid size-7 place-items-center rounded-full text-muted transition hover:bg-ink hover:text-white"
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
                    className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted"
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
                    className="mt-2 w-full rounded-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/50 focus:border-ink"
                  />
                  {error && <p className="anim-shake mt-2 text-[11px] text-ink">{error}</p>}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
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
                            'flex flex-col items-start gap-2 rounded-xl border p-3 text-left transition',
                            active
                              ? 'border-ink bg-brand/20'
                              : 'border-ink/15 hover:border-ink/40',
                          )}
                          aria-pressed={active}
                        >
                          <Icon
                            size={16}
                            strokeWidth={1.7}
                            className={active ? 'text-ink' : 'text-muted'}
                          />
                          <span className="text-[11px] font-semibold leading-tight">
                            {option.label}
                          </span>
                          <span className="text-[10px] leading-tight text-muted">{option.hint}</span>
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
                      className="anim-fade mt-2 w-full rounded-full border border-ink/15 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted/50 focus:border-ink"
                    />
                  )}
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
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
                            'rounded-full border px-2 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] transition',
                            active
                              ? 'border-ink bg-ink text-cream'
                              : 'border-ink/15 text-muted hover:border-ink/40 hover:text-ink',
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

            <footer className="border-t border-line bg-sand px-5 pb-5 pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted">Subtotal</span>
                <span className="text-xl font-bold tabular-nums">{formatPrice(cartTotal)}</span>
              </div>
              <p className="mt-1 text-[10px] text-muted">
                Envío a coordinar por WhatsApp según la zona.
              </p>
              <button
                type="button"
                onClick={handleConfirm}
                className="mt-4 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-brand px-5 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition hover:bg-brand-deep"
              >
                <MessageCircle size={16} strokeWidth={1.9} />
                Enviar pedido por WhatsApp
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
