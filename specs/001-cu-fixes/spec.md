# Feature Specification: Correcciones Casos de Uso Housinger Frontend

**Feature Branch**: `001-cu-fixes`  
**Created**: 2026-03-08  
**Status**: Draft  
**Input**: User description: "Iteración correctiva basada en los 8 Casos de Uso definidos en CU.md para corregir bugs, validaciones y UX."

## Contexto y Alcance del Problema

El frontend actual de Housinger presenta una serie de inconsistencias funcionales y de UX detectadas mediante 8 Casos de Uso (CU-01 a CU-08) que cubren:

- Validaciones incompletas o incorrectas en formularios de registro y creación de eventos.
- Manejo inconsistente de sesión y token durante login, logout y refresh.
- Experiencia de uso poco clara en filtros y búsquedas de posteos.
- Acciones de UI que habilitan transiciones de estado inválidas o acciones prohibidas (gestión de denuncias, auto-denuncias).
- Limitaciones en la gestión de servicios para usuarios con rol colaborador.

Este ciclo se centra exclusivamente en **corregir el comportamiento existente** para que cumpla con los Casos de Uso definidos, sin introducir nuevas capacidades de negocio.

## Objetivos de la Iteración

- Alinear el comportamiento del frontend con los 8 Casos de Uso funcionales documentados en `CU.md`.
- Garantizar que la UI **nunca exponga operaciones inválidas** al backend (transiciones de estado prohibidas, auto-denuncias, fechas pasadas).
- Fortalecer las validaciones de formularios en registro de usuario y creación de eventos.
- Asegurar consistencia en el manejo de sesión/token en login, logout y refresh.
- Mejorar la claridad de la UX en filtros, búsquedas y mensajes sin resultados.
- Mantener la seguridad y coherencia de roles (especialmente colaboradores y gestores de denuncias).

## Suposiciones y Dependencias

- El backend ya aplica reglas de negocio coherentes con los Casos de Uso; el foco de esta iteración es el **frontend**.
- La constitución de Housinger (Zustand para auth, React Query para datos, React Hook Form + Yup para formularios) se mantiene vigente.
- Los roles y entidades de dominio son los definidos en la constitución (`Usuario`, `Posteo`, `Evento`, `Servicio`, `Denuncia`).
- Los endpoints de autenticación, posteos, eventos, servicios y denuncias ya existen y seguirán exponiendo la información necesaria para validar reglas de UI (autor del posteo, estado de la denuncia, fecha de evento, tipos de servicio, etc.).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Sesión consistente y segura (Priority: P1)

Un usuario autenticado debe poder **iniciar sesión, navegar, refrescar y cerrar sesión** sin inconsistencias en el estado de autenticación (CU-02). Luego de loguearse, debe ser redirigido a la pantalla correspondiente; al refrescar, la sesión válida debe mantenerse; al hacer logout, la sesión debe finalizar completamente y permitir un nuevo login limpio con otro usuario.

**Why this priority**: El manejo correcto de sesión es crítico para la seguridad, la experiencia general y la coherencia de todo el sistema.

**Independent Test**: Un tester puede ejecutar el flujo completo de login → navegación → refresh → logout → nuevo login con otro usuario y verificar que el usuario correcto y su contexto se mantengan o eliminen según corresponda, sin fugas de sesión previa.

**Acceptance Scenarios**:

1. **Given** un usuario con credenciales válidas, **When** inicia sesión, **Then** el sistema guarda el estado de autenticación y redirige a la pantalla de inicio asignada.
2. **Given** un usuario autenticado y con token vigente, **When** refresca la página, **Then** la sesión permanece activa y se muestra la vista autenticada sin volver al login.
3. **Given** un usuario autenticado, **When** presiona "Cerrar sesión", **Then** el estado de autenticación se elimina, se redirige al login y al refrescar ya no se recupera la sesión anterior.
4. **Given** un usuario A que cerró sesión, **When** un usuario B inicia sesión en el mismo navegador, **Then** toda la información visible corresponde a B y no se reutiliza ningún dato de A.
5. **Given** un token inválido o expirado, **When** el usuario intenta navegar o refrescar, **Then** el sistema redirige al login y no muestra vistas protegidas.

---

### User Story 2 - Formularios validados correctamente (registro y eventos) (Priority: P1)

Un usuario visitante o autenticado debe poder completar formularios de **registro de usuario** y **creación de eventos** cumpliendo las reglas de validación de piso/departamento y fecha de evento (CU-01 y CU-03). Formularios con datos inválidos deben bloquear el envío y mostrar mensajes claros.

**Why this priority**: Las validaciones correctas previenen datos inconsistentes en el sistema y reducen errores operativos.

**Independent Test**: Un tester puede probar el formulario de registro y el formulario de creación de eventos introduciendo combinaciones válidas e inválidas de piso, departamento y fechas para verificar que solo se persisten datos válidos y que los mensajes de error se muestran correctamente.

**Acceptance Scenarios**:

1. **Given** un visitante en el formulario de registro, **When** ingresa un piso mayor que 0 y un departamento de exactamente una letra, **Then** el formulario se envía sin errores relacionados a estos campos.
2. **Given** un visitante en el formulario de registro, **When** ingresa un piso negativo, cero, vacío o no numérico, **Then** el sistema muestra un mensaje de error específico de piso y bloquea el envío.
3. **Given** un visitante en el formulario de registro, **When** ingresa un departamento con más de un carácter, con números o texto libre, **Then** el sistema muestra un mensaje de error específico de departamento y bloquea el envío.
4. **Given** un usuario autenticado en el formulario de creación de eventos, **When** selecciona una fecha actual o futura, **Then** el sistema permite crear el evento.
5. **Given** un usuario autenticado en el formulario de creación de eventos, **When** selecciona una fecha anterior a la actual, **Then** el sistema bloquea la creación y muestra un mensaje de validación claro.

---

### User Story 3 - Filtros y búsqueda de posteos con feedback claro (Priority: P2)

Un usuario (autenticado o visitante) debe poder aplicar filtros y realizar búsquedas sobre posteos, recibiendo feedback claro cuando no haya resultados y pudiendo volver al listado completo sin recargar la aplicación (CU-04 y CU-07).

**Why this priority**: Una experiencia de filtrado y búsqueda clara reduce la frustración del usuario y facilita encontrar información relevante.

**Independent Test**: Un tester puede aplicar diferentes combinaciones de filtros y términos de búsqueda, incluyendo casos sin resultados, y verificar que se muestre un mensaje informativo y que exista una forma evidente de limpiar filtros/búsqueda y restaurar el listado completo.

**Acceptance Scenarios**:

1. **Given** un usuario en el listado de posteos, **When** aplica filtros que devuelven resultados, **Then** se muestran únicamente los posteos que cumplen los criterios.
2. **Given** un usuario en el listado de posteos, **When** aplica filtros que no devuelven resultados, **Then** se muestra un mensaje informativo tipo “No se encontraron posteos para los filtros seleccionados” y la interfaz no queda vacía sin explicación.
3. **Given** un usuario que realizó una búsqueda de posteos, **When** elimina el término de búsqueda o utiliza una acción de "limpiar búsqueda", **Then** el sistema restaura el listado completo sin requerir un reload completo de la aplicación.
4. **Given** un usuario que tiene una búsqueda o filtro activo sin resultados, **When** utiliza la opción de limpiar, **Then** el sistema vuelve a mostrar todos los posteos disponibles.

---

### User Story 4 - Gestión de servicios por colaboradores (Priority: P2)

Un usuario con rol colaborador debe poder crear servicios desde el gestor de servicios, seleccionando tipos de servicio válidos y completando los datos requeridos (CU-05).

**Why this priority**: Permite a colaboradores mantener actualizado el catálogo de servicios para el edificio, mejorando la operación diaria.

**Independent Test**: Un tester con rol colaborador puede acceder al gestor de servicios, abrir el formulario de creación, ver la lista de tipos de servicio disponibles, completar los datos y guardar un nuevo servicio exitosamente.

**Acceptance Scenarios**:

1. **Given** un colaborador con acceso al gestor de servicios, **When** accede a la sección de servicios, **Then** puede ver una opción clara para “Crear servicio”.
2. **Given** un colaborador en el formulario de creación de servicios, **When** abre el campo de tipos de servicio, **Then** visualiza los tipos definidos (Plomería, Gasista, etc.) provenientes del backend.
3. **Given** un colaborador que completa todos los datos requeridos con valores válidos, **When** envía el formulario, **Then** el sistema valida y crea el servicio.
4. **Given** un escenario en el que el frontend no tiene cargados tipos de servicio, **When** un colaborador intenta crear un servicio, **Then** el sistema informa claramente que no hay tipos disponibles y evita un flujo roto (sin permitir guardar con datos incompletos).

---

### User Story 5 - Transiciones válidas de denuncias y prevención de auto-denuncias (Priority: P1)

Un usuario con permisos para gestionar denuncias debe ver únicamente las acciones de cambio de estado válidas (por ejemplo, una denuncia en estado `en_revision` no puede volver a `pendiente`), y un usuario autenticado nunca debe poder denunciar un posteo propio (CU-06 y CU-08).

**Why this priority**: Impacta directamente en la coherencia del flujo de denuncias y en la protección contra abuso del sistema.

**Independent Test**: Un tester puede revisar denuncias en distintos estados para verificar que solo se muestran transiciones permitidas y puede navegar posteos creados por el usuario actual para comprobar que no aparece la opción de denuncia, ni siquiera mediante flujos indirectos.

**Acceptance Scenarios**:

1. **Given** una denuncia en estado `en_revision`, **When** un usuario con permisos abre el detalle, **Then** la interfaz solo muestra las acciones de cambio de estado válidas y no incluye la opción de volver a `pendiente`.
2. **Given** una denuncia en estado `en_revision`, **When** se inspecciona el código de la UI y las llamadas al backend, **Then** no existe ningún botón, link o acción que intente enviar una transición `en_revision` → `pendiente`.
3. **Given** un usuario autenticado visualizando un posteo propio, **When** inspecciona las acciones disponibles sobre el posteo, **Then** no se muestra el botón ni la opción de “Denunciar”.
4. **Given** un usuario autenticado que intenta forzar una auto-denuncia manipulando la interfaz o las peticiones, **When** el sistema recibe un intento de denuncia sobre un posteo cuyo autor coincide con el usuario actual, **Then** la acción es bloqueada y no se registra la denuncia.

---

### User Story 6 - UX coherente ante estados sin resultados (Priority: P3)

Aunque implícito en otros CUs, se considera explícitamente que, ante cualquier combinación de filtros, búsquedas o estados de datos sin resultados (posteos, servicios, eventos, denuncias visibles), la interfaz debe informar al usuario de forma clara sin dejar vistas vacías o bloqueadas.

**Why this priority**: Completa la experiencia de usuario, evitando confusión en casos límite.

**Independent Test**: Un tester puede simular escenarios sin datos (por ejemplo, edificio recién creado, filtros muy restrictivos) y verificar que en cada vista se muestra un mensaje adecuado y se mantienen acciones para navegar o modificar filtros.

**Acceptance Scenarios**:

1. **Given** cualquier listado sin resultados por filtros o por ausencia de datos, **When** se renderiza la vista, **Then** se muestra un mensaje informativo y se ofrecen opciones para cambiar filtros, limpiar búsqueda o volver atrás.

---

### Edge Cases

- Registro con **piso = 0**, piso negativo, piso vacío o caracteres no numéricos.
- Registro con **departamento** vacío, con más de un carácter o que incluya números/símbolos.
- Fechas de evento justo en el límite del día actual (considerando husos horarios y formato de fecha).
- Usuario que refresca la página inmediatamente después de hacer login, antes de que termine alguna inicialización de datos.
- Usuario que intenta navegar a rutas protegidas con token expirado o eliminado.
- Colaborador que accede al gestor de servicios cuando el backend responde con una lista vacía de tipos de servicio.
- Filtro de posteos con combinación poco habitual (por ejemplo, tipo + estado + rango de fechas) que no devuelve resultados.
- Búsquedas de posteos con términos que no existen, incluyendo espacios iniciales/finales o mayúsculas/minúsculas.
- Usuario que intenta cambiar manualmente el estado de una denuncia a un valor no permitido mediante herramientas del navegador.
- Usuario que intenta denunciar su propio posteo manipulando el DOM o las peticiones de red.

---

## Requirements *(mandatory)*

### Functional Requirements

**Autenticación y sesión (CU-02)**

- **FR-001**: El sistema debe mantener un estado de autenticación consistente que sobreviva a refrescos de página mientras el token sea válido.
- **FR-002**: El sistema debe redirigir al usuario autenticado a la pantalla adecuada inmediatamente después de un login exitoso.
- **FR-003**: El sistema debe invalidar completamente la sesión al hacer logout, de modo que un refresh posterior no restaure el usuario anterior.
- **FR-004**: El sistema debe permitir que un usuario distinto inicie sesión desde el mismo navegador sin reutilizar datos ni estado del usuario previo.
- **FR-005**: Cuando el token sea inválido o haya expirado, el sistema debe redirigir al usuario al login y no mostrar vistas protegidas.

**Validación de registro de usuario (CU-01)**

- **FR-006**: El campo **piso** en el formulario de registro debe aceptar únicamente números enteros positivos (mayores a 0).
- **FR-007**: El campo **departamento** en el formulario de registro debe aceptar únicamente un carácter alfabético (una sola letra).
- **FR-008**: Si el valor de piso es negativo, cero, vacío o no numérico, el formulario de registro no debe enviarse y debe mostrar un mensaje de error claro en el campo correspondiente.
- **FR-009**: Si el valor de departamento es vacío, tiene más de un carácter o contiene números/texto libre, el formulario de registro no debe enviarse y debe mostrar un mensaje de error claro en el campo correspondiente.

**Validación de creación de eventos (CU-03)**

- **FR-010**: El formulario de creación de eventos debe validar que la fecha del evento no sea anterior a la fecha actual.
- **FR-011**: Si la fecha seleccionada es actual o futura, el sistema debe permitir la creación del evento.
- **FR-012**: Si la fecha seleccionada es anterior a la actual, el sistema debe bloquear el envío y mostrar un mensaje de validación claro sin intentar crear el evento en el backend.

**Filtros y búsqueda de posteos (CU-04 y CU-07)**

- **FR-013**: Al aplicar filtros sobre el listado de posteos, el sistema debe actualizar la lista con los resultados correspondientes.
- **FR-014**: Cuando los filtros aplicados no devuelvan resultados, el sistema debe mostrar un mensaje informativo indicando que no se encontraron posteos para los filtros seleccionados.
- **FR-015**: El sistema debe ofrecer una forma clara de limpiar filtros y/o búsqueda (por ejemplo, botón “Limpiar filtros” o acción equivalente).
- **FR-016**: Tras limpiar filtros o eliminar el término de búsqueda, el sistema debe restaurar el listado completo de posteos sin requerir recargar toda la aplicación.
- **FR-017**: Cuando una búsqueda no arroje resultados, el sistema debe mostrar un mensaje informativo y mantener disponible la acción para limpiar la búsqueda.

**Gestión de servicios por colaboradores (CU-05)**

- **FR-018**: Los usuarios con rol colaborador deben poder acceder al gestor de servicios desde la UI.
- **FR-019**: El formulario de creación de servicios debe mostrar los tipos de servicio disponibles obtenidos del backend.
- **FR-020**: Si no existen tipos de servicio, el sistema debe informar claramente al usuario y evitar que complete un formulario inconsistente (por ejemplo, deshabilitando el botón de guardar).
- **FR-021**: Cuando el colaborador completa correctamente los campos requeridos, el sistema debe permitir crear el servicio y mostrar feedback de éxito.

**Transiciones de denuncias y auto-denuncia (CU-06 y CU-08)**

- **FR-022**: Para denuncias en estado `en_revision`, el sistema debe ocultar cualquier opción que permita volver al estado `pendiente`.
- **FR-023**: El frontend no debe generar peticiones hacia el backend que intenten cambiar una denuncia de `en_revision` a `pendiente`.
- **FR-024**: Cuando el usuario autenticado es el autor de un posteo, el sistema no debe mostrar el botón ni la acción de “Denunciar” para ese posteo.
- **FR-025**: Si por un medio indirecto se intenta denunciar un posteo propio (por ejemplo, manipulando la petición), el sistema debe impedir la acción y no registrar la denuncia.

### Reglas de Validación

- Piso válido: número entero mayor a 0.
- Departamento válido: exactamente una letra alfabética.
- Fecha de evento válida: igual o posterior a la fecha actual (según zona horaria definida para el sistema).
- Sesión válida: token existente y reconocido como vigente por el backend.
- Denuncia válida: solo sobre contenido cuyo autor no sea el usuario actual.

### Restricciones de Negocio y Flujo

- Una denuncia en estado `en_revision` no puede volver al estado `pendiente`.
- El usuario autenticado no puede denunciar posteos de su propia autoría.
- La interfaz no debe exponer opciones de UI que disparen transiciones inválidas.
- La experiencia de filtros y búsqueda no debe dejar pantallas vacías sin explicación.

### Expectativas de UX
 
- Todos los mensajes de error y estados vacíos deben estar en español (Argentina), con un tono claro y directo.
- La UI debe indicar estados sin resultados con mensajes visibles y acciones de salida claras (limpiar filtros/búsqueda, volver al listado, etc.).
- Las acciones sensibles (logout, envío de formularios, cambio de estado de denuncias) deben mostrar feedback inmediato de éxito o error.
- Los formularios deben indicar claramente qué campos son requeridos y qué reglas de validación aplican (por ejemplo, ayudas visuales o textos de ayuda).

### Key Entities *(include if feature involves data)*

- **Usuario**: Representa a la persona autenticada o visitante que interactúa con la aplicación. Campos relevantes para esta iteración: `id`, `rol_info`, `piso`, `departamento`.
- **Posteo**: Contenido creado por usuarios, con información de autoría utilizada para determinar si se puede denunciar o no.
- **Evento**: Registro de actividades programadas; su fecha determina si es válida para creación según CU-03.
- **Servicio**: Recurso gestionado por colaboradores, asociado a un tipo de servicio y datos de contacto.
- **Denuncia**: Registro de reporte sobre contenido o usuarios, con estado que define las transiciones permitidas (`pendiente`, `en_revision`, `resuelta`, `desestimada`).

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de los flujos descritos en CU-01 a CU-08 pasa los tests funcionales de QA sin errores en al menos dos navegadores soportados.
- **SC-002**: No se registran eventos en producción de creación de eventos con fecha pasada ni registros de usuarios con piso/departamento fuera de las reglas definidas durante al menos un mes después del despliegue.
- **SC-003**: Al menos el 95% de las sesiones de usuarios autenticados no presentan inconsistencias visibles en login, logout o refresh (medido a través de incidencias reportadas).
- **SC-004**: En escenarios de filtros y búsqueda sin resultados, el 100% de las pantallas muestra un mensaje informativo y permite limpiar filtros/búsqueda según tests de aceptación.
- **SC-005**: No se registran denuncias con transiciones de estado inválidas ni auto-denuncias en los logs del backend tras el despliegue de la iteración.

