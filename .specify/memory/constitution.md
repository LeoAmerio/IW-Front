# Housinger Constitution

## Core Principles

### I. Cliente como Thin Shell
Las páginas (`app/**/page.tsx`) son componentes de servidor que únicamente importan y renderizan un componente cliente (`*-client.tsx`). Ninguna lógica, estado ni data fetching reside en los `page.tsx`. El directorio `app/` delimita la barrera servidor/cliente de forma estricta.

### II. Fuente Única de Verdad
`useAuthStore` (Zustand) es la única fuente de verdad para el usuario autenticado y el token JWT. Ningún componente lee cookies ni localStorage directamente. Los datos de servidor se gestionan con React Query; el estado de UI local se gestiona con `useState`/`useReducer` dentro del componente.

### III. Mutaciones Declarativas con Feedback (NON-NEGOTIABLE)
Toda operación asíncrona (CRUD) se realiza a través de `useMutation` de React Query. Los diálogos (`*-dialog.tsx`) nunca mutan datos directamente: invocan funciones del store o mutaciones y se cierran únicamente tras éxito. Cada acción asíncrona muestra un toast (`react-hot-toast`) en caso de éxito **y** en caso de error. Sin excepción.

### IV. Formularios Validados por Esquema
Todo formulario usa React Hook Form con validación Yup (vía `@hookform/resolvers/yup`). La lógica de validación reside en el esquema Yup, no en el manejador de envío. Los mensajes de error se muestran en español (Argentina).

### V. Rutas Protegidas y Redirección
Todas las rutas bajo `/dashboard/*` están protegidas. Usuarios no autenticados son redirigidos a `/login` (gestionado por el middleware de Next.js y el estado `AuthStatus`). El estado de auth siempre pasa por: `Pending` → `Authorized` | `Unauthorized`.

## Stack & Convenciones

### Tech Stack
| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 — App Router |
| Estilos | Tailwind CSS + shadcn/ui |
| Estado global | Zustand (`devtools` + `persist`) |
| Estado servidor | React Query (`useQuery` / `useMutation`) |
| Formularios | React Hook Form + Yup |
| HTTP | Axios — `apiClient` de `lib/api-client.ts` |
| Auth | JWT en cookies (`js-cookie`) |
| Notificaciones | `react-hot-toast` |
| Íconos | Heroicons 24/outline + Lucide React |
| Tema | `next-themes` — dark mode por defecto |

### Estructura de Archivos
- **API calls** → `api/*.api.ts`
- **Tipos/Interfaces** → `interfaces/types.ts`, `interfaces/user.interface.ts`
- **Stores** → `store/**/*.store.ts`
- **Componentes de página** → `components/<feature>/*-client.tsx` (con `"use client"`)
- **Diálogos CRUD** → `components/<feature>/*-dialog.tsx`
- **Modales destructivos** → `components/confirmation-dialog.tsx` o `components/confirmation-modal.tsx`
- **Hooks de filtro** → junto al componente consumidor (`use*.ts`)
- **Navegación atrás** → siempre usar `<BackButton />` de `components/ui/BackButton.tsx` apuntando a `/dashboard`

### Convenciones de Nombrado
- Componentes: `PascalCase`
- Archivos: `kebab-case` para páginas/componentes, `camelCase` para hooks/stores
- Interfaces: `PascalCase` con keyword `interface`
- **Todo texto visible al usuario en español (Argentina)**; identificadores en inglés

## Dominio — Entidades Clave

| Entidad | Campos principales |
|---|---|
| **Usuario** | `id, email, nombre, apellido, rol_info: { id, rol }, is_active, is_staff, edificio: { id, nombre, direccion, numero, ciudad }, piso, numero` |
| **Roles** | Inquilino (3) · Colaborador (2) · Administrador (1) |
| **Edificio** | Scope de todos los datos |
| **Posteo** | Tipos: Reclamo · Consulta · Aviso. Tiene `respuestas` |
| **Evento** | Tipos: Reunion Consorcio · Reformas · Limpieza · Mantenimiento · Ocupacion Espacios Comunes |
| **Servicio** | `id, tipo: { id, tipo }, nombre_proveedor, telefono`. Tipos: Plomeria · Gasista · Electricista · Tecnico en Refrigeracion · Pintor |
| **Denuncia** | `id, denunciante, tipo, posteo_denunciado, usuario_denunciado, evento_denunciado, comentario, fecha_creacion, estado: pendiente·en_revision·resuelta·desestimada` |

## API

- **Base URL:** `NEXT_PUBLIC_API_ENDPOINT = https://ucse-iw-2024.onrender.com`
- Patrón de endpoints: `/auth/login/`, `/auth/registro/`, `/auth/usuarios/:id`, `/edificios/`, `/posteos/`, `/eventos/`, `/servicios/`

## Governance

- Esta constitución prevalece sobre cualquier otra práctica o decisión de implementación.
- Cualquier excepción a los principios NON-NEGOTIABLE requiere documentación explícita y aprobación del equipo.
- Los PRs deben verificar cumplimiento de los cinco principios antes de fusionarse.
- Complejidad adicional debe justificarse; aplicar principio YAGNI por defecto.

**Version**: 1.0.0 | **Ratified**: 2026-03-08 | **Last Amended**: 2026-03-08
