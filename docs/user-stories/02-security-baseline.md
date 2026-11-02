# Epic 02 — Security from day one

**Phase:** 1 (baseline), then every later story adds its own checks  
**Why this exists:** You own the backend. The browser is not trusted. A customer can edit HTML and send a fake price. Staff must not see CEO screens.

You do **not** need to master this before Phase 1. You need a **baseline** in the API, then grow it.

## Baseline (must exist before product APIs)

### RSA-004 — API security baseline

**Persona:** Developer / future attacker we want to fail

**Story:** As the restaurant owner, I need the API to reject obvious abuse even while the app is still a skeleton.

**In scope for Phase 1**
- Helmet
- CORS allowlist from env (`CORS_ORIGINS`)
- JSON body size limit (e.g. 1mb; uploads use a separate route)
- Rate limit on `/auth/*` (stricter) and a global lighter limit
- Zod validation helper ready
- Central error handler (no stack to client in `NODE_ENV=production`)
- Request id / basic request log (method, path, status, duration) — no passwords in logs
- `trust proxy` only when behind a real proxy (staging/prod)

**Out of scope for Phase 1**
- Full OWASP audit
- WAF, captcha, 2FA
- File upload (comes with media epic)

**Acceptance criteria**
- Unknown origin is blocked by CORS in non-local env
- Invalid JSON or oversize body does not crash the process
- `/health` is public; everything else later defaults to **deny** unless a route is marked public
- Env validation on boot

**Cursor brief**
- Use `helmet`, `cors`, `express-rate-limit`, `zod`, `hpp` optional
- Never `app.use(cors())` with defaults in production
- Create `requireAuth` and `requireRole('ceo'|'cashier')` middleware **empty-but-ready** or implemented with JWT in auth epic — prefer implement together with RSA-020 so we do not have fake security

**Read**
- OWASP Top 10 (overview only)
- OWASP Node.js cheat sheet
- Express security best practices  
  Links in Excel sheet `08-SecurityDay1`

---

### RSA-005 — Secrets and config

**Story:** As the developer, I never commit secrets and each environment has its own config.

**Acceptance criteria**
- `.env` gitignored
- `.env.example` documents: `NODE_ENV`, `PORT`, `MONGO_URI`, `JWT_SECRET`, `COOKIE_SECRET`, `CORS_ORIGINS`, `CLIENT_URL`, `DASHBOARD_URL`, `UPLOAD_DIR`
- README says: copy example, fill local values
- Staging/production secrets live in the host dashboard (Render/Railway/etc.), not in git

**Read:** [https://12factor.net/config](https://12factor.net/config)

---

### RSA-006 — Trusted money (rule for ALL later stories)

**Story:** As the restaurant, I never accept a total or a product price from the client.

**Rule (non-negotiable)**
- Client may send: product id, quantity, selected extras ids, locale
- Client must **not** send: unit price, discount, line total, cart total, tax
- On `quote` and on `create order`, server loads products from DB, applies item discounts, computes totals
- If client sends a price field, ignore it or reject the request (prefer reject `400`)

**Acceptance criteria**
- This rule is written in `apps/api/src/modules/pricing/README.md` or a short comment in the pricing service when that module is created
- Consumer UI displays `quoted.total` only

---

## Later security (do not implement in Phase 1, but plan for)

| Topic | When | Story |
|---|---|---|
| Password hashing (bcrypt/argon2) | Admin auth | RSA-021 |
| JWT in httpOnly cookie | Admin auth | RSA-021 |
| Admin route protection UI | Dashboard | RSA-023 |
| File upload checks | Media | RSA-040 |
| Prevent viewing someone else's order | Orders | RSA-072 |
| Input sanitization beyond Zod | ongoing | — |

## Mental model (read this)

1. **Authentication** — who are you? (login)
2. **Authorization** — what may you do? (CEO vs cashier vs public)
3. **Validation** — is this payload legal?
4. **Trust boundary** — browser is hostile; database is source of prices

If you only remember one sentence: **the API decides; the UI displays.**
