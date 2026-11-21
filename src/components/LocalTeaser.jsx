import { ArrowRight, Clock, Instagram, MapPin, MessageCircle } from 'lucide-react'
import { navigate } from '../lib/router'
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  STORE_ADDRESS_SHORT,
  STORE_HOURS,
  whatsappLink,
} from '../lib/whatsapp'
import Reveal from './Reveal'

export default function LocalTeaser() {
  return (
    <section className="bg-sand">
      <div className="mx-auto grid max-w-[1400px] items-stretch px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:py-24">
        <div className="relative order-2 mt-8 overflow-hidden rounded-2xl bg-mist lg:order-1 lg:mt-0 lg:min-h-[480px]">
          <img
            src="/img/local.jpg"
            alt="Interior del local de Shadday Indumentaria en Resistencia"
            loading="lazy"
            className="h-[280px] w-full object-cover sm:h-[360px] lg:absolute lg:inset-0 lg:h-full"
          />
        </div>

        <Reveal className="order-1 flex flex-col justify-center lg:order-2">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-ink/30" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted">El local</p>
          </div>
          <h2 className="mt-5 font-serif text-[clamp(2rem,5vw,3.2rem)] font-medium leading-[1.04]">
            Arturo Frondizi 174,
            <br />
            <span className="italic">Resistencia.</span>
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
            Un espacio luminoso para ver las prendas de cerca, probarte y salir con el look
            armado. También coordinamos envíos y retiros por WhatsApp.
          </p>

          <div className="mt-7 space-y-3 text-sm text-ink/80">
            <p className="flex items-start gap-3">
              <Clock size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-muted" />
              {STORE_HOURS}
            </p>
            <p className="flex items-start gap-3">
              <MapPin size={16} strokeWidth={1.7} className="mt-0.5 shrink-0 text-muted" />
              {STORE_ADDRESS_SHORT}
            </p>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 transition hover:text-ink"
            >
              <Instagram size={16} strokeWidth={1.7} className="text-muted" />
              {INSTAGRAM_HANDLE}
            </a>
          </div>

          <div className="mt-8 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/ubicacion')}
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-ink/85 sm:w-auto"
            >
              Ubicación y horarios
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
            <a
              href={whatsappLink('Hola Shadday! Quiero hacer un pedido.')}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-ink/20 px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink transition hover:border-ink hover:bg-brand sm:w-auto"
            >
              <MessageCircle size={15} strokeWidth={1.8} /> Pedir por WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
