import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import { contact, site, waLink } from '../data/site.js'
import Icon from './Icon.jsx'
import SocialLinks from './SocialLinks.jsx'

const linkClass = 'flex min-h-[44px] items-center text-sm text-white/55 transition-colors hover:text-white pointer-fine:lg:min-h-0 pointer-fine:lg:py-1.5'
const headingClass = 'text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-void px-5 pb-10 pt-16 text-white sm:px-8 sm:pt-20">
      {/* a hairline in the logo's gradient along the top edge */}
      <div className="logo-gradient absolute inset-x-0 top-0 h-px opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[min(900px,120vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(116,67,247,0.14),transparent_70%)] blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl lg:px-5">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* brand */}
          <div>
            <Link to="/" className="inline-flex items-center gap-3" aria-label="MKLabs home">
              <img src="/mklabs-logo-128.webp" alt="" width={44} height={44} loading="lazy" className="h-11 w-11 rounded-[22%]" />
              <span className="text-xl font-bold tracking-tight">MKLabs</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/55">
              Software development and technology solutions for businesses, schools and lodges in {site.city}, {site.country}.
            </p>
            <p className="mt-4 text-sm font-semibold">
              <span className="logo-gradient-text">{site.tagline}</span>
            </p>

            <div className="mt-7">
              <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/40">Follow us</div>
              <SocialLinks className="mt-3" />
            </div>
          </div>

          {/* products */}
          <nav aria-label="Products">
            <div className={headingClass}>Products</div>
            <div className="mt-4">
              {products.map((product) => (
                <Link key={product.slug} to={`/products/${product.slug}`} className={linkClass}>
                  {product.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* company */}
          <nav aria-label="Company">
            <div className={headingClass}>Company</div>
            <div className="mt-4">
              <Link to="/" className={linkClass}>Home</Link>
              <Link to="/#services" className={linkClass}>Services</Link>
              <Link to="/products" className={linkClass}>All products</Link>
              <Link to="/about" className={linkClass}>About &amp; services</Link>
              <Link to="/contact" className={linkClass}>Contact</Link>
            </div>
          </nav>

          {/* contact */}
          <div>
            <div className={headingClass}>Get in touch</div>
            <div className="mt-4 grid gap-0 text-sm pointer-fine:lg:gap-2.5">
              {contact.phones.map((phone) => (
                <a key={phone.tel} href={`tel:${phone.tel}`} className="flex min-h-[44px] items-center gap-3 text-white/70 transition-colors hover:text-white pointer-fine:lg:min-h-0">
                  <Icon name="phone" className="h-4 w-4 text-cyan" />
                  {phone.label}
                </a>
              ))}
              {contact.emails.map((email) => (
                <a key={email.address} href={`mailto:${email.address}`} className="flex min-h-[44px] items-center gap-3 text-white/70 transition-colors hover:text-white pointer-fine:lg:min-h-0">
                  <Icon name="mail" className="h-4 w-4 text-cyan" />
                  {email.address}
                </a>
              ))}
              <span className="flex items-center gap-3 text-white/70">
                <Icon name="pin" className="h-4 w-4 text-cyan" />
                {site.city}, {site.country}
              </span>
              <a
                href={waLink('Hello MKLabs!')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-full bg-whatsapp px-5 text-sm font-semibold text-white"
              >
                💬 WhatsApp us
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name} · {site.city}, {site.country} · {site.domain}</span>
          <span className="flex items-center gap-2">
            <Icon name="clock" className="h-3.5 w-3.5" />
            {site.hours}
          </span>
        </div>
      </div>
    </footer>
  )
}
