import { useState } from 'react'
import { contact, waLink } from '../data/site.js'
import { products } from '../data/products.js'
import { HONEYPOT_FIELD, LIMITS, isValidEmail } from '../../functions/_lib/enquiry.js'
import Button from './Button.jsx'
import Turnstile from './Turnstile.jsx'
import { TURNSTILE_SITE_KEY } from './turnstileKey.js'
import { trackEvent } from '../analytics.js'

const serviceOptions = [
  ...products.map((product) => product.name),
  'Custom software',
  'Website development',
  'Security & networking',
  'Cloud & IT support',
  'Not sure yet',
]

const budgetOptions = ['Under $500', '$500 – $2,000', '$2,000 – $5,000', 'Over $5,000', 'Prefer to discuss']

const empty = { name: '', company: '', email: '', phone: '', service: '', budget: '', message: '' }

/*
 * The on-device copy exists so an enquiry survives a failed send. It holds
 * personal details, so keep only a few recent ones and drop each the moment
 * it is confirmed in the inbox — shared office PCs should not collect them.
 */
const STORAGE_KEY = 'mklabs-enquiries'
const KEEP_AT_MOST = 5
const KEEP_FOR_MS = 30 * 24 * 60 * 60 * 1000

function updateStoredEnquiries(change) {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    const cutoff = Date.now() - KEEP_FOR_MS
    const recent = (Array.isArray(stored) ? stored : []).filter(
      (entry) => Date.parse(entry?.submittedAt) > cutoff
    )
    const next = change(recent).slice(-KEEP_AT_MOST)
    if (next.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* private mode or storage full — not worth blocking the send */
  }
}

const fieldClass =
  'w-full min-h-[52px] rounded-xl border border-night/15 bg-white px-4 text-[15px] outline-none transition-colors ' +
  'focus:border-purple dark:border-white/15 dark:bg-white/5 dark:focus:border-iris'

const labelClass = 'block text-[13px] font-semibold mb-1.5'

/**
 * Enquiry form.
 *
 * A submission fans out so it can never silently vanish:
 *   1. saved to localStorage  — kept only until the email is confirmed
 *   2. POSTed to /api/contact — the Cloudflare Pages Function
 *   3. offered as a prefilled WhatsApp draft — the channel MKLabs answers fastest
 */
export default function ContactForm() {
  const [values, setValues] = useState(empty)
  const [state, setState] = useState('idle') // idle | sending | sent
  const [emailed, setEmailed] = useState(false)
  const [error, setError] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [turnstileReset, setTurnstileReset] = useState(0)

  function update(field) {
    return (event) => setValues((previous) => ({ ...previous, [field]: event.target.value }))
  }

  function buildWhatsAppMessage(data) {
    return [
      `Hello MKLabs! I would like to enquire.`,
      ``,
      `Name: ${data.name}`,
      data.company && `Company: ${data.company}`,
      `Email: ${data.email}`,
      data.phone && `Phone: ${data.phone}`,
      data.service && `Interested in: ${data.service}`,
      data.budget && `Budget: ${data.budget}`,
      ``,
      data.message,
    ]
      .filter(Boolean)
      .join('\n')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!values.name.trim() || !values.email.trim() || !values.message.trim()) {
      setError('Please fill in your name, email and message.')
      return
    }
    if (!isValidEmail(values.email.trim())) {
      setError('Please enter a valid email address.')
      return
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError('Please complete the spam check above the button.')
      return
    }

    setState('sending')
    const submission = { ...values, submittedAt: new Date().toISOString() }
    const isThisOne = (entry) => entry.submittedAt === submission.submittedAt

    /* 1. never lose the enquiry, even if the network fails */
    updateStoredEnquiries((stored) => [...stored, submission])

    /* 2. hand it to the serverless mail function */
    let delivered = false
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...submission, [HONEYPOT_FIELD]: honeypot, turnstileToken }),
      })
      const result = await response.json()

      /* the server refused what was typed — say why, and let them fix it */
      if (response.status === 400 && result.error) {
        updateStoredEnquiries((stored) => stored.filter((entry) => !isThisOne(entry)))
        setTurnstileReset((count) => count + 1)
        setError(result.error)
        setState('idle')
        return
      }

      delivered = Boolean(response.ok && result.emailed)
    } catch {
      /* offline, or the endpoint isn't there yet — WhatsApp still carries it */
    }

    if (delivered) updateStoredEnquiries((stored) => stored.filter((entry) => !isThisOne(entry)))
    setTurnstileReset((count) => count + 1)
    setEmailed(delivered)
    setState('sent')
    trackEvent('generate_lead', { form: 'contact', service: values.service || 'unspecified' })
  }

  if (state === 'sent') {
    return (
      <div
        className={`rounded-3xl border p-8 text-center text-night dark:text-lavender ${
          emailed ? 'border-emerald-500/25 bg-emerald-500/8' : 'border-amber-500/30 bg-amber-500/8'
        }`}
      >
        <div className="text-4xl">{emailed ? '✅' : '📩'}</div>
        <h2 className="mt-4 text-xl font-bold">Thank you, {values.name.split(' ')[0]}.</h2>

        {emailed ? (
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-night/65 dark:text-lavender/65">
            Your enquiry is in our inbox. We reply within one working day — by email, or a call from{' '}
            {contact.phones[0].label}.
          </p>
        ) : (
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-night/65 dark:text-lavender/65">
            Your enquiry is saved on this device, but we could not confirm it reached our inbox.
            <strong className="block pt-1 text-night dark:text-lavender">
              Please tap WhatsApp below so we definitely get it.
            </strong>
          </p>
        )}

        <p className="mt-5 text-sm font-semibold">
          {emailed ? 'Want a faster answer? Send it straight to WhatsApp:' : 'Send it now on WhatsApp:'}
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button href={waLink(buildWhatsAppMessage(values))} variant="whatsapp">
            💬 Send on WhatsApp
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setValues(empty)
              setState('idle')
            }}
          >
            Send another
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="relative rounded-3xl border border-night/10 bg-white p-6 text-night sm:p-8 dark:border-white/10 dark:bg-white/5 dark:text-lavender">
      <h2 className="text-xl font-bold">Request a demo or a quote</h2>
      <p className="mt-1.5 text-sm text-night/60 dark:text-lavender/60">
        Tell us what you need. Fields marked * are required.
      </p>

      <div className="mt-6 grid gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="name">Your name *</label>
            <input id="name" maxLength={LIMITS.name} className={fieldClass} value={values.name} onChange={update('name')} autoComplete="name" required />
          </div>
          <div>
            <label className={labelClass} htmlFor="company">Company or school</label>
            <input id="company" maxLength={LIMITS.company} className={fieldClass} value={values.company} onChange={update('company')} autoComplete="organization" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="email">Email *</label>
            <input id="email" maxLength={LIMITS.email} type="email" className={fieldClass} value={values.email} onChange={update('email')} autoComplete="email" required />
          </div>
          <div>
            <label className={labelClass} htmlFor="phone">Phone or WhatsApp</label>
            <input id="phone" maxLength={LIMITS.phone} type="tel" className={fieldClass} value={values.phone} onChange={update('phone')} autoComplete="tel" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="service">What are you interested in?</label>
            <select id="service" className={fieldClass} value={values.service} onChange={update('service')}>
              <option value="">Choose one…</option>
              {serviceOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="budget">Budget range</label>
            <select id="budget" className={fieldClass} value={values.budget} onChange={update('budget')}>
              <option value="">Choose one…</option>
              {budgetOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass} htmlFor="message">How can we help? *</label>
          <textarea
            id="message"
            maxLength={LIMITS.message}
            rows={5}
            className={`${fieldClass} py-3 resize-y`}
            value={values.message}
            onChange={update('message')}
            placeholder="Tell us about your business and what you would like the system to do."
            required
          />
        </div>

        {/* honeypot: off-screen and skipped by keyboard and screen readers */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={HONEYPOT_FIELD}>Leave this empty</label>
          <input
            id={HONEYPOT_FIELD}
            name={HONEYPOT_FIELD}
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(event) => setHoneypot(event.target.value)}
          />
        </div>

        <Turnstile onToken={setTurnstileToken} resetKey={turnstileReset} />

        {error && (
          <p role="alert" className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <Button
          type="submit"
          className="w-full disabled:opacity-60"
          disabled={state === 'sending'}
        >
          {state === 'sending' ? 'Sending…' : 'Send enquiry →'}
        </Button>

        <p className="text-center text-xs text-night/50 dark:text-lavender/50">
          Prefer to talk? WhatsApp {contact.phones[0].label} — {' '}
          <a href={waLink('Hello MKLabs!')} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple underline dark:text-iris">
            open a chat
          </a>
          .
        </p>
      </div>
    </form>
  )
}
