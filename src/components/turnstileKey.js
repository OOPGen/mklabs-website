/** Cloudflare Turnstile site key. Set in Cloudflare Pages → Settings → Environment variables, then redeploy. */
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''
