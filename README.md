# 7 Noodles

Website and online ordering platform for 7 Noodles (恰小面), a Sichuan and
Chongqing noodle restaurant at 4664 Yonge St Unit 13, North York, Ontario.

Replaces the restaurant's previous hosted ordering platform with a first-party
site that owns the menu, cart, checkout, customer accounts, order management
and reviews.

## Requirements

- Node 22.12 or newer (see `.nvmrc`)
- pnpm 10.12

## Getting started

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The app runs at http://localhost:3000.

## Scripts

| Script           | Purpose                            |
| ---------------- | ---------------------------------- |
| `pnpm dev`       | Development server                 |
| `pnpm build`     | Production build                   |
| `pnpm start`     | Serve a production build           |
| `pnpm typecheck` | TypeScript, no emit                |
| `pnpm lint`      | ESLint                             |
| `pnpm format`    | Prettier, write                    |
| `pnpm test`      | Vitest, single run                 |
| `pnpm verify`    | Everything CI runs, in one command |

## Conventions

- All monetary values are integer cents. See `src/lib/money.ts`.
- Environment variables are validated at boot in `src/env.ts`. Add new
  variables to the schema and to `.env.example` in the same change.
- Commits follow Conventional Commits, scoped to the area touched, for example
  `feat(menu): add category filter`.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Postgres with Drizzle ·
Better Auth · Stripe · Resend · deployed on Vercel.
