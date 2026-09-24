import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 min-h-[48px] px-6 rounded-full font-semibold text-[15px] ' +
  'transition-transform transition-shadow duration-200 active:scale-[0.98] whitespace-nowrap'

const variants = {
  solid:
    'bg-purple text-white shadow-lg shadow-purple/30 hover:shadow-xl hover:shadow-purple/40 ' +
    'dark:bg-iris dark:text-ink dark:shadow-iris/25',
  ghost:
    'border border-purple/25 text-purple hover:bg-purple/5 ' +
    'dark:border-white/20 dark:text-lavender dark:hover:bg-white/10',
  white: 'bg-white text-purple shadow-lg shadow-black/10 hover:shadow-xl',
  whatsapp: 'bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:shadow-xl',
  // the logo's cyan → violet → magenta, for the main action on dark sections
  brand: 'logo-gradient text-white shadow-lg shadow-violet/35 hover:shadow-xl hover:shadow-violet/45',
  // quiet partner to `brand` on dark sections
  glass: 'border border-white/15 bg-white/5 text-white hover:bg-white/10',
}

/**
 * One button for internal routes (`to`), external links (`href`) and actions (`onClick`).
 * Minimum 48px tall so every target is comfortably tappable on a phone.
 */
export default function Button({
  children,
  to,
  href,
  variant = 'solid',
  className = '',
  ...rest
}) {
  const classes = `${base} ${variants[variant] ?? variants.solid} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    const external = href.startsWith('http')
    return (
      <a
        href={href}
        className={classes}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
