# Epic 01 — Foundation, architecture, repo

**Phase:** 1  
**Apps:** all three  
**Depends on:** Nada review of locked decisions

## Goal

Create a small, boring, professional structure that a solo developer can run locally and deploy to a test environment. No restaurant features yet.

## Locked architecture

Single restaurant (one tenant). Not a marketplace.

```
restaurant-super-app/
  apps/
    consumer/      # Next.js (App Router) + TypeScript — public ordering site
    dashboard/     # Vite + React + TypeScript — CEO + cashier
    api/           # Node + Express + TypeScript — only backend
  docs/
    po/            # Excel plan
    user-stories/  # this folder
    postman/       # later
  infra/
    docker-compose.yml   # local MongoDB
  .env.example
  .gitignore
  README.md
```

Do **not** put consumer and dashboard in the same Vite app. Three folders, three processes.

Optional later (not Phase 1): `packages/shared-types`. Duplicate types at first is OK.

## Why this shape

- You asked for three apps. A monorepo (one git repo, three folders) still lets you deploy them separately.
- TypeScript everywhere reduces mistakes on prices, roles, and locales.
- Express is the most documented Node style for a first backend. NestJS is extra complexity we do not need.

## Cursor implementation brief

- Scaffold three apps with TypeScript strict mode.
- Consumer: Next.js latest App Router. Dashboard: Vite React. API: Express + tsx or ts-node-dev.
- Shared local Mongo via Docker Compose (`mongo:7`, port 27017, named volume).
- Each app has its own `.env.example`.
- Root README: how to run API, consumer, dashboard, and Mongo.
- API `GET /health` returns `{ ok: true, env: "local" }`.
- No business routes yet.
- Add `.gitignore` for `node_modules`, `.env`, `dist`, `.next`, uploads.

---

### RSA-001 — Monorepo folders exist and run empty apps

**Persona:** Developer (Nada)

**Story:** As the developer, I can clone the repo, start Mongo, start three apps, and see three hello screens / health check, so I am not blocked by setup later.

**In scope**
- Folder structure above
- `apps/api` listens on `3001` (configurable)
- `apps/consumer` on `3000`
- `apps/dashboard` on `3002`
- Docker Compose for Mongo
- README in English (short)

**Out of scope**
- Login, products, UI design system, i18n complete
- Production cloud accounts (that is RSA-010, same phase but separate story)

**Acceptance criteria**
- `docker compose -f infra/docker-compose.yml up -d` starts Mongo
- API health returns 200
- Consumer shows a placeholder home (no crash)
- Dashboard shows a placeholder screen (no crash)
- `.env` is not committed; `.env.example` lists required keys without secrets

**Folder hints**
- `infra/docker-compose.yml`
- `apps/api/src/index.ts`
- `apps/api/src/config/env.ts` — validate env with Zod on boot, crash if missing

**Security notes (already in Phase 1)**
- Fail fast if `JWT_SECRET` / `MONGO_URI` missing (even if unused yet, define them)
- Do not enable CORS `*` in production env; local may allow `localhost:3000` and `localhost:3002`

---

### RSA-002 — API layering (how to structure Node)

**Persona:** Developer

**Story:** As the developer, I have a predictable API folder layout so every later module lands in the same place.

**Target API folders**

```
apps/api/src/
  modules/
    health/
  common/
    middleware/     # error handler, auth, rate limit
    security/       # helmet setup, cors, sanitization
    http/           # AppError, asyncHandler
    validation/     # zod helpers
  config/           # env, cors origins
  db/               # mongoose connection, models index
  types/
```

Each future module (`products`, `auth`, `orders`, `media`, `banners`) must be:

```
modules/<name>/
  <name>.model.ts
  <name>.schema.ts      # zod request schemas
  <name>.service.ts     # business rules + calculations
  <name>.controller.ts
  <name>.routes.ts
  <name>.types.ts
```

Controllers do not talk to mongoose directly. Services do not send HTTP.

**Acceptance criteria**
- Health module follows this pattern
- Global error middleware returns `{ error: { code, message } }` JSON, never stack traces in production
- Unknown routes return 404 JSON

**Read if this is new**
- Excel `07-LearningPath` rows: REST, Express routing, 12-factor config

---

### RSA-003 — Consumer and dashboard folder conventions

**Consumer (`apps/consumer`)**

```
app/[locale]/
  layout.tsx
  page.tsx
components/
  layout/
  shared/
features/           # one folder per domain later: catalog, cart, wishlist
lib/
  api/              # fetch wrappers to apps/api
  i18n/
messages/
  en.json
  ar.json
```

- Route group by locale (`en` / `ar`) using next-intl (or equivalent).
- Server Components by default. Client Components only for interactivity (switcher, cart, sticky bar).
- No prices hardcoded in components.

**Dashboard (`apps/dashboard`)**

```
src/
  app/              # or src/pages with router — prefer React Router
  features/
    auth/
    products/
    orders/
    banners/
  layouts/
    CeoLayout.tsx
    CashierLayout.tsx
  shared/ui/
  lib/api/
```

- Cashier layout is order-first (large type, few nav items).
- CEO layout has catalog + orders + banners.

**Acceptance criteria**
- Locale segment exists even if translations are placeholders
- Dashboard router has `/login`, `/` redirect stub
- Fetch base URL from env `VITE_API_URL` / `NEXT_PUBLIC_API_URL`
