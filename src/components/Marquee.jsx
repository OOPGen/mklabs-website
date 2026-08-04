import Logo from './Logo.jsx'
import useReducedMotion from './useReducedMotion.js'

const items = [
  { logo: '/logo-mklabs.png', label: 'MKLabs', dark: true },
  { logo: '/logo-pos.png', label: 'MKLabs POS' },
  { logo: '/logo-financeflow.png', label: 'FinanceFlow' },
  { logo: '/logo-learncloud.png', label: 'LearnCloud' },
  { logo: '/logo-lodgecloud.png', label: 'LodgeCloud' },
  { logo: '/logo-software.png', label: 'Software Development' },
  { logo: '/logo-website.png', label: 'Web Development' },
  { logo: '/logo-cloud.png', label: 'Cloud & IT' },
  { logo: '/logo-security.png', label: 'Security & Networking' },
]

function Item({ item }) {
  return (
    <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-night/10 bg-white/70 px-4 py-2.5 dark:border-white/10 dark:bg-white/5">
      <Logo src={item.logo} size="xs" tone={item.dark ? 'dark' : 'light'} />
      <span className="text-sm font-semibold whitespace-nowrap">{item.label}</span>
    </div>
  )
}

/**
 * The scrolling ecosystem strip.
 * With Reduce Motion on, it becomes a static wrapped grid showing the
 * same nine items — so nothing is missing, it simply stops moving.
 */
export default function Marquee() {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <div className="border-y border-night/10 bg-lavender/40 py-6 dark:border-white/10 dark:bg-ink-2">
        <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2.5 px-5">
          {items.map((item) => (
            <Item key={item.label} item={item} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border-y border-night/10 bg-lavender/40 py-6 dark:border-white/10 dark:bg-ink-2">
      <div className="marquee-track flex w-max gap-2.5" aria-label="MKLabs product and service ecosystem">
        {[...items, ...items].map((item, index) => (
          <Item key={`${item.label}-${index}`} item={item} />
        ))}
      </div>
    </div>
  )
}
