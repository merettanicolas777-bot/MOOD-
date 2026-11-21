import { useEffect, useState } from 'react'
import { StoreProvider } from './context/StoreContext'
import StorePage from './pages/StorePage'
import CatalogPage from './pages/CatalogPage'
import UbicacionPage from './pages/UbicacionPage'
import ProductPage from './pages/ProductPage'
import AdminPage from './pages/AdminPage'
import Toast from './components/Toast'

function currentPath() {
  return window.location.pathname.replace(/\/+$/, '') || '/'
}

export default function App() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onPop = () => setPath(currentPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const productMatch = path.match(/^\/producto\/([^/]+)$/)

  let page = <StorePage />
  if (path === '/admin') page = <AdminPage />
  else if (path === '/catalogo') page = <CatalogPage />
  else if (path === '/ubicacion') page = <UbicacionPage />
  else if (productMatch) {
    page = <ProductPage id={decodeURIComponent(productMatch[1])} />
  }

  return (
    <StoreProvider>
      {page}
      <Toast />
    </StoreProvider>
  )
}
