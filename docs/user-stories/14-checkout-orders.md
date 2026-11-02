# Epic 14 — Checkout and orders (thin v1)

**Phase:** 8  
**Important:** Payment methods and kitchen hardware are **not decided**. This epic only creates a **trusted order** the cashier can see.

## v1 fulfillment (until Nada decides)

Brand copy talks about **local delivery** and 24/7. Checkout is still a workshop, but UI/SEO must not pretend they are closed at night.

Default if still undecided: collect **name + phone + notes**; optional one-line **address** (free text, no zones). Payment: **pay on delivery / at restaurant** — we do not collect money in the app.

Copy: avoid hard-coding “pickup only” if you still want delivery. Use “هنأكد الطلب بالتليفون” until the workshop.

### RSA-070 — Create order API

`POST /api/v1/orders`

```json
{
  "items": [{ "productId": "...", "variantId": "...", "quantity": 2 }],
  "customer": { "name": "...", "phone": "...", "notes": "..." },
  "locale": "ar"
}
```

**Server**
1. Re-quote from DB (same pricing service)
2. Reject if any item unpublished, deleted, or `isAvailable=false`
3. Reject empty cart, bad phone, missing name
4. Insert order:

- `code` human friendly: `KS-1042` (Kababgy Shaaban), not RSA
- `status`: `new` | `preparing` | `ready` | `cancelled`
- `items[]` **snapshot**: title en/ar, **variant name en/ar**, qty, unit final, line final, productId, variantId
- `totals` snapshot
- `customer` snapshot
- `fulfillment`: `unspecified` until workshop (`pickup` | `delivery` later)
- `payment`: `{ method: "at_restaurant", status: "unpaid" }`
- timestamps

5. Return `{ code, id, status, totals, items }`

**Security**
- Public endpoint but **rate limited** (e.g. 5 orders / 10 min / IP)
- No auth
- Do not accept totals from client
- Do not expose other orders (`GET` by id requires knowledge of id **and** we should use a secret token or only the `code` + phone later).  
  **v1:** confirmation page uses data **returned once** from POST + `sessionStorage`.  
  `GET /orders/:id` is **admin only**. Prevents strangers enumerating orders.

---

### RSA-071 — Checkout UI

**Steps (single page v1, not a wizard)**
1. If cart empty → redirect menu
2. Refresh quote; block if unavailable items
3. Fields: name, phone, notes
4. Read-only totals from quote
5. Note: pay on delivery / at the restaurant (i18n). 24/7 — no “opens at 10am”
6. Submit → success with **order code** large, items **with sizes**, total

**UX**
- Phone keypad `inputMode=tel`
- Validation inline AR/EN
- Disable submit while in flight
- Success: clear cart

**Out of scope:** map, tip, online pay, invoice PDF, SMS gateway (nice later)

---

### RSA-072 — Order access rules

- Guest cannot list all orders
- Admin can list/filter
- Do not leak other customers’ phone/name on public routes

---

### RSA-073 — Later discussion (do not implement)

Write this as a parking lot, not code:

- Online payment (card, wallet, Apple Pay)
- How the kitchen is notified (WhatsApp, print, sound on cashier tablet)
- Delivery vs pickup
- Estimated time
- Order tracking for the guest

Nada + PO will open a dedicated workshop before Phase 8 implementation if these are still unclear. Pickup + pay-at-restaurant is enough to test the loop.
