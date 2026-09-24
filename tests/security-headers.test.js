import { describe, expect, it } from 'vitest'
import { onRequest as apiMiddleware } from '../functions/api/_middleware.js'
import { pageSecurityHeaders } from '../functions/_lib/security-headers.js'

describe('page security headers', () => {
  const csp = pageSecurityHeaders['Content-Security-Policy']

  it('never allows inline or eval scripts', () => {
    const scriptSrc = csp.split('; ').find((directive) => directive.startsWith('script-src'))
    expect(scriptSrc).not.toMatch(/unsafe-inline|unsafe-eval/)
  })

  it('allows every outside host the site uses', () => {
    for (const host of ['www.google.com', 'challenges.cloudflare.com']) {
      expect(csp).toContain(host)
    }
  })

  it('serves fonts only from the site itself', () => {
    expect(csp).toContain("font-src 'self';")
  })
})

describe('API middleware', () => {
  it('adds noindex and no-store to API responses', async () => {
    const response = await apiMiddleware({ next: async () => new Response('{}') })
    expect(response.headers.get('X-Robots-Tag')).toBe('noindex')
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('Content-Security-Policy')).toContain("default-src 'none'")
  })

  it('keeps a cache policy a route set deliberately', async () => {
    const response = await apiMiddleware({
      next: async () => new Response('{}', { headers: { 'Cache-Control': 'public, max-age=60' } }),
    })
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=60')
  })
})
