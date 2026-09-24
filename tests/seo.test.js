import { describe, expect, it } from 'vitest'
import { metaFor, prerenderRoutes, sitemapRoutes } from '../src/data/seo.js'
import { products } from '../src/data/products.js'

describe('metaFor', () => {
  it('gives each page its own canonical address', () => {
    expect(metaFor('/').canonical).toBe('https://mklabs.co.zw/')
    expect(metaFor('/about').canonical).toBe('https://mklabs.co.zw/about')
    expect(metaFor('/products/pos/').canonical).toBe('https://mklabs.co.zw/products/pos')
  })

  it('builds product pages from the product data', () => {
    for (const product of products) {
      expect(metaFor(`/products/${product.slug}`).description).toBe(product.summary)
    }
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
