import { ArrowUpRight, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import Reveal from './Reveal'
import {
  MAPS_EMBED,
  MAPS_LINK,
  STORE_ADDRESS,
  STORE_HOURS,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from '../lib/whatsapp'

export default function Location({ standalone = false }) {
  return (
    <section
      id="local"
      className={`scroll-mt-16 bg-carbon sm:scroll-mt-20 ${
        standalone ? 'pt-20 sm:pt-24' : ''
      }`}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Reveal className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
              {standalone ? 'Ubicación y horarios' : 'Visitanos'}
            </p>
            </div>
            <h2 className="mt-6 text-[clamp(2rem,5vw,3.4rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
              Sta. Fe 1141,
              <br />
              <span className="text-outline">Resistencia.</span>
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">
              Te esperamos en el local para probarte las prendas, ver los calces de cerca y
              llevarte lo que va con tu mood. También podés pedir por WhatsApp y retirar.
            </p>

            <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
              <div className="flex items-start gap-4 py-5">
                <Clock size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/45" />
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                    Horarios
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold">
                    Lunes a domingo · 11:00 a 20:00 hs
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4 py-5">
                <MapPin size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/45" />
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                    Dirección
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-white/80">
                    {STORE_ADDRESS}
                  </dd>
                </div>
              </div>
              <div className="flex items-start gap-4 py-5">
                <Phone size={17} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/45" />
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                    Pedidos y consultas
                  </dt>
                  <dd className="mt-1.5 text-sm font-medium text-white/80">{WHATSAPP_DISPLAY}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
              <a
                href={whatsappLink('Hola MOOD! Quiero hacer un pedido.')}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white/90"
              >
                <MessageCircle size={15} strokeWidth={1.9} /> Pedir por WhatsApp
              </a>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-white/20 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:border-white/60"
              >
                Cómo llegar <ArrowUpRight size={15} />
              </a>
            </div>
          </Reveal>

          <Reveal delay={100} className="relative">
            <div className="relative h-[320px] overflow-hidden rounded-lg border border-white/10 bg-ink sm:h-[420px] lg:h-full lg:min-h-[520px]">
              <iframe
                title="Ubicación de Mood Indumentaria en Google Maps"
                src={MAPS_EMBED}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="map-mono absolute inset-0 h-full w-full border-0"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.26em] text-white/50">Mood</p>
                  <p className="text-sm font-semibold">Sta. Fe 1141 · Resistencia</p>
                </div>
                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-9 shrink-0 place-items-center border border-white/40 bg-ink/40 text-white backdrop-blur transition hover:bg-white hover:text-ink"
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
