/**
 * Shared enquiry rules — imported by the /api/contact Function and by the
 * browser form, so the two can never disagree about what a valid enquiry is.
 * Keep this file dependency-free: it runs on Workers and in the browser.
 */

/** Longest value accepted per field, in characters. */
export const LIMITS = {
  name: 120,
  company: 120,
  email: 254,
  phone: 40,
  service: 80,
  budget: 60,
  message: 5000,
}

/** Hard cap on the raw request body, well above what the limits allow. */
export const MAX_BODY_BYTES = 32 * 1024

/**
 * Hidden field real visitors never see or fill. Bots that auto-complete every
 * input fill it, and the enquiry is quietly dropped.
 */
export const HONEYPOT_FIELD = 'website'

/**
 * Deliberately simple: one @, a dot in the domain, and none of the characters
 * that could break out of a header, an attribute or a mailto: link.
 */
const EMAIL_PATTERN = /^[^\s@<>"'`(),;:\\[\]]+@[^\s@<>"'`(),;:\\[\]]+\.[^\s@<>"'`(),;:\\[\].]{2,}$/

export function isValidEmail(value) {
  const email = String(value || '')
  return email.length <= LIMITS.email && EMAIL_PATTERN.test(email)
}

const ZW_COUNTRY_CODE = '263'

/**
 * Turn what a visitor typed into a number wa.me and tel: will accept, or ''
 * when we cannot tell which country it belongs to — no link beats a link that
 * dials a stranger.
 *
 *   0786 233 766       → 263786233766   Zimbabwean local form
 *   786 233 766        → 263786233766   ZW mobile without the zero
 *   +263 78 623 3766   → 263786233766
 *   00263786233766     → 263786233766
 *   +44 7700 900123    → 447700900123   explicit international
 *   07700 900123       → ''             someone else's local form
 */
export function toWhatsAppNumber(input) {
  const raw = String(input || '').trim()
  let digits = raw.replace(/[^0-9]/g, '')
  if (!digits) return ''

  const international = raw.startsWith('+') || digits.startsWith('00')
  if (digits.startsWith('00')) digits = digits.slice(2)

  // E.164 allows at most 15 digits; fewer than 8 is never a full number
  const plausible = (number) => (number.length >= 8 && number.length <= 15 ? number : '')

  if (international || digits.startsWith(ZW_COUNTRY_CODE)) return plausible(digits)

  // ZW national numbers are 10 digits with the trunk zero: 0786233766
  if (digits.startsWith('0')) {
    return digits.length === 10 ? ZW_COUNTRY_CODE + digits.slice(1) : ''
  }

  // bare ZW mobile without the zero: 786233766
  if (digits.length === 9 && digits.startsWith('7')) return ZW_COUNTRY_CODE + digits

  // long enough to already carry a country code, just typed without the +
  if (digits.length >= 11) return plausible(digits)

  return ''
}
