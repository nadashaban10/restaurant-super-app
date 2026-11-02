# Epic 07 — Consumer authentication (v1 guest, accounts later)

**Phase:** v1 = guest only. Optional account is **Phase later**, stories written so we do not paint ourselves into a corner.

## v1 decision (locked)

- Browse without login
- Cart without login
- Checkout as **guest** (name + phone + notes)
- **No** consumer register/login in v1
- Wishlist in v1 = **device local storage** (see wishlist epic)

### RSA-024 — Guest identity (minimal)

**Story:** As a guest, I can order without creating an account.

**Checkout fields (v1)**
- Full name (required)
- Phone (required, validate format loosely; store as string)
- Notes (optional)
- Fulfillment: **TBD** (pickup vs delivery — see open questions). If still unanswered at implementation, implement **pickup only** + note field.

**Acceptance criteria**
- No email required
- Order stores guest snapshot (name, phone)
- No password

---

## Later (do not implement now) — keep in mind

When Nada approves consumer accounts:

- Optional create account after checkout
- Previous orders
- Profile
- Server-side wishlist merge

**Do not** block v1 on this.

### RSA-025 — (Later) Consumer register / login

Status: **Backlog / not for Cursor yet**

Placeholder so the data model can allow `userId` nullable on orders:

- `orders.customer` = `{ name, phone, userId?: ObjectId }`

When implementing v1 orders, keep `userId` optional.
