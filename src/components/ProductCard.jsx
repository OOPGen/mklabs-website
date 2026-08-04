import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'

/** Product tile on the home and products pages. The whole card is one tap target. */
export default function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-night/10 bg-white p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-iris/50 hover:shadow-xl hover:shadow-night/10 dark:border-white/10 dark:bg-white/5 dark:hover:border-iris/50"
    >
      <Logo src={product.logo} size="lg" />

      <span className="mt-4 text-[11px] font-bold uppercase tracking-wider text-purple dark:text-iris">
        {product.category}
      </span>

      <h3 className="mt-1.5 text-lg font-bold">{product.name}</h3>

      <p className="mt-2 flex-1 text-sm leading-relaxed text-night/65 dark:text-lavender/65">
        {product.summary}
      </p>

      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-purple dark:text-iris">
        See how it works
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </span>
    </Link>
  )
}
