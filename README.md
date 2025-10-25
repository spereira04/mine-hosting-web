# Minecraft Hosting — React + Vite + TS (Clean Architecture)

**Capas**:
- **domain/**: Entidades y *ports* (interfaces de repositorios).
- **application/**: Casos de uso (orquestan reglas de negocio a través de los repos).
- **infrastructure/**: Implementaciones concretas (HTTP con Axios, interceptores, repos remotos).
- **presentation/**: UI (React), routing y estado de autenticación.

**HTTP con interceptors (Axios)**: `src/infrastructure/http/interceptors.ts` agrega el token `Bearer` automáticamente y maneja 401 deslogueando. Podés enganchar lógica común (`onRequest`, `onResponse`, `onError`).

## Scripts
```bash
npm install
npm run dev
npm run build
npm run preview
```

## Env
Crea un archivo `.env` en la raíz con:
```
VITE_API_URL=http://localhost:8080
```
O usá `.env.example` como base.

## Endpoints esperados del backend
- `POST /auth/login` → `{ token, user }`
- `POST /auth/signup` → `201 Created`
- `GET /auth/me` → `{ id, name, email }`
- `GET /servers` → `Server[]`
- `POST /servers` → `Server`
- `GET /servers/:id` → `Server`

> Ajustá las rutas si tu backend usa otra convención.

## Flujo de auth
- Token se guarda en `localStorage`.
- Interceptor añade `Authorization: Bearer <token>` automáticamente.
- Un `401` dispara `logout()`.

## Estructura rápida
```
src/
  domain/ (entities, repositories)
  application/ (usecases)
  infrastructure/ (http client + repos)
  presentation/ (pages, components, router, auth context)
  config/env.ts
```

## Próximos pasos sugeridos
- Agregar **React Query** o **Zustand** si querés cache y stores más avanzados.
- Manejar **roles** y **permisos** en `AuthContext`.
- Añadir CRUD completo de servidores (start/stop/delete), métricas y consola.
- Tests: unitarios (usecases) y de integración (repos http, interceptors).
- End‑to‑end con Playwright.
