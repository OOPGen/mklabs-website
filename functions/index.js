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

export async function onRequest({ request, env, next }) {
  const url = new URL(request.url)
  if (!/^pos\./i.test(url.hostname)) return next()

  return env.ASSETS.fetch(new Request(new URL('/pos', url), request))
}
