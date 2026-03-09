# Preguntas Frecuentes

## Generales

### ¿Es gratis Athletera?

Sí, es un proyecto open source. Úsalo sin costo.

### ¿Mis datos se envían a algún servidor?

**No.** Todo se guarda en tu navegador (LocalStorage). Nada sale de tu dispositivo.

### ¿Puedo usar Athletera sin internet?

Una vez cargada la app, **sí**. No requiere conexión para funcionar.

## Sobre los Cálculos

### ¿Qué fórmula usa para el 1RM?

La **fórmula de Epley**:

```
1RM = peso × (1 + reps / 30)
```

Es una de las más usadas y funciona bien en el rango de 3-12 repeticiones.

### ¿Qué pasa si hago más de 12 repeticiones?

La precisión disminuye. La fórmula de Epley es más exacta entre **3-12 reps**. Para rangos más altos, considera usar otras fórmulas (Brzycki, Lander) pero Athletera usa Epley por simplicidad.

### ¿Por qué Press de Banca es obligatorio?

Es el **estándar de la industria** para medir fuerza del tren superior. Todos los ratios están normalizados contra él. Sin un pivot, no hay comparación posible.

### ¿Puedo cambiar el ejercicio pivot?

En esta versión (MVP), **no**. El Press de Banca está fijo como pivot. Podría ser una feature futura para deportes específicos.

## Sobre los Ratios

### ¿De dónde salen los ratios ideales?

De literatura de fuerza y acondicionamiento, estándares de powerlifting, y consenso de entrenadores certificados.

Referencias:
- NSCA (National Strength and Conditioning Association)
- Starting Strength (Rippetoe)
- PowerliftingToWin norms

### ¿Los ratios son iguales para hombres y mujeres?

En esta versión MVP, **sí**. Sabemos que hay diferencias biomecánicas, pero los ratios base son similares cuando se normalizan por 1RM relativo.

### ¿Los ratios cambian por categoría (Powerlifting vs Fútbol)?

En el MVP, **no**. Pero la arquitectura ya está lista para soportarlo. Es el siguiente paso en el roadmap.

## Uso Práctico

### ¿Cada cuánto debo evaluarme?

Cada **2-4 semanas** es suficiente. Cambios significativos de fuerza toman tiempo.

### ¿Qué hago si tengo múltiples deficiencias?

Prioriza **la más crítica** primero. Trabaja 1-2 grupos débiles por ciclo (4-6 semanas), luego re-evalúa.

### ¿Puedo usar Athletera si soy principiante total?

Sí, pero ten en cuenta que los ratios asumen cierta base de entrenamiento. Si eres muy nuevo (<3 meses), enfócate primero en aprender técnica.

### ¿Athletera reemplaza a mi entrenador?

**No.** Es una herramienta de diagnóstico, no un programa de entrenamiento completo. Úsala como complemento a orientación profesional.

## Técnicas

### ¿Mis datos se pierden si limpio el navegador?

Sí. Si borras caché/LocalStorage del navegador, se pierden. Para backup, anota tus números en otro lado.

### ¿Funciona en iOS / Android?

Sí, es una web app responsiva. Ábrela en el navegador de tu móvil.

### ¿Habrá una app nativa?

No hay planes actuales. La web app funciona bien en móviles y es más fácil de mantener.

---

¿Tu duda no está aquí? Revisa el [Manual Completo](./manual.md) o el [Glosario](./glosario.md).
