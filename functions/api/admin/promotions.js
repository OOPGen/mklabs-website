/**
 * Admin endpoint — GET/PUT /api/admin/promotions
 *
 * Cloudflare Access should already be blocking this path at the edge; the
 * verification here is the second lock, so a mis-scoped Access policy cannot
 * leave the site editable by the public.
 *
 * GET returns every promotion including drafts and expired ones.
 * PUT replaces the whole list — the dashboard always sends the full set.
 */

import { json, unauthorised, verifyAccess } from '../../_lib/access.js'
import { MAX_PROMOTIONS, normalise, readAll, validate, writeAll } from '../../_lib/promotions.js'

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

  return json({
    success: true,
    signedInAs: identity.email,
    limit: MAX_PROMOTIONS,
    promotions: await readAll(env),
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

  const promotions = incoming.map(normalise)

  const problem = validate(promotions)
  if (problem) return json({ success: false, error: problem }, 400)

  await writeAll(env, promotions)

  return json({ success: true, savedBy: identity.email, promotions })
}
