# Epic 05 — Design system, header, footer, responsive

**Phase:** 2  
**Apps:** consumer (visual identity), dashboard (simpler, operational)

## Design principle

Consumer can feel like a restaurant brand (warm, food, photos).  
Dashboard must feel like a **tool**: high contrast, large buttons, no decoration that slows a cashier.

We do not need Figma to start, but we need tokens so Cursor does not invent a new color every screen.

### RSA-032 — Design tokens

**Story:** As the developer, I have one place for color, type, space, radius, breakpoints.

**Tokens — locked from the official logo (`docs/brand/assets/logo.jpg`)**

| Token | Hex | Meaning |
|---|---|---|
| `--brand-red` | `#D31A1A` | Logo oval, primary CTA, badges, active nav |
| `--brand-red-hover` | `#B01414` | Button hover |
| `--brand-black` | `#111111` | Body text, footer, logo frame |
| `--brand-white` | `#FFFFFF` | Header bar, button text |
| `--page-bg` | `#F7F7F7` | Page background (light so the red logo pops) |
| `--surface` | `#FFFFFF` | Cards |
| `--muted` | `#6B6B6B` | Secondary text |
| `--success` | `#2F6B3A` | Order ready |
| `--danger` | `#9B1C1C` | Sold out / cancel |

- **Do not** use orange/ember as primary. The logo is crimson red + black + white.
- Header: **white** bar, logo image `object-fit: contain`, height ~48–56px (keep chef hat visible). Do not put the logo on a black header (the black frame disappears).
- CTA buttons: red fill, white text, not outlined gray.
- Font: **Cairo** for UI. Never recreate the logo in CSS text.
- Space scale: 4/8/12/16/24/32/48
- Breakpoints: `360` / `768` / `1024` / `1280`
- Tap target min 44px
- Photography: close-up charcoal meat. **Avoid** luxury fine dining, Western burgers, Pharaonic clip-art.
- Dashboard: same red/black, less decoration, high contrast.

**Acceptance criteria**
- CSS variables in consumer and dashboard (can duplicate tokens for now)
- Dark mode **not** required for v1

---

### RSA-033 — Consumer header

**Persona:** Guest

**Story:** As a guest, I always see brand, language, cart, and main links.

**Desktop**
- Logo from `docs/brand/assets/logo.jpg` (`object-fit: contain`, do not crop the chef hat)
- Nav: الرئيسية / Home, المنيو / Menu, wishlist icon, cart + count
- Language switcher `عربي | EN`
- Click-to-call: primary `01154626325` (`tel:+201154626325`). Second order number in the drawer + footer. Do not put complaints in the header.

**Mobile**
- Logo, language, cart
- Menu in a drawer or bottom nav — **prefer hamburger drawer** for v1 (simpler)
- Cart count badge always visible

**States**
- Scrolled: header stays (sticky), slight shadow
- No “we’re closed” banner in v1 — restaurant is **24/7 / always open**

**Out of scope:** user avatar (no consumer login in v1)

---

### RSA-034 — Consumer footer

**Story:** As a guest, I can find address, hours, phone, and social links.

**Footer NAP (must match SEO JSON-LD)**
- كبابجي شعبان / Kababgy Shaaban
- Optional tagline: للسيخ .... تاريخ
- السواح، الأميريه القاهرة / El Sawah, El Amerya, Cairo
- مفتوح 24 ساعة / Open 24 hours
- Facebook from identity file
- Order phones (tap-to-call): `01154626325` and `01223375293`
- Complaints only here, labelled شكاوى: `01101421344` (`tel:+201101421344`)
- Prices in EGP

**v1:** copy from `docs/brand/restaurant-identity.json` + i18n files. CEO settings screen later.

---

### RSA-035 — Responsive behavior

**Story:** As a guest, I can complete browse → cart on a 390px phone and a desktop.

**Acceptance criteria**
- No horizontal scroll on 360px
- Product grid: 1 col mobile, 2 tablet, 3–4 desktop
- Sticky “Add to cart” on product detail (mobile)
- Dashboard usable on tablet (cashier) and laptop (CEO)
- Touch: no hover-only actions

**Cursor brief**
- Mobile-first CSS
- Test 375, 768, 1280 (Nada will also review in browser after implementation)
