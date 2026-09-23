# MKLabs website — audit & phased fix plan

Audited: 2026-09-23 · branch `claude/audit-phased-fixes-jy7mvb` · commit `88e4149`

**Build status:** `npm run build` passes (one JS chunk, 318 KB / 96 KB gzip).
**`npm audit`:** 1 high (`nanoid`, pulled in by the build toolchain only).
**Tests / lint / CI:** none present.

Severity: 🔴 fix now · 🟠 fix soon · 🟡 improvement · ⚪ housekeeping

---

## Findings

### A. Security & abuse

| # | Sev | Where | Issue |
|---|---|---|---|
| A1 | 🔴 | `functions/api/contact.js` | **No spam or rate protection.** Anyone can script POSTs and burn the Resend quota or flood `info@`/`support@`. No honeypot, no Turnstile, no per-IP limit. |
| A2 | 🔴 | `functions/api/contact.js:161` | **Unescaped visitor input in an email `href`.** `mailto:${email}` goes into the HTML email raw, so an "email" like `x" style=… href="https://evil` injects markup/links into the message MKLabs staff read. Email address is also never format-checked, and it is used as `reply_to`. |
| A3 | 🟠 | `functions/api/contact.js` | **No length limits** on name/message/etc. — arbitrarily large bodies get relayed into email. |
| A4 | 🟠 | `functions/api/contact.js` | **Provider error text returned to the browser** (`reason: Provider error: …`, `error.message`). Leaks internal details; log it server-side instead. |
| A5 | 🟠 | `public/_headers` | **No `Content-Security-Policy` or `Strict-Transport-Security`.** `/admin` and `/api/*` also lack `X-Robots-Tag: noindex` / `Cache-Control: no-store` at the header level. |
| A6 | 🟡 | `src/components/ContactForm.jsx:74` | **Every enquiry (name, email, phone, message) is kept in `localStorage` forever.** On a shared/office PC the next user can read them. Cap the list, expire old entries, or clear on successful email. |
| A7 | 🟡 | `functions/api/admin/promotions.js` | **Last-write-wins on PUT.** Two admins (or two tabs) silently overwrite each other. Add a version/ETag check. Duplicate promotion `id`s are also not rejected. |
| A8 | ⚪ | `package-lock.json` | `nanoid` < 3.3.18 advisory — build-time only, low real risk; `npm audit fix` clears it. |

Checked and fine: Access JWT verification fails closed and checks alg/iss/aud/exp/signature; promotion links reject `javascript:`/`data:`; HTML email escapes all other fields; admin route is not exposed on the POS host.

### B. Correctness & UX bugs

| # | Sev | Where | Issue |
|---|---|---|---|
| B1 | 🟠 | `src/components/Nav.jsx:24` | **Dark-mode flash.** Theme class is applied in `useEffect`, after first paint — dark-mode users see a white flash on every load. Needs a tiny inline script in `index.html`. |
| B2 | 🟠 | `src/components/PosNav.jsx` | **POS host ignores the theme entirely.** Theme restore lives only in `Nav`, which is not rendered on `pos.mklabs.co.zw`. |
| B3 | 🟡 | `src/components/Nav.jsx:25,36` | `localStorage` calls are not wrapped in `try/catch`; where storage throws (locked-down / some private modes) the error kills the whole React tree. |
| B4 | 🟡 | `src/components/usePageTitle.js` | Description is only set, never reset — navigating from a product page to a page without a description keeps the product's description. `NotFound` sets no title at all. |
| B5 | 🟡 | `src/pages/Admin.jsx` | Deleting a promotion has no confirmation and there is no "leave page with unsaved changes?" guard. |
| B6 | 🟡 | `functions/api/contact.js` `toWhatsAppNumber` | Non-Zimbabwean local numbers (leading `0`) are forced to `+263`, producing a wrong WhatsApp/call link. |

### C. SEO & discoverability

| # | Sev | Where | Issue |
|---|---|---|---|
| C1 | 🔴 | `index.html` | **Every page declares `canonical = https://mklabs.co.zw/`**, including product pages and `pos.mklabs.co.zw`. Google is being told all pages are duplicates of the home page. `og:url`/`og:title` are also static. |
| C2 | 🟠 | `NotFound.jsx` + `_redirects` | **Soft 404s.** Unknown URLs return HTTP 200 with a "404" page; no `noindex`. |
| C3 | 🟡 | `index.html` | `twitter:card=summary_large_image` points at a 364×440 logo — no proper 1200×630 share image. |
| C4 | 🟡 | `public/manifest.json` | Icon declared `192x192` but the file is 364×440; no 512 or maskable icon, so the PWA install/icon is broken. Favicon is a 58×49 PNG. |
| C5 | ⚪ | `public/sitemap.xml` | Hand-maintained, `lastmod` stale; no sitemap for the POS subdomain. |

### D. Performance

| # | Sev | Where | Issue |
|---|---|---|---|
| D1 | 🟡 | `src/App.jsx` | Single bundle — `Admin` and `PosLanding` ship to every visitor. Lazy-load them with `React.lazy`. |
| D2 | 🟡 | all `<img>` | No `width`/`height` → layout shift (CLS) as images load. |
| D3 | ⚪ | `index.html` | Google Fonts is render-blocking; self-host Instrument Sans or add `preload`. |

### E. Repo health & maintainability

| # | Sev | Where | Issue |
|---|---|---|---|
| E1 | 🟠 | repo | **No lint, no tests, no CI.** Nothing stops a broken build reaching `main` (which auto-deploys). |
| E2 | 🟡 | `functions/_lib/*` | Pure logic (`cleanLink`, `normalise`, `validate`, `isLive`, `toWhatsAppNumber`, JWT checks) is untested — easy wins for unit tests. |
| E3 | ⚪ | `legacy/` | ~3,300 lines of dead code (old PHP mailer, old admin, Vercel config). Not deployed, but noisy and confusing. Move to a tag/branch and delete. |
| E4 | ⚪ | `.gitignore`, `.claude/launch.json` | Stale entries (Vercel, `mklabs-pack/`, a `milestone-web` launch config for another project). |
| E5 | ⚪ | `README.md` | Structure section omits `functions/_lib`, `api/promotions`, `api/admin`. No `engines`/`.nvmrc` to pin the Node version Cloudflare builds with. |
| E6 | ⚪ | `package.json` | Minor updates available (React 19.3, Vite 8.3, Router 7.18.4, plugin-react 6.1). |

---

## Phased fix plan

Each phase is one PR, independently shippable, ordered by risk × effort.

### Phase 1 — Lock down the contact endpoint (🔴, ~½ day)
- A2 escape the `mailto:` href; validate email format server-side.
- A3 cap every field length (name 120, email 254, message 5 000, …) and reject oversized bodies.
- A4 stop echoing provider errors to the client; `console.error` them instead.
- A1 add a honeypot field + Cloudflare Turnstile (or at minimum a per-IP KV/rate-limit binding).
- A6 cap stored enquiries in `localStorage` (e.g. last 5, 30 days).
- B6 only prefix `263` when the number actually looks Zimbabwean.

**Needs from you:** a Turnstile site/secret key (free) if we go that route.

### Phase 2 — SEO correctness (🔴/🟠, ~½ day)
- C1 make `usePageTitle` → `useSeo` and set `canonical`, `og:url`, `og:title`, `og:description` per route; correct canonical for the POS host.
- C2 404 page sets `noindex` + title; add `404.html` handling so unknown paths return a real 404 where feasible.
- B4 reset description on route change.
- C3/C4 add a 1200×630 OG image, correct manifest icons (192/512/maskable), proper favicon.
- C5 refresh sitemap (and add a POS-host sitemap).

**Needs from you:** a share image / square logo source if you want it designed rather than generated.

### Phase 3 — Headers & theme polish (🟠, ~½ day)
- A5 add CSP (self + Google Fonts + Maps embed + wa.me), HSTS, and `noindex`/`no-store` for `/admin` and `/api/*`.
- B1 inline no-flash theme script in `index.html`.
- B2 share theme logic via a `useTheme` hook used by both `Nav` and `PosNav`.
- B3 guard all `localStorage` access.

### Phase 4 — Admin robustness (🟡, ~½ day)
- A7 version/ETag on promotions; reject stale PUTs with 409; reject duplicate ids.
- B5 delete confirmation + `beforeunload` guard for unsaved changes.

### Phase 5 — Guardrails (🟠, ~1 day)
- E1 add ESLint (react + hooks), Prettier, and a GitHub Actions workflow running `lint` + `build` + tests on every PR.
- E2 Vitest unit tests for `functions/_lib/*` and `toWhatsAppNumber`.
- A8/E6 `npm audit fix` and minor dependency bumps.
- E5 add `engines` + `.nvmrc`.

### Phase 6 — Performance & cleanup (🟡/⚪, ~½ day)
- D1 lazy-load `Admin` and `PosLanding`.
- D2 add intrinsic `width`/`height` to images.
- D3 self-host / preload the font.
- E3 tag `legacy-archive`, then delete `legacy/`.
- E4/E5 tidy `.gitignore`, launch config, README structure.
