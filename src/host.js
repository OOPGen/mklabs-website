/**
 * pos.mklabs.co.zw serves the POS landing page from its own root.
 * Same deployment, same code — Cloudflare Pages points both custom domains at
 * this project and the hostname decides which site a visitor gets.
 * Always false while prerendering, where there is no window.
 */
export const isPosHost =
  typeof window !== 'undefined' && /^pos\./i.test(window.location.hostname)
