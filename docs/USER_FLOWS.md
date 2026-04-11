# Flujos de Usuario: Athletera

Este documento describe los flujos de interaccion del usuario con el sistema, centrandose en el comportamiento esperado y las transiciones de estado, no en componentes de UI.

---

## Flujo 1: Primer Uso (Sin Peso Corporal)

**Contexto:** El usuario abre la aplicacion por primera vez. No hay datos en LocalStorage.

**Estado inicial:**
- Perfil: categoria "General Fitness", nivel "Principiante", sin peso corporal.
- Metricas precargadas: Press de Banca (80 kg x 8 reps), Press Militar (45 kg x 6 reps).
- Modo: Simple.

**Interaccion:**
1. El usuario ve inmediatamente un diagnostico basado en los datos precargados.
2. El grafico radar muestra dos ejercicios: el ratio ideal (gris) y el rendimiento actual (azul).
3. Los resultados muestran eficiencia porcentual, 1RM estimado y recomendaciones, pero **sin nivel de fuerza** (porque no hay peso corporal).
4. El modo Comparativo esta deshabilitado (requiere peso corporal).
5. El usuario puede modificar peso/reps de los ejercicios precargados y agregar nuevos ejercicios.

**Recalculo:** Cada cambio en peso o repeticiones recalcula instantaneamente todos los diagnosticos.

**Persistencia:** Cada cambio se guarda automaticamente en LocalStorage.

---

## Flujo 2: Configuracion Completa (Con Peso Corporal)

**Contexto:** El usuario ingresa su peso corporal en el perfil.

**Transicion:**
1. Al ingresar un peso corporal valido (> 0), el sistema recalcula todos los resultados.
2. Aparecen nuevos elementos en cada resultado:
   - Nivel de fuerza (Principiante/Intermedio/Avanzado/Elite).
   - Barra de progreso hacia el siguiente nivel.
   - Fuerza relativa (x peso corporal).
3. Se activan las alertas cross-ejercicio (comparacion push vs pull por niveles).
4. Se desbloquea el modo Comparativo en el toggle de visualizacion.
5. Si se detecta un desequilibrio critico, aparece la tarjeta diagnostica narrativa.

**Impacto en ejercicios de autocarga:**
- Si el usuario tiene dominadas o dips activos, el 1RM se recalcula sumando el peso corporal al lastre.
- Ejemplo: Dominadas con 25 kg de lastre y peso corporal de 75 kg pasa de 1RM basado en 25 kg a 1RM basado en 100 kg.

---

## Flujo 3: Agregar y Quitar Ejercicios

**Agregar ejercicio:**
1. El usuario pulsa un boton con el nombre del ejercicio disponible (los no activos).
2. Se agrega al formulario con valores por defecto: 1 kg, 1 rep, barra.
3. Los resultados se recalculan incluyendo el nuevo ejercicio.
4. El nuevo ejercicio aparece en el radar y en los resultados.

**Quitar ejercicio:**
1. El usuario pulsa "Quitar" junto al ejercicio.
2. El ejercicio se elimina del formulario y de los resultados.
3. El Press de Banca no muestra opcion de quitar (es obligatorio).

**Restriccion:** No se puede agregar un ejercicio que ya esta activo. La lista de ejercicios disponibles para agregar solo muestra los no presentes en las metricas actuales.

---

## Flujo 4: Cambio de Implemento (Barra/Mancuerna)

**Contexto:** Aplica a 6 ejercicios: banca, press militar, remo, sentadilla, peso muerto, extension de triceps. No aplica a ejercicios de autocarga (dominadas, dips) ni face pull.

**Interaccion:**
1. El usuario selecciona "Mancuerna" en el toggle del ejercicio.
2. Aparece una nota explicativa: "Ingresa el peso por mancuerna (por lado). Se multiplica x2 y se aplica -10% por estabilidad."
3. El sistema recalcula el 1RM aplicando la correccion automaticamente.

**Ejemplo visible:**
- Press Militar con 20 kg por mancuerna x 8 reps.
- Peso ajustado: 20 x 2 x 0.9 = 36 kg.
- 1RM = 36 x (1 + 8/30) = 45.6 kg.

---

## Flujo 5: Modo Comparativo y Ghost Profile

**Precondicion:** El usuario tiene peso corporal ingresado.

**Interaccion:**
1. El usuario selecciona "Comparativo" en el toggle de modo.
2. Aparece un selector de nivel objetivo: Principiante (0.8x BW), Intermedio (1.2x BW), Avanzado (1.5x BW), Elite (1.8x BW).
3. El sistema genera un Ghost Profile: los 1RM necesarios para cada ejercicio segun el nivel seleccionado.
4. El grafico radar ahora muestra tres capas:
   - Gris: ratio ideal.
   - Purpura punteado: meta del nivel objetivo (Ghost Profile).
   - Azul: rendimiento actual.
5. El usuario puede cambiar el nivel objetivo y el grafico se actualiza instantaneamente.

**Sin peso corporal:**
- Si el usuario intenta activar Comparativo sin peso corporal, el boton esta deshabilitado con un mensaje indicando que debe ingresar peso corporal.

---

## Flujo 6: Deteccion de Desequilibrio Critico

**Contexto:** El usuario tiene peso corporal y al menos un ejercicio de empuje y uno de traccion activos, con una diferencia de >= 2 niveles.

**Ejemplo concreto:**
- Banca: 100 kg x 10 reps con peso corporal 70 kg => 1RM 133.33 kg, ratio relativo 1.90x BW => nivel Avanzado.
- Dominadas: 0 kg lastre x 8 reps con peso corporal 70 kg => 1RM total 88.67 kg, ratio relativo 1.27x BW => nivel Intermedio... pero si el lastre fuera menor y el ratio cayera por debajo de 1.0x BW => nivel Novato.
- Diferencia Avanzado (2) - Novato (0) = 2 => ALERTA CRITICA.

**Manifestacion en UI:**
1. Aparece una tarjeta diagnostica en la parte superior con fondo rojo y titulo "Desequilibrio Critico Detectado".
2. El diagnostico lista riesgos especificos: lesion de hombro, postura cifotica, dolor cervical, desequilibrio escapular.
3. Acciones recomendadas: ratio 2:1 traccion sobre empuje, face pulls diarios, reducir volumen de press 20-30% por 2-3 semanas, consultar fisioterapeuta si hay dolor.
4. En la seccion de resultados, las alertas cross-ejercicio aparecen como un bloque con borde rojo antes de los resultados individuales.

---

## Flujo 7: Persistencia y Recuperacion de Estado

**Guardado automatico:**
- Cada cambio en perfil, metricas, modo de visualizacion o nivel objetivo dispara una escritura a LocalStorage.
- Clave: `athletera:strength-state:v2`.
- Formato: JSON con estructura `{ profile, metrics, viewMode, targetLevel }`.

**Recuperacion al abrir:**
1. El sistema lee LocalStorage al inicializar.
2. Cada metrica se valida individualmente con un type guard que verifica:
   - `exerciseId` es string.
   - `weightKg` es numero finito.
   - `reps` es numero finito.
   - `implement` es undefined, "barbell" o "dumbbell".
3. Las metricas que no pasan la validacion se descartan silenciosamente.
4. Si no quedan metricas validas, se usan los defaults (banca + press militar).
5. Si LocalStorage esta vacio, corrupto o inaccesible, se usan defaults completos.

**Nota sobre versionado:** La clave incluye `v2`, indicando que hubo al menos una migracion de schema. Si el sistema necesita cambiar la estructura persistida, deberia incrementar la version y manejar la migracion.

---

## Flujo 8: Comportamiento Offline (PWA)

**Primera visita:**
1. La aplicacion se carga normalmente via red.
2. El service worker se registra y cachea todos los assets (JS, CSS, HTML, iconos, fuentes de Google).
3. Se muestra el prompt de instalacion si el navegador lo soporta.

**Visitas posteriores sin conexion:**
1. El service worker intercepta las peticiones y sirve desde cache.
2. La aplicacion funciona identicamente a la version online.
3. Los datos del usuario estan en LocalStorage, no dependen de red.

**Actualizacion:**
- Estrategia `autoUpdate`: cuando hay una nueva version disponible, el service worker la descarga en segundo plano y la activa en la siguiente navegacion.
