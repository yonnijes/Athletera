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

- ✅ Core de cálculo (1RM Epley, ratios, diagnóstico)
- ✅ UI mobile-first con validaciones en tiempo real
- ✅ Gráfico de radar comparativo
- ✅ Persistencia LocalStorage
- ✅ Selector de perfil de atleta
- ✅ Documentación completa

## Licencia

MIT
