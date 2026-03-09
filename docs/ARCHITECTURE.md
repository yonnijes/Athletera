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
