# Athletera

MVP para diagnóstico de desequilibrios musculares en atletas usando 1RM estimado (fórmula de Epley), ratios de referencia y recomendaciones de entrenamiento.

## Stack

- React + Vite + TypeScript (strict)
- Tailwind CSS
- Recharts
- Vitest

## Scripts

```bash
pnpm install
pnpm dev
pnpm test
pnpm build
```

## Estado actual

- Core matemático implementado (`src/utils/calculators.ts`)
- Ratios y pivot definidos (`src/constants/ratios.ts`)
- Hook de lógica con persistencia en LocalStorage (`src/hooks/useStrengthLogic.ts`)
- UI base mobile-first (`ExerciseForm`, `ResultsSummary`, `RadarChart`)
