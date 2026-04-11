# Algoritmos: Athletera

Este documento especifica los algoritmos del sistema con suficiente detalle para permitir su reimplementacion en cualquier lenguaje sin consultar el codigo fuente.

---

## 1. Estimacion de 1RM (Formula de Epley)

**Proposito:** Estimar la fuerza maxima que un atleta puede levantar en una sola repeticion a partir de un set submaximal.

**Precondiciones:**
- `peso` > 0 (numero finito)
- `reps` > 0 (numero finito)

**Formula:**
```
1RM = peso x (1 + reps / 30)
```

**Postcondiciones:**
- Resultado redondeado a 2 decimales.
- Siempre mayor que el peso de entrada.

**Ejemplo:**
- 80 kg x 8 reps = 80 x (1 + 8/30) = 80 x 1.2667 = **101.33 kg**

**Precision:** Epley es precisa en el rango de 3-12 repeticiones. Por debajo de 3, el peso ya esta cerca del 1RM real. Por encima de 12, la resistencia muscular influye mas que la fuerza maxima y la estimacion pierde fiabilidad.

**Justificacion:** Ver ADR-0001 para la decision de usar Epley sobre alternativas.

---

## 2. Ajuste de Peso por Contexto

Antes de aplicar Epley, el peso bruto ingresado se ajusta segun dos reglas:

### 2.1 Ajuste por Implemento (Mancuerna)

**Aplica a:** Todos los ejercicios excepto los de autocarga (dominadas, dips) y face pull.

**Formula:**
```
peso_ajustado = peso_ingresado x 2 x 0.9
```

**Justificacion:** El usuario ingresa el peso de una mancuerna (por lado). Se multiplica por 2 para obtener la carga total. El factor 0.9 (reduccion del 10%) compensa la mayor demanda de estabilizacion con mancuernas respecto a barra, que reduce la fuerza neta transferible.

**Ejemplo:**
- 20 kg por mancuerna: 20 x 2 x 0.9 = **36 kg efectivos**

### 2.2 Ajuste por Autocarga (Ejercicios con Peso Corporal)

**Aplica a:** Dominadas Lastradas y Dips.

**Formula:**
```
peso_total = peso_corporal + lastre_ingresado
```

**Precondiciones:**
- Solo se aplica si `peso_corporal` esta disponible y es > 0.
- Si no hay peso corporal, se usa solo el lastre (fallback degradado).

**Justificacion:** En dominadas y dips, los musculos mueven el peso corporal completo mas cualquier lastre adicional. Ignorar el peso corporal subestimaria dramaticamente la fuerza real del atleta.

**Ejemplo:**
- Atleta de 75 kg con 25 kg de lastre: peso_total = 75 + 25 = **100 kg**
- 1RM = 100 x (1 + 5/30) = **116.67 kg**

---

## 3. Calculo de Ratio Actual vs Pivote

**Proposito:** Normalizar el rendimiento de cada ejercicio relativo al Press de Banca (pivote).

**Precondiciones:**
- `1RM_pivote` > 0

**Formula:**
```
ratio_actual = 1RM_ejercicio / 1RM_pivote
```

**Ejemplo:**
- Press Militar 1RM = 76 kg, Banca 1RM = 133.33 kg
- ratio_actual = 76 / 133.33 = **0.57**

---

## 4. Calculo de Ratio Ideal (Punto Medio)

**Proposito:** Obtener un valor unico de referencia a partir del rango ideal de cada ejercicio.

**Formula:**
```
ratio_ideal = (rango_min + rango_max) / 2
```

**Rangos ideales por ejercicio:**

| Ejercicio | Min | Max | Punto Medio |
|---|---:|---:|---:|
| Press Militar | 0.60 | 0.65 | 0.625 |
| Remo con Barra | 0.75 | 0.80 | 0.775 |
| Dominadas Lastradas | 0.75 | 0.80 | 0.775 |
| Sentadilla | 1.20 | 1.40 | 1.300 |
| Peso Muerto | 1.50 | 1.80 | 1.650 |
| Dips | 1.10 | 1.20 | 1.150 |
| Extension de Triceps | 0.18 | 0.22 | 0.200 |
| Face Pull | 0.08 | 0.12 | 0.100 |

**Nota:** El Press de Banca no tiene ratio ideal porque es el pivote (siempre 100%).

---

## 5. Calculo de Desviacion Porcentual

**Proposito:** Cuantificar que tan lejos esta el atleta del ideal.

**Precondiciones:**
- `ratio_ideal` > 0

**Formula:**
```
desviacion_pct = ((ratio_actual - ratio_ideal) / ratio_ideal) x 100
```

**Interpretacion:**
- Valores positivos: el atleta supera el ideal.
- Valores negativos: el atleta esta por debajo del ideal.
- Cero: coincidencia perfecta.

---

## 6. Clasificacion de Estado

**Proposito:** Asignar un estado cualitativo al resultado.

**Reglas (evaluadas en orden):**
```
Si desviacion_pct <= -15  => "critico"
Si desviacion_pct <  -5   => "advertencia"
En otro caso               => "optimo"
```

**Nota critica:** El umbral -5 no incluye el valor exacto -5. Es decir, -5.0 es "optimo", -5.01 es "advertencia". Esto otorga un margen de tolerancia generoso que reconoce la variacion individual.

---

## 7. Calculo de Eficiencia

**Proposito:** Expresar el rendimiento como porcentaje del ideal.

**Formula:**
```
eficiencia = (ratio_actual / ratio_ideal) x 100
```

**Ejemplo:**
- ratio_actual = 0.57, ratio_ideal = 0.625
- eficiencia = (0.57 / 0.625) x 100 = **91.2%**

---

## 8. Determinacion de Nivel de Fuerza

**Proposito:** Clasificar al atleta en un nivel absoluto basado en estandares poblacionales.

**Precondiciones:**
- `peso_corporal` > 0

**Paso 1: Calcular fuerza relativa**
```
fuerza_relativa = 1RM / peso_corporal
```

**Paso 2: Comparar contra umbrales del ejercicio**

Los umbrales estan definidos en la Matriz de Estandares (ver STANDARDS_MATRIX.md). Se evaluan de mayor a menor:

```
Si fuerza_relativa >= umbral_avanzado   => nivel = "avanzado"
Si fuerza_relativa >= umbral_intermedio => nivel = "intermedio"
Si fuerza_relativa >= umbral_principiante => nivel = "principiante"
En otro caso => nivel = "principiante" (por debajo del umbral)
```

**Paso 3: Calcular progreso hacia el siguiente nivel**

```
progreso = ((fuerza_relativa - umbral_nivel_actual) / (umbral_siguiente_nivel - umbral_nivel_actual)) x 100
```

Si el atleta esta por debajo del nivel principiante:
```
progreso = (fuerza_relativa / umbral_principiante) x 100
```

Si el atleta esta en el nivel mas alto (avanzado en el sistema de 3 niveles):
```
progreso = min(100, ((fuerza_relativa - umbral_avanzado) / umbral_avanzado) x 100)
```

---

## 9. Evaluacion de Face Pull (Test de Resistencia)

**Proposito:** El Face Pull no se evalua por 1RM sino por capacidad de resistencia del manguito rotador.

**Protocolo:**
- Peso de test: 10% del 1RM de Press de Banca.
- Repeticiones objetivo: 15.

**Algoritmo:**
```
porcentaje_real = peso_face_pull / 1RM_banca
paso = (reps >= 15) Y (porcentaje_real >= 0.10)

Si NO paso:
  estado = "critico" (override)
  recomendacion = mensaje especifico sobre manguito rotador
Si paso:
  se evalua normalmente como cualquier otro ejercicio
```

**Nota:** Aunque el Face Pull falle el test de resistencia, el sistema tambien calcula su 1RM equivalente (via Epley) para poder incluirlo en el grafico radar y en los calculos de ratio.

---

## 10. Deteccion de Desequilibrio Cross-Ejercicio

**Proposito:** Identificar descompensaciones peligrosas entre familias de movimiento antagonistas.

**Clasificacion de ejercicios:**
- **Empuje (Push):** bench_press, overhead_press, dips, tricep_extension
- **Traccion (Pull):** barbell_row, weighted_pull_up, face_pull

**Algoritmo:**

```
Para cada ejercicio_push en resultados_push:
  Para cada ejercicio_pull en resultados_pull:
    Si ambos tienen nivel_de_fuerza:
      diferencia = nivel_numerico(push) - nivel_numerico(pull)

      Si diferencia >= 2:
        Generar alerta CRITICA
      Si diferencia == 1:
        Generar alerta ADVERTENCIA
```

**Conversion de nivel a numero:**
```
principiante/novato = 0
intermedio = 1
avanzado = 2
elite = 3
```

**Ejemplo:**
- Banca nivel "avanzado" (2), Dominadas nivel "principiante" (0)
- Diferencia = 2 - 0 = 2 => ALERTA CRITICA

**Nota:** La deteccion es asimetrica. Solo alerta cuando el empuje supera a la traccion, no al reves. Un atleta con traccion fuerte y empuje debil no genera alerta de salud articular porque ese desequilibrio no tiene las mismas implicaciones biomecanicas.

---

## 11. Deteccion de Desequilibrio Escapular

**Proposito:** Detectar cuando la fuerza de traccion es significativamente menor que la de empuje en terminos de 1RM absoluto.

**Formula:**
```
ratio = 1RM_pull / 1RM_push
desviacion = (ratio - 1) x 100

Si desviacion <= -20 => hay desequilibrio escapular
```

**Nota:** Esta funcion existe en el codigo pero actualmente no se invoca en el flujo principal. Esta disponible como utilidad para futuras funcionalidades.

---

## 12. Generacion de Ghost Profile

**Proposito:** Proyectar los 1RM necesarios para alcanzar un nivel objetivo.

**Precondiciones:**
- `peso_corporal` > 0
- Modo comparativo activo

**Algoritmo:**

```
Para cada metrica:
  1RM_actual = Epley(peso, reps)
  1RM_objetivo = peso_corporal x multiplicador_del_nivel_objetivo
  brecha_kg = 1RM_objetivo - 1RM_actual
  brecha_pct = (brecha_kg / 1RM_actual) x 100

  Retornar { ejercicio, 1RM_objetivo, 1RM_actual, brecha_kg, brecha_pct }
```

**Nota:** El Ghost Profile se calcula para TODOS los ejercicios activos, incluyendo el pivote, usando los multiplicadores del sistema de 3 niveles (BW_STANDARDS). Para el nivel "elite", se usa el multiplicador de "avanzado" como techo.

---

## 13. Generacion de Diagnostico Narrativo

**Proposito:** Sintetizar el analisis completo en un diagnostico de alto nivel comprensible para el atleta.

**Algoritmo (reglas priorizadas, la primera que aplique gana):**

1. **Si hay alerta critica cross-ejercicio:** Generar diagnostico critico con riesgos de lesion articular (manguito rotador, postura cifotica, dolor cervical, desequilibrio escapular) y acciones especificas (ratio 2:1 traccion/empuje, face pulls diarios, reducir volumen de press).

2. **Si la diferencia entre el ejercicio mas fuerte y el mas debil es >= 2 niveles:** Generar diagnostico critico sobre desequilibrio muscular general con acciones de priorizacion del ejercicio debil.

3. **Si hay 2+ resultados criticos:** Generar diagnostico de advertencia sobre deficiencias multiples con acciones de reduccion de intensidad y enfoque en tecnica.

4. **Si todos los resultados son optimos:** Generar diagnostico informativo positivo felicitando el balance muscular.

5. **Si ninguna condicion aplica:** No generar diagnostico (retornar null).

---

## 14. Generacion de Recomendaciones por Ejercicio

**Proposito:** Proveer consejo textual especifico combinando el estado del ejercicio con el nivel de fuerza.

**Algoritmo:**

```
Si estado == "optimo":
  Si nivel == "avanzado" o "elite":
    "Considera competir o especializarte."
  En otro caso:
    "Mantener progresion y tecnica actual."

Si estado == "advertencia" o "critico":
  consejo_nivel = tabla_consejos_por_nivel[nivel]
  consejo_ejercicio = tabla_consejos_por_ejercicio[ejercicio]  // puede ser null

  Si hay consejo_ejercicio:
    Retornar consejo_nivel + " " + consejo_ejercicio
  En otro caso:
    Retornar consejo_nivel
```

**Tabla de consejos por nivel:**

| Nivel | Consejo |
|---|---|
| Principiante/Novato | Enfocarse en tecnica y consistencia antes de aumentar carga. |
| Intermedio | Priorizar sobrecarga progresiva en este patron. |
| Avanzado | Revisar periodizacion y recuperacion especifica. |
| Elite | Mantener picos de fuerza y prevenir sobreentrenamiento. |

**Tabla de consejos por ejercicio (solo para deficit):**

| Ejercicio | Consejo Especifico |
|---|---|
| Press Militar | Aumentar trabajo de hombro/estabilidad escapular (Face Pulls, Press Arnold). |
| Remo con Barra | Priorizar traccion horizontal (remo con pausa, control excentrico). |
| Dominadas | Mejorar traccion vertical (dominadas estrictas y trabajo de dorsales). |
| Sentadilla | Elevar fuerza de tren inferior (sentadilla frontal, tempo squats). |
| Peso Muerto | Reforzar cadena posterior (RDL, hip thrust, bisagra tecnica). |
| Dips | Fortalecer triceps y hombro inferior (fondos asistidos, press cerrado). |
| Extension Triceps | El triceps puede estar limitando tu press. Aislar con press frances y extensiones. |
| Face Pull | CRITICO: Mejorar resistencia del manguito rotador para prevenir lesiones de hombro. |

---

## 15. Pipeline Completo de Evaluacion

El flujo completo que ejecuta el sistema para cada conjunto de metricas:

```
1. Validar que existe metrica de banca (pivote)
2. Validar que hay al menos 2 metricas
3. Calcular 1RM del pivote via Epley

Para cada metrica (excepto pivote):
  4. Determinar tipo de ejercicio:
     - Si es endurance (face_pull): evaluar test de resistencia
     - Si es autocarga (dominadas, dips) Y hay peso corporal: sumar BW
     - Si es mancuerna: aplicar x2 * 0.9
  5. Calcular 1RM ajustado via Epley
  6. Calcular ratio actual vs pivote
  7. Obtener ratio ideal (punto medio del rango)
  8. Calcular desviacion porcentual
  9. Clasificar estado (optimo/advertencia/critico)
  10. Si hay peso corporal:
      a. Calcular fuerza relativa (1RM / BW)
      b. Determinar nivel de fuerza
      c. Calcular progreso hacia siguiente nivel
  11. Generar recomendacion textual
  12. Obtener patron de movimiento

Post-procesamiento:
  13. Detectar alertas cross-ejercicio (si hay BW)
  14. Generar diagnostico narrativo
  15. Calcular Ghost Profile (si modo comparativo activo)
```
