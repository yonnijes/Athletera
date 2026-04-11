# Arquitectura de Athletera

## Vision General

Athletera es una PWA client-only (sin backend) que diagnostica desequilibrios de fuerza muscular. Toda la logica, almacenamiento y renderizado ocurren en el navegador del usuario. La arquitectura sigue tres principios: separacion estricta entre logica pura y presentacion, estado centralizado en un unico hook, y persistencia local automatica.

Para las decisiones arquitectonicas detalladas, ver:
- [ADR-0001: Uso de Formula de Epley](./ADR/0001-uso-de-epley.md)
- [ADR-0002: Arquitectura Client-Only PWA](./ADR/0002-client-only-pwa.md)
- [ADR-0003: Hook Monolitico como Orquestador](./ADR/0003-hook-monolitico.md)

---

## Diagrama de Flujo de Datos

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Usuario    │ ──> │   Input UI   │ ──> │  Validacion  │
│  ingresa     │     │  (Exercise   │     │  (peso > 0,  │
│  datos       │     │   Form)      │     │   reps > 0)  │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                v
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   UI         │ <── │  Diagnostico │ <── │  Calculo     │
│  (Radar +    │     │  (estado,    │     │  1RM Epley   │
│   Results)   │     │   recomend.) │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                v
                                          ┌──────────────┐
                                          │  Comparacion │
                                          │  vs Ratios   │
                                          │  Ideales     │
                                          └──────────────┘
                                                │
                                                v
                                          ┌──────────────┐
                                          │  Persistencia│
                                          │  LocalStorage│
                                          └──────────────┘
```

---

## Pipeline de Estado Reactivo

El estado de la aplicacion sigue un flujo unidireccional gestionado por el hook central:

```
Estado Primario (useState)          Estado Derivado (useMemo)
─────────────────────────           ────────────────────────
profile ─────────────────────┐
metrics ─────────────────────┼──> pivot1RM
                             ├──> errors
                             ├──> results (assessMetrics)
                             ├──> crossExerciseAlerts
                             ├──> diagnosticCard
viewMode ────────────────────┤
targetLevel ─────────────────┼──> ghostProfile
                             │
                             └──> useEffect ──> LocalStorage
```

**4 valores primarios** generan **6 valores derivados** y **1 efecto lateral** (persistencia). Cada cambio en un valor primario recalcula automaticamente todos los derivados que dependen de el.

---

## Separacion Logica / Presentacion

La arquitectura divide el codigo en tres capas:

### Capa 1: Funciones Puras (utils/calculators.ts)

Funciones sin efectos secundarios que implementan toda la logica de dominio: estimacion de 1RM, calculo de ratios, clasificacion de estado, deteccion de desequilibrios, generacion de recomendaciones. Testeables en entorno Node sin React ni DOM.

### Capa 2: Orquestacion de Estado (hooks/useStrengthLogic.ts)

Un unico hook que posee el estado, lo persiste, y deriva todos los valores calculados usando las funciones puras de la capa 1. Tambien contiene funciones auxiliares que no son puras (generateDiagnosticCard, calculateGhostProfile) porque dependen del estado.

### Capa 3: Presentacion (components/*.tsx)

Componentes React puramente presentacionales. Reciben datos procesados y callbacks via props. No contienen logica de calculo, validacion ni gestion de estado. Cada componente tiene una responsabilidad unica:

| Componente | Responsabilidad |
|---|---|
| AthleteProfileForm | Captura de categoria deportiva y peso corporal |
| ExerciseForm | Captura de metricas por ejercicio (peso, reps, implemento) |
| ViewModeToggle | Seleccion de modo simple/comparativo y nivel objetivo |
| RadarChart | Visualizacion radar con ideal, actual y ghost profile |
| ResultsSummary | Tarjetas de resultado por ejercicio con alertas cross-exercise |
| DiagnosticCard | Diagnostico narrativo con riesgos y acciones |

---

## Mapa de Componentes

```
App.tsx (orquestador)
  │
  ├── useStrengthLogic() ──> Estado completo de la aplicacion
  │
  ├── DiagnosticCard ──────> Diagnostico narrativo (si aplica)
  ├── ViewModeToggle ──────> Simple / Comparativo + nivel objetivo
  ├── AthleteProfileForm ──> Categoria + peso corporal
  ├── ExerciseForm ────────> N metricas de ejercicio
  ├── [Errores] ───────────> Lista de errores de validacion
  ├── RadarChart ──────────> Grafico con ideal + actual + ghost
  └── ResultsSummary ──────> Resultados por ejercicio + alertas
```

App.tsx actua como "thin controller": invoca el hook, desestructura sus ~15 valores de retorno, y los distribuye a los componentes como props. No contiene logica propia.

---

## Persistencia

- **Mecanismo:** LocalStorage del navegador.
- **Clave:** `athletera:strength-state:v2`
- **Formato:** JSON serializado con estructura `{ profile, metrics, viewMode, targetLevel }`.
- **Escritura:** Cada cambio en estado primario dispara serializacion completa (atomica).
- **Lectura:** Al inicializar, se deserializa y valida con type guards. Datos invalidos se descartan silenciosamente con fallback a defaults.
- **Alcance:** Solo navegador del usuario. No se envia a servidor.

---

## PWA y Offline

- **Plugin:** `vite-plugin-pwa` con estrategia `autoUpdate`.
- **Workbox:** Cache CacheFirst para JS, CSS, HTML, PNG, SVG y Google Fonts.
- **Registro:** Service worker se registra con `immediate: true` al cargar la app.
- **Manifiesto:** Standalone, portrait, tema `#0ea5e9`, fondo `#0f172a`.
- **Actualizacion:** Automatica en segundo plano. Se activa en la siguiente navegacion.

---

## Lógica de Ratios (Tabla de Referencia)

**Base: Press de Banca = 100%**

| Ejercicio | Ratio Ideal | Proposito |
|---|---:|---|
| Press Militar | 60% - 65% | Salud del hombro y empuje vertical |
| Remo con Barra | 75% - 80% | Equilibrio cadena posterior |
| Dominadas Lastradas | 75% - 80% | Fuerza de traccion vertical |
| Sentadilla | 120% - 140% | Equilibrio tren superior/inferior |
| Peso Muerto | 150%+ | Fuerza estructural total |
| Dips | 110% - 120% | Triceps y hombro inferior |
| Extension de Triceps | 18% - 22% | Aislamiento de triceps |
| Face Pull | 8% - 12% | Resistencia del manguito rotador |

Para la tabla completa de estandares por nivel, ver [STANDARDS_MATRIX.md](./STANDARDS_MATRIX.md).

### Formula de Epley

```
1RM = peso x (1 + reps / 30)
```

Ejemplo: 80 kg x 8 reps = 80 x (1 + 8/30) = **101.33 kg**

Para la especificacion completa de algoritmos, ver [ALGORITHMS.md](./ALGORITHMS.md).

---

## Calculo de Eficiencia

```
1. Calcular 1RM de cada ejercicio (Epley, con ajustes de implemento/autocarga)
2. Normalizar: ratioActual = 1RM_ejercicio / 1RM_bench
3. Comparar: eficiencia = (ratioActual / ratioIdeal) x 100
4. Clasificar:
   - Optimo:      desviacion >= -5%
   - Advertencia:  -15% < desviacion < -5%
   - Critico:     desviacion <= -15%
```

---

## Ejercicios de Salud Estructural (Accesorios)

Ademas de los 6 ejercicios principales, el sistema incluye 3 ejercicios accesorios que detectan desequilibrios precursores de lesion:

| Ejercicio | Ratio Ideal | Umbral Critico | Proposito |
|---|---:|---:|---|
| **Dips** | 110-120% del Bench | < 100% | Triceps + hombro inferior |
| **Press Frances** | ~20% del Bench | < 15% | Aislamiento de triceps |
| **Face Pull** | 10% del Bench (15 reps) | < 10 reps | **Resistencia** manguito rotador |

Los ejercicios accesorios se incluyen en el analisis de desequilibrio **Empuje vs Traccion**:

- **Push:** bench_press, overhead_press, dips, tricep_extension
- **Pull:** barbell_row, weighted_pull_up, face_pull

Si hay una diferencia de **>= 2 niveles** entre push y pull, se genera una **ALERTA CRITICA DE SALUD ARTICULAR**.

---

## Referencias

1. Epley, B. (1985). *Tonage figures in the bench press and squat*.
2. NSCA. (2021). *Essentials of Strength Training and Conditioning* (4th ed.).
3. Rippetoe, M. (2011). *Starting Strength* (3rd ed.).
4. Strength Level. (2024). *Strength Standards Database*. https://strengthlevel.com
5. PowerliftingToWin. (2024). *Powerlifting Standards*. https://powerliftingtowin.com
