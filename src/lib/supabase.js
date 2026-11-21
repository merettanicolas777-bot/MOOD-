// Cliente Supabase opcional.
// Si no hay credenciales en el entorno, `getSupabase()` devuelve null y la app
// usa la capa local (localStorage) definida en `lib/api.js`.
const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

export const isSupabaseEnabled = Boolean(url && anonKey)
export const PRODUCTS_TABLE = 'products'
export const BUCKET = 'product-images'

let clientPromise = null

export function getSupabase() {
  if (!isSupabaseEnabled) return Promise.resolve(null)
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      createClient(url, anonKey),
    )
  }
  return clientPromise
}
