# Documentación de Athletera

Bienvenido a la documentación oficial de **Athletera** — Evaluador de balance muscular para atletas.

---

## 📚 Índice de Documentación

### Para Todos los Usuarios
| Documento | Descripción |
|---|---|
| [USER_GUIDE.md](./USER_GUIDE.md) | Manual de uso completo (cómo usar la app) |
| [../README.md](../README.md) | Vista general del proyecto |

### Para Desarrolladores
| Documento | Descripción |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitectura, flujo de datos, componentes |
| [DATA_MODELS.md](./DATA_MODELS.md) | Tipos TypeScript, interfaces, estructuras |
| [ADR/](./ADR/) | Decisiones arquitectónicas documentadas |
| [.specify/spec.md](../.specify/spec.md) | Especificación técnica completa |
| [.specify/plan.md](../.specify/plan.md) | Plan de implementación y roadmap |

---

## 🚀 Quick Start

### Para Usuarios
1. Abre la app en `https://athletera.vercel.app` (o localmente con `pnpm dev`)
2. Ingresa tu **peso corporal** (requerido para cálculo de niveles)
3. Ingresa tu **Press de Banca** (ejercicio pivot obligatorio)
4. Agrega otros ejercicios (Press Militar, Remo, Sentadilla, etc.)
5. Ve tu diagnóstico en tiempo real

### Para Desarrolladores
```bash
git clone https://github.com/yonnijes/Athletera.git
cd Athletera
pnpm install
pnpm dev
pnpm test
```

---

## 📊 Funcionalidades Principales

### 1. Cálculo de 1RM (Fórmula de Epley)
```
1RM = peso × (1 + reps / 30)

Ejemplo: 80 kg × 8 reps = 101.33 kg
```

### 2. Matriz de Estándares por Nivel

| Ejercicio | Beginner | Intermediate | Advanced | Elite |
|---|---:|---:|---:|---:|
| Press de Banca | 0.8× BW | 1.2× BW | 1.5× BW | 1.8× BW |
| Press Militar | 0.4× BW | 0.72× BW | 1.125× BW | 1.35× BW |
| Remo con Barra | 0.48× BW | 0.9× BW | 1.35× BW | 1.62× BW |
| Dominadas Lastradas | 0.8× BW | 1.0× BW | 1.2× BW | 1.5× BW |
| Sentadilla | 0.8× BW | 1.2× BW | 1.6× BW | 2.0× BW |
| Peso Muerto | 0.96× BW | 1.44× BW | 2.0× BW | 2.4× BW |

*BW = Peso Corporal (Body Weight)*

### 3. Modos de Visualización

#### Modo Simple
- Muestra tu **nivel actual** por ejercicio
- Barras de progreso hacia el próximo nivel
- Badges: Principiante / Intermedio / Avanzado / Élite

#### Modo Comparativo (Ghost Profile)
- Selecciona tu **nivel objetivo**
- El radar muestra **3 áreas**:
  - 🔵 **Azul:** Tu rendimiento actual
  - 🟣 **Morado (punteado):** Tu meta
  - ⚪ **Gris:** Ratio ideal

### 4. Diagnóstico Narrativo

La app genera automáticamente diagnósticos como:

```
🚨 Desequilibrio Crítico Detectado

Tu Press de Banca está en nivel Avanzado (120 kg),
pero tus Dominadas están en nivel Principiante (60 kg).

⚠️ Riesgos:
  • Lesión de hombro (manguito rotador)
  • Postura cifótica (hombros adelantados)
  • Dolor cervical y de espalda alta

✅ Acciones Recomendadas:
  1. Priorizar tracción sobre empuje (ratio 2:1)
  2. Face Pulls diarios (3-4 × 15-20 reps)
  3. Reducir volumen de press 20-30% por 2-3 semanas
```

### 5. Alertas de Salud

#### Desequilibrio Cross-Ejercicio
- Si hay **≥2 niveles de diferencia** entre empuje y tracción → **ALERTA CRÍTICA**
- Ejemplo: Banca Avanzado + Dominadas Principiante = Riesgo de lesión

#### Desequilibrio Escapular
- Si la **tracción es 20% menor** que el empuje → **ALERTA CRÍTICA**
- Umbral configurable: `SCAPULAR_IMBALANCE_THRESHOLD = -20`

---

## 🏗️ Arquitectura

```
src/
├── App.tsx                  # Punto de entrada
├── components/
│   ├── AthleteProfileForm   # Perfil (peso, categoría)
│   ├── ExerciseForm         # Inputs de ejercicios
│   ├── RadarChart           # Gráfico con Ghost Profile
│   ├── ResultsSummary       # Resultados + niveles
│   ├── DiagnosticCard       # Diagnóstico narrativo
│   └── ViewModeToggle       # Selector Simple/Comparativo
├── hooks/
│   └── useStrengthLogic     # Estado + lógica de negocio
├── utils/
│   └── calculators.ts       # 1RM, ratios, niveles, alertas
├── constants/
│   ├── ratios.ts            # BW_STANDARDS, IDEAL_RATIO_RANGES
│   └── strengthStandards.ts # Matriz completa por ejercicio
└── types/
    └── domain.ts            # Tipos TypeScript
```

---

## 🧪 Testing

```bash
pnpm test          # Tests unitarios (35 tests)
pnpm test:watch    # Modo watch
```

### Cobertura
- `utils/calculators.ts`: **100% cubierto**
- Tests incluyen: 1RM, ratios, niveles, alertas cross-ejercicio

---

## 📦 Build

```bash
pnpm build         # Build de producción
pnpm preview       # Preview del build
```

### Output
```
dist/index.html                   0.39 kB
dist/assets/index-*.css          14.36 kB
dist/assets/index-*.js          526.47 kB
```

---

## 🤝 Contribuir

1. Fork el repo
2. Crea una rama (`git checkout -b feature/nueva-feature`)
3. Commit (`git commit -m 'feat: agrega nueva feature'`)
4. Push (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT

---

## 📞 Contacto

- **Repo:** https://github.com/yonnijes/Athletera
- **Issues:** https://github.com/yonnijes/Athletera/issues
- **Discussions:** https://github.com/yonnijes/Athletera/discussions
