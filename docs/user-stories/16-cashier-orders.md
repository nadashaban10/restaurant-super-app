# Epic 16 — Cashier orders inbox

**Phase:** 8–9  
**Persona:** One staff at the cashier, often a tablet

This screen is the “communication with the restaurant” for v1: **a person looks at the dashboard**. No printer/WhatsApp yet.

### RSA-090 — Inbox UX

**Story:** As the cashier, I notice new orders immediately and mark them ready.

**Layout (tablet first)**
- Almost no nav: logo, language, logout
- List of orders: `new` first, then `preparing`
- Each card: **code**, time ago, customer name, phone (tap-to-call), total, items **with variant names**
- Tap → detail: full items, notes, status buttons

**Status buttons (large)**
- New → Preparing
- Preparing → Ready
- Cancel (confirm)

**Ready / cancelled** drop to a “Done today” tab so the inbox stays clean.

**New order signal (v1)**
- Poll every 8–10 seconds (`GET /api/v1/admin/orders?status=new,preparing`)
- Visual highlight on new
- Optional short sound toggle (off by default, cashier can enable) — **include simple beep**, they will want it

**Do not** build web sockets in v1 unless polling is proven too slow (it will not be for one restaurant).

---

### RSA-091 — Cashier API

- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/:id`
- `PATCH /api/v1/admin/orders/:id/status` body `{ status }` with allowed transitions

**Authorization:** cashier + ceo  
**Forbidden:** product write

**Acceptance criteria**
- Invalid transition 400
- Two cashiers not needed; still avoid lost updates with `updatedAt` if easy

---

### RSA-092 — Dashboard empty and error states

- No orders: “No orders yet”
- API down: retry
- Session expired: back to login
