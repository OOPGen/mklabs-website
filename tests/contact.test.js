import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { onRequestPost } from '../functions/api/contact.js'

const valid = { name: 'Tendai Moyo', email: 't@example.com', message: 'Hello', phone: '0786 233 766' }

let sent
let turnstilePasses
let resendOk

beforeEach(() => {
  sent = []
  turnstilePasses = true
  resendOk = true
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.stubGlobal('fetch', async (url, init) => {
    if (String(url).includes('turnstile')) return new Response(JSON.stringify({ success: turnstilePasses }))
    sent.push(JSON.parse(init.body))
    return new Response(resendOk ? '{}' : 'secret provider detail', { status: resendOk ? 200 : 500 })
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

async function post(body, env = { RESEND_API_KEY: 'key' }, raw) {
  const request = new Request('https://mklabs.co.zw/api/contact', {
    method: 'POST',
    body: raw ?? JSON.stringify(body),
  })
  const response = await onRequestPost({ request, env })
  return { status: response.status, ...(await response.json()) }
}

describe('POST /api/contact', () => {
  it('emails a valid enquiry with reply buttons', async () => {
    const result = await post(valid)
    expect(result).toMatchObject({ success: true, emailed: true })
    expect(sent).toHaveLength(1)
    expect(sent[0].reply_to).toBe('t@example.com')
    expect(sent[0].html).toContain('href="mailto:t@example.com"')
    expect(sent[0].text).toContain('tel:+263786233766')
  })

  it('refuses an email address that could break out of the link', async () => {
    const result = await post({ ...valid, email: 'x" href="https://evil.com' })
    expect(result.status).toBe(400)
    expect(sent).toHaveLength(0)
  })

  it('escapes visitor text in the HTML email', async () => {
    await post({ ...valid, name: '<img src=x onerror=alert(1)>' })
    expect(sent[0].html).not.toContain('<img src=x')
    expect(sent[0].html).toContain('&lt;img src=x')
  })

  it('enforces field limits', async () => {
    const result = await post({ ...valid, message: 'x'.repeat(5001) })
    expect(result.status).toBe(400)
    expect(result.error).toMatch(/Message is too long/)
  })

  it('refuses oversized and malformed bodies', async () => {
    expect((await post(null, undefined, 'x'.repeat(40000))).status).toBe(413)
    expect((await post(null, undefined, 'null')).status).toBe(400)
    expect((await post(null, undefined, '{not json')).status).toBe(400)
  })

  it('requires name, email and message', async () => {
    expect((await post({ ...valid, name: '' })).status).toBe(400)
  })

  it('quietly drops honeypot submissions', async () => {
    const result = await post({ ...valid, website: 'http://spam.example' })
    expect(result).toMatchObject({ success: true, emailed: true })
    expect(sent).toHaveLength(0)
  })

  it('keeps single-line fields on one line', async () => {
    await post({ ...valid, name: 'A\r\nBcc: victim@example.com' })
    expect(sent[0].subject).not.toMatch(/[\r\n]/)
  })

  it('omits call and WhatsApp links when the country is unknown', async () => {
    await post({ ...valid, phone: '07700 900123' })
    expect(sent[0].text).not.toContain('Call:')
    expect(sent[0].html).not.toContain('tel:+')
  })

  it('never shows provider errors to the visitor', async () => {
    resendOk = false
    const result = await post(valid)
    expect(result).toMatchObject({ emailed: false, reason: 'send_failed' })
    expect(JSON.stringify(result)).not.toContain('secret')
  })

  it('reports when email is not configured', async () => {
    expect(await post(valid, {})).toMatchObject({ success: true, emailed: false, reason: 'not_configured' })
  })

  describe('with Turnstile switched on', () => {
    const env = { RESEND_API_KEY: 'key', TURNSTILE_SECRET_KEY: 'secret' }

    it('refuses a submission without a token', async () => {
      expect((await post(valid, env)).status).toBe(400)
    })

    it('accepts a token Cloudflare vouches for', async () => {
      expect(await post({ ...valid, turnstileToken: 'token' }, env)).toMatchObject({ emailed: true })
    })

    it('refuses a token Cloudflare rejects', async () => {
      turnstilePasses = false
      expect((await post({ ...valid, turnstileToken: 'token' }, env)).status).toBe(400)
    })
  })
})
