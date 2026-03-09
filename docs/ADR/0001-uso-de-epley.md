# ADR 0001: Uso de la Fórmula de Epley para 1RM Estimado

**Fecha:** 2026-03-09  
**Estado:** Aceptado  
**Autor:** Yonni

## Contexto

Necesitamos estimar el 1RM (una repetición máxima) de los atletas sin requerir que realicen un intento máximo real, lo cual es:
- Riesgoso (posibilidad de lesión)
- Fatigante (afecta el resto del entrenamiento)
- Impráctico para evaluaciones frecuentes

Existen múltiples fórmulas en la literatura: Epley, Brzycki, Lander, Lombardi, etc.

## Decisión

Usar la **fórmula de Epley** como estándar para todos los cálculos de 1RM en Athletera.

```
1RM = peso × (1 + reps / 30)
```

## Racional

### Por qué Epley:

1. **Precisión en rangos comunes:** Funciona bien en el rango de 3-12 repeticiones, que es donde la mayoría de los atletas entrenan.

2. **Simplicidad:** Fórmula lineal fácil de implementar y explicar a usuarios.

3. **Conservadora:** Tiende a sobre-estimar ligeramente en rangos altos, lo cual es más seguro que sub-estimar.

4. **Popularidad:** Es una de las fórmulas más usadas en la industria del fitness, lo que facilita que los usuarios la reconozcan.

### Por qué NO otras fórmulas:

| Fórmula | Razón de exclusión |
|---|---|
| Brzycki | Más compleja, similar precisión en nuestro rango |
| Lander | Menos validada en literatura |
| Lombardi | Tiende a sobre-estimar en rangos >10 reps |

## Consecuencias

### Positivas:
- Implementación simple (`weight * (1 + reps / 30)`)
- Fácil de explicar en documentación
- Buena precisión para el caso de uso principal (fitness general)

### Negativas:
- Menos precisa para powerlifters avanzados que trabajan en rangos muy bajos (1-3 reps)
- No ajusta por edad, sexo, o tipo de ejercicio

### Neutras:
- El 1RM es siempre una **estimación**, no un valor exacto. La fórmula elegida es "suficientemente buena" para el propósito de comparación de ratios.

## Futuro

Si recibimos feedback de que usuarios avanzados (powerlifters) necesitan más precisión, podemos:
1. Agregar selector de fórmula en settings
2. Crear perfiles específicos con fórmulas diferenciadas

Por ahora, **KISS** (Keep It Simple, Stupid).

---

**Referencias:**
- Epley, B. (1985). "Tonage figures in the bench press and squat".
- NSCA Essentials of Strength Training and Conditioning.
