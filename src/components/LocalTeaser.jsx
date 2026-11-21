import { ArrowRight, Clock, MapPin, MessageCircle } from 'lucide-react'
import { navigate } from '../lib/router'
import { STORE_HOURS, whatsappLink } from '../lib/whatsapp'
import Reveal from './Reveal'

export default function LocalTeaser() {
  return (
    <section className="border-t border-white/10 bg-carbon">
      <div className="mx-auto grid max-w-[1440px] items-stretch lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-24">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/30" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">El local</p>
          </div>
          <h2 className="mt-6 text-[clamp(2rem,5vw,3.4rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.03em]">
            Sta. Fe 1141,
            <br />
            <span className="text-outline">Resistencia.</span>
          </h2>

          <div className="mt-8 space-y-3 text-sm text-white/60">
            <p className="flex items-start gap-3">
              <Clock size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/35" />
              {STORE_HOURS}
            </p>
            <p className="flex items-start gap-3">
              <MapPin size={16} strokeWidth={1.6} className="mt-0.5 shrink-0 text-white/35" />
              Probate las prendas y coordiná el retiro en el local.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/ubicacion')}
              className="group inline-flex w-full items-center justify-center gap-3 bg-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white/90 sm:w-auto"
            >
              Ubicación y horarios
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={whatsappLink('Hola MOOD! Quiero hacer un pedido.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border border-white/20 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:border-white/60 sm:w-auto"
            >
              <MessageCircle size={15} strokeWidth={1.8} /> Pedir por WhatsApp
            </a>
          </div>
        </Reveal>

        <div className="relative h-[240px] overflow-hidden sm:h-[320px] lg:h-auto lg:min-h-[520px]">
          <img
            src="/img/lookbook.jpg"
            alt="Lookbook urbano de Mood Indumentaria"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent lg:bg-gradient-to-r lg:from-carbon lg:via-transparent" />
          <p className="absolute bottom-5 left-5 text-[9px] uppercase tracking-[0.28em] text-white/60">
            Mood · Resistencia
          </p>
        </div>
      </div>
    </section>
  )
}
