import SiteLayout from '../components/SiteLayout'
import Hero from '../components/Hero'
import NewArrivals from '../components/NewArrivals'
import LocalTeaser from '../components/LocalTeaser'
import { useStore } from '../context/StoreContext'
import { navigate } from '../lib/router'

export default function StorePage() {
  const { setSearch, setNewOnly } = useStore()

  const goCatalog = (arrivals) => {
    setSearch('')
    setNewOnly(Boolean(arrivals))
    navigate('/catalogo')
  }

  return (
    <SiteLayout>
      <Hero onShop={() => goCatalog(false)} onVisit={() => navigate('/ubicacion')} />
      <NewArrivals />
      <LocalTeaser />
    </SiteLayout>
  )
}
