import { describe, expect, it } from 'vitest'
import { POS_ORIGIN, metaFor, prerenderRoutes, sitemapRoutes } from '../src/data/seo.js'
import { getProduct, products } from '../src/data/products.js'

describe('metaFor', () => {
  it('gives each page its own canonical address', () => {
    expect(metaFor('/').canonical).toBe('https://mklabs.co.zw/')
    expect(metaFor('/about').canonical).toBe('https://mklabs.co.zw/about')
    expect(metaFor('/products/pos/').canonical).toBe('https://mklabs.co.zw/products/pos')
  })

  it('builds product pages from the product data', () => {
    for (const product of products) {
      expect(metaFor(`/products/${product.slug}`)).toMatchObject({
        title: product.seo.title,
        description: product.seo.description,
      })
    }
  })

  it('links the POS product to the same subdomain the canonical uses', () => {
    expect(`${getProduct('pos').site.url}/`).toBe(`${POS_ORIGIN}/`)
  })

  it('points the /pos preview at the POS subdomain', () => {
    expect(metaFor('/pos').canonical).toBe('https://pos.mklabs.co.zw/')
    expect(metaFor('/', { posHost: true }).title).toBe(metaFor('/pos').title)
  })

  it('marks unknown and private pages noindex, with no canonical', () => {
    for (const path of ['/nope', '/products/nope', '/admin']) {
      expect(metaFor(path)).toMatchObject({ noindex: true, canonical: '' })
    }
    expect(metaFor('/about', { posHost: true }).noindex).toBe(true)
  })

  it('keeps every title and description within what search results show', () => {
    for (const route of prerenderRoutes.filter((path) => !metaFor(path).noindex)) {
      const { title, description } = metaFor(route)
      expect(title.length, route).toBeLessThanOrEqual(65)
      expect(description.length, route).toBeGreaterThanOrEqual(70)
      expect(description.length, route).toBeLessThanOrEqual(175)
    }
  })

  it('gives every indexable page a unique title and description', () => {
    const pages = sitemapRoutes.map((route) => metaFor(route))
    expect(new Set(pages.map((page) => page.title)).size).toBe(pages.length)
    expect(new Set(pages.map((page) => page.description)).size).toBe(pages.length)
  })
})

describe('route lists', () => {
  it('prerenders every product page', () => {
    for (const product of products) expect(prerenderRoutes).toContain(`/products/${product.slug}`)
  })

  it('keeps private and non-canonical pages out of the sitemap', () => {
    expect(sitemapRoutes).not.toContain('/admin')
    expect(sitemapRoutes).not.toContain('/pos')
    expect(sitemapRoutes).toContain('/')
  })
})
