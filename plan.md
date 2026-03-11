# Plan Técnico: Athletera MVP

## 1. Stack Tecnológico (The Tech Stack)

Para garantizar velocidad de desarrollo y una interfaz limpia:

- **Frontend:** React (Vite) + TypeScript.
- **Estilos:** Tailwind CSS (para diseño responsivo y rápido).
- **Gráficos:** Recharts (para el gráfico de radar/comparativa).
- **Iconos:** Lucide-react.
- **Estado:** React Hooks (Context API para datos globales si es necesario).
- **Persistencia:** LocalStorage (para que el atleta no pierda sus datos al recargar sin necesidad de base de datos).

## 2. Arquitectura de Archivos

```plaintext
src/
├── assets/                  # Imágenes y estilos globales
├── components/              # Componentes UI reutilizables
│   ├── ui/                  # Botones, Inputs, Cards (Tailwind)
│   ├── ExerciseForm.tsx
│   ├── RadarChart.tsx
│   └── ResultsSummary.tsx
├── hooks/                   # Lógica de cálculo extraída
│   └── useStrengthLogic.ts
├── utils/                   # Fórmulas matemáticas puras
│   └── calculators.ts
├── constants/               # Ratios y estándares por deporte
│   └── ratios.ts
└── App.tsx                  # Punto de entrada
```

## 3. Módulos de Lógica (Core Logic)

### 3.1 Calculadora de Fuerza (`utils/calculators.ts`)

Implementación de la fórmula de Epley para el **1RM**:

$$
1RM = peso \times \left(1 + \frac{reps}{30}\right)
$$

### 3.2 Motor de Comparación

Función que recibe el ejercicio **Pivot** (Press de Banca) y devuelve el porcentaje de eficiencia de los demás ejercicios basándose en las constantes de `ratios.ts`.

## 4. Fases de Implementación (Roadmap)

### Fase 1: Setup y Estructura (Día 1)
- Inicializar proyecto con Vite + Tailwind.
- Configurar el sistema de tipos en TypeScript para `Exercise` y `Assessment`.

### Fase 2: Formulario de Entrada (Día 1-2)
- Crear interfaz dinámica donde el usuario elija su ejercicio base y añada los ejercicios de comparación.
- Validación de datos: no permitir 0 repeticiones ni pesos negativos.

### Fase 3: Procesamiento y Visualización (Día 2-3)
- Integrar Recharts para mostrar el Radar Chart.
- Eje A: Ratio Ideal.
- Eje B: Ratio Actual del Usuario.

### Fase 4: Motor de Recomendaciones (Día 3)
- Lógica condicional: si el ratio es **< 85%**, mostrar alerta de **Deficiencia** y sugerir ejercicios accesorios específicos.
- Ejemplo: si falla en hombro, sugerir **Face Pulls** o **Press Arnold**.

## 5. Estrategia de Testing (QA)

- **Unit Tests:** Probar la fórmula de **1RM** con valores conocidos (ej. 100kg x 10 reps debería dar ~133kg).
- **Edge Cases:** ¿Qué pasa si el usuario no ingresa el ejercicio base? (La app debe pedirlo obligatoriamente).

## 6. Consideraciones de UX/UI

- **Mobile First:** El 90% de los atletas usará esto en el gimnasio desde el móvil.
- **Feedback Inmediato:** A medida que el usuario cambia las repeticiones, el **1RM** estimado debe actualizarse en tiempo real.

---

## 7. Plan de Interfaz (UI Plan)

### 7.1 Selector de Nivel de Aspiración

La app debe ofrecer **dos modos** de visualización del progreso:

#### Modo Simple (Default)
**Flujo:**
1. Usuario ingresa peso y repeticiones de cada ejercicio.
2. La app calcula automáticamente el **nivel actual** (Novice/Intermediate/Advanced/Elite).
3. Muestra badges de nivel por ejercicio + barra de progreso.

**UI:**
```
┌─────────────────────────────────────────┐
│ Press de Banca                          │
│ [Novice] 🟢 Óptimo                      │
│ 1RM: 100 kg | Ratio: 0.8× BW           │
│ Progreso a Intermedio [████░░] 67%     │
└─────────────────────────────────────────┘
```

---

#### Modo Comparativo (Ghost Profile)
**Flujo:**
1. Usuario selecciona: **"Quiero ser nivel [Advanced]"** (dropdown).
2. La app genera un **"Ghost Profile"** (perfil fantasma) en el gráfico de radar.
3. El radar muestra **dos áreas superpuestas**:
   - **Área sólida (azul):** Rendimiento actual
   - **Área semitransparente (gris):** Rendimiento objetivo (nivel Advanced)

**UI del Selector:**
```
┌─────────────────────────────────────────┐
│ 🎯 Modo de Visualización                │
│ ○ Simple (ver mi nivel actual)          │
│ ● Comparativo (comparar con mi meta)    │
│                                         │
│ Quiero ser nivel: [Advanced ▼]          │
└─────────────────────────────────────────┘
```

**Gráfico de Radar con Ghost:**
```
        ┌──────────────────────────────┐
        │    ⬡⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯     │
        │   /  Área Gris: Advanced  \   │
        │  /   Área Azul: Tú        \  │
        │  ⬡⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯  │
        │                              │
        │  ━━ Tú  ⎯ ⎯ ⎯ Meta (Adv)   │
        └──────────────────────────────┘
```

**Cálculo del Ghost Profile:**
```typescript
// Para cada ejercicio, calcular el 1RM objetivo según el nivel seleccionado
function calculateGhost1RM(
  bodyWeightKg: number,
  exerciseId: ExerciseId,
  targetLevel: StrengthLevel
): number {
  const standard = STRENGTH_STANDARDS[exerciseId].standard[targetLevel];
  return bodyWeightKg * standard;
}

// Ejemplo: Usuario de 75kg quiere ser Advanced en Banca
// Advanced Banca = 1.5× BW
// Ghost 1RM = 75 × 1.5 = 112.5 kg
```

---

### 7.2 Diagnóstico Narrativo (Texto Explicativo)

La app debe generar un **diagnóstico en lenguaje natural** que el usuario pueda entender fácilmente.

**Estructura del Diagnóstico:**
```
1. Reconocimiento (nivel actual en ejercicio fuerte)
2. Contraste (nivel actual en ejercicio débil)
3. Ratio numérico (tracción/empuje)
4. Consecuencia (riesgo de lesión/desequilibrio)
5. Acción (qué hacer)
```

**Ejemplo de Diagnóstico:**
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Diagnóstico de Balance Muscular                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Tu Press de Banca es de nivel **Avanzado** (120 kg),   │
│ pero tus Dominadas son de nivel **Principiante**       │
│ (solo peso corporal).                                  │
│                                                         │
│ Tu ratio de tracción es del **55%**, cuando debería    │
│ ser del **80%** para tu nivel.                         │
│                                                         │
│ ⚠️ TIENES ALTO RIESGO de desarrollar:                  │
│   • Hombros adelantados (postura cifótica)             │
│   • Dolor cervical                                     │
│   • Lesiones del manguito rotador                      │
│                                                         │
│ ✅ ACCIÓN RECOMENDADA:                                 │
│   1. Priorizar tracción vertical (dominadas asistidas) │
│   2. Face Pulls diarios (3×15-20)                      │
│   3. Reducir volumen de press 20% por 2 semanas        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Componente UI Sugerido:**
```tsx
<DiagnosticCard
  pushLevel="advanced"
  pullLevel="novice"
  pushExercise="bench_press"
  pullExercise="weighted_pull_up"
  currentRatio={0.55}
  targetRatio={0.80}
  risks={['Hombros adelantados', 'Dolor cervical', 'Lesión manguito']}
  actions={[
    'Priorizar tracción vertical (dominadas asistidas)',
    'Face Pulls diarios (3×15-20)',
    'Reducir volumen de press 20% por 2 semanas'
  ]}
/>
```

---

### 7.3 Roadmap de Implementación UI

| Fase | Feature | Componentes | Prioridad |
|---|---|---|---|
| **Fase 1** | Modo Simple | `StrengthLevelBadge`, `ProgressBar` | 🔴 Alta |
| **Fase 2** | Selector de Modo | `ViewModeToggle`, `LevelSelector` | 🟡 Media |
| **Fase 3** | Ghost Profile | `RadarChart` (doble dataset) | 🟡 Media |
| **Fase 4** | Diagnóstico Narrativo | `DiagnosticCard` | 🟢 Baja |

---

### 7.4 Pseudocódigo para Gemini (Implementación)

```typescript
// En App.tsx o useStrengthLogic.ts

interface UIState {
  viewMode: 'simple' | 'comparative';
  targetLevel: StrengthLevel; // Solo si viewMode === 'comparative'
  bodyWeightKg: number;
}

// Calcular Ghost Profile para el radar
const ghostProfile = useMemo(() => {
  if (viewMode !== 'comparative' || !bodyWeightKg) return null;
  
  return metrics.map(m => ({
    exercise: m.exerciseId,
    target1RM: calculateGhost1RM(bodyWeightKg, m.exerciseId, targetLevel),
  }));
}, [viewMode, targetLevel, bodyWeightKg, metrics]);

// Generar diagnóstico narrativo
const diagnosis = useMemo(() => {
  const pushLevel = getPushExerciseLevel(); // ej: 'advanced'
  const pullLevel = getPullExerciseLevel(); // ej: 'novice'
  const levelDiff = strengthLevelToNumber(pushLevel) - strengthLevelToNumber(pullLevel);
  
  if (levelDiff >= 2) {
    return {
      severity: 'critical',
      title: 'Desequilibrio Crítico Detectado',
      body: `Tu ${formatExercise(pushExercise)} es ${STRENGTH_LEVEL_LABELS[pushLevel]}, 
             pero tu ${formatExercise(pullExercise)} es ${STRENGTH_LEVEL_LABELS[pullLevel]}.`,
      risks: ['Hombros adelantados', 'Dolor cervical'],
      actions: ['Priorizar tracción', 'Face Pulls diarios'],
    };
  }
  return null;
}, [results]);
```
