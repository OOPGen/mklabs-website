import { useEffect } from 'react'
import { metaFor } from '../data/seo.js'

function setTag(selector, create, attribute, value) {
  let tag = document.head.querySelector(selector)
  if (!value) {
    tag?.remove()
    return
  }
  if (!tag) {
    tag = create()
    document.head.appendChild(tag)
  }
  tag.setAttribute(attribute, value)
}

const meta = (key, name) => () => {
  const tag = document.createElement('meta')
  tag.setAttribute(key, name)
  return tag
}

/**
 * Keeps the document's title, description, canonical and share tags in step
 * with the route. Every field is set on every change, so nothing leaks from
 * the previous page. The build writes the same values into each route's HTML
 * (scripts/prerender.js), so this only takes over after the first load.
 */
export default function useSeo(pathname, { posHost = false } = {}) {
  useEffect(() => {
    const page = metaFor(pathname, { posHost })

    document.title = page.title
    setTag('meta[name="description"]', meta('name', 'description'), 'content', page.description)
    setTag('link[rel="canonical"]', () => {
      const link = document.createElement('link')
      link.rel = 'canonical'
      return link
    }, 'href', page.canonical)
    setTag('meta[name="robots"]', meta('name', 'robots'), 'content', page.noindex ? 'noindex' : '')

    setTag('meta[property="og:title"]', meta('property', 'og:title'), 'content', page.title)
    setTag('meta[property="og:description"]', meta('property', 'og:description'), 'content', page.description)
    setTag('meta[property="og:url"]', meta('property', 'og:url'), 'content', page.canonical)
    setTag('meta[property="og:image"]', meta('property', 'og:image'), 'content', page.image)
    setTag('meta[name="twitter:title"]', meta('name', 'twitter:title'), 'content', page.title)
    setTag('meta[name="twitter:description"]', meta('name', 'twitter:description'), 'content', page.description)
    setTag('meta[name="twitter:image"]', meta('name', 'twitter:image'), 'content', page.image)
  }, [pathname, posHost])
}
