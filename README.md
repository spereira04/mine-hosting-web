# Minecraft Hosting — React + Vite + TS (Clean Architecture)

**Capas**:
- **domain/**: Entidades y *ports* (interfaces de repositorios).
- **application/**: Casos de uso (orquestan reglas de negocio a través de los repos).
- **infrastructure/**: Implementaciones concretas (HTTP con Axios, interceptores, repos remotos).
- **presentation/**: UI (React), routing y estado de autenticación.

**HTTP con interceptors (Axios)**: `src/infrastructure/http/interceptors.ts` agrega el token `Bearer` automáticamente y maneja 401 deslogueando.

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

## Estructura rápida
```
src/
  domain/ (entities, repositories)
  application/ (usecases)
  infrastructure/ (http client + repos)
  presentation/ (pages, components, router, auth context)
  config/env.ts
```
