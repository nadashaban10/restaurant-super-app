# Epic 04 — English / Arabic, RTL, device language

**Phase:** 2  
**Apps:** consumer (must), dashboard (must)

## Product rules

- Supported locales: `ar` (primary), `en` (secondary)
- **Default locale = Arabic** for SEO and first paint (`defaultLocale: 'ar'`). `/` is Arabic; `/en` is English.
- User can switch anytime. Persist choice in cookie (`NEXT_LOCALE`) + `localStorage`.
- If the visitor has **no** saved choice and `navigator.language` starts with `en`, they may land on `/en`. Everyone else lands on Arabic.
- Design **RTL first**. Arabic = `dir="rtl"`. English = `ltr`.
- UI chrome from `messages/ar.json` and `messages/en.json`. Tone: casual Egyptian Arabic (اطلب دلوقتي), not stiff MSA, not slang that hurts trust.
- Product names: Arabic is the restaurant source of truth. English in `menu-seed.json` is proposed for UI/SEO — CEO can edit.
- If a product is missing the current locale text, fall back to the other locale, then to `"—"`.
- Brand names stay **كبابجي شعبان** / **Kababgy Shaaban** — do not translate “Kababgy”.

### RSA-030 — Locale detection and switcher

**Persona:** Guest on phone

**Story:** As a guest, I see the site in my phone language, and I can switch EN/AR from the header without losing my cart.

**UX**
- Switcher in header: `EN | عربي` (flag optional; text is clearer)
- On switch: URL becomes `/ar/...` or `/en/...`, layout flips RTL/LTR, cart items remain
- No full ugly flash if possible (set cookie `NEXT_LOCALE` for SSR)

**Acceptance criteria**
- First visit with no cookie → Arabic (or `/en` only if device language is English)
- Switcher changes locale immediately; cart survives
- Choice remembered next visit
- `html[lang]` and `dir` are correct
- Dashboard defaults to Arabic (cashier)
- Font: **Cairo** (Arabic + Latin) or IBM Plex Sans Arabic — not a Latin-only font

**Folder hints**
- `apps/consumer/messages/en.json`
- `apps/consumer/messages/ar.json`
- `apps/consumer/components/layout/LanguageSwitcher.tsx`
- Use **next-intl** (documented, App Router)

**Performance**
- Do not load both huge font files if you can subset; use fonts that support Arabic (e.g. **IBM Plex Sans Arabic** + Latin, or **Cairo**)

**Read**
- next-intl docs
- CSS logical properties (`margin-inline-start` not `margin-left`)  
  Excel `07-LearningPath`

---

### RSA-031 — RTL layout quality

**Story:** As an Arabic user, nothing looks “English flipped badly”: arrows, filters, cart quantity, sticky bars all follow RTL.

**Acceptance criteria**
- Use logical CSS (inline-start/end, padding-inline)
- Icons that mean “forward” flip; brand logo does not mirror
- Numbers and prices: keep Western digits (`1 2 3`) unless the restaurant insists otherwise — **default: Western digits** for prices (clearer for money)
- Currency format via `Intl.NumberFormat` with locale

**Out of scope:** third language
