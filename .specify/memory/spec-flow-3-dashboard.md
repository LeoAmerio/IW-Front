# Spec — Flow 3: Dashboard — Página Principal

## User Story
Como **residente autenticado**, quiero ver el mural de publicaciones de mi consorcio, poder crear posts, filtrarlos y ver el detalle de cada uno, para mantenerme informado y comunicado con mis vecinos.

---

## Acceptance Criteria

**AC-1 — Ruta protegida**
- **Given** el usuario no está autenticado y navega a `/dashboard`
- **Then** el middleware redirige a `/login?returnUrl=/dashboard`

**AC-2 — Layout del dashboard**
- **Given** el usuario autenticado está en cualquier ruta `/dashboard/*`
- **Then** el layout renderiza: `SideNav` (w-64) a la izquierda, `Header` arriba, y el contenido principal en el área restante

**AC-3 — Lista de posteos**
- **Given** el usuario llega al dashboard
- **When** `useQuery(['posts', appliedFilters], fetchPosts)` llama `GET /posteos/?...params`
- **Then** se muestran los `Posteo` del edificio como `<PostCard>` ordenados según el criterio aplicado; mientras carga aparece "Cargando posteos..."

**AC-4 — Crear posteo (trigger)**
- **Given** el usuario hace clic en la card "Realizar posteo..."
- **Then** se abre el dialog "Crear nuevo posteo" con campos: Título (Input), Descripción (Textarea), Tipo de publicación (Select: AVISO=1, CONSULTA=2, RECLAMO=3), Imagen (file input, opcional)

**AC-5 — Crear posteo (submit)**
- **Given** el usuario completa los campos y hace clic en "Publicar"
- **When** `createPost(data)` llama la API
- **Then** el dialog se cierra, se llama `refetch()` para actualizar la lista

**AC-6 — Editar posteo**
- **Given** el usuario hace clic en editar desde un `PostCard`
- **Then** el dialog se abre en modo "Editar posteo" con los campos pre-llenados (título, descripción, tipo_posteo_id); el campo imagen **no** se muestra en modo edición

**AC-7 — Filtro de posteos**
- **Given** el usuario hace clic en el botón de filtros (ícono `ManageSearchIcon`)
- **Then** se abre un dialog "Filtrar posteos" con:
  - Select "Usuario" (lista dinámica de autores de los posts: piso + número)
  - Select "Tipo de posteo" (Aviso / Consulta / Reclamo)
  - Select "Ordenar por fecha de creación" (Más recientes / Más antiguos)
  - Botones "Aplicar filtros" y "Limpiar filtros"

**AC-8 — Aplicar filtros**
- **Given** el usuario selecciona criterios y hace clic en "Aplicar filtros"
- **When** `applyFilters()` actualiza `appliedFilters`
- **Then** `useQuery` se re-ejecuta con los nuevos params `?usuario=&tipo_posteo=&ordering=` y el dialog se cierra

**AC-9 — Limpiar filtros**
- **Given** hay filtros activos
- **When** el usuario hace clic en "Limpiar filtros"
- **Then** todos los filtros se resetean a vacío y se llama `refetch()`

**AC-10 — Búsqueda de texto (debounce)**
- **Given** el usuario escribe en el input "Buscar Posteos..."
- **When** el texto cambia, con debounce de 300ms
- **Then** se llama `GET ${BASE_URL}${searchTerm}` con el token en header; los resultados aparecen en un dropdown (título + tipo); mientras busca se muestra `<LinearProgress />`

**AC-11 — Seleccionar post desde búsqueda**
- **Given** el usuario hace clic en un resultado del dropdown
- **Then** se setea `selectedPost` y se renderiza `<PostDetail>` en lugar de la lista; el término de búsqueda se limpia

**AC-12 — Empty state**
- **Given** no hay posteos en el edificio
- **Then** la lista aparece vacía (sin mensaje explícito según el código actual)

---

## Component Map

| Archivo | Responsabilidad |
|---|---|
| `app/dashboard/page.tsx` | Server component, renderiza `<PostsSection />` |
| `app/dashboard/layout.tsx` | Layout: SideNav + Header + main content |
| `components/ui/dashboard/posts-section.tsx` | Orquesta lista, filtros, búsqueda, creación y edición de posteos |
| `components/Posts/post-card.tsx` | Card de un posteo individual con acción de editar |
| `components/Posts/post-detail.tsx` | Vista de detalle de un posteo (seleccionado por búsqueda) |
| `store/post-store.ts` | Estado global del posteo seleccionado (`posteo`, `setPosteo`, `clearPosteo`) |
| `api/edificios.api.ts` | `getPosts(params)`, `postPost(posteo)`, `editPost(posteo, id)` |

---

## Data Contract

### Interfaces
```ts
interface Posteo {
  id: number; titulo: string; descripcion: string
  fecha_creacion_legible: string; imagen: string | null
  tipo_posteo: { id: number; tipo: string }
  usuario: User
  respuestas: Answers[]
}
interface PosteoRequest {
  titulo: string; descripcion: string
  tipo_posteo_id: number; imagen?: string | File | null
}
interface SearchParams { usuario: number; tipo_posteo: string; ordering: string }
enum PosteoTypoEnum { Reclamo = "Reclamo", Consulta = "Consulta", Aviso = "Aviso" }
```

### Endpoints
| Método | URL | Body | Response |
|---|---|---|---|
| GET | `/posteos/?usuario=&tipo_posteo=&ordering=` | — | `Posteo[]` |
| POST | `/posteos/` | `PosteoRequest` (multipart) | `Posteo` |
| PUT/PATCH | `/posteos/:id` | `Partial<PosteoRequest>` (sin imagen) | `Posteo` |
| GET | `${BASE_URL}${term}` (search) | — | `PosteoSearch[]` |

---

## Edge Cases / Error States

| Caso | Comportamiento esperado |
|---|---|
| Imagen > límite del servidor | La API retorna error; no hay manejo explícito en el cliente actual |
| Sin resultados de búsqueda | Dropdown muestra "No se pudo encontrar lo que se está buscando, pruebe con otra búsqueda" |
| Búsqueda en curso | `<LinearProgress />` aparece sobre el input |
| Modal cerrado sin submit | `resetForm()` restaura los valores por defecto, limpia `imagePreview` |
| `fecha_creacion_legible` ausente | El campo existe en la interfaz pero el renderizado depende de `PostCard` |
