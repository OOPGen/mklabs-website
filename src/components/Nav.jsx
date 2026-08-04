import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { products } from '../data/products.js'
import { contact, waLink } from '../data/site.js'
import Button from './Button.jsx'
import Logo from './Logo.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [productsOpen, setProductsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dark, setDark] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  /* restore theme */
  useEffect(() => {
    const saved = localStorage.getItem('mklabs-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = saved ? saved === 'dark' : prefersDark
    setDark(isDark)
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  function toggleTheme() {
    setDark((previous) => {
      const next = !previous
      document.documentElement.classList.toggle('dark', next)
      localStorage.setItem('mklabs-theme', next ? 'dark' : 'light')
      return next
    })
  }

  /* shrink the bar once the page scrolls */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* close everything whenever the route changes */
  useEffect(() => {
    setMenuOpen(false)
    setProductsOpen(false)
  }, [location.pathname])

  /* lock body scroll while the mobile sheet is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  /* escape closes, outside click closes the products dropdown */
  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setProductsOpen(false)
      }
    }
    function onPointerDown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProductsOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [])

  const navLinkClass = ({ isActive }) =>
    `px-3.5 py-2 rounded-full text-sm font-semibold transition-colors ${
      isActive ? 'text-white bg-white/15' : 'text-white/75 hover:text-white'
    }`

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        <header
          className={`glass mx-auto flex max-w-6xl items-center gap-3 rounded-full border border-white/12 bg-night/85 px-3 py-2.5 transition-shadow duration-300 ${
            scrolled ? 'shadow-2xl shadow-black/30' : ''
          }`}
        >
          {/* brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5 pl-1.5" aria-label="MKLabs home">
            <Logo src="/logo-mklabs.png" alt="MKLabs" size="xs" tone="dark" />
            <span className="hidden text-[15px] font-bold text-white sm:block">MKLabs</span>
          </Link>

          {/* desktop links */}
          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setProductsOpen((open) => !open)}
                aria-expanded={productsOpen}
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
              >
                Products
                <span className={`text-[10px] transition-transform ${productsOpen ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {productsOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-white/12 bg-night/95 p-1.5 shadow-2xl backdrop-blur-xl">
                  {products.map((product) => (
                    <Link
                      key={product.slug}
                      to={`/products/${product.slug}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/10"
                    >
                      <Logo src={product.logo} size="xs" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">{product.name}</span>
                        <span className="block truncate text-xs text-white/55">{product.category}</span>
                      </span>
                    </Link>
                  ))}
                  <Link
                    to="/products"
                    className="mt-1 block rounded-xl px-3 py-2.5 text-sm font-semibold text-lilac transition-colors hover:bg-white/10"
                  >
                    View all products →
                  </Link>
                </div>
              )}
            </div>

            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* actions */}
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-base text-white transition-colors hover:bg-white/15"
            >
              {dark ? '☀️' : '🌙'}
            </button>

            <Button
              href={waLink('Hello MKLabs! I would like to talk about a project.')}
              variant="whatsapp"
              className="hidden !min-h-[44px] !px-5 !text-sm sm:inline-flex"
            >
              💬 WhatsApp
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-lg text-white transition-colors hover:bg-white/15 lg:hidden"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>
      </div>

      {/* mobile sheet */}
      <div
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night/98 px-6 pb-10 pt-24 text-white backdrop-blur-xl transition-transform duration-400 lg:hidden ${
          menuOpen ? 'translate-y-0' : 'pointer-events-none -translate-y-full'
        }`}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[60px] items-center justify-between border-b border-white/10 text-2xl font-semibold"
            >
              {link.label}
              <span className="text-white/35">→</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-7">
          <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Our products</div>
          <div className="mt-3 grid gap-2">
            {products.map((product) => (
              <Link
                key={product.slug}
                to={`/products/${product.slug}`}
                onClick={() => setMenuOpen(false)}
                aria-label={`${product.name} — ${product.category}`}
                className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4"
              >
                <Logo src={product.logo} size="sm" />
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold">{product.name}</span>
                  <span className="block truncate text-xs text-white/50">{product.category}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-7 grid gap-2.5">
          <Button href={waLink('Hello MKLabs!')} variant="whatsapp">
            💬 WhatsApp {contact.phones[0].label}
          </Button>
          <Button href={`mailto:${contact.emails[0].address}`} variant="ghost" className="!text-white !border-white/25">
            ✉️ {contact.emails[0].address}
          </Button>
        </div>
      </div>
    </>
  )
}
