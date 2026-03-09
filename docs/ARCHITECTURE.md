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
