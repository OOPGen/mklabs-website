import { useEffect, useRef } from 'react'

const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

/** Set in Cloudflare Pages → Settings → Environment variables, then redeploy. */
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || ''

let scriptPromise = null

function loadScript() {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_URL
      script.async = true
      script.onload = () => resolve(window.turnstile)
      script.onerror = () => {
        scriptPromise = null
        reject(new Error('Turnstile failed to load'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

/**
 * Cloudflare Turnstile spam check.
 *
 * Renders nothing unless VITE_TURNSTILE_SITE_KEY is set, so the form works
 * unchanged until the keys exist. Tokens are single-use: bump `resetKey`
 * after each submission to get a fresh one.
 */
export default function Turnstile({ onToken, resetKey = 0 }) {
  const container = useRef(null)
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !container.current) return

    let widgetId = null
    let cancelled = false

    loadScript()
      .then((turnstile) => {
        if (cancelled || !container.current) return
        widgetId = turnstile.render(container.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token) => onTokenRef.current(token),
          'expired-callback': () => onTokenRef.current(''),
          'error-callback': () => onTokenRef.current(''),
        })
      })
      .catch(() => {
        /* blocked or offline — the server will refuse, and WhatsApp remains */
      })

    return () => {
      cancelled = true
      onTokenRef.current('')
      if (widgetId !== null && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [resetKey])

  if (!TURNSTILE_SITE_KEY) return null

  return <div ref={container} className="flex min-h-[65px] justify-center" />
}
