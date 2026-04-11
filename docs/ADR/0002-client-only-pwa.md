# ADR-0002: Arquitectura Client-Only PWA (Sin Backend)

- **Estado:** Aceptada
- **Fecha:** 2026-03-09
- **Contexto:** Definir la arquitectura de despliegue del sistema.

---

## Contexto

Athletera necesita una forma de entregar su funcionalidad de diagnostico de fuerza a los usuarios. Las opciones evaluadas fueron: aplicacion web con backend (API + base de datos), aplicacion movil nativa, y Progressive Web App (PWA) sin backend.

## Decision

Se adopta una arquitectura **client-only PWA**: toda la logica, almacenamiento y renderizado ocurren en el navegador del usuario. No existe servidor, API, base de datos remota ni autenticacion.

La persistencia se realiza exclusivamente a traves de LocalStorage del navegador. El service worker (via `vite-plugin-pwa` con workbox) cachea todos los assets estaticos para funcionamiento offline.

## Alternativas Evaluadas

### 1. Aplicacion web con backend (API REST + PostgreSQL)

**Ventajas:**
- Sincronizacion entre dispositivos.
- Backup automatico de datos.
- Posibilidad de analytics agregados.
- Historial de progresion almacenado en servidor.

**Desventajas:**
- Complejidad de infraestructura (servidor, base de datos, CORS, autenticacion).
- Costo operativo recurrente (hosting, base de datos).
- Latencia de red para cada calculo.
- Necesidad de manejar auth (registro, login, sesiones).
- Mayor superficie de ataque (seguridad).

### 2. Aplicacion movil nativa (React Native / Flutter)

**Ventajas:**
- Experiencia nativa en movil.
- Acceso a APIs del dispositivo.
- Distribucion via App Store / Play Store.

**Desventajas:**
- Doble codebase o framework adicional.
- Proceso de publicacion en stores (review, fees).
- Mayor barrera de entrada para el usuario (instalar app).
- Complejidad de mantenimiento significativamente mayor.

### 3. PWA sin backend (seleccionada)

**Ventajas:**
- Cero costo operativo (se sirve como sitio estatico).
- Funcionamiento offline nativo.
- Privacidad implicita (datos nunca salen del dispositivo).
- Instalable en pantalla de inicio sin app store.
- Stack unico (React + TypeScript).
- Tiempo de desarrollo minimo.
- Sin autenticacion necesaria.

**Desventajas:**
- No hay sincronizacion entre dispositivos.
- Si el usuario limpia LocalStorage, pierde datos.
- No es posible generar estadisticas poblacionales.
- Limitaciones de almacenamiento de LocalStorage (~5-10 MB segun navegador).
- No hay historial de progresion a largo plazo (sin backup).

## Consecuencias

- Los datos son efimeros: si el usuario cambia de dispositivo o limpia el navegador, pierde su estado.
- No hay forma de comparar el atleta con otros atletas (no hay base de datos centralizada).
- El despliegue se reduce a servir archivos estaticos (compatible con GitHub Pages, Netlify, Vercel).
- Futuras funcionalidades que requieran backend (export PDF server-side, compartir perfil, coach dashboard) necesitaran una migracion parcial a una arquitectura con servidor.

## Notas

La estrategia de PWA usa `autoUpdate` de `vite-plugin-pwa`, lo que significa que las actualizaciones se descargan en segundo plano y se activan automaticamente en la siguiente navegacion. El usuario siempre tiene la ultima version sin intervencion manual.

La clave de LocalStorage incluye un versionador (`v2`) que permite migraciones de schema en el futuro sin perder datos existentes.
