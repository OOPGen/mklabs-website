/**
 * Shared promotion rules — used by both the public and the admin endpoints so
 * they can never disagree about what "live" means or what a valid record is.
 */

export const KV_KEY = 'promotions:v1'
export const MAX_PROMOTIONS = 24

/** Today's date in Harare as YYYY-MM-DD, so promos flip over on local days. */
export function todayInHarare() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Harare',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const cleanDate = (value) => (DATE_PATTERN.test(String(value || '')) ? String(value) : '')

/**
 * Links come from the dashboard and end up in an href, so anything that can
 * execute is rejected outright — `javascript:` and `data:` most of all.
 * Allowed: absolute http(s), mailto:, tel:, and site-relative paths.
 */
export function cleanLink(value) {
  const href = String(value || '').trim()
  if (!href) return ''

  if (href.startsWith('/') && !href.startsWith('//')) return href.slice(0, 300)

  try {
    const url = new URL(href)
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) {
      return url.toString().slice(0, 300)
    }
  } catch {
    return ''
  }

  return ''
}

const text = (value, limit) => String(value ?? '').trim().slice(0, limit)

/** Force an incoming record into a known shape — never trust the client. */
export function normalise(input, index = 0) {
  return {
    id: text(input?.id, 40) || `promo-${Date.now()}-${index}`,
    title: text(input?.title, 120),
    body: text(input?.body, 600),
    badge: text(input?.badge, 40),
    ctaLabel: text(input?.ctaLabel, 40),
    ctaHref: cleanLink(input?.ctaHref),
    active: input?.active !== false,
    startsAt: cleanDate(input?.startsAt),
    endsAt: cleanDate(input?.endsAt),
  }
}

export function validate(promotions) {
  if (!Array.isArray(promotions)) return 'Expected an array of promotions'
  if (promotions.length > MAX_PROMOTIONS) return `At most ${MAX_PROMOTIONS} promotions`

  const seen = new Set()
  for (const promotion of promotions) {
    if (seen.has(promotion.id)) return `Two promotions share the id "${promotion.id}" — reload and try again`
    seen.add(promotion.id)

    if (!promotion.title) return 'Every promotion needs a title'
    if (promotion.ctaLabel && !promotion.ctaHref) {
      return `"${promotion.title}" has a button label but no link`
    }
    if (promotion.startsAt && promotion.endsAt && promotion.startsAt > promotion.endsAt) {
      return `"${promotion.title}" ends before it starts`
    }
  }

  return null
}

/** A promotion the public should see right now. */
export function isLive(promotion, today = todayInHarare()) {
  if (!promotion.active) return false
  if (promotion.startsAt && promotion.startsAt > today) return false
  if (promotion.endsAt && promotion.endsAt < today) return false
  return true
}

/** A short fingerprint of exactly what is stored, so a save can tell if it is out of date. */
async function fingerprint(raw) {
  if (!raw) return 'empty'
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return [...new Uint8Array(digest).slice(0, 12)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function parse(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.map(normalise) : []
  } catch {
    return []
  }
}

/**
 * Everything stored, plus its version and who last saved it.
 * The version is a fingerprint of the stored text, so records written before
 * versioning existed still get one — no migration needed.
 */
export async function readStored(env) {
  if (!env.PROMOS) return { promotions: [], version: 'empty', updatedBy: '', updatedAt: '' }
  const { value, metadata } = await env.PROMOS.getWithMetadata(KV_KEY)
  return {
    promotions: parse(value),
    version: await fingerprint(value),
    updatedBy: metadata?.updatedBy || '',
    updatedAt: metadata?.updatedAt || '',
  }
}

export async function readAll(env) {
  return (await readStored(env)).promotions
}

/** Saves the list and returns its new version. */
export async function writeAll(env, promotions, updatedBy = '') {
  const raw = JSON.stringify(promotions)
  await env.PROMOS.put(KV_KEY, raw, {
    metadata: { updatedBy, updatedAt: new Date().toISOString() },
  })
  return fingerprint(raw)
}
