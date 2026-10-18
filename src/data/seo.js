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
export const SHARE_IMAGE = `${MAIN_ORIGIN}/og-image.jpg`

const pages = {
  '/': {
    title: 'MKLabs | Software Development Company in Bulawayo, Zimbabwe',
    description:
      'MKLabs is a Bulawayo software company. We build MKLabs Core ERP — POS, accounting and school management — plus custom software, websites, cloud and IT support.',
  },
  '/products': {
    title: 'MKLabs Core ERP — POS, Accounting & School Software, Zimbabwe',
    description:
      'MKLabs Core ERP: MKLabs POS, MKLabs Accounting and MKLabs School on one platform, built in Bulawayo for Zimbabwe. Start any of them on a free trial.',
  },
  '/about': {
    title: 'About MKLabs — Software Company in Bulawayo, Zimbabwe',
    description:
      'MKLabs is a Bulawayo software development company building practical systems for businesses and schools in Zimbabwe. Meet founder Michael Junior Jere.',
  },
  '/contact': {
    title: 'Contact MKLabs — Software & IT Support in Bulawayo, Zimbabwe',
    description:
      'Request a demo or a quote from MKLabs in Bulawayo. Call or WhatsApp 0718 621 427 or 0786 233 766, or email info@mklabs.co.zw. We reply within one working day.',
  },
  '/michael': {
    title: 'Michael Junior Jere — Full-Stack Software Developer, Bulawayo',
    description:
      'Portfolio of Michael Junior Jere, full-stack developer (C#, ASP.NET Core, React, TypeScript, PostgreSQL) and founder of MKLabs. Open to full-time, contract and remote roles.',
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

function normalisePath(path) {
  const clean = String(path || '/').split(/[?#]/)[0].replace(/\/+$/, '')
  return clean || '/'
}

/**
 * Metadata for a path. Returns { title, description, canonical, image, noindex }.
 * Unknown paths get noindex, so a stray URL never competes with a real page.
 */
export function metaFor(path) {
  const route = normalisePath(path)

  let meta = pages[route]

  const productMatch = route.match(/^\/products\/([^/]+)$/)
  if (productMatch) {
    const product = getProduct(productMatch[1])
    if (product) {
      meta = { title: product.seo.title, description: product.seo.description }
    }
  }

  if (!meta) return { ...notFound, canonical: '', image: SHARE_IMAGE }

  return {
    title: meta.title,
    description: meta.description,
    // a page that asks not to be indexed has no preferred address to declare
    canonical: meta.noindex ? '' : `${MAIN_ORIGIN}${route}`,
    image: SHARE_IMAGE,
    noindex: Boolean(meta.noindex),
  }
}

/** Every route that should be written as its own HTML file at build time. */
export const prerenderRoutes = [
  ...Object.keys(pages),
  ...products.map((product) => `/products/${product.slug}`),
]

/** Routes listed in the sitemap — every indexable page. */
export const sitemapRoutes = prerenderRoutes.filter((route) => !metaFor(route).noindex)
