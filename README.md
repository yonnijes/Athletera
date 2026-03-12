# Athletera

> Evaluador de balance muscular para atletas basado en 1RM estimado.

![Estado](https://img.shields.io/badge/estado-MVP-blue)
![Stack](https://img.shields.io/badge/stack-React+TS+Tailwind-0ea5e9)

## ¿Qué es?

Athletera identifica **desequilibrios musculares** comparando tu rendimiento en ejercicios clave contra ratios estándar de la industria.

- 📊 Calcula 1RM estimado (fórmula de Epley)
- ⚖️ Compara contra ratios ideales (Bench = 100%)
- 🎯 Detecta deficiencias y genera recomendaciones
- 💾 Persiste datos en LocalStorage
- 🎚️ **Modo Simple:** Ve tu nivel actual (Principiante/Intermedio/Avanzado/Élite)
- 🎯 **Modo Comparativo:** Compara tu rendimiento vs. tu meta (Ghost Profile)
- 🚨 **Diagnóstico Narrativo:** Alertas de salud en lenguaje natural
- ⚠️ **Detección de Desequilibrio Escapular:** Alerta crítica si tracción es 20% menor que empuje

## Stack

| Tecnología | Propósito |
|---|---|
| React 18 + Vite | Framework UI + Build |
| TypeScript 5 | Tipado estricto |
| Tailwind CSS 3 | Estilos mobile-first |
| Recharts 2 | Gráfico de radar |
| Vitest 2 | Tests unitarios |

## Instalación

```bash
git clone https://github.com/yonnijes/Athletera.git
cd Athletera
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm dev      # Dev server
pnpm build    # Build producción
pnpm test     # Tests unitarios
pnpm preview  # Preview build
```

## Documentación

| Doc | Audiencia |
|---|---|
| [docs/README.md](./docs/README.md) | Todos — Puerta de entrada |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Devs — Flujo de datos |
| [docs/DATA_MODELS.md](./docs/DATA_MODELS.md) | Devs — Tipos y estructuras |
| [docs/USER_GUIDE.md](./docs/USER_GUIDE.md) | Usuarios — Manual de uso |
| [docs/ADR/](./docs/ADR/) | Devs — Decisiones arquitectónicas |
| [.specify/](./.specify/) | Devs — Especificación técnica |

## Estado del MVP

### Funcionalidades Core
- ✅ Core de cálculo (1RM Epley, ratios, diagnóstico)
- ✅ UI mobile-first con validaciones en tiempo real
- ✅ Gráfico de radar comparativo
- ✅ Persistencia LocalStorage
- ✅ Selector de perfil de atleta
- ✅ Documentación completa

### Funcionalidades Avanzadas (v0.2.0)
- ✅ **Matriz de Estándares por Nivel** (Beginner/Intermediate/Advanced/Elite)
- ✅ **Fuerza Relativa** (1RM / peso corporal)
- ✅ **Modo Simple:** Badges de nivel + barras de progreso
- ✅ **Modo Comparativo:** Ghost Profile en radar (tu actual vs. tu meta)
- ✅ **Diagnóstico Narrativo:** Tarjetas con riesgos y acciones recomendadas
- ✅ **Alertas Cross-Ejercicio:** Desequilibrio push/pull (≥2 niveles = crítico)
- ✅ **Detección de Desequilibrio Escapular:** Alerta si tracción ≤ -20% vs empuje
- ✅ **9 Ejercicios:** 6 principales + 3 accesorios (Dips, Tríceps, Face Pull)
- ✅ **Test de Resistencia:** Face Pull evalúa 15 reps con 10% del bench

### En Progreso
- 🔄 Exportar resultados a PDF
- 🔄 CI/CD con GitHub Actions
- 🔄 Ratios por categoría deportiva (powerlifting/fútbol/running)

## Licencia

MIT
