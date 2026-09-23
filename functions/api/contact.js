/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Emails every enquiry to MKLabs with the visitor's details, and makes their
 * phone number directly actionable: one tap to WhatsApp them, one to call.
 *
 * Cloudflare Workers cannot open an SMTP connection, so mail goes out over
 * Resend's HTTP API. Set these in the Cloudflare dashboard under
 * Settings → Environment variables:
 *
 *   RESEND_API_KEY   key from resend.com          (required to send)
 *   CONTACT_TO       comma-separated recipients   (optional)
 *   CONTACT_FROM     verified sender address      (optional)
 *   TURNSTILE_SECRET_KEY  Cloudflare Turnstile secret — when set, every
 *                    enquiry must carry a valid widget token (optional)
 *
 * Without a key the endpoint reports `emailed: false` and the form falls back
 * to its WhatsApp route, so an enquiry is never silently lost.
 */

import {
  HONEYPOT_FIELD,
  LIMITS,
  MAX_BODY_BYTES,
  isValidEmail,
  toWhatsAppNumber,
} from '../_lib/enquiry.js'

const DEFAULT_TO = 'info@mklabs.co.zw, support@mklabs.co.zw'
const DEFAULT_FROM = 'MKLabs Website <noreply@mklabs.co.zw>'
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

const reject = (error, status = 400) => json({ success: false, error }, status)

/** Keep visitor-supplied text from breaking the HTML email — values and attributes alike. */
function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const FIELD_LABELS = {
  name: 'Name',
  company: 'Company',
  email: 'Email',
  phone: 'Phone',
  service: 'Interest',
  budget: 'Budget',
  message: 'Message',
}

/**
 * Cloudflare Turnstile, switched on by setting TURNSTILE_SECRET_KEY.
 * Without the secret the check is skipped, so the form keeps working before
 * the widget is configured.
 */
async function passesTurnstile(token, request, env) {
  if (!env.TURNSTILE_SECRET_KEY) return true
  if (!token) return false

  const form = new FormData()
  form.append('secret', env.TURNSTILE_SECRET_KEY)
  form.append('response', String(token).slice(0, 2048))
  const ip = request.headers.get('CF-Connecting-IP')
  if (ip) form.append('remoteip', ip)

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, { method: 'POST', body: form })
    const result = await response.json()
    return result.success === true
  } catch (error) {
    // fail closed — if Cloudflare cannot vouch for the visitor, nothing is sent
    console.error('Turnstile verification failed:', error)
    return false
  }
}

export async function onRequestPost({ request, env }) {
  const declaredLength = Number(request.headers.get('Content-Length') || 0)
  if (declaredLength > MAX_BODY_BYTES) return reject('Enquiry is too large', 413)

  let body
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_BYTES) return reject('Enquiry is too large', 413)
    body = JSON.parse(raw)
  } catch {
    return reject('Invalid JSON body')
  }
  if (!body || typeof body !== 'object') return reject('Invalid JSON body')

  /* Bots fill every field. Pretend it worked so they have nothing to tune against. */
  if (String(body[HONEYPOT_FIELD] || '').trim()) {
    return json({ success: true, emailed: true })
  }

  const fields = {}
  for (const [field, limit] of Object.entries(LIMITS)) {
    let value = typeof body[field] === 'string' ? body[field].trim() : ''
    // only the message may span lines — the rest end up in a subject or a table cell
    if (field !== 'message') value = value.replace(/[\u0000-\u001f\u007f]+/g, ' ')
    if (value.length > limit) {
      return reject(`${FIELD_LABELS[field]} is too long (at most ${limit} characters)`)
    }
    fields[field] = value
  }

  const { name, company, email, phone, service, budget, message } = fields

  if (!name || !email || !message) {
    return reject('Name, email and message are required')
  }
  if (!isValidEmail(email)) {
    return reject('Please enter a valid email address')
  }

  if (!(await passesTurnstile(body.turnstileToken, request, env))) {
    return reject('Please complete the spam check and try again')
  }

  const waNumber = toWhatsAppNumber(phone)
  const waGreeting = `Hello ${name.split(' ')[0]}, thank you for contacting MKLabs about ${service || 'your enquiry'}.`
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waGreeting)}` : ''

  const received = new Date().toLocaleString('en-GB', {
    timeZone: 'Africa/Harare',
    dateStyle: 'full',
    timeStyle: 'short',
  })

  /* ---------------------------------------------------------- plain text */
  const text = [
    'NEW MKLABS ENQUIRY',
    '',
    `Name:     ${name}`,
    company && `Company:  ${company}`,
    `Email:    ${email}`,
    phone && `Phone:    ${phone}`,
    service && `Interest: ${service}`,
    budget && `Budget:   ${budget}`,
    '',
    'MESSAGE',
    message,
    '',
    '— REPLY —',
    `Email:    ${email}`,
    waNumber && `Call:     tel:+${waNumber}`,
    waLink && `WhatsApp: ${waLink}`,
    '',
    `Received: ${received} (Harare)`,
    'Sent from mklabs.co.zw',
  ]
    .filter(Boolean)
    .join('\n')

  /* --------------------------------------------------------------- HTML */
  const row = (label, value) =>
    value
      ? `<tr>
           <td style="padding:6px 14px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${label}</td>
           <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600">${escapeHtml(value)}</td>
         </tr>`
      : ''

  const button = (href, label, colour) =>
    href
      ? `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:999px;background:${colour};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">${label}</a>`
      : ''

  const html = `
  <div style="margin:0;padding:24px;background:#f5f3ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(27,0,63,.12)">

      <div style="padding:24px;background:linear-gradient(120deg,#1B003F,#4B0082)">
        <div style="color:#DBC9F9;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">New website enquiry</div>
        <div style="color:#ffffff;font-size:22px;font-weight:700;margin-top:6px">${escapeHtml(name)}${company ? ` · ${escapeHtml(company)}` : ''}</div>
        ${service ? `<div style="color:#A78BFA;font-size:14px;margin-top:4px">Interested in ${escapeHtml(service)}</div>` : ''}
      </div>

      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          ${row('Name', name)}
          ${row('Company', company)}
          ${row('Email', email)}
          ${row('Phone', phone)}
          ${row('Interest', service)}
          ${row('Budget', budget)}
        </table>

        <div style="margin-top:20px;padding:16px;background:#f9fafb;border-left:3px solid #4B0082;border-radius:8px">
          <div style="color:#6b7280;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">Message</div>
          <div style="color:#111827;font-size:15px;line-height:1.6;margin-top:8px;white-space:pre-wrap">${escapeHtml(message)}</div>
        </div>

        <div style="margin-top:24px">
          <div style="color:#6b7280;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-bottom:10px">Reply to ${escapeHtml(name.split(' ')[0])}</div>
          ${button(waLink, '💬 WhatsApp', '#25D366')}
          ${button(waNumber ? `tel:+${waNumber}` : '', '📞 Call', '#4B0082')}
          ${button(`mailto:${email}`, '✉️ Email', '#191970')}
        </div>
      </div>

      <div style="padding:16px 24px;background:#f9fafb;color:#9ca3af;font-size:12px">
        Received ${escapeHtml(received)} (Harare) · sent from mklabs.co.zw
      </div>
    </div>
  </div>`

  /* --------------------------------------------------------------- send */
  const apiKey = env.RESEND_API_KEY
  if (!apiKey) {
    return json({ success: true, emailed: false, reason: 'not_configured' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM || DEFAULT_FROM,
        to: (env.CONTACT_TO || DEFAULT_TO).split(',').map((address) => address.trim()),
        reply_to: email,
        subject: `New enquiry — ${service || 'General'} — ${name}`,
        text,
        html,
      }),
    })

    if (!response.ok) {
      // the detail stays in the Functions log — visitors only learn it did not send
      console.error(`Resend rejected enquiry (${response.status}):`, await response.text())
      return json({ success: true, emailed: false, reason: 'send_failed' })
    }

    return json({ success: true, emailed: true })
  } catch (error) {
    console.error('Could not reach Resend:', error)
    return json({ success: true, emailed: false, reason: 'send_failed' })
  }
}
