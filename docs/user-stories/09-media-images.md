# Epic 09 — Images (upload, resize, performance)

**Phase:** 4 with products  
**Problem:** Phone photos are 3–8MB. If we send originals, the consumer app feels slow. This is one of the most common reasons restaurant sites feel cheap.

## Recommended approach for THIS project

**On the API, at upload time, process with [Sharp](https://sharp.pixelplumbing.com/)** (the standard Node tool; Next.js image optimizer also uses similar ideas).

Do **not** only rely on the browser to “be careful”. Admins will upload huge photos.

### Pipeline

1. CEO uploads one file (JPEG/PNG/WebP, max **8MB**)
2. API checks magic bytes / mime (not only extension)
3. Sharp:
   - auto-orient (EXIF)
   - strip metadata (privacy + size)
   - convert to **WebP**
   - cap longest side
4. Save **three variants** (plus a bounded original if you want):

| Variant | Max width | Quality | Used for |
|---|---|---|---|
| `thumb` | 240 | ~70 | tiny lists, wishlist heart row |
| `card` | 800 | ~75 | home, menu grid |
| `detail` | 1400 | ~80 | product page |

5. Store files on disk v1: `uploads/products/{id}/card.webp` etc.
6. Serve via `GET /uploads/...` with long cache headers **or** a dedicated `GET /api/v1/media/:id/:variant`
7. Consumer uses **`next/image`** pointing at the **already small** `card`/`detail` URL (so the phone never downloads 8MB)

### What common products do

| Approach | Who uses it | Our choice |
|---|---|---|
| **Resize on upload (Sharp / ImageMagick)** | Many Node shops, self-hosted | **v1 yes** |
| **Cloudinary / ImageKit / imgix** | Lots of startups; transform via URL | Optional later if you want CDN + lazy transforms |
| **Next.js Image Optimization only** | Vercel apps | Helpful extra, **not enough alone** if you store originals |
| **S3 + Lambda resize** | AWS-heavy | Too much for one restaurant |

**Decision:** Sharp on upload + Next/Image on consumer. Revisit Cloudinary only if disk/backup becomes painful.

### RSA-044 — Upload API (CEO)

`POST /api/v1/admin/products/:id/images` multipart

**Security (file upload)**
- Auth CEO
- Max 8MB
- Allow jpeg, png, webp only
- Random file names, never use original filename on disk
- No SVG (XSS risk)
- Limit images per product (e.g. 6)
- Upload dir outside git, not executable

**Acceptance criteria**
- Response returns `{ id, variants: { thumb, card, detail } }` URLs
- Original huge file is **not** exposed to the consumer
- Failed Sharp → 400, product not left half-broken

---

### RSA-045 — Consumer image usage

**Story:** As a guest on 4G, menu images load fast.

**Acceptance criteria**
- Cards use `card` variant
- Detail uses `detail` + thumbs for gallery
- `width`/`height` or aspect-ratio reserved (no layout jump)
- Lazy load below the fold (`loading="lazy"` / next/image default)
- Hero/banner: dedicated banner sizes (see banners epic)

**Read**
- https://web.dev/learn/images
- Sharp docs  
  Excel `10-ImageStrategy`

---

### RSA-046 — Image failures and empty images (locked)

**Rule:** `image === null` is normal for v1. The UI never shows a broken-image icon.

| Slot | If null or onError | File |
|---|---|---|
| Product card / detail / wishlist / cart thumb | product placeholder | `docs/brand/assets/placeholder-product.svg` |
| Banner / hero | banner placeholder | `docs/brand/assets/placeholder-banner.svg` |
| Header logo | always the official artwork | `docs/brand/assets/logo.jpg` |

**Component contract (consumer)**
- `ProductImage({ src, alt, sizes })` — if `!src`, render placeholder with `alt` still the dish name
- Reserve 4:3 box so the grid does not jump
- Later: copy these files to `apps/consumer/public/brand/`
- Logo is `logo.jpg` only

CEO may publish products with zero photos. Seed uses `docs/data/image-map.json` for the photos in `/imgs`. Unmapped products → placeholder.

**Current mapped dishes (7 unique photos, 3 Telegram duplicates skipped):** see `docs/data/image-map.json`.

---

### RSA-047 — Brand logo

**Story:** As a guest, I see كبابجي شعبان in the header, not a Next.js default icon.

- Source of truth: `docs/brand/assets/logo.jpg`
- Later copy to `apps/consumer/public/brand/logo.jpg` (and dashboard)
- `object-fit: contain`, max height ~48–56px, do not crop the chef hat or side stars
- White header background
- Do not redraw “كبابجي شعبان” as CSS text in the header — use the image
- `alt`: كبابجي شعبان
