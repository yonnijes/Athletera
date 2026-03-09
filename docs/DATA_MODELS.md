# Modelos de Datos (Data Models)

Diccionario de tipos y estructuras usadas en Athletera.

## Tipos Principales

### `AthleteProfile`

Perfil del atleta que usa la aplicación.

```typescript
interface AthleteProfile {
  category: 'powerlifting' | 'football' | 'general_fitness' | 'running';
  level: 'beginner' | 'intermediate' | 'advanced';
  bodyWeightKg?: number;  // Opcional, > 0 si se provee
}
```

| Campo | Tipo | Requerido | Validación | Notas |
|---|---|---|---|---|
| `category` | string | Sí | Enum | Deporte/categoría del atleta |
| `level` | string | Sí | Enum | Nivel de experiencia |
| `bodyWeightKg` | number | No | > 0 | Peso corporal en kg |

---

### `StrengthMetrics`

Métrica de fuerza para un ejercicio específico.

```typescript
interface StrengthMetrics {
  exerciseId: ExerciseId;
  weightKg: number;
  reps: number;
}
```

| Campo | Tipo | Requerido | Validación | Notas |
|---|---|---|---|---|
| `exerciseId` | string | Sí | Enum | ID del ejercicio |
| `weightKg` | number | Sí | > 0 | Peso levantado en kg |
| `reps` | number | Sí | > 0 | Repeticiones al fallo técnico |

**Ejercicio IDs válidos:**
- `bench_press` (Press de Banca) — **Obligatorio como pivot**
- `overhead_press` (Press Militar)
- `barbell_row` (Remo con Barra)
- `weighted_pull_up` (Dominadas Lastradas)
- `squat` (Sentadilla)
- `deadlift` (Peso Muerto)

---

### `AssessmentResult`

Resultado del diagnóstico para un ejercicio.

```typescript
interface AssessmentResult {
  exercise: ExerciseId;
  current1RM: number;
  target1RM: number;
  percentageEfficiency: number;
  status: 'optimal' | 'warning' | 'critical';
  recommendation: string;
}
```

| Campo | Tipo | Validación | Notas |
|---|---|---|---|
| `exercise` | string | Enum | Ejercicio evaluado |
| `current1RM` | number | > 0, 2 decimales | 1RM estimado actual |
| `target1RM` | number | ≥ 0, 2 decimales | 1RM objetivo según ratio ideal |
| `percentageEfficiency` | number | 0-200 | % de eficiencia vs ideal |
| `status` | string | Enum | Estado del diagnóstico |
| `recommendation` | string | — | Texto de recomendación |

---

### `ExerciseId`

Union type de ejercicios soportados.

```typescript
type ExerciseId =
  | 'bench_press'
  | 'overhead_press'
  | 'barbell_row'
  | 'weighted_pull_up'
  | 'squat'
  | 'deadlift';
```

---

### `AssessmentStatus`

Estado del diagnóstico.

```typescript
type AssessmentStatus = 'optimal' | 'warning' | 'critical';
```

| Estado | Umbral | Significado |
|---|---|---|
| `optimal` | desviación ≥ -5% | Dentro del rango ideal |
| `warning` | -15% < desviación < -5% | Mejorable, prestar atención |
| `critical` | desviación ≤ -15% | Deficiencia significativa |

---

## Reglas de Negocio (Resumen)

1. **1RM se redondea a 2 decimales** — Función `round2()` en `calculators.ts`
2. **Press de Banca es obligatorio** — Sin él, no hay diagnóstico
3. **Mínimo 2 ejercicios** — Para poder comparar
4. **Peso y reps deben ser > 0** — Validación en UI y lógica
5. **LocalStorage persiste estado completo** — Profile + Metrics

---

## Ejemplo de Estado Completo

```json
{
  "profile": {
    "category": "general_fitness",
    "level": "intermediate",
    "bodyWeightKg": 75
  },
  "metrics": [
    { "exerciseId": "bench_press", "weightKg": 80, "reps": 8 },
    { "exerciseId": "overhead_press", "weightKg": 45, "reps": 6 },
    { "exerciseId": "squat", "weightKg": 100, "reps": 5 }
  ]
}
```
