# Matriz de Estandares: Athletera

Este documento consolida todas las tablas de referencia, umbrales y constantes del dominio en un unico lugar. Es la fuente de verdad (single source of truth) para los datos estaticos que gobiernan los calculos del sistema.

---

## 1. Ejercicios del Sistema

### 1.1 Catalogo Completo

| ID | Nombre (ES) | Tipo | Patron de Movimiento | Familia |
|---|---|---|---|---|
| `bench_press` | Press de Banca | Principal / Pivote | Empuje Horizontal | Push |
| `overhead_press` | Press Militar | Principal | Empuje Vertical | Push |
| `barbell_row` | Remo con Barra | Principal | Traccion Horizontal | Pull |
| `weighted_pull_up` | Dominadas Lastradas | Principal / Autocarga | Traccion Vertical | Pull |
| `squat` | Sentadilla | Principal | Sentadilla | -- |
| `deadlift` | Peso Muerto | Principal | Bisagra | -- |
| `dips` | Dips (Fondos en Paralelas) | Accesorio / Autocarga | Empuje Vertical | Push |
| `tricep_extension` | Press Frances / Triceps | Accesorio | Empuje Vertical | Push |
| `face_pull` | Face Pull (Resistencia) | Accesorio / Endurance | Traccion Horizontal | Pull |

### 1.2 Ejercicios de Autocarga

Ejercicios donde el 1RM incluye el peso corporal del atleta:
- `weighted_pull_up`
- `dips`

### 1.3 Ejercicios de Endurance

Ejercicios evaluados por test de resistencia en lugar de 1RM:
- `face_pull`

### 1.4 Ejercicios con Selector de Implemento

Ejercicios que permiten alternar entre barra y mancuerna:
- `bench_press`
- `overhead_press`
- `barbell_row`
- `squat`
- `deadlift`
- `tricep_extension`

---

## 2. Ratios Ideales de Balance (vs Press de Banca = 100%)

Estos ratios expresan la proporcion de fuerza esperada entre cada ejercicio y el Press de Banca como pivote.

| Ejercicio | Ratio Min | Ratio Max | Punto Medio | Proposito |
|---|---:|---:|---:|---|
| Press Militar | 0.60 | 0.65 | 0.625 | Salud del hombro y empuje vertical |
| Remo con Barra | 0.75 | 0.80 | 0.775 | Equilibrio de cadena posterior |
| Dominadas Lastradas | 0.75 | 0.80 | 0.775 | Fuerza de traccion vertical |
| Sentadilla | 1.20 | 1.40 | 1.300 | Equilibrio tren superior/inferior |
| Peso Muerto | 1.50 | 1.80 | 1.650 | Fuerza estructural total |
| Dips | 1.10 | 1.20 | 1.150 | Triceps y hombro inferior |
| Extension de Triceps | 0.18 | 0.22 | 0.200 | Aislamiento de triceps |
| Face Pull | 0.08 | 0.12 | 0.100 | Resistencia del manguito rotador |

**Nota:** El Press de Banca es el pivote (100%) y no tiene ratio ideal contra si mismo.

---

## 3. Estandares de Fuerza por Nivel (Ratio vs Peso Corporal)

### 3.1 Sistema de 4 Niveles (STRENGTH_STANDARDS)

Usado para clasificar el nivel de fuerza absoluta del atleta.

| Ejercicio | Novato | Intermedio | Avanzado | Elite | Funcion Anatomica |
|---|---:|---:|---:|---:|---|
| Press de Banca | 0.80x BW | 1.20x BW | 1.50x BW | 1.80x BW | Empuje Horizontal (Pivote) |
| Press Militar | 0.40x BW | 0.72x BW | 1.125x BW | 1.35x BW | Empuje Vertical |
| Remo con Barra | 0.48x BW | 0.90x BW | 1.35x BW | 1.62x BW | Traccion Horizontal |
| Dominadas Lastradas | 0.80x BW | 1.00x BW | 1.20x BW | 1.50x BW | Traccion Vertical |
| Sentadilla | 0.80x BW | 1.20x BW | 1.60x BW | 2.00x BW | Cadena Anterior |
| Peso Muerto | 0.96x BW | 1.44x BW | 2.00x BW | 2.40x BW | Cadena Posterior |
| Dips | 0.88x BW | 1.32x BW | 1.65x BW | 1.98x BW | Triceps / Hombro Inferior |
| Extension de Triceps | 0.16x BW | 0.24x BW | 0.30x BW | 0.36x BW | Aislamiento de Triceps |
| Face Pull | 0.08x BW | 0.10x BW | 0.12x BW | 0.15x BW | Manguito Rotador (Resistencia) |

### 3.2 Sistema de 3 Niveles (BW_STANDARDS)

Usado para calcular el 1RM objetivo en el Ghost Profile. Coincide con los primeros 3 niveles del sistema de 4.

| Ejercicio | Principiante | Intermedio | Avanzado |
|---|---:|---:|---:|
| Press de Banca | 0.80x BW | 1.20x BW | 1.50x BW |
| Press Militar | 0.40x BW | 0.72x BW | 1.125x BW |
| Remo con Barra | 0.48x BW | 0.90x BW | 1.35x BW |
| Dominadas Lastradas | 0.80x BW | 1.00x BW | 1.20x BW |
| Sentadilla | 0.80x BW | 1.20x BW | 1.60x BW |
| Peso Muerto | 0.96x BW | 1.44x BW | 2.00x BW |
| Dips | 0.88x BW | 1.32x BW | 1.65x BW |
| Extension de Triceps | 0.16x BW | 0.24x BW | 0.30x BW |
| Face Pull | 0.08x BW | 0.10x BW | 0.12x BW |

**Nota:** Cuando el nivel objetivo es "Elite", se usa el multiplicador de "Avanzado" como techo en el Ghost Profile.

### 3.3 Derivacion de los Estandares de Accesorios

Los estandares de los ejercicios accesorios se derivan del Press de Banca:

| Accesorio | Relacion con Banca |
|---|---|
| Dips | 110% del 1RM de Banca (incluye peso corporal) |
| Extension de Triceps | 20% del 1RM de Banca |
| Face Pull | 10% del 1RM de Banca para 15 reps (resistencia) |

---

## 4. Umbrales de Clasificacion

### 4.1 Estado de Balance (Desviacion vs Ratio Ideal)

| Desviacion | Estado | Color UI |
|---|---|---|
| >= -5% | Optimo | Verde |
| entre -15% y -5% (exclusive) | Advertencia | Amarillo |
| <= -15% | Critico | Rojo |

### 4.2 Alertas Cross-Ejercicio (Diferencia de Niveles Push vs Pull)

| Diferencia | Severidad |
|---|---|
| 1 nivel | Advertencia |
| >= 2 niveles | Critica |

### 4.3 Desequilibrio Escapular

| Condicion | Umbral |
|---|---|
| Pull/Push <= -20% | Desequilibrio detectado |

---

## 5. Factores de Ajuste

### 5.1 Mancuerna
```
peso_efectivo = peso_por_lado x 2 x 0.9
```
- Multiplicador: 2 (ambos lados)
- Correccion de estabilidad: 0.9 (-10%)

### 5.2 Autocarga
```
peso_total = peso_corporal + lastre_adicional
```
- Aplica a: weighted_pull_up, dips
- Sin peso corporal disponible: usa solo lastre

### 5.3 Test de Resistencia (Face Pull)
```
peso_objetivo = 1RM_banca x 0.10
reps_objetivo = 15
```

---

## 6. Categorias de Atleta

| ID | Etiqueta |
|---|---|
| `general_fitness` | General Fitness |
| `powerlifting` | Powerlifting |
| `football` | Futbol |
| `running` | Running |

**Estado actual:** Las categorias se capturan pero no afectan los calculos. Reservadas para futura adaptabilidad de ratios por deporte.

---

## 7. Niveles de Atleta (Declarados)

| ID | Etiqueta |
|---|---|
| `beginner` | Principiante |
| `intermediate` | Intermedio |
| `advanced` | Avanzado |

**Estado actual:** El nivel declarado esta oculto en la UI. El nivel real se determina algoritmicamente por ejercicio.

---

## 8. Mapeo de Niveles a Etiquetas y Colores

| Nivel | Etiqueta (ES) | Clases CSS |
|---|---|---|
| `beginner` / `novice` | Principiante | `text-slate-600 bg-slate-100` |
| `intermediate` | Intermedio | `text-blue-600 bg-blue-100` |
| `advanced` | Avanzado | `text-purple-600 bg-purple-100` |
| `elite` | Elite | `text-amber-600 bg-amber-100` |

---

## 9. Fuentes Bibliograficas

1. Epley, B. (1985). *Tonage figures in the bench press and squat*.
2. NSCA. (2021). *Essentials of Strength Training and Conditioning* (4th ed.).
3. Rippetoe, M. (2011). *Starting Strength* (3rd ed.).
4. Strength Level. (2024). *Strength Standards Database*. https://strengthlevel.com
5. PowerliftingToWin. (2024). *Powerlifting Standards*. https://powerliftingtowin.com
