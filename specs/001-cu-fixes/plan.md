# Implementation Plan: Correcciones Casos de Uso Housinger Frontend

**Branch**: `001-cu-fixes` | **Date**: 2026-03-08 | **Spec**: `specs/001-cu-fixes/spec.md`  
**Input**: Feature specification from `/specs/001-cu-fixes/spec.md`

## Summary

Esta iteración corrige comportamientos del frontend de Housinger para alinearlos con los 8 Casos de Uso documentados en `CU.md`. Abarca validaciones de formularios (registro y eventos), manejo consistente de sesión/token, UX de filtros y búsqueda de posteos, gestión de servicios por colaboradores y restricciones de denuncias (transiciones válidas y prevención de auto-denuncia).

Técnicamente, se implementarán cambios mínimos sobre el código existente de Next.js + React + TypeScript, respetando la constitución de Housinger: páginas como thin shell, estado de auth centralizado en `useAuthStore` (Zustand), datos de servidor vía React Query y formularios validados con React Hook Form + Yup. No se introduce nueva infraestructura; se refuerzan validaciones en esquemas existentes, se ajusta el manejo del store de auth y se condicionan acciones de UI para impedir operaciones inválidas hacia el backend.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript, Next.js 14 (App Router), React 18  
**Primary Dependencies**: Next.js, React, Zustand (`useAuthStore`), React Query, React Hook Form, Yup, Axios (`apiClient`), TailwindCSS, shadcn/ui, `react-hot-toast`  
**Storage**: Backend REST API (`NEXT_PUBLIC_API_ENDPOINT`), sin cambios en esta iteración  
**Testing**: React Testing Library + Jest/ Vitest (según setup existente); pruebas manuales de flujos de CU-01 a CU-08  
**Target Platform**: Aplicación web (navegadores modernos desktop/mobile)
**Project Type**: Frontend web (SPA/MPA con Next.js App Router)  
**Performance Goals**: Sin cambios de performance masivos; mantener tiempos de navegación percibidos como instantáneos en flujos de login, filtros y búsquedas  
**Constraints**: Respetar la constitución (thin shell en `app/**/page.tsx`, auth vía store y cookies, formularios validados por Yup); cambios mínimos y safe en un proyecto brownfield  
**Scale/Scope**: Edificios con múltiples usuarios, posteos, eventos, servicios y denuncias; esta iteración afecta principalmente flujos de registro, eventos, posteos, servicios y denuncias a nivel UI.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Cliente como Thin Shell: se mantiene; no se introduce lógica nueva en `app/**/page.tsx`, solo se ajustan componentes cliente existentes (`*-client.tsx`, diálogos, cards).
- Fuente Única de Verdad: todos los cambios en auth se harán a través de `useAuthStore` y React Query; no se accederá directamente a cookies/localStorage desde nuevos componentes.
- Mutaciones Declarativas con Feedback: cualquier ajuste en creación de eventos, servicios o denuncias seguirá utilizando `useMutation` con toasts de éxito/error.
- Formularios Validados por Esquema: las nuevas reglas de piso/departamento y fecha de evento se implementarán en esquemas Yup usados por React Hook Form, no en handlers ad-hoc.
- Rutas Protegidas y Redirección: los cambios de login/logout/refresh respetarán el modelo `AuthStatus` y middleware existente; no se rompen las protecciones actuales.

**Resultado del gate**: La iteración se ajusta a la constitución sin violaciones previstas. No se requieren excepciones formales.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
app/
├── login/
│   └── page.tsx
├── signup/
│   └── page.tsx
├── dashboard/
│   ├── page.tsx
│   ├── posts/
│   │   └── page.tsx
│   ├── events/
│   │   └── page.tsx
│   ├── services/
│   │   └── page.tsx
│   └── reports/
│       └── page.tsx

components/
├── auth/
│   ├── login-client.tsx
│   └── signup-client.tsx
├── Posts/
│   └── post-card.tsx
├── events/
│   ├── event-card.tsx
│   └── event-dialog.tsx
├── services/
│   └── service-dialog.tsx
├── reports/
│   └── report-status-actions.tsx
└── VerticalMenu/
    └── vertical-menu.tsx

store/
├── auth.store.ts
└── ui.store.ts

api/
├── auth.api.ts
├── posts.api.ts
├── events.api.ts
├── services.api.ts
└── reports.api.ts
```

**Structure Decision**: Proyecto frontend único basado en Next.js (App Router). Esta iteración afecta principalmente `components/Posts/post-card.tsx`, `components/events/event-dialog.tsx`, componentes de auth (`login-client`, `signup-client`) y cualquier componente de denuncias/servicios relacionado, además del store de auth (`store/auth.store.ts`) cuando sea necesario para los flujos de sesión.

## Complexity Tracking

No se introducen nuevas capas de complejidad estructural. Todos los cambios son locales a componentes, hooks, stores y esquemas Yup existentes, manteniendo la arquitectura actual.

