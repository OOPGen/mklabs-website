import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import { getProduct, platform } from '../data/products.js'
import { waLink } from '../data/site.js'
import './BentoGrid.css'

const pos = getProduct('pos')
const accounting = getProduct('accounting')
const school = getProduct('school')
const feature = (title) => platform.features.find((f) => f.title === title)

// The example week drawn in the POS card — the same sample shop as its dashboard preview.
const WEEK = [
  ['Mon', 0.46],
  ['Tue', 0.62],
  ['Wed', 0.55],
  ['Thu', 0.78],
  ['Fri', 0.9],
  ['Sat', 1],
  ['Sun', 0.68],
]

/** A dashboard figure: label, value, and a trend or a good/warn tint. */
function Stat({ stat }) {
  const tone = stat.warn ? ' bento-stat--warn' : stat.good ? ' bento-stat--good' : ''
  return (
    <div className={`bento-stat${tone}`}>
      <span className="bento-stat__label">{stat.label}</span>
      <span className="bento-stat__value">{stat.value}</span>
      {stat.trend && <span className="bento-stat__trend">{stat.trend}</span>}
    </div>
  )
}

/** Internal routes use the router; everything else opens as a normal link. */
function Action({ to, href, primary, children }) {
  const className = `bento-action${primary ? ' bento-action--primary' : ''}`
  if (to) return <Link to={to} className={className}>{children}</Link>
  const external = href.startsWith('http')
  return (
    <a href={href} className={className} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  )
}

/*
 * Each card: an icon and a title, then a resting layer (figures and a line)
 * that gives way to a layer of details and actions while the card is in
 * focus. The POS card also keeps its chart in view and grows it.
 * `area` places it in the grid (see BentoGrid.css).
 */
const CARDS = [
  {
    area: 'pos',
    icon: 'devices',
    kicker: pos.category,
    title: pos.name,
    rest: pos.tagline,
    visual: (
      <div className="bento-chart">
        <div className="bento-chart__head">
          <Stat stat={pos.dashboard.stats[0]} />
          <span className="bento-chart__caption">Example week · {pos.dashboard.title.split(' • ')[1]}</span>
        </div>
        <div className="bento-chart__bars" aria-hidden="true">
          {WEEK.map(([day, h], i) => (
            <span key={day} className="bento-chart__bar" style={{ '--h': h, '--i': i }}>
              <span className="bento-chart__day">{day}</span>
            </span>
          ))}
        </div>
      </div>
    ),
    details: `${pos.price.amount} ${pos.price.per} · sells offline · ZIMRA fiscal receipts built in.`,
    actions: [
      { to: `/products/${pos.slug}`, label: 'See MKLabs POS' },
      { href: pos.signup, label: 'Start a free trial', primary: true },
    ],
  },
  {
    area: 'acc',
    icon: 'shield',
    kicker: accounting.category,
    title: accounting.name,
    rest: accounting.tagline,
    stats: accounting.dashboard.stats.slice(0, 2),
    details: `${accounting.tagline} ${accounting.price.amount} ${accounting.price.per}.`,
    actions: [
      { to: `/products/${accounting.slug}`, label: 'See Accounting' },
      { href: accounting.signup, label: 'Try it free', primary: true },
    ],
  },
  {
    area: 'school',
    icon: 'people',
    kicker: school.category,
    title: school.name,
    rest: school.tagline,
    stats: school.dashboard.stats.slice(0, 2),
    details: `${school.tagline} ${school.price.amount} ${school.price.per}.`,
    actions: [
      { to: `/products/${school.slug}`, label: 'See School' },
      { href: school.signup, label: 'Try it free', primary: true },
    ],
  },
  {
    area: 'offline',
    icon: 'offline',
    kicker: 'Always on',
    title: feature('Load shedding ready').title,
    rest: 'Power cuts don’t stop the till.',
    details: feature('Load shedding ready').body,
  },
  {
    area: 'zim',
    icon: 'globe',
    kicker: 'Local by design',
    title: feature('Made for Zimbabwe').title,
    rest: 'Two currencies, one set of books.',
    details: feature('Made for Zimbabwe').body,
  },
  {
    area: 'support',
    icon: 'headset',
    kicker: 'People, not tickets',
    title: feature('Support from the builders').title,
    rest: 'WhatsApp the team that wrote it.',
    details: feature('Support from the builders').body,
    actions: [{ href: waLink('Hello MKLabs! I have a question about Core ERP.'), label: 'WhatsApp us', primary: true }],
  },
]

/**
 * MKLabs Core ERP as a bento grid. Pointing at a card (or tabbing into it)
 * makes it the focus: its row and column widen, the other cards ease back,
 * and a layer of details and actions slides up inside it. On touch screens
 * and narrow layouts every card simply shows everything.
 */
export default function BentoGrid() {
  const [active, setActive] = useState(null)

  return (
    <div
      className="bento"
      data-active={active ?? undefined}
      onMouseLeave={() => setActive(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(null)
      }}
    >
      {CARDS.map((card) => (
        <article
          key={card.area}
          className={`bento-card bento-card--${card.area}${active === card.area ? ' is-active' : ''}`}
          onMouseEnter={() => setActive(card.area)}
          onFocus={() => setActive(card.area)}
        >
          <header className="bento-card__head">
            <span className="bento-card__icon" aria-hidden="true">
              <Icon name={card.icon} className="bento-card__glyph" />
            </span>
            <p className="bento-card__kicker">{card.kicker}</p>
            <h3 className="bento-card__title">{card.title}</h3>
          </header>

          {card.visual && <div className="bento-card__visual">{card.visual}</div>}

          {/* The resting layer and the reveal layer share this space; the reveal sits over it, out of the layout. */}
          <div className="bento-card__body">
            <div className="bento-card__rest">
              {card.stats && (
                <div className="bento-stats">
                  {card.stats.map((s) => <Stat key={s.label} stat={s} />)}
                </div>
              )}
              {/* a card with figures lets them speak; its line is in the details instead */}
              {!card.stats && <p className="bento-card__line">{card.rest}</p>}
            </div>
            <div className="bento-card__reveal">
              <p className="bento-card__details">{card.details}</p>
              {card.actions && (
                <div className="bento-card__actions">
                  {card.actions.map(({ label, ...action }) => (
                    <Action key={label} {...action}>
                      {label} <Icon name={action.to ? 'arrow' : 'external'} className="bento-action__icon" />
                    </Action>
                  ))}
                </div>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
