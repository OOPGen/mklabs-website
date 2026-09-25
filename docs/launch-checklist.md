# Launch checklist — the steps only an account owner can do

Everything that can live in code is already in the repository: prerendered
pages, titles and descriptions, canonical URLs, structured data, sitemaps,
`robots.txt`, `security.txt`, security headers, caching, analytics hooks,
Dependabot and the backup workflow. What is left needs **your** Google,
Microsoft, Cloudflare or GitHub login. Work top to bottom; each step says how
to tell it worked.

Environment variables below go in **Cloudflare → Workers & Pages → the
mklabs-website project → Settings → Variables and secrets** (Production), and
take effect on the next deploy (push to `main`, or Deployments → Retry).

---

## 1. Google Search Console

1. Open <https://search.google.com/search-console> → **Add property** →
   **Domain** → `mklabs.co.zw`. A Domain property covers `mklabs.co.zw`,
   `www.` and `pos.` in one go.
2. Verify with the DNS TXT record Google shows. Because the domain's DNS is on
   Cloudflare, Google offers **"Verify with Cloudflare"** — accept it and the
   record is added for you. (Or add the TXT record by hand in Cloudflare → DNS.)
   - *Alternative:* a **URL prefix** property verified with the HTML tag — put
     the `content="…"` code in `GOOGLE_SITE_VERIFICATION` and redeploy.
3. **Sitemaps** → submit both:
   - `https://mklabs.co.zw/sitemap.xml`
   - `https://mklabs.co.zw/sitemap-pos.xml`
4. **URL inspection** → paste `https://mklabs.co.zw/` → **Request indexing**.
   Repeat for `/products`, each `/products/…` page and
   `https://pos.mklabs.co.zw/`.
5. After a few days check **Indexing → Pages** (all sitemap URLs "Indexed") and
   **Enhancements → Breadcrumbs** (no errors).

## 2. Bing Webmaster Tools (also feeds DuckDuckGo, Yahoo and Copilot)

1. Open <https://www.bing.com/webmasters> and sign in.
2. Choose **Import from Google Search Console** — it copies the verified site
   and the sitemaps. *(Or add the site by hand and verify with the DNS CNAME it
   gives you, or put the `msvalidate.01` code in `BING_SITE_VERIFICATION`.)*
3. Check **Sitemaps** lists both files, then **URL Inspection** → the home page.
4. In Cloudflare → **Caching → Configuration → Crawler Hints: On**. This sends
   IndexNow pings, so Bing hears about changes on every deploy.

## 3. Google Business Profile (local search and Maps)

1. <https://business.google.com> → add or claim **MKLabs**.
2. Use exactly what the website says (Google compares them):
   - **Name:** MKLabs
   - **Primary category:** Software company. Additional: Website designer,
     Computer support and services, Computer security service
   - **Location:** a service-area business in Bulawayo, Zimbabwe (hide the
     street address unless clients visit you)
   - **Phone:** 0786 233 766 (+263 786 233 766) · **Website:** `https://mklabs.co.zw/`
   - **Hours:** Monday–Friday, 08:00–17:00
   - **Description:** start with "MKLabs is a Bulawayo software development
     company…" and name the four products
3. Add the four products (link each to its `/products/…` page), a logo, a cover
   photo and real work photos.
4. After verification, ask a few happy clients for a Google review. Reviews and
   up-to-date details matter most for local ranking.
5. When the social pages exist, paste their addresses into the `socials` list in
   `src/data/site.js`: they then show in the footer and in the structured data
   (`sameAs`) automatically.

## 4. Analytics

**Cloudflare Web Analytics (recommended, no cookies, no consent banner):**
Pages project → **Metrics → Web Analytics → Enable**. Nothing else to do: the
security policy already allows its script.

**Google Analytics 4 (optional, for conversions and Search Console data):**

1. <https://analytics.google.com> → create a property → **Web** stream for
   `https://mklabs.co.zw` → copy the **Measurement ID** (`G-…`).
2. Set `VITE_GA_MEASUREMENT_ID` to it and redeploy. The same variable switches
   on the Google hosts in the Content-Security-Policy. Without it, no Google
   script is loaded at all.
3. In the stream's **Enhanced measurement** settings, turn off **Page changes
   based on browser history events** (the site sends its own page views, with
   the right title), or page views are counted twice.
4. **Admin → Events** → mark `generate_lead` (form sent), `contact_whatsapp`,
   `contact_phone` and `contact_email` as **key events**.
5. **Admin → Product links → Search Console** → link the property.
6. GA uses cookies: mention analytics in a privacy notice.

## 5. Cloudflare security and speed settings (zone `mklabs.co.zw`)

| Where | Setting |
|---|---|
| SSL/TLS → Overview | **Full (strict)** |
| SSL/TLS → Edge Certificates | **Always Use HTTPS: On**, **Minimum TLS: 1.2**, TLS 1.3: On, Automatic HTTPS Rewrites: On |
| Security → WAF → Managed rules | Cloudflare Free Managed Ruleset: **On** |
| Security → Bots | **Bot Fight Mode: On** |
| Security → WAF → Rate limiting rules | New rule: *URI Path equals `/api/contact`*, **5 requests / 10 seconds per IP → Block** for 10 seconds |
| Rules → Redirect Rules | *Hostname equals `www.mklabs.co.zw`* → dynamic 301 to `concat("https://mklabs.co.zw", http.request.uri.path)`, preserve query string. Needs a proxied `www` DNS record (CNAME to `mklabs.co.zw`) |
| Speed → Optimization | **Early Hints: On**. Keep **Rocket Loader Off** — it rewrites scripts and would break the page |
| Caching → Configuration | **Crawler Hints: On** (see step 2) |

The site already sends HSTS for one year. Only add `includeSubDomains`/preload
(dashboard → Edge Certificates → HSTS) once every subdomain, mail and webmail
included, works over HTTPS.

*Optional:* a Bulk Redirect from `mklabs-website.pages.dev` to
`https://mklabs.co.zw`. Not required, because every page already names
`mklabs.co.zw` as its canonical address.

## 6. Backups

What exists and where:

| What | Backed up by | Restore |
|---|---|---|
| Code, content, images | git on GitHub | `git revert` / redeploy any commit |
| Each live deployment | Cloudflare Pages keeps every one | Pages → **Deployments** → ⋯ → **Rollback** (instant) |
| Promotions (KV `PROMOS`) | `.github/workflows/backup.yml`, nightly, encrypted, kept 35 days | below |
| Enquiries | emailed to the inbox, not stored on the server | your mailbox |

Switch on the nightly promotions backup:

1. Cloudflare → **My Profile → API Tokens → Create token → Custom**:
   permission *Account → Workers KV Storage → Read* (choose **Edit** as well if
   you want to restore with the same token), limited to your account.
2. Copy the **Account ID** (Workers & Pages overview, right-hand side) and the
   **namespace ID** of `PROMOS` (Storage & Databases → KV).
3. GitHub → the repository → **Settings → Secrets and variables → Actions** →
   add `CF_API_TOKEN`, `CF_ACCOUNT_ID`, `CF_KV_NAMESPACE_ID` and
   `BACKUP_PASSPHRASE` (a long random passphrase — also keep it in your password
   manager: without it a backup cannot be opened).
4. **Actions → Backup → Run workflow**. A green run with a
   `promotions-backup-…` artifact means it works.

GitHub pauses scheduled workflows in a repository with no commits for 60 days;
if that happens, re-enable it on the Actions tab.

Restore promotions from a backup:

```bash
# download the artifact from the Backup run, unzip it, then:
openssl enc -d -aes-256-cbc -pbkdf2 -iter 200000 \
  -in promos-YYYY-MM-DD.json.enc -out promos.json   # asks for the passphrase
CF_API_TOKEN=… CF_ACCOUNT_ID=… CF_KV_NAMESPACE_ID=… \
  node scripts/kv-backup.js restore < promos.json
rm promos.json
```

## 7. GitHub security switches

Repository → **Settings → Code security**: turn on **Dependabot alerts**,
**Dependabot security updates**, **Secret scanning** and **Push protection**.
Weekly update pull requests come from `.github/dependabot.yml`; CI (lint, tests,
build, build check, `npm audit`) has to pass on each before merging.

## 8. Check it from outside once it is live

- <https://pagespeed.web.dev/> — `https://mklabs.co.zw/` (mobile and desktop)
- <https://search.google.com/test/rich-results> — home and a product page
- <https://validator.schema.org/> — any page
- <https://securityheaders.com/?q=mklabs.co.zw> — expect an A
- <https://www.ssllabs.com/ssltest/analyze.html?d=mklabs.co.zw> — expect an A
- `https://mklabs.co.zw/robots.txt`, `/sitemap.xml`, `/.well-known/security.txt`

Renew the `Expires` date in `public/.well-known/security.txt` before
September 2027. CI starts failing 30 days before it lapses, as a reminder.
