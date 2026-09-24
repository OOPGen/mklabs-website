/**
 * Runs after `vite build`. Writes one HTML file per route with that route's
 * own title, description, canonical and share tags, plus 404.html and the
 * sitemaps — all from src/data/seo.js.
 *
 * Why: crawlers that never run JavaScript (WhatsApp, Facebook and LinkedIn
 * previews, and Google's first pass) only see the HTML the server sends. With
 * a single index.html every URL claimed to be the home page.
 *
 * Cloudflare Pages serves dist/products/pos.html at /products/pos, and because
 * dist/404.html exists, any URL without a file gets a real 404 status.
 *
 * It also fills the security headers into dist/_headers, so static files and
 * Functions share one definition.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { MAIN_ORIGIN, POS_ORIGIN, metaFor, prerenderRoutes, sitemapRoutes } from '../src/data/seo.js'
import { pageSecurityHeaders } from '../functions/_lib/security-headers.js'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`index.html is missing ${pattern}`)
  return html.replace(pattern, replacement)
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

for (const route of prerenderRoutes) {
  write(route === '/' ? 'index.html' : `${route.slice(1)}.html`, render(metaFor(route)))
}

write('404.html', render(metaFor('/__not-found__')))

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
  Object.entries(pageSecurityHeaders)
    .map(([name, value]) => `  ${name}: ${value}`)
    .join('\n')
writeFileSync(headersPath, headersFile.replace(marker, securityBlock))

console.log(`prerendered ${prerenderRoutes.length} routes, 404.html and sitemaps`)
