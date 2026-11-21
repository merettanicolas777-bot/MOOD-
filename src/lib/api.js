// Capa de datos de Mood Indumentaria.
//
// - Con VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY configuradas, todo se guarda
//   en Supabase (tabla `products` y bucket `product-images`).
// - Sin credenciales, funciona 100% con localStorage para que la demo arranque
//   sola. La interfaz pública es la misma en ambos modos.
import { SEED_CATEGORIES, SEED_PRODUCTS } from '../data/seed'
import { BUCKET, PRODUCTS_TABLE, getSupabase, isSupabaseEnabled } from './supabase'
import { fileToDataUrl } from './image'

const PRODUCTS_KEY = 'mood:products:v1'
const CATEGORIES_KEY = 'mood:categories:v1'

export const storageMode = isSupabaseEnabled ? 'supabase' : 'local'

function readLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function writeLocal(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
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

function seedLocalIfNeeded() {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    writeLocal(PRODUCTS_KEY, SEED_PRODUCTS)
  }
  if (!localStorage.getItem(CATEGORIES_KEY)) {
    writeLocal(CATEGORIES_KEY, SEED_CATEGORIES)
  }
}

export async function loadCatalog() {
  const supabase = await getSupabase()

  if (!supabase) {
    seedLocalIfNeeded()
    const products = readLocal(PRODUCTS_KEY, SEED_PRODUCTS)
    const categories = readLocal(CATEGORIES_KEY, SEED_CATEGORIES)
    return {
      products: [...products].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
      categories,
    }
  }

  const [productsRes, categoriesRes] = await Promise.all([
    supabase.from(PRODUCTS_TABLE).select('*').order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name', { ascending: true }),
  ])

  if (productsRes.error) throw new Error(productsRes.error.message)

  let products = (productsRes.data || []).map(fromRow)

  if (!products.length) {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .insert(SEED_PRODUCTS.map(toRow))
      .select()
    if (error) throw new Error(error.message)
    products = (data || []).map(fromRow)
  }

  let categories = (categoriesRes.data || []).map((row) => row.name)
  if (!categories.length) {
    categories = SEED_CATEGORIES
    await supabase
      .from('categories')
      .insert(categories.map((name) => ({ name })))
      .select()
  }

  return { products, categories }
}

export async function saveProduct(product) {
  const supabase = await getSupabase()

  if (!supabase) {
    seedLocalIfNeeded()
    const products = readLocal(PRODUCTS_KEY, SEED_PRODUCTS)
    const existing = product.id ? products.find((p) => p.id === product.id) : null

    if (existing) {
      const updated = { ...existing, ...product }
      writeLocal(
        PRODUCTS_KEY,
        products.map((p) => (p.id === product.id ? updated : p)),
      )
      return updated
    }

    const created = {
      ...product,
      id: product.id || crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    writeLocal(PRODUCTS_KEY, [created, ...products])
    return created
  }

  if (product.id) {
    const { data, error } = await supabase
      .from(PRODUCTS_TABLE)
      .update(toRow(product))
      .eq('id', product.id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return fromRow(data)
  }

  const { data, error } = await supabase
    .from(PRODUCTS_TABLE)
    .insert(toRow(product))
    .select()
    .single()
  if (error) throw new Error(error.message)
  return fromRow(data)
}

export async function deleteProduct(id) {
  const supabase = await getSupabase()

  if (!supabase) {
    const products = readLocal(PRODUCTS_KEY, SEED_PRODUCTS)
    writeLocal(
      PRODUCTS_KEY,
      products.filter((p) => p.id !== id),
    )
    return
  }

  const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function addCategory(name) {
  const clean = String(name || '').trim()
  if (!clean) throw new Error('Escribí un nombre de categoría')

  const supabase = await getSupabase()
  if (!supabase) {
    seedLocalIfNeeded()
    const categories = readLocal(CATEGORIES_KEY, SEED_CATEGORIES)
    if (categories.some((c) => c.toLowerCase() === clean.toLowerCase())) {
      throw new Error('Esa categoría ya existe')
    }
    writeLocal(CATEGORIES_KEY, [...categories, clean])
    return [...categories, clean]
  }

  const { error } = await supabase.from('categories').insert({ name: clean })
  if (error) throw new Error(error.message)
  return clean
}

export async function removeCategory(name) {
  const supabase = await getSupabase()

  if (!supabase) {
    seedLocalIfNeeded()
    const categories = readLocal(CATEGORIES_KEY, SEED_CATEGORIES)
    const next = categories.filter((c) => c !== name)
    writeLocal(CATEGORIES_KEY, next)
    return next
  }

  const { error } = await supabase.from('categories').delete().eq('name', name)
  if (error) throw new Error(error.message)
  return name
}

export async function uploadImage(file) {
  const supabase = await getSupabase()
  const dataUrl = await fileToDataUrl(file)

  if (!supabase) return dataUrl

  const blob = await (await fetch(dataUrl)).blob()
  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, {
    contentType: file.type || 'image/jpeg',
    upsert: false,
  })
  if (error) throw new Error(error.message)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
