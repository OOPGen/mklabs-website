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
 *
 * Without a key the endpoint reports `emailed: false` and the form falls back
 * to its WhatsApp route, so an enquiry is never silently lost.
 */

const DEFAULT_TO = 'info@mklabs.co.zw, support@mklabs.co.zw'
const DEFAULT_FROM = 'MKLabs Website <noreply@mklabs.co.zw>'
const ZW_COUNTRY_CODE = '263'

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

/**
 * Turn what a visitor typed into a number wa.me will accept.
 * Zimbabwean numbers are usually given locally — "0786 233 766" — but wa.me
 * needs the country code and no leading zero: 263786233766.
 */
function toWhatsAppNumber(input) {
  let digits = String(input || '').replace(/[^0-9]/g, '')
  if (!digits) return ''

  // 00263… international prefix
  if (digits.startsWith('00')) digits = digits.slice(2)

  // already has the country code
  if (digits.startsWith(ZW_COUNTRY_CODE)) return digits

  // local form: 0786233766 → 263786233766
  if (digits.startsWith('0')) return ZW_COUNTRY_CODE + digits.slice(1)

  // bare mobile without the zero: 786233766
  if (digits.length === 9) return ZW_COUNTRY_CODE + digits

  return digits
}

/** Keep visitor-supplied text from breaking the HTML email. */
function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function onRequestPost({ request, env }) {
  let body
  try {
    body = await request.json()
  } catch {
    return json({ success: false, error: 'Invalid JSON body' }, 400)
  }

  const name = (body.name || '').trim()
  const email = (body.email || '').trim()
  const message = (body.message || '').trim()

  if (!name || !email || !message) {
    return json({ success: false, error: 'Name, email and message are required' }, 400)
  }

  const company = (body.company || '').trim()
  const phone = (body.phone || '').trim()
  const service = (body.service || '').trim()
  const budget = (body.budget || '').trim()

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
    phone && `Call:     tel:+${waNumber}`,
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
      ? `<a href="${href}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:999px;background:${colour};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none">${label}</a>`
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
    return json({ success: true, emailed: false, reason: 'RESEND_API_KEY not configured' })
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
      const detail = await response.text()
      return json({ success: true, emailed: false, reason: `Provider error: ${detail}` })
    }

    return json({ success: true, emailed: true })
  } catch (error) {
    return json({ success: true, emailed: false, reason: error.message })
  }
}
