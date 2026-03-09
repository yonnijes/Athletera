# Athletera - Documentación

> Evaluador de balance muscular para atletas basado en 1RM estimado.

## ¿Qué es Athletera?

Athletera es una herramienta de diagnóstico que identifica **desequilibrios musculares** comparando tu rendimiento en ejercicios clave contra ratios estándar de la industria.

Calcula tu **1RM estimado** (fórmula de Epley) y lo contrasta con ratios ideales para detectar deficiencias y generar recomendaciones de entrenamiento.

## Stack Tecnológico

| Tecnología | Versión | Propósito |
|---|---|---|
| React | 18.x | Framework UI |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Build tool + dev server |
| Tailwind CSS | 3.x | Estilos |
| Recharts | 2.x | Gráficos (radar) |
| Vitest | 2.x | Testing |

## Instalación Rápida

```bash
# Clonar repo
git clone https://github.com/yonnijes/Athletera.git
cd Athletera

# Instalar dependencias
pnpm install

# Iniciar dev server
pnpm dev

# Build para producción
pnpm build

# Correr tests
pnpm test
```

## Estructura de Documentación

| Archivo | Propósito | Audiencia |
|---|---|---|
| [README.md](./README.md) | Esta puerta de entrada | Todos |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Flujo de datos y arquitectura | Devs |
| [DATA_MODELS.md](./DATA_MODELS.md) | Diccionario de tipos y datos | Devs |
| [USER_GUIDE.md](./USER_GUIDE.md) | Manual de uso | Usuarios |
| [ADR/](./ADR/) | Decisiones arquitectónicas | Devs |

## Enlaces Rápidos

- [Repo GitHub](https://github.com/yonnijes/Athletera)
- [Especificación técnica](../.specify/spec.md)
- [Constitución del proyecto](../.specify/constitution.md)
