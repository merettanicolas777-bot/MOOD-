import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as api from '../lib/api'

const StoreContext = createContext(null)
const CART_KEY = 'mood:cart:v1'

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cart, setCart] = useState(readCart)
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  // Estado de navegación / UI de la tienda
  const [search, setSearch] = useState('')
  const [newOnly, setNewOnly] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const notify = useCallback((message, tone = 'success') => {
    setToast({ id: Date.now(), message, tone })
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const data = await api.loadCatalog()
      setProducts(data.products)
      setCategories(data.categories)
      setError('')
    } catch (err) {
      setError(err.message || 'No pudimos cargar el catálogo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  useEffect(() => () => clearTimeout(timer.current), [])

  const addToCart = (product, size, qty = 1) => {
    const key = `${product.id}::${size}`
    setCart((prev) => {
      const found = prev.find((item) => item.key === key)
      if (found) {
        return prev.map((item) =>
          item.key === key ? { ...item, qty: item.qty + qty } : item,
        )
      }
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || '',
          size,
          qty,
        },
      ]
    })
  }

  const setQty = (key, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((item) => item.key !== key)
        : prev.map((item) => (item.key === key ? { ...item, qty } : item)),
    )
  }

  const removeFromCart = (key) =>
    setCart((prev) => prev.filter((item) => item.key !== key))

  const clearCart = () => setCart([])

  const openCart = () => setCartOpen(true)
  const closeCart = () => setCartOpen(false)

  const createProduct = async (draft) => {
    try {
      const saved = await api.saveProduct(draft)
      await refresh(true)
      notify('Producto publicado')
      return saved
    } catch (err) {
      notify(err.message || 'No pudimos guardar el producto', 'error')
      throw err
    }
  }

  const updateProduct = async (product) => {
    try {
      const saved = await api.saveProduct(product)
      await refresh(true)
      notify('Cambios guardados')
      return saved
    } catch (err) {
      notify(err.message || 'No pudimos guardar los cambios', 'error')
      throw err
    }
  }

  const deleteProduct = async (id) => {
    try {
      await api.deleteProduct(id)
      setCart((prev) => prev.filter((item) => item.productId !== id))
      await refresh(true)
      notify('Producto eliminado')
    } catch (err) {
      notify(err.message || 'No pudimos eliminar el producto', 'error')
      throw err
    }
  }

  const createCategory = async (name) => {
    try {
      await api.addCategory(name)
      await refresh(true)
      notify('Categoría agregada')
    } catch (err) {
      notify(err.message || 'No pudimos agregar la categoría', 'error')
      throw err
    }
  }

  const deleteCategory = async (name) => {
    try {
      await api.removeCategory(name)
      await refresh(true)
      notify('Categoría eliminada')
    } catch (err) {
      notify(err.message || 'No pudimos eliminar la categoría', 'error')
      throw err
    }
  }

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

  const value = {
    products,
    categories,
    loading,
    error,
    refresh,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    createProduct,
    updateProduct,
    deleteProduct,
    createCategory,
    deleteCategory,
    notify,
    toast,
    search,
    setSearch,
    newOnly,
    setNewOnly,
    cartOpen,
    openCart,
    closeCart,
    storageMode: api.storageMode,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore debe usarse dentro de StoreProvider')
  return context
}
