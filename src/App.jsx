import { Suspense, lazy, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

import Nav from './components/Nav.jsx'
import PosNav from './components/PosNav.jsx'
import Footer from './components/Footer.jsx'
import WhatsAppFab from './components/WhatsAppFab.jsx'
import useSeo from './components/useSeo.js'

import Home from './pages/Home.jsx'
import Products from './pages/Products.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'

/**
 * pos.mklabs.co.zw serves the POS landing page from its own root.
 * Same deployment, same code — Cloudflare Pages points both custom domains at
 * this project and the hostname decides which site a visitor gets.
 */
const isPosHost =
  typeof window !== 'undefined' && /^pos\./i.test(window.location.hostname)

/*
 * Split out of the main bundle: most visitors to mklabs.co.zw never open the
 * POS pitch or the dashboard. On the POS host the pitch *is* the home page,
 * so its download starts immediately, in parallel with the main bundle
 * (the prerendered pos.html and admin.html also preload their own chunk).
 */
const loadPosLanding = () => import('./pages/PosLanding.jsx')
const PosLanding = lazy(loadPosLanding)
const Admin = lazy(() => import('./pages/Admin.jsx'))
if (isPosHost) loadPosLanding()

/** Holds the POS pitch's full-height dark hero while it downloads — no flash of footer. */
const PosLoading = () => <div className="min-h-[100svh] bg-night" aria-busy="true" />

/** Same size as the dashboard's own loading state, so the swap does not shift the page. */
const AdminLoading = () => (
  <p className="px-5 py-24 text-center text-night/60 dark:text-lavender/60" aria-busy="true">
    Loading your promotions…
  </p>
)

/**
 * Every route change starts at the top of the new page, with its own title and
 * tags — unless the link names a section (/#services), which is scrolled to.
 */
function RouteEffects() {
  const { pathname, hash } = useLocation()
  useSeo(pathname, { posHost: isPosHost })

  useEffect(() => {
    const target = hash && document.getElementById(decodeURIComponent(hash.slice(1)))
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname, hash])

  return null
}

function PosSite() {
  return (
    <>
      <PosNav />
      {/* no blanket top padding here: the landing hero runs full-bleed beneath
          the floating header and clears it itself. Pages that are not the
          landing still need the gap. */}
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<PosLoading />}>
                <PosLanding />
              </Suspense>
            }
          />
          <Route path="/contact" element={<div className="pt-20"><Contact /></div>} />
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
              without the subdomain. The negative margin cancels the padding
              above, so the preview matches what pos.mklabs.co.zw serves. */}
          <Route
            path="/pos"
            element={
              <div className="-mt-20">
                <Suspense fallback={<PosLoading />}>
                  <PosLanding />
                </Suspense>
              </div>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
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
      {isPosHost ? <PosSite /> : <MainSite />}
      <Footer />
      <WhatsAppFab />
    </>
  )
}
