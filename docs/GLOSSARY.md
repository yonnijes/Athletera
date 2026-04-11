# Glosario de Terminos: Athletera

Definiciones de los terminos del dominio usados en la documentacion y el codigo. Util para eliminar ambiguedad en la comunicacion entre humanos y agentes de IA.

---

### 1RM (One-Rep Max)

La carga maxima que un atleta puede levantar en una sola repeticion con tecnica correcta. En Athletera, el 1RM nunca se mide directamente; siempre se **estima** a partir de un set submaximal usando la formula de Epley. Es la unidad base de comparacion de todo el sistema.

### Autocarga

Propiedad de ejercicios donde el atleta mueve su propio peso corporal ademas de cualquier lastre externo. En Athletera, los ejercicios de autocarga son las Dominadas Lastradas y los Dips. El sistema suma automaticamente el peso corporal al lastre ingresado antes de calcular el 1RM.

### Balance Muscular

La proporcion de fuerza entre ejercicios de diferentes patrones de movimiento. Un atleta con buen balance muscular tiene ratios de fuerza entre ejercicios que se aproximan a las proporciones biomecanicas ideales. El balance se mide normalizando todos los ejercicios contra el pivote.

### BW (Body Weight / Peso Corporal)

El peso corporal del atleta en kilogramos. Se usa como denominador para calcular la fuerza relativa (1RM / BW) y como base para los estandares de fuerza por nivel. Es el atributo que desbloquea el analisis de nivel de fuerza absoluta.

### Cadena Anterior

Grupo muscular de la parte frontal del cuerpo involucrado en ejercicios como la sentadilla. Incluye cuadriceps, core anterior y gluteos en su funcion de extension de rodilla.

### Cadena Posterior

Grupo muscular de la parte trasera del cuerpo involucrado en ejercicios como el peso muerto. Incluye gluteos, isquiotibiales, erectores espinales y toda la musculatura de la espalda baja.

### Clasificacion de Estado

El resultado cualitativo de comparar el ratio actual de un ejercicio contra su ratio ideal. Tiene tres valores posibles: **optimo** (desviacion >= -5%), **advertencia** (desviacion entre -15% y -5%), **critico** (desviacion <= -15%).

### Cross-Exercise (Analisis Cruzado)

La comparacion de niveles de fuerza entre ejercicios de familias antagonistas (empuje vs traccion). Detecta cuando un atleta tiene una diferencia peligrosa entre su capacidad de empuje y traccion. Una diferencia de 2+ niveles genera una alerta critica.

### Desequilibrio Escapular

Condicion donde la fuerza de traccion del atleta es significativamente menor que su fuerza de empuje (>= 20% menor), lo que genera riesgo de lesion en el complejo del hombro, postura cifotica y dolor cervical.

### Desviacion Porcentual

La medida cuantitativa de que tan lejos esta el ratio actual de un ejercicio respecto al ratio ideal. Se calcula como `((actual - ideal) / ideal) x 100`. Valores negativos indican deficit; valores positivos indican exceso.

### Diagnostico Narrativo

Una sintesis textual de alto nivel que comunica al atleta su situacion global. Incluye un titulo, cuerpo explicativo, lista de riesgos y lista de acciones recomendadas. Se genera algoritmicamente a partir de los resultados de evaluacion y las alertas cross-ejercicio.

### Eficiencia

El porcentaje que representa el rendimiento actual respecto al ideal. Se calcula como `(ratio_actual / ratio_ideal) x 100`. Una eficiencia de 100% indica que el atleta esta exactamente en el ratio ideal.

### Endurance (Resistencia)

Modo de evaluacion alternativo al 1RM, usado para ejercicios donde la capacidad de resistencia muscular es mas relevante que la fuerza maxima. En Athletera, solo el Face Pull usa este modo, evaluandose por la capacidad de completar 15 repeticiones con el 10% del 1RM de banca.

### Epley (Formula de)

Formula empirica para estimar el 1RM: `peso x (1 + reps / 30)`. Precisa en el rango de 3-12 repeticiones, conservadora por naturaleza (no sobreestima), y la mas usada en la industria del entrenamiento de fuerza.

### Fuerza Relativa

La relacion entre el 1RM de un ejercicio y el peso corporal del atleta. Se expresa como un multiplicador (ej: "1.2x BW"). Permite comparar la fuerza de atletas de diferentes pesos corporales y clasificarlos en niveles.

### Ghost Profile (Perfil Fantasma)

Una proyeccion hipotetica que muestra los 1RM que el atleta necesitaria alcanzar para cumplir los estandares de un nivel objetivo. Se visualiza en el grafico radar como un area purpura punteada superpuesta al rendimiento actual. Solo disponible en modo comparativo y con peso corporal ingresado.

### Implemento

El tipo de equipamiento usado en un ejercicio: barra (barbell) o mancuerna (dumbbell). Cuando se usa mancuerna, el sistema aplica una correccion: multiplica por 2 (ambos lados) y reduce un 10% por la mayor demanda de estabilizacion.

### Lastre

El peso externo adicional que se agrega en ejercicios de autocarga (dominadas, dips). Es lo que el usuario ingresa en el campo de peso. El sistema suma el peso corporal automaticamente para obtener la carga total.

### Nivel de Fuerza

Clasificacion del atleta en una escala de progresion basada en su fuerza relativa. El sistema usa dos escalas: una de 3 niveles (principiante, intermedio, avanzado) para el Ghost Profile, y una de 4 niveles (novato, intermedio, avanzado, elite) para la clasificacion por ejercicio.

### Patron de Movimiento

Clasificacion biomecanica de un ejercicio segun el tipo de movimiento que realiza: empuje horizontal, empuje vertical, traccion horizontal, traccion vertical, sentadilla (squat) o bisagra (hinge). Se usa para agrupar ejercicios en familias push/pull.

### Pivote (Ejercicio Pivote)

El ejercicio de referencia contra el cual se comparan todos los demas. En Athletera, el pivote es siempre el **Press de Banca**. Todos los ratios ideales se expresan como porcentaje del 1RM de banca. Es obligatorio e inamovible.

### Progreso

El porcentaje de avance del atleta desde su nivel actual hacia el siguiente nivel de fuerza (0-100%). Permite al atleta visualizar cuanto le falta para alcanzar el proximo hito.

### Push/Pull (Empuje/Traccion)

Las dos familias antagonistas principales de ejercicios de tren superior. **Push** incluye banca, press militar, dips y extension de triceps. **Pull** incluye remo, dominadas y face pull. El equilibrio entre estas familias es critico para la salud articular del hombro.

### Ratio de Balance

La proporcion entre el 1RM de un ejercicio y el 1RM del pivote (banca). Ejemplo: un ratio de 0.6 para press militar significa que el 1RM del press militar es el 60% del 1RM de banca. Los ratios ideales representan las proporciones biomecanicamente saludables.

### Test de Resistencia

Protocolo de evaluacion alternativo al 1RM para ejercicios de endurance. Para el Face Pull: 15 repeticiones con el 10% del 1RM de banca. Mide la capacidad del manguito rotador de sostener esfuerzo repetido, no la fuerza maxima.
