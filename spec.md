# Especificación del Proyecto: Athletera (Athlete Balance Evaluator)

## 1. Visión General

Una herramienta de diagnóstico para atletas que identifica desequilibrios de fuerza y deficiencias musculares comparando el rendimiento en ejercicios clave. El sistema calcula la Fuerza Máxima Estimada (1RM) y la contrasta con ratios estándar de la industria para ofrecer recomendaciones de entrenamiento.

## 2. Entidades Principales

### Athlete (Atleta)
- **ID:** Identificador único.
- **Categoría:** (Powerlifting, Fútbol, General Fitness, Running).
- **Peso Corporal:** (kg).
- **Nivel:** (Principiante, Intermedio, Avanzado).

### Exercise Metric (Métrica de Ejercicio)
- **Ejercicio:** (Ej: Press de Banca, Sentadilla, Press Militar, Dominadas Lastradas).
- **Peso Levantado:** (kg).
- **Repeticiones:** Cantidad realizada al fallo técnico.
- **1RM Estimado:** Valor calculado.

### Assessment (Evaluación)
- **Ejercicio Base (Pivot):** El ejercicio que sirve como 100% (usualmente Press de Banca para tren superior).
- **Diferencial:** Porcentaje de desviación respecto al ratio ideal.
- **Estado:** (Óptimo, Deficiencia Leve, Deficiencia Crítica).

## 3. Lógica de Negocio y Algoritmos

### 3.1 Cálculo de 1RM (Fórmula de Epley)

Para estandarizar las comparaciones, todos los inputs de peso/reps deben convertirse a un 1RM estimado:

$$
1RM = P \times \left(1 + \frac{n}{30}\right)
$$

Donde $P$ es el peso y $n$ es el número de repeticiones.

### 3.2 Tabla de Ratios de Referencia (Base: Press de Banca = 100%)

| Ejercicio Comparado | Ratio Ideal (%) | Propósito |
|---|---:|---|
| Press Militar | 60% - 65% | Salud del hombro y empuje vertical. |
| Remo con Barra / Dominadas | 75% - 80% | Equilibrio de la cadena posterior. |
| Sentadilla | 120% - 140% | Equilibrio tren superior/inferior. |
| Peso Muerto | 150%+ | Fuerza estructural total. |

### 3.3 Algoritmo de Diagnóstico

1. Calcular 1RM de todos los ejercicios ingresados.
2. Normalizar los valores tomando el ejercicio base como el 100%.
3. Calcular la desviación:

$$
Desviación = \frac{Ratio\ Actual - Ratio\ Ideal}{Ratio\ Ideal} \times 100
$$

4. Si la desviación es menor a -15%, marcar como **Deficiencia**.

## 4. Requisitos Funcionales (MVP)

- **RF1:** El usuario debe poder seleccionar su perfil de atleta.
- **RF2:** El usuario debe ingresar al menos dos ejercicios para generar una comparación.
- **RF3:** El sistema debe mostrar un gráfico visual (ej. gráfico de radar o barras) comparando el perfil actual vs. el perfil ideal.
- **RF4:** Generar una recomendación textual basada en la deficiencia detectada (ej. "Aumentar volumen de tracción vertical").

## 5. Especificación de Datos (Interface Sugerida)

```ts
interface StrengthMetrics {
  exerciseId: string;
  weightKg: number;
  reps: number;
}

interface AssessmentResult {
  exercise: string;
  current1RM: number;
  target1RM: number;
  percentageEfficiency: number; // Ej: 80% del ideal
  status: 'optimal' | 'warning' | 'critical';
  recommendation: string;
}
```

## 6. Adaptabilidad por Deporte (Future Scope)

- **Fútbol:** Ratio Isquios/Cuádriceps (H:Q Ratio) > 60%.
- **Running:** Simetría de impacto lateral (Desviación máxima 2%).
- **Crossfit:** Ratio de Potencia (Clean) vs Resistencia (Milla).
