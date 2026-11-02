# Epic 10 — Home, hero, banners

**Phase:** 5 consumer, CEO CRUD can follow in phase 10 of the Excel plan  
**v1 content:** CEO manages banners; Nada can seed via Postman.

## Home page structure (consumer)

1. Header
2. Hero (one strong image or slider max 3)
3. Optional promo banners strip
4. Featured / “Popular” products (published only)
5. Categories snapshot → link to full menu
6. Footer

Keep it hungry and local — this is **كبابجي شعبان**, not a marketplace.

Hero copy from `docs/brand/restaurant-identity.json` → `lockedCopy`.
CTA: **اطلب دلوقتي** / Order now → menu.
Subline: السواح، الأميريه — مفتوح 24 ساعة.

Featured products: seed flag `featuredOnHome` (first grills). Cards use **default variant price only** (RSA-112).

Category snapshot: real categories from seed (المشويات، الصواني، الحواوشي…).

### RSA-050 — Hero

**UX**
- Full width, ~60vh mobile / ~70vh desktop, image + overlay + restaurant name + CTA “Order now” → menu
- Text from `lockedCopy` in the identity JSON (do not invent a brand story)
- Overlay: dark scrim + red CTA (`#D31A1A`), not orange
- Image: `docs/brand/assets/banners/hero-grill.jpg` until CEO replaces banners

**Performance:** one hero image, not five autoplay videos. If slider, **max 3**, pause autoplay in RTL still works, respect `prefers-reduced-motion`.

---

### RSA-051 — Banners (item-level marketing, not promo codes)

Banners are **visual**. Discounts themselves live on products (see discounts epic). A banner might say “20% on grilled” but the **price still comes from product discount fields**, not from the banner.

**Model**
- `title` en/ar optional
- `image` (banner variant: width 1200, height 400)
- `link` optional (internal path e.g. `/menu?category=grills`)
- `isActive`
- `sortOrder`
- `status` active/inactive (deleted = remove)

**Public:** `GET /api/v1/banners` active only  
**CEO:** CRUD admin routes

**UX:** horizontal snap cards on mobile, row on desktop. If zero banners, omit the section (no empty box).

---

### RSA-052 — Home data fetching

**Rendering**
- Server Component: fetch banners + featured products in parallel
- Short cache (30–60s) is OK
- If API down: error state with retry, not a white page

**Acceptance criteria**
- Unpublished products never appear
- Home is usable on 375px
- Home is usable on 375px, RTL
- `generateMetadata` + Restaurant JSON-LD (RSA-120, RSA-121)
- Featured cards show default variant only; **null image → placeholder-product.svg**
