/**
 * Runs in front of every /api/* Function and adds the API security headers
 * (Cloudflare Pages does not apply _headers to Function responses).
 */

import { apiSecurityHeaders, withHeaders } from '../_lib/security-headers.js'

export async function onRequest({ next }) {
  const response = await next()
  const secured = withHeaders(response, apiSecurityHeaders)
  // anything an API returns is per-request; let a route opt in to caching explicitly
  if (!secured.headers.has('Cache-Control')) secured.headers.set('Cache-Control', 'no-store')
  return secured
}
