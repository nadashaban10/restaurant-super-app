# Epic 11 — Wishlist

**Phase:** 7  
**v1:** guest device only (no consumer account)

## Decision

Because v1 has **no customer login**, wishlist is stored in **localStorage** on that browser.

- Key: `rsa_wishlist` = array of product ids
- If product unpublished/deleted/missing, hide it and clean the id
- Not synced across phones (explain in empty-state later if needed)

When consumer accounts exist, we will add a server wishlist and merge — out of scope now.

### RSA-060 — Add / remove wishlist

**Persona:** Guest

**Story:** As a guest, I can heart a product and see it later on this phone.

**UX**
- Heart on card and detail
- Filled = in wishlist
- Toast optional, keep it quiet
- Wishlist page: same **cards as menu** (default variant price), remove heart
- Empty: “Save dishes you love” + CTA to menu

**Acceptance criteria**
- Works logged-out
- Survives refresh
- RTL heart position uses logical properties
- Does not call a write API in v1

**Performance:** wishlist page fetches public products by ids (`GET /products?ids=`). Do not store full product JSON only (stale prices). **Always refresh prices from API when opening wishlist.**

**Security:** still no trust of stored prices.
