/**
 * Backs up, or restores, the PROMOS KV namespace — the promotions managed at
 * /admin, the only data the site keeps outside git.
 *
 *   node scripts/kv-backup.js export  > promos.json
 *   node scripts/kv-backup.js restore < promos.json
 *
 * Needs CF_API_TOKEN (Account → Workers KV Storage: Read, plus Edit to
 * restore), CF_ACCOUNT_ID and CF_KV_NAMESPACE_ID in the environment.
 * .github/workflows/backup.yml runs the export every night.
 */

const { CF_API_TOKEN, CF_ACCOUNT_ID, CF_KV_NAMESPACE_ID } = process.env
if (!CF_API_TOKEN || !CF_ACCOUNT_ID || !CF_KV_NAMESPACE_ID) {
  console.error('Set CF_API_TOKEN, CF_ACCOUNT_ID and CF_KV_NAMESPACE_ID first.')
  process.exit(1)
}

const base = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}`
const auth = { Authorization: `Bearer ${CF_API_TOKEN}` }

async function api(path, init = {}) {
  const response = await fetch(base + path, { ...init, headers: { ...auth, ...init.headers } })
  if (!response.ok) throw new Error(`${init.method || 'GET'} ${path} → ${response.status} ${await response.text()}`)
  return response
}

async function exportAll() {
  const keys = []
  let cursor = ''
  do {
    const page = await (await api(`/keys?limit=1000${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`)).json()
    keys.push(...page.result)
    cursor = page.result_info?.cursor || ''
  } while (cursor)

  const entries = []
  for (const key of keys) {
    const value = await (await api(`/values/${encodeURIComponent(key.name)}`)).text()
    entries.push({ key: key.name, value, metadata: key.metadata ?? null, expiration: key.expiration ?? null })
  }

  process.stdout.write(
    JSON.stringify({ exportedAt: new Date().toISOString(), namespace: CF_KV_NAMESPACE_ID, entries }, null, 2) + '\n'
  )
  console.error(`exported ${entries.length} key(s)`)
}

async function restore() {
  let input = ''
  for await (const chunk of process.stdin) input += chunk
  const { entries } = JSON.parse(input)
  if (!Array.isArray(entries)) throw new Error('Not a backup file: no "entries" list')

  const body = entries.map(({ key, value, metadata, expiration }) => ({
    key,
    value,
    ...(metadata ? { metadata } : {}),
    ...(expiration ? { expiration } : {}),
  }))
  await api('/bulk', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  console.error(`restored ${body.length} key(s)`)
}

const command = process.argv[2]
if (command === 'export') await exportAll()
else if (command === 'restore') await restore()
else {
  console.error('Usage: node scripts/kv-backup.js export|restore')
  process.exit(1)
}
