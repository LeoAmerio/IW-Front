# Spec — Flow 4: Gestión de Servicios

## User Story
Como **residente autenticado**, quiero ver y administrar el directorio de proveedores de servicios profesionales de mi consorcio, para poder contactarlos cuando los necesite y mantener el listado actualizado.

---

## Acceptance Criteria

**AC-1 — Carga inicial**
- **Given** el usuario navega a `/gestion-servicios`
- **When** el componente monta
- **Then** se muestran esqueletos o el texto "Cargando..." hasta que tanto `loadingUser` como `loadingServices` sean `false`

**AC-2 — Fetch de usuario**
- **Given** `userState` (del `useAuthStore`) contiene el usuario con un `id`
- **When** `useQuery(['user', userState.id], fetchUserById)` resuelve
- **Then** se obtiene el usuario completo con `user.edificio.id`

**AC-3 — Fetch de servicios**
- **Given** `user.edificio.id` está disponible
- **When** `useEffect` dispara `fetchServices()` → `useServicesStore.fetchServices()`
- **Then** se cargan todos los servicios en el store; si falla → toast de error

**AC-4 — Tabla de servicios**
- **Given** los servicios cargaron correctamente
- **When** no hay filtros activos
- **Then** se muestra una tabla con columnas: Nombre | Servicio | Teléfono | (Acciones) con todos los proveedores

**AC-5 — Empty state**
- **Given** no hay servicios o el filtro no retorna resultados
- **Then** se muestra el texto: "No hay profesionales disponibles para el servicio seleccionado."

**AC-6 — Filtro por tipo de servicio**
- **Given** el usuario selecciona un tipo en el Select (Plomeria / Gasista / Electricista / Tecnico en Refrigeracion / Pintor / Todos)
- **When** `useServicesFilter` recalcula con `useMemo`
- **Then** la tabla muestra solo los profesionales de ese tipo; seleccionar "Todos" o "all" limpia el filtro de tipo

**AC-7 — Búsqueda por nombre**
- **Given** el usuario escribe en el Input "Buscar profesional"
- **When** `useServicesFilter.filteredProfessionals` se recalcula con `useMemo`
- **Then** la tabla muestra solo los proveedores cuyo `nombre_proveedor` contiene el texto (case-insensitive)

**AC-8 — Botón "Limpiar filtros"**
- **Given** `selectedService !== ""` OR `searchTerm !== ""`
- **Then** aparece el botón "Limpiar filtros" (variant ghost)
- **When** se hace clic
- **Then** `clearFilters()` resetea ambos filtros a `""` y el botón desaparece

**AC-9 — Agregar profesional**
- **Given** el usuario hace clic en "Agregar Profesional"
- **Then** se abre `<ProfessionalDialog>` en modo `CrudOperation.CREATE` con `professional={null}` e `isEditing={false}`

**AC-10 — Editar profesional**
- **Given** el usuario hace clic en el ícono `<Edit>` de una fila
- **Then** se abre `<ProfessionalDialog>` en modo `CrudOperation.UPDATE` con `professional={selectedProfessional}` e `isEditing={true}` (campos pre-llenados)

**AC-11 — Dialog de profesional — CREATE**
- **Given** el dialog está en modo CREATE y el usuario completa el formulario y confirma
- **When** `useServicesStore.createService(data)` llama la API
- **Then**: toast "Profesional creado exitosamente", el dialog se cierra, la tabla se actualiza con el nuevo item; en caso de error: toast de error y el dialog permanece abierto

**AC-12 — Dialog de profesional — UPDATE**
- **Given** el dialog está en modo UPDATE y el usuario modifica datos y confirma
- **When** `useServicesStore.updateService(id, data)` llama la API
- **Then**: toast "Profesional actualizado exitosamente", el dialog se cierra, la tabla actualiza la fila; en caso de error: toast de error

**AC-13 — Eliminar profesional**
- **Given** el usuario hace clic en el ícono `<Trash2>` de una fila
- **Then** se abre `<DeleteConfirmationDialog>` con el profesional seleccionado

**AC-14 — Confirmar eliminación**
- **Given** el usuario confirma en el `DeleteConfirmationDialog`
- **When** `useServicesStore.deleteService(id)` llama la API
- **Then**: toast "Profesional eliminado exitosamente", el dialog se cierra, el item se remueve de la tabla; en caso de error: toast de error

**AC-15 — BackButton**
- **Given** el usuario hace clic en el `<BackButton href="/dashboard" />`
- **Then** navega a `/dashboard`

---

## Component Map

| Archivo | Responsabilidad |
|---|---|
| `app/gestion-servicios/page.tsx` | Server component, renderiza `<ServicesClient />` |
| `components/servicios-gestion/gestion-servicios-client.tsx` | Orquesta tabla, filtros, dialogs de CRUD |
| `components/servicios-gestion/useServicesFilter.ts` | Hook para filtrado reactivo por tipo y nombre (useMemo) |
| `components/servicios-gestion/professional-dialog.tsx` | Dialog de CREATE/UPDATE con formulario de profesional |
| `components/servicios-gestion/confirmation-dialog.tsx` | `DeleteConfirmationDialog` — confirmación de borrado |
| `store/services/services.store.ts` | `fetchServices`, `createService`, `updateService`, `deleteService` |
| `api/services.api.ts` | `fetchServicios`, `createProfessional`, `editProfessional`, `deleteProfessional` |
| `api/user.api.ts` | `fetchUserById(id)` |
| `components/ui/BackButton.tsx` | Botón de retorno al dashboard |

---

## Data Contract

### Interfaces
```ts
interface Servicios {
  id: number
  tipo: { id: number; tipo: string }
  nombre_proveedor: string
  telefono: string
}
// ProfessionalFormRequest — definida en professional-dialog.tsx
```

### Tipos de servicio (hardcoded)
```ts
[
  { id: 1, tipo: "Plomeria" },
  { id: 2, tipo: "Gasista" },
  { id: 3, tipo: "Electricista" },
  { id: 4, tipo: "Tecnico en Refrigeracion" },
  { id: 5, tipo: "Pintor" }
]
```

### Endpoints
| Método | URL | Body | Response |
|---|---|---|---|
| GET | `/servicios/` | — | `Servicios[]` |
| POST | `/servicios/` | `ProfessionalFormRequest` | `Servicios` |
| PUT | `/servicios/:id` | `ProfessionalFormRequest` | `Servicios` |
| DELETE | `/servicios/:id` | — | — |
| GET | `/auth/usuarios/:id` | — | `User` |

---

## Edge Cases / Error States

| Caso | Comportamiento esperado |
|---|---|
| `userState` sin `edificio.id` | `fetchServices` no se dispara (dependencia del `useEffect`) |
| Error en `fetchServices` | `useServicesStore` captura, muestra toast de error y deja `services = []` |
| Dialog cerrado sin confirmar | `selectedProfessional` se resetea a null, `isEditing` a false |
| Error en createService/updateService/deleteService | Store muestra toast de error y hace `throw error` para que el dialog lo maneje si corresponde |
| Filtro activo + empty results | Tabla vacía con mensaje "No hay profesionales disponibles..." |
