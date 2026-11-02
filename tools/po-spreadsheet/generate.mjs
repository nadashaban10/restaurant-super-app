import ExcelJS from "exceljs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outFile = path.resolve(
  __dirname,
  "../../docs/po/Kababgy-Shaaban-Project-Plan.xlsx"
);

const COLORS = {
  headerBg: "1B4332",
  headerFg: "FFFFFF",
  phase0: "D8F3DC",
  phase1: "B7E4C7",
  phase2: "95D5B2",
  later: "FFF3BF",
  locked: "D8F3DC",
  open: "FFE8D6",
  warn: "F8D7DA",
  info: "E7F5FF",
  zebra: "F8F9FA",
  title: "081C15",
};

const thin = {
  style: "thin",
  color: { argb: "FFCED4DA" },
};

function styleHeader(row) {
  row.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: COLORS.headerBg },
    };
    cell.font = { bold: true, color: { argb: COLORS.headerFg }, name: "Calibri", size: 11 };
    cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
    cell.border = { top: thin, left: thin, bottom: thin, right: thin };
  });
  row.height = 28;
}

function paintRow(row, argb) {
  row.eachCell({ includeEmpty: true }, (cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb } };
  });
}

function applyTable(sheet, headers, rows, widths, { freeze = 1, filter = true } = {}) {
  sheet.columns = headers.map((h, i) => ({
    header: h,
    key: `c${i}`,
    width: widths[i] || 20,
  }));
  styleHeader(sheet.getRow(1));
  rows.forEach((r, idx) => {
    const values = Array.isArray(r) ? r : r.values;
    const row = sheet.addRow(values);
    row.alignment = { wrapText: true, vertical: "top" };
    row.font = { name: "Calibri", size: 11 };
    row.eachCell((cell) => {
      cell.border = { top: thin, left: thin, bottom: thin, right: thin };
    });
    if (r.fill) paintRow(row, r.fill);
    else if (idx % 2 === 1) paintRow(row, COLORS.zebra);
    if (r.height) row.height = r.height;
    else row.height = Math.min(90, 18 + 14 * Math.ceil((values.join(" ").length || 1) / 80));
  });
  if (filter) sheet.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: headers.length },
  };
  sheet.views = [{ state: "frozen", ySplit: freeze, xSplit: 0 }];
  sheet.eachRow((row) => {
    row.eachCell((cell) => {
      if (typeof cell.value === "string" && cell.value.startsWith("http")) {
        cell.value = { text: cell.value, hyperlink: cell.value };
        cell.font = { color: { argb: "FF0B6E4F" }, underline: true, name: "Calibri" };
      }
    });
  });
}

function addTitleSheet(wb, name, title, intro, headers, rows, widths) {
  const s = wb.addWorksheet(name, { views: [{ showGridLines: true }] });
  s.mergeCells(1, 1, 1, headers.length);
  s.getCell(1, 1).value = title;
  s.getCell(1, 1).font = { name: "Calibri", size: 18, bold: true, color: { argb: COLORS.title } };
  s.getCell(1, 1).alignment = { vertical: "middle" };
  s.getRow(1).height = 28;
  s.mergeCells(2, 1, 2, headers.length);
  s.getCell(2, 1).value = intro;
  s.getCell(2, 1).alignment = { wrapText: true, vertical: "top" };
  s.getCell(2, 1).font = { name: "Calibri", size: 11, italic: true };
  s.getRow(2).height = 48;
  // fake header row at 4 by writing manually
  const tableStart = 4;
  headers.forEach((h, i) => {
    const cell = s.getCell(tableStart, i + 1);
    cell.value = h;
  });
  styleHeader(s.getRow(tableStart));
  rows.forEach((r, idx) => {
    const values = Array.isArray(r) ? r : r.values;
    values.forEach((v, i) => {
      s.getCell(tableStart + 1 + idx, i + 1).value = v;
    });
    const row = s.getRow(tableStart + 1 + idx);
    row.alignment = { wrapText: true, vertical: "top" };
    row.font = { name: "Calibri", size: 11 };
    row.eachCell((cell) => {
      cell.border = { top: thin, left: thin, bottom: thin, right: thin };
    });
    if (r.fill) paintRow(row, r.fill);
    else if (idx % 2 === 1) paintRow(row, COLORS.zebra);
    row.height = r.height || Math.min(96, 20 + 12 * Math.ceil((values.join(" ").length || 1) / 90));
  });
  headers.forEach((_, i) => {
    s.getColumn(i + 1).width = widths[i] || 22;
  });
  s.autoFilter = {
    from: { row: tableStart, column: 1 },
    to: { row: tableStart, column: headers.length },
  };
  s.views = [{ state: "frozen", ySplit: tableStart, xSplit: 0 }];
  s.eachRow((row, n) => {
    if (n <= tableStart) return;
    row.eachCell((cell) => {
      if (typeof cell.value === "string" && cell.value.startsWith("http")) {
        cell.value = { text: cell.value, hyperlink: cell.value };
        cell.font = { color: { argb: "FF0B6E4F" }, underline: true, name: "Calibri" };
      }
    });
  });
  return s;
}

const wb = new ExcelJS.Workbook();
wb.creator = "PO — Restaurant Super App";
wb.created = new Date();
wb.modified = new Date();

// ---------- 00 How to use ----------
{
  const s = wb.addWorksheet("00-HowToUse");
  s.getColumn(1).width = 28;
  s.getColumn(2).width = 110;
  const lines = [
    ["Workbook", "Kababgy Shaaban (كبابجي شعبان) — consumer + dashboard + API"],
    ["Your role", "Reviewer / owner. Approve before any application code."],
    ["PO role", "This pack. Stories live in docs/user-stories. Excel is the timeline + learning map."],
    ["Cursor role", "Implementer after you approve a phase. Feed it the story file + this checklist."],
    ["", ""],
    ["How to follow the plan", "Use sheet 04-StepChecklist in order. Do not skip Phase 1 (setup, security baseline, staging skeleton)."],
    ["User stories", "docs/user-stories/*.md — detailed UX, APIs, folders, acceptance criteria."],
    ["Review order", "1) Locked decisions  2) Open questions  3) Phase 1 stories  4) Rest of stories  5) Then code Phase 1 only"],
    ["", ""],
    ["v1 loop (definition of useful)", "Guest browses published menu → cart → checkout pickup/pay at restaurant → cashier sees order → marks ready."],
    ["Not in v1", "Promo codes, consumer login, online payment, kitchen hardware, multi-branch, more than 2 admin users."],
    ["", ""],
    ["About points 8 / 17 / 18", "Your notes: (8) deploy from day one  (17) security from day one. Sheet 08 and 09 + Learning Path cover both, plus testing/backups which usually sit next to them."],
    ["Reading", "You do not master security/deploy before starting. Follow 07-LearningPath week by week while Phase 1 is built."],
  ];
  s.getRow(1).height = 24;
  s.getCell(1, 1).value = "Restaurant project — how to use this file";
  s.mergeCells(1, 1, 1, 2);
  s.getCell(1, 1).font = { size: 18, bold: true, color: { argb: COLORS.title }, name: "Calibri" };
  lines.forEach((pair, i) => {
    const row = s.getRow(i + 3);
    row.getCell(1).value = pair[0];
    row.getCell(2).value = pair[1];
    row.getCell(1).font = { bold: true, name: "Calibri" };
    row.alignment = { wrapText: true, vertical: "top" };
    row.height = 32;
    if (pair[0]) {
      row.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: COLORS.phase1 } };
    }
  });
}

// ---------- 01 Locked decisions ----------
addTitleSheet(
  wb,
  "01-LockedDecisions",
  "Locked product decisions (change only if you explicitly reverse them)",
  "If a story and this sheet disagree, this sheet wins until you update it.",
  ["ID", "Topic", "Decision", "Why it matters"],
  [
    { values: ["D01", "Business model", "ONE restaurant / one tenant. Not a marketplace (not Talabat).", "Stops multi-vendor architecture and years of extra work."] },
    { values: ["D02", "Apps", "Three folders: apps/consumer (Next.js), apps/dashboard (React+Vite), apps/api (Node+Express+TS).", "Matches how you want to work; still one git repo."] },
    { values: ["D03", "Languages", "Arabic PRIMARY + English. defaultLocale=ar. RTL first. Device EN may land on /en. Switcher always available.", "SEO + neighborhood audience. Brand: Egyptian Arabic copy."] },
    { values: ["D04", "Consumer auth v1", "Guest browse, guest cart, guest checkout (name + phone). No customer accounts in v1.", "Faster launch. Accounts later without blocking orders."] },
    { values: ["D05", "Admin auth", "Exactly two seeded users: ceo (full) and cashier (orders only). No public admin signup.", "Matches real shop: owner + one till."] },
    { values: ["D06", "Discounts", "Item-level only (percent or fixed amount). NO promo codes in v1.", "Simpler rules; banners are decoration, not pricing."] },
    { values: ["D07", "Money", "All calculations on the API. Client never sends prices/totals. Store money as integers (piastres).", "Stops price tampering; avoids float bugs."] },
    { values: ["D08", "Products", "States: unpublished | published | deleted (soft delete, hidden forever in v1 UI).", "Drafts vs live vs gone are different operations."] },
    { values: ["D09", "Images", "Resize on upload with Sharp (thumb/card/detail WebP). Consumer uses next/image on small variants.", "Phone photos must not kill 4G performance."] },
    { values: ["D10", "Content owner", "CEO uploads products/images in admin. You may seed via Postman after APIs exist.", "You are not the full-time catalog editor."] },
    { values: ["D11", "Payment v1", "Pay at restaurant. No gateway until a later workshop.", "Avoids PCI/gateway scope before the loop works."] },
    { values: ["D12", "Kitchen v1", "Cashier dashboard inbox (poll + optional sound). No printer/WhatsApp/POS yet.", "A person is the integration."] },
    { values: ["D13", "Wishlist v1", "localStorage on the device (no login).", "Still useful without accounts."] },
    { values: ["D14", "Responsive", "Mobile first, also tablet (cashier) and desktop (CEO).", "Most orders are phones."] },
    { values: ["D15", "Environments", "Local + Test/staging + Production. Deploy skeleton in Phase 1.", "CORS, cookies, env break if you wait."] },
    { values: ["D16", "Security", "Baseline in Phase 1 (helmet, CORS, rate limit, env, hashed passwords when auth lands).", "You own the backend."] },
    { values: ["D17", "Fulfillment", "Still a workshop. Brand expects local delivery + 24/7. Do not hardcode pickup-only copy. Optional free-text address.", "Identity file talks about delivery; zones not designed yet."] },
    { values: ["D18", "Currency", "EGP. Store piastres (integer, x100). Menu prices are whole pounds.", "Confirmed from extracted menu."] },
    { values: ["D19", "Restaurant", "Kababgy Shaaban / كبابجي شعبان. One branch: El Sawah, El Amerya, Cairo. Always open 24/7.", "docs/brand/restaurant-identity.json"] },
    { values: ["D20", "Variants", "Price is on VARIANT (kg / half / quarter / whole chicken). Cards show DEFAULT variant only. Detail shows all. Cart = productId+variantId.", "docs/user-stories/18-variants.md + docs/data/menu-seed.json"] },
    { values: ["D21", "SEO", "Next.js metadata + JSON-LD Restaurant/Menu/MenuItem. Arabic canonical. No invented phone or founding year.", "docs/user-stories/19-seo-nextjs.md"] },
    { values: ["D22", "Visual", "Official logo red #D31A1A + black #111111 + white. Light header. Cairo font. No orange ember theme.", "RSA-032 + logo.jpg"] },
  ],
  [8, 22, 78, 48]
);

// ---------- 02 Architecture ----------
addTitleSheet(
  wb,
  "02-Architecture",
  "Architecture & folder setup (Phase 1 target)",
  "Boring on purpose. One repo, three apps, one MongoDB, three environments.",
  ["Area", "Choice", "Notes / where"],
  [
    { values: ["Repo", "Monorepo (one git)", "restaurant-super-app/apps/{consumer,dashboard,api}"] },
    { values: ["Consumer", "Next.js App Router + TS + next-intl", "app/[locale]/…  Server Components default"] },
    { values: ["Dashboard", "Vite + React + TS + React Router", "features/auth, products, orders, banners"] },
    { values: ["API", "Node + Express + TypeScript + Mongoose", "modules/<name>/{model,schema,service,controller,routes}"] },
    { values: ["DB", "MongoDB", "Local Docker; Atlas for test + prod (separate DBs)"] },
    { values: ["Auth admin", "httpOnly cookie + JWT or session", "bcrypt/argon2 passwords; roles ceo|cashier"] },
    { values: ["Auth consumer", "None in v1", "Orders store guest name/phone; optional userId later"] },
    { values: ["Files", "Disk uploads v1 + Sharp", "Later R2/S3 if needed"] },
    { values: ["Local ports", "consumer 3000 / api 3001 / dashboard 3002", "CORS allow those origins locally"] },
    { values: ["Public API", "/api/v1/products, banners, cart/quote, orders POST", "No money fields from client"] },
    { values: ["Admin API", "/api/v1/admin/*", "Cookie + role middleware"] },
    { values: ["Pricing brain", "apps/api/src/modules/pricing", "Used by product GET, quote, create order"] },
    { values: ["i18n", "messages/en.json + ar.json; product fields bilingual", "UI language ≠ catalog translations"] },
    { values: ["Deploy", "3 web services + Atlas", "Render or Railway recommended; Dockerfiles in each app"] },
    { values: ["Postman", "docs/postman after write APIs", "You inject products before CEO UI is done"] },
  ],
  [22, 48, 78]
);

// ---------- 03 Phase roadmap ----------
addTitleSheet(
  wb,
  "03-PhaseRoadmap",
  "Phases (arranged). Finish a phase on TEST env before calling it done.",
  "Code starts only after you review stories. Phase 1 includes empty deploy + security baseline.",
  ["Phase", "Name", "Goal", "Main stories", "You learn / read", "Exit criteria"],
  [
    { fill: COLORS.phase0, values: ["0", "Review & knowledge", "You understand the plan and answer open questions that block v1.", "All story files (read); Excel 12-OpenQuestions", "Learning Path week 0 (what is an API, 12-factor overview)", "Decisions confirmed. Open questions updated. Phase 1 approved."] },
    { fill: COLORS.phase1, values: ["1", "Repo, security, environments", "Three empty apps run locally AND on staging. Mongo local + Atlas test.", "RSA-001..006, RSA-010..012", "Sheet 08 + 09 + 12-factor config + Docker 101", "Health URL live. .env.example exists. CORS works on staging."] },
    { fill: COLORS.phase2, values: ["2", "i18n + design shells", "EN/AR switch, RTL, header/footer, tokens, responsive shells.", "RSA-030..035, RSA-100", "next-intl, CSS logical properties", "Consumer + dashboard switch language; mobile header works."] },
    { values: ["3", "Admin auth (2 users)", "CEO and cashier can log in with cookie session and correct roles.", "RSA-020..023", "OWASP auth + password storage cheat sheets", "Cashier cannot hit product APIs (403)."] },
    { values: ["4", "Catalog API + images", "CRUD products, publish/unpublish/delete, Sharp uploads. Postman seed.", "RSA-040,041,043,044,046", "Sharp docs, file upload cheat sheet", "You can create a published product in Postman with a small WebP."] },
    { values: ["5", "Consumer browse", "Home, hero, banners, menu, product detail. Only published.", "RSA-042,050..052", "Next.js Image, web.dev images", "Phone can browse a seeded menu fast."] },
    { values: ["6", "Discounts + cart + quote", "Item discounts; cart UI; server quote is the only total.", "RSA-061..065", "Integer money; never trust client", "Tampered total cannot change quote. Discount shows struck price."] },
    { values: ["7", "Wishlist", "Heart items, local list, fresh prices from API.", "RSA-060", "localStorage limits", "Wishlist survives refresh; unpublished items disappear."] },
    { values: ["8", "Checkout thin + cashier inbox", "Guest pickup order; pay at restaurant; cashier sees and updates status.", "RSA-070..073, RSA-090..092", "Rate limit public POST; order snapshots", "Full loop works on TEST with fake food."] },
    { values: ["9", "CEO dashboard UI", "CEO manages products, images, discounts, banners without Postman.", "RSA-080..082", "Dashboard UX / forms", "You no longer need Postman for daily catalog."] },
    { fill: COLORS.later, values: ["10", "Harden + production", "UAT with restaurant, backups, domain, real photos, launch.", "RSA-012 leftover, RSA-103", "Atlas backups, host logs", "Production URLs, real menu, cashier trained."] },
    { fill: COLORS.later, values: ["Later", "Workshop topics", "Payments, delivery, kitchen notify, consumer accounts, promo if ever.", "RSA-025, RSA-073", "Payment provider docs when chosen", "Written decision before any code."] },
  ],
  [10, 28, 42, 28, 36, 40]
);

// ---------- 04 Step checklist ----------
addTitleSheet(
  wb,
  "04-StepChecklist",
  "Follow these steps in order (your working plan)",
  "Status column is for you: Not started / In review / Ready / Doing / Done on test. Do not start a step until the previous phase exit criteria are met.",
  ["Step", "Phase", "Action", "App", "Story IDs", "Learning if the step is new", "Status"],
  [
    { fill: COLORS.phase0, values: ["0.1", "0", "Read 00-HowToUse + 01-LockedDecisions. Mark anything you disagree with.", "docs", "—", "—", "Not started"] },
    { fill: COLORS.phase0, values: ["0.2", "0", "Answer remaining OpenQuestions (phone, photos, Q1 fulfillment, shish tawook price).", "docs", "D17, Q11–Q13", "—", "Not started"] },
    { fill: COLORS.phase0, values: ["0.3", "0", "Skim Learning Path week 0–1 (API + 12-factor + OWASP Top 10 overview only).", "you", "—", "Sheet 07 rows W0–W1", "Not started"] },
    { fill: COLORS.phase0, values: ["0.4", "0", "Review user stories 01–03 (architecture, security, deploy). Approve Phase 1.", "docs/user-stories", "RSA-001..012", "—", "Not started"] },
    { fill: COLORS.phase1, values: ["1.1", "1", "Create apps/consumer, apps/dashboard, apps/api TypeScript scaffolds.", "all", "RSA-001", "Node/npm workspaces optional", "Not started"] },
    { fill: COLORS.phase1, values: ["1.2", "1", "Docker Compose Mongo + env validation (Zod) + .env.example + gitignore.", "api, infra", "RSA-002, RSA-005", "https://12factor.net/config", "Not started"] },
    { fill: COLORS.phase1, values: ["1.3", "1", "Health module + global error handler + folder pattern for modules.", "api", "RSA-002", "Express routing", "Not started"] },
    { fill: COLORS.phase1, values: ["1.4", "1", "Helmet, CORS allowlist, rate-limit stub, body size limit.", "api", "RSA-004", "Sheet 08-SecurityDay1", "Not started"] },
    { fill: COLORS.phase1, values: ["1.5", "1", "Consumer + dashboard placeholders using API base URL from env.", "consumer, dashboard", "RSA-003", "—", "Not started"] },
    { fill: COLORS.phase1, values: ["1.6", "1", "Root README: run local (3 apps + mongo).", "repo", "RSA-001", "—", "Not started"] },
    { fill: COLORS.phase1, values: ["1.7", "1", "Create Atlas TEST cluster + staging host accounts. Deploy empty apps.", "deploy", "RSA-010", "Sheet 09-DeployDay1", "Not started"] },
    { fill: COLORS.phase1, values: ["1.8", "1", "Prove staging /health and CORS. Enable Atlas backups mindset.", "deploy", "RSA-011, RSA-012", "Dev/prod parity", "Not started"] },
    { values: ["2.1", "2", "Design tokens + Arabic-capable fonts.", "both UIs", "RSA-032", "—", "Not started"] },
    { values: ["2.2", "2", "next-intl, device language default, switcher, persist, dir=rtl.", "consumer, dashboard", "RSA-030, RSA-031", "https://next-intl.dev/", "Not started"] },
    { values: ["2.3", "2", "Consumer header + footer + responsive shells.", "consumer", "RSA-033..035", "CSS logical properties", "Not started"] },
    { values: ["3.1", "3", "User model, seed ceo + cashier, hashed passwords.", "api", "RSA-020", "Password storage cheat sheet", "Not started"] },
    { values: ["3.2", "3", "Login/logout/me cookie auth + requireRole.", "api", "RSA-021, RSA-023", "Auth cheat sheet, cookies vs localStorage", "Not started"] },
    { values: ["3.3", "3", "Dashboard login UI + route guards (cashier cannot open products).", "dashboard", "RSA-022", "—", "Not started"] },
    { values: ["4.1", "4", "Product model + public GET + admin writes + publish/unpublish/delete.", "api", "RSA-040, RSA-041", "—", "Not started"] },
    { values: ["4.2", "4", "Sharp upload pipeline + upload security.", "api", "RSA-044, RSA-046", "Sheet 10-ImageStrategy", "Not started"] },
    { values: ["4.3", "4", "Import docs/data/menu-seed.json (variants + defaultVariantId). Postman.", "api, docs", "RSA-043, RSA-110", "menu-seed.json", "Not started"] },
    { values: ["5.1", "5", "Home / hero / banners public API + UI.", "consumer, api", "RSA-050..052", "web.dev/learn/images", "Not started"] },
    { values: ["5.2", "5", "Menu + product detail; next/image; ALL variants on detail, default on cards.", "consumer", "RSA-042, RSA-045, RSA-112, RSA-113", "18-variants.md", "Not started"] },
    { values: ["5.3", "5", "SEO: generateMetadata, sitemap, robots, Restaurant JSON-LD.", "consumer", "RSA-120..122", "19-seo-nextjs.md", "Not started"] },
    { values: ["6.1", "6", "pricing.service (integer math, item discount).", "api", "RSA-061, RSA-064, RSA-065", "—", "Not started"] },
    { values: ["6.2", "6", "POST /cart/quote + cart page (localStorage ids, server money).", "api, consumer", "RSA-062, RSA-063", "—", "Not started"] },
    { values: ["7.1", "7", "Wishlist hearts + page, refresh prices from API.", "consumer", "RSA-060", "—", "Not started"] },
    { values: ["8.1", "8", "Create order API (snapshot, rate limit, admin-only GET).", "api", "RSA-070, RSA-072", "REST security cheat sheet", "Not started"] },
    { values: ["8.2", "8", "Checkout + confirmation (order code).", "consumer", "RSA-071", "—", "Not started"] },
    { values: ["8.3", "8", "Cashier inbox poll + status buttons + optional sound.", "dashboard, api", "RSA-090..092", "—", "Not started"] },
    { values: ["9.1", "9", "CEO product form (EN/AR, images, discount, publish, delete).", "dashboard", "RSA-080", "—", "Not started"] },
    { values: ["9.2", "9", "CEO banners + CEO orders table.", "dashboard", "RSA-081, RSA-082", "—", "Not started"] },
    { fill: COLORS.later, values: ["10.1", "10", "UAT on test with real-ish photos. Fix. Then production env + domain.", "all", "Phase 10", "Atlas backups", "Not started"] },
    { fill: COLORS.later, values: ["L.1", "Later", "Workshop: payments, delivery, kitchen notify, consumer accounts.", "docs", "RSA-025, RSA-073", "Choose provider only after workshop", "Not started"] },
  ],
  [10, 10, 72, 22, 22, 36, 16]
);

// ---------- 05 Modules ----------
addTitleSheet(
  wb,
  "05-Modules",
  "Modules vs apps vs v1",
  "Each module maps to a user-story file Cursor can implement.",
  ["Module", "Consumer", "Dashboard", "API", "v1?", "Story file"],
  [
    { values: ["Foundation / folders", "scaffold", "scaffold", "scaffold", "Yes — Phase 1", "01-foundation-architecture.md"] },
    { values: ["Security baseline", "https + cookie later", "login guards", "helmet/CORS/validation", "Yes — Phase 1", "02-security-baseline.md"] },
    { values: ["Environments / deploy", "staging URL", "staging URL", "staging URL", "Yes — Phase 1", "03-deployment-environments.md"] },
    { values: ["i18n + RTL", "switcher + pages", "switcher", "bilingual fields", "Yes — Phase 2", "04-i18n-rtl.md"] },
    { values: ["Header / footer / tokens", "yes", "shell only", "settings later", "Yes — Phase 2", "05-design-system-layout.md"] },
    { values: ["Admin auth", "no", "login 2 users", "seed + cookie", "Yes — Phase 3", "06-admin-auth.md"] },
    { values: ["Consumer auth", "guest only", "—", "guest on order", "Guest yes / accounts later", "07-consumer-auth.md"] },
    { values: ["Products", "list/detail", "CEO CRUD", "public+admin", "Yes", "08-products.md"] },
    { values: ["Images", "next/image", "upload", "Sharp", "Yes", "09-media-images.md"] },
    { values: ["Home / hero / banners", "yes", "CEO banners", "banners CRUD", "Yes", "10-home-hero-banners.md"] },
    { values: ["Wishlist", "localStorage", "no", "read products", "Yes (local)", "11-wishlist.md"] },
    { values: ["Variants (portions)", "default on cards; all on detail; cart line", "CEO editor", "price on variant", "Yes — required", "18-variants.md"] },
    { values: ["SEO Next.js", "metadata, sitemap, JSON-LD", "—", "same data as catalog", "Yes from Phase 2/5", "19-seo-nextjs.md"] },
    { values: ["Item discounts", "display", "CEO fields", "pricing service", "Yes (no codes)", "13-discounts.md"] },
    { values: ["Checkout / orders", "guest checkout", "inbox + CEO table", "create + admin", "Thin v1", "14-checkout-orders.md"] },
    { values: ["CEO dashboard", "—", "catalog tool", "admin APIs", "Yes Phase 9", "15-ceo-dashboard.md"] },
    { values: ["Cashier inbox", "—", "orders first", "orders admin", "Yes Phase 8", "16-cashier-orders.md"] },
    { values: ["Online payment", "—", "—", "—", "NOT v1", "14 … RSA-073"] },
    { values: ["Kitchen hardware / WhatsApp", "—", "—", "—", "NOT v1", "14 … RSA-073"] },
  ],
  [28, 22, 22, 22, 24, 36]
);

// ---------- 06 Story index ----------
addTitleSheet(
  wb,
  "06-StoryIndex",
  "Story index (for Cursor + your review)",
  "Status: Draft (written) → You review → Ready for Cursor → Done.",
  ["ID", "Title", "Phase", "File", "Review status"],
  [
    { values: ["RSA-001", "Monorepo empty apps run", "1", "01-foundation-architecture.md", "Draft — awaiting Nada"] },
    { values: ["RSA-002", "API module layering", "1", "01-foundation-architecture.md", "Draft — awaiting Nada"] },
    { values: ["RSA-003", "Consumer & dashboard folders", "1", "01-foundation-architecture.md", "Draft — awaiting Nada"] },
    { values: ["RSA-004", "API security baseline", "1", "02-security-baseline.md", "Draft — awaiting Nada"] },
    { values: ["RSA-005", "Secrets and config", "1", "02-security-baseline.md", "Draft — awaiting Nada"] },
    { values: ["RSA-006", "Trusted money rule", "1+", "02-security-baseline.md", "Draft — awaiting Nada"] },
    { values: ["RSA-010", "Staging skeleton live", "1", "03-deployment-environments.md", "Draft — awaiting Nada"] },
    { values: ["RSA-011", "Local/test/prod habit", "1", "03-deployment-environments.md", "Draft — awaiting Nada"] },
    { values: ["RSA-012", "Backups and logs minimum", "1–10", "03-deployment-environments.md", "Draft — awaiting Nada"] },
    { values: ["RSA-020", "Seed two admin users", "3", "06-admin-auth.md", "Draft — awaiting Nada"] },
    { values: ["RSA-021", "Admin login/logout API", "3", "06-admin-auth.md", "Draft — awaiting Nada"] },
    { values: ["RSA-022", "Dashboard login UI", "3", "06-admin-auth.md", "Draft — awaiting Nada"] },
    { values: ["RSA-023", "Role matrix", "3", "06-admin-auth.md", "Draft — awaiting Nada"] },
    { values: ["RSA-024", "Guest checkout identity", "8", "07-consumer-auth.md", "Draft — awaiting Nada"] },
    { values: ["RSA-025", "Consumer accounts", "Later", "07-consumer-auth.md", "Backlog — do not implement"] },
    { values: ["RSA-030", "Locale detect + switcher", "2", "04-i18n-rtl.md", "Draft — awaiting Nada"] },
    { values: ["RSA-031", "RTL quality", "2", "04-i18n-rtl.md", "Draft — awaiting Nada"] },
    { values: ["RSA-032", "Design tokens", "2", "05-design-system-layout.md", "Draft — awaiting Nada"] },
    { values: ["RSA-033", "Consumer header", "2", "05-design-system-layout.md", "Draft — awaiting Nada"] },
    { values: ["RSA-034", "Consumer footer", "2", "05-design-system-layout.md", "Draft — awaiting Nada"] },
    { values: ["RSA-035", "Responsive", "2", "05-design-system-layout.md", "Draft — awaiting Nada"] },
    { values: ["RSA-040", "Public product APIs", "4", "08-products.md", "Draft — awaiting Nada"] },
    { values: ["RSA-041", "CEO product write APIs", "4", "08-products.md", "Draft — awaiting Nada"] },
    { values: ["RSA-042", "Consumer catalog UI", "5", "08-products.md", "Draft — awaiting Nada"] },
    { values: ["RSA-043", "Postman collection", "4", "08-products.md", "Draft — awaiting Nada"] },
    { values: ["RSA-044", "Image upload Sharp", "4", "09-media-images.md", "Draft — awaiting Nada"] },
    { values: ["RSA-045", "Consumer image usage", "5", "09-media-images.md", "Draft — awaiting Nada"] },
    { values: ["RSA-046", "Image UI failures", "4–9", "09-media-images.md", "Draft — awaiting Nada"] },
    { values: ["RSA-050", "Hero", "5", "10-home-hero-banners.md", "Draft — awaiting Nada"] },
    { values: ["RSA-051", "Banners", "5", "10-home-hero-banners.md", "Draft — awaiting Nada"] },
    { values: ["RSA-052", "Home fetching", "5", "10-home-hero-banners.md", "Draft — awaiting Nada"] },
    { values: ["RSA-060", "Wishlist local", "7", "11-wishlist.md", "Draft — awaiting Nada"] },
    { values: ["RSA-061", "Pricing service", "6", "12-cart-pricing.md", "Draft — awaiting Nada"] },
    { values: ["RSA-062", "Cart UI", "6", "12-cart-pricing.md", "Draft — awaiting Nada"] },
    { values: ["RSA-063", "Anti price manipulation", "6", "12-cart-pricing.md", "Draft — awaiting Nada"] },
    { values: ["RSA-064", "CEO item discount", "6–9", "13-discounts.md", "Draft — awaiting Nada"] },
    { values: ["RSA-065", "Discount display", "5–6", "13-discounts.md", "Draft — awaiting Nada"] },
    { values: ["RSA-070", "Create order API", "8", "14-checkout-orders.md", "Draft — awaiting Nada"] },
    { values: ["RSA-071", "Checkout UI", "8", "14-checkout-orders.md", "Draft — awaiting Nada"] },
    { values: ["RSA-072", "Order access rules", "8", "14-checkout-orders.md", "Draft — awaiting Nada"] },
    { values: ["RSA-073", "Payments/kitchen parking lot", "Later", "14-checkout-orders.md", "Workshop later"] },
    { values: ["RSA-080", "CEO products table/form", "9", "15-ceo-dashboard.md", "Draft — awaiting Nada"] },
    { values: ["RSA-081", "CEO banners admin", "9", "15-ceo-dashboard.md", "Draft — awaiting Nada"] },
    { values: ["RSA-082", "CEO orders view", "9", "15-ceo-dashboard.md", "Draft — awaiting Nada"] },
    { values: ["RSA-090", "Cashier inbox UX", "8", "16-cashier-orders.md", "Draft — awaiting Nada"] },
    { values: ["RSA-091", "Cashier order APIs", "8", "16-cashier-orders.md", "Draft — awaiting Nada"] },
    { values: ["RSA-092", "Dashboard empty/error", "8", "16-cashier-orders.md", "Draft — awaiting Nada"] },
    { values: ["RSA-100", "UI states", "all", "17-cross-cutting.md", "Draft — awaiting Nada"] },
    { values: ["RSA-101", "Performance defaults", "all", "17-cross-cutting.md", "Draft — awaiting Nada"] },
    { values: ["RSA-102", "API conventions", "all", "17-cross-cutting.md", "Draft — awaiting Nada"] },
    { values: ["RSA-103", "A11y baseline", "all", "17-cross-cutting.md", "Draft — awaiting Nada"] },
    { values: ["RSA-104", "Not in v1 list", "all", "17-cross-cutting.md", "Draft — awaiting Nada"] },
    { values: ["RSA-110", "Variant data model", "4", "18-variants.md", "Draft — awaiting Nada"] },
    { values: ["RSA-111", "Public payload default vs all", "4", "18-variants.md", "Draft — awaiting Nada"] },
    { values: ["RSA-112", "Home/menu card default variant", "5", "18-variants.md", "Draft — awaiting Nada"] },
    { values: ["RSA-113", "Detail all variants", "5", "18-variants.md", "Draft — awaiting Nada"] },
    { values: ["RSA-114", "Cart with variantId", "6", "18-variants.md", "Draft — awaiting Nada"] },
    { values: ["RSA-115", "CEO variant editor", "9", "18-variants.md", "Draft — awaiting Nada"] },
    { values: ["RSA-120", "Next.js generateMetadata", "2+5", "19-seo-nextjs.md", "Draft — awaiting Nada"] },
    { values: ["RSA-121", "JSON-LD Restaurant/Menu", "5", "19-seo-nextjs.md", "Draft — awaiting Nada"] },
    { values: ["RSA-122", "sitemap robots semantic HTML", "5", "19-seo-nextjs.md", "Draft — awaiting Nada"] },
    { values: ["RSA-123", "Arabic/English tone", "2", "19-seo-nextjs.md", "Draft — awaiting Nada"] },
    { values: ["RSA-124", "SEO still needs phone/photos", "10", "19-seo-nextjs.md", "Open"] },
  ],
  [12, 36, 12, 36, 28]
);

// ---------- 07 Learning path ----------
addTitleSheet(
  wb,
  "07-LearningPath",
  "Reading path (beginner-friendly, in order). Do not binge-read everything before Phase 1.",
  "Week 0 is vocabulary. Week 1 is security+deploy OVERVIEW (your points 17 and 8). Deeper links sit on sheets 08–10.",
  ["When", "Topic", "Why you need it", "Read this (start here)", "How much"],
  [
    { fill: COLORS.phase0, values: ["Week 0", "What a REST API is", "Consumer/dashboard only talk to Node via HTTP.", "https://developer.mozilla.org/en-US/docs/Glossary/REST", "20 min"] },
    { fill: COLORS.phase0, values: ["Week 0", "JSON + HTTP status codes", "You will debug 400/401/403/404/500 a lot.", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status", "20 min"] },
    { fill: COLORS.phase0, values: ["Week 0", "Frontend vs backend vs DB", "Three apps, one source of truth (API+Mongo).", "https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/First_steps/Client-Server_overview", "20 min"] },
    { fill: COLORS.phase1, values: ["Week 1", "12-factor config (point 8 cousin)", "Local / test / prod = same code, different env vars. Never commit secrets.", "https://12factor.net/config", "15 min"] },
    { fill: COLORS.phase1, values: ["Week 1", "12-factor home (deploy mindset)", "Dev/prod parity, logs as streams, one codebase.", "https://12factor.net/", "skim 30 min"] },
    { fill: COLORS.phase1, values: ["Week 1", "OWASP Top 10 overview (point 17)", "Names the attacks. You do not need to implement all controls yet.", "https://owasp.org/www-project-top-ten/", "40 min overview"] },
    { fill: COLORS.phase1, values: ["Week 1", "Express security basics", "Helmet, cookies, TLS, error handling in Node.", "https://expressjs.com/en/advanced/best-practice-security.html", "30 min"] },
    { fill: COLORS.phase1, values: ["Week 1", "Node security best practices", "Official Node guidance.", "https://nodejs.org/en/learn/getting-started/security-best-practices", "30 min"] },
    { fill: COLORS.phase1, values: ["Week 1", "Docker 101 (local Mongo)", "You run a database without installing Mongo by hand.", "https://docs.docker.com/get-started/", "1 hour hands-on"] },
    { fill: COLORS.phase1, values: ["Week 1", "MongoDB Atlas getting started", "Test + prod databases in the cloud.", "https://www.mongodb.com/docs/atlas/getting-started/", "45 min"] },
    { values: ["Week 2", "Auth vs authorization", "Login ≠ permissions. CEO vs cashier.", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html", "40 min"] },
    { values: ["Week 2", "Password storage", "Why we hash with bcrypt/argon2.", "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", "20 min"] },
    { values: ["Week 2", "Session / cookies", "Why httpOnly cookie not localStorage JWT for admin.", "https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html", "30 min"] },
    { values: ["Week 2", "CORS", "Why staging URLs must be in an allowlist.", "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", "25 min"] },
    { values: ["Phase 2", "next-intl + Arabic default", "EN/AR routing; / is Arabic.", "https://next-intl.dev/", "as needed"] },
    { values: ["Phase 5", "Next.js Metadata + JSON-LD", "Local SEO for Kababgy Shaaban.", "https://nextjs.org/docs/app/building-your-application/optimizing/metadata", "as needed"] },
    { values: ["Phase 5", "Google Restaurant structured data", "JSON-LD types Restaurant, Menu, MenuItem.", "https://developers.google.com/search/docs/appearance/structured-data/restaurant", "30 min"] },
    { values: ["Phase 2", "RTL / logical CSS", "Arabic layout without breaking EN.", "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values", "20 min"] },
    { values: ["Phase 4", "File upload security", "Admin images can be an attack if naive.", "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html", "25 min"] },
    { values: ["Phase 4", "Sharp (image pipeline)", "The common Node tool to resize/compress.", "https://sharp.pixelplumbing.com/", "docs as you implement"] },
    { values: ["Phase 4", "Images on the web", "Why variants, WebP, dimensions, lazy load.", "https://web.dev/learn/images", "1 hour"] },
    { values: ["Phase 5", "Next.js Image", "Consumer rendering of already-small files.", "https://nextjs.org/docs/app/building-your-application/optimizing/images", "as needed"] },
    { values: ["Phase 8", "REST security", "Public order POST still needs limits.", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html", "25 min"] },
    { values: ["Ongoing", "Zod validation", "Input validation instead of trusting req.body.", "https://zod.dev/", "as needed"] },
    { values: ["Ongoing", "Helmet", "HTTP headers baseline.", "https://github.com/helmetjs/helmet", "skim"] },
    { fill: COLORS.later, values: ["Before prod", "Atlas backups", "Orders must not live on one laptop.", "https://www.mongodb.com/docs/atlas/backup/", "20 min"] },
    { fill: COLORS.later, values: ["Before prod", "GitHub Actions intro (optional CI)", "Lint on every push — nice, not blocker.", "https://docs.github.com/en/actions/learn-github-actions/understanding-github-actions", "30 min"] },
  ],
  [14, 32, 48, 78, 18]
);

// ---------- 08 Security day 1 ----------
addTitleSheet(
  wb,
  "08-SecurityDay1",
  "Point 17 — Security from day one (map of topics → when we actually build them)",
  "You asked to understand these, not master them before coding. Baseline is Phase 1. Auth hashing is Phase 3. Uploads Phase 4. Orders Phase 8.",
  ["Topic", "In plain language", "When in OUR plan", "Read", "v1 bar (enough)"],
  [
    { values: ["Authentication", "Prove who you are (login).", "Phase 3 admin; consumer guest v1", "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html", "2 admin users, cookie session"] },
    { values: ["Authorization", "What that person is allowed to do.", "Phase 3 role middleware", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html", "ceo vs cashier matrix"] },
    { values: ["Password hashing", "Never store the real password.", "Phase 3 seed users", "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html", "bcrypt/argon2 only"] },
    { values: ["JWT vs session", "Token vs server session. We put JWT in httpOnly cookie (or a session id).", "Phase 3", "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html", "No JWT in localStorage"] },
    { values: ["Cookies", "Browser storage the JS cannot steal if httpOnly.", "Phase 3 + deploy HTTPS", "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies", "Secure + HttpOnly + SameSite"] },
    { values: ["CORS", "Which websites may call the API from a browser.", "Phase 1", "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS", "Allowlist local + staging + prod"] },
    { values: ["Rate limiting", "Stop brute force login and order spam.", "Phase 1 stub; tighten on /auth and POST /orders", "https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html", "express-rate-limit"] },
    { values: ["Input validation", "Shape of body/query must match schema.", "Phase 1 helper; every module after", "https://zod.dev/", "Zod on every write"] },
    { values: ["Sanitization", "Strip surprising fields; avoid NoSQL operator injection.", "With validation", "https://cheatsheetseries.owasp.org/cheatsheets/MongoDB_Security_Cheat_Sheet.html", "Disable client $ operators; Zod"] },
    { values: ["Environment variables", "Secrets outside git.", "Phase 1", "https://12factor.net/config", ".env gitignored"] },
    { values: ["API protection", "Default deny. Public routes marked public.", "Phase 1 pattern", "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html", "Public: health, catalog, quote, create order"] },
    { values: ["Admin route protection", "UI hide + API 403. UI hide alone is fake security.", "Phase 3", "RSA-023", "Both layers"] },
    { values: ["File upload security", "A picture can be a bomb if you trust it.", "Phase 4", "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html", "Type/size/name/Sharp"] },
    { values: ["Prevent price manipulation", "User edits HTML and sends total=1.", "Phase 6+8", "RSA-006, RSA-063", "Server quote + server order"] },
    { values: ["Unauthorized order access", "Do not let people guess /orders/1 and see others.", "Phase 8", "RSA-072", "Admin-only GET; public sees POST response once"] },
    { values: ["HTTPS / TLS", "Encrypt in transit on test+prod.", "Phase 1 host default", "Your host docs (Render/Railway)", "Never turn HTTPS off"] },
    { values: ["Headers (Helmet)", "Browser security headers.", "Phase 1", "https://github.com/helmetjs/helmet", "helmet()"] },
    { values: ["Error leakage", "Do not send stack traces to users.", "Phase 1", "Express error handling", "Generic 500 in production"] },
  ],
  [26, 42, 32, 70, 32]
);

// ---------- 09 Deploy day 1 ----------
addTitleSheet(
  wb,
  "09-DeployDay1",
  "Point 8 — Deployment is not the last step",
  "We deploy an EMPTY skeleton in Phase 1, then every feature is done only when it also works on TEST.",
  ["Item", "Do this", "Avoid this", "Read"],
  [
    { values: ["Three environments", "Local (Docker Mongo), Test (Atlas+host), Prod (separate Atlas DB).", "One database for test and real orders.", "https://12factor.net/dev-prod-parity"] },
    { values: ["Same code", "Git branch → test → later prod. Env vars differ.", "FTP files by hand from your laptop only.", "https://12factor.net/codebase"] },
    { values: ["Secrets", "Host secret store. Rotate JWT_SECRET per env.", "Commit .env or screenshots of keys.", "https://12factor.net/config"] },
    { values: ["Phase 1 deploy", "Hello world + /health on HTTPS.", "Wait until checkout exists.", "Render Node: https://render.com/docs/deploy-node-express-app  or Railway: https://docs.railway.app/"] },
    { values: ["Cookies on HTTPS", "secure=true on test/prod.", "Auth works local but 'fails' on staging because cookie dropped.", "MDN cookies"] },
    { values: ["CORS on real URLs", "Put staging origins in CORS_ORIGINS.", "cors() * in production.", "MDN CORS"] },
    { values: ["Images on server", "Uploads directory on the API host + backup plan.", "Only files on C:\\Users\\nada\\...", "Sharp + host disk docs"] },
    { values: ["Logs", "stdout; use host log viewer.", "console.log passwords.", "https://12factor.net/logs"] },
    { values: ["Backups", "Atlas backup/snapshots before real launch.", "Hope nothing dies.", "https://www.mongodb.com/docs/atlas/backup/"] },
    { values: ["Habit", "Feature: local → Postman → UI → TEST click-through.", "Works on my machine = done.", "RSA-011"] },
    { values: ["Point 18 (nearby)", "Testing + monitoring sit next to security/deploy in most checklists. v1: manual UAT + health + host logs. Automated tests grow from pricing first.", "Ignore test env.", "https://12factor.net/admin-processes"] },
  ],
  [22, 58, 48, 48]
);

// ---------- 10 Image strategy ----------
addTitleSheet(
  wb,
  "10-ImageStrategy",
  "Image sizing — what common apps do, what WE do",
  "Admins upload huge phone photos. If we ship originals, the consumer app is slow. Process on the backend at upload time.",
  ["Approach", "How it works", "Used by / common in", "For this freelance app"],
  [
    { fill: COLORS.locked, values: ["Sharp on upload (CHOSEN)", "API receives file → resize/compress to WebP variants (thumb 240, card 800, detail 1400) → store small files.", "Very common in Node backends. Similar idea to what CDNs do, but you own it.", "YES v1. Free, no extra vendor, good enough for one restaurant."] },
    { values: ["Next.js <Image>", "Optimizer can resize at request time if you host on Vercel; still needs a sane source file.", "Next.js apps", "USE together with Sharp. Do not skip Sharp and only use next/image on 8MB originals."] },
    { values: ["Cloudinary / ImageKit / imgix", "Upload original; URL params request size/format. CDN included.", "Many startups, shops that want zero infra", "Optional later if disk/backup/CDN becomes painful. Costs money."] },
    { values: ["S3 + Lambda / Cloudflare Images", "Store original in bucket; transform worker generates sizes.", "AWS-heavy teams", "Too much ops for v1."] },
    { values: ["Trust the admin to compress", "Ask them to use TinyPNG by hand.", "Nobody serious", "NO. They will forget."] },
  ],
  [28, 52, 40, 48]
);

{
  const s = wb.getWorksheet("10-ImageStrategy");
  // extra notes block
  const extra = [
    ["Rules for v1", "JPEG/PNG/WebP only, max 8MB, no SVG, random filenames, strip EXIF, CEO only."],
    ["Consumer", "Menu uses card.webp; product page uses detail.webp; lists/wishlist use thumb.webp."],
    ["Banners/hero", "Separate wide crop (e.g. 1920×800 hero, 1200×400 banner) generated the same way."],
    ["Read", "https://web.dev/learn/images"],
    ["Read", "https://sharp.pixelplumbing.com/"],
    ["Read", "https://nextjs.org/docs/app/building-your-application/optimizing/images"],
    ["Read", "https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html"],
  ];
  extra.forEach((pair, i) => {
    const row = s.getRow(12 + i);
    row.getCell(1).value = pair[0];
    row.getCell(2).value = pair[1];
    row.getCell(1).font = { bold: true };
    row.alignment = { wrapText: true };
    if (String(pair[1]).startsWith("http")) {
      row.getCell(2).value = { text: pair[1], hyperlink: pair[1] };
      row.getCell(2).font = { color: { argb: "FF0B6E4F" }, underline: true };
    }
  });
}

// ---------- 11 Roles ----------
addTitleSheet(
  wb,
  "11-RolesPermissions",
  "Who can do what",
  "Two admin users only. Guest is the public consumer.",
  ["Action", "Guest (consumer)", "Cashier", "CEO"],
  [
    { values: ["Browse published products", "Yes", "Yes (if they open the site)", "Yes"] },
    { values: ["See unpublished / deleted", "No", "No", "Unpublished yes; deleted no (v1)"] },
    { values: ["Cart / wishlist / checkout guest", "Yes", "—", "—"] },
    { values: ["Admin login", "No", "Yes", "Yes"] },
    { values: ["Create/edit products + images", "No", "No", "Yes"] },
    { values: ["Publish / unpublish", "No", "No", "Yes"] },
    { values: ["Permanent delete product", "No", "No", "Yes"] },
    { values: ["Set item discount", "No", "No", "Yes"] },
    { values: ["Manage banners", "No", "No", "Yes"] },
    { values: ["See orders", "Own confirmation once only", "Yes", "Yes"] },
    { values: ["Change order status", "No", "Yes", "Yes"] },
    { values: ["Create more admin users", "No", "No", "Not in v1"] },
  ],
  [40, 32, 28, 28]
);

// ---------- 12 Open questions ----------
addTitleSheet(
  wb,
  "12-OpenQuestions",
  "Open questions (please answer in the Answer column)",
  "Defaults apply if you skip. Pickup-only and EGP are the current defaults.",
  ["ID", "Question", "Why it blocks / shapes v1", "Default if unanswered", "Your answer"],
  [
    { fill: COLORS.open, values: ["Q1", "Pickup, delivery, or both in v1?", "Checkout fields. Brand copy already implies local delivery.", "Name+phone+notes; optional free-text address. Confirm with restaurant.", ""] },
    { fill: COLORS.locked, values: ["Q2", "Restaurant display name + city?", "Header, footer, SEO.", "كبابجي شعبان / Kababgy Shaaban — El Sawah, El Amerya, Cairo", "LOCKED"] },
    { fill: COLORS.locked, values: ["Q3", "Currency confirmed EGP?", "Money integers + format.", "EGP, piastres in API", "LOCKED"] },
    { fill: COLORS.locked, values: ["Q4", "Opening hours text?", "Footer + JSON-LD.", "مفتوح 24 ساعة / Open 24 hours", "LOCKED"] },
    { fill: COLORS.locked, values: ["Q5", "Do items need extras in v1?", "Cart complexity.", "NO paid add-ons. YES portion variants (kg/quarter/whole).", "LOCKED"] },
    { fill: COLORS.open, values: ["Q6", "Hosting preference: Render vs Railway vs VPS?", "Phase 1 deploy.", "Render or Railway (easier)", ""] },
    { fill: COLORS.open, values: ["Q7", "Any real deadline?", "How strict we cut v1.", "No date = quality over speed", ""] },
    { fill: COLORS.open, values: ["Q8", "Logo file + real food photos?", "Hero, OG image, conversion.", "Temporary SVG logo + placeholders until you drop files in docs/brand/assets/", ""] },
    { fill: COLORS.locked, values: ["Q11", "Phone number for NAP/SEO?", "Call button + JSON-LD telephone.", "Orders 01154626325 / 01223375293. Complaints 01101421344.", "LOCKED"] },
    { fill: COLORS.locked, values: ["Q12", "Confirm شيش طاووق مخلى 1ك=500 vs ½ك=450?", "Wrong prices on the site hurt trust.", "½ kg corrected to 250 EGP (aligned with 1kg=500 and 1/4=125)", "LOCKED"] },
    { fill: COLORS.locked, values: ["Q13", "Is category الجرئ meant to be الجريل?", "Category label.", "Yes — category is الجريل", "LOCKED"] },
    { fill: COLORS.later, values: ["Q9", "Payment methods? (later workshop)", "Not v1.", "Pay on delivery / at restaurant", ""] },
    { fill: COLORS.later, values: ["Q10", "How kitchen is notified? (later workshop)", "Not v1 beyond cashier screen.", "Cashier dashboard", ""] },
  ],
  [8, 48, 40, 32, 28]
);

addTitleSheet(
  wb,
  "13-KababgyShaaban",
  "Kababgy Shaaban — locked brand + menu facts",
  "Source: docs/brand/restaurant-identity.json and docs/data/menu-seed.json. Do not invent phone, geo, or founding year.",
  ["Fact", "Value", "Used in"],
  [
    { values: ["Arabic name", "كبابجي شعبان", "Header, footer, h1, JSON-LD, titles"] },
    { values: ["English name", "Kababgy Shaaban", "EN locale, hreflang"] },
    { values: ["Place", "El Sawah, El Amerya, Cairo, Egypt", "NAP, LocalBusiness"] },
    { values: ["Hours", "24/7 Always Open", "Footer, JSON-LD, no closed banner"] },
    { values: ["Type", "Traditional Egyptian kababgy / charcoal grill", "Description, cuisine"] },
    { values: ["Currency", "EGP — API stores piastres", "All prices"] },
    { values: ["Menu size", "14 categories, 72 products, 113 variants", "menu-seed.json"] },
    { values: ["Default variant", "1/4 kg (or 1/4 chicken) when it exists", "Home/menu cards"] },
    { values: ["Card vs detail", "Card = default only. Detail = all sizes. Cart = product+variant", "18-variants.md"] },
    { values: ["Visual", "Red #D31A1A, black #111111, white. Light header so the logo pops.", "RSA-032"] },
    { values: ["Phone orders", "01154626325 · 01223375293 (tel +20…)", "Header, footer, JSON-LD"] },
    { values: ["Phone complaints", "01101421344 — footer only, labelled شكاوى", "Footer ContactPoint"] },
    { values: ["Logo", "docs/brand/assets/logo.jpg", "Header, login, OG fallback"] },
    { values: ["Tagline", "للسيخ .... تاريخ", "Logo + optional footer"] },
    { values: ["Placeholders", "placeholder-product.svg / placeholder-banner.svg when image is null", "All product and banner slots"] },
    { values: ["Facebook", "https://www.facebook.com/share/1CwbBW7tu7/?mibextid=wwXIfr", "sameAs JSON-LD"] },
    { values: ["Confirmed fixes", "الجريل (not الجرئ). Shish tawook 1/2 kg 450→250. Platter texts cleaned.", "menu-source.json"] },
  ],
  [22, 78, 40]
);

await wb.xlsx.writeFile(outFile);
console.log("Wrote", outFile);
