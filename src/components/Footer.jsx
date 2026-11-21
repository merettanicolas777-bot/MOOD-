import { ArrowUpRight, Clock, MapPin, MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { useStore } from '../context/StoreContext'
import { navigate } from '../lib/router'
import {
  MAPS_LINK,
  STORE_ADDRESS,
  STORE_HOURS,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from '../lib/whatsapp'

const SHOP_LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Ubicación y horarios', to: '/ubicacion' },
]

export default function Footer() {
  const { setSearch, setNewOnly } = useStore()

  const goTo = (event, link) => {
    event.preventDefault()
    setSearch('')
    setNewOnly(false)
    navigate(link.to)
  }

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-[1440px] px-5 pb-8 pt-14 sm:px-8 lg:px-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          <div>
            <Logo className="h-14 w-auto" />
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-white/45">
              Indumentaria urbana de tiradas cortas. Resistencia, Chaco.
            </p>
            <a
              href={whatsappLink('Hola MOOD! Quiero consultar por una prenda.')}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-white/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 transition hover:border-white/50 hover:text-white"
            >
              <MessageCircle size={15} strokeWidth={1.8} /> {WHATSAPP_DISPLAY}
            </a>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Tienda
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-white/60">
              {SHOP_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.to}
                    onClick={(event) => goTo(event, link)}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Local
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li className="flex gap-2.5">
                <MapPin size={15} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/30" />
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="leading-relaxed transition hover:text-white"
                >
                  {STORE_ADDRESS}
                </a>
              </li>
              <li className="flex gap-2.5">
                <Clock size={15} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/30" />
                <span className="leading-relaxed">{STORE_HOURS}</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Pedidos
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/45">
              Envíos en Resistencia y retiro en el local. Coordinamos todo por WhatsApp.
            </p>
            <a
              href={whatsappLink('Hola MOOD! Quiero hacer un pedido.')}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:text-white/70"
            >
              Hacer un pedido <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/30">
            © {new Date().getFullYear()} Mood Indumentaria · Resistencia, Chaco
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/20">
              Hecho para vestir tu mood
            </span>
            <a
              href="/admin"
              onClick={(event) => {
                event.preventDefault()
                navigate('/admin')
              }}
              className="text-[10px] uppercase tracking-[0.16em] text-white/25 transition hover:text-white/60"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
