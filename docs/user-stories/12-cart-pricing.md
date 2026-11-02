# Epic 12 — Cart and trusted calculations

**Phase:** 6  
**This is a core epic.** If this is wrong, discounts and checkout are wrong.

## Rules

- Cart **contents** (product id + **variant id** + qty) live on the client in v1 (`localStorage`) for guests
- Cart **money** is never stored as truth on the client
- Any screen that shows a total must call `POST /api/v1/cart/quote`

### Quote request

```json
{
  "items": [{ "productId": "...", "variantId": "...", "quantity": 2 }]
}
```

No prices in the request. Missing `variantId` → 400. Reject extra money fields with 400.

### Quote response

```json
{
  "currency": "EGP",
  "items": [
    {
      "productId": "...",
      "variantId": "...",
      "slug": "baladi-kofta",
      "title": { "en": "Baladi kofta", "ar": "كفته بلدي" },
      "variantName": { "en": "1/4 kg", "ar": "1/4 ك" },
      "quantity": 2,
      "unitOriginalAmount": 18000,
      "unitFinalAmount": 18000,
      "lineOriginalAmount": 36000,
      "lineFinalAmount": 36000,
      "isAvailable": true,
      "status": "published"
    }
  ],
  "unavailableItemIds": [],
  "subtotalOriginalAmount": 36000,
  "subtotalFinalAmount": 36000,
  "totalAmount": 36000
}
```

`totalAmount` = subtotal for v1 (no delivery fee, no tax line until we decide). If you add fees later, **only on the server**.

### RSA-061 — Pricing service (single brain)

**Story:** As the restaurant, one function computes item and cart money.

**Implementation**
- `pricing.service.ts`: `priceVariant(product, variant)` and `quoteCart(items)`
- Used by: product GET, quote, create order
- Discount on product applies to the **variant** `priceAmount`
- Quantity: integer 1–99
- Unknown productId or variantId → 400 on create order; flag unavailable on quote

**Acceptance criteria**
- Unit tests later are nice; for v1 at least a few examples in comments or a `pricing.test.ts` if easy
- Two published products, mixed discount, check totals by hand

---

### RSA-062 — Cart UI (consumer)

**Persona:** Guest

**Story:** As a guest, I add dishes, change qty, and see server totals.

**UX**
- Cart icon count = sum of quantities
- Cart page: image thumb, **title + variant name**, qty stepper, line final price, remove
- Two sizes of كفتة = two rows
- Summary: subtotal, total (from quote)
- If quote says unavailable: banner “Some items are no longer available”, disable checkout for those lines
- Empty cart: CTA to menu
- Mini-cart optional — **skip in v1**, full page is enough

**Behavior**
- Add from **card**: default variant, qty 1
- Add from **detail**: selected variant + qty
- Debounce quote when qty changes (300ms) + always quote on cart page load
- Show skeleton on quote load; do not flash 0

**Rendering:** Client Component for cart page (localStorage). Do not SSR personal cart.

**RTL:** steppers and prices inline-safe.

---

### RSA-063 — Prevent price manipulation

**Story:** As a hostile user, if I send `totalAmount: 1` it is ignored.

**Acceptance criteria**
- Quote and create-order ignore client money
- Tampering does not reduce what they pay (there is no online pay yet, but the **stored order total** must be server-side — cashier must see the real total)
