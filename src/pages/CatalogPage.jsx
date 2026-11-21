import SiteLayout from '../components/SiteLayout'
import PageHeader from '../components/PageHeader'
import Catalog from '../components/Catalog'
import { useStore } from '../context/StoreContext'

export default function CatalogPage() {
  const { products } = useStore()

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Nueva temporada"
        title="Catálogo"
        description="Vestidos, conjuntos, tops, jeans, abrigos y accesorios seleccionados uno por uno. Filtrá por categoría, talle o precio y armá tu pedido por WhatsApp."
      >
        <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-muted">
          {products.length} prendas disponibles
        </p>
      </PageHeader>
      <Catalog />
    </SiteLayout>
  )
}
