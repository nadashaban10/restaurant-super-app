# Epic 08 — Products (catalog)

**Phase:** 4 (API) then 5 (consumer UI) then 15 (CEO screens)  
**Owner of data:** CEO via dashboard. Nada may inject via **Postman** after APIs exist.

## Product states (locked)

A product is in **exactly one** state:

| State | Consumer | Dashboard CEO | Meaning |
|---|---|---|---|
| `unpublished` | hidden | visible, labelled | Draft / hidden from site |
| `published` | visible | visible | Live |
| `deleted` | hidden | hidden (not in default lists) | Permanently deleted |

**Permanent delete:** CEO confirms. Product `status = deleted` and `deletedAt` set (**soft delete** in DB).  
Why soft: if an old order referenced that product, history still makes sense.  
Consumer and default admin lists never show `deleted`. No “restore” in v1 (can add later). Hard delete from disk images optional later.

Unpublished ≠ deleted. Unpublished can be published again.

## Fields (v1)

See **`18-variants.md`** — this restaurant sells by portion. Price is **not** on the product root.

- `slug` unique (English, stable URLs, from seed)
- `title`: `{ en, ar }` — Arabic from restaurant, English from seed (editable)
- `description`: `{ en, ar }` optional (required for platters)
- `categoryId` — 14 categories from `docs/data/menu-seed.json`
- `defaultVariantId` required
- `variants[]` each with `name {ar,en}`, `priceAmount` integer piastres, `sortOrder`
- Discount on **product**, applied to the chosen variant (see discounts epic)
- `images[]`
- `status`: `unpublished` | `published` | `deleted`
- `isAvailable` boolean (sold out today)
- `sortOrder`, `featuredOnHome`
- timestamps

**No** client-sent final price.

Seed: `docs/data/menu-seed.json` (72 products, 113 variants, EGP). Images empty until upload.

Categories: collection from seed (`المشويات`, `الصواني`, …). Do not invent extra categories.

### RSA-040 — Product model + public read APIs

**Public**
- `GET /api/v1/products?locale=ar` → published + available (or include unavailable as “sold out” — **include sold out, not clickable add**)
- `GET /api/v1/products/:slug`
- Unpublished/deleted never returned publicly (404 on slug)

**Response product card** — default variant only (see RSA-111):

```json
"defaultVariant": {
  "id": "var_baladi-kofta_quarter-kg",
  "name": { "ar": "1/4 ك", "en": "1/4 kg" },
  "price": {
    "currency": "EGP",
    "originalAmount": 18000,
    "discountAmount": 0,
    "finalAmount": 18000
  }
}
```

Detail endpoint returns **all** `variants` with a `price` object each.

Amounts integers (piastres). UI formats them as EGP.

---

### RSA-041 — CEO product write APIs

**CEO only**
- `POST /api/v1/admin/products` — create as `unpublished` by default
- `PATCH /api/v1/admin/products/:id`
- `POST /api/v1/admin/products/:id/publish`
- `POST /api/v1/admin/products/:id/unpublish`
- `DELETE /api/v1/admin/products/:id` — permanent (soft)
- `GET /api/v1/admin/products` — filter by status, exclude deleted by default, `?includeDeleted=false`

**Cashier:** 403

**Validation:** titles both locales required before **publish**; `defaultVariantId` valid; every variant `priceAmount > 0`; at least one image **or** allow publish without image in v1 so we can seed the real menu before photos (lock: **publish without image allowed**, consumer shows plated placeholder).

---

### RSA-042 — Consumer catalog UI

**Screens**
1. Menu page: category chips in restaurant order (المشويات first … المشروبات last)
2. Product detail: gallery, description, **all variants**, add to cart

**UX — follow RSA-112 / RSA-113**
- Card 4:3: title, **default variant chip + price only**, Add uses default variant
- Card hint if more sizes exist
- Detail: variant radio chips, price updates, sticky add
- Platters: show included-items description prominently
- Empty category / skeletons / 404

**Rendering / performance**
- List: Server Component, `revalidate: 30`
- List payload must **not** include every variant (SEO pages still list dishes)
- `next/image` on `card` variant
- Metadata: RSA-120 (product title includes كبابجي شعبان)

**RTL:** category chips scroll inline; Arabic title larger than English when locale is ar

---

### RSA-043 — Postman collection (after write APIs)

**Story:** As Nada, I can create products without the dashboard finished.

**Acceptance criteria**
- `docs/postman/restaurant.postman_collection.json`
- Requests: login CEO, seed/import from `docs/data/menu-seed.json`, upload image, publish, get public list
- Environment file for local URL
- After APIs: you inject this real menu via Postman/seed, not dummy pizza data

This unblocks testing before CEO UI.
