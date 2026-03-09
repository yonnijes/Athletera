# Athletera

MVP para diagnóstico de desequilibrios musculares en atletas usando 1RM estimado (fórmula de Epley), ratios de referencia y recomendaciones de entrenamiento.

## 📁 Estructura de Documentación

```
.specify/           # El "Cerebro" del proyecto
├── constitution.md # Principios inamovibles (tech stack, reglas de salud)
├── spec.md         # La verdad del negocio (ratios, fórmulas de 1RM)
└── plan.md         # Roadmap técnico y arquitectura
```

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

## Estado Actual

- ✅ Core matemático implementado (`src/utils/calculators.ts`)
- ✅ Ratios y pivot definidos (`src/constants/ratios.ts`)
- ✅ Hook de lógica con persistencia en LocalStorage (`src/hooks/useStrengthLogic.ts`)
- ✅ UI base mobile-first (`ExerciseForm`, `ResultsSummary`, `RadarChart`)
- ✅ Selector de perfil de atleta (categoría + nivel + peso corporal)
- ✅ Validaciones UX en tiempo real

## Cómo funciona el cálculo de ratios

**Press Militar = 60-65% del Press de Banca**

Esto se define en `src/constants/ratios.ts`:

```ts
export const IDEAL_RATIO_RANGES: Partial<Record<ExerciseId, RatioRange>> = {
  overhead_press: { min: 0.6, max: 0.65 }, // 60% - 65%
  // ...
};
```

El sistema:
1. Calcula el 1RM de cada ejercicio (fórmula de Epley)
2. Usa Press de Banca como pivot (100%)
3. Compara cada ejercicio contra su ratio ideal
4. Marca deficiencia si la desviación es < -15%

Ver `.specify/spec.md` para detalles completos.
