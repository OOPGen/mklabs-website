import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import { contact, site, waLink } from '../data/site.js'
import Logo from './Logo.jsx'

const linkClass = 'block py-1.5 text-sm text-white/60 transition-colors hover:text-white'

export default function Footer() {
  return (
    <footer className="bg-ink px-5 pb-10 pt-16 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <Logo src="/logo-mklabs.png" alt="MKLabs" size="sm" tone="dark" />
              <span className="text-lg font-bold">MKLabs</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              Software development and technology solutions for businesses, schools and lodges in {site.city}, {site.country}.
            </p>
            <p className="mt-4 text-sm font-semibold text-lilac">{site.tagline}</p>
          </div>

          {/* products */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Products</div>
            <div className="mt-3">
              {products.map((product) => (
                <Link key={product.slug} to={`/products/${product.slug}`} className={linkClass}>
                  {product.name}
                </Link>
              ))}
            </div>
          </div>

          {/* company */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Company</div>
            <div className="mt-3">
              <Link to="/" className={linkClass}>Home</Link>
              <Link to="/products" className={linkClass}>All products</Link>
              <Link to="/about" className={linkClass}>About &amp; services</Link>
              <Link to="/contact" className={linkClass}>Contact</Link>
            </div>
          </div>

          {/* contact */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/40">Get in touch</div>
            <div className="mt-3">
              {contact.phones.map((phone) => (
                <a key={phone.tel} href={`tel:${phone.tel}`} className={linkClass}>
                  {phone.label}
                </a>
              ))}
              {contact.emails.map((email) => (
                <a key={email.address} href={`mailto:${email.address}`} className={linkClass}>
                  {email.address}
                </a>
              ))}
              <a
                href={waLink('Hello MKLabs!')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white"
              >
                💬 WhatsApp us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name} · {site.city}, {site.country} · {site.domain}</span>
          <span>{site.hours}</span>
        </div>
      </div>
    </footer>
  )
}
