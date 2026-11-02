# Epic 17 — Cross-cutting quality (every module)

Not a feature. Cursor must apply these on every screen.

### RSA-100 — States every list/page needs

- Loading (skeleton)
- Empty
- Error + retry
- Success (forms)
- Disabled / sold out
- Offline optional later

### RSA-101 — Performance defaults

- Images: Sharp variants + next/image
- No unused client JS on home (keep cart/switcher client)
- Paginate admin products if > 50
- Public products: ~72 items is fine as one list grouped by category; no pagination required in v1
- Compression: gzip/brotli on hosts (usually default)

### RSA-102 — API conventions

- Prefix `/api/v1`
- JSON errors `{ error: { code, message } }`
- Auth via cookie
- Dates ISO
- Money integers
- Locale query or `Accept-Language` — **prefer explicit `locale` query or product bilingual objects always returned** (return both en and ar always; UI picks). Simpler caching.

### RSA-103 — Accessibility baseline

- Labels on inputs
- Contrast
- Focus visible
- Language attribute
- Do not rely on color alone for sold out

### RSA-104 — What we will not build in v1

- Multi-tenant / Talabat clone
- Promo codes
- Consumer login
- Online payment
- Drivers / live map
- Complex kitchen display hardware
- Reviews, loyalty, chat
- Paid add-ons (extra bread/tahini as separate SKUs later — seed addons are empty)
- Dark mode
- Restore deleted products
- More than two admin users

Weight/portion **variants are in v1** — see `18-variants.md`.
