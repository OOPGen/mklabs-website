import { getProduct } from '../data/products.js'
import { site, waLink } from '../data/site.js'
import Button from './Button.jsx'
import Logo from './Logo.jsx'

/**
 * Slim header for the POS landing site.
 *
 * Deliberately not the main MKLabs nav — a visitor who arrived at
 * pos.mklabs.co.zw is here for one product, so the only routes offered are
 * "book a demo" and a quiet way back to the parent company.
 */
export default function PosNav() {
  const pos = getProduct('pos')

  return (
    <div className="fixed inset-x-0 top-0 z-50 px-3 pt-3">
      <header className="glass mx-auto flex max-w-6xl items-center gap-3 rounded-full border border-white/12 bg-night/85 px-3 py-2.5">
        <a href="/" className="flex shrink-0 items-center gap-2.5" aria-label="MKLabs POS home">
          <Logo src={pos.logo} alt="MKLabs POS" size="xs" />
          <span className="text-[15px] font-bold text-white">
            MKLabs <span className="text-lilac">POS</span>
          </span>
        </a>

        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          <a
            href="#features"
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
          >
            Features
          </a>
          <a
            href={`https://${site.domain}`}
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/75 transition-colors hover:text-white"
          >
            MKLabs ↗
          </a>
        </nav>

        <Button
          href={waLink('Hello MKLabs! I would like a demo of MKLabs POS.')}
          variant="whatsapp"
          className="ml-auto !min-h-[44px] !px-5 !text-sm sm:ml-0"
        >
          💬 Book a demo
        </Button>
      </header>
    </div>
  )
}
