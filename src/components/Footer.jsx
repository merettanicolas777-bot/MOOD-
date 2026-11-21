import { ArrowUpRight, Clock, Instagram, MapPin, MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { useStore } from '../context/StoreContext'
import { navigate } from '../lib/router'
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  MAPS_LINK,
  STORE_ADDRESS,
  STORE_ADDRESS_SHORT,
  STORE_HOURS,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from '../lib/whatsapp'

const SHOP_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Nuevos ingresos', to: '/catalogo', arrivals: true },
  { label: 'Horarios y ubicación', to: '/ubicacion' },
]

export default function Footer() {
  const { setSearch, setNewOnly } = useStore()

  const goTo = (event, link) => {
    event.preventDefault()
    setSearch('')
    setNewOnly(Boolean(link.arrivals))
    navigate(link.to)
  }

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-[1400px] px-5 pb-8 pt-14 sm:px-8 lg:px-10 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1.1fr_1fr] lg:gap-12">
          <div>
            <div className="flex items-center gap-3">
              <Logo className="h-14 w-14" />
              <div className="leading-none">
                <p className="font-serif text-lg tracking-[0.16em]">SHADDAY</p>
                <p className="mt-1.5 text-[8px] uppercase tracking-[0.34em] text-white/45">
                  Indumentaria
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/55">
              Ropa femenina en Resistencia, Chaco. Prendas elegidas para todos los días.
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-[11px] text-white/70 transition hover:text-brand"
            >
              <Instagram size={15} strokeWidth={1.7} /> {INSTAGRAM_HANDLE}
            </a>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Tienda
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/70">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={(event) => goTo(event, link)}
                    className="transition hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Local
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              <li className="flex gap-2.5">
                <MapPin size={15} strokeWidth={1.7} className="mt-0.5 shrink-0 text-brand" />
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="leading-relaxed transition hover:text-brand"
                >
                  {STORE_ADDRESS}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock size={15} strokeWidth={1.7} className="mt-0.5 shrink-0 text-brand" />
                <span className="leading-relaxed">{STORE_HOURS}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Pedidos
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              Retiro en el local o envío en Resistencia. Coordinamos todo por WhatsApp.
            </p>
            <a
              href={whatsappLink('Hola Shadday! Quiero hacer un pedido.')}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-ink transition hover:bg-brand-deep"
            >
              <MessageCircle size={14} strokeWidth={1.9} /> Hacer un pedido
            </a>
            <p className="mt-3 text-[11px] text-white/45">{WHATSAPP_DISPLAY}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/35">
            © {new Date().getFullYear()} Shadday Indumentaria · {STORE_ADDRESS_SHORT}
          </p>
          <div className="flex items-center gap-6">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] uppercase tracking-[0.16em] text-white/35 transition hover:text-brand"
            >
              Instagram <ArrowUpRight size={11} className="inline" />
            </a>
            <a
              href="/admin"
              onClick={(event) => {
                event.preventDefault()
                navigate('/admin')
              }}
              className="text-[10px] uppercase tracking-[0.16em] text-white/25 transition hover:text-white/70"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
