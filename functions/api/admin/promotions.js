/**
 * Admin endpoint — GET/PUT /api/admin/promotions
 *
 * Cloudflare Access should already be blocking this path at the edge; the
 * verification here is the second lock, so a mis-scoped Access policy cannot
 * leave the site editable by the public.
 *
 * GET returns every promotion including drafts and expired ones, plus the
 * list's current version.
 * PUT replaces the whole list — the dashboard always sends the full set — and
 * must name the version it was edited from. If someone saved in between, the
 * PUT is refused with 409 and the latest list, so nobody's work is silently
 * overwritten. (KV is eventually consistent, so two saves within about a
 * minute from different locations can still slip past; for a small team
 * editing a handful of offers that is an acceptable edge.)
 */

import { json, unauthorised, verifyAccess } from '../../_lib/access.js'
import { MAX_PROMOTIONS, normalise, readStored, validate, writeAll } from '../../_lib/promotions.js'

const noKvConfigured = () =>
  json(
    {
      success: false,
      error:
        'No KV namespace bound. In the Cloudflare dashboard add a KV binding named PROMOS to this Pages project, then redeploy.',
    },
    503
  )

export async function onRequestGet({ request, env }) {
  const identity = await verifyAccess(request, env)
  if (!identity) return unauthorised()
  if (!env.PROMOS) return noKvConfigured()

  const stored = await readStored(env)

  return json({
    success: true,
    signedInAs: identity.email,
    limit: MAX_PROMOTIONS,
    ...stored,
  })
}

export async function onRequestPut({ request, env }) {
  const identity = await verifyAccess(request, env)
  if (!identity) return unauthorised()
  if (!env.PROMOS) return noKvConfigured()

  let body
  try {
    body = await request.json()
  } catch {
    return json({ success: false, error: 'Invalid JSON body' }, 400)
  }

  const incoming = Array.isArray(body?.promotions) ? body.promotions : null
  if (!incoming) return json({ success: false, error: 'Expected { promotions: [...] }' }, 400)

  const baseVersion = typeof body.baseVersion === 'string' ? body.baseVersion : ''
  if (!baseVersion) {
    return json({ success: false, error: 'This dashboard is out of date. Reload the page and try again.' }, 400)
  }

  const promotions = incoming.map(normalise)

  const problem = validate(promotions)
  if (problem) return json({ success: false, error: problem }, 400)

  const current = await readStored(env)
  if (current.version !== baseVersion) {
    return json(
      {
        success: false,
        conflict: true,
        error: 'Someone else saved changes after you opened this page.',
        ...current,
      },
      409
    )
  }

  const version = await writeAll(env, promotions, identity.email)

  return json({ success: true, savedBy: identity.email, promotions, version })
}
