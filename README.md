# MKLabs — Technology That Moves Your Business Forward

**Bulawayo, Zimbabwe • [mklabs.co.zw](https://mklabs.co.zw)**

Marketing site for MKLabs — software development and technology solutions for
businesses, schools and lodges in Zimbabwe.

---

## Live

- **Production:** https://mklabs.co.zw
- **Deploy:** push to `main` → Vercel builds automatically

---

## Tech

Plain HTML, CSS and JavaScript in a single file. No framework, no build step,
no dependencies — `index.html` is the whole site.

| | |
|---|---|
| Markup | Semantic HTML5, one file |
| Styling | CSS custom properties, `clamp()` fluid type, mobile-first |
| Motion | IntersectionObserver + CSS transitions, no animation library |
| Fonts | Instrument Sans (Google Fonts) |
| Images | WebP photography, PNG logos |

---

## Animation system

The site's motion is built from four pieces, all in `index.html`.

**1. Word-by-word reveal** — `splitWords()` walks each `[data-words]` heading,
wraps every word in a `<span class="w">`, and assigns an increasing
`transition-delay`. Words arrive oversized, blurred and near-invisible, then
settle sharp one after another. Applies to all 14 headings.

```html
<h2 class="d2" data-words>One technology partner.</h2>
```

Optional attributes: `data-delay` (start offset, ms) and `data-step`
(gap between words, default 68ms).

**2. Element reveal** — `[data-reveal]` fades and rises into view. Variants:
`left`, `right`, `zoom`, `mask`. Stagger a group with `data-delay`.

```html
<div class="card" data-reveal="left" data-delay="160">…</div>
```

**3. Circuit hero** — an MKLabs chip at centre wired to six product nodes.
Light pulses travel the SVG traces via animated `stroke-dashoffset`, staggered
per trace. Below 680px the traces are hidden and the nodes reflow into a grid.

**4. Drifting logo field** — `.logo-field` holds a watermark logo plus five
frosted-glass logo tiles, each on its own keyframe path: clockwise, counter-
clockwise, figure-of-eight, vertical and horizontal. It sits in the fixed
backdrop for light sections, with a `screen`-blended copy inside each dark band.

Everything is disabled under `prefers-reduced-motion: reduce`.

---

## Brand palette

| Colour | Hex |
|---|---|
| Night Indigo | `#1B003F` |
| Twilight Purple | `#4B0082` |
| Midnight | `#191970` |
| Cornflower | `#6495ED` |
| Lavender Haze | `#E6E6FA` |
| Light Lavender | `#DBC9F9` |

Defined as CSS variables in `:root`, with a `html.dark` override for dark mode.

---

## Structure

```
/
├── index.html                  full site — markup, styles and scripts
├── index-legacy-backup.html    previous build, kept for reference
├── admin.html                  local inbox for form submissions
├── contact.php                 cPanel mail handler
├── api-contact.js              Vercel serverless handler
├── *.webp                      photography (33–130KB)
├── logo-*.png / logo-*.webp    product and service logos
├── manifest.json               PWA manifest
├── robots.txt / sitemap.xml    SEO
├── .htaccess                   Apache/cPanel config
└── vercel.json                 Vercel headers and rewrites
```

---

## Enquiry form

A submission fans out to four places:

1. **`localStorage`** — always; readable in `admin.html`
2. **`contact.php`** — emails info@ / support@ when hosted on cPanel
3. **`/api/contact`** — Vercel serverless route
4. **WhatsApp draft** — prefilled message to 0786 233 766 including the
   visitor's own number

Routes 2 and 3 fail silently on static hosting; 1 and 4 always work.

> **Note:** `api-contact.js` sits at the repo root. For Vercel to serve it at
> `/api/contact` it needs to live at `api/contact.js`. Until then the form
> falls back to the other three routes.

---

## Local development

No build step — open the file:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

A plain `file://` open works too, except `contact.php` and `/api/contact`.

---

## Deployment

Every push to `main` triggers a Vercel deploy.

```bash
git add -A
git commit -m "Describe the change"
git push
```

For cPanel, upload the folder contents to `public_html/` — `contact.php`
and `.htaccess` are used there, `vercel.json` is ignored.

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
