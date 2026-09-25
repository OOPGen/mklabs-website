import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { initAnalytics } from './analytics.js'
import { isPosHost } from './host.js'
// self-hosted, so no third-party font request and it caches with the build
import '@fontsource-variable/instrument-sans'
import './index.css'

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)

/*
 * Every route's HTML is prerendered (scripts/prerender.js) and records which
 * site and path it was built for. When those match this visit, React adopts
 * the existing markup instead of redrawing it. Otherwise — the POS host's
 * /contact, or a page with no HTML of its own — the app renders from scratch,
 * which replaces the prerendered markup once it is ready.
 */
const root = document.getElementById('root')
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const builtFor = root.dataset
const matches =
  root.firstElementChild &&
  builtFor.host === (isPosHost ? 'pos' : 'main') &&
  (builtFor.path === path || builtFor.path === '*')

if (matches) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)

initAnalytics()
