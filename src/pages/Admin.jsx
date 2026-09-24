import { useEffect, useState } from 'react'
import Button from '../components/Button.jsx'
import { Container } from '../components/Section.jsx'

/**
 * Promotions dashboard.
 *
 * Cloudflare Access guards this route, so by the time the page loads the
 * visitor has already signed in and the browser is carrying the Access cookie.
 * The API verifies that cookie again on every request.
 */

const newId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? `promo-${crypto.randomUUID().slice(0, 18)}`
    : `promo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const blank = () => ({
  id: newId(),
  title: '',
  body: '',
  badge: '',
  ctaLabel: '',
  ctaHref: '',
  active: true,
  startsAt: '',
  endsAt: '',
})

const field =
  'w-full min-h-[46px] rounded-xl border border-night/15 bg-white px-3.5 text-[15px] outline-none ' +
  'focus:border-purple dark:border-white/15 dark:bg-white/5 dark:focus:border-iris'
const label = 'block text-[12px] font-semibold mb-1.5 text-night/70 dark:text-lavender/70'

export default function Admin() {
  const [promotions, setPromotions] = useState([])
  const [saved, setSaved] = useState('[]')
  const [status, setStatus] = useState('loading') // loading | ready | denied | error
  const [message, setMessage] = useState('')
  const [signedInAs, setSignedInAs] = useState('')
  const [saving, setSaving] = useState(false)
  const [version, setVersion] = useState('')
  const [conflict, setConflict] = useState(null) // the newer list someone else saved

  useEffect(() => {
    fetch('/api/admin/promotions')
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))

        if (response.status === 403) {
          setStatus('denied')
          setMessage(data.error || 'Not authorised.')
          return
        }
        if (!response.ok) {
          setStatus('error')
          setMessage(data.error || `Server responded ${response.status}`)
          return
        }

        /* A 200 that isn't our JSON means the Function never ran — the request
           fell through to the SPA fallback and returned index.html. Say so,
           rather than showing a convincing but empty dashboard. */
        if (data.success !== true) {
          setStatus('error')
          setMessage(
            'The promotions API did not respond. This page only works on the deployed site, ' +
              'and needs the PROMOS KV namespace bound to the Pages project.'
          )
          return
        }

        const list = Array.isArray(data.promotions) ? data.promotions : []
        setPromotions(list)
        setSaved(JSON.stringify(list))
        setSignedInAs(data.signedInAs || '')
        setVersion(data.version || '')
        setStatus('ready')
      })
      .catch((error) => {
        setStatus('error')
        setMessage(error.message)
      })
  }, [])

  const dirty = JSON.stringify(promotions) !== saved

  /* warn before unsaved edits are lost — closing the tab, reloading, or
     following a link to another page of the site */
  useEffect(() => {
    if (!dirty) return

    const leaving = 'You have unsaved changes. Leave without saving?'

    function onBeforeUnload(event) {
      event.preventDefault()
      event.returnValue = ''
    }

    // capture phase on document runs before React Router's own click handling
    function onClick(event) {
      const link = event.target.closest?.('a[href]')
      if (!link || link.target === '_blank' || event.defaultPrevented) return
      if (/^(mailto|tel):/i.test(link.getAttribute('href'))) return // opens another app, page stays
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
      if (!window.confirm(leaving)) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onClick, true)
    }
  }, [dirty])

  function remove(index) {
    const title = promotions[index]?.title.trim() || 'this untitled promotion'
    if (!window.confirm(`Delete "${title}"? It disappears from your site when you save.`)) return
    setPromotions((current) => current.filter((_, position) => position !== index))
  }

  function loadTheirs() {
    setPromotions(conflict.promotions)
    setSaved(JSON.stringify(conflict.promotions))
    setVersion(conflict.version)
    setConflict(null)
    setMessage('')
  }

  function update(index, key, value) {
    setPromotions((current) =>
      current.map((promotion, position) =>
        position === index ? { ...promotion, [key]: value } : promotion
      )
    )
  }

  function move(index, direction) {
    setPromotions((current) => {
      const next = [...current]
      const target = index + direction
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }

  /** `baseVersion` is what the edits were made against; "keep mine" passes the newer one. */
  async function save(baseVersion = version) {
    setSaving(true)
    setMessage('')
    setConflict(null)

    try {
      const response = await fetch('/api/admin/promotions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promotions, baseVersion }),
      })
      const data = await response.json().catch(() => ({}))

      if (response.status === 409 && data.conflict) {
        setConflict({
          promotions: Array.isArray(data.promotions) ? data.promotions : [],
          version: data.version || '',
          updatedBy: data.updatedBy || '',
          updatedAt: data.updatedAt || '',
        })
      } else if (!response.ok) {
        setMessage(data.error || `Could not save (${response.status})`)
      } else {
        const list = Array.isArray(data.promotions) ? data.promotions : promotions
        setPromotions(list)
        setSaved(JSON.stringify(list))
        setVersion(data.version || '')
        setMessage('Saved. Your website is updated.')
      }
    } catch (error) {
      setMessage(`Could not save — ${error.message}`)
    }

    setSaving(false)
  }

  /* ------------------------------------------------------------- states */
  if (status === 'loading') {
    return (
      <Container className="py-24 text-center">
        <p className="text-night/60 dark:text-lavender/60">Loading your promotions…</p>
      </Container>
    )
  }

  if (status === 'denied' || status === 'error') {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-lg rounded-2xl border border-amber-500/30 bg-amber-500/8 p-8 text-center">
          <div className="text-4xl">{status === 'denied' ? '🔒' : '⚠️'}</div>
          <h1 className="mt-4 text-xl font-bold">
            {status === 'denied' ? 'Not signed in' : 'Dashboard not ready'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-night/65 dark:text-lavender/65">{message}</p>
          <div className="mt-6">
            <Button onClick={() => window.location.reload()}>Try again</Button>
          </div>
        </div>
      </Container>
    )
  }

  /* ------------------------------------------------------------ the app */
  return (
    <Container className="py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Promotions</h1>
          <p className="mt-1.5 text-sm text-night/60 dark:text-lavender/60">
            These appear on your home page. Changes go live the moment you save.
            {signedInAs && <> Signed in as <strong>{signedInAs}</strong>.</>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {dirty && <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">Unsaved changes</span>}
          <Button onClick={() => save()} disabled={saving || !dirty} className="disabled:opacity-50">
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </header>

      {message && (
        <p
          role="status"
          className={`mt-5 rounded-xl px-4 py-3 text-sm font-semibold ${
            message.startsWith('Saved')
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          {message}
        </p>
      )}

      {conflict && (
        <div role="alert" className="mt-5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300">
            Not saved — someone else saved changes after you opened this page
            {conflict.updatedBy && <> ({conflict.updatedBy}</>}
            {conflict.updatedAt && (
              <>
                {conflict.updatedBy ? ', ' : ' ('}
                {new Date(conflict.updatedAt).toLocaleString('en-GB', {
                  timeZone: 'Africa/Harare',
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </>
            )}
            {(conflict.updatedBy || conflict.updatedAt) && ')'}.
          </p>
          <p className="mt-1 text-night/70 dark:text-lavender/70">
            Their version has {conflict.promotions.length}{' '}
            {conflict.promotions.length === 1 ? 'promotion' : 'promotions'}. Load theirs and redo your
            edits, or keep yours and replace what they saved.
          </p>
          <div className="mt-3 flex flex-wrap gap-3">
            <Button variant="ghost" onClick={loadTheirs}>
              Load their version
            </Button>
            <Button onClick={() => save(conflict.version)} disabled={saving} className="disabled:opacity-50">
              Keep mine and save
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-5">
        {promotions.length === 0 && (
          <div className="rounded-2xl border border-dashed border-night/20 p-10 text-center dark:border-white/15">
            <p className="text-night/60 dark:text-lavender/60">
              No promotions yet. Add one and it appears on your home page.
            </p>
          </div>
        )}

        {promotions.map((promotion, index) => (
          <article
            key={promotion.id}
            className="rounded-2xl border border-night/10 bg-white p-5 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-night/10 pb-4 dark:border-white/10">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={promotion.active}
                  onChange={(event) => update(index, 'active', event.target.checked)}
                  className="h-5 w-5 accent-purple"
                />
                {promotion.active ? 'Showing on site' : 'Hidden'}
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label="Move up"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-night/15 disabled:opacity-30 dark:border-white/15"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => move(index, 1)}
                  disabled={index === promotions.length - 1}
                  aria-label="Move down"
                  className="grid h-10 w-10 place-items-center rounded-lg border border-night/15 disabled:opacity-30 dark:border-white/15"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="ml-1 grid h-10 min-w-[76px] place-items-center rounded-lg border border-red-500/30 px-3 text-sm font-semibold text-red-600 dark:text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <div>
                  <label className={label} htmlFor={`title-${promotion.id}`}>Headline *</label>
                  <input
                    id={`title-${promotion.id}`}
                    className={field}
                    value={promotion.title}
                    onChange={(event) => update(index, 'title', event.target.value)}
                    placeholder="Free setup on MKLabs POS this August"
                  />
                </div>
                <div>
                  <label className={label} htmlFor={`badge-${promotion.id}`}>Badge</label>
                  <input
                    id={`badge-${promotion.id}`}
                    className={field}
                    value={promotion.badge}
                    onChange={(event) => update(index, 'badge', event.target.value)}
                    placeholder="20% off"
                  />
                </div>
              </div>

              <div>
                <label className={label} htmlFor={`body-${promotion.id}`}>Details</label>
                <textarea
                  id={`body-${promotion.id}`}
                  rows={3}
                  className={`${field} resize-y py-2.5`}
                  value={promotion.body}
                  onChange={(event) => update(index, 'body', event.target.value)}
                  placeholder="What the offer is, who it is for, and what they get."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor={`cta-${promotion.id}`}>Button text</label>
                  <input
                    id={`cta-${promotion.id}`}
                    className={field}
                    value={promotion.ctaLabel}
                    onChange={(event) => update(index, 'ctaLabel', event.target.value)}
                    placeholder="Claim this offer"
                  />
                </div>
                <div>
                  <label className={label} htmlFor={`href-${promotion.id}`}>Button link</label>
                  <input
                    id={`href-${promotion.id}`}
                    className={field}
                    value={promotion.ctaHref}
                    onChange={(event) => update(index, 'ctaHref', event.target.value)}
                    placeholder="/contact or https://wa.me/263786233766"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor={`start-${promotion.id}`}>Starts (optional)</label>
                  <input
                    id={`start-${promotion.id}`}
                    type="date"
                    className={field}
                    value={promotion.startsAt}
                    onChange={(event) => update(index, 'startsAt', event.target.value)}
                  />
                </div>
                <div>
                  <label className={label} htmlFor={`end-${promotion.id}`}>Ends (optional)</label>
                  <input
                    id={`end-${promotion.id}`}
                    type="date"
                    className={field}
                    value={promotion.endsAt}
                    onChange={(event) => update(index, 'endsAt', event.target.value)}
                  />
                </div>
              </div>

              <p className="text-xs text-night/50 dark:text-lavender/50">
                Leave the dates empty to run the offer until you switch it off. Outside those dates
                it hides itself automatically.
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button variant="ghost" onClick={() => setPromotions((current) => [...current, blank()])}>
          + Add a promotion
        </Button>
        <Button onClick={() => save()} disabled={saving || !dirty} className="disabled:opacity-50">
          {saving ? 'Saving…' : 'Save changes'}
        </Button>
      </div>
    </Container>
  )
}
