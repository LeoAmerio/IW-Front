# Quickstart: Verificación de Correcciones CU-01 a CU-08

## Precondiciones

- Backend de Housinger accesible con `NEXT_PUBLIC_API_ENDPOINT` configurado.
- Al menos un usuario por rol: inquilino, colaborador, administrador.
- Navegador limpio (sin sesiones previas) o modo incógnito.

## Pasos Rápidos por Caso de Uso

### CU-01 – Registro: piso y departamento

1. Navegar a `/signup`.
2. Completar el formulario con datos válidos, incluyendo:
   - `piso = 3`
   - `departamento = "A"`
3. Enviar el formulario y verificar que:
   - No se muestra error en piso/departamento.
4. Repetir cambiando:
   - `piso = 0`, `-1`, vacío y texto no numérico → el formulario no se envía y se muestra error claro.
   - `departamento = ""`, `"AB"`, `"1"` → el formulario no se envía y se muestra error claro.

### CU-02 – Login/logout/refresh

1. Navegar a `/login` y autenticarte con un usuario válido.
2. Verificar redirección a `/dashboard`.
3. Refrescar la página y confirmar que la sesión sigue activa.
4. Hacer clic en “Cerrar sesión” (desde menú o botón dedicado).
5. Confirmar que se redirige al login y que un refresh no restaura la sesión.
6. Loguearse con otro usuario y confirmar que los datos visibles corresponden al nuevo usuario.

### CU-03 – Creación de eventos sin fecha pasada

1. Como usuario autenticado, ir al listado de eventos y abrir el diálogo de creación.
2. Crear un evento con fecha de hoy o futura → debe guardarse correctamente.
3. Intentar crear un evento con fecha de ayer → el formulario debe bloquear el envío y mostrar un mensaje de error.

### CU-04 – Filtro sin resultados

1. Ir al listado de posteos.
2. Aplicar filtros que devuelvan resultados → se ven los posteos filtrados.
3. Ajustar filtros a una combinación que no tenga resultados conocidos.
4. Verificar que:
   - No se muestran tarjetas de posteos.
   - Aparece un mensaje “No se encontraron posteos para los filtros seleccionados”.
   - Existe una forma clara de limpiar filtros.

### CU-07 – Restaurar listado tras búsqueda

1. En el listado de posteos, ingresar un término de búsqueda con resultados.
2. Verificar que se muestran solo los posteos correspondientes.
3. Borrar el término de búsqueda o usar “limpiar búsqueda”.
4. Confirmar que el listado completo se restaura sin recargar la app (SPA).

### CU-05 – Servicios para colaboradores

1. Loguearse como usuario con rol colaborador.
2. Ir al gestor de servicios y seleccionar “Crear servicio”.
3. Verificar que el campo de tipos de servicio está poblado.
4. Completar datos válidos y guardar → el servicio se crea correctamente.
5. Simular (en entorno de pruebas) el caso de lista de tipos vacía y confirmar que:
   - Se muestra mensaje explicativo.
   - El botón de guardar está deshabilitado o la acción no se permite.

### CU-06 – Transición de denuncia desde “en_revision”

1. Acceder como usuario con permisos de gestión de denuncias.
2. Abrir una denuncia en estado `en_revision`.
3. Confirmar que:
   - No existe acción para volver a `pendiente`.
   - Solo se muestran transiciones válidas (por ejemplo, a `resuelta` o `desestimada`).

### CU-08 – Impedir auto-denuncia

1. Loguearse como usuario A y crear un posteo.
2. Navegar al posteo recién creado y revisar las acciones.
3. Confirmar que **no** aparece el botón de “Denunciar”.
4. Intentar disparar una denuncia manualmente (herramientas de desarrollador) sobre ese posteo.
5. Verificar que la acción es rechazada y no se registra denuncia.

