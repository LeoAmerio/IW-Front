# Spec — Flow 2: Autenticación — Registro

## User Story
Como **nuevo residente**, quiero registrarme proporcionando mis datos de contacto y ubicación en el edificio, para poder acceder a la plataforma de gestión de mi consorcio.

---

## Acceptance Criteria

**AC-1 — Renderizado del formulario**
- **Given** el usuario navega a `/signup`
- **When** la página carga
- **Then** se renderiza el formulario con: Email, Nombre, Apellido, Edificio (Select), Piso, Departamento (numero), Contraseña, Confirmar contraseña; botón "Registrarse" y botón "Volver atrás"

**AC-2 — Lista de edificios**
- **Given** el formulario está montado
- **When** `useQuery(['edificios'], fetchEdificios)` llama `GET /propiedades/edificios/`
- **Then** el Select de Edificio se llena con los nombres de los edificios disponibles; mientras carga, el botón "Registrarse" tiene `disabled={isLoading}`

**AC-3 — Validaciones de campo**
- **Given** el usuario intenta enviar el formulario con datos inválidos
- **When** Yup valida el schema
- **Then** se muestran los mensajes de error en rojo bajo cada campo:
  - email inválido → "Email no valido"
  - nombre vacío → "El nombre es obligatorio"
  - apellido vacío → "El apellido es obligatorio"
  - password < 8 chars → "La contraseña debe tener mínimo 8 caracteres."
  - confirmPassword diferente → "Las contraseñas deben coincidir" o "Debes confirmar la nueva contraseña."
  - edificio no seleccionado → "Se debe seleccionar un edificio"

**AC-4 — Validación cruzada piso / número**
- **Given** el usuario ingresa piso pero deja número vacío (o viceversa)
- **When** hace submit
- **Then** se setea error manual: "Debe completar el piso si ha ingresado el número" / "Debe completar el número si ha ingresado el piso"

**AC-5 — Campo Piso — solo números**
- **Given** el usuario escribe en el campo Piso
- **When** presiona una tecla que no es dígito (excepto Backspace, Delete, Tab)
- **Then** la tecla es bloqueada con `e.preventDefault()`; el input tiene `inputMode="numeric"` y `pattern="[0-9]*"`

**AC-6 — Campo Departamento — solo letras, 1 char, auto-mayúscula**
- **Given** el usuario escribe en el campo Departamento
- **When** escribe más de 1 caracter o un no-letra
- **Then** la tecla es bloqueada; el input tiene `maxLength={1}`; el valor se convierte a mayúscula automáticamente con `onInput`

**AC-7 — Envío exitoso**
- **Given** todos los campos son válidos y las contraseñas coinciden
- **When** `signupMutation.mutate(data)` llama `POST /auth/registro/` con `{ email, nombre, apellido, password, rol: 3, edificio, piso, numero }`
- **Then**:
  1. Si la respuesta es exitosa, se muestra toast: `${data.message}` (duración 5000ms)
  2. Se redirige a `/dashboard`

**AC-8 — Error 400 email duplicado**
- **Given** el email ya está registrado y la API devuelve `{ email: ["..."] }` con status 400
- **Then** se muestra toast de error: `errorData.email[0]`

**AC-9 — Estado "Registrando"**
- **Given** la mutación está en curso (`isLoading = true`)
- **Then** el botón "Registrarse" muestra "Registrando..." con ícono `<Loader2 animate-spin />`

**AC-10 — Botón Volver atrás**
- **Given** el usuario hace clic en "Volver atrás"
- **Then** se navega a `/` (página de landing)

**AC-11 — Link "¿Ya tienes cuenta?"**
- **Given** el usuario hace clic en "¿Ya tienes cuenta?"
- **Then** navega a `/login`

---

## Component Map

| Archivo | Responsabilidad |
|---|---|
| `app/signup/page.tsx` | Server component, renderiza `<SignupClient />` |
| `components/forms/signup-client.tsx` | Variante principal del registro; contiene el form con shadcn/ui Cards |
| `components/forms/signup-form.tsx` | Variante legacy (embebida en LoginClient como toggle `isRegistering`); misma lógica |
| `api/propiedades.api.ts` | `getEdificios()` → `GET /propiedades/edificios/` |

---

## Data Contract

### Interfaces
```ts
interface SignupFormData {
  email: string; nombre: string; apellido: string
  password: string; confirmPassword: string
  edificio: number; piso: number; numero: string
}
interface Edificio { id: number; nombre: string; direccion: string; numero: number; ciudad: string }
```

### Endpoints
| Método | URL | Body | Response |
|---|---|---|---|
| GET | `/propiedades/edificios/` | — | `Edificio[]` |
| POST | `/auth/registro/` | `{ email, nombre, apellido, password, rol: 3, edificio, piso, numero }` | `{ message: string }` |

### Yup Schema
```ts
email: string().email("Email no valido").required("Email es obligatorio")
nombre/apellido: string().required(...)
password: string().min(8, "La contraseña debe tener mínimo 8 caracteres.").required(...)
confirmPassword: string().oneOf([ref("password")], "Las contraseñas deben coincidir").required(...)
edificio: number().required("Se debe seleccionar un edificio")
piso: number().required()
numero: string().required()
```

---

## Edge Cases / Error States

| Caso | Comportamiento esperado |
|---|---|
| API de edificios no disponible | `useQuery` falla silenciosamente; el Select queda vacío; botón submit sigue activo |
| Error genérico (no 400) | `onError` del mutation muestra toast con `error.message` |
| Contraseñas que coinciden en Yup pero el onSubmit detecta diferencia | Se setea error manual en `confirmPassword` y se aborta el envío |
| Edificio Select vacío (isLoading) | Botón submit deshabilitado mientras edificios cargan |
