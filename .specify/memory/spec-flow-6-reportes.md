# Spec — Flow 6: Reportes / Denuncias (Administrador)

## User Story
Como **administrador**, quiero revisar y gestionar las denuncias enviadas por los residentes, para moderar el contenido de la plataforma y resolver conflictos, cambiando el estado de cada denuncia según corresponda.

---

## Acceptance Criteria

**AC-1 — Tabla de denuncias**
- **Given** el admin navega a `/admin/reports`
- **When** los `initialReports` son recibidos como prop
- **Then** se muestra una tabla con columnas: ID | Tipo | Denunciante | Contenido Denunciado | Fecha | Estado | Acciones

**AC-2 — Columna "Contenido Denunciado"**
- **Given** el `report.posteo_denunciado !== null`
- **Then** se muestra el truncado del `titulo` del posteo (max-w-xs)
- **Given** `report.usuario_denunciado !== null`
- **Then** muestra "Usuario"
- **Given** `report.evento_denunciado !== null`
- **Then** muestra "Evento"
- **Given** ninguno aplica
- **Then** muestra "N/A"

**AC-3 — Badge de estado**
- **Given** el estado de la denuncia
- **Then** se renderiza un `<Badge>` con el color correspondiente:
  - `pendiente` → amarillo (Pendiente)
  - `en_revision` → azul (En Revisión)
  - `resuelta` → verde (Resuelta)
  - `desestimada` → rojo (Desestimada)

**AC-4 — Ver detalles**
- **Given** el admin hace clic en el ícono `<Eye>` de una fila
- **Then** se abre el dialog `<ReportDetails>` mostrando el detalle completo en 3 pestañas: "Contenido Denunciado", "Denunciante", "Detalles"

**AC-5 — Pestaña "Contenido Denunciado"**
- **Given** la denuncia tiene `posteo_denunciado`
- **Then** se muestra: tipo del posteo, título, descripción, autor (nombre + piso + depto), imagen adjunta (si existe)
- **Given** tiene `usuario_denunciado` o `evento_denunciado`
- **Then** se muestra un card con el tipo correspondiente y un mensaje "Información no disponible"
- Siempre aparece el card de "Comentario del Denunciante" con `report.comentario`

**AC-6 — Pestaña "Denunciante"**
- **Given** la pestaña "Denunciante" está activa
- **Then** se muestra: nombre/apellido, email, rol (Badge), piso/depto, edificio (nombre + dirección + ciudad)

**AC-7 — Pestaña "Detalles"**
- **Given** la pestaña "Detalles" está activa
- **Then** se muestra: ID, tipo, estado actual (Badge), fecha de creación formateada (es-ES); sección "Historial de cambios" con mensaje "No hay historial disponible"

**AC-8 — Marcar como revisada**
- **Given** el admin abre el detalle de una denuncia con `estado = 'pendiente'` y no está marcada como revisada
- **Then** aparece el botón "Marcar como revisada" (azul)
- **When** el admin hace clic
- **Then**:
  1. Se llama `statusMutation.mutate({ reportId, newStatus: 'en_revision' })`
  2. El botón cambia a "Denuncia revisada" (verde, deshabilitado)
  3. La tabla actualiza el badge de la fila a "En Revisión"

**AC-9 — Transición al estado "resuelta"**
- **Given** el admin hace clic en el ícono `<CheckCircle>` de una fila
- **When** la denuncia está `en_revision` o fue marcada como revisada localmente
- **Then** se llama `handleStatusChange(reportId, 'resuelta')`; el estado de la tabla se actualiza optimistamente; después React Query invalida `['reports']`
- **Given** la denuncia ya está en `resuelta` o `desestimada`
- **Then** el botón está deshabilitado (gris)

**AC-10 — Transición al estado "desestimada"**
- **Given** el admin hace clic en el ícono `<XCircle>` de una fila
- **Same logic** que AC-9 pero con `newStatus = 'desestimada'`

**AC-11 — Protección de acciones antes de revisión**
- **Given** la denuncia está en `pendiente` y NO fue marcada como revisada localmente
- **Then** los botones Aprobar (`<CheckCircle>`) y Rechazar (`<XCircle>`) están deshabilitados (gris)

**AC-12 — Cierre del dialog de detalles**
- **Given** el admin cierra el dialog de detalles
- **Then** `handleDetailsClose` agrega el `reportId` al set `reviewedReports` (marcándolo como revisado)

---

## Component Map

| Archivo | Responsabilidad |
|---|---|
| `app/admin/reports/page.tsx` | Server component; fetcha `initialReports` y renderiza `<ReportsTable>` |
| `components/reports/report-table.tsx` | Tabla de denuncias, manejo de estado local, mutations |
| `components/reports/report-details.tsx` | Vista de detalle en tabs (Contenido / Denunciante / Detalles) |
| `api/denuncias.api.ts` | `ChangeStateApi.changeState({ reportId, newStatus })` |

---

## Data Contract

### Interfaces
```ts
interface Report {
  id: number
  denunciante: {
    id: number; email: string; nombre: string; apellido: string
    rol_info: { id: number; rol: string }
    edificio: { id: number; nombre: string; direccion: string; numero: number; ciudad: string }
    piso: number; numero: string
  }
  tipo: string
  posteo_denunciado: {
    id: number; titulo: string; descripcion: string
    usuario: { id: number; nombre: string; apellido: string; piso: number; numero: string }
    tipo_posteo: { id: number; tipo: string }
    imagen: string
  } | null
  usuario_denunciado: any | null
  evento_denunciado: any | null
  comentario: string
  fecha_creacion: string
  estado: "pendiente" | "en_revision" | "resuelta" | "desestimada"
}

interface ChangeStateResponse { message: string; denuncia: Report }
```

### Endpoints
| Método | URL | Body | Response |
|---|---|---|---|
| GET | `/denuncias/` (inferido desde page.tsx) | — | `Report[]` |
| PATCH/PUT | `/denuncias/:id/estado/` (inferido) | `{ estado: string }` | `ChangeStateResponse` |

---

## Edge Cases / Error States

| Caso | Comportamiento esperado |
|---|---|
| Error al cambiar estado | `console.error(...)` — no hay toast de error explícito en la implementación actual |
| `initialReports` array vacío | La tabla renderiza sin filas |
| Denuncia ya cerrada (`resuelta`/`desestimada`) | Todos los botones de acción deshabilitados |
| `posteo_denunciado.imagen` ausente | El bloque de imagen no se renderiza |
| `comentario` vacío | Se muestra texto "Sin comentario" en cursiva |
| Rehydration de `reviewedReports` | El set se inicializa vacío en cada render; no persiste entre recargas |
