import { ArrowRight, MapPin, MessageCircle, Truck } from 'lucide-react'
import { whatsappLink } from '../lib/whatsapp'

const TICKER = [
  'Envíos en Resistencia',
  'Retiro en el local · Sta. Fe 1141',
  'Nuevos ingresos cada semana',
  'Lun a dom · 11 a 20 hs',
  'Asesoramiento por WhatsApp',
]

export default function Hero({ onShop, onNewArrivals }) {
  return (
    <section id="top" className="relative bg-ink pt-16 sm:pt-20">
      <div className="mx-auto grid max-w-[1440px] items-stretch lg:grid-cols-[1.03fr_1fr]">
        <div className="relative z-10 flex flex-col justify-center px-5 pb-10 pt-10 sm:px-8 sm:pb-12 sm:pt-16 lg:px-10 lg:pb-24 lg:pt-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/40" />
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/50">
              Resistencia · Chaco
            </p>
          </div>

          <h1 className="mt-5 text-[clamp(2.85rem,8.6vw,6.4rem)] sm:mt-7 font-extrabold uppercase leading-[0.86] tracking-[-0.035em]">
            Menos
            <br />
            ruido.
            <br />
            <span className="text-outline">Más actitud.</span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:mt-8 sm:text-base">
            Indumentaria urbana de calce oversize y tiradas cortas. Envíos en Resistencia y
            retiro en el local, sin vueltas.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={onShop}
              className="group inline-flex w-full items-center justify-between gap-6 bg-white px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white/90 sm:w-auto"
            >
              Ver catálogo
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <a
              href={whatsappLink('Hola MOOD! Quiero consultar por una prenda.')}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 border border-white/20 px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition hover:border-white/60 sm:w-auto"
            >
              <MessageCircle size={15} strokeWidth={1.8} />
              Escribinos
            </a>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-[10px] uppercase tracking-[0.18em] text-white/40 sm:mt-12 sm:gap-x-7 sm:gap-y-3">
            <span className="inline-flex items-center gap-2">
              <Truck size={14} strokeWidth={1.6} /> Envíos en Resistencia
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={14} strokeWidth={1.6} /> Retiro en Sta. Fe 1141
            </span>
          </div>
        </div>

        <div className="relative h-[64vw] max-h-[420px] min-h-[260px] w-full overflow-hidden sm:h-[460px] lg:h-auto lg:max-h-none lg:min-h-[680px]">
          <img
            src="/img/hero.jpg"
            alt="Dos modelos con indumentaria urbana oversize en blanco y negro"
            className="absolute inset-0 h-full w-full object-cover object-[60%_center] grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/10 to-transparent lg:from-ink lg:via-ink/0" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-ink/20 lg:from-ink/60" />

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 sm:bottom-7 sm:left-7 sm:right-7">
            <button
              type="button"
              onClick={onNewArrivals}
              className="group flex items-center gap-3 text-left"
            >
              <span className="grid size-9 place-items-center border border-white/40 text-white transition group-hover:bg-white group-hover:text-ink">
                <ArrowRight size={15} />
              </span>
              <span>
                <span className="block text-[9px] uppercase tracking-[0.28em] text-white/55">
                  Nuevos ingresos
                </span>
                <span className="block text-sm font-semibold uppercase tracking-wide text-white">
                  Ver la última tirada
                </span>
              </span>
            </button>
            <span className="hidden text-[9px] uppercase tracking-[0.28em] text-white/45 sm:block">
              01 — 26
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-y border-white/10 py-3">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {TICKER.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center text-[10px] uppercase tracking-[0.28em] text-white/45"
                >
                  <span className="px-6">{item}</span>
                  <span className="size-1 rounded-full bg-white/25" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
