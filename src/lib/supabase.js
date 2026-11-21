// Cliente Supabase.
//
// Los valores de respaldo son la URL del proyecto y la clave pública
// ("publishable"), que por diseño viajan al navegador. Así el panel funciona en
// Vercel aunque no haya variables de entorno cargadas.
import { SUPABASE_ANON_KEY, SUPABASE_URL } from './supabaseConfig'

const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

const url = envUrl || SUPABASE_URL
const anonKey = envKey || SUPABASE_ANON_KEY

export const isSupabaseEnabled = Boolean(url && anonKey)
export const PRODUCTS_TABLE = 'products'
export const BUCKET = 'product-images'

let clientPromise = null

export function getSupabase() {
  if (!isSupabaseEnabled) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      }),
    )
  }
  return clientPromise
}
