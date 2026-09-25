import { useEffect, useState } from 'react'
import { getProduct } from '../data/products.js'
import { contact, site, waLink } from '../data/site.js'
import Button from './Button.jsx'
import Logo from './Logo.jsx'

/**
 * Header for the POS landing site.
 *
 * Bare over the hero — the artwork behind it is the point — and it collects
 * itself into a glass pill once the page scrolls onto the pale sections, where
 * white text on nothing would be unreadable.
 *
 * Deliberately not the main MKLabs nav: a visitor who arrived at
 * pos.mklabs.co.zw is here for one product, so the links are the sections of
 * this page plus a quiet way back to the parent company.
 */

const links = [
  { href: '#top', label: 'Home' },
  { href: '#features', label: 'Features' },
  { href: '#why', label: 'Why us' },
  { href: '#demo', label: 'Contact' },
]

/** The little 2×2 grid mark that opens the link group. */
function GridMark({ className = '' }) {
  return (
    <svg viewBox="0 0 16 16" className={`h-3.5 w-3.5 ${className}`} aria-hidden="true">
      {[
        [2, 2],
        [9, 2],
        [2, 9],
        [9, 9],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="5" height="5" rx="1.4" fill="currentColor" />
      ))}
    </svg>
  )
}

export default function PosNav() {
  const pos = getProduct('pos')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  /* the bar only needs a background once it leaves the dark hero */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* lock body scroll while the mobile sheet is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
        <header
          className={`relative mx-auto flex max-w-6xl items-center gap-3 rounded-full px-3 py-2.5 transition-colors duration-300 ${
            scrolled ? 'glass border border-white/12 bg-night/85 shadow-2xl shadow-black/30' : 'border border-transparent'
          }`}
        >
          {/* brand */}
          <a href="#top" className="flex min-h-[44px] shrink-0 items-center gap-2.5" aria-label="MKLabs POS home">
            <Logo src={pos.logo} alt="MKLabs POS" size="xs" loading="eager" />
            <span className="text-[15px] font-bold text-white">
              MKLabs <span className="text-lilac">POS</span>
            </span>
          </a>

          {/* centre link group — floated dead centre, independent of the
              brand and button widths on either side */}
          <nav
            className="glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full border border-white/12 bg-white/8 px-1.5 py-1 lg:flex"
            aria-label="Sections"
          >
            <span className="grid h-11 w-11 place-items-center rounded-full bg-white/12 text-lilac">
              <GridMark />
            </span>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex min-h-[44px] items-center rounded-full px-3.5 text-sm font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* actions */}
          <div className="ml-auto flex items-center gap-2">
            <a
              href={`https://${site.domain}`}
              className="hidden min-h-[44px] items-center rounded-full px-3.5 text-sm font-semibold text-white/60 transition-colors hover:text-white sm:flex lg:hidden xl:flex"
            >
              MKLabs ↗
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-lg text-white transition-colors hover:bg-white/15 lg:hidden"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </header>
      </div>

      {/* mobile sheet */}
      <div
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-night/98 px-6 pb-10 pt-24 text-white backdrop-blur-xl transition-transform duration-300 lg:hidden ${
          menuOpen ? 'translate-y-0' : 'pointer-events-none -translate-y-full'
        }`}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav className="flex flex-col">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex min-h-[60px] items-center justify-between border-b border-white/10 text-2xl font-semibold"
            >
              {link.label}
              <span className="text-white/35">→</span>
            </a>
          ))}
        </nav>

        <div className="mt-7 grid gap-2.5">
          <Button href={waLink('Hello MKLabs! I would like a demo of MKLabs POS.')} variant="whatsapp">
            💬 WhatsApp {contact.phones[0].label}
          </Button>
          <Button
            href={`https://${site.domain}`}
            variant="ghost"
            className="!border-white/25 !text-white"
          >
            MKLabs ↗
          </Button>
        </div>
      </div>
    </>
  )
}
