# ADR-0003: Hook Monolitico como Orquestador de Estado

- **Estado:** Aceptada
- **Fecha:** 2026-03-09
- **Contexto:** Definir la estrategia de gestion de estado de la aplicacion.

---

## Contexto

Athletera necesita gestionar estado de aplicacion (perfil del atleta, metricas de ejercicio, modo de visualizacion, nivel objetivo) y derivar multiples valores calculados (resultados, alertas, diagnostico, Ghost Profile). La pregunta es como organizar esta logica de estado.

## Decision

Se centraliza todo el estado y la logica derivada en un **unico hook personalizado** (`useStrengthLogic`). Este hook:

1. Posee cuatro valores de estado primario via `useState`: profile, metrics, viewMode, targetLevel.
2. Deriva todos los valores calculados via `useMemo`: pivot1RM, errors, results, ghostProfile, crossExerciseAlerts, diagnosticCard.
3. Expone funciones de mutacion: updateProfile, updateMetric, addMetric, removeMetric, setViewMode, setTargetLevel.
4. Maneja la persistencia a LocalStorage via `useEffect`.

No se usa Redux, Zustand, Jotai, Context API ni ninguna libreria de gestion de estado externa.

## Alternativas Evaluadas

### 1. React Context API

**Ventajas:**
- Permite acceso al estado desde cualquier componente sin prop drilling.
- Patron nativo de React.

**Desventajas:**
- Causa re-renders innecesarios si no se segmenta cuidadosamente.
- Agrega complejidad (Provider, Consumer, useContext).
- Innecesario cuando hay un solo punto de consumo (App.tsx).

### 2. Zustand / Jotai / Redux Toolkit

**Ventajas:**
- Gestion de estado sofisticada con selectores, middleware, devtools.
- Mejor rendimiento en apps complejas.
- Facilita testing del estado aislado.

**Desventajas:**
- Dependencia adicional.
- Overhead conceptual para un sistema con solo 4 valores de estado.
- La complejidad no se justifica para el tamano actual de la aplicacion.

### 3. Hook monolitico (seleccionado)

**Ventajas:**
- Cero dependencias adicionales.
- Todo el estado y su logica derivada en un solo lugar, facil de razonar.
- Los calculos costosos se optimizan con `useMemo`.
- Las funciones puras de calculo viven separadas en `calculators.ts`, testeables sin React.
- Un solo punto de persistencia (un `useEffect` que serializa todo a LocalStorage).

**Desventajas:**
- Si la aplicacion crece significativamente, el hook se convierte en un punto de congestion.
- No se puede consumir estado parcial desde componentes profundos sin pasar props.
- Todas las mutaciones de estado pasan por App.tsx y bajan como props.

## Consecuencias

### Positivas
- La separacion entre logica pura (`calculators.ts`) y orquestacion de estado (`useStrengthLogic`) permite testear el 100% de la logica de dominio en entorno Node, sin React ni DOM.
- Los componentes son puramente presentacionales: reciben datos y callbacks, no contienen logica de calculo.
- La persistencia es atomica: cada cambio guarda el estado completo, evitando inconsistencias parciales.

### Riesgos y Mitigacion
- **Riesgo:** Si se agregan mas ejercicios, modos de visualizacion o funcionalidades, el hook crecera en complejidad.
- **Mitigacion:** Cuando el hook supere ~500 lineas o tenga mas de 6 valores de estado primario, considerar extraer sub-hooks especializados (ej: `useMetricsManager`, `useAssessmentEngine`, `usePersistence`) o migrar a Zustand.

### Criterios para Migrar
Se deberia reconsiderar esta decision si:
1. Multiples componentes necesitan acceso directo al estado sin prop drilling de 3+ niveles.
2. El hook supera las 600 lineas.
3. Se necesita middleware (logging, undo/redo, time-travel debugging).
4. Se agregan flujos asinconos (fetch a API, exportacion).

## Notas

Actualmente el hook tiene ~420 lineas, incluyendo funciones auxiliares (`calculateGhostProfile`, `generateDiagnosticCard`, `loadStoredState`, `isStrengthMetric`) que podrian extraerse a archivos separados para mejorar la legibilidad sin cambiar la arquitectura.
