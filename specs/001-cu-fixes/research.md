# Research: Correcciones Casos de Uso Housinger Frontend

## Decisions

### 1. Validación de piso y departamento (CU-01)

- **Decision**: Implementar las reglas de piso y departamento exclusivamente en esquemas Yup usados por React Hook Form en el formulario de registro.
- **Rationale**: Centraliza la validación en un único lugar, coherente con la constitución (formularios validados por esquema) y evita lógica duplicada en componentes.
- **Alternatives considered**:
  - Validar manualmente en el `onSubmit` del formulario → rechazado por duplicar reglas y ser más propenso a errores.
  - Delegar validación completa al backend → rechazado porque el CU exige feedback inmediato en el frontend antes de enviar.

### 2. Manejo de sesión/login/logout/refresh (CU-02)

- **Decision**: Asegurar que el flujo de auth use `useAuthStore` como única fuente de verdad, sincronizada con cookies JWT manejadas por el backend, y que el estado se restaure en mount vía un efecto centralizado.
- **Rationale**: Reduce condiciones de carrera entre distintas fuentes (cookies, localStorage, memoria) y cumple la constitución de “Fuente Única de Verdad”.
- **Alternatives considered**:
  - Leer cookies directamente desde varios componentes → rechazado por riesgo de inconsistencias.
  - Depender solo del middleware de Next.js sin store → rechazado porque los componentes cliente necesitan conocer el estado de auth.

### 3. Prevención de eventos con fecha pasada (CU-03)

- **Decision**: Implementar validación de fecha en el esquema Yup del formulario de eventos, comparando contra la fecha actual (normalizada a zona horaria del cliente) y bloquear el `submit` si la fecha es anterior.
- **Rationale**: Cumple el CU con cambios mínimos, evita viajes innecesarios al backend y es fácilmente testeable.
- **Alternatives considered**:
  - Validar solo del lado backend → rechazado por mala UX (feedback tardío).
  - Forzar el `min` del `input[type=date]` vía HTML únicamente → rechazado porque no cubre todos los casos (manipulación, formatos).

### 4. UX de filtros y búsqueda de posteos (CU-04, CU-07)

- **Decision**: Mantener el estado de filtros y término de búsqueda en un hook o store de UI local al listado de posteos, mostrando mensajes explícitos cuando la lista filtrada está vacía y ofreciendo una acción para limpiar filtros/búsqueda.
- **Rationale**: Cambios localizados en el componente de listado/post-card y sus hooks, sin requerir cambios de backend.
- **Alternatives considered**:
  - Depender de recargas completas o navegación para limpiar → rechazado por mala UX.
  - No mostrar mensaje y dejar la lista vacía → rechazado por el CU.

### 5. Gestión de servicios por colaboradores (CU-05)

- **Decision**: Asegurar que el formulario de servicios cargue los tipos desde React Query contra `services.api.ts`, muestre un `select` poblado y maneje el caso de lista vacía deshabilitando el `submit` y mostrando mensaje informativo.
- **Rationale**: Se alinea con el patrón de datos de servidor (React Query) y evita formularios “rotos” sin opciones.
- **Alternatives considered**:
  - Hardcodear tipos en el frontend → rechazado por desacople con backend y dificultad de mantenimiento.

### 6. Transiciones de denuncias y auto-denuncia (CU-06, CU-08)

- **Decision**: Derivar las acciones de cambio de estado de denuncias a partir de una tabla de transiciones válidas en el frontend y condicionar la renderización de acciones de denuncia en función de la comparación entre `currentUser.id` y `post.author.id`.
- **Rationale**: Cambios puramente de UI, seguros, fáciles de razonar y sin alterar la API.
- **Alternatives considered**:
  - Permitir todas las acciones y confiar solo en validación backend → rechazado porque el CU exige que la UI no exponga transiciones inválidas ni auto-denuncias.

## Open Questions

No se identifican NEEDS CLARIFICATION críticos adicionales para esta iteración; los Casos de Uso definen claramente el comportamiento esperado.

