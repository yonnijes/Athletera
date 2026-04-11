# Modelo de Dominio: Athletera

## Contexto del Dominio

Athletera opera en el dominio de la evaluacion de fuerza deportiva. El problema central es que los atletas desarrollan desequilibrios musculares invisibles al entrenar ejercicios de forma aislada, sin referencia a proporciones biomecanicas saludables. Estos desequilibrios, particularmente entre patrones de empuje y traccion, generan riesgo acumulativo de lesion articular (especialmente en el complejo del hombro) y limitan el rendimiento deportivo global.

El sistema no es un planificador de entrenamiento ni un tracker de progresion. Es una herramienta de **diagnostico puntual** que responde a la pregunta: "dado mi rendimiento actual en ejercicios clave, donde estan mis desequilibrios y que tan fuerte soy en terminos absolutos?"

---

## Entidades del Dominio

### 1. Atleta (AthleteProfile)

El Atleta representa al usuario del sistema con su contexto fisico y deportivo.

**Atributos:**
- **Categoria Deportiva:** Clasifica el contexto de entrenamiento del atleta (powerlifting, futbol, fitness general, running). Actualmente este atributo se captura pero no modifica los calculos; esta reservado para la futura adaptabilidad de ratios por deporte.
- **Nivel Declarado:** Autopercepcion del atleta (principiante, intermedio, avanzado). No afecta los calculos; el nivel real se determina algoritmicamente.
- **Peso Corporal (kg):** Atributo opcional pero critico. Sin el, el sistema solo puede evaluar balance relativo entre ejercicios. Con el, se desbloquean tres capacidades: nivel de fuerza absoluta, deteccion de alertas cross-ejercicio, y modo comparativo con Ghost Profile.

**Invariantes:**
- El peso corporal, si se proporciona, debe ser un numero finito mayor que cero.
- La categoria y el nivel deben pertenecer a conjuntos fijos predefinidos.

**Rol en el dominio:**
El Atleta es el contexto contra el cual se interpretan las metricas. Dos atletas con identicas metricas de ejercicio pero distinto peso corporal recibiran diagnosticos diferentes: 100 kg de 1RM en banca significa nivel avanzado para alguien de 65 kg, pero principiante para alguien de 130 kg.

---

### 2. Metrica de Ejercicio (StrengthMetrics)

La Metrica de Ejercicio es el dato de entrada primario del sistema: una observacion de rendimiento en un ejercicio especifico.

**Atributos:**
- **Ejercicio:** Uno de nueve ejercicios posibles, divididos en dos categorias:
  - **Principales (6):** Press de Banca, Press Militar, Remo con Barra, Dominadas Lastradas, Sentadilla, Peso Muerto.
  - **Accesorios de salud estructural (3):** Dips, Extension de Triceps, Face Pull.
- **Peso (kg):** La carga externa utilizada. Su significado varia segun el ejercicio (ver reglas especiales abajo).
- **Repeticiones:** Cantidad completada al fallo tecnico o cerca del fallo.
- **Implemento:** Barra o mancuerna. Solo aplica a ejercicios que no son de autocarga.

**Invariantes:**
- El peso y las repeticiones deben ser mayores que cero.
- El Press de Banca es obligatorio y no puede removerse (es el ejercicio pivote).
- Debe haber al menos dos metricas para generar una comparacion.
- Un ejercicio no puede aparecer duplicado en la lista de metricas.

**Reglas especiales:**
- **Ejercicios de Autocarga (Dominadas, Dips):** El "peso" ingresado por el usuario es el lastre adicional. El sistema suma automaticamente el peso corporal del atleta para obtener la carga total real. Si no hay peso corporal disponible, se usa solo el lastre (fallback degradado).
- **Implemento Mancuerna:** El peso ingresado es por lado. El sistema multiplica por 2 y aplica un factor de correccion de 0.9 (reduccion del 10%) para compensar la mayor demanda de estabilizacion respecto a la barra.
- **Face Pull:** No se evalua por fuerza maxima sino por test de resistencia (ver Evaluacion).

---

### 3. Evaluacion (AssessmentResult)

La Evaluacion es la entidad derivada que contiene el diagnostico para un ejercicio especifico, resultado de comparar la metrica del atleta contra los estandares del dominio.

**Atributos:**
- **1RM Actual:** Fuerza maxima estimada despues de ajustes (autocarga, implemento).
- **1RM Objetivo:** Lo que deberia levantar segun el ratio ideal respecto al pivote.
- **Eficiencia (%):** Relacion entre el ratio actual y el ideal, expresada como porcentaje.
- **Estado:** Clasificacion tripartita del balance (optimo, advertencia, critico).
- **Recomendacion:** Texto narrativo en espanol con consejo especifico para el ejercicio y nivel.
- **Nivel de Fuerza:** Clasificacion absoluta (principiante/novato, intermedio, avanzado, elite). Solo disponible si el atleta proporciono peso corporal.
- **Progreso:** Porcentaje de avance hacia el siguiente nivel (0-100).
- **Fuerza Relativa:** Ratio 1RM / peso corporal.
- **Patron de Movimiento:** Clasificacion biomecanica (empuje horizontal/vertical, traccion horizontal/vertical, sentadilla, bisagra).

**Invariantes:**
- No se genera evaluacion para el ejercicio pivote (Press de Banca); este solo sirve como referencia.
- El estado se determina exclusivamente por la desviacion porcentual respecto al ratio ideal:
  - **Optimo:** desviacion >= -5%
  - **Advertencia:** desviacion entre -15% y -5% (exclusive)
  - **Critico:** desviacion <= -15%
- El Face Pull usa una regla de evaluacion diferente: falla (critico) si no completa 15 repeticiones con al menos el 10% del 1RM de banca.

---

### 4. Alerta Cross-Ejercicio (CrossExerciseAlert)

La Alerta Cross-Ejercicio es una entidad de diagnostico de segundo orden que emerge de comparar los niveles de fuerza entre familias de ejercicios antagonistas.

**Atributos:**
- **Tipo:** Siempre "push_pull_imbalance" en la version actual.
- **Severidad:** Critica (diferencia >= 2 niveles) o advertencia (diferencia = 1 nivel).
- **Ejercicio de Empuje y Traccion:** Los dos ejercicios que generaron la alerta.
- **Niveles respectivos y diferencia.**
- **Mensaje narrativo en espanol.**

**Invariantes:**
- Solo se genera si el atleta tiene peso corporal (sin peso corporal no hay niveles que comparar).
- Se evaluan todos los pares posibles push x pull, no solo pares "naturales".
- Los ejercicios de empuje incluyen: banca, press militar, dips, extension de triceps.
- Los ejercicios de traccion incluyen: remo, dominadas, face pull.

---

### 5. Ghost Profile (GhostProfile)

El Ghost Profile es una proyeccion hipotetica que muestra donde deberia estar el atleta si alcanzara un nivel de fuerza objetivo.

**Atributos:**
- **Ejercicio:** El ejercicio proyectado.
- **1RM Objetivo:** El 1RM necesario segun el nivel objetivo y el peso corporal.
- **1RM Actual:** El 1RM actual del atleta.
- **Brecha (kg y %):** La diferencia absoluta y porcentual entre actual y objetivo.

**Invariantes:**
- Solo se genera en modo comparativo y cuando hay peso corporal disponible.
- El nivel objetivo puede ser: principiante, intermedio, avanzado, elite.
- Se genera para todos los ejercicios activos, no solo los que tienen deficit.

---

### 6. Diagnostico Narrativo (DiagnosticCard)

El Diagnostico Narrativo es una sintesis de alto nivel que comunica al atleta su situacion global en lenguaje natural.

**Atributos:**
- **Severidad:** Critica, advertencia o informativa.
- **Titulo y cuerpo:** Texto descriptivo del diagnostico.
- **Riesgos:** Lista de consecuencias potenciales.
- **Acciones recomendadas:** Lista priorizada de pasos a seguir.

**Reglas de generacion (priorizadas):**
1. Si hay alerta critica cross-ejercicio: diagnostico critico sobre desequilibrio push/pull con riesgos articulares especificos.
2. Si la diferencia entre el ejercicio mas fuerte y el mas debil es >= 2 niveles: diagnostico critico sobre desequilibrio muscular general.
3. Si hay 2 o mas resultados criticos: diagnostico de advertencia sobre deficiencias multiples.
4. Si todos los resultados son optimos: diagnostico informativo positivo.
5. Si ninguna condicion anterior aplica: no se genera diagnostico (retorna null).

---

## Relaciones entre Entidades

```
Atleta ─────────┐
                 │ contextualiza
                 v
Metrica ────> Evaluacion ────> Diagnostico Narrativo
  (N)            (N)                 (0..1)
                 │
                 ├──> Alerta Cross-Ejercicio (0..N)
                 │
                 └──> Ghost Profile (0..N, modo comparativo)
```

El Atleta provee el contexto (peso corporal) que enriquece las Evaluaciones. Las Metricas son la entrada pura, las Evaluaciones son el diagnostico por ejercicio, las Alertas y el Diagnostico emergen del analisis cruzado de multiples Evaluaciones. El Ghost Profile es una capa de proyeccion superpuesta, opcional y dependiente del modo de visualizacion.

---

## Contextos Acotados (Bounded Contexts)

Aunque Athletera es una aplicacion pequena, se pueden identificar tres contextos conceptuales:

1. **Contexto de Captura:** Perfil del atleta y metricas de ejercicio. Responsable de validacion de entrada, ajustes de implemento/autocarga, y persistencia.
2. **Contexto de Evaluacion:** Estimacion de 1RM, calculo de ratios, clasificacion de estado, determinacion de nivel. Funciones puras sin efectos secundarios.
3. **Contexto de Diagnostico:** Deteccion de desequilibrios cross-ejercicio, generacion de recomendaciones narrativas, Ghost Profile. Consume las salidas del contexto de evaluacion y produce artefactos de comunicacion al usuario.
