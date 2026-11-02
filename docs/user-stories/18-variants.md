# Epic 18 — Variants (weight / portion) — locked for Kababgy Shaaban

**Phase:** 4–6 (model with products, UI with catalog, quote with cart)  
**Source data:** `docs/data/menu-source.json` → generated seed `docs/data/menu-seed.json`  
**Brand:** `docs/brand/restaurant-identity.json`

This is **not** extras/addons. The menu is sold by **portion size**. Almost every grill item is 1 ك / ½ ك / ¼ ك / ⅛ ك. Chicken is whole / half / quarter. Many kitchen items have a single price (one implicit variant).

## Locked rules

1. **Every product has one or more variants.** A single-price item (حواوشي، سلطة) has one implicit variant (`حبة` / `Single`). The consumer **does not** see a size picker if there is only one variant.
2. **Price lives on the variant**, never on the product root.
3. **Every product has `defaultVariantId`.**
4. **Home + menu cards** show **only the default variant** (name + price).
5. **Product detail** shows **all variants** as selectable chips.
6. **Cart / quote / order** line = `productId` + `variantId` + `quantity`. Two sizes of the same dish = two lines.
7. Client never sends prices. Server loads the variant from DB.
8. Item discount (percent or fixed) is set on the **product** and applied to the **selected variant’s** `priceAmount`.

## Default variant (seed rule)

Used in `menu-seed.json` and must be the CEO default unless they change it:

- If a `1/4 ك` or chicken `1/4` exists → **that is default** (normal neighborhood order).
- Else the only variant.
- Else the cheapest.

CEO can change default later in the dashboard.

Example: كفته بلدي card shows **¼ ك · 180 EGP**, not 720 EGP for a kilo.

---

### RSA-110 — Data model

```
Product
  defaultVariantId
  discountType / discountValue
  variants[]:
    id, code, name {ar,en}, priceAmount (piastres), sortOrder, isAvailable
```

**Money:** 180 EGP → `18000` piastres. Format with `Intl` in the UI.

**Seed:** API (or a later seed script) imports `docs/data/menu-seed.json`. Images stay empty until CEO/Postman uploads.

**Publish rules:** at least one variant with `priceAmount > 0`; both titles; defaultVariantId must point at an existing variant.

---

### RSA-111 — Public product payload

**Card / list** (home, menu, wishlist):

```json
{
  "id": "prd_baladi-kofta",
  "slug": "baladi-kofta",
  "title": { "ar": "كفته بلدي", "en": "Baladi kofta" },
  "defaultVariant": {
    "id": "var_baladi-kofta_quarter-kg",
    "name": { "ar": "1/4 ك", "en": "1/4 kg" },
    "price": { "currency": "EGP", "originalAmount": 18000, "finalAmount": 18000 }
  },
  "hasMultipleVariants": true
}
```

Do **not** send all variants on the home grid (smaller JSON, faster).

**Detail** `GET /products/:slug` includes `variants[]` (all, sorted) and `defaultVariantId`.

---

### RSA-112 — Home & menu card UI

**UX (RTL first, Arabic names prominent)**
- Photo 4:3
- Title Arabic (or EN on English locale)
- Default size as a small chip: `ربع كيلو` / `1/4 kg`
- Price of that default only
- If `hasMultipleVariants`: hint `أحجام تانية` / `More sizes` (text, not a dropdown on the card)
- Primary button **أضف** / **Add** → adds **default variant**, qty 1, toast, stay on page
- Tapping the card (not the button) → detail

**Do not** put four prices on the card. That is the detail screen.

Sold out: if default variant unavailable but others exist, still open details; if product `isAvailable=false`, overlay.

---

### RSA-113 — Detail screen — all variants

**UX**
- Gallery
- Title + description (platters must show the included items)
- **Size/portion group** (radio chips, large tap targets): all variants
- Pre-select `defaultVariantId`
- Price **updates** when chip changes (from API payload; still no client math for discounts — use `price` object per variant from server)
- Qty stepper
- Sticky **أضف للطلب** on mobile
- After add: keep the selected variant (user may add another size)

**A11y:** `radiogroup` labelled “الحجم” / “Portion”

---

### RSA-114 — Cart with variants

localStorage:

```json
[{ "productId": "...", "variantId": "...", "quantity": 2 }]
```

Quote request **must** include `variantId`. Missing → 400.

Cart row shows: thumb, product title, **variant name**, qty, line total from quote.

Same product different variants = separate rows.

---

### RSA-115 — CEO variant editor

On the product form: list of variants (name ar/en, price EGP, default radio, sort, delete).  
Cannot delete the last variant.  
Cannot publish with no default.

Cashier order detail shows variant name on each line.

---

## Cursor brief

- Import seed JSON only after product APIs exist (Phase 4).
- English names in the seed are **proposed** for SEO/UI — Arabic is source of truth from the restaurant.
- Flag resolved with Nada: shish tawook ½ kg 250; category الجريل; platter copy cleaned.
