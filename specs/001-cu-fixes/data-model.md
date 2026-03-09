# Data Model: Correcciones Casos de Uso Housinger Frontend

## Entities Involved

### Usuario

- **Description**: Representa al usuario autenticado o potencial (registro).
- **Key Fields**:
  - `id: string`
  - `email: string`
  - `first_name: string`
  - `last_name: string`
  - `rol_info: { id: number; rol: string }` (1 = admin, 2 = colaborador, 3 = inquilino)
  - `piso: number | null`
  - `departamento: string | null`
- **Validation Rules**:
  - `piso` (en registro): entero > 0.
  - `departamento` (en registro): string de longitud 1, solo letra.

### Posteo

- **Description**: Publicación creada por un usuario dentro del edificio (reclamo, consulta, aviso).
- **Key Fields**:
  - `id: string`
  - `autor: Usuario`
  - `tipo: 'reclamo' | 'consulta' | 'aviso'`
  - `titulo: string`
  - `descripcion: string`
- **Business Rules (para esta iteración)**:
  - Un usuario no puede denunciar un `Posteo` cuyo `autor.id` coincida con `currentUser.id`.

### Evento

- **Description**: Evento programado dentro del edificio.
- **Key Fields**:
  - `id: string`
  - `titulo: string`
  - `descripcion: string`
  - `tipo: string` (Reunión Consorcio, Reformas, etc.)
  - `fecha: string | Date`
- **Validation Rules**:
  - `fecha` debe ser >= fecha actual (no se permiten fechas pasadas).

### Servicio

- **Description**: Servicio de mantenimiento o proveedor asociado al edificio.
- **Key Fields**:
  - `id: string`
  - `tipo: { id: string; tipo: string }`
  - `nombre_proveedor: string`
  - `telefono: string`
- **Business Rules**:
  - Usuarios con rol colaborador pueden crear nuevos `Servicio` seleccionando un `tipo` disponible.
  - Si la lista de tipos está vacía, el formulario debe indicar el problema y no permitir un submit inconsistente.

### Denuncia

- **Description**: Reporte sobre contenido o usuarios.
- **Key Fields**:
  - `id: string`
  - `posteo_denunciado?: Posteo`
  - `usuario_denunciado?: Usuario`
  - `estado: 'pendiente' | 'en_revision' | 'resuelta' | 'desestimada'`
  - `comentario: string`
  - `fecha_creacion: string | Date`
- **Business Rules**:
  - De `en_revision` no se puede volver a `pendiente`.
  - Las acciones de UI deben derivarse de una tabla de transiciones válidas (por ejemplo, `pendiente -> en_revision/resuelta/desestimada`, `en_revision -> resuelta/desestimada`).

## Relationships

- `Usuario` 1—N `Posteo` (un usuario puede crear muchos posteos).
- `Usuario` 1—N `Denuncia` (como denunciante, pero no puede denunciar sus propios posteos).
- `Posteo` 1—N `Denuncia` (un posteo puede tener varias denuncias, ninguna de su propio autor).
- `Servicio` depende de `tipo` (catálogo provisto por backend).

