# Epic 06 — Admin authentication (exactly two users)

**Phase:** 3  
**App:** API + dashboard only  
**Consumer:** no login in v1

## Product rules

There is **no admin registration**. There are **exactly two seeded users**:

| Username (example) | Role | Who |
|---|---|---|
| ceo | `ceo` | Project CEO — full catalog, banners, discounts, orders |
| cashier | `cashier` | The one person at the cashier who receives orders |

Passwords set via env on first boot (`CEO_PASSWORD`, `CASHIER_PASSWORD`) then hashed in Mongo. After first seed, change via a later “change password” story (CEO only) or by re-seed in local only.

**Do not** build a user-management CRUD in v1.

### RSA-020 — Seed two admin users

**Story:** As the developer, when the API starts against an empty DB, CEO and cashier exist with hashed passwords.

**Acceptance criteria**
- Passwords stored with **argon2id** or **bcrypt** (cost ≥ 12). Never plaintext.
- Role stored on the user document: `ceo` | `cashier`
- Re-starting the server does not duplicate users
- Seed only if missing

---

### RSA-021 — Admin login / logout API

**Story:** As CEO or cashier, I log in with username + password and stay logged in until I log out or the session expires.

**Recommended approach (simple and common, and safer than localStorage JWT)**
- `POST /auth/login` → sets **httpOnly**, `secure` (prod), `sameSite=lax` cookie with a JWT or session id
- `POST /auth/logout` → clears cookie
- `GET /auth/me` → `{ id, username, role }`
- JWT expiry e.g. 12 hours (cashier shift). Configurable.

**Why not localStorage JWT?** XSS can steal it. httpOnly cookie is the common safer default.

**Authorization**
- `requireAuth` on all `/admin/*` or `/api/v1/...` except login and public catalog
- `requireRole('ceo')` for product write, banners, unpublish, delete
- cashier: orders read + status update only

**Security**
- Rate limit login (e.g. 10 / 15 min / IP)
- Generic error: “Invalid credentials” (do not say which field)
- Timing: still OK to use bcrypt.compare
- No user enumeration via `/auth/me` when logged out (401)

**Validation**
- username string, password min length 8

**Out of scope:** refresh tokens, 2FA, OAuth, “forgot password” (CEO can reset via server env/DB for v1)

---

### RSA-022 — Dashboard login screen

**Persona:** Cashier on a tablet

**UX**
- Centered card: logo, username, password, submit
- EN/AR switcher on this screen too
- Large inputs, show/hide password
- Error under the form, not alert()
- After login: cashier → **Orders inbox**. CEO → **Products** (or a simple home with two tiles: Catalog / Orders)

**States:** loading button, disabled double-submit, 401 error, network error

**Acceptance criteria**
- Unauthenticated visit to `/orders` redirects to `/login`
- Cashier must not open `/products` even by URL (API 403 + UI redirect)
- Logout in header

---

### RSA-023 — Role matrix (implement as middleware + route guards)

| Action | Public | Cashier | CEO |
|---|---|---|---|
| Browse published catalog | yes | yes | yes |
| Login admin | — | yes | yes |
| Create/edit product | no | no | yes |
| Publish / unpublish | no | no | yes |
| Permanently delete product | no | no | yes |
| Upload images | no | no | yes |
| Banners | no | no | yes |
| Set item discount | no | no | yes |
| See orders | no | yes | yes |
| Change order status | no | yes | yes |

**Cursor brief**
- Dashboard: `ProtectedRoute` + `RoleRoute`
- Never hide a button and leave the API open
