# Guía de Usuario — Athletera MVP

## Paso 1: Configura tu Perfil

Al abrir la app, verás la sección **"Perfil de atleta"**:

| Campo | Qué poner | Ejemplo |
|---|---|---|
| **Categoría** | Tu deporte principal | General Fitness, Powerlifting, Fútbol, Running |
| **Nivel** | Tu experiencia | Principiante (<1 año), Intermedio (1-3 años), Avanzado (3+ años) |
| **Peso corporal** | Tu peso en kg (opcional) | 75 |

> 💡 **Tip:** El peso corporal es opcional pero útil para análisis futuros (fuerza relativa).

---

## Paso 2: Ingresa tus Ejercicios

El sistema requiere **al menos 2 ejercicios**:

### Obligatorio: Press de Banca (Pivot)

Es la referencia (100%). Todos los demás ejercicios se comparan contra él.

```
Press de Banca: [peso en kg] × [repeticiones]
Ejemplo: 80 kg × 8 reps
```

### Agrega ejercicios secundarios

Haz clic en los botones `+` para añadir:
- Press Militar
- Remo con Barra
- Dominadas Lastradas
- Sentadilla
- Peso Muerto

Para cada uno, ingresa:
- **Peso (kg):** El peso que levantaste
- **Repeticiones:** Cuántas hiciste al fallo técnico (rango ideal: 3-12 reps)

> ⚠️ **Validación:** Peso y repeticiones deben ser mayores a 0. Si no, verás un borde rojo.

---

## Paso 3: Revisa tu Diagnóstico

El sistema calcula automáticamente:

### 1RM Estimado

Tu **una repetición máxima** estimada usando la fórmula de Epley.

```
Ejemplo: 80 kg × 8 reps → 1RM estimado: 101.33 kg
```

### Eficiencia (%)

Qué tan cerca estás del ratio ideal.

- **100%** = Exactamente en el ideal
- **>100%** = Por encima del ideal (fortaleza relativa)
- **<85%** = Deficiencia (requiere atención)

### Estado

| Icono | Estado | Qué significa |
|---|---|---|
| 🟢 | Óptimo | Todo bien, mantener progresión |
| 🟡 | Advertencia | Mejorable, priorizar en rutina |
| 🔴 | Crítico | Deficiencia significativa, riesgo de lesión |

---

## Paso 4: Interpreta el Gráfico de Radar

El gráfico muestra dos áreas superpuestas:

| Área | Color | Significado |
|---|---|---|
| **Ideal** | Gris | Lo que deberías levantar según ratios |
| **Actual** | Azul | Tu rendimiento real |

### Cómo leerlo:

- **Si el azul cubre el gris:** ¡Excelente! Estás en o por encima del ideal.
- **Si el azul no llega al gris:** Hay deficiencia en ese ejercicio.
- **Cuanto más se superpongan:** Mejor balance muscular.

---

## Paso 5: Aplica las Recomendaciones

Cada ejercicio con deficiencia incluye una recomendación específica.

### Ejemplos:

**Press Militar deficiente:**
> "Aumentar trabajo de hombro/estabilidad escapular (Face Pulls, Press Arnold)"

**Remo deficiente:**
> "Priorizar tracción horizontal (remo con pausa, control excéntrico)"

**Sentadilla deficiente:**
> "Elevar fuerza de tren inferior (sentadilla frontal, tempo squats)"

---

## Consejos de Uso

### ¿Cada cuánto evaluarme?

Cada **2-4 semanas** es suficiente. La fuerza toma tiempo en cambiar.

### ¿Qué pasa si mis datos se borran?

Todo se guarda en tu navegador (LocalStorage). Si limpias caché, se pierden. Te recomendamos anotar tus números en otro lado como backup.

### ¿Funciona sin internet?

Sí. Una vez cargada la app, funciona offline.

### ¿Puedo usarlo en mi celular?

Sí. La app es **mobile-first** y está optimizada para pantallas pequeñas.

---

## ¿Necesitas más ayuda?

- Revisa [Preguntas Frecuentes](./FAQ.md) (si existe)
- Consulta el [Glosario](./GLOSSARY.md) para términos técnicos
- Lee [ARCHITECTURE.md](./ARCHITECTURE.md) para entender cómo funciona por dentro
