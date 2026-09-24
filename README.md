# MKLabs — Technology That Moves Your Business Forward

**Bulawayo, Zimbabwe • [mklabs.co.zw](https://mklabs.co.zw)**

Marketing site for MKLabs — software development and technology solutions for
businesses, schools and lodges in Zimbabwe.

---

## Live

- **Production:** https://mklabs.co.zw
- **Hosting:** Cloudflare Pages
- **Deploy:** push to `main` → Cloudflare builds automatically

---

## Tech

| | |
|---|---|
| Framework | React 19 |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 4 (brand palette as theme tokens) |
| Forms | Cloudflare Pages Function → Resend |
| Fonts | Instrument Sans (self-hosted via Fontsource) |

---

## Running it locally

```bash
npm install
```

```bash
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

To check the real production output:

```bash
npm run build
```

```bash
npm run preview
```

### Checks

```bash
npm run check
```

Runs everything CI runs: **lint** (`npm run lint`, ESLint), **tests**
(`npm test`, Vitest — the enquiry mailer, the promotions API and its Cloudflare
Access check, SEO rules and security headers) and the **build**. Node 22.12 or
newer (see `.nvmrc`).

GitHub Actions (`.github/workflows/ci.yml`) runs the same on every pull request
and every push to `main`. Merge only when it is green — `main` deploys straight
to production.

`main` is protected by the **Protect main** ruleset (GitHub → Settings → Rules →
Rulesets): changes arrive only through a pull request, the **check** status
must pass before merging (the job in `.github/workflows/ci.yml`), and force
pushes and deletion are blocked.

---

## Making changes

Everything a visitor reads lives in `src/data/` — you rarely need to touch a
component to update the site.

| To change | Edit |
|---|---|
| Product names, features, dashboard numbers | `src/data/products.js` |
| The six service cards | `src/data/services.js` |
| Phone numbers, emails, founder story, hours | `src/data/site.js` |

Adding a fifth product means adding one object to `products.js` — the card,
the nav dropdown, the footer link and the whole `/products/<slug>` page all
appear automatically.

Then publish:

```bash
git add -A
```

```bash
git commit -m "Describe the change"
```

```bash
git push
```

---

## Structure

```
/
├── index.html               Vite entry (meta tags, fonts)
├── vite.config.js
├── .github/workflows/ci.yml  Lint, test and build on every PR and push to main
├── tests/                   Vitest suites for Functions, SEO rules and headers
├── scripts/prerender.js     After the build: one HTML file per route, 404.html, sitemaps
├── functions/
│   ├── index.js             Serves the POS page at / on pos.mklabs.co.zw
│   ├── api/contact.js       The enquiry mailer
│   ├── api/promotions.js    Live offers for the public site
│   ├── api/admin/…          Promotions dashboard API (Cloudflare Access)
│   ├── api/_middleware.js   Security headers on every API response
│   └── _lib/                Shared rules — not routes (security-headers.js lives here)
├── public/                  Images and static files, served from /
│   ├── _headers             Cache rules (security headers are added at build)
│   ├── theme.js             Applies dark mode before first paint
│   ├── *.webp / *.png       Photography and logos
│   ├── og-image.jpg         1200×630 link-preview image
│   ├── icon-*, favicon-*    App and browser icons
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── main.jsx             React entry
│   ├── App.jsx              Routes
│   ├── index.css            Tailwind theme, brand palette, motion
│   ├── data/                ← all site content (seo.js: every page title and description)
│   ├── components/          Nav, Footer, Reveal, Marquee, forms…
│   └── pages/               Home, Products, ProductDetail, About, Contact
```

The previous single-file site (and its PHP mailer and old admin page) was
removed in September 2026. It is still in git history — restore it with
`git checkout 7426ec5 -- legacy/` if you ever need it.

---

## Search engines and link previews

Every page's title, description and canonical address live in
**`src/data/seo.js`**. Product pages are generated from `products.js`, so a new
product gets correct tags automatically.

`npm run build` runs `scripts/prerender.js` after Vite. It writes a separate
HTML file for each route (`dist/about.html`, `dist/products/pos.html`, …)
carrying that page's tags, so WhatsApp, Facebook and LinkedIn previews — which
never run JavaScript — show the right page. It also writes:

- **`404.html`** — its presence tells Cloudflare Pages to return a real 404
  status for unknown URLs instead of a "200 OK" copy of the home page
- **`sitemap.xml`** and **`sitemap-pos.xml`** — rebuilt on every deploy

A new route needs an entry in `seo.js`; without one it still works for
visitors but answers with a 404 status.

`/pos` is a preview of pos.mklabs.co.zw, so its canonical points at the
subdomain. `functions/index.js` makes the subdomain's root return the POS page's
HTML (the rest of the site is plain static files).

After deploying, submit both sitemaps in Google Search Console, and use
[the Facebook sharing debugger](https://developers.facebook.com/tools/debug/)
to refresh old link previews.

---

## Security headers

Defined once in **`functions/_lib/security-headers.js`**. The build copies them
into `dist/_headers` for static files, and the Functions set them in code,
because Cloudflare Pages does not apply `_headers` to Function responses.

The Content-Security-Policy lists every outside host the site uses — the
Google Maps embed, Cloudflare Turnstile and Cloudflare Web Analytics. The font
is self-hosted, so fonts may only come from the site itself. **Adding a new embed, script or font host means adding it there**,
otherwise browsers will block it. There are no inline scripts; keep it that way
(`theme.js` is a file for exactly this reason).

HSTS is one year and deliberately does not include subdomains. Once every
subdomain is HTTPS-only you can add `includeSubDomains`.

`/admin` and every `/api/*` response carry `X-Robots-Tag: noindex`, and are
never cached (the public promotions feed keeps its one-minute cache).

After deploying, [securityheaders.com](https://securityheaders.com) should grade
the site A.

---

## Pages

| Route | What it does |
|---|---|
| `/` | Hero, live offers, product grid, cross-device showcase, clients, services, CTA |
| `/products` | All four products with detail rows |
| `/products/:slug` | Full page per product — dashboard preview, features, audience |
| `/pos` | Preview of the POS landing site (its real home is pos.mklabs.co.zw) |
| `/about` | Company, founder story, services |
| `/contact` | Enquiry form, contact details, map |
| `/admin` | Promotions dashboard — guarded by Cloudflare Access |

On **pos.mklabs.co.zw** the same app serves the POS landing page at `/` instead.

---

## Motion, and why the site never looks broken

Animation is deliberately degradable. When a phone has **Reduce Motion** turned
on (iOS Accessibility → Motion, or Android → Remove animations), the browser
reports `prefers-reduced-motion: reduce` and:

- scroll reveals are forced fully visible rather than staying hidden
- the ecosystem marquee becomes a **static wrapped grid** of the same nine items
- the ambient background orbs keep their gradient but stop drifting

Nothing disappears — it simply stops moving. This was a real bug in the previous
build, where Reduce Motion left the page looking half-empty.

Other mobile guarantees:

- every button, link and input is at least 44–52px tall
- inputs are 16px so iOS Safari does not zoom on focus
- no interaction depends on hover
- the mobile menu closes on navigation and locks background scroll while open

---

## The enquiry form

A submission fans out to three places so it can never silently vanish:

1. **`localStorage`** — saved immediately, removed again once the email is
   confirmed (at most 5 kept, none older than 30 days)
2. **`POST /api/contact`** — the Cloudflare Pages Function, which emails via Resend
3. **WhatsApp draft** — offered after submit, prefilled with the whole enquiry

The form tells the visitor the truth about which of these worked. If the email
could not be confirmed it turns amber and asks them to tap WhatsApp instead of
claiming success.

### What lands in the inbox

Both `info@` and `support@` receive one email per enquiry containing the name,
company, email, phone, service, budget and message — plus three one-tap reply
buttons built from **the visitor's own phone number**:

| Button | Goes to |
|---|---|
| 💬 WhatsApp | `wa.me/<their number>` with a greeting already typed |
| 📞 Call | `tel:+<their number>` |
| ✉️ Email | `mailto:<their address>` |

`Reply-To` is set to the visitor, so simply hitting Reply in your mail app
answers them directly.

Zimbabwean numbers are normalised before the link is built — `0771 234 567`,
`+263 77 123 4567` and `00263771234567` all become `263771234567`, which is the
only form `wa.me` accepts. A raw `0771234567` would produce a dead link.
Foreign numbers are linked only when typed with their country code (`+44 …`);
a number whose country cannot be told is shown as typed, without buttons.

### Spam protection

The shared rules live in `functions/_lib/enquiry.js` and are used by both the
form and the Function, so they always agree.

- **Field limits** — name 120, email 254, message 5,000 characters, etc.
  Oversized or malformed enquiries are refused with a clear message.
- **Honeypot** — a hidden `website` field people never see. Bots fill it, and
  their enquiry is dropped while looking successful to them.
- **Cloudflare Turnstile** *(optional, recommended)* — Cloudflare's free,
  mostly invisible "are you human" check. Turn it on in Cloudflare →
  **Turnstile → Add site** (`mklabs.co.zw`, `pos.mklabs.co.zw`), then add both
  keys below and redeploy. Until then the form works without it.
- **Rate limit** *(recommended)* — Cloudflare → your domain → **Security →
  WAF → Rate limiting rules**: path equals `/api/contact`, e.g. 5 requests per
  minute per IP → Block. The free plan includes one rule.

Delivery errors are written to the Functions log (**Pages project →
Functions → Real-time logs**), never shown to visitors.

### Turning on email

**Until this is done the form works but no email arrives.** Cloudflare Workers
cannot use SMTP, so mail goes out over Resend's HTTP API.

1. Create a free account at [resend.com](https://resend.com) (3,000 emails/month)
2. **Domains → Add Domain → `mklabs.co.zw`.** Resend shows a few DNS records;
   add them in your Cloudflare dashboard under **DNS**, then click Verify.
   This is what lets mail be sent *from* `@mklabs.co.zw` without being spammed.
3. **API Keys → Create API Key** and copy it
4. In Cloudflare → your Pages project → **Settings → Environment variables**,
   add the key below, then **redeploy** for it to take effect

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | the key you copied |
| `CONTACT_TO` | `info@mklabs.co.zw, support@mklabs.co.zw` *(optional)* |
| `CONTACT_FROM` | `MKLabs Website <noreply@mklabs.co.zw>` *(optional)* |
| `TURNSTILE_SECRET_KEY` | Turnstile secret key *(optional — spam check)* |
| `VITE_TURNSTILE_SITE_KEY` | Turnstile site key *(set together with the secret)* |

Until `RESEND_API_KEY` is set the endpoint returns `emailed: false`, and routes
1 and 3 carry the enquiry — so the form is never broken, just quieter.

---

## Promotions dashboard

You add and edit offers yourself at **mklabs.co.zw/admin** — no code, no
redeploy. Saving updates the live site within about a minute.

Each promotion has a headline, details, a badge (`20% off`), a button with a
link, an on/off switch, and optional start and end dates. Outside those dates
it hides itself. The section disappears entirely when nothing is live, so the
home page never shows an empty "Offers" heading.

Promotions appear on the home page and on the POS landing page.

**Two people editing at once.** Every save names the version it was edited
from. If someone else saved in the meantime, nothing is overwritten: the
dashboard says who saved and when, and offers **Load their version** or
**Keep mine and save**. (Cloudflare KV takes up to a minute to sync between
locations, so two saves within that minute from different places can still
collide — rare for a small team.)

The dashboard also asks before deleting a promotion, and warns before you
close, reload or leave the page with unsaved changes.

### Setup — two things, both one-off

**1. Storage (Cloudflare KV)**

Cloudflare dashboard → **Storage & Databases → KV → Create a namespace**, call
it `mklabs-promotions`. Then in your Pages project → **Settings → Bindings →
Add → KV namespace**:

| Field | Value |
|---|---|
| Variable name | `PROMOS` |
| KV namespace | `mklabs-promotions` |

The variable name must be exactly `PROMOS`.

**2. Login (Cloudflare Access)**

Cloudflare dashboard → **Zero Trust → Access → Applications → Add an
application → Self-hosted**:

| Field | Value |
|---|---|
| Application name | `MKLabs admin` |
| Domain | `mklabs.co.zw` path `admin` |
| Add a second domain | `mklabs.co.zw` path `api/admin` |

Add a policy: **Action** Allow, **Include** → *Emails* → your address. Save,
then copy the **Application Audience (AUD) tag** from the app's overview.

Back in Pages → **Settings → Environment variables**, add:

| Variable | Value |
|---|---|
| `ACCESS_TEAM_DOMAIN` | `yourteam.cloudflareaccess.com` |
| `ACCESS_AUD` | the AUD tag you copied |

Redeploy. Visiting `/admin` now asks for your email, sends a one-time code, and
lets you in.

> **Both paths matter.** The policy must cover `api/admin` as well as `admin`.
> The API verifies the Access token itself as a second lock, and refuses every
> request when `ACCESS_TEAM_DOMAIN` or `ACCESS_AUD` is missing — so a
> half-finished setup fails closed rather than leaving the site editable.

Links entered in the dashboard are restricted to `http(s)`, `mailto:`, `tel:`
and site-relative paths. `javascript:` and `data:` URLs are rejected, because
that field ends up in an `href`.

---

## The POS landing site

**pos.mklabs.co.zw** serves a standalone sales page for MKLabs POS. Same
deployment and same codebase; `src/App.jsx` checks the hostname and serves the
POS site when it starts with `pos.`.

Preview it without the subdomain at **/pos** on the main site.

### How the page is built

A full-height hero opens it: the headline, a letter-spaced `SALES · STOCK ·
PROFIT` line, one paragraph, a solid and an outlined button with a rotated
sticker across them, and a closing band of three tiles — dark, brand purple and
light in turn. `SocialRail` runs down the left gutter from `xl` up. Below the
fold: live offers, the three objections, the feature grid, the dashboard
preview, who it is for, and the enquiry form.

The backdrop is the same `AmbientOffice` used elsewhere on the site — blurred
client photography under a night scrim — and the palette is the MKLabs one, so
the page belongs to the same family as the rest of mklabs.co.zw.

`PosNav` is bare over the hero and collects itself into a glass pill once the
page scrolls onto the pale sections. Its centre link group is absolutely
centred, so the brand and the button can be any width without moving it. Below
`sm` the CTA drops out of the bar and lives in the sheet instead — there is not
room for both it and the menu button on a 360px phone.

Two things to know before editing it:

- **A phone in landscape has ~390px of height**, which the full-size hero
  cannot fit. `.hero-compact` in `src/index.css` shrinks the headline, the
  gaps and the sticker under `max-height: 560px` until the button is back
  above the fold. Those rules are deliberately outside `@layer`, because
  unlayered CSS beats Tailwind's utilities.
- **`Button` sets its own `display`.** Tailwind emits `.inline-flex` after
  `.hidden`, so hiding a `Button` needs `!hidden` / `sm:!inline-flex`; a plain
  `hidden` silently loses.

To connect the subdomain: Pages project → **Custom domains → Set up a domain →
`pos.mklabs.co.zw`**. Your nameservers are already Cloudflare, so the DNS
record is created for you.

---

## Cloudflare Pages settings

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 22 (from `.nvmrc`) |

### Every binding and variable

| Name | Type | Needed for |
|---|---|---|
| `RESEND_API_KEY` | Environment variable | Enquiry emails |
| `CONTACT_TO` | Environment variable *(optional)* | Who receives enquiries |
| `CONTACT_FROM` | Environment variable *(optional)* | Sender address |
| `TURNSTILE_SECRET_KEY` | Environment variable *(optional)* | Spam check on the enquiry form |
| `VITE_TURNSTILE_SITE_KEY` | Environment variable *(optional, build-time)* | Shows the Turnstile widget |
| `PROMOS` | KV namespace binding | Promotions storage |
| `ACCESS_TEAM_DOMAIN` | Environment variable | Admin login |
| `ACCESS_AUD` | Environment variable | Admin login |

---

## The logo

The official logo lives at `brand/mklabs-logo-original.jpg` (1254×1254). The
site uses cut-outs of it with the black corners removed:
`public/mklabs-logo.webp` (512px, hero) and `public/mklabs-logo-128.webp`
(top bar, footer, cards). The favicons, app icons and `og-image.jpg` link
preview are all made from it too.

Its colours are theme tokens, and the Home page and top bar are built from them:

| Colour | Hex | Tailwind token |
|---|---|---|
| Logo tile black | `#05040F` | `void` |
| Cyan | `#12A1FF` | `cyan` |
| Violet | `#7443F7` | `violet` |
| Magenta | `#CC61FC` | `magenta` |

Helpers in `src/index.css`: `logo-gradient` (the cyan → violet → magenta sweep
as a fill), `logo-gradient-text`, `logo-border` (the logo's gradient outline
around any fill), `logo-slant` (faint lines at the angle of its strokes) —
and `BrandGlow`, the component that lights dark sections in the logo's colours.
Buttons have `brand` and `glass` variants for dark backgrounds.

## Brand palette

The original palette, still used by the other pages:

| Colour | Hex | Tailwind token |
|---|---|---|
| Night Indigo | `#1B003F` | `night` |
| Twilight Purple | `#4B0082` | `purple` |
| Midnight | `#191970` | `midnight` |
| Cornflower | `#6495ED` | `corn` |
| Lavender Haze | `#E6E6FA` | `lavender` |
| Light Lavender | `#DBC9F9` | `lilac` |
| Iris | `#A78BFA` | `iris` |

Defined in `@theme` in `src/index.css`, so `bg-purple` and `text-lilac` work
anywhere. Dark mode is a `.dark` class on `<html>`, toggled in the nav and
remembered in `localStorage`. `public/theme.js` applies it in `<head>` before
the page paints — on both hosts — so dark-mode visitors never see a white
flash. The toggle itself lives in `src/components/useTheme.js`.

---

## Founder

**Michael Junior Jere** — Founder & Lead Developer, MKLabs, Bulawayo

## Contact

- **Phone:** 0786 233 766 / 0718 621 427
- **WhatsApp:** https://wa.me/263786233766
- **General:** info@mklabs.co.zw
- **Support:** support@mklabs.co.zw
- **Location:** Bulawayo, Zimbabwe

---

© 2026 MKLabs — Technology that opens doors.
