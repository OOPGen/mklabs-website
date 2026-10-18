import { describe, expect, it } from 'vitest'
import { metaFor, prerenderRoutes, sitemapRoutes } from '../src/data/seo.js'
import { APP_ORIGIN, platform, products } from '../src/data/products.js'

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

  it('sends every product to its own sign-up form on core.mklabs.co.zw', () => {
    expect(APP_ORIGIN).toBe('https://core.mklabs.co.zw')
    expect(platform.name).toBe('MKLabs Core ERP')
    expect(products.map((product) => product.signup)).toEqual([
      'https://core.mklabs.co.zw/signup?product=Pos',
      'https://core.mklabs.co.zw/signup?product=Accounting',
      'https://core.mklabs.co.zw/signup?product=School',
    ])
  })

  it('treats the old /pos pitch and the old products as gone, not as pages', () => {
    for (const path of ['/pos', '/products/financeflow', '/products/learncloud', '/products/lodgecloud']) {
      expect(metaFor(path).noindex, path).toBe(true)
    }
  })

  it('marks unknown and private pages noindex, with no canonical', () => {
    for (const path of ['/nope', '/products/nope', '/admin']) {
      expect(metaFor(path)).toMatchObject({ noindex: true, canonical: '' })
    }
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
