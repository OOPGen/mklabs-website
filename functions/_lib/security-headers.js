/**
 * Security headers — the one definition used everywhere:
 *   - scripts/prerender.js writes them into dist/_headers for static files
 *   - Functions apply them in code, because Cloudflare Pages does not apply
 *     _headers to responses a Function produces (that includes "/")
 *
 * The CSP lists every outside origin the site uses. Adding a new embed,
 * script or font host means adding it here, or the browser will block it.
 */

const contentSecurityPolicy = [
  "default-src 'self'",
  // theme.js and the app bundle are served from here; no inline scripts anywhere.
  // Turnstile (spam check) and Cloudflare Web Analytics, if switched on.
  "script-src 'self' https://challenges.cloudflare.com https://static.cloudflareinsights.com",
  // React sets style properties at runtime; the Google Fonts stylesheet
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self' https://cloudflareinsights.com",
  // Google Maps on the contact page, and the Turnstile widget
  'frame-src https://www.google.com https://challenges.cloudflare.com',
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

/** Headers for every HTML page and static file. */
export const pageSecurityHeaders = {
  'Content-Security-Policy': contentSecurityPolicy,
  // one year; subdomains are not included, so a future plain-HTTP subdomain is not locked out
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
}

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
