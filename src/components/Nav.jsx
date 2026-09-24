import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { products } from '../data/products.js'
import { contact, waLink } from '../data/site.js'
import BrandGlow from './BrandGlow.jsx'
import Button from './Button.jsx'
import Logo from './Logo.jsx'
import useTheme from './useTheme.js'

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
  const [dark, toggleTheme] = useTheme()
  const dropdownRef = useRef(null)
  const location = useLocation()

  /* shrink the bar once the page scrolls */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* close everything whenever the route changes — adjusted during render,
     so the menu never paints open on the new page */
  const [lastPath, setLastPath] = useState(location.pathname)
  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setMenuOpen(false)
    setProductsOpen(false)
  }

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

  /* the active page gets the logo's gradient as a short bar under its label */
  const navLinkClass = ({ isActive }) =>
    `relative px-3.5 py-2 text-sm font-semibold transition-colors after:absolute after:inset-x-3.5 after:-bottom-0.5 after:h-0.5 after:rounded-full after:transition-opacity ${
      isActive ? 'text-white after:logo-gradient after:opacity-100' : 'text-white/65 after:opacity-0 hover:text-white'
    }`

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        <header
          className={`logo-border glass mx-auto flex max-w-6xl items-center gap-3 rounded-2xl py-2 pl-2 pr-2 transition-shadow duration-300 sm:pl-2.5 ${
            scrolled ? 'shadow-2xl shadow-black/40' : 'shadow-lg shadow-black/20'
          }`}
        >
          {/* brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="MKLabs home">
            <img
              src="/mklabs-logo-128.webp"
              alt=""
              width={40}
              height={40}
              className="h-10 w-10 rounded-[22%]"
            />
            <span className="text-[17px] font-bold tracking-tight text-white">MKLabs</span>
          </Link>

          {/* desktop links */}
          <nav className="ml-auto hidden items-center gap-0.5 lg:flex" aria-label="Main">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>

            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setProductsOpen((open) => !open)}
                aria-expanded={productsOpen}
                aria-haspopup="true"
                className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold transition-colors hover:text-white ${
                  productsOpen || location.pathname.startsWith('/products') ? 'text-white' : 'text-white/65'
                }`}
              >
                Products
                <Icon name="chevron" className={`h-3.5 w-3.5 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>

              {productsOpen && (
                <div className="logo-border absolute left-1/2 top-full mt-3 w-80 -translate-x-1/2 overflow-hidden rounded-2xl p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl [--fill:rgba(5,4,15,0.96)]">
                  {products.map((product) => (
                    <Link
                      key={product.slug}
                      to={`/products/${product.slug}`}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white/8"
                    >
                      <Logo src={product.logo} size="xs" />
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">{product.name}</span>
                        <span className="block truncate text-xs text-white/50">{product.category}</span>
                      </span>
                    </Link>
                  ))}
                  <div className="mt-1 border-t border-white/10 pt-1">
                    {products
                      .filter((product) => product.site)
                      .map((product) => (
                        <a
                          key={`${product.slug}-site`}
                          href={product.site.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/8"
                        >
                          Visit {product.site.label}
                          <span aria-hidden="true">↗</span>
                        </a>
                      ))}
                    <Link
                      to="/products"
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-white/8"
                    >
                      <span className="logo-gradient-text">View all products</span>
                      <span className="text-magenta" aria-hidden="true">→</span>
                    </Link>
                  </div>
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
          <div className="ml-auto flex items-center gap-1.5 lg:ml-2 lg:border-l lg:border-white/10 lg:pl-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="grid h-11 w-11 place-items-center rounded-xl text-white/80 transition-colors hover:bg-white/8 hover:text-white"
            >
              <Icon name={dark ? 'sun' : 'moon'} className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-xl border border-white/12 text-white transition-colors hover:bg-white/8 lg:hidden"
            >
              <Icon name={menuOpen ? 'close' : 'menu'} className="h-5 w-5" />
            </button>
          </div>
        </header>
      </div>

      {/* mobile sheet */}
      <div
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-void px-6 pb-10 pt-24 text-white transition-transform duration-400 lg:hidden ${
          menuOpen ? 'translate-y-0' : 'pointer-events-none -translate-y-full'
        }`}
        aria-hidden={!menuOpen}
      >
        <BrandGlow />

        <nav className="relative flex flex-col" aria-label="Main">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `flex min-h-[60px] items-center justify-between border-b border-white/10 text-2xl font-semibold ${
                  isActive ? 'text-white' : 'text-white/75'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'logo-gradient-text' : ''}>{link.label}</span>
                  <span className="text-white/30" aria-hidden="true">→</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="relative mt-7">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">Our products</div>
          <div className="mt-3 grid gap-2">
            {products.map((product) => (
              <Link
                key={product.slug}
                to={`/products/${product.slug}`}
                onClick={() => setMenuOpen(false)}
                aria-label={`${product.name} — ${product.category}`}
                className="flex min-h-[60px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4"
              >
                <Logo src={product.logo} size="sm" />
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold">{product.name}</span>
                  <span className="block truncate text-xs text-white/50">{product.category}</span>
                </span>
              </Link>
            ))}
            {products
              .filter((product) => product.site)
              .map((product) => (
                <a
                  key={`${product.slug}-site`}
                  href={product.site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="logo-border flex min-h-[52px] items-center justify-between rounded-2xl px-4 text-[15px] font-semibold [--fill:rgba(5,4,15,0.6)]"
                >
                  Visit {product.site.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
          </div>
        </div>

        <div className="relative mt-7 grid gap-2.5">
          <Button href={waLink('Hello MKLabs!')} variant="whatsapp">
            💬 WhatsApp {contact.phones[0].label}
          </Button>
          <Button href={`mailto:${contact.emails[0].address}`} variant="glass">
            ✉️ {contact.emails[0].address}
          </Button>
        </div>
      </div>
    </>
  )
}

/** Line icons for the bar — crisper than emoji, and they take the text colour. */
function Icon({ name, className = '' }) {
  const paths = {
    chevron: <path d="m6 9 6 6 6-6" />,
    menu: <path d="M4 7h16M4 12h16M4 17h10" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
