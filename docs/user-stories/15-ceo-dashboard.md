# Epic 15 — CEO dashboard (catalog operations)

**Phase:** 9 (can overlap with APIs in phase 4 via Postman first)  
**Persona:** CEO on a laptop

## Layout

- Side nav (desktop): Products, Banners, Orders, Logout
- Top bar: locale switcher, who is logged in (`ceo`)
- Mobile: collapse nav — CEO is not the primary mobile user, but it must not break

### RSA-080 — Products table

**Story:** As CEO, I manage the menu without a developer.

**List**
- Image thumb, title, **default variant price** (and “sizes” if many), discount, status chip, available toggle, actions
- Filters: all / published / unpublished
- Search by title
- Deleted not shown

**Actions**
- Create
- Edit
- Publish / Unpublish (confirm)
- Permanent delete (typed confirm: product title or “DELETE”)
- Toggle sold out (`isAvailable`)

**Form**
- EN and AR titles (Arabic first in the form)
- Category
- Variants editor (RSA-115): name ar/en, price EGP, default radio
- Discount type/value (product-level)
- Images: upload, reorder, delete (optional for publish)
- Save as unpublished; separate “Save and publish”

**UX**
- Saving states, toast success
- Validation errors next to fields
- Do not lose form on a single image fail

**Accessibility:** labels, keyboard

---

### RSA-081 — Banners admin

Simple list + form (image, link, active, sort). Empty state with “Add banner”.

---

### RSA-082 — CEO orders view

Same data as cashier, plus filters. CEO can also change status.  
UI can be denser than cashier (table). Cashier gets a dedicated inbox (next epic).
