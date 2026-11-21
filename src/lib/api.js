// Capa de datos de Mood Indumentaria: todo el catálogo vive en Supabase
// (tabla `products`, tabla `categories` y bucket `product-images`).
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../data/seed'
import { BUCKET, PRODUCTS_TABLE, getSupabase } from './supabase'

export const storageMode = 'supabase'

const SETUP_HINT =
  'Supabase rechazó la operación por permisos. Abrí el SQL Editor del proyecto y ejecutá el archivo supabase/schema.sql.'

export function toMessage(error) {
  const message = error?.message || String(error || '')
  if (/permission denied|42501|row-level security|violates row-level/i.test(message)) {
    return SETUP_HINT
  }
  if (/does not exist|42P01|schema cache/i.test(message)) {
    return 'Faltan las tablas en Supabase. Ejecutá supabase/schema.sql en el SQL Editor del proyecto.'
  }
  if (/No API key|Invalid API key|JWT|401/i.test(message)) {
    return 'La clave pública de Supabase no es válida. Revisá VITE_SUPABASE_ANON_KEY.'
  }
  if (/Failed to fetch|NetworkError|network|fetch failed/i.test(message)) {
    return 'No pudimos conectar con Supabase. Revisá la conexión a internet y volvé a intentar.'
  }
  return message || 'Error inesperado de Supabase.'
}

async function db() {
  const supabase = await getSupabase()
  if (!supabase) {
    throw new Error(
      'Falta configurar Supabase. Definí VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY.',
    )
  }
  return supabase
}

function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price) || 0,
    category: row.category || '',
    description: row.description || '',
    fabric: row.fabric || '',
    fit: row.fit || '',
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    images: Array.isArray(row.images) ? row.images : [],
    inStock: Boolean(row.in_stock),
    featured: Boolean(row.featured),
    isNew: Boolean(row.is_new),
    createdAt: row.created_at || new Date().toISOString(),
  }
}

function toRow(product) {
  return {
    name: product.name,
    price: Number(product.price) || 0,
    category: product.category,
    description: product.description || '',
    fabric: product.fabric || '',
    fit: product.fit || '',
    sizes: product.sizes || [],
    images: product.images || [],
    in_stock: product.inStock !== false,
    featured: Boolean(product.featured),
    is_new: Boolean(product.isNew),
  }
}

export async function loadCatalog() {
  const supabase = await db()

  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from(PRODUCTS_TABLE).select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name', { ascending: true }),
  ])

  if (productsRes.error) throw new Error(toMessage(productsRes.error))

  let products = (productsRes.data || []).map(fromRow)

  // Primera vez: cargamos el catálogo inicial en Supabase.
  if (!products.length) {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert(SEED_PRODUCTS.map(toRow))
      .select()
    if (error) throw new Error(toMessage(error))
    products = (data || []).map(fromRow)
  }

  let categories = (categoriesRes.data || []).map((row) => row.name)

  if (!categories.length) {
    categories = SEED_CATEGORIES
    const { error } = await supabase
      .from('categories')
      .insert(categories.map((name) => ({ name })))
    if (error && error.code !== '23505') throw new Error(toMessage(error))
  }

  return { products, categories }
}

export async function saveProduct(product) {
  const supabase = await db()

  if (product.id) {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .update(toRow(product))
      .eq('id', product.id)
      .select()
      .single()
    if (error) throw new Error(toMessage(error))
    return fromRow(data)
  }

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert(toRow(product))
    .select()
    .single()
  if (error) throw new Error(toMessage(error))
  return fromRow(data)
}

export async function deleteProduct(id) {
  const supabase = await db()
  const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq('id', id)
  if (error) throw new Error(toMessage(error))
}

export async function addCategory(name) {
  const clean = String(name || '').trim()
  if (!clean) throw new Error('Escribí un nombre de categoría')

  const supabase = await db()
  const { error } = await supabase.from('categories').insert({ name: clean })
  if (error) {
    if (error.code === '23505') throw new Error('Esa categoría ya existe')
    throw new Error(toMessage(error))
  }
  return clean
}

export async function removeCategory(name) {
  const supabase = await db()
  const { error } = await supabase.from('categories').delete().eq('name', name)
  if (error) throw new Error(toMessage(error))
  return name
}

export async function uploadImage(file) {
  const supabase = await db()

  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension || 'jpg'}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
    cacheControl: '31536000',
  })
  if (error) throw new Error(toMessage(error))

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
