import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

/**
 * Product tile on the home and products pages. The whole card is one tap
 * target: the title link is stretched over it. A product with its own website
 * gets a second link that sits above that stretched area — links cannot be
 * nested, so this is the only way to have both.
 */
export default function ProductCard({ product }) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-night/10 bg-white p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-iris/50 hover:shadow-xl hover:shadow-night/10 focus-within:border-iris/50 dark:border-white/10 dark:bg-white/5 dark:hover:border-iris/50">
      <Logo src={product.logo} size="lg" />

      <span className="mt-4 text-[11px] font-bold uppercase tracking-wider text-purple dark:text-iris">
        {product.category}
      </span>

      <h3 className="mt-1.5 text-lg font-bold">
        <Link
          to={`/products/${product.slug}`}
          className="rounded-2xl outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:outline-2 focus-visible:after:outline-iris"
        >
          {product.name}
        </Link>
      </h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-night/65 dark:text-lavender/65">
        {product.summary}
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple dark:text-iris" aria-hidden="true">
        See how it works
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>

      {product.site && (
        <a
          href={product.site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 mt-3 inline-flex min-h-[44px] items-center gap-1.5 self-start text-sm font-semibold text-night/70 underline decoration-iris/50 underline-offset-4 hover:text-purple dark:text-lavender/75 dark:hover:text-iris"
        >
          Visit {product.site.label} ↗
        </a>
      )}
    </article>
  )
}
