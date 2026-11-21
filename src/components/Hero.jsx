import { ArrowRight, Clock, Instagram, MapPin } from 'lucide-react'
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_ADDRESS_SHORT, STORE_HOURS } from '../lib/whatsapp'

const TICKER = [
  'Nueva temporada',
  'Retiro en Arturo Frondizi 174',
  'Envíos en Resistencia',
  'Lun a Sáb · 9 a 12:30 y 17 a 21 hs',
  'Asesoramiento por WhatsApp',
]

export default function Hero({ onShop, onVisit }) {
  return (
    <section id="top" className="relative bg-cream pt-16 sm:pt-[74px]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-8 px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-14 lg:px-10 lg:pb-20 lg:pt-20">
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-ink/30" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
              Resistencia · Chaco
            </p>
          </div>

          <h1 className="mt-5 font-serif text-[clamp(2.6rem,7.5vw,5.4rem)] font-medium leading-[0.98] tracking-[-0.02em]">
            Nueva
            <br />
            temporada,
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 italic">nuevos looks.</span>
              <span className="absolute inset-x-0 bottom-1 z-0 h-3 bg-brand/80 sm:h-4" />
            </span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted sm:mt-7 sm:text-base">
            Prendas femeninas elegidas una por una: vestidos, conjuntos, jeans y abrigos para
            todos los días. Te esperamos en el local o te lo enviamos en Resistencia.
          </p>

          <div className="mt-7 flex flex-col gap-2.5 sm:mt-9 sm:flex-row sm:items-center sm:gap-3">
            <button
              type="button"
              onClick={onShop}
              className="group inline-flex w-full items-center justify-between gap-6 rounded-full bg-ink px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-ink/85 sm:w-auto"
            >
              Ver catálogo
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              type="button"
              onClick={onVisit}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-ink hover:bg-brand sm:w-auto"
            >
              <MapPin size={15} strokeWidth={1.9} />
              Visitar el local
            </button>
          </div>

          <div className="mt-8 space-y-2.5 text-[11px] text-muted sm:mt-10">
            <p className="flex items-start gap-2.5">
              <Clock size={14} strokeWidth={1.7} className="mt-0.5 shrink-0" />
              {STORE_HOURS}
            </p>
            <p className="flex items-start gap-2.5">
              <MapPin size={14} strokeWidth={1.7} className="mt-0.5 shrink-0" />
              {STORE_ADDRESS_SHORT}
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2.5 transition hover:text-ink"
            >
              <Instagram size={14} strokeWidth={1.7} />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-mist sm:aspect-[16/11] lg:aspect-[4/4.2]">
            <img
              src="/img/hero.jpg"
              alt="Modelo con conjunto de punto en tonos crema en el local de Shadday"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-4 -left-2 flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink shadow-sm sm:-bottom-5 sm:left-5">
            <span className="size-1.5 rounded-full bg-ink" />
            Nueva colección
          </div>
        </div>
      </div>

      <div className="overflow-hidden bg-brand py-2.5">
        <div className="animate-marquee flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {TICKER.map((item) => (
                <span
                  key={`${copy}-${item}`}
                  className="flex items-center text-[9px] font-semibold uppercase tracking-[0.26em] text-ink"
                >
                  <span className="px-6">{item}</span>
                  <span className="size-1 rounded-full bg-ink/40" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
