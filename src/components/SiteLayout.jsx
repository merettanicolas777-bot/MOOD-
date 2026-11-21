import Navbar from './Navbar'
import Footer from './Footer'
import CartDrawer from './CartDrawer'
import { useStore } from '../context/StoreContext'

export default function SiteLayout({ children }) {
  const { cartOpen, closeCart } = useStore()

  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <main>{children}</main>
      <Footer />
      {cartOpen && <CartDrawer onClose={closeCart} />}
    </div>
  )
}
