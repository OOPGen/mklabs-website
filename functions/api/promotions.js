/**
 * Public endpoint — GET /api/promotions
 *
 * Returns only the promotions a visitor should see: switched on, and inside
 * their date window. Expired or draft promos never leave the server.
 */

import { isLive, readAll, todayInHarare } from '../_lib/promotions.js'

export async function onRequestGet({ env }) {
  // No KV bound yet — behave like "no promotions", not like an error.
  if (!env.PROMOS) {
    return new Response(JSON.stringify({ promotions: [] }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' },
    })
  }

  const today = todayInHarare()
  const promotions = (await readAll(env))
    .filter((promotion) => isLive(promotion, today))
    .map(({ id, title, body, badge, ctaLabel, ctaHref }) => ({
      id,
      title,
      body,
      badge,
      ctaLabel,
      ctaHref,
    }))

  return new Response(JSON.stringify({ promotions }), {
    headers: {
      'Content-Type': 'application/json',
      // short cache so an edit shows up quickly without hammering KV
      'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
    },
  })
}
