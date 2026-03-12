# Modelos de Datos (Data Models)

Diccionario de tipos y estructuras usadas en Athletera.

## Tipos Principales

### `AnyLevel` (Unificado)

Tipo unificado para niveles de fuerza.

```typescript
type AnyLevel = 'beginner' | 'novice' | 'intermediate' | 'advanced' | 'elite';
```

| Valor | Label en UI | Ratio en Banca |
|---|---|---|
| `beginner` / `novice` | Principiante | 0.8× BW |
| `intermediate` | Intermedio | 1.2× BW |
| `advanced` | Avanzado | 1.5× BW |
| `elite` | Élite | 1.8× BW |

---

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

**Ejercicio IDs válidos (9 ejercicios):**

#### Principales (6)
- `bench_press` (Press de Banca) — **Obligatorio como pivot**
- `overhead_press` (Press Militar)
- `barbell_row` (Remo con Barra)
- `weighted_pull_up` (Dominadas Lastradas)
- `squat` (Sentadilla)
- `deadlift` (Peso Muerto)

#### Accesorios / Salud Estructural (3)
- `dips` (Fondos en Paralelas)
- `tricep_extension` (Press Francés / Tríceps)
- `face_pull` (Face Pull - test de resistencia)

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
  strengthLevel?: AnyLevel;
  levelProgress?: number;
  relativeRatio?: number;
  movementPattern?: MovementPattern;
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
| `strengthLevel` | string | Enum | Nivel actual (beginner/intermediate/advanced/elite) |
| `levelProgress` | number | 0-100 | % de progreso al próximo nivel |
| `relativeRatio` | number | > 0 | Fuerza relativa (1RM / BW) |
| `movementPattern` | string | Enum | Patrón de movimiento (push/pull/squat/hinge) |

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
  | 'deadlift'
  | 'dips'
  | 'tricep_extension'
  | 'face_pull';
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

### `MovementPattern`

Patrón de movimiento para clasificación de ejercicios.

```typescript
type MovementPattern = 'push_horizontal' | 'push_vertical' | 'pull_horizontal' | 'pull_vertical' | 'squat' | 'hinge';
```

| Ejercicio | Patrón |
|---|---|
| Press de Banca | `push_horizontal` |
| Press Militar | `push_vertical` |
| Dips | `push_vertical` |
| Remo con Barra | `pull_horizontal` |
| Dominadas Lastradas | `pull_vertical` |
| Face Pull | `pull_horizontal` |
| Sentadilla | `squat` |
| Peso Muerto | `hinge` |

---

### `CrossExerciseAlert`

Alerta de desequilibrio entre ejercicios de empuje y tracción.

```typescript
interface CrossExerciseAlert {
  type: 'push_pull_imbalance';
  severity: 'critical' | 'warning';
  pushExercise: ExerciseId;
  pullExercise: ExerciseId;
  pushLevel: AnyLevel;
  pullLevel: AnyLevel;
  levelDifference: number;
  message: string;
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `type` | string | Siempre `push_pull_imbalance` |
| `severity` | string | `critical` si ≥2 niveles, `warning` si =1 nivel |
| `pushExercise` | ExerciseId | Ejercicio de empuje |
| `pullExercise` | ExerciseId | Ejercicio de tracción |
| `pushLevel` | AnyLevel | Nivel del ejercicio de empuje |
| `pullLevel` | AnyLevel | Nivel del ejercicio de tracción |
| `levelDifference` | number | Diferencia numérica (0-3) |
| `message` | string | Mensaje formateado para UI |

**Umbrales:**
- `levelDifference >= 2` → **CRÍTICO** (riesgo de lesión)
- `levelDifference === 1` → **ADVERTENCIA** (desequilibrio leve)

---

### `GhostProfile`

Perfil fantasma para modo comparativo.

```typescript
interface GhostProfile {
  exercise: ExerciseId;
  target1RM: number;
  targetLevel: AnyLevel;
  current1RM: number;
  gap: number;
  gapPercentage: number;
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `exercise` | ExerciseId | Ejercicio evaluado |
| `target1RM` | number | 1RM objetivo para el nivel seleccionado |
| `targetLevel` | AnyLevel | Nivel objetivo seleccionado por el usuario |
| `current1RM` | number | 1RM actual del usuario |
| `gap` | number | Diferencia en kg (target - current) |
| `gapPercentage` | number | Diferencia en % ((gap / current) × 100) |

**Ejemplo:**
```typescript
{
  exercise: 'bench_press',
  target1RM: 112.5,      // Advanced para 75kg BW
  targetLevel: 'advanced',
  current1RM: 101.33,
  gap: 11.17,            // Faltan 11.17 kg
  gapPercentage: 11.02   // 11.02% por debajo de la meta
}
```

---

### `DiagnosticCard`

Tarjeta de diagnóstico narrativo.

```typescript
interface DiagnosticCard {
  severity: 'critical' | 'warning' | 'info';
  title: string;
  body: string;
  risks: string[];
  actions: string[];
}
```

| Campo | Tipo | Notas |
|---|---|---|
| `severity` | string | `critical` / `warning` / `info` |
| `title` | string | Título de la alerta |
| `body` | string | Descripción en lenguaje natural |
| `risks` | string[] | Lista de riesgos de salud |
| `actions` | string[] | Lista de acciones recomendadas |

**Casos de generación:**
1. **Crítico:** Cross-exercise imbalance ≥2 niveles
2. **Crítico:** Diferencia ≥2 niveles entre ejercicio más fuerte y más débil
3. **Advertencia:** Múltiples deficiencias críticas (≥2)
4. **Info:** Todos los ejercicios en estado óptimo

---

## Reglas de Negocio (Resumen)

1. **1RM se redondea a 2 decimales** — Función `round2()` en `calculators.ts`
2. **Press de Banca es obligatorio** — Sin él, no hay diagnóstico
3. **Mínimo 2 ejercicios** — Para poder comparar
4. **Peso y reps deben ser > 0** — Validación en UI y lógica
5. **LocalStorage persiste estado completo** — Profile + Metrics + ViewMode + TargetLevel
6. **Face Pull usa test de resistencia** — No usa 1RM, evalúa 15 reps con 10% del bench
7. **Desequilibrio escapular crítico** — Si tracción es 20% menor que empuje

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
  ],
  "viewMode": "comparative",
  "targetLevel": "advanced"
}
```
