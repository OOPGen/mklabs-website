import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { onRequestGet, onRequestPut } from '../functions/api/admin/promotions.js'
import { onRequestGet as publicGet } from '../functions/api/promotions.js'
import { KV_KEY } from '../functions/_lib/promotions.js'

const team = 'mklabs.cloudflareaccess.com'
const aud = 'test-audience'
let keys

const b64 = (value) => Buffer.from(typeof value === 'string' ? value : JSON.stringify(value)).toString('base64url')

/** A real RS256 Cloudflare Access token, signed with a key the mocked certs endpoint serves. */
async function accessToken(email, claims = {}, header = {}) {
  const head = b64({ alg: 'RS256', kid: 'test-key', ...header })
  const body = b64({ iss: `https://${team}`, aud: [aud], email, exp: Math.floor(Date.now() / 1000) + 600, ...claims })
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', keys.privateKey, new TextEncoder().encode(`${head}.${body}`))
  return `${head}.${body}.${Buffer.from(signature).toString('base64url')}`
}

function memoryKv() {
  const store = new Map()
  return {
    store,
    async get(key) {
      return store.get(key)?.value ?? null
    },
    async getWithMetadata(key) {
      const entry = store.get(key)
      return { value: entry?.value ?? null, metadata: entry?.metadata ?? null }
    },
    async put(key, value, options = {}) {
      store.set(key, { value, metadata: options.metadata ?? null })
    },
  }
}

let env

beforeAll(async () => {
  keys = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify']
  )
  const jwk = { ...(await crypto.subtle.exportKey('jwk', keys.publicKey)), kid: 'test-key' }
  vi.stubGlobal('fetch', async (url) => {
    if (!String(url).endsWith('/cdn-cgi/access/certs')) throw new Error(`unexpected fetch ${url}`)
    return new Response(JSON.stringify({ keys: [jwk] }))
  })
})

beforeEach(() => {
  env = { ACCESS_TEAM_DOMAIN: team, ACCESS_AUD: aud, PROMOS: memoryKv() }
})

async function call(handler, { email = 'alice@mklabs.co.zw', method = 'GET', body, token } = {}) {
  const request = new Request('https://mklabs.co.zw/api/admin/promotions', {
    method,
    headers: { 'Cf-Access-Jwt-Assertion': token ?? (await accessToken(email)), 'Content-Type': 'application/json' },
    body: body && JSON.stringify(body),
  })
  const response = await handler({ request, env })
  return { status: response.status, ...(await response.json()) }
}

const promo = (id, title) => ({ id, title, active: true })

describe('Cloudflare Access verification', () => {
  it('lets a valid token through', async () => {
    expect((await call(onRequestGet)).signedInAs).toBe('alice@mklabs.co.zw')
  })

  it.each([
    ['no token', ''],
    ['a wrong audience', () => accessToken('x@y.z', { aud: ['someone-else'] })],
    ['a wrong issuer', () => accessToken('x@y.z', { iss: 'https://evil.cloudflareaccess.com' })],
    ['an expired token', () => accessToken('x@y.z', { exp: Math.floor(Date.now() / 1000) - 10 })],
    ['alg "none"', () => accessToken('x@y.z', {}, { alg: 'none' })],
    ['an unknown key', () => accessToken('x@y.z', {}, { kid: 'other' })],
    ['a tampered payload', async () => {
      const [head, , signature] = (await accessToken('x@y.z')).split('.')
      return `${head}.${b64({ iss: `https://${team}`, aud: [aud], email: 'boss@y.z', exp: 9999999999 })}.${signature}`
    }],
  ])('refuses %s', async (_, makeToken) => {
    const token = typeof makeToken === 'function' ? await makeToken() : makeToken
    expect((await call(onRequestGet, { token })).status).toBe(403)
  })

  it('fails closed when Access is not configured', async () => {
    env = { PROMOS: memoryKv() }
    expect((await call(onRequestGet)).status).toBe(403)
  })
})

describe('saving promotions', () => {
  it('refuses a save made from an out-of-date version, then lets "keep mine" through', async () => {
    const alice = await call(onRequestGet)
    const bob = await call(onRequestGet, { email: 'bob@mklabs.co.zw' })

    const saved = await call(onRequestPut, {
      method: 'PUT',
      body: { promotions: [promo('p1', 'Alice promo')], baseVersion: alice.version },
    })
    expect(saved.success).toBe(true)

    const conflict = await call(onRequestPut, {
      email: 'bob@mklabs.co.zw',
      method: 'PUT',
      body: { promotions: [promo('p2', 'Bob promo')], baseVersion: bob.version },
    })
    expect(conflict).toMatchObject({ status: 409, conflict: true, updatedBy: 'alice@mklabs.co.zw' })
    expect(conflict.promotions[0].title).toBe('Alice promo')

    const kept = await call(onRequestPut, {
      email: 'bob@mklabs.co.zw',
      method: 'PUT',
      body: { promotions: [promo('p2', 'Bob promo')], baseVersion: conflict.version },
    })
    expect(kept.success).toBe(true)
  })

  it('requires the version the edit was made from', async () => {
    const result = await call(onRequestPut, { method: 'PUT', body: { promotions: [] } })
    expect(result.status).toBe(400)
  })

  it('reads and saves lists stored before versioning existed', async () => {
    env.PROMOS.store.set(KV_KEY, { value: JSON.stringify([promo('old', 'Legacy')]), metadata: null })
    const current = await call(onRequestGet)
    expect(current.promotions[0].title).toBe('Legacy')

    const result = await call(onRequestPut, {
      method: 'PUT',
      body: { promotions: [promo('old', 'Legacy edited')], baseVersion: current.version },
    })
    expect(result.success).toBe(true)

    const published = await (await publicGet({ env })).json()
    expect(published.promotions[0].title).toBe('Legacy edited')
  })

  it('only publishes live promotions', async () => {
    const current = await call(onRequestGet)
    await call(onRequestPut, {
      method: 'PUT',
      body: {
        baseVersion: current.version,
        promotions: [promo('on', 'On'), { ...promo('off', 'Off'), active: false }, { ...promo('old', 'Expired'), endsAt: '2000-01-01' }],
      },
    })
    const published = await (await publicGet({ env })).json()
    expect(published.promotions.map((p) => p.title)).toEqual(['On'])
  })
})
