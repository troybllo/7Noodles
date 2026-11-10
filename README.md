# 7 Noodles · 恰小面

The website and online ordering system for **7 Noodles (恰小面)**, a Sichuan and
Chongqing noodle restaurant at 4664 Yonge St, Unit 13, North York, Toronto.

**Live:** [seven-noodles.vercel.app](https://seven-noodles.vercel.app)

The site tells the restaurant's story and sells its food. Visitors can browse
the full menu in English and Chinese and order for pickup, paying by card,
Apple Pay or Google Pay. The kitchen receives each paid order on a tablet
board. The site is built mobile-first, because most diners find a restaurant
on their phone, and on every page Order, Call and Directions are one tap away.

---

## What it does

**For diners**

- **Menu**: every dish with photography, prices, spice level, dietary and
  allergen marks, and its Chinese name. Each category and dish has its own
  shareable, indexable page.
- **Pickup ordering**: a cart that remembers its contents, choices per dish
  (size, protein, spice), a pickup-time picker and Stripe Checkout. Each order
  gets a live status page: received, preparing, ready.
- **The story**: the restaurant's own words in both languages, its photography
  and illustration, how to eat dry noodles, and what goes on in the kitchen.
- **Events, location and hours**: from one source of truth, shared with the
  structured data that search engines read.

**For the restaurant**

- **Kitchen board** (`/kitchen`): a PIN-protected tablet screen. New paid
  orders flash and chime until someone accepts them. Orders move through New,
  Preparing, Ready and Picked up, and online ordering can be paused at busy
  times.
- **Alerts**: push notifications to staff phones, and optional SMS through
  Twilio.
- **Payments**: card details never touch the site. The server re-prices every
  order from the menu instead of trusting the browser, and only orders Stripe
  confirms as paid reach the kitchen.

How ordering works end to end, its running costs, and the launch checklist are
in [`docs/ordering-handover.md`](docs/ordering-handover.md).

## Built with

| Area         | Choice                                                                  |
| ------------ | ----------------------------------------------------------------------- |
| Framework    | [Next.js 16](https://nextjs.org) (App Router, Server Actions), React 19 |
| Language     | TypeScript (strict), validated with [Zod](https://zod.dev)              |
| Styling      | Tailwind CSS v4, with the brand's colours and type as design tokens     |
| Motion       | GSAP with ScrollTrigger, Lenis (desktop), View Transitions, CSS         |
| Data         | Postgres on [Neon](https://neon.tech), plain SQL migrations in `db/`    |
| Payments     | [Stripe Checkout](https://stripe.com/payments/checkout) and webhooks    |
| Notification | Web Push (VAPID), optional Twilio SMS                                   |
| Testing      | Vitest; CI on GitHub Actions                                            |
| Hosting      | [Vercel](https://vercel.com)                                            |

The menu is data, not code: `data/menu.json` is validated against a schema in
`src/lib/menu-schema.ts`, and the site, the cart, checkout pricing and the
search-engine data all read it.

## Getting started

Requires **Node 22.12+** (see `.nvmrc`) and **pnpm 10**.

```bash
pnpm install
cp .env.example .env.local   # then fill in what you need
pnpm dev                     # http://localhost:3000
```

Browsing the site needs only `NEXT_PUBLIC_SITE_URL`. Online ordering also needs
the database, Stripe, kitchen and push settings listed in `.env.example`; run
`pnpm db:migrate` once the database URL is set.

## Scripts

| Script            | What it does                                            |
| ----------------- | ------------------------------------------------------- |
| `pnpm dev`        | Development server                                      |
| `pnpm build`      | Production build                                        |
| `pnpm start`      | Serve a production build                                |
| `pnpm verify`     | Type-check, lint, format check and tests (what CI runs) |
| `pnpm test`       | Unit tests, single run                                  |
| `pnpm format`     | Format everything with Prettier                         |
| `pnpm db:migrate` | Apply the SQL migrations in `db/migrations`             |
| `pnpm fonts`      | Re-subset the Chinese font after adding new characters  |

## Project layout

```
src/
  app/          Pages and API routes (menu, order, checkout, kitchen, about, …)
  components/   UI, grouped by area: sections, menu, order, nav, motion, brand
  content/      The site's words and photo choices, kept out of components
  lib/          Menu, cart, money, pickup times, SEO, ordering back end
data/           The menu (menu.json) and the owner's source notes
db/migrations/  Database schema, as plain SQL
docs/           Handover notes for ordering and the kitchen
public/         Photography, brand artwork, fonts
```

## Conventions

- **Money** is always integer cents (`src/lib/money.ts`).
- **Settings** are validated: `src/env.ts` checks the site's at build time, and
  `src/lib/orders/env.ts` checks ordering's when they're first used. A new
  setting goes in the schema and in `.env.example` in the same change.
- **Copy** lives in `src/content/`, so wording and photo changes don't touch
  layout code.
- **Accessibility and motion**: every interaction works by keyboard and screen
  reader, tap targets are at least 44px, and all animation stops for visitors
  who have turned on reduced motion.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org),
  for example `feat(menu): add category filter`.

## Deployment

Pushes to `main` run CI (type-check, lint, format, tests and build) on GitHub
Actions, and deploy to Vercel. Production settings live in the Vercel
project's environment variables, never in the repository.

---

© 7 Noodles 恰小面. Photography and brand artwork are the restaurant's own.
