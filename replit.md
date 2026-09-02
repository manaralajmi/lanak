# L’ANAK Gifting Platform

A premium bilingual Kuwaiti gifting experience that lets senders choose the gesture while recipients choose what they love.

## Run & Operate

- `pnpm --filter @workspace/l-anak run dev` — run the L’ANAK web app through its managed workflow
- `pnpm --filter @workspace/api-server run dev` — run the shared API server when backend features are added
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- The current L’ANAK prototype is frontend-only and does not require API or database access.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Web: React 19, Vite, Tailwind CSS, Wouter, Framer Motion

## Where things live

- `artifacts/l-anak/src/App.tsx` — routes, bilingual copy, gifting data, and interactive flows
- `artifacts/l-anak/src/index.css` — L’ANAK visual system, responsive behavior, and motion
- `artifacts/l-anak/` — deployable web artifact served at `/`

## Architecture decisions

- Arabic is the default language; language switching must update both copy and document direction.
- Packaging visuals are intentionally modular placeholders until final brand assets are supplied.
- The experience leads with emotion and recipient choice rather than product-first commerce.

## Product

- Bilingual Arabic/English experience with RTL/LTR switching
- Curated category and emotion-led gift discovery
- Favorites and gift bag interactions
- Coffee voucher and L’ANAK gift card configuration flows
- Responsive desktop, tablet, and mobile navigation and layouts

## User preferences

- Use only Espresso Brown `#49372D`, Butter Yellow `#E8D59E`, and Warm Cream `#FAF7F0`.
- Keep the tone spontaneous, sincere, refined, Kuwaiti, emotional, and premium.
- Avoid gradients, generic ecommerce patterns, excessive rounded cards, heavy shadows, and stock-looking imagery.
- Do not finalize the logo, packaging, gift boxes, voucher designs, or visual assets before the user supplies them.

## Gotchas

- Keep all frontend routes compatible with the artifact base path.
- Use the managed artifact workflow so `PORT` and `BASE_PATH` are supplied correctly.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
