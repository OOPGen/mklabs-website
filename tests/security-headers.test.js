import { describe, expect, it } from 'vitest'
import { onRequest as apiMiddleware } from '../functions/api/_middleware.js'
import { pageSecurityHeaders, pageSecurityHeadersFor } from '../functions/_lib/security-headers.js'

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

  it('only allows Google Analytics when a Measurement ID is configured', () => {
    expect(csp).not.toContain('googletagmanager')
    const withGa = pageSecurityHeadersFor({ VITE_GA_MEASUREMENT_ID: 'G-ABC123XYZ' })['Content-Security-Policy']
    expect(withGa).toMatch(/script-src [^;]*https:\/\/\*\.googletagmanager\.com/)
    expect(withGa).toMatch(/connect-src [^;]*https:\/\/\*\.google-analytics\.com/)
    // a malformed value never loosens the policy
    expect(pageSecurityHeadersFor({ VITE_GA_MEASUREMENT_ID: 'x; script-src *' })['Content-Security-Policy']).toBe(csp)
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
