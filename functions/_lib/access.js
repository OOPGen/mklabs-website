/**
 * Cloudflare Access verification.
 *
 * Access already blocks unauthenticated requests at the edge, but only for the
 * paths its policy covers. If that policy is ever mis-scoped, an unprotected
 * /api/admin route would be writable by anyone on the internet. So every admin
 * request is verified here as well, and **fails closed**: if the environment
 * is not configured, nothing is authorised.
 *
 * Requires two environment variables:
 *   ACCESS_TEAM_DOMAIN   e.g. mklabs.cloudflareaccess.com
 *   ACCESS_AUD           the Application Audience tag from the Access app
 *
 * Directories under functions/ that start with "_" are ignored by the Pages
 * router, so this file is a shared module rather than a public endpoint.
 */

const CERTS_TTL_MS = 60 * 60 * 1000 // Cloudflare rotates signing keys periodically
let cachedCerts = { url: '', keys: null, fetchedAt: 0 }

function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(padded.padEnd(padded.length + ((4 - (padded.length % 4)) % 4), '='))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return bytes
}

function decodeJson(segment) {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(segment)))
}

async function getSigningKeys(teamDomain) {
  const url = `https://${teamDomain}/cdn-cgi/access/certs`
  const fresh = cachedCerts.url === url && Date.now() - cachedCerts.fetchedAt < CERTS_TTL_MS

  if (fresh && cachedCerts.keys) return cachedCerts.keys

  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not fetch Access certs (${response.status})`)

  const { keys } = await response.json()
  cachedCerts = { url, keys, fetchedAt: Date.now() }
  return keys
}

/**
 * Returns the verified identity, or null if the request is not authorised.
 * Never throws — callers treat null as "reject".
 */
export async function verifyAccess(request, env) {
  const teamDomain = env.ACCESS_TEAM_DOMAIN
  const audience = env.ACCESS_AUD

  // fail closed — an unconfigured deployment authorises nobody
  if (!teamDomain || !audience) return null

  const token =
    request.headers.get('Cf-Access-Jwt-Assertion') ||
    (request.headers.get('Cookie') || '').match(/CF_Authorization=([^;]+)/)?.[1]

  if (!token) return null

  const parts = token.split('.')
  if (parts.length !== 3) return null

  try {
    const header = decodeJson(parts[0])
    const payload = decodeJson(parts[1])

    if (header.alg !== 'RS256') return null

    // issuer and audience must match this Access application
    if (payload.iss !== `https://${teamDomain}`) return null
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud]
    if (!audiences.includes(audience)) return null

    const now = Math.floor(Date.now() / 1000)
    if (typeof payload.exp !== 'number' || payload.exp <= now) return null
    if (typeof payload.nbf === 'number' && payload.nbf > now + 60) return null

    const keys = await getSigningKeys(teamDomain)
    const jwk = keys.find((candidate) => candidate.kid === header.kid)
    if (!jwk) return null

    const key = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: 'RS256', ext: true },
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    )

    const signed = new TextEncoder().encode(`${parts[0]}.${parts[1]}`)
    const valid = await crypto.subtle.verify(
      'RSASSA-PKCS1-v1_5',
      key,
      base64UrlToBytes(parts[2]),
      signed
    )

    if (!valid) return null

    return { email: payload.email || 'unknown', expires: payload.exp }
  } catch {
    return null
  }
}

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })

export const unauthorised = () =>
  json({ success: false, error: 'Not authorised. Sign in through Cloudflare Access.' }, 403)
