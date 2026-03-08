# Spec — Flow 7: Eventos (Calendario)

## User Story
Como **residente o administrador**, quiero crear y ver eventos del consorcio en un calendario, para estar al tanto de reuniones, reformas, limpiezas y otras actividades planificadas.

---

## Acceptance Criteria

**AC-1 — Vista del calendario**
- **Given** el usuario navega a `/dashboard/events`
- **Then** se muestra un calendario (componente tipo `react-big-calendar` u otro) con los eventos del edificio marcados en sus fechas

**AC-2 — Abrir dialog de creación desde el calendario**
- **Given** el usuario hace clic en un slot de fecha vacío en el calendario
- **When** el componente de calendario llama `onOpenChange(true)` con `defaultDate: { start, end }`
- **Then** se abre `<EventDialog>` con `fecha_inicio` y `fecha_fin` pre-seteados a la fecha del slot seleccionado

**AC-3 — Campos del formulario de evento**
- **Given** el dialog está abierto
- **Then** se muestran los campos:
  - Título (input text, requerido)
  - Descripción (input text, requerido)
  - Fecha de Inicio (DatePicker con hora — `showTimeSelect`, `dateFormat="dd/MM/yyyy HH:mm:ss"`, `minDate = new Date()`)
  - Fecha de Fin (DatePicker con hora — `minDate = fecha_inicio`)
  - Tipo de evento (Select: Mantenimiento=1 / Limpieza=2 / Reformas=3 / Reunión de Consorcio=4)
  - Repetir en días de la semana (botones L/M/M/J/V/S/D toggle)

**AC-4 — Validación del formulario**
- **Given** el usuario intenta enviar con campos vacíos
- **Then** Yup muestra errores bajo cada campo:
  - `titulo`: "El título es requerido"
  - `descripcion`: "La descripción es requerida"
  - `fecha_inicio`: "La fecha de inicio es requerida"
  - `fecha_fin`: "La fecha de fin es requerida"
  - `tipo_evento_id`: "El tipo de evento es requerido"
- **Given** `fecha_fin <= fecha_inicio`
- **Then** error de schema: "La hora de fin debe ser posterior a la de inicio"

**AC-5 — Auto-corrección de fecha de fin**
- **Given** el usuario cambia `fecha_inicio` a una fecha posterior a `fecha_fin`
- **When** el `useEffect` detecta `fecha_fin < fecha_inicio`
- **Then** `fecha_fin` se actualiza automáticamente para igualar a `fecha_inicio`

**AC-6 — Repetición semanal**
- **Given** el usuario selecciona días de la semana (botones toggle L/M/M/J/V/S/D)
- **When** hace clic en un botón
- **Then** el día se agrega/remueve del array `dias_repeticion`; el botón activo se colorea azul

**AC-7 — Generación de eventos recurrentes**
- **Given** el usuario completó el formulario con `dias_repeticion` no vacío y hace submit
- **When** `handleFormSubmit` invoca `generateRecurringEvents`
- **Then** se genera un evento por cada ocurrencia del/los día(s) elegido(s) entre `fecha_inicio` y `fecha_fin` (o fin de año, lo que ocurra antes); cada evento tiene `fecha_inicio` y `fecha_fin` formateados como `"yyyy-MM-dd HH:mm:ss"`

**AC-8 — Envío sin repetición**
- **Given** `dias_repeticion` está vacío
- **When** el usuario hace submit
- **Then** `generateRecurringEvents` retorna un array de un solo evento con las fechas formateadas

**AC-9 — Callback de submit**
- **Given** el formulario es válido
- **When** el usuario hace clic en "Crear"
- **Then** se llama `onSubmit(events)` — el componente padre realiza las llamadas a la API y cierra el dialog en caso de éxito

**AC-10 — Cancelar**
- **Given** el usuario hace clic en "Cancelar"
- **Then** `onOpenChange(false)` cierra el dialog sin enviar datos

---

## Component Map

| Archivo | Responsabilidad |
|---|---|
| `app/dashboard/events/page.tsx` | Server component, renderiza el cliente de eventos |
| `components/events/event-dialog.tsx` | Dialog de creación de evento con RHF + Yup + DatePicker + toggle de días |
| `components/calendar/` | Componente(s) de calendario que renderizan los eventos y disparan `EventDialog` |
| `api/eventos.api.ts` (inferido) | CRUD de eventos |

---

## Data Contract

### Interfaces
```ts
interface EventRequest {
  titulo: string
  descripcion: string
  fecha_inicio: Date        // se formatea a "yyyy-MM-dd HH:mm:ss" antes del envío
  fecha_fin: Date           // ídem
  tipo_evento_id: number
}

interface EventResponse {
  id: number; titulo: string; descripcion: string
  fecha_inicio: string; fecha_fin: string
  usuario: number
  tipo_evento: { id: number; tipo: string }
}
```

### Tipos de evento (hardcoded en dialog)
```ts
{ value: "1", label: "Mantenimiento" }
{ value: "2", label: "Limpieza" }
{ value: "3", label: "Reformas" }
{ value: "4", label: "Reunión de Consorcio" }
// Nota: "Ocupacion Espacios Comunes" está en el enum EventoTypoEnum pero no aparece en el Select del dialog actual
```

### Días de semana (toggle buttons)
```ts
[{ letra: 'L', numero: 1 }, { letra: 'M', numero: 2 }, { letra: 'M', numero: 3 },
 { letra: 'J', numero: 4 }, { letra: 'V', numero: 5 }, { letra: 'S', numero: 6 },
 { letra: 'D', numero: 0 }]
// numero = dayOfWeek de JavaScript (0 = Domingo)
```

### Endpoints (inferidos)
| Método | URL | Body | Response |
|---|---|---|---|
| GET | `/eventos/` | — | `EventResponse[]` |
| POST | `/eventos/` | `EventRequest` (uno o array por evento recurrente) | `EventResponse` |

---

## Edge Cases / Error States

| Caso | Comportamiento esperado |
|---|---|
| `fecha_fin` anterior a `fecha_inicio` al abrir | El `useEffect` lo corrige automáticamente a `fecha_inicio` |
| `fecha_inicio` en el pasado (minDate) | El DatePicker bloquea fechas anteriores a `new Date()` |
| `dias_repeticion` con rango grande | `generateRecurringEvents` itera hasta `fecha_fin` o fin de año, lo que ocurra primero |
| "Ocupacion Espacios Comunes" | El enum existe en `types.ts` pero el Select del dialog no lo incluye actualmente |
| Error de API al crear | El manejo depende del componente padre (el dialog solo invoca `onSubmit`) |
