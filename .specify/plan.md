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
