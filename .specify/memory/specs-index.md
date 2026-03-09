# Housinger — Specs Index

> Generado el 2026-03-08 a partir del código fuente. Refleja el estado actual del repositorio.

## Flujos documentados

| # | Flujo | Archivo | Ruta | Acceso |
|---|---|---|---|---|
| 1 | Login | [spec-flow-1-login.md](./spec-flow-1-login.md) | `/login` | Público |
| 2 | Registro | [spec-flow-2-signup.md](./spec-flow-2-signup.md) | `/signup` | Público |
| 3 | Dashboard | [spec-flow-3-dashboard.md](./spec-flow-3-dashboard.md) | `/dashboard` | Autenticado |
| 4 | Gestión de Servicios | [spec-flow-4-servicios.md](./spec-flow-4-servicios.md) | `/gestion-servicios` | Autenticado |
| 5 | Gestión de Usuarios | [spec-flow-5-usuarios.md](./spec-flow-5-usuarios.md) | `/admin/gestion-usuarios` | Administrador |
| 6 | Reportes / Denuncias | [spec-flow-6-reportes.md](./spec-flow-6-reportes.md) | `/admin/reports` | Administrador |
| 7 | Eventos | [spec-flow-7-eventos.md](./spec-flow-7-eventos.md) | `/dashboard/events` | Autenticado |

---

## Notas sobre el estado actual del código

- **Flow 5 (Usuarios):** La tabla usa datos hardcodeados; la integración real con la API está pendiente (`// TODO` en el código).
- **Flow 6 (Reportes):** `reviewedReports` es estado local volátil (no persiste entre recargas). El manejo de errores en mutations solo hace `console.error`, sin toast.
- **Flow 7 (Eventos):** El tipo "Ocupacion Espacios Comunes" existe en el enum `EventoTypoEnum` pero no está en el Select del dialog actual.
- **Autenticación:** La validación de contraseña en el Yup schema del login tiene el regex complejo; **el campo en el HTML (`minLength=6`) está en conflicto con el schema Yup (mínimo 8)**. El schema Yup es el que prevalece al validar.
