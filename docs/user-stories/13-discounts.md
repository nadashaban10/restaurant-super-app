# Epic 13 — Item discounts (not promo codes)

**Phase:** 6 with pricing  
**Locked:** no coupon codes, no “WELCOME10”, no cart-level percent in v1 unless we explicitly add it later.

## How a discount works

CEO sets on **each product**:

- `discountType`: `none` | `percent` | `fixed`
- `discountValue`: number
  - percent: 0–100 (e.g. 15 = 15% off)
  - fixed: amount in **smallest currency unit** off the **unit** price (e.g. 2000 = 20 EGP off)

**Compute (integer math, never float):**

```
original = variant.priceAmount
if percent: off = floor(original * discountValue / 100)
if fixed: off = discountValue
off = min(off, original)
final = original - off
```

Percent is the safe choice for weight variants (¼ vs 1kg). A fixed 20 EGP off applies to **each selected variant unit**, not once per product.

`final` must be `>= 0`. If 0, still published only if CEO wants (free item — allow, rare).

No stacking. No codes. Banner text is marketing only.

### RSA-064 — CEO sets discount on product

**UX (dashboard product form)**
- Price fields are **per variant** in the form (see RSA-115)
- Discount type/value at **product** level
- Live preview should show default variant “Customer pays X” plus a note that percent applies to all sizes
- Consumer card: show `original` struck + `final` + small badge

**Acceptance criteria**
- Public APIs never trust a discount sent by the client
- Changing discount updates quote immediately (products fetched fresh)
- Unpublished products can have discounts prepared before publish

---

### RSA-065 — Display rules

- If `final === original`, do not show fake “0% off”
- Badge language from i18n + server `discountLabel` optional
- Accessibility: struck price marked as old price (`<s>` or `aria`)

**Out of scope:** happy hour schedules, “discount expires Friday” — later if needed
