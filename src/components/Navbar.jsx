import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, MessageCircle, Search, ShoppingBag, X } from 'lucide-react'
import Logo from './Logo'
import { useStore } from '../context/StoreContext'
import { navigate } from '../lib/router'
import { STORE_HOURS, WHATSAPP_DISPLAY, whatsappLink } from '../lib/whatsapp'

const LINKS = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/catalogo' },
  { label: 'Ubicación', to: '/ubicacion' },
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
    const onScroll = () => setScrolled(window.scrollY > 24)
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
      setNewOnly(false)
    }
    navigate(link.to)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isActive = (link) => {
    if (link.to === '/') return path === '/'
    if (link.to === '/catalogo') return path === '/catalogo' || path.startsWith('/producto/')
    return path === link.to
  }

  const submitSearch = (event) => {
    event.preventDefault()
    setSearchOpen(false)
    navigate('/catalogo')
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'border-b border-white/10 bg-ink/90 backdrop-blur-xl'
            : 'border-b border-transparent bg-gradient-to-b from-ink/70 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-3 px-5 sm:h-20 lg:px-10">
          <a
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="shrink-0"
            aria-label="Mood Indumentaria — inicio"
          >
            <Logo className="h-8 w-auto sm:h-10" />
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Navegación principal">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.to}
                onClick={(event) => goToPage(event, link)}
                aria-current={isActive(link) ? 'page' : undefined}
                className={`group relative text-[11px] font-medium uppercase tracking-[0.22em] transition ${
                  isActive(link) ? 'text-white' : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1.5 left-0 h-px bg-white transition-all duration-300 ${
                    isActive(link) ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1.5">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              className="grid size-10 place-items-center text-white/80 transition hover:text-white"
              aria-label="Buscar prendas"
              aria-expanded={searchOpen}
            >
              {searchOpen ? (
                <X size={19} strokeWidth={1.6} />
              ) : (
                <Search size={19} strokeWidth={1.6} />
              )}
            </button>

            <a
              href={whatsappLink('Hola MOOD! Quiero consultar por una prenda.')}
              target="_blank"
              rel="noreferrer"
              className="hidden size-10 place-items-center text-white/80 transition hover:text-white sm:grid"
              aria-label="Escribinos por WhatsApp"
            >
              <MessageCircle size={19} strokeWidth={1.6} />
            </a>

            <button
              type="button"
              onClick={openCart}
              className="relative grid size-10 place-items-center text-white transition hover:opacity-80"
              aria-label={`Abrir carrito (${cartCount} prendas)`}
            >
              <ShoppingBag size={19} strokeWidth={1.6} />
              {cartCount > 0 && (
                <span className="absolute right-0 top-0.5 grid min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-bold leading-5 text-ink">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center text-white lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={21} strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="anim-fade border-t border-white/10 bg-ink/95 backdrop-blur-xl">
            <form
              onSubmit={submitSearch}
              className="mx-auto flex max-w-[1440px] items-center gap-3 px-5 py-4 lg:px-10"
            >
              <Search size={18} className="shrink-0 text-white/40" />
              <input
                ref={inputRef}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscá por prenda, categoría o talle…"
                className="w-full bg-transparent py-2 text-base text-white outline-none placeholder:text-white/35"
                aria-label="Buscar en el catálogo"
              />
              <button
                type="submit"
                className="shrink-0 text-[10px] uppercase tracking-[0.22em] text-white/60 transition hover:text-white"
              >
                Buscar
              </button>
            </form>
          </div>
        )}
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-ink lg:hidden">
          <div className="anim-fade flex h-full flex-col px-6 pb-10 pt-6">
            <div className="flex items-center justify-between">
              <Logo className="h-9 w-auto" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-10 place-items-center border border-white/15 text-white"
                aria-label="Cerrar menú"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-14 flex flex-col">
              {LINKS.map((link, index) => (
                <a
                  key={link.label}
                  href={link.to}
                  onClick={(event) => goToPage(event, link)}
                  className="group flex items-center justify-between border-b border-white/10 py-5 text-3xl font-extrabold uppercase tracking-tight text-white"
                >
                  <span className="flex items-baseline gap-3">
                    <span className="text-[10px] font-medium tracking-[0.2em] text-white/30">
                      0{index + 1}
                    </span>
                    {link.label}
                  </span>
                  <ArrowUpRight
                    size={22}
                    className="text-white/30 transition group-hover:text-white"
                  />
                </a>
              ))}
            </nav>

            <div className="mt-auto space-y-4 pt-10">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Pedidos</p>
              <a
                href={whatsappLink('Hola MOOD! Quiero hacer un pedido.')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between border border-white/20 px-4 py-4 text-sm text-white"
              >
                <span>{WHATSAPP_DISPLAY}</span>
                <MessageCircle size={18} />
              </a>
              <p className="text-xs leading-relaxed text-white/45">
                Sta. Fe 1141, Resistencia
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
