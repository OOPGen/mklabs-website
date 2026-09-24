/**
 * Search and share metadata for every route — the one place titles,
 * descriptions and canonical addresses are defined.
 *
 * Used twice:
 *   - in the browser, by useSeo(), as visitors move between pages
 *   - at build time, by scripts/prerender.js, which writes an HTML file per
 *     route so crawlers that never run JavaScript (WhatsApp, Facebook,
 *     LinkedIn previews) still read the right tags
 *
 * Plain data only — this file runs in Node as well as the browser.
 */

import { getProduct, products } from './products.js'

export const MAIN_ORIGIN = 'https://mklabs.co.zw'
export const POS_ORIGIN = 'https://pos.mklabs.co.zw'
export const SHARE_IMAGE = `${MAIN_ORIGIN}/og-image.jpg`

const pages = {
  '/': {
    title: 'MKLabs | Software Development & Technology Solutions — Bulawayo, Zimbabwe',
    description:
      'MKLabs builds POS, accounting, school and lodge management software for businesses in Bulawayo, Zimbabwe. Custom software, websites, cloud, security and IT support.',
  },
  '/products': {
    title: 'Products — POS, FinanceFlow, LearnCloud & LodgeCloud | MKLabs',
    description:
      'Four systems from MKLabs: point of sale, accounting, school management and lodge management, built for Zimbabwe.',
  },
  '/about': {
    title: 'About MKLabs — Software company in Bulawayo',
    description:
      'MKLabs builds practical software for businesses, schools and lodges in Bulawayo, Zimbabwe. Meet founder Michael Junior Jere.',
  },
  '/contact': {
    title: 'Contact MKLabs — Bulawayo, Zimbabwe',
    description:
      'Request a demo or a quote from MKLabs. WhatsApp 0786 233 766 or email info@mklabs.co.zw.',
  },
  '/pos': {
    title: 'MKLabs POS — Point of sale for Zimbabwean retail',
    description:
      'Offline-first point of sale and stock management for shops in Bulawayo. Keeps selling when the internet drops. Book a free demo on WhatsApp.',
    // the POS landing's real home is its own subdomain; /pos is a preview
    canonical: `${POS_ORIGIN}/`,
  },
  '/admin': {
    title: 'Promotions dashboard | MKLabs',
    description: 'Private dashboard for managing MKLabs promotions.',
    noindex: true,
  },
}

const notFound = {
  title: 'Page not found | MKLabs',
  description: 'That page does not exist. Browse MKLabs products or get in touch.',
  noindex: true,
}

/** Routes that exist on the POS subdomain, mapped to the page they render. */
const posRoutes = { '/': '/pos', '/contact': '/contact' }

function normalisePath(path) {
  const clean = String(path || '/').split(/[?#]/)[0].replace(/\/+$/, '')
  return clean || '/'
}

/**
 * Metadata for a path. Returns { title, description, canonical, image, noindex }.
 * Unknown paths get noindex, so a stray URL never competes with a real page.
 */
export function metaFor(path, { posHost = false } = {}) {
  let route = normalisePath(path)

  if (posHost) {
    if (!posRoutes[route]) return { ...notFound, canonical: '', image: SHARE_IMAGE }
    route = posRoutes[route]
  }

  let meta = pages[route]

  const productMatch = route.match(/^\/products\/([^/]+)$/)
  if (productMatch) {
    const product = getProduct(productMatch[1])
    if (product) {
      meta = {
        title: `${product.name} — ${product.category} | MKLabs`,
        description: product.summary,
      }
    }
  }

  if (!meta) return { ...notFound, canonical: '', image: SHARE_IMAGE }

  return {
    title: meta.title,
    description: meta.description,
    // a page that asks not to be indexed has no preferred address to declare
    canonical: meta.noindex ? '' : meta.canonical || `${MAIN_ORIGIN}${route}`,
    image: SHARE_IMAGE,
    noindex: Boolean(meta.noindex),
  }
}

/** Every route that should be written as its own HTML file at build time. */
export const prerenderRoutes = [
  ...Object.keys(pages),
  ...products.map((product) => `/products/${product.slug}`),
]

/** Routes listed in the main sitemap — indexable, and canonical on this host. */
export const sitemapRoutes = prerenderRoutes.filter((route) => {
  const meta = metaFor(route)
  return !meta.noindex && meta.canonical.startsWith(MAIN_ORIGIN)
})
