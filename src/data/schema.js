/**
 * Structured data (schema.org JSON-LD) for each prerendered page — what
 * Google and Bing read to understand who MKLabs is, where it works and what
 * each product is. scripts/prerender.js writes it into the page's HTML.
 *
 * Only facts the site already states: no invented street address, prices
 * or ratings (Google penalises structured data the page does not back up).
 * Test changes at https://search.google.com/test/rich-results
 */

import { MAIN_ORIGIN, POS_ORIGIN, SHARE_IMAGE, metaFor } from './seo.js'
import { getProduct, products } from './products.js'
import { contact, founder, site, socials } from './site.js'

const ORG_ID = `${MAIN_ORIGIN}/#organization`

/* Other companies abroad share the name "MKLabs"; these tell search engines
   which one this is. Google also uses them as the site's name in results. */
const ALTERNATE_NAMES = ['MKLabs Zimbabwe', 'MKLabs Bulawayo', 'MK Labs']
const WEBSITE_ID = `${MAIN_ORIGIN}/#website`

const organization = {
  '@type': ['Organization', 'ProfessionalService'],
  '@id': ORG_ID,
  name: site.name,
  alternateName: ALTERNATE_NAMES,
  url: `${MAIN_ORIGIN}/`,
  logo: { '@type': 'ImageObject', url: `${MAIN_ORIGIN}/icon-512.png`, width: 512, height: 512 },
  image: SHARE_IMAGE,
  description: metaFor('/').description,
  slogan: site.tagline,
  email: contact.emails[0].address,
  telephone: contact.phones[0].tel,
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.city,
    addressCountry: 'ZW',
  },
  areaServed: { '@type': 'Country', name: site.country },
  founder: { '@type': 'Person', name: founder.name, jobTitle: founder.role },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:00',
    closes: '17:00',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: contact.phones[0].tel,
      email: contact.emails[0].address,
      areaServed: 'ZW',
      availableLanguage: ['English'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'technical support',
      telephone: contact.phones[1].tel,
      email: contact.emails[1].address,
      areaServed: 'ZW',
      availableLanguage: ['English'],
    },
  ],
  knowsAbout: [
    'Software development',
    'Point of sale systems',
    'Accounting software',
    'School management systems',
    'Hotel and lodge management software',
    'Website development',
    'Cloud services',
    'Network security',
    'IT support',
  ],
}
// social profiles appear as soon as their addresses are filled in (src/data/site.js)
const sameAs = socials.map((social) => social.url).filter(Boolean)
if (sameAs.length) organization.sameAs = sameAs

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  url: `${MAIN_ORIGIN}/`,
  name: site.name,
  alternateName: ALTERNATE_NAMES,
  inLanguage: 'en-ZW',
  publisher: { '@id': ORG_ID },
}

function breadcrumbs(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map(([name, path], index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: `${MAIN_ORIGIN}${path}`,
    })),
  }
}

function softwareApplication(product, url) {
  return {
    '@type': 'SoftwareApplication',
    '@id': `${url}#software`,
    name: product.name,
    url,
    description: product.seo.description,
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: product.category,
    image: `${MAIN_ORIGIN}${product.clientImage}`,
    featureList: product.features.map((feature) => feature.title),
    audience: { '@type': 'BusinessAudience', audienceType: product.audience.join(', ') },
    publisher: { '@id': ORG_ID },
    provider: { '@id': ORG_ID },
    countriesSupported: 'ZW',
  }
}

function webPage(path, type = 'WebPage', { posHost = false } = {}) {
  const meta = metaFor(path, { posHost })
  return {
    '@type': type,
    '@id': `${meta.canonical}#webpage`,
    url: meta.canonical,
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-ZW',
  }
}

/**
 * The JSON-LD graph for a route, or null for pages that should not carry any
 * (private and not-found pages).
 */
export function structuredDataFor(path, { posHost = false } = {}) {
  const meta = metaFor(path, { posHost })
  if (meta.noindex) return null

  const route = posHost ? '/pos' : path
  const graph = [organization]

  if (route === '/') {
    graph.push(website, webPage('/'))
  } else if (route === '/products') {
    graph.push(webPage('/products', 'CollectionPage'), breadcrumbs([['Home', '/'], ['Products', '/products']]), {
      '@type': 'ItemList',
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${MAIN_ORIGIN}/products/${product.slug}`,
        name: product.name,
      })),
    })
  } else if (route === '/about') {
    graph.push(webPage('/about', 'AboutPage'), breadcrumbs([['Home', '/'], ['About', '/about']]))
  } else if (route === '/contact') {
    graph.push(webPage('/contact', 'ContactPage'), breadcrumbs([['Home', '/'], ['Contact', '/contact']]))
  } else if (route === '/pos') {
    graph.push(softwareApplication(getProduct('pos'), `${POS_ORIGIN}/`))
  } else {
    const slug = route.match(/^\/products\/([^/]+)$/)?.[1]
    const product = slug && getProduct(slug)
    if (!product) return null
    const url = `${MAIN_ORIGIN}/products/${product.slug}`
    graph.push(
      webPage(route),
      softwareApplication(product, url),
      breadcrumbs([['Home', '/'], ['Products', '/products'], [product.name, `/products/${product.slug}`]])
    )
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}
