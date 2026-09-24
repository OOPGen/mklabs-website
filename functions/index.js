/**
 * Cloudflare Pages Function — GET /
 *
 * pos.mklabs.co.zw and mklabs.co.zw are the same deployment. The browser app
 * already switches on the hostname, but crawlers read the HTML before any
 * JavaScript runs — so on the POS host, the root serves the prerendered POS
 * page (its own title, description and canonical) instead of the main home.
 *
 * Only "/" runs through this Function; every other path is served statically.
 */

import { pageSecurityHeaders, withHeaders } from './_lib/security-headers.js'

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  const response = /^pos\./i.test(url.hostname)
    ? await env.ASSETS.fetch(new Request(new URL('/pos', url), request))
    : await next()

  // a Function's response skips _headers, so the page headers are set here
  return withHeaders(response, pageSecurityHeaders)
}
