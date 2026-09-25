/**
 * Google Analytics 4 — optional, and off unless a Measurement ID is set.
 *
 * Set VITE_GA_MEASUREMENT_ID (e.g. G-XXXXXXXXXX) in Cloudflare Pages →
 * Settings → Environment variables and redeploy. Without it nothing is
 * loaded and every function here does nothing. The Content-Security-Policy
 * only allows Google's hosts when the same variable is set (see
 * functions/_lib/security-headers.js).
 *
 * Cloudflare Web Analytics (cookie-free page views) needs no code at all —
 * it is switched on in the Cloudflare dashboard.
 *
 * Page views are sent by the app on every route change, after the new title
 * is set. In GA, turn off Enhanced measurement → "Page changes based on
 * browser history events" so they are not counted twice.
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID
const enabled = typeof window !== 'undefined' && /^G-[A-Z0-9]+$/.test(MEASUREMENT_ID || '')

function gtag() {
  // gtag.js reads the `arguments` object itself, not an array
  window.dataLayer.push(arguments)
}

/** A GA4 event, e.g. trackEvent('generate_lead', { form: 'contact' }). */
export function trackEvent(name, params = {}) {
  if (enabled) gtag('event', name, params)
}

/** Records the current page. Called by the app after each route change. */
export function trackPageView() {
  trackEvent('page_view', {
    page_location: window.location.href,
    page_title: document.title,
  })
}

/* The ways a visitor gets in touch, wherever the link is on the page. */
const contactLinks = [
  [/^https:\/\/wa\.me\//, 'contact_whatsapp'],
  [/^tel:/, 'contact_phone'],
  [/^mailto:/, 'contact_email'],
]

export function initAnalytics() {
  if (!enabled) return

  window.dataLayer = window.dataLayer || []
  gtag('js', new Date())
  // page views are sent by the app itself, with the right title
  gtag('config', MEASUREMENT_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  document.addEventListener(
    'click',
    (event) => {
      const link = event.target instanceof Element && event.target.closest('a[href]')
      if (!link) return
      const match = contactLinks.find(([pattern]) => pattern.test(link.href))
      if (match) trackEvent(match[1], { link_url: link.href, page_path: window.location.pathname })
    },
    { capture: true }
  )
}
