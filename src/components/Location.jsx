import { ArrowUpRight, Clock, Instagram, MapPin, MessageCircle, Phone } from 'lucide-react'
import Reveal from './Reveal'
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  MAPS_EMBED,
  MAPS_LINK,
  STORE_ADDRESS,
  STORE_HOURS_AFTERNOON,
  STORE_HOURS_MORNING,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from '../lib/whatsapp'

export default function Location({ standalone = false }) {
  return (
    <section
      id="local"
      className={`scroll-mt-16 bg-cream text-ink sm:scroll-mt-20 ${
        standalone ? 'pt-24 sm:pt-28' : ''
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-ink/30" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted">
                {standalone ? 'Ubicación y horarios' : 'Visitanos'}
              </p>
            </div>
            <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.2rem)] font-medium leading-[1.04]">
              Arturo Frondizi 174,
              <br />
              <span className="italic">Resistencia.</span>
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Te esperamos en el local para ver las prendas, probarte y llevarte lo que más te
              guste. Si no podés acercarte, coordinamos envío o retiro por WhatsApp.
            </p>

            <dl className="mt-9 divide-y divide-line border-y border-line">
              <div className="flex items-start gap-4 py-5">
                <Clock size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-ink/50" />
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-muted">Horarios</dt>
                  <dd className="mt-2 space-y-1.5 text-sm text-ink">
                    <p className="flex items-baseline justify-between gap-6">
                      <span>Lunes a sábado · turno mañana</span>
                      <span className="font-semibold tabular-nums">{STORE_HOURS_MORNING}</span>
                    </p>
                    <p className="flex items-baseline justify-between gap-6">
                      <span>Lunes a sábado · turno tarde</span>
                      <span className="font-semibold tabular-nums">{STORE_HOURS_AFTERNOON}</span>
                    </p>
                  </dd>
                  <p className="mt-2 inline-flex rounded-full bg-brand px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-ink">
                    Domingos cerrado
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 py-5">
                <MapPin size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-ink/50" />
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-muted">Dirección</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed">{STORE_ADDRESS}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4 py-5">
                <Phone size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-ink/50" />
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-muted">
                    Pedidos y consultas
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium">{WHATSAPP_DISPLAY}</dd>
                </div>
              </div>
              <div className="flex items-start gap-4 py-5">
                <Instagram size={18} strokeWidth={1.7} className="mt-0.5 shrink-0 text-ink/50" />
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-muted">Instagram</dt>
                  <dd className="mt-1.5">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium underline decoration-brand decoration-2 underline-offset-4 transition hover:text-muted"
                    >
                      {INSTAGRAM_HANDLE}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={whatsappLink('Hola Shadday! Quiero hacer un pedido.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-ink/85"
              >
                <MessageCircle size={15} strokeWidth={1.9} /> Pedir por WhatsApp
              </a>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-ink hover:bg-brand"
              >
                Cómo llegar <ArrowUpRight size={15} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={100} className="relative">
            <div className="relative h-[320px] overflow-hidden rounded-2xl border border-line bg-mist sm:h-[420px] lg:h-full lg:min-h-[520px]">
              <iframe
                title="Ubicación de Shadday Indumentaria en Google Maps"
                src={MAPS_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-mono absolute inset-0 h-full w-full border-0"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/50 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.26em] text-white/70">Shadday</p>
                  <p className="text-sm font-semibold">Arturo Frondizi 174 · Resistencia</p>
                </div>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-ink transition hover:bg-white"
                  aria-label="Abrir ubicación en Google Maps"
                >
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
