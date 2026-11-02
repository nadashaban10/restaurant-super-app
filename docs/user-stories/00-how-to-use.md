# How to use these user stories

You are the reviewer. Cursor is the implementer. This folder is the source of truth until you change it.

## Rules for implementation (read before any code)

1. **No app code until Nada reviews and approves the story / phase.**
2. Implement **one phase at a time**, in the Excel checklist order (`04-StepChecklist`).
3. If a story conflicts with a **Locked Decision**, the locked decision wins.
4. All money math (price, discount, line total, cart total, tax if any) is **calculated on the API**. The UI only displays API numbers.
5. Consumer app is **Next.js**. Dashboard is **React (Vite)**. API is **Node + TypeScript**. Three separate app folders.
6. **Arabic primary + English** from day one. Default locale = `ar` (SEO + brand). User can switch to `en`. Arabic uses RTL-first layouts.
7. **Responsive** for mobile, tablet, desktop. Design mobile first.
8. Security and environments start in Phase 1, not after features.
9. Do not invent payment gateways, promo codes, multi-restaurant, kitchen hardware, extra phone numbers, or a restaurant founding story. Use only the phones in `docs/brand/restaurant-identity.json`.
10. **Kababgy Shaaban** identity, copy, and menu live in `docs/brand/` and `docs/data/`. Variants are required in v1 (see `18-variants.md`).
11. All money math on the API uses the **variant** price, not a product-level price.

## How Cursor should read a story

Each story contains:

- **Persona** — who it is for
- **Story** — the user outcome
- **In scope / Out of scope**
- **UX** — layout, states, RTL, empty/loading/error
- **Acceptance criteria**
- **API** — endpoints and who can call them
- **Folder hints** — where files should live
- **Performance / security notes**
- **Cursor implementation brief** — how to build it

If something is missing, **ask Nada**, do not guess product behavior.

## Story ID prefix

`RSA-xxx` = Restaurant Super App story.

Status in Excel: `Draft → Reviewed → Ready for Cursor → Done`.

## Suggested review order for you

1. Excel sheet `01-LockedDecisions` (confirm)
2. Excel sheet `12-OpenQuestions` (answer what you can)
3. Stories `01` to `03` (architecture, security, deploy)
4. Stories `04` to `06` (i18n, layout, admin auth)
5. Stories `07` to `10` and **`18-variants.md` + `19-seo-nextjs.md`** (catalog, images, home, SEO)
6. Stories `11` to `14` (wishlist, cart, discounts, orders — cart includes variantId)
7. Stories `15` to `16` (CEO dashboard, cashier)

Approve Phase 1 stories first so setup can start after your review.

## After you approve a phase — paste this to Cursor

```
You are implementing the Restaurant Super App.
Do not invent product behavior.

Read first:
- docs/brand/restaurant-identity.json
- docs/data/menu-seed.json (prices on variants; defaultVariantId)
- docs/user-stories/00-how-to-use.md
- docs/user-stories/18-variants.md
- docs/user-stories/19-seo-nextjs.md

Implement ONLY Phase X (replace X).
Stories to implement: RSA-... (list ids)
Follow folder structure in 01-foundation-architecture.md
All money math on the API. EN+AR + RTL. Three apps: consumer, dashboard, api.

When a product question is missing, ask me. Do not guess.
```

Do not send that prompt until you have reviewed the stories for that phase.
