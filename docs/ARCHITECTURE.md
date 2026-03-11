# Arquitectura de Athletera

## Diagrama de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           FLUJO DE DATOS                                │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Usuario    │ ──▶ │   Input UI   │ ──▶ │  Validación  │
│  ingresa     │     │  (Exercise   │     │  (peso > 0,  │
│  datos       │     │   Form)      │     │   reps > 0)  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   UI         │ ◀── │  Diagnóstico │ ◀── │  Cálculo     │
│  (Radar +    │     │  (estado,    │     │  1RM Epley   │
│   Results)   │     │   recomend.) │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │  Comparación │
                                         │  vs Ratios   │
                                         │  Ideales     │
                                         └──────────────┘
                                                │
                                                ▼
                                         ┌──────────────┐
                                         │  Persistencia│
                                         │  LocalStorage│
                                         └──────────────┘
```

## Componentes Principales

```
src/
├── App.tsx                  # Punto de entrada, orquesta componentes
├── components/
│   ├── AthleteProfileForm   # Formulario de perfil (categoría, nivel, peso)
│   ├── ExerciseForm         # Inputs de peso/reps por ejercicio
│   ├── RadarChart           # Visualización comparativa (Recharts)
│   └── ResultsSummary       # Lista de resultados con recomendaciones
├── hooks/
│   └── useStrengthLogic     # Estado global + lógica de negocio
├── utils/
│   └── calculators.ts       # Funciones puras (1RM, ratios, diagnóstico)
├── constants/
│   ├── ratios.ts            # Ratios ideales por ejercicio
│   └── athlete.ts           # Categorías y niveles de atleta
└── types/
    └── domain.ts            # Interfaces TypeScript
```

## Lógica de Ratios (Tabla de Referencia)

**Base: Press de Banca = 100%**

| Ejercicio | Ratio Ideal | Propósito |
|---|---:|---|
| Press Militar | 60% - 65% | Salud del hombro y empuje vertical |
| Remo con Barra | 75% - 80% | Equilibrio cadena posterior |
| Dominadas Lastradas | 75% - 80% | Fuerza de tracción vertical |
| Sentadilla | 120% - 140% | Equilibrio tren superior/inferior |
| Peso Muerto | 150%+ | Fuerza estructural total |

### Cálculo de Eficiencia

```
1. Calcular 1RM de cada ejercicio (Epley)
2. Normalizar: ratioActual = 1RM_ejercicio / 1RM_bench
3. Comparar: eficiencia = (ratioActual / ratioIdeal) × 100
4. Clasificar:
   - Óptimo:    eficiencia ≥ 95%
   - Advertencia: 85% ≤ eficiencia < 95%
   - Crítico:   eficiencia < 85%
```

### Fórmula de Epley

```
1RM = peso × (1 + reps / 30)
```

Ejemplo: 80 kg × 8 reps = 80 × (1 + 8/30) = **101.33 kg**

## Estados de la Aplicación

```typescript
interface AppState {
  profile: AthleteProfile;      // Categoría, nivel, peso corporal
  metrics: StrengthMetrics[];   // Ejercicios con peso/reps
  results: AssessmentResult[];  // Diagnóstico calculado
  errors: string[];             // Validaciones fallidas
}
```

## Persistencia

- **LocalStorage key:** `athletera:strength-state:v2`
- **Formato:** JSON serializado
- **Alcance:** Solo navegador del usuario (no se envía a servidor)

---

## Origen de los Ratios Ideales

### ¿De dónde salen estos porcentajes?

Los ratios ideales no son arbitrarios. Se basan en:

#### 1. Datos Empíricos de Atletas

| Fuente | Aporte |
|---|---|
| **Strength Level** | Base de datos crowdsourced de +500,000 atletas |
| **PowerliftingToWin** | Normas de fuerza por peso corporal y nivel |
| **NSCA** | Estándares de certificación de entrenadores |
| **Starting Strength** | Progresiones observadas en miles de lifters |

#### 2. Biomecánica y Física

| Ejercicio | Razón biomecánica del ratio |
|---|---|
| **Press Militar (60-65%)** | Hombros solos tienen menos ventaja mecánica que pecho + tríceps con espalda apoyada |
| **Remo / Dominadas (75-80%)** | Cadena posterior de tracción es fuerte pero no supera al empuje horizontal en la mayoría |
| **Sentadilla (120-140%)** | Piernas son el grupo muscular más grande del cuerpo |
| **Peso Muerto (150%+)** | Cadena posterior completa + ventaja de rango de movimiento |

#### 3. Consenso de Entrenadores

Ratios comúnmente aceptados en la industria del entrenamiento de fuerza.

---

### Márgenes de Tolerancia

Los ratios **no son exactos universalmente**. Varían por:

- **Sexo:** Mujeres suelen tener diferentes ratios en tren superior
- **Antropometría:** Brazos largos/cortos afectan la mecánica del movimiento
- **Historial:** Lesiones previas, años de experiencia
- **Especialización:** Powerlifter vs corredor vs atleta de equipo

Por eso Athletera marca **deficiencia** solo con desviación **≤ -15%**, dejando margen para variación individual.

---

### Referencias Bibliográficas

1. Epley, B. (1985). *Tonage figures in the bench press and squat*.
2. NSCA. (2021). *Essentials of Strength Training and Conditioning* (4th ed.).
3. Rippetoe, M. (2011). *Starting Strength* (3rd ed.).
4. Strength Level. (2024). *Strength Standards Database*. https://strengthlevel.com
5. PowerliftingToWin. (2024). *Powerlifting Standards*. https://powerliftingtowin.com

---

---

## Matriz de Estándares de Fuerza por Nivel

### Visión General

Athletera ahora evalúa no solo el **balance muscular** sino también el **nivel de fuerza absoluto** de cada ejercicio, permitiendo diagnósticos como:

> *"Estás en nivel **Intermedio** en Press de Banca, pero **Principiante** en Press Militar"*

### Matriz Completa

| Ejercicio | Principiante | Intermedio | Avanzado | Élite | Función Anatómica |
|---|---:|---:|---:|---:|---|
| **Press de Banca** | 0.8× BW | 1.2× BW | 1.5× BW | 1.8× BW | Empuje Horizontal (Pivote) |
| **Press Militar** | 0.4× BW | 0.72× BW | 1.125× BW | 1.35× BW | Empuje Vertical |
| **Remo con Barra** | 0.48× BW | 0.9× BW | 1.35× BW | 1.62× BW | Tracción Horizontal |
| **Dominadas Lastradas** | 0.8× BW | 1.0× BW | 1.2× BW | 1.5× BW | Tracción Vertical |
| **Sentadilla** | 0.8× BW | 1.2× BW | 1.6× BW | 2.0× BW | Cadena Anterior |
| **Peso Muerto** | 0.96× BW | 1.44× BW | 2.0× BW | 2.4× BW | Cadena Posterior |

*BW = Peso Corporal (Body Weight)*

### Cálculo del Nivel

```typescript
function determineStrengthLevel(oneRM, bodyWeightKg, exerciseId) {
  const ratio = oneRM / bodyWeightKg;
  const standard = STRENGTH_STANDARDS[exerciseId].standard;
  
  if (ratio >= standard.elite) return 'elite';
  if (ratio >= standard.advanced) return 'advanced';
  if (ratio >= standard.intermediate) return 'intermediate';
  return 'novice';
}
```

### Barra de Progreso

Cada ejercicio muestra una barra de progreso hacia el **siguiente nivel**:

```
Principiante [████████░░] 80% → Intermedio
```

Esto motiva al usuario mostrando cuánto falta para alcanzar el próximo hito.

### Fuentes

- **Strength Level** (strengthlevel.com) — Base de datos crowdsourced
- **Starting Strength** (Rippetoe) — Progresiones documentadas
- **NSCA Standards** — Certificación de entrenadores

---

## Ejercicios de Salud Estructural (Accesorios)

### ¿Por qué son importantes?

Además de los 6 ejercicios principales, Athletera incluye **3 ejercicios accesorios** que detectan desequilibrios que pueden llevar a lesiones:

| Ejercicio | Ratio Ideal | Umbral Crítico | Propósito |
|---|---:|---:|---|
| **Dips (Fondos)** | 110-120% del Bench | < 100% | Tríceps + hombro inferior |
| **Press Francés** | ~20% del Bench | < 15% | Aislamiento de tríceps |
| **Face Pull** | 10% del Bench (15 reps) | < 10 reps | **Resistencia** manguito rotador |

### Dips (Fondos en Paralelas)

**Ratio esperado:** 110-120% del 1RM de Press de Banca (incluyendo peso corporal).

**Si es menor:** Indica debilidad en tríceps o hombro inferior. El atleta puede tener un press de banca fuerte pero no puede transferir esa fuerza a movimientos de empuje vertical.

**Recomendación:** Fondos asistidos, press cerrado, dips excéntricos.

### Press Francés / Extensión de Tríceps

**Ratio esperado:** ~20% del 1RM de Press de Banca para series de 10 reps.

**Si es menor:** El tríceps está limitando el press de banca. Es común que el pecho sea fuerte pero el tríceps falle primero.

**Recomendación:** Press francés, extensiones en polea, press cerrado.

### Face Pull (Test de Resistencia)

**Protocolo:** 15 repeticiones con 10% del 1RM de Press de Banca.

**Manejo especial:** Este ejercicio **NO usa 1RM**. Es un test de **resistencia muscular** para el manguito rotador.

**Si no pasa (CRÍTICO):** 
- Menos de 15 reps con 10% del bench
- → **ALERTA DE LESIÓN**: El manguito rotador está débil
- → Alto riesgo de lesiones de hombro en presses

**Recomendación:** Face pulls diarios, rotaciones externas, trabajo de escapulares.

### Integración en el Análisis Cross-Ejercicio

Los ejercicios accesorios se incluyen en el análisis de desequilibrio **Empuje vs Tracción**:

- **Push:** Bench, Overhead Press, Dips, Tricep Extension
- **Pull:** Row, Weighted Pull-up, Face Pull

Si hay una diferencia de **≥ 2 niveles** entre push y pull → **ALERTA CRÍTICA DE SALUD ARTICULAR**.
