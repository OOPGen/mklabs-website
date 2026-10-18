import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { getProduct, retiredProducts } from '../src/data/products.js'
import { prerenderRoutes } from '../src/data/seo.js'

// public/_redirects as Cloudflare Pages reads it: "from to status" per line
const rules = readFileSync(new URL('../public/_redirects', import.meta.url), 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'))
  .map((line) => line.split(/\s+/))

describe('public/_redirects', () => {
  it('forwards every retired product page permanently to the page that replaced it', () => {
    for (const [from, to] of Object.entries(retiredProducts)) {
      expect(rules, from).toContainEqual([from, to, '301'])
    }
  })

  it('forwards the old /pos pitch to the POS product page', () => {
    expect(rules).toContainEqual(['/pos', '/products/pos', '301'])
  })

  it('only ever forwards to a page that exists', () => {
    for (const [, to] of rules) expect(prerenderRoutes, to).toContain(to)
  })

  it('names FinanceFlow and LearnCloud by what they became', () => {
    expect(getProduct(retiredProducts['/products/financeflow'].split('/').pop()).name).toBe('MKLabs Accounting')
    expect(getProduct(retiredProducts['/products/learncloud'].split('/').pop()).name).toBe('MKLabs School')
  })
})
