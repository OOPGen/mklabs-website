import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import { waLink } from '../data/site.js'
import Button from './Button.jsx'
import Logo from './Logo.jsx'
import { photoSrcSet } from './responsive.js'

/** Tabbed gallery of the four products running in real Bulawayo businesses. */
export default function ClientGallery() {
  const [active, setActive] = useState(0)
  const product = products[active]

  return (
    <div className="overflow-hidden rounded-3xl border border-white/12 bg-white/5">
      {/* tabs — scroll sideways on a phone rather than wrapping into a mess */}
      <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-b border-white/10 p-2" role="tablist">
        {products.map((item, index) => (
          <button
            key={item.slug}
            type="button"
            role="tab"
            aria-selected={index === active}
            onClick={() => setActive(index)}
            className={`flex min-h-[48px] shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${
              index === active ? 'bg-white text-purple' : 'text-white/65 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.name}
          </button>
        ))}
      </div>

      <div className="grid gap-0 md:grid-cols-2">
        <div className="relative min-h-[240px] md:min-h-[360px]">
          <img
            key={product.slug}
            src={product.clientImage}
            srcSet={photoSrcSet(product.clientImage)}
            sizes="(min-width: 1152px) 576px, (min-width: 768px) 50vw, 100vw"
            alt={product.clientCaption}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <Logo src={product.logo} size="md" className="self-start" />

          <h3 className="text-xl font-bold leading-snug sm:text-2xl">{product.clientCaption}</h3>

          <p className="text-sm leading-relaxed text-lavender/70">{product.summary}</p>

          <div className="mt-auto flex flex-wrap gap-2.5 pt-2">
            <Button to={`/products/${product.slug}`} variant="white">
              Explore {product.name}
            </Button>
            <Button
              href={waLink(`Hello MKLabs! I would like a ${product.name} demo.`)}
              variant="whatsapp"
            >
              💬 Book a demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
