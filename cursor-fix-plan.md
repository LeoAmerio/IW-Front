# Plan de Correcciones para Cursor - Housinger App

## 🎯 Orden de Ejecución Recomendado

### **PRIORIDAD ALTA - Problemas Críticos de Autenticación**

## 1. **Problema: Login no redirige al dashboard**

### 📋 Prompt para Cursor:
```
Revisa el flujo de autenticación en el login. El problema es que cuando ingreso credenciales correctas, no me redirige al dashboard.

Analiza estos archivos:
- components/forms/login-form.tsx
- components/forms/login-client.tsx  
- services/auth.service.ts
- store/auth/auth.store.ts
- app/login/page.tsx

Necesito que:
1. Verifiques la lógica de redirección después del login exitoso
2. Confirmes que se está actualizando correctamente el estado de autenticación
3. Asegures que la navegación programática al dashboard funcione
4. Verifica si hay algún middleware o guard que esté bloqueando la redirección

Usa Next.js App Router, Redux para state management, y el patrón de redirección debería ser hacia '/dashboard'
```

---

## 2. **Problema: Formulario de registro con UI rota**

### 📋 Prompt para Cursor:
```
Hay problemas críticos en el formulario de signup:

1. El formulario está desfasado visualmente con respecto al diseño
2. El botón "Volver atrás" no se ve (está oscuro) y no funciona
3. No hay manera de salir del signup una vez que se está en esa página

Revisa y corrige:
- components/forms/signup-form.tsx
- components/forms/signup-client.tsx
- app/signup/page.tsx
- app/signup/layout.tsx

Necesito que:
1. Fixes el styling del botón "Volver atrás" para que sea visible
2. Implementes la funcionalidad del botón para navegar de vuelta al login
3. Corrijas cualquier problema de layout o responsive design
4. Agregues una alternativa de navegación (como un enlace "Ya tienes cuenta?")

Usa TailwindCSS para los estilos y asegúrate de que esté alineado con el diseño del login.
```

---

### **PRIORIDAD MEDIA - Validaciones y Funcionalidades**

## 3. **Problema: Denuncias - tipos no funcionan**

### 📋 Prompt para Cursor:
```
Hay un problema con el sistema de denuncias. Algunos tipos de denuncia no se pueden realizar, pero "Spam" sí funciona.

Busca archivos relacionados con denuncias y revisa:
1. El componente de formulario de denuncias
2. La validación del tipo de denuncia
3. El servicio API que envía las denuncias
4. Los tipos/interfaces de denuncia

Necesito que:
1. Identifies por qué solo "Spam" funciona y otros tipos fallan
2. Verifiques la validación del frontend y backend
3. Corrijas la lógica para que todos los tipos de denuncia funcionen
4. Asegures que el dropdown/select de tipos esté poblado correctamente

Revisa console.log y network tab para identificar errores específicos.
```

---

## 4. **Problema: Validación de horas en eventos**

### 📋 Prompt para Cursor:
```
En la creación de eventos, ya se resolvió que no se pueden crear eventos con fecha anterior a la actual, pero faltan estas validaciones:

1. La hora de fin no puede ser anterior a la hora de inicio
2. Si el evento es el día actual, la hora de inicio no puede ser anterior a la hora actual

Busca el componente de creación/edición de eventos en:
- app/dashboard/events/page.tsx o archivos relacionados
- Formularios de eventos

Implementa estas validaciones:
1. Comparación de horas inicio vs fin
2. Validación de hora mínima para eventos del día actual
3. Mensajes de error claros para el usuario
4. Actualización en tiempo real de las validaciones

Usa validación tanto en el cliente como preparación para validación del servidor.
```

---

## 5. **Problema: Filtros sin reset en gestión de servicios**

### 📋 Prompt para Cursor:
```
En la gestión de servicios, cuando filtro por tipo de servicio, no puedo restablecer el filtro para volver a ver todos los servicios.

Revisa:
- app/gestion-servicios/page.tsx
- components/servicios-gestion/gestion-servicios-client.tsx

Necesito que:
1. Agregues un botón/opción "Mostrar todos" o "Limpiar filtros"
2. Implementes la funcionalidad para resetear los filtros
3. Asegures que el estado se actualice correctamente
4. Mantengas una UX consistente con otros filtros de la app

La solución debe ser intuitiva y accesible para el usuario.
```

---

## 6. **Problema: Filtros sin reset en gestión de usuarios**

### 📋 Prompt para Cursor:
```
Mismo problema que gestión de servicios: en gestión de usuarios cuando filtro por rol, no puedo volver a ver todos los usuarios.

Revisa:
- app/admin/gestion-usuarios/page.tsx  
- components/gestion-usuarios/gestion-usuarios-client.tsx

Implementa la misma solución que para servicios:
1. Botón para resetear filtros de rol
2. Funcionalidad para mostrar todos los usuarios
3. Estado consistente
4. UX similar al resto de la aplicación
```

---

### **PRIORIDAD MEDIA-BAJA - Mejoras de UX**

## 7. **Problema: Usuarios administrador visibles en gestión**

### 📋 Prompt para Cursor:
```
En la gestión de usuarios, no debe mostrarse el usuario con rol "Administrador".

Revisa:
- components/gestion-usuarios/gestion-usuarios-client.tsx
- La query/servicio que obtiene los usuarios

Necesito que:
1. Filtres los usuarios con rol "Administrador" antes de mostrarlos
2. Asegures que esto se aplique tanto en la vista general como en búsquedas
3. Mantengas esta exclusión en todas las operaciones de la gestión
4. No rompas la funcionalidad de filtros existente

Esto debe ser una exclusión permanente en el frontend para esta vista específica.
```

---

## 8. **Problema: Campos editables en modificación de usuario**

### 📋 Prompt para Cursor:
```
Cuando se quiere modificar un usuario en la gestión, no deben estar todos los campos disponibles para editar. Necesito definir cuáles son de solo lectura y cuáles editables.

Revisa:
- components/gestion-usuarios/user-dialog.tsx (modal de edición)

Analiza qué campos deberían ser:

SOLO LECTURA (típicamente):
- ID del usuario
- Fecha de creación  
- Email (si se usa para login)
- Algunos campos de auditoría

EDITABLES (típicamente):
- Nombre
- Apellido  
- Rol
- Estado activo/inactivo
- Teléfono (si aplica)

Implementa:
1. Campos de solo lectura con styling diferente
2. Validaciones solo para campos editables
3. UI clara que distinga entre campos editables y no editables
4. Mantén la funcionalidad de guardado solo para campos permitidos
```

---

### **PRIORIDAD BAJA - Navegación y UX**

## 9. **Problema: No se puede cerrar sesión desde gestiones**

### 📋 Prompt para Cursor:
```
Desde cualquiera de las tres gestiones (Servicios, Denuncias, Usuarios) no se puede cerrar sesión.

Revisa:
- Los layouts de estas páginas
- app/gestion-servicios/layout.tsx
- app/admin/gestion-usuarios/layout.tsx  
- El componente de header/navbar en estas vistas
- La funcionalidad de logout global

Necesito que:
1. Identifiques por qué el botón/opción de logout no aparece o no funciona
2. Asegures que el header con logout esté presente en todas las gestiones
3. Verifiques que la funcionalidad de logout funcione correctamente
4. Mantengas consistencia visual con el resto de la app

El logout debe estar siempre disponible para el usuario desde cualquier página autenticada.
```

---

## 10. **Problema: Logo como botón innecesario**

### 📋 Prompt para Cursor:
```
Después de loguearse, la imagen/logo de "Housinger" arriba a la izquierda no debe ser un botón ni debe redirigir a ninguna página principal.

Busca:
- El componente de header/navbar principal del dashboard
- Cualquier componente de logo en layouts autenticados

Necesito que:
1. Elimines la funcionalidad de click del logo
2. Remuevas el cursor pointer y hover states
3. Mantengas el logo como elemento visual decorativo únicamente  
4. Asegures que no haya navegación accidental

El logo debe ser puramente visual una vez que el usuario está logueado.
```

---

## 📝 Instrucciones de Uso

### **Para cada prompt:**

1. **Copia el prompt completo** en Cursor
2. **Deja que Cursor analice** los archivos mencionados
3. **Revisa las sugerencias** antes de aplicar
4. **Prueba la funcionalidad** después de cada cambio
5. **Marca como completado** y pasa al siguiente

### **Orden recomendado de ejecución:**
1. Problemas de autenticación (1-2) - **CRÍTICO**
2. Validaciones y funcionalidades (3-4) - **ALTO IMPACTO**  
3. Filtros y UX (5-6) - **MEJORA USUARIO**
4. Gestión de usuarios (7-8) - **REFINAMIENTO**
5. Navegación final (9-10) - **PULIDO**

### **Tips adicionales:**
- **Un problema a la vez** - No mezcles prompts
- **Testea inmediatamente** después de cada cambio
- **Commitea cambios** funcionalmente antes de continuar
- **Si algo no funciona**, comparte el error específico con Cursor

---

## 🎯 Resultado esperado
Al completar todos estos prompts, deberías tener:
✅ Login funcionando correctamente  
✅ Signup con UI y navegación arreglada
✅ Todos los tipos de denuncia funcionando
✅ Validaciones completas en eventos
✅ Filtros con reset en todas las gestiones  
✅ Gestión de usuarios refinada y segura
✅ Navegación consistente en toda la app
