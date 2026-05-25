# AGENTS.md

## Quick reference

```bash
pnpm dev            # Vite dev server
pnpm build          # tsc -b && vite build  (typecheck runs FIRST)
pnpm test           # vitest run (unit tests, node env)
pnpm test:watch     # vitest in watch mode
```

Run a single test file: `pnpm vitest run src/utils/calculators.test.ts`

Build order matters: **typecheck -> vite build** (both in `pnpm build`). Fix type errors before build errors.

## Project shape

Single-package Vite + React 18 PWA. No monorepo, no backend. pnpm only.

```
src/
  components/    # Pure presentational React (.tsx)
  hooks/         # Business logic + state (useStrengthLogic)
  utils/         # Pure functions (calculators.ts is the core)
  constants/     # Static data (ratios, strength standards)
  types/         # TypeScript domain types
  assets/        # Global styles
```

Entrypoint: `index.html` -> `src/main.tsx` -> `src/App.tsx` -> `useStrengthLogic` hook orchestrates everything.

## Conventions (from `.specify/constitution.md`)

- **Strict TypeScript** - `noUncheckedIndexedAccess` is on. No `any`; use `unknown` + type guards.
- `.ts` for logic, `.tsx` only for React components.
- Named exports in utils/constants (avoid `export default`).
- `PascalCase` components, `camelCase` functions, `UPPER_CASE` constants.
- **UI and error messages are in Spanish.** Keep them in Spanish.
- Components must be pure/presentational. Business logic goes in `hooks/`.
- Mobile-first (must work at 375px viewport).

## Testing

- Only `src/utils/calculators.test.ts` exists (~35 tests). Tests on calculator logic are mandatory per constitution.
- Vitest runs in **node** environment (not jsdom). No component tests currently.
- No linter or formatter configured in the repo. No CI pipeline.

## Domain quirks an agent would miss

- **Bench press is the mandatory pivot exercise.** All ratio calculations reference it.
- **Bodyweight exercises** (weighted_pull_up, dips): user's bodyweight is added to the load before 1RM calculation.
- **Dumbbell implement**: weight is multiplied by 2 then reduced by 10%.
- **Face Pull** is an endurance exercise evaluated differently (not 1RM-based).
- Classification thresholds: optimal >= -5%, warning -15% to -5%, critical <= -15%.
- State persists to LocalStorage key `athletera:strength-state:v2`.

## PWA

The app is a PWA (`vite-plugin-pwa` with `autoUpdate` strategy + workbox). Changes to the PWA manifest live in `vite.config.ts`.
