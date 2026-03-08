# Spec — Flow 5: Gestión de Usuarios (Administrador)

## User Story
Como **administrador**, quiero ver, crear, editar, eliminar y activar usuarios del consorcio, para mantener actualizado el registro de residentes y sus roles.

---

## Acceptance Criteria

**AC-1 — Acceso**
- **Given** el usuario accede a `/admin/gestion-usuarios`
- **Then** solo usuarios con rol Administrador pueden ver esta pantalla (la protección de ruta debe ser implementada via middleware o guard de rol)

**AC-2 — Tabla de usuarios**
- **Given** el componente monta
- **Then** `useQuery(['usuarios'], fetchUsuarios)` llama `GET /auth/usuarios/` con el token de sesión (interceptor de `apiClient`) y muestra "Cargando usuarios..." hasta resolver
- La tabla tiene columnas: EMAIL | NOMBRE | APELLIDO | ROL | EDIFICIO | PISO | NUMERO | ACTIVO | ACCIONES
- Si `edificio` es `null`, las columnas EDIFICIO muestran "—"

**AC-3 — Búsqueda de texto**
- **Given** el usuario escribe en el Input "Buscar usuario"
- **When** `filteredUsers` se recalcula (cliente)
- **Then** se muestran solo los usuarios cuyo email, nombre o apellido contienen el texto (case-insensitive)

**AC-4 — Filtro por rol**
- **Given** el usuario selecciona un rol en el Select (Inquilino / Colaborador / Administrador)
- **When** `filteredUsers` se recalcula
- **Then** se muestran solo los usuarios con ese `rol_info.rol`

**AC-5 — Indicador de activo**
- **Given** un usuario tiene `is_active = true`
- **Then** la columna ACTIVO muestra `<CheckCircle size={18} />` en verde
- **Given** `is_active = false`
- **Then** muestra `●` en rojo

**AC-6 — Agregar usuario**
- **Given** el admin hace clic en "Agregar Usuario"
- **Then** se abre `<UserDialog isEditing={false} user={null} />`

**AC-7 — Editar usuario**
- **Given** el admin hace clic en el ícono `<Edit>` de una fila
- **Then** se abre `<UserDialog isEditing={true} user={selectedUser} />` con los campos pre-llenados

**AC-8 — Eliminar usuario**
- **Given** el admin hace clic en el ícono `<Trash2>` de una fila
- **Then** se abre `<ConfirmationDialog user={selectedUser} />`
- **Given** el admin confirma
- **Then** se ejecuta la acción de eliminación (integración API pendiente en código actual)

**AC-9 — Activar usuario inactivo**
- **Given** un usuario tiene `is_active = false`
- **Then** aparece el botón `<Power>` en verde en la columna ACCIONES, además de Editar y Eliminar
- **Given** el admin hace clic en el botón Power
- **When** `activarUsuario(userId)` → API call
- **Then**:
  1. El botón muestra spinner `animate-spin` mientras `loadingActivate === userId`
  2. Al éxito: la fila se actualiza optimistamente con `is_active: true` (botón Power desaparece)
  3. Al error: `alert("Error al activar usuario")`

**AC-10 — Dialogs cerrados**
- **Given** el admin cierra cualquier dialog
- **Then** `selectedUser` se resetea a `null` e `isEditing` a `false`

---

## Component Map

| Archivo | Responsabilidad |
|---|---|
| `app/admin/gestion-usuarios/page.tsx` | Server component, renderiza `<GestionUsuariosClient />` |
| `components/gestion-usuarios/gestion-usuarios-client.tsx` | Tabla + filtros + manage dialogs + activate logic |
| `components/gestion-usuarios/user-dialog.tsx` | Dialog CREATE/UPDATE de usuario |
| `components/gestion-usuarios/confirmation-dialog.tsx` | Dialog de confirmación para eliminar |
| `api/user.api.ts` | `activarUsuario(userId)` + (pendiente: fetchUsers, createUser, editUser, deleteUser) |

---

## Data Contract

### Interfaces
```ts
// De @/interfaces (re-exportado)
interface Usuario {
  id: number; email: string; nombre: string; apellido: string
  rol_info: { id: number; rol: string }
  is_active: boolean; is_staff: boolean
  edificio: Edificio | null
  piso: string | null; numero: string | null
}
```

### Roles disponibles (hardcoded en UI)
```ts
[
  { id: 1, rol: "Inquilino" },
  { id: 2, rol: "Colaborador" },
  { id: 3, rol: "Administrador" }
]
```

### Endpoints confirmados
| Método | URL | Body | Response |
|---|---|---|---|
| POST | `/auth/usuarios/:id/activar/` | — | (respuesta confirmada en `activarUsuario`) |

> La integración completa de GET/POST/PUT/DELETE usuarios está **pendiente** según el código actual.

---

## Edge Cases / Error States

| Caso | Comportamiento esperado |
|---|---|
| Error al activar | `alert("Error al activar usuario")` (sin toast en la implementación actual) |
| `loadingActivate` con múltiples filas | Solo la fila con `loadingActivate === user.id` muestra spinner |
| Filtros combinados (texto + rol) | Ambos filtros se aplican simultáneamente con `&&` |
| Lista vacía después de filtrar | La tabla muestra cuerpo vacío sin mensaje de empty state explícito |
