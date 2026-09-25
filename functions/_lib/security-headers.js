/**
 * Security headers — the one definition used everywhere:
 *   - scripts/prerender.js writes them into dist/_headers for static files
 *   - Functions apply them in code, because Cloudflare Pages does not apply
 *     _headers to responses a Function produces (that includes "/")
 *
 * The CSP lists every outside origin the site uses. Adding a new embed,
 * script or font host means adding it here, or the browser will block it.
 */

/* Google Analytics 4 — only allowed when a Measurement ID is configured
   (VITE_GA_MEASUREMENT_ID, see src/analytics.js). Hosts as Google lists them. */
const googleAnalytics = {
  script: ['https://*.googletagmanager.com'],
  img: ['https://*.google-analytics.com', 'https://*.googletagmanager.com'],
  connect: ['https://*.google-analytics.com', 'https://*.analytics.google.com', 'https://*.googletagmanager.com'],
}

function contentSecurityPolicy({ analytics = false } = {}) {
  const ga = (kind) => (analytics ? ` ${googleAnalytics[kind].join(' ')}` : '')
  return [
    "default-src 'self'",
    // theme.js and the app bundle are served from here; no inline scripts anywhere.
    // Turnstile (spam check) and Cloudflare Web Analytics, if switched on.
    `script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com${ga('script')}`,
    // React sets style properties at runtime; the Turnstile widget adds its own
    "style-src 'self' 'unsafe-inline'",
    // Instrument Sans is self-hosted with the build
    "font-src 'self'",
    `img-src 'self' data:${ga('img')}`,
    `connect-src 'self' https://cloudflareinsights.com${ga('connect')}`,
    // Google Maps on the contact page, and the Turnstile widget
    'frame-src https://www.google.com https://challenges.cloudflare.com',
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ')
}

/** True when the environment (build or Function) has Google Analytics configured. */
export const analyticsEnabled = (env = {}) => /^G-[A-Z0-9]+$/.test(env.VITE_GA_MEASUREMENT_ID || '')

/**
 * Headers for every HTML page and static file, for a given environment:
 * `process.env` at build time, a Function's `env` at request time.
 */
export function pageSecurityHeadersFor(env) {
  return {
    'Content-Security-Policy': contentSecurityPolicy({ analytics: analyticsEnabled(env) }),
    // one year; subdomains are not included, so a future plain-HTTP subdomain is not locked out
    'Strict-Transport-Security': 'max-age=31536000',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), browsing-topics=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
  }
}

/** The page headers with no optional services switched on. */
export const pageSecurityHeaders = pageSecurityHeadersFor()

/** Headers for JSON API responses: nothing to render, nothing to index or cache. */
export const apiSecurityHeaders = {
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'Strict-Transport-Security': pageSecurityHeaders['Strict-Transport-Security'],
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex',
}

/** Copy of a response with the given headers set (responses can be immutable). */
export function withHeaders(response, headers) {
  const result = new Response(response.body, response)
  for (const [name, value] of Object.entries(headers)) result.headers.set(name, value)
  return result
}
