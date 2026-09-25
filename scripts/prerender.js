/**
 * Runs after `vite build` (the app) and `vite build --ssr` (src/entry-server.jsx).
 * Writes one HTML file per route with that route's own title, description,
 * canonical, share tags, structured data and — rendered by React — the page's
 * actual content, plus 404.html and the sitemaps. Metadata comes from
 * src/data/seo.js, structured data from src/data/schema.js.
 *
 * Why: crawlers that never run JavaScript (Bing's first pass, WhatsApp,
 * Facebook and LinkedIn previews) only see the HTML the server sends, and
 * visitors see the page as soon as the HTML arrives instead of after the app
 * has downloaded. The browser then hydrates it (src/main.jsx).
 *
 * Search engine verification: set GOOGLE_SITE_VERIFICATION and/or
 * BING_SITE_VERIFICATION (the content="…" code each tool gives you) in
 * Cloudflare Pages → Settings → Environment variables, and the home pages
 * carry the matching <meta> tag from the next deploy.
 *
 * Cloudflare Pages serves dist/products/pos.html at /products/pos, and because
 * dist/404.html exists, any URL without a file gets a real 404 status.
 *
 * It also fills the security headers into dist/_headers, so static files and
 * Functions share one definition.
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { MAIN_ORIGIN, POS_ORIGIN, metaFor, prerenderRoutes, sitemapRoutes } from '../src/data/seo.js'
import { structuredDataFor } from '../src/data/schema.js'
import { pageSecurityHeadersFor } from '../functions/_lib/security-headers.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const { render: renderApp } = await import(join(root, 'dist-server', 'entry-server.js'))

/* Preload the Latin font file so text renders in the brand font on first
   paint, instead of waiting for the CSS to be parsed before it is found. */
const latinFont = readdirSync(join(dist, 'assets')).find((file) =>
  /^instrument-sans-latin-wght-normal-.*\.woff2$/.test(file)
)
if (!latinFont) throw new Error('Could not find the Instrument Sans latin font in dist/assets')
const template = readFileSync(join(dist, 'index.html'), 'utf8').replace(
  '</head>',
  `  <link rel="preload" href="/assets/${latinFont}" as="font" type="font/woff2" crossorigin />\n</head>`
)

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`index.html is missing ${pattern}`)
  return html.replace(pattern, replacement)
}

/* site-ownership codes for Google Search Console and Bing Webmaster Tools */
const verification = [
  ['google-site-verification', process.env.GOOGLE_SITE_VERIFICATION],
  ['msvalidate.01', process.env.BING_SITE_VERIFICATION],
]
  .filter(([, code]) => code && code.trim())
  .map(([name, code]) => `  <meta name="${name}" content="${escapeAttr(code.trim())}" />\n`)
  .join('')

/* JSON-LD is data, not script: the CSP does not apply to it, but a "</script>"
   inside a string would still end the tag early, so "<" is escaped */
const jsonLd = (data) =>
  data ? `  <script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>\n</head>` : '</head>'

/**
 * A complete page: the route's metadata in <head>, and the app as React
 * renders it inside #root. `host` and `path` are recorded on #root so the
 * browser only hydrates markup built for the page it is actually showing.
 */
async function page({ path, posHost = false, recordPath = path, ssr = true }) {
  let html = render(metaFor(path, { posHost }))
  // replacer functions throughout, so a "$" in the content is never read as a pattern
  html = html.replace('</head>', () => jsonLd(structuredDataFor(path, { posHost })))
  if (!ssr) return html

  const body = await renderApp(path, { posHost })
  const rootTag = '<div id="root"></div>'
  if (!html.includes(rootTag)) throw new Error('index.html is missing an empty <div id="root">')
  return html.replace(
    rootTag,
    () => `<div id="root" data-host="${posHost ? 'pos' : 'main'}" data-path="${recordPath}">${body}</div>`
  )
}

function render(meta) {
  let html = template
  const attr = (key, name, value) => [
    new RegExp(`<meta ${key}="${name}" content="[^"]*"\\s*/?>`),
    `<meta ${key}="${name}" content="${escapeAttr(value)}" />`,
  ]

  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${escapeAttr(meta.title)}</title>`)
  html = replaceOnce(html, ...attr('name', 'description', meta.description))
  html = replaceOnce(html, ...attr('property', 'og:title', meta.title))
  html = replaceOnce(html, ...attr('property', 'og:description', meta.description))
  html = replaceOnce(html, ...attr('property', 'og:image', meta.image))
  html = replaceOnce(html, ...attr('name', 'twitter:title', meta.title))
  html = replaceOnce(html, ...attr('name', 'twitter:description', meta.description))
  html = replaceOnce(html, ...attr('name', 'twitter:image', meta.image))

  const canonical = /\s*<link rel="canonical" href="[^"]*"\s*\/?>/
  const ogUrl = /\s*<meta property="og:url" content="[^"]*"\s*\/?>/
  if (meta.canonical) {
    html = replaceOnce(html, canonical, `\n  <link rel="canonical" href="${escapeAttr(meta.canonical)}" />`)
    html = replaceOnce(html, ogUrl, `\n  <meta property="og:url" content="${escapeAttr(meta.canonical)}" />`)
  } else {
    html = replaceOnce(html, canonical, '')
    html = replaceOnce(html, ogUrl, '')
  }

  if (meta.noindex) {
    html = html.replace(/(<meta name="description"[^>]*>)/, '$1\n  <meta name="robots" content="noindex" />')
  }

  return html
}

function write(relativePath, contents) {
  const target = join(dist, relativePath)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, contents)
}

/* Pages split out of the main bundle get their chunk preloaded, so the
   split never costs a visitor who lands straight on them. */
const assets = readdirSync(join(dist, 'assets'))
const chunkFor = (name) => {
  const file = assets.find((candidate) => new RegExp(`^${name}-[\\w-]+\\.js$`).test(candidate))
  if (!file) throw new Error(`Could not find the ${name} chunk in dist/assets`)
  return `  <link rel="modulepreload" crossorigin href="/assets/${file}" />\n</head>`
}
const splitChunks = { '/pos': chunkFor('PosLanding'), '/admin': chunkFor('Admin') }

/* the home page opens on a full-screen picture: ask for it with the HTML,
   not after the app has loaded and rendered the hero */
const heroPreload =
  '  <link rel="preload" as="image" type="image/webp" fetchpriority="high" href="/hero-portal.webp"' +
  ' imagesrcset="/hero-portal-640.webp 640w, /hero-portal-768.webp 768w, /hero-portal.webp 1024w"' +
  ' imagesizes="(min-width: 1024px) 64vw, (orientation: landscape) and (min-width: 640px) 64vw, 100vw" />\n</head>'

for (const route of prerenderRoutes) {
  // the dashboard is private and loads its data after sign-in: nothing to prerender
  let html = await page({ path: route, ssr: route !== '/admin' })
  if (splitChunks[route]) html = html.replace('</head>', splitChunks[route])
  if (route === '/') html = html.replace('</head>', `${verification}${heroPreload}`)
  write(route === '/' ? 'index.html' : `${route.slice(1)}.html`, html)
}

/* pos.mklabs.co.zw/ — the same pitch as /pos, but inside the POS site's own
   header and footer. functions/index.js serves it at the POS host's root. */
write(
  'pos-host.html',
  (await page({ path: '/', posHost: true }))
    .replace('</head>', splitChunks['/pos'])
    .replace('</head>', `${verification}</head>`)
)

// any path at all can land on the 404 page, so it hydrates wherever it is shown
write('404.html', await page({ path: '/__not-found__', recordPath: '*' }))

const sitemap = (urls) =>
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n') +
  '\n</urlset>\n'

write('sitemap.xml', sitemap(sitemapRoutes.map((route) => `${MAIN_ORIGIN}${route}`)))
write('sitemap-pos.xml', sitemap([`${POS_ORIGIN}/`]))

const headersPath = join(dist, '_headers')
const marker = '# @security-headers'
const headersFile = readFileSync(headersPath, 'utf8')
if (!headersFile.includes(marker)) throw new Error(`public/_headers is missing the "${marker}" line`)
const securityBlock =
  '/*\n' +
  Object.entries(pageSecurityHeadersFor(process.env))
    .map(([name, value]) => `  ${name}: ${value}`)
    .join('\n')
writeFileSync(headersPath, headersFile.replace(marker, securityBlock))

console.log(`prerendered ${prerenderRoutes.length} routes, pos-host.html, 404.html and sitemaps`)
