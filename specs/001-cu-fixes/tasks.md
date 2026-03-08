# Tasks: Correcciones Casos de Uso Housinger Frontend

**Input**: Design documents from `/specs/001-cu-fixes/`  
**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `quickstart.md`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Asegurar que el entorno de frontend está listo para iterar sobre los flujos definidos en CU-01 a CU-08.

- [ ] T001 Verificar instalación de dependencias (Next.js, React, Zustand, React Query, React Hook Form, Yup, Axios, Tailwind, shadcn/ui) según `package.json`
- [ ] T002 Revisar y actualizar `README.md` con instrucciones básicas para levantar el frontend y ejecutar los flujos de prueba de `quickstart.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Confirmar que los bloques transversales (auth store, api client, manejo de errores) funcionan correctamente antes de tocar casos específicos.

- [ ] T003 Revisar `api/*` para asegurar uso consistente de `apiClient` y manejo de errores con toasts
- [ ] T004 Revisar `store/auth.store.ts` para confirmar que representa la única fuente de verdad de usuario/token y expone acciones claras de login/logout/restore
- [ ] T005 [P] Revisar middlewares/rutas protegidas en `app/**` para asegurar coherencia con el estado de auth del store

**Checkpoint**: Foundation ready - se puede avanzar a tareas por categoría de fixes.

---

## Phase 3: Authentication / Session Fixes (CU-02)

**Goal**: Hacer consistente el manejo de sesión y redirecciones de login/logout/refresh.

**Independent Test**: Seguir la sección CU-02 de `quickstart.md` y comprobar todos los escenarios.

### Implementation Tasks

- [X] T006 [P] Mapear flujos actuales de login/logout en `components/auth/login-client.tsx` y cualquier hook de auth asociado, documentando dónde se guarda y lee el estado de auth
- [ ] T007 Ajustar `store/auth.store.ts` para garantizar:
  - reset completo de estado en logout
  - restauración de sesión al montar la app si el token sigue siendo válido
- [X] T008 Actualizar `components/VerticalMenu/vertical-menu.tsx` (u otros menús) para que:
  - muestren opciones correctas según estado de auth
  - llamen a la acción de logout del store y redirijan al login
- [ ] T009 Revisar y ajustar cualquier `useEffect` o lógica que lea auth directamente de cookies/localStorage para que lo haga a través de `useAuthStore`

---

## Phase 4: Form Validations (CU-01, CU-03)

**Goal**: Fortalecer validaciones de registro de usuario y creación de eventos.

**Independent Test**: Seguir CU-01 y CU-03 en `quickstart.md`.

### Implementation Tasks

- [X] T010 [P] Localizar el formulario de registro (por ejemplo en `components/auth/signup-client.tsx`) y el esquema Yup asociado
- [X] T011 [P] Actualizar el esquema Yup de registro para:
  - `piso`: entero mayor que 0
  - `departamento`: string de longitud 1, solo letras
  - mensajes de error en español claros
- [X] T012 Asegurar que los errores de piso/departamento se muestran correctamente en `app/signup/page.tsx` / componente cliente asociado
- [X] T013 [P] Localizar el formulario de creación/edición de eventos en `components/events/event-dialog.tsx` y el esquema Yup asociado
- [X] T014 Implementar validación de fecha en el esquema de eventos, bloqueando fechas pasadas y mostrando mensaje claro
- [ ] T015 Verificar que el submit del formulario de eventos solo dispara la mutación de creación cuando la fecha es actual/futura

---

## Phase 5: Event Creation Validation (CU-03, refuerzo)

**Goal**: Asegurar que ninguna ruta alternativa permite crear eventos con fecha pasada.

### Implementation Tasks

- [ ] T016 [P] Revisar `api/events.api.ts` para confirmar que no se fuerzan fechas desde el frontend y que se envían en formato consistente
- [ ] T017 Añadir (o ajustar) tests de componente/hook para el formulario de eventos, cubriendo casos de fecha pasada/actual/futura (si el proyecto ya tiene setup de tests de componentes)

---

## Phase 6: Filtering and Search UX (CU-04, CU-07)

**Goal**: Proveer feedback claro en filtros/búsqueda y permitir restaurar listado completo.

**Independent Test**: Seguir CU-04 y CU-07 en `quickstart.md`.

### Implementation Tasks

- [ ] T018 [P] Revisar el listado de posteos y su lógica (por ejemplo `components/Posts/post-card.tsx` y el contenedor de listado) para entender cómo se aplican filtros y búsqueda
- [ ] T019 Implementar estado de búsqueda y filtros en un hook/local store (o reutilizar el existente) asegurando que:
  - la lista filtrada se deriva de los datos originales
  - se puede limpiar fácilmente
- [ ] T020 Mostrar mensaje “No se encontraron posteos para los filtros seleccionados” cuando la lista filtrada está vacía
- [ ] T021 Añadir una acción visible (botón/link) para “Limpiar filtros/búsqueda” que restaure el listado completo sin recargar la app

---

## Phase 7: Services Management UI (CU-05)

**Goal**: Permitir creación de servicios por colaboradores con tipos de servicio cargados correctamente.

**Independent Test**: Seguir CU-05 en `quickstart.md`.

### Implementation Tasks

- [ ] T022 [P] Localizar el gestor de servicios y el diálogo de creación (`components/services/service-dialog.tsx` o equivalente)
- [ ] T023 Configurar React Query para obtener la lista de tipos de servicio desde `services.api.ts` (si no existe aún)
- [ ] T024 Poblar el campo de tipos en el formulario de servicios con la lista obtenida; manejar estados de loading/error
- [ ] T025 Manejar el caso de lista de tipos vacía:
  - mostrar mensaje informativo
  - deshabilitar el botón de guardar o bloquear el submit

---

## Phase 8: Report State Transitions (CU-06)

**Goal**: Restringir transiciones inválidas de denuncias (especialmente `en_revision` → `pendiente`).

**Independent Test**: Seguir CU-06 en `quickstart.md`.

### Implementation Tasks

- [ ] T026 [P] Localizar componentes de gestión de denuncias (por ejemplo `components/reports/report-status-actions.tsx` o equivalente)
- [ ] T027 Definir tabla de transiciones válidas en el frontend para estados de denuncias (`pendiente`, `en_revision`, `resuelta`, `desestimada`)
- [ ] T028 Ajustar la lógica de renderizado de botones/acciones para que:
  - cuando el estado sea `en_revision`, no se muestre ninguna opción para volver a `pendiente`
  - solo se muestren las transiciones permitidas según la tabla
- [ ] T029 Asegurar que ninguna llamada al backend intente enviar la transición `en_revision` → `pendiente`

---

## Phase 9: Prevention of Self-Reporting (CU-08)

**Goal**: Impedir que un usuario denuncie sus propios posteos.

**Independent Test**: Seguir CU-08 en `quickstart.md`.

### Implementation Tasks

- [ ] T030 [P] En los componentes que muestran acciones sobre posteos (`components/Posts/post-card.tsx` y otros), condicionar la renderización del botón de “Denunciar” comparando `currentUser.id` con `post.author.id`
- [ ] T031 Asegurar que, aunque se manipule el DOM, no se dispare una auto-denuncia desde el frontend (por ejemplo, validando autor en el handler antes de llamar a la mutación)
- [ ] T032 Validar que el backend responda adecuadamente ante un intento de auto-denuncia forzada y mostrar feedback de error sin dejar el UI en estado inconsistente

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes finales y consolidación de la iteración.

- [ ] T033 [P] Revisar textos de error y mensajes vacíos para asegurar consistencia de tono y idioma (español AR)
- [ ] T034 Revisar rápidamente `quickstart.md` ejecutando una pasada manual de los 8 Casos de Uso
- [ ] T035 Actualizar documentación interna (si aplica) con los cambios de comportamiento en auth, formularios, filtros, servicios y denuncias

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias.
- **Phase 2 (Foundational)**: Depende de Phase 1; bloquea el resto de fases.
- **Phase 3–10**: Dependen de Phase 2; pueden ejecutarse en paralelo por categoría siempre que no toquen los mismos archivos.

### Parallel Opportunities

- T003–T005 parcialmente en paralelo (según archivos afectados).
- Fases 3, 4, 6, 7, 8 y 9 pueden ser abordadas en paralelo por distintos desarrolladores (auth, formularios, posts, servicios, denuncias).
- Tareas marcadas con [P] dentro de cada fase pueden ejecutarse sin conflicto si no comparten archivo.

