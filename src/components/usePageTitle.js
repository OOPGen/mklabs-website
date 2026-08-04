import { useEffect } from 'react'

/**
 * Sets the browser tab title per route.
 * A single-page app keeps the same document between routes, so without
 * this every page would inherit the title from index.html.
 */
export default function usePageTitle(title, description) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      const tag = document.querySelector('meta[name="description"]')
      if (tag) tag.setAttribute('content', description)
    }
  }, [title, description])
}
