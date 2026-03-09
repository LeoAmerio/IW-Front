# Propuestas de Rules para Cursor

## Propuesta 1: Estándares de Desarrollo y Stack Tecnológico

```yaml
---
description: Estándares para el stack tecnológico y forma de trabajo del frontend
globs:
  - src/**/*
  - components/**/*
  - hooks/**/*
  - services/**/*
alwaysApply: true
---

Stack Tecnológico
- Estilos: Usar exclusivamente TailwindCSS para todos los estilos.
- UI Components: Solo utilizar ShadcnUI o AccernityUI como librerías de componentes.
- HTTP Requests: Usar Axios para todas las peticiones al backend.
- Data Fetching: Implementar react-query (TanStack Query) para manejo de estado del servidor.
- State Management: Utilizar Redux para gestión de estado global de la aplicación.
- Custom Hooks: Crear custom hooks cuando sea necesario para reutilizar lógica.

Estructura de Archivos
- Organizar componentes por feature/dominio
- Separar hooks personalizados en carpeta `/hooks`
- Agrupar servicios API en carpeta `/services`
- Mantener stores de Redux organizados por slices

Convenciones de Código
- Nombrar componentes con PascalCase
- Hooks personalizados deben comenzar con 'use'
- Archivos de servicios terminan con '.service.ts'
- Constantes en UPPER_SNAKE_CASE

Templates
@component-with-query.tsx
@custom-hook-template.ts
@redux-slice-template.ts
@api-service-template.ts
```

## Propuesta 2: Buenas Prácticas y Arquitectura

```yaml
---
description: Buenas prácticas de desarrollo, Clean Architecture y principios SOLID
globs:
  - src/**/*
  - test/**/*
  - __tests__/**/*
alwaysApply: true
---

Clean Architecture
- Separar lógica de negocio de la presentación
- Implementar capas: Presentation → Domain → Infrastructure
- Usar casos de uso (use cases) para lógica compleja
- Aplicar inversión de dependencias con interfaces

Principios SOLID
- Single Responsibility: Cada componente/función debe tener una sola razón para cambiar
- Open/Closed: Abierto para extensión, cerrado para modificación
- Liskov Substitution: Los subtipos deben ser sustituibles por sus tipos base
- Interface Segregation: Preferir interfaces específicas sobre genéricas
- Dependency Inversion: Depender de abstracciones, no de concreciones

Testing
- Escribir tests unitarios para custom hooks y utilidades
- Implementar tests de integración para flujos críticos
- Usar React Testing Library para componentes
- Mantener cobertura mínima del 80%
- Seguir patrón AAA (Arrange, Act, Assert)

Code Quality
- Aplicar ESLint y Prettier consistentemente
- Usar TypeScript estricto (strict: true)
- Implementar validación de props con PropTypes o TypeScript
- Evitar any, preferir tipos específicos
- Documentar funciones complejas con JSDoc

Performance
- Implementar lazy loading para componentes pesados
- Usar React.memo para componentes que re-renderizan frecuentemente
- Optimizar queries con react-query (staleTime, cacheTime)
- Implementar virtualization para listas largas

Templates
@test-component-template.test.tsx
@custom-hook-test-template.test.ts
@use-case-template.ts
```

## Propuesta 3: Configuración de Proyecto y DevOps

```yaml
---
description: Configuración de entorno, CI/CD, y herramientas de desarrollo
globs:
  - "*.config.*"
  - ".env*"
  - "package.json"
  - ".github/**/*"
  - "docker*"
  - "public/**/*"
alwaysApply: true
---

Environment Configuration
- Usar variables de entorno para configuraciones
- Separar configs por ambiente (.env.local, .env.production)
- Validar variables de entorno al inicio de la aplicación
- No commitear archivos .env con datos sensibles
- Usar .env.example como plantilla

Build & Deployment
- Configurar scripts de build optimizados
- Implementar pre-commit hooks con husky
- Usar semantic versioning para releases
- Configurar bundle analyzer para optimización
- Implementar Progressive Web App (PWA) si es necesario

CI/CD Pipeline
- Ejecutar tests automáticamente en PRs
- Validar linting y formatting en pipeline
- Implementar deployment automático a staging
- Configurar checks de calidad de código
- Usar actions para GitHub o equivalente

Development Tools
- Configurar VSCode settings compartidos (.vscode/)
- Usar commitlint para mensajes de commit consistentes
- Implementar changelog automático
- Configurar debugging para desarrollo
- Usar Storybook para documentación de componentes

Security & Performance
- Implementar Content Security Policy (CSP)
- Configurar HTTPS en desarrollo y producción
- Optimizar imágenes automáticamente
- Implementar lazy loading de rutas
- Configurar service worker para caching

Documentation
- Mantener README.md actualizado con setup instructions
- Documentar APIs y componentes principales
- Crear guías de contribución (CONTRIBUTING.md)
- Usar TypeDoc para documentación automática
- Mantener changelog de versiones

Templates
@github-workflow-template.yml
@dockerfile-template
@env-template
@vscode-settings-template.json
```

---

## Notas de Implementación

### Propuesta 1 - Stack Tecnológico
Se enfoca en establecer las herramientas y librerías específicas que debe usar el equipo, garantizando consistencia en el desarrollo.

### Propuesta 2 - Buenas Prácticas
Implementa principios de ingeniería de software para mantener código limpio, testeable y mantenible a largo plazo.

### Propuesta 3 - DevOps y Configuración
Asegura que el proyecto tenga la infraestructura necesaria para un desarrollo profesional y despliegues confiables.

Cada rule puede aplicarse independientemente o en conjunto, dependiendo de las necesidades del proyecto y el nivel de madurez del equipo de desarrollo.
