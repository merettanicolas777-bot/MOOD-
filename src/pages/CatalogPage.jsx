import SiteLayout from '../components/SiteLayout'
import PageHeader from '../components/PageHeader'
import Catalog from '../components/Catalog'
import { useStore } from '../context/StoreContext'

export default function CatalogPage() {
  const { products } = useStore()

  return (
    <SiteLayout>
      <PageHeader
        eyebrow="Catálogo · Otoño / Invierno 26"
        title="Catálogo"
        description="Remeras oversize, buzos, cargos y abrigos de tiradas cortas. Filtrá por categoría, talle o precio y armá tu pedido por WhatsApp."
      >
        <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-white/30">
          {products.length} prendas disponibles
        </p>
      </PageHeader>
      <Catalog />
    </SiteLayout>
  )
}
