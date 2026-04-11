# Documentacion de Athletera

Bienvenido a la documentacion tecnica de **Athletera** -- Evaluador de balance muscular y nivel de fuerza para atletas.

---

## Indice de Documentacion

### Especificaciones de Dominio (SDD)

| Documento | Descripcion |
|---|---|
| [DOMAIN.md](./DOMAIN.md) | Modelo de dominio: entidades, invariantes, relaciones y bounded contexts |
| [ALGORITHMS.md](./ALGORITHMS.md) | 15 algoritmos especificados con inputs, outputs y precondiciones |
| [STANDARDS_MATRIX.md](./STANDARDS_MATRIX.md) | Tablas de referencia: ratios ideales, estandares por nivel, umbrales |
| [USER_FLOWS.md](./USER_FLOWS.md) | 8 flujos de usuario con comportamiento esperado y transiciones |
| [GLOSSARY.md](./GLOSSARY.md) | Glosario de ~25 terminos del dominio |

### Arquitectura y Decisiones

| Documento | Descripcion |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Arquitectura tecnica, flujo de datos, pipeline de estado reactivo |
| [DATA_MODELS.md](./DATA_MODELS.md) | Tipos TypeScript, interfaces y estructuras de datos |
| [ADR/0001-uso-de-epley.md](./ADR/0001-uso-de-epley.md) | Decision: Formula de Epley sobre alternativas (Brzycki, Lander) |
| [ADR/0002-client-only-pwa.md](./ADR/0002-client-only-pwa.md) | Decision: PWA sin backend, trade-offs de privacidad vs sync |
| [ADR/0003-hook-monolitico.md](./ADR/0003-hook-monolitico.md) | Decision: Estado centralizado en un hook, criterios para migrar |

### Para Usuarios

| Documento | Descripcion |
|---|---|
| [USER_GUIDE.md](./USER_GUIDE.md) | Manual de uso en espanol (5 pasos) |
| [../README.md](../README.md) | Vista general del proyecto, setup y comandos |

### Especificaciones Originales

| Documento | Descripcion |
|---|---|
| [../.specify/spec.md](../.specify/spec.md) | Especificacion tecnica del MVP |
| [../.specify/plan.md](../.specify/plan.md) | Plan de implementacion y roadmap |
| [../.specify/constitution.md](../.specify/constitution.md) | Principios no negociables del proyecto |

---

## Quick Start

### Para Usuarios
1. Abre la app localmente con `pnpm dev`
2. Ingresa tu **peso corporal** (requerido para calculo de niveles)
3. Ingresa tu **Press de Banca** (ejercicio pivote obligatorio)
4. Agrega otros ejercicios (Press Militar, Remo, Sentadilla, etc.)
5. Ve tu diagnostico en tiempo real

### Para Desarrolladores
```bash
pnpm install
pnpm dev            # Vite dev server
pnpm test           # 35 tests unitarios (vitest, node env)
pnpm build          # typecheck + vite build
```

---

## Guia de Lectura para Agentes de IA

Si eres un agente de IA que necesita entender el sistema para hacer modificaciones:

1. **Empieza por [DOMAIN.md](./DOMAIN.md)** para entender las entidades, invariantes y reglas de negocio.
2. **Consulta [ALGORITHMS.md](./ALGORITHMS.md)** para entender la logica de calculo antes de modificar `calculators.ts`.
3. **Revisa [STANDARDS_MATRIX.md](./STANDARDS_MATRIX.md)** si necesitas modificar constantes, umbrales o agregar ejercicios.
4. **Lee [ARCHITECTURE.md](./ARCHITECTURE.md)** para entender el pipeline de estado y la relacion entre capas.
5. **Consulta [GLOSSARY.md](./GLOSSARY.md)** si encuentras un termino del dominio que no reconoces.
6. **Revisa los ADRs** antes de cambiar decisiones fundamentales (formula de 1RM, backend, gestion de estado).
7. **Lee [../AGENTS.md](../AGENTS.md)** para convenciones de codigo, comandos de build/test y quirks del dominio.
