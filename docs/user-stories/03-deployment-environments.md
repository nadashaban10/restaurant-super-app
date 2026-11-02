# Epic 03 — Environments and deployment from day one

**Phase:** 1 (empty apps deployed), then every later phase deploys to **test** before you call it done.

## Why not “deploy at the end”

If you wait two months, you discover too late that env vars, images, cookies, and CORS break in the cloud. We deploy a **skeleton** first, then keep shipping to test.

## Environments

| Name | Purpose | Data | Who uses it |
|---|---|---|---|
| **Local** | Daily coding | Docker Mongo, fake products via Postman later | Nada |
| **Test / staging** | Looks like production | Separate MongoDB Atlas DB | Nada + restaurant people for UAT later |
| **Production** | Real customers | Real Atlas DB | Public + staff |

Same code. Different env vars. Never mix databases.

## Suggested hosting (simple, freelance-sized)

You can change this later. Recommendation to start:

- **MongoDB Atlas** free/shared cluster — two databases: `restaurant_test` and `restaurant_prod`
- **API + dashboard + consumer** on **Render** or **Railway** (three web services)  
  Alternative: one VPS (Hetzner/DigitalOcean) + Docker when you are more comfortable
- **Images:** local disk on the API server for v1 (with backup note). Later Cloudflare R2 or S3.

Do not start with Kubernetes.

### RSA-010 — Staging skeleton live

**Story:** As the developer, I can open three public test URLs that show the empty apps and `/health`, so CORS and env are proven.

**In scope**
- Create accounts (Atlas + Render/Railway) — Nada does this; Cursor writes deploy files
- `Dockerfile` per app **or** native Node build on the host
- Staging env vars set
- CORS allows staging consumer + staging dashboard origins
- Cookies: `secure` in staging/prod, `lax` or `none` only if you truly need cross-site (prefer same-site if you reverse-proxy under one domain later)

**Out of scope**
- Custom domain (can be phase 10)
- CI/CD perfection
- Production launch

**Acceptance criteria**
- Staging API `/health` is green
- Staging consumer loads over HTTPS
- Staging dashboard loads over HTTPS
- Local still works

**Cursor brief**
- Add `Dockerfile` for each app
- Document deploy in `docs/po` is Excel; put runbook in root README section “Deploy”
- GitHub Action optional: lint on pull request (nice, not blocker)

**Read**
- 12-factor (especially Config, Dev/prod parity)
- Atlas getting started
- Your host’s Node deploy docs  
  Excel `09-DeployDay1`

---

### RSA-011 — Local / test / prod checklist (habit)

**Story:** As the developer, I treat “works on my machine” as not enough.

**Habit for every feature after Phase 1**
1. Build locally
2. Hit API with Postman
3. Click through consumer and/or dashboard
4. Deploy to **test**
5. Repeat the click-through on test
6. Only then merge mentally as “done”

Production is a later gate when the restaurant is ready.

**Acceptance criteria**
- README lists this loop in 5 lines

---

### RSA-012 — Backups and logs (minimum)

**Story:** As the restaurant owner, if the server dies I do not lose the only copy of orders.

**v1 minimum**
- Atlas automatic backups on (even free tier snapshots if available; paid if needed before real launch)
- Do not store the only images on a laptop
- Log errors on the host (stdout is enough for Render/Railway)

**Out of scope:** fancy APM, Datadog

**Read:** Atlas backup docs (link in Excel)

---

## Domain plan (later, not blocker)

Ideal later:

- `www.restaurant.com` → consumer
- `admin.restaurant.com` → dashboard
- `api.restaurant.com` → API

For staging: `*.onrender.com` URLs are fine.
