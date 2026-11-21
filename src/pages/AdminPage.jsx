import { useEffect, useState } from 'react'
import {
  Check,
  Download,
  Eye,
  EyeOff,
  Lock,
  LogOut,
  Mail,
  Store,
  TriangleAlert,
  X,
} from 'lucide-react'
import Logo from '../components/Logo'
import AdminProducts from '../components/admin/AdminProducts'
import AdminCategories from '../components/admin/AdminCategories'
import ProductForm from '../components/admin/ProductForm'
import { useStore } from '../context/StoreContext'
import { checkIsAdmin, getCurrentUser, signIn, signOut } from '../lib/auth'
import { cn } from '../lib/format'
import { navigate } from '../lib/router'
import { useInstallPrompt } from '../lib/useInstallPrompt'

const secondaryButton =
  'inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/70 transition hover:border-white/40 hover:text-white'

function InstallHelp({ onClose }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar ayuda de instalación"
        onClick={onClose}
        className="anim-fade absolute inset-0 cursor-default bg-black/75 backdrop-blur-sm"
      />
      <div className="anim-rise relative w-full max-w-md border border-white/10 bg-carbon p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/35">Shadday Panel</p>
            <h2 className="mt-2 text-lg font-bold tracking-tight">Instalar la app</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center border border-white/15 text-white/60 transition hover:text-white"
            aria-label="Cerrar"
          >
            <X size={15} />
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-white/50">
          El navegador todavía no habilitó la instalación automática. Podés agregar el panel a tu
          pantalla de inicio manualmente:
        </p>

        <ul className="mt-4 space-y-3 text-xs leading-relaxed text-white/60">
          <li>
            <span className="font-semibold text-white">Android / Chrome:</span> menú ⋮ → “Instalar
            aplicación”.
          </li>
          <li>
            <span className="font-semibold text-white">iPhone / Safari:</span> botón Compartir →
            “Agregar a pantalla de inicio”.
          </li>
          <li>
            <span className="font-semibold text-white">PC:</span> ícono de instalar en la barra de
            direcciones.
          </li>
        </ul>

        <p className="mt-4 border-t border-white/10 pt-4 text-[10px] leading-relaxed text-white/30">
          Para que el navegador habilite la instalación, abrí esta página desde el celular y con
          HTTPS (o localhost).
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full bg-white px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-ink transition hover:bg-white/90"
        >
          Entendido
        </button>
      </div>
    </div>
  )
}

function SupabaseAlert({ error, onRetry }) {
  if (!error) return null
  return (
    <div className="mt-4 border border-white/25 bg-white/5 p-4 text-left">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
        <TriangleAlert size={13} /> No se pudo conectar con Supabase
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-white/55">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 border border-white/25 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition hover:border-white hover:bg-white hover:text-ink"
      >
        Reintentar
      </button>
    </div>
  )
}

export default function AdminPage() {
  const {
    products,
    categories,
    loading,
    error,
    refresh,
    createProduct,
    updateProduct,
    notify,
  } = useStore()
  const { installed, promptInstall } = useInstallPrompt()
  const [authed, setAuthed] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [busy, setBusy] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState('productos')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [installHelp, setInstallHelp] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])

  // Retomamos la sesión de Supabase si el usuario ya se había logueado.
  useEffect(() => {
    let active = true

    const restore = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return
        const admin = await checkIsAdmin()
        if (!active) return
        if (admin) {
          setAuthed(true)
          await refresh()
        } else {
          await signOut()
        }
      } catch {
        // Si no se puede verificar, se muestra el login normalmente.
      } finally {
        if (active) setCheckingSession(false)
      }
    }

    restore()
    return () => {
      active = false
    }
  }, [refresh])

  const handleInstall = async () => {
    if (installed) {
      notify('La app ya está instalada en este dispositivo')
      return
    }
    const result = await promptInstall()
    if (result === 'accepted') notify('Instalando Shadday Panel…')
    else if (result === 'unavailable') setInstallHelp(true)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    if (busy) return

    setBusy(true)
    setLoginError('')

    try {
      await signIn(email, password)

      const admin = await checkIsAdmin()
      if (!admin) {
        await signOut()
        setLoginError(
          'Ese usuario no tiene rol de admin. Agregalo a la tabla admins con el SQL de supabase/schema.sql.',
        )
        return
      }

      await refresh()
      setPassword('')
      setAuthed(true)
    } catch (err) {
      setLoginError(err.message || 'No pudimos iniciar sesión.')
    } finally {
      setBusy(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    setAuthed(false)
    setPassword('')
    setEmail('')
  }

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (product) => {
    setEditing(product)
    setFormOpen(true)
  }

  const handleSubmit = async (payload) => {
    if (editing) {
      await updateProduct({ ...payload, id: editing.id })
    } else {
      await createProduct(payload)
    }
    setFormOpen(false)
    setEditing(null)
  }

  const installOverlay = installHelp ? <InstallHelp onClose={() => setInstallHelp(false)} /> : null

  if (checkingSession) {
    return (
      <div className="grid min-h-screen place-items-center bg-ink text-white">
        <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">Verificando sesión…</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col bg-ink text-white">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Logo className="h-9 w-auto" />
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-[10px] uppercase tracking-[0.18em] text-white/40 transition hover:text-white"
          >
            Volver a la tienda
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-16">
          <div className="w-full max-w-sm">
            <div className="border border-white/10 bg-carbon p-6 sm:p-8">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/35">Acceso interno</p>
              <h1 className="mt-3 text-2xl font-extrabold uppercase tracking-tight">
                Panel de administración
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-white/40">
                Ingresá con tu usuario admin de Supabase para administrar prendas, fotos y
                categorías.
              </p>

              <form onSubmit={handleLogin} className="mt-7">
                <label
                  htmlFor="admin-email"
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45"
                >
                  Correo
                </label>
                <div className="relative mt-2">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setLoginError('')
                    }}
                    placeholder="tu@correo.com"
                    autoFocus
                    autoComplete="username"
                    className="field pl-9"
                  />
                </div>

                <label
                  htmlFor="admin-password"
                  className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45"
                >
                  Contraseña
                </label>
                <div className="relative mt-2">
                  <Lock
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value)
                      setLoginError('')
                    }}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    className="field pl-9 pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center text-white/35 transition hover:text-white"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {loginError && (
                  <p className="anim-shake mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-white/80">
                    <TriangleAlert size={13} className="mt-0.5 shrink-0" /> {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 w-full bg-brand px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.22em] text-ink transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:bg-brand/40"
                >
                  {busy ? 'Ingresando…' : 'Entrar al panel'}
                </button>

                <button
                  type="button"
                  onClick={handleInstall}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 border border-white/15 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70 transition hover:border-white/40 hover:text-white"
                >
                  {installed ? <Check size={14} /> : <Download size={14} />}
                  {installed ? 'App instalada' : 'Instalar app del panel'}
                </button>
              </form>

              <SupabaseAlert error={error} onRetry={() => refresh()} />

              <p className="mt-5 border-t border-white/10 pt-4 text-[10px] leading-relaxed text-white/30">
                El acceso usa los usuarios de Supabase (Authentication → Users). El usuario tiene
                que estar en la tabla <code className="text-white/50">admins</code> para entrar.
              </p>
            </div>

            <p className="mt-5 text-center text-[10px] uppercase tracking-[0.16em] text-white/20">
              Datos guardados en Supabase
            </p>
          </div>
        </div>

        {installOverlay}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo className="h-7 w-auto" />
            <span className="hidden border-l border-white/15 pl-3 text-[9px] uppercase tracking-[0.24em] text-white/40 sm:inline">
              Panel
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-1 hidden items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-white/25 sm:flex">
              <span className="size-1.5 rounded-full bg-brand" />
              Supabase
            </span>
            <button
              type="button"
              onClick={handleInstall}
              className={secondaryButton}
              title="Instalar la app del panel"
            >
              {installed ? <Check size={13} /> : <Download size={13} />}
              <span>{installed ? 'App instalada' : 'Instalar app'}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className={secondaryButton}
            >
              <Store size={13} /> <span className="hidden sm:inline">Ver tienda</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className={secondaryButton}
              aria-label="Cerrar sesión"
            >
              <LogOut size={13} /> <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-7 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
              Shadday Indumentaria
            </p>
            <h1 className="mt-2 text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
              Administrá tu tienda
            </h1>
          </div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">
            {products.length} prendas · {categories.length} categorías
          </p>
        </div>

        <SupabaseAlert error={error} onRetry={() => refresh()} />

        <div className="mt-7 flex gap-1 border-b border-white/10">
          {[
            { id: 'productos', label: 'Productos' },
            { id: 'categorias', label: 'Categorías' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'border-b-2 px-4 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition',
                tab === item.id
                  ? 'border-white text-white'
                  : 'border-transparent text-white/35 hover:text-white/70',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'productos' ? (
            <AdminProducts onEdit={openEdit} onCreate={openCreate} />
          ) : (
            <AdminCategories />
          )}
        </div>

        {loading && (
          <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-white/30">
            Sincronizando catálogo…
          </p>
        )}
      </main>

      {formOpen && (
        <ProductForm
          key={editing?.id || 'new'}
          product={editing}
          categories={categories}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          onSubmit={handleSubmit}
          notify={notify}
        />
      )}

      {installOverlay}
    </div>
  )
}
