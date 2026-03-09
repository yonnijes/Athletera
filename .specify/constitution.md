# Constitution - Athletera

Principios inamovibles que rigen este proyecto.

## 1. Tech Stack (No negociable)

- **Frontend:** React 18 + Vite + TypeScript (strict mode)
- **Estilos:** Tailwind CSS (mobile-first)
- **Gráficos:** Recharts
- **Iconos:** Lucide-react
- **Estado:** React Hooks + Context API (evitar libs externas de estado)
- **Persistencia:** LocalStorage (sin backend para MVP)
- **Testing:** Vitest + React Testing Library
- **Package Manager:** pnpm

## 2. Reglas de Salud del Código

- **TypeScript strict:** `noUncheckedIndexedAccess`, `noFallthroughCasesInSwitch`
- **Sin `any`:** Usar tipos explícitos o `unknown` con type guards
- **Componentes puros:** Sin efectos secundarios fuera de hooks dedicados
- **Hooks separados:** Lógica de negocio extraída de UI (`use*` hooks)
- **Tests obligatorios:** Core lógico (`calculators.ts`) debe tener tests unitarios
- **Mobile-first:** Todo componente debe funcionar en viewport ≤375px

## 3. Arquitectura

```
src/
├── assets/          # Estilos globales, imágenes
├── components/      # Componentes UI (puros, presentacionales)
│   └── ui/          # Primitivos reutilizables (Button, Input, Card)
├── hooks/           # Lógica de estado y negocio
├── utils/           # Funciones puras (calculadoras, formateadores)
├── constants/       # Configuración estática (ratios, labels)
└── types/           # Tipos TypeScript (domain, API)
```

## 4. Convenciones

- **Archivos:** `.ts` para lógica, `.tsx` solo para componentes React
- **Exports:** Nombrados (evitar `export default` en utils/constants)
- **Nombres:** `PascalCase` componentes, `camelCase` funciones, `UPPER_CASE` constants
- **Errores:** Mensajes en español, consistentes, accionables

## 5. Criterios de Aceptación (MVP)

- [ ] Cálculo de 1RM exacto (fórmula de Epley)
- [ ] Press de Banca obligatorio como pivot
- [ ] Gráfico de radar comparativo (ideal vs actual)
- [ ] Recomendaciones textuales por deficiencia
- [ ] Persistencia LocalStorage (no perder datos al recargar)
- [ ] Validación de inputs en tiempo real

---

*Esta constitución puede evolucionar, pero cada cambio requiere justificación explícita en el commit.*
