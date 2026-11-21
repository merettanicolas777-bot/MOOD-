import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Instagram, Menu, Search, ShoppingBag, X } from 'lucide-react'
import Logo from './Logo'
import { useStore } from '../context/StoreContext'
import { navigate } from '../lib/router'
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  STORE_ADDRESS_SHORT,
  STORE_HOURS,
  WHATSAPP_DISPLAY,
  whatsappLink,
} from '../lib/whatsapp'

const LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Nuevos ingresos', to: '/catalogo', arrivals: true },
  { label: 'Horarios y ubicación', to: '/ubicacion' },
]

function normalizePath() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

export default function Navbar() {
  const { cartCount, openCart, search, setSearch, setNewOnly } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const inputRef = useRef(null)
  const path = normalizePath()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const goToPage = (event, link) => {
    event.preventDefault()
    setMenuOpen(false)
    setSearchOpen(false)
    if (link.to === '/catalogo') {
      setSearch('')
      setNewOnly(Boolean(link.arrivals))
    }
    navigate(link.to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isActive = (link) => {
    if (link.arrivals) return false
    if (link.to === '/') return path === '/'
    if (link.to === '/catalogo') return path === '/catalogo' || path.startsWith('/producto/')
    return path === link.to
  }

  const submitSearch = (event) => {
    event.preventDefault()
    setSearchOpen(false)
    setNewOnly(false)
    navigate('/catalogo')
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'border-b border-line bg-cream/95 backdrop-blur-xl'
            : 'border-b border-transparent bg-cream'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-5 sm:h-[74px] lg:px-10">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Shadday Indumentaria — inicio"
          >
            <Logo className="h-10 w-10 sm:h-11 sm:w-11" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-serif text-base font-semibold tracking-[0.16em]">SHADDAY</span>
              <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.34em] text-muted">
                Indumentaria
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.arrivals ? '/catalogo' : link.to}
                onClick={(event) => goToPage(event, link)}
                aria-current={isActive(link) ? 'page' : undefined}
                className={`group relative text-[11px] font-medium uppercase tracking-[0.16em] transition ${
                  isActive(link) ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-2 left-0 h-[2px] bg-brand transition-all duration-300 ${
                    isActive(link) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="grid size-10 place-items-center rounded-full text-ink/80 transition hover:bg-ink/5 hover:text-ink"
              aria-label="Buscar prendas"
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X size={19} strokeWidth={1.7} /> : <Search size={19} strokeWidth={1.7} />}
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="hidden size-10 place-items-center rounded-full text-ink/80 transition hover:bg-ink/5 hover:text-ink sm:grid"
              aria-label={`Instagram ${INSTAGRAM_HANDLE}`}
            >
              <Instagram size={19} strokeWidth={1.7} />
            </a>

            <button
              type="button"
              onClick={openCart}
              className="relative grid size-10 place-items-center rounded-full text-ink transition hover:bg-ink/5"
              aria-label={`Abrir carrito (${cartCount} prendas)`}
            >
              <ShoppingBag size={19} strokeWidth={1.7} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0 grid min-w-[18px] place-items-center rounded-full bg-brand px-1 text-[10px] font-bold leading-[18px] text-ink ring-2 ring-cream">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center rounded-full text-ink lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={21} strokeWidth={1.7} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="anim-fade border-t border-line bg-sand">
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-4 lg:px-10"
            >
              <Search size={18} className="shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscá una prenda, categoría o talle…"
                className="w-full bg-transparent py-2 text-base text-ink outline-none placeholder:text-muted/60"
                aria-label="Buscar en el catálogo"
              />
              <button
                type="submit"
                className="shrink-0 rounded-full bg-ink px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-ink/85"
              >
                Buscar
              </button>
            </form>
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-cream lg:hidden">
          <div className="anim-fade flex h-full flex-col px-6 pb-10 pt-5">
            <div className="flex items-center justify-between">
              <Logo className="h-12 w-12" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-10 place-items-center rounded-full border border-line text-ink"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-12 flex flex-col">
              {LINKS.map((link, index) => (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={(event) => goToPage(event, link)}
                  className="group flex items-center justify-between border-b border-line py-5 first:border-t"
                >
                  <span className="flex items-baseline gap-3 font-serif text-2xl text-ink">
                    <span className="text-[10px] font-sans tracking-[0.2em] text-muted/60">
                      0{index + 1}
                    </span>
                    {link.label}
                  </span>
                  <ArrowUpRight size={20} className="text-muted transition group-hover:text-ink" />
                </a>
              ))}
            </nav>

            <div className="mt-auto space-y-3 pt-10">
              <p className="text-[9px] uppercase tracking-[0.28em] text-muted">Pedidos</p>
              <a
                href={whatsappLink('Hola Shadday! Quiero hacer un pedido.')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-full bg-brand px-5 py-4 text-sm font-semibold text-ink"
              >
                <span>{WHATSAPP_DISPLAY}</span>
                <ArrowUpRight size={18} />
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-full border border-line px-5 py-3.5 text-sm text-ink"
              >
                <span>{INSTAGRAM_HANDLE}</span>
                <Instagram size={17} />
              </a>
              <p className="pt-2 text-xs leading-relaxed text-muted">
                {STORE_ADDRESS_SHORT}
                <br />
                {STORE_HOURS}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
