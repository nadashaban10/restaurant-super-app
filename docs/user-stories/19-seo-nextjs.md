# Epic 19 — SEO (Next.js consumer) — Kababgy Shaaban

**Phase:** 2 (metadata shell) + 5 (real menu pages)  
**App:** `apps/consumer` only  
**Identity source:** `docs/brand/restaurant-identity.json`

SEO here is **local restaurant SEO**, not a Talabat marketplace. Google should understand: name, where, what food, open 24h, menu.

## Locked SEO facts

| Field | Value |
|---|---|
| Arabic name | كبابجي شعبان |
| English name | Kababgy Shaaban |
| Type | Egyptian kababgy / charcoal grill |
| Place | El Sawah, El Amerya, Cairo, Egypt |
| Hours | 24/7 (Always Open) |
| Currency | EGP |
| Primary language | **Arabic** |
| Secondary | English |
| Phone (orders) | 01154626325 and 01223375293 |
| Phone (complaints) | 01101421344 |
| Geo lat/lng | unknown — add later |
| Story / founded | unknown — do not invent |

## URL strategy (Next.js App Router + next-intl)

- Default locale **`ar`**. `x-default` hreflang = Arabic.
- Arabic home: `/` **or** `/ar` — pick **one** and stick. Recommendation: `/` = Arabic, `/en` = English (better for Cairo users and Google).
- Menu: `/menu`, `/menu/grills`, product `/menu/baladi-kofta` (English slugs from seed — stable for URLs).
- Hreflang on every page: `ar`, `en`, `x-default=ar`.
- Canonical = the locale you are on (no duplicate `/` and `/ar` both 200). If `/ar` exists, 301 it to `/`.

First visit: **Arabic is default** (brand + SEO). Saved switcher preference still wins. Optional: English-only `navigator.language` can land on `/en` without changing the canonical default of the site.

---

### RSA-120 — Metadata API per layout/page

Use Next.js `generateMetadata`. Never leave “My Next App”.

**Home AR**
- Title: `كبابجي شعبان | مشويات وفحم في السواح، الأميريه`
- Description: `كبابجي شعبان في السواح، الأميريه القاهرة. مشويات بلدي، كفتة، كباب، طرب، حواوشي وصواني عائلات. مفتوح 24 ساعة.`

**Home EN**
- Title: `Kababgy Shaaban | Egyptian Grill in El Sawah, Cairo`
- Description: `Charcoal kofta, kabab, tarab, hawawshi and family platters in El Sawah, El Amerya. Open 24 hours.`

**Pattern**
- `title.template`: `%s | كبابجي شعبان` / `%s | Kababgy Shaaban`
- Product title: `{product.title} | كبابجي شعبان`
- Product description: first 150 chars of dish + neighborhood keywords **without stuffing**
- `openGraph`: type website/article, locale `ar_EG` / `en_US`, image = product card or restaurant OG (placeholder until photos)
- `twitter` card summary_large_image
- `robots` index,follow on public pages; **noindex** on cart, checkout, wishlist
- `alternates.canonical` + `alternates.languages`

**Do not** put prices in `<title>` (they change). Prices belong on the page and in JSON-LD.

---

### RSA-121 — JSON-LD

On home (and footer-adjacent): `Restaurant` + `LocalBusiness`:

- `name`, `alternateName`
- `servesCuisine`: Egyptian, Kebab
- `address`: El Sawah, El Amerya, Cairo, EG
- `openingHoursSpecification`: 00:00–24:00 all days
- `priceRange`: `$$`
- `url`, `image` when we have one
- `telephone`: `+201154626325` and `+201223375293`
- `ContactPoint` for complaints: `+201101421344` (`contactType`: customer support)
- `sameAs`: Facebook URL from identity file
- `hasMenu` pointing at `/menu`

On menu: `Menu` with `hasMenuSection` per category.

On product: `MenuItem` with `name`, `description`, `offers` per variant (`price`, `priceCurrency: EGP`).

Render via a `<script type="application/ld+json">` in the Server Component. Keep JSON-LD in sync with API data (same titles/prices).

---

### RSA-122 — Technical SEO checklist

- `app/sitemap.ts` — home, menu, categories, published products, both locales
- `app/robots.ts` — allow `/`, disallow `/cart`, `/checkout`, `/wishlist`, `/api`
- Semantic HTML: one `h1` per page (restaurant name on home; dish name on detail)
- Images: real `alt` from product title locale, never empty, never “image1”
- Internal links: header/footer NAP (Name, Address, Hours) **identical** everywhere
- Fast LCP: hero + `priority` on first image only; Sharp variants
- No client-only menu (crawlable Server Components)
- 404 for unpublished slugs (not empty 200)
- Trailing slash policy consistent

**Read (for Nada)**
- https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- https://developers.google.com/search/docs/appearance/structured-data/restaurant
- https://developers.google.com/search/docs/appearance/structured-data/menu
- https://developers.google.com/search/docs/specialty/international/localized-versions

---

### RSA-123 — Content tone (copy, not code)

- Arabic UI: Egyptian casual (اطلب دلوقتي، شوف المنيو) — not MSA stiff, not slang-heavy to the point of unprofessional.
- English: simple, not “gourmet / fine dining”.
- Avoid Pharaonic clichés and Western burger stock photos.
- Do not invent a founding year or a brand story.

---

### RSA-124 — What SEO will still need from Nada

- Google Business Profile later (outside the app)
- Real food photos (biggest ranking/conversion gap) — placeholders until then
- OG image can use `logo.jpg` until a food hero exists
