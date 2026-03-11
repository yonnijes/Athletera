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

#### Fuerza Principal

| Ejercicio | Novice | Intermediate | Advanced | Elite |
|---|---:|---:|---:|---:|
| Press de Banca | 0.8× BW | 1.2× BW | 1.5× BW | 1.8× BW |
| Press Militar | 0.4× BW | 0.72× BW | 1.125× BW | 1.35× BW |
| Remo con Barra | 0.48× BW | 0.9× BW | 1.35× BW | 1.62× BW |
| Dominadas Lastradas | 0.8× BW | 1.0× BW | 1.2× BW | 1.5× BW |
| Sentadilla | 0.8× BW | 1.2× BW | 1.6× BW | 2.0× BW |
| Peso Muerto | 0.96× BW | 1.44× BW | 2.0× BW | 2.4× BW |

#### Salud Estructural (Accesorios)

| Ejercicio | Novice | Intermediate | Advanced | Elite | Propósito |
|---|---:|---:|---:|---:|---|
| Dips (Fondos) | 0.88× BW | 1.32× BW | 1.65× BW | 1.98× BW | Tríceps + hombro inferior |
| Press Francés | 0.16× BW | 0.24× BW | 0.3× BW | 0.36× BW | Aislamiento de tríceps |
| Face Pull* | 0.08× BW | 0.1× BW | 0.12× BW | 0.15× BW | **Resistencia** manguito rotador |

*Face Pull usa test de resistencia: 15 reps con 10% del 1RM de Banca.

### 3.4 Lógica de Clasificación de Niveles

El sistema debe evaluar cada levantamiento individualmente **antes** de compararlos entre sí:

#### Paso 1: Cálculo de Fuerza Relativa
```
Ratio_Relativo = 1RM_Estimado / Peso_Corporal
```

#### Paso 2: Asignación de Nivel por Ejercicio

Cada ejercicio tiene sus propios umbrales. Ejemplo para **Press de Banca**:

| Ratio Relativo | Nivel Asignado |
|----------------|----------------|
| < 0.8 | **Principiante** |
| 0.8 – 1.2 | **Intermedio** |
| 1.2 – 1.5 | **Avanzado** |
| ≥ 1.5 | **Élite** |

*Ver sección 3.3 para umbrales completos por ejercicio.*

#### Paso 3: Análisis de Desequilibrio Cross-Exercise (CRÍTICO)

El sistema debe detectar **descompensaciones peligrosas** incluso cuando el atleta tiene niveles altos:

**Regla de Alerta Crítica:**
> Si la diferencia entre el nivel de un ejercicio de **Empuje** (Banca, Militar) y un ejercicio de **Tracción** (Dominada, Remo) es **≥ 2 niveles**, generar **ALERTA CRÍTICA DE SALUD ARTICULAR**.

**Ejemplo:**
- Press de Banca: **Avanzado** (1.3× BW)
- Dominada Lastrada: **Principiante** (0.6× BW)
- → **ALERTA**: Ratio de tracción/empuje descompensado. Riesgo de lesión de hombro.

**Justificación:** Un atleta fuerte en empuje pero débil en tracción tiene alta probabilidad de desarrollar:
- Desequilibrio escapular
- Lesiones del manguito rotador
- Postura cifótica (hombros hacia adelante)

#### Paso 4: Cálculo de Balance Relativo (Ratio vs Pivote)

Una vez evaluados los niveles individuales:
1. Normalizar los valores tomando el Press de Banca como el 100%.
2. Calcular la desviación vs. ratio ideal (ver sección 3.2).
3. Si la desviación es **≤ -15%**, marcar como **Deficiencia Crítica**.
4. Si la desviación es **entre -15% y -5%**, marcar como **Advertencia**.

#### Paso 5: Generación de Recomendaciones Priorizadas

Las recomendaciones se ordenan por prioridad:

1. **ALERTA CRÍTICA** (Cross-Exercise descompensado ≥ 2 niveles)
2. **Deficiencia Crítica** (Ratio ≤ -15% del ideal)
3. **Advertencia** (Ratio entre -15% y -5%)
4. **Óptimo** (Ratio ≥ -5%)

Cada recomendación incluye:
- Estado del balance
- Nivel de fuerza actual
- Nivel de fuerza objetivo
- Consejo específico del ejercicio
- Progreso hacia el próximo nivel

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
