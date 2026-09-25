/**
 * Checks the built site the way a search engine sees it, so CI fails before a
 * page goes live without its title, content or structured data.
 * Runs after `npm run build`: node scripts/check-build.js
 */

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { MAIN_ORIGIN, POS_ORIGIN, metaFor, prerenderRoutes } from '../src/data/seo.js'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const problems = []
const fail = (where, message) => problems.push(`${where}: ${message}`)

const fileFor = (route) => (route === '/' ? 'index.html' : `${route.slice(1)}.html`)
const read = (file) => readFileSync(join(dist, file), 'utf8')

function checkPage(file, { path, posHost = false, expectContent = true }) {
  const html = read(file)
  const meta = metaFor(path, { posHost })
  const count = (pattern) => (html.match(pattern) || []).length

  if (count(/<title>/g) !== 1) fail(file, 'needs exactly one <title>')
  if (!html.includes('<meta name="description"')) fail(file, 'no meta description')
  if (count(/<link rel="canonical"/g) !== (meta.canonical ? 1 : 0)) fail(file, 'wrong number of canonical links')
  if (meta.canonical && !html.includes(`<link rel="canonical" href="${meta.canonical}"`)) fail(file, `canonical is not ${meta.canonical}`)
  if (meta.noindex !== html.includes('<meta name="robots" content="noindex"')) fail(file, 'noindex does not match src/data/seo.js')
  if (/<script>(?!<\/script>)/.test(html)) fail(file, 'inline script — the CSP will block it')

  if (expectContent) {
    if (count(/<h1[\s>]/g) !== 1) fail(file, `needs exactly one <h1> in the prerendered HTML, found ${count(/<h1[\s>]/g)}`)
    if (!/<div id="root" data-host="(main|pos)" data-path="[^"]+">\s*<\w/.test(html)) fail(file, 'no prerendered content in #root')
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(json)
      if (data['@context'] !== 'https://schema.org') fail(file, 'structured data without the schema.org context')
    } catch (error) {
      fail(file, `structured data is not valid JSON (${error.message})`)
    }
  }
  if (!meta.noindex && !html.includes('application/ld+json')) fail(file, 'no structured data')
}

for (const route of prerenderRoutes) {
  const file = fileFor(route)
  if (!existsSync(join(dist, file))) fail(file, 'missing')
  else checkPage(file, { path: route, expectContent: route !== '/admin' })
}
checkPage('pos-host.html', { path: '/', posHost: true })
checkPage('404.html', { path: '/__not-found__' })

// every sitemap URL must be a real, indexable, self-canonical page
for (const [file, origin] of [['sitemap.xml', MAIN_ORIGIN], ['sitemap-pos.xml', POS_ORIGIN]]) {
  const urls = [...read(file).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1])
  if (!urls.length) fail(file, 'is empty')
  for (const url of urls) {
    if (!url.startsWith(origin)) fail(file, `${url} is not on ${origin}`)
    const path = new URL(url).pathname
    const meta = metaFor(path, { posHost: origin === POS_ORIGIN })
    if (meta.noindex) fail(file, `${url} is noindex`)
    if (meta.canonical !== url) fail(file, `${url} declares ${meta.canonical} as canonical`)
  }
}

const robots = read('robots.txt')
for (const line of ['Disallow: /admin', `Sitemap: ${MAIN_ORIGIN}/sitemap.xml`, `Sitemap: ${MAIN_ORIGIN}/sitemap-pos.xml`]) {
  if (!robots.includes(line)) fail('robots.txt', `missing "${line}"`)
}
if (/^Disallow: \/\s*$/m.test(robots)) fail('robots.txt', 'blocks the whole site')

if (!existsSync(join(dist, '.well-known', 'security.txt'))) fail('.well-known/security.txt', 'missing')
else {
  const expires = read('.well-known/security.txt').match(/^Expires: (.+)$/m)?.[1]
  // renew it in public/.well-known/security.txt a month before it lapses
  if (!expires || Date.parse(expires) < Date.now() + 30 * 24 * 60 * 60 * 1000) fail('security.txt', 'Expires is missing or within 30 days')
}
if (!read('_headers').includes('Content-Security-Policy:')) fail('_headers', 'security headers were not filled in')

if (problems.length) {
  console.error(`Build check failed:\n  ${problems.join('\n  ')}`)
  process.exit(1)
}
console.log(`build check passed: ${prerenderRoutes.length + 2} pages, sitemaps, robots.txt, security.txt, headers`)
