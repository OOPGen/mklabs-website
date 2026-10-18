import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Nav from './components/Nav.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'
import useSeo from './components/useSeo.js'
import { retiredProducts } from './data/products.js'
import { trackPageView } from './analytics.js'

import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Portfolio from './pages/Portfolio.jsx'

/* Split out of the main bundle: most visitors never open the dashboard. */
const Admin = lazy(() => import('./pages/Admin.jsx'))

/** Same size as the dashboard's own loading state, so the swap does not shift the page. */
const AdminLoading = () => (
  <p className="flex min-h-[70svh] items-center justify-center px-5 py-24 text-center text-night/60 dark:text-lavender/60" aria-busy="true">
    Loading your promotions…
  </p>
)

/**
 * Every route change starts at the top of the new page, with its own title and
 * tags — unless the link names a section (/#services), which is scrolled to.
 */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useSeo(pathname)
  // after useSeo, so the page view carries the new page's title
  useEffect(() => trackPageView(), [pathname])

  useEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
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
          {/* pages that moved: the old POS pitch and the products before MKLabs
              Core ERP. public/_redirects answers these with a 301 for anyone
              arriving from outside; these catch links inside the app. */}
          <Route path="/pos" element={<Navigate to="/products/pos" replace />} />
          {Object.entries(retiredProducts).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/michael" element={<Portfolio />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<AdminLoading />}>
                <Admin />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <MainSite />
      <Footer />
      <WhatsAppFab />
    </>
  )
}
