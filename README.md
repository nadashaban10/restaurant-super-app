# Kababgy Shaaban

Single restaurant ordering app (monorepo).

## Apps

- `apps/consumer` — Next.js public storefront (static seed for now)
- `apps/api` — Express + MongoDB API (categories + products CRUD)
- `apps/dashboard` — later

## Run Mongo (local Windows)

MongoDB Community should be installed as a Windows service:

```powershell
Get-Service MongoDB
```

Status should be **Running**. Connection string:

```text
mongodb://127.0.0.1:27017/restaurant-super-app
```

## Run the API

```bash
cd apps/api
copy .env.example .env
npm install
npm run seed
npm run dev
```

- Health: http://localhost:3001/health
- Details: `apps/api/README.md`

## Run the consumer

```bash
cd apps/consumer
npm run dev
```

Open http://localhost:3000 (or the port shown). Consumer still reads seed JSON until we wire it to the API.
