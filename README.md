# FinDúo

Monorepo fullstack para una PWA de finanzas para parejas.

## Stack

- Monorepo con pnpm workspaces y Turborepo.
- API con Express, TypeScript, Zod y Supabase.
- Web con React, Vite, TailwindCSS, TanStack Query, Zustand y vite-plugin-pwa.
- Tipos compartidos en un paquete TypeScript reusable.

## Estructura

- `apps/api`: API Express con Supabase y TypeScript.
- `apps/web`: PWA React con Vite, TailwindCSS y TypeScript.
- `packages/types`: Tipos TypeScript compartidos.

## Instalación

1. Ejecuta `corepack pnpm install` en la raíz.
2. Copia los archivos `.env.example` de `apps/api` y `apps/web` a sus variantes `.env`.
3. Completa las credenciales de Supabase y la URL del frontend.

## Variables de entorno

### API

- `PORT`
- `CLIENT_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`

### Web

- `VITE_API_URL` (ejemplo desplegado: `https://finduo.onrender.com/api`)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_PUSH_PUBLIC_KEY`

## Scripts raíz

- `pnpm dev`: inicia las apps en paralelo con Turborepo.
- `pnpm build`: compila todos los paquetes.
- `pnpm typecheck`: ejecuta validación de tipos.
- `pnpm lint`: ejecuta lint donde aplique.

## Validación local

- Se creó una task de VS Code llamada `Validar monorepo FinDúo`.
- En este entorno se validó con `corepack pnpm --dir ... exec tsc -p tsconfig.json --noEmit` en cada paquete.

## Estado actual

- La estructura completa del monorepo está creada.
- El backend expone los endpoints base con middlewares, validación y respuestas estándar.
- El frontend incluye rutas públicas/privadas, layout móvil, stores, hooks y configuración PWA.
- La lógica real de persistencia sigue marcada con comentarios `TODO` en español donde corresponde.
