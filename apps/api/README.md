# API — Kababgy Shaaban

Express + TypeScript + MongoDB. Port **3001**.

## Prerequisites

- Node 20+
- Local MongoDB running (`Get-Service MongoDB` → Running)

## Setup

```bash
cd apps/api
copy .env.example .env
npm install
```

`.env` default:

```text
MONGO_URI=mongodb://127.0.0.1:27017/restaurant-super-app
PORT=3001
```

## Run

```bash
npm run seed
npm run dev
```

- Health: http://localhost:3001/health
- Categories: http://localhost:3001/api/v1/categories
- Products: http://localhost:3001/api/v1/products

`npm run seed` **replaces** categories and products with `docs/data/menu-seed.json`.

## Routes (no auth yet)

### Categories
- `GET /api/v1/categories`
- `GET /api/v1/categories/:id`
- `POST /api/v1/categories`
- `PATCH /api/v1/categories/:id`
- `DELETE /api/v1/categories/:id` (blocked if category still has products)

### Products
- `GET /api/v1/products` — query: `status`, `categoryId`, `featuredOnHome`, `ids`, `includeDeleted`
- `GET /api/v1/products/:id`
- `GET /api/v1/products/slug/:slug`
- `POST /api/v1/products`
- `PATCH /api/v1/products/:id`
- `DELETE /api/v1/products/:id` (soft delete → `status: deleted`)

Money stays in **integer piastres** on variants (`priceAmount`). No cart endpoints in this phase.
