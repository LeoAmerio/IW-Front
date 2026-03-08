# Spec — Flow 1: Autenticación — Inicio de Sesión

## User Story
Como **residente o administrador**, quiero ingresar con mi email y contraseña, para acceder al dashboard de mi consorcio.

---

## Acceptance Criteria

**AC-1 — Renderizado inicial**
- **Given** el usuario no está autenticado y navega a `/login`
- **When** la página carga
- **Then** se muestra el formulario con campo `email` (ícono `@`) y `password` (ícono llave), botón "Iniciar Sesion", botón "Volver atrás", link "¿No tiene cuenta? Cree una aquí" y link "Recuperar Contraseña"

**AC-2 — Redirección si ya autenticado**
- **Given** el usuario tiene un token válido en cookies y `isAuthenticated = true`
- **When** llega a `/login`
- **Then** `LoginClient` redirige automáticamente a `/dashboard` (o al `returnUrl`/`nextUrl` del query string) sin mostrar el formulario

**AC-3 — Estado de carga inicial**
- **Given** `isLoading = true` o `isCheckingAuth = true` en el store
- **When** el component renderiza
- **Then** se muestra un spinner con `<Progress value={33} />` y el texto "Verificando sesión..."

**AC-4 — Validación de email**
- **Given** el usuario ingresa un email con formato inválido (e.g. "nogmail")
- **When** intenta enviar el formulario
- **Then** aparece error bajo el campo: "Debe ser un correo valido."

**AC-5 — Validación de contraseña**
- **Given** el usuario ingresa una contraseña que no cumple el patrón `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/`
- **When** intenta enviar
- **Then** aparece error: "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"

**AC-6 — Envío exitoso**
- **Given** el usuario completa email y password válidos y hace submit
- **When** `useAuthStore.login()` llama `POST /auth/login/` y recibe `{ token, user_id, email }`
- **Then**:
  1. El token se almacena en cookie (`js-cookie`) y en el store de Zustand
  2. Se invoca `fetchUserData()` → `GET /auth/usuarios/:id` para obtener perfil completo
  3. Se muestra toast de éxito: "Inicio de sesión exitoso"
  4. Se redirige a `/dashboard` (o a `returnUrl`)

**AC-7 — Error en login**
- **Given** las credenciales son inválidas y la API devuelve error
- **When** el store setea `error`
- **Then**:
  1. Se muestra toast de error con el mensaje del store (duración 5000ms)
  2. Si el mensaje contiene "email" o "correo" → se setea error de campo en el input email
  3. Si contiene "contraseña" o "password" → se setea error de campo en el input password

**AC-8 — Loading durante petición**
- **Given** el usuario hizo submit y la petición está en curso
- **When** `isLoading = true` en el store
- **Then** se renderiza `<LinearProgress color="primary" />` (MUI) debajo del formulario

**AC-9 — Recuperar contraseña**
- **Given** el usuario hace clic en "Recuperar Contraseña"
- **When** el evento dispara `handleOpenResetPopup`
- **Then** se muestra el componente `<PasswordResetPopup isOpen={true} />` al costado del formulario

**AC-10 — Enlace a registro**
- **Given** el usuario hace clic en "¿No tiene cuenta? Cree una aquí"
- **Then** navega a `/signup`

---

## Component Map

| Archivo | Responsabilidad |
|---|---|
| `app/login/page.tsx` | Server component, importa y renderiza `<LoginClient />` |
| `components/forms/login-client.tsx` | Orquesta la lógica de auth check y toggle entre `LoginForm` y `SignupForm` |
| `components/forms/login-form.tsx` | Formulario con React Hook Form + Yup, llama `useAuthStore.login`, muestra errores y loading |
| `components/forms/PasswordResetPopup.tsx` | Modal de recuperación de contraseña |
| `components/ui/progress.tsx` | Barra de progreso shadcn/ui para estado de verificación |
| `store/auth/auth.store.ts` | `login()`, `fetchUserData()`, `isLoading`, `error`, `isAuthenticated` |
| `lib/api-client.ts` | Axios con interceptor de token y manejo de errores |

---

## Data Contract

### Interfaces
```ts
interface LoginRequest  { email: string; password: string }
interface LoginResponse { token: string; user_id: number; email: string }
// User completo → interfaces/user.interface.ts
```

### Endpoints
| Método | URL | Body | Response |
|---|---|---|---|
| POST | `/auth/login/` | `LoginRequest` | `LoginResponse` |
| GET | `/auth/usuarios/:id` | — | `User` |

### Yup Schema
```ts
email: yup.string().email("Debe ser un correo valido.").required(...)
password: yup.string()
  .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "...")
  .min(8, "...")
// HTML input también tiene minLength={8} — consistente con el schema Yup
```

---

## Edge Cases / Error States

| Caso | Comportamiento esperado |
|---|---|
| Red offline | `apiClient` response interceptor muestra toast de error genérico |
| 401 Unauthorized | Interceptor loguea advertencia, no redirige (para evitar loop en `/login`) |
| Token expirado en cookie (initializeAuth falla) | `fetchUserData` lanza error, se muestra toast "Error al obtener datos del usuario" |
| `returnUrl` con caracteres especiales | Se decodifica con `decodeURIComponent()` antes de redirigir |
| Campos vacíos al enviar | Yup detiene el envío y muestra errores de campo |
