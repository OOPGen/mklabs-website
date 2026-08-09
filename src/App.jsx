import { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Nav from './components/Nav.jsx'
import PosNav from './components/PosNav.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'

import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import PosLanding from './pages/PosLanding.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Admin from './pages/Admin.jsx'
import NotFound from './pages/NotFound.jsx'

/**
 * pos.mklabs.co.zw serves the POS landing page from its own root.
 * Same deployment, same code — Cloudflare Pages points both custom domains at
 * this project and the hostname decides which site a visitor gets.
 */
const isPosHost =
  typeof window !== 'undefined' && /^pos\./i.test(window.location.hostname)

/** Every route change starts at the top of the new page. */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return null
}

function PosSite() {
  return (
    <>
      <PosNav />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<PosLanding />} />
          <Route path="/contact" element={<Contact />} />
          {/* the POS site has no other pages — send strays to the pitch */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}

function MainSite() {
  return (
    <>
      <Nav />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          {/* the POS landing is reachable here too, so it can be previewed
              without the subdomain */}
          <Route path="/pos" element={<PosLanding />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      {isPosHost ? <PosSite /> : <MainSite />}
      <Footer />
      <WhatsAppFab />
    </>
  )
}
