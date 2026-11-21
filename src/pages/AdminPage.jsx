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
  'inline-flex items-center gap-2 rounded-full border border-line px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-muted transition hover:border-ink/40 hover:text-ink'

function InstallHelp({ onClose }) {
  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Cerrar ayuda de instalación"
        onClick={onClose}
        className="anim-fade absolute inset-0 cursor-default bg-ink/40 backdrop-blur-sm"
      />
      <div className="anim-rise relative w-full max-w-md rounded-2xl border border-line bg-white p-6 text-ink shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-muted">Shadday Panel</p>
            <h2 className="mt-2 font-serif text-xl">Instalar la app</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full border border-line text-muted transition hover:border-ink hover:text-ink"
            aria-label="Cerrar"
          >
            <X size={15} />
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          El navegador todavía no habilitó la instalación automática. Podés agregar el panel a tu
          pantalla de inicio manualmente:
        </p>

        <ul className="mt-4 space-y-3 text-xs leading-relaxed text-muted">
          <li>
            <span className="font-semibold text-ink">Android / Chrome:</span> menú ⋮ → “Instalar
            aplicación”.
          </li>
          <li>
            <span className="font-semibold text-ink">iPhone / Safari:</span> botón Compartir →
            “Agregar a pantalla de inicio”.
          </li>
          <li>
            <span className="font-semibold text-ink">PC:</span> ícono de instalar en la barra de
            direcciones.
          </li>
        </ul>

        <p className="mt-4 border-t border-line pt-4 text-[10px] leading-relaxed text-muted">
          Para que el navegador habilite la instalación, abrí esta página desde el celular y con
          HTTPS (o localhost).
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-full bg-ink px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-ink/85"
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
    <div className="mt-4 rounded-2xl border border-brand bg-brand/20 p-4 text-left text-ink">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em]">
        <TriangleAlert size={13} /> No se pudo conectar con Supabase
      </p>
      <p className="mt-2 text-[11px] leading-relaxed text-ink/70">{error}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-3 rounded-full border border-ink/25 px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] transition hover:bg-ink hover:text-white"
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
  const [authed, setAuthed] = useState(true)
  const [checkingSession, setCheckingSession] = useState(false)
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
      <div className="grid min-h-screen place-items-center bg-cream text-ink">
        <p className="text-[10px] uppercase tracking-[0.24em] text-muted">Verificando sesión…</p>
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col bg-cream text-ink">
        <div className="flex items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-2.5">
            <Logo className="h-11 w-11" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="font-serif text-base tracking-[0.16em]">SHADDAY</span>
              <span className="mt-1 text-[8px] uppercase tracking-[0.3em] text-muted">Panel</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-[10px] uppercase tracking-[0.18em] text-muted transition hover:text-ink"
          >
            Volver a la tienda
          </button>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-16">
          <div className="w-full max-w-sm">
            <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
              <p className="text-[9px] uppercase tracking-[0.3em] text-muted">Acceso interno</p>
              <h1 className="mt-3 font-serif text-2xl leading-tight sm:text-3xl">
                Panel de administración
              </h1>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Ingresá con tu usuario admin de Supabase para administrar prendas, fotos y
                categorías.
              </p>

              <form onSubmit={handleLogin} className="mt-7">
                <label
                  htmlFor="admin-email"
                  className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted"
                >
                  Correo
                </label>
                <div className="relative mt-2">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
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
                  className="mt-4 block text-[10px] font-semibold uppercase tracking-[0.2em] text-muted"
                >
                  Contraseña
                </label>
                <div className="relative mt-2">
                  <Lock
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
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
                    className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted transition hover:text-ink"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {loginError && (
                  <p className="anim-shake mt-3 flex items-start gap-2 rounded-xl bg-brand/20 px-3 py-2 text-[11px] leading-relaxed text-ink">
                    <TriangleAlert size={13} className="mt-0.5 shrink-0" /> {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 w-full rounded-full bg-ink px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-ink/40"
                >
                  {busy ? 'Ingresando…' : 'Entrar al panel'}
                </button>

                <button
                  type="button"
                  onClick={handleInstall}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-full border border-line px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted transition hover:border-ink/40 hover:text-ink"
                >
                  {installed ? <Check size={14} /> : <Download size={14} />}
                  {installed ? 'App instalada' : 'Instalar app del panel'}
                </button>
              </form>

              <SupabaseAlert error={error} onRetry={() => refresh()} />

              <p className="mt-5 border-t border-line pt-4 text-[10px] leading-relaxed text-muted">
                El acceso usa los usuarios de Supabase (Authentication → Users). El usuario tiene
                que estar en la tabla{' '}
                <code className="rounded bg-mist px-1 py-0.5 text-ink/80">admins</code> para entrar.
              </p>
            </div>

            <p className="mt-5 text-center text-[10px] uppercase tracking-[0.18em] text-muted/70">
              Shadday Indumentaria · Resistencia
            </p>
          </div>
        </div>

        {installOverlay}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <span className="hidden border-l border-line pl-3 text-[9px] uppercase tracking-[0.24em] text-muted sm:inline">
              Panel
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="mr-1 hidden items-center gap-1.5 text-[9px] uppercase tracking-[0.14em] text-muted sm:flex">
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
              <span className="hidden sm:inline">{installed ? 'App instalada' : 'Instalar app'}</span>
            </button>
            <button type="button" onClick={() => navigate('/')} className={secondaryButton}>
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
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted">
              Shadday Indumentaria
            </p>
            <h1 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
              Administrá tu tienda
            </h1>
          </div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
            {products.length} prendas · {categories.length} categorías
          </p>
        </div>

        <SupabaseAlert error={error} onRetry={() => refresh()} />

        <div className="mt-7 flex gap-1 border-b border-line">
          {[
            { id: 'productos', label: 'Productos' },
            { id: 'categorias', label: 'Categorías' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                'border-b-2 px-4 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition',
                tab === item.id
                  ? 'border-brand text-ink'
                  : 'border-transparent text-muted hover:text-ink',
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
          <p className="mt-6 text-[10px] uppercase tracking-[0.16em] text-muted">
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
