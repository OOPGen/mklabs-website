/**
 * Build-time renderer. scripts/prerender.js calls render() for every route,
 * so each page's HTML carries its real content: search engines index it
 * without running JavaScript, and visitors see the page before the app loads.
 * The browser then hydrates that HTML (src/main.jsx) instead of redrawing it.
 */
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { StaticRouter } from 'react-router-dom'

import App from './App.jsx'

export async function render(url, { posHost = false } = {}) {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouter location={url}>
        <App posHost={posHost} />
      </StaticRouter>
    </StrictMode>,
    // write every Suspense boundary (the lazy POS page) in place: an
    // out-of-order boundary needs an inline script to swap it in, which the
    // Content-Security-Policy rightly refuses to run
    { progressiveChunkSize: Infinity }
  )

  let html = ''
  for await (const chunk of prelude) html += chunk
  return html
}
