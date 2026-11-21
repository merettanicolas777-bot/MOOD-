// Autenticación del panel con Supabase Auth.
// El acceso no depende de variables de Vite: se usan los usuarios creados en
// Supabase (Authentication → Users) que además tengan rol de admin.
import { getSupabase } from './supabase'

const AUTH_ERRORS = {
  'invalid login credentials': 'Correo o contraseña incorrectos.',
  'email not confirmed':
    'Ese usuario todavía no confirmó el correo. Confirmalo en Supabase → Authentication → Users.',
  'user not found': 'No existe un usuario con ese correo en Supabase.',
  'signup is disabled': 'El registro está deshabilitado. El usuario se crea desde Supabase.',
}

function translateAuthError(message = '') {
  const key = Object.keys(AUTH_ERRORS).find((item) => message.toLowerCase().includes(item))
  if (key) return AUTH_ERRORS[key]
  if (/failed to fetch|network/i.test(message)) {
    return 'No pudimos conectar con Supabase. Revisá la conexión e intentá de nuevo.'
  }
  return message || 'No pudimos iniciar sesión.'
}

async function client() {
  const supabase = await getSupabase()
  if (!supabase) throw new Error('Falta configurar Supabase.')
  return supabase
}

export async function getCurrentUser() {
  const supabase = await getSupabase()
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session?.user || null
}

export async function signIn(email, password) {
  const supabase = await client()
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
  if (error) throw new Error(translateAuthError(error.message))
  return data.user
}

export async function signOut() {
  const supabase = await getSupabase()
  if (!supabase) return
  await supabase.auth.signOut()
}

// La función `is_admin()` vive en la base (ver supabase/schema.sql) y responde
// según la tabla `admins`, así el rol no se puede falsear desde el navegador.
export async function checkIsAdmin() {
  const supabase = await client()
  const { data, error } = await supabase.rpc('is_admin')
  if (error) {
    if (error.code === 'PGRST202' || /could not find the function/i.test(error.message)) {
      throw new Error(
        'Falta el rol de admin en Supabase. Ejecutá supabase/schema.sql en el SQL Editor del proyecto.',
      )
    }
    return false
  }
  return Boolean(data)
}
