# Especificación del Proyecto: Athletera (Athlete Balance Evaluator)

## 1. Visión General

Una herramienta de diagnóstico para atletas que identifica desequilibrios de fuerza y deficiencias musculares comparando el rendimiento en ejercicios clave. El sistema calcula la Fuerza Máxima Estimada (1RM) y la contrasta con:

1. **Ratios de balance** (ej: Press Militar = 60-65% del Bench)
2. **Estándares de fuerza por nivel** (ej: Intermedio = 1.2× peso corporal)

## 2. Entidades Principales

### Athlete (Atleta)
- **ID:** Identificador único.
- **Categoría:** (Powerlifting, Fútbol, General Fitness, Running).
- **Peso Corporal:** (kg) — **Requerido para cálculo de nivel de fuerza**.
- **Nivel:** (Principiante, Intermedio, Avanzado).

### Exercise Metric (Métrica de Ejercicio)
- **Ejercicio:** (Ej: Press de Banca, Sentadilla, Press Militar, Dominadas Lastradas).
- **Peso Levantado:** (kg).
- **Repeticiones:** Cantidad realizada al fallo técnico.
- **1RM Estimado:** Valor calculado (fórmula de Epley).

### Assessment (Evaluación)
- **Ejercicio Base (Pivot):** Press de Banca (100%).
- **Diferencial:** Porcentaje de desviación respecto al ratio ideal.
- **Estado:** (Óptimo, Deficiencia Leve, Deficiencia Crítica).
- **Nivel de Fuerza:** (Novice, Intermediate, Advanced, Elite).
- **Progreso:** Porcentaje hacia el próximo nivel.

## 3. Lógica de Negocio y Algoritmos

### 3.1 Cálculo de 1RM (Fórmula de Epley)

$$
1RM = P \times \left(1 + \frac{n}{30}\right)
$$

Donde $P$ es el peso y $n$ es el número de repeticiones.

### 3.2 Tabla de Ratios de Balance (Base: Press de Banca = 100%)

| Ejercicio | Ratio Ideal | Propósito |
|---|---:|---|
| Press Militar | 60% - 65% | Salud del hombro y empuje vertical |
| Remo con Barra / Dominadas | 75% - 80% | Equilibrio de la cadena posterior |
| Sentadilla | 120% - 140% | Equilibrio tren superior/inferior |
| Peso Muerto | 150%+ | Fuerza estructural total |

### 3.3 Matriz de Estándares de Fuerza por Nivel

| Ejercicio | Novice | Intermediate | Advanced | Elite |
|---|---:|---:|---:|---:|
| Press de Banca | 0.8× BW | 1.2× BW | 1.5× BW | 1.8× BW |
| Press Militar | 0.4× BW | 0.72× BW | 1.125× BW | 1.35× BW |
| Remo con Barra | 0.48× BW | 0.9× BW | 1.35× BW | 1.62× BW |
| Dominadas Lastradas | 0.8× BW | 1.0× BW | 1.2× BW | 1.5× BW |
| Sentadilla | 0.8× BW | 1.2× BW | 1.6× BW | 2.0× BW |
| Peso Muerto | 0.96× BW | 1.44× BW | 2.0× BW | 2.4× BW |

### 3.4 Algoritmo de Diagnóstico

1. Calcular 1RM de todos los ejercicios ingresados.
2. **Si hay peso corporal:** Calcular nivel de fuerza para cada ejercicio.
3. Normalizar los valores tomando el ejercicio base como el 100%.
4. Calcular la desviación vs. ratio ideal.
5. Si la desviación es menor a -15%, marcar como **Deficiencia**.
6. Generar recomendación basada en:
   - Estado del balance (óptimo/advertencia/crítico)
   - Nivel de fuerza (novice/intermediate/advanced/elite)
   - Ejercicio específico

## 4. Requisitos Funcionales (MVP)

- **RF1:** El usuario debe poder seleccionar su perfil de atleta.
- **RF2:** El usuario debe ingresar su peso corporal para ver el nivel de fuerza.
- **RF3:** El usuario debe ingresar al menos dos ejercicios para generar una comparación.
- **RF4:** El sistema debe mostrar un gráfico visual comparando el perfil actual vs. el perfil ideal.
- **RF5:** Generar una recomendación textual basada en la deficiencia detectada Y el nivel de fuerza.
- **RF6:** Mostrar barra de progreso hacia el próximo nivel de fuerza.

## 5. Especificación de Datos

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
  percentageEfficiency: number;
  status: 'optimal' | 'warning' | 'critical';
  recommendation: string;
  strengthLevel?: 'novice' | 'intermediate' | 'advanced' | 'elite';
  levelProgress?: number; // 0-100
}
```

## 6. Adaptabilidad por Deporte (Future Scope)

- **Fútbol:** Ratio Isquios/Cuádriceps (H:Q Ratio) > 60%.
- **Running:** Simetría de impacto lateral (Desviación máxima 2%).
- **Crossfit:** Ratio de Potencia (Clean) vs Resistencia (Milla).
