# FinDúo

Monorepo fullstack para una PWA de finanzas para parejas.

## Stack

- Monorepo con pnpm workspaces y Turborepo.
- API con Express, TypeScript, Zod y Supabase como base de datos.
- Web con React, Vite, TailwindCSS, TanStack Query, Zustand y vite-plugin-pwa.
- Tipos compartidos en un paquete TypeScript reusable.

## Estructura

- `apps/api`: API Express con Supabase y TypeScript.
- `apps/web`: PWA React con Vite, TailwindCSS y TypeScript.
- `packages/types`: Tipos TypeScript compartidos.

## Instalación

1. Ejecuta `corepack pnpm install` en la raíz.
2. Copia los archivos `.env.example` de `apps/api` y `apps/web` a sus variantes `.env`.
3. Si tu proyecto usaba el esquema viejo basado en `auth.users` y `profiles`, ejecuta primero [apps/api/supabase/reset-legacy-supabase-auth.sql](apps/api/supabase/reset-legacy-supabase-auth.sql).
4. Ejecuta después [apps/api/supabase/custom-auth.sql](apps/api/supabase/custom-auth.sql) en el SQL Editor de Supabase.
Esto crea las tablas de usuarios, parejas, membresías, aportes, gastos y metas de ahorro que la API espera.
5. Si ya tenías el esquema custom-auth funcionando antes de agregar modo solo, ejecuta además [apps/api/supabase/solo-mode-hotfix.sql](apps/api/supabase/solo-mode-hotfix.sql) para añadir la columna `is_solo` y los índices faltantes sin resetear datos.
6. Completa las credenciales de Supabase y la URL del frontend.

## Variables de entorno

### API

- `PORT`
- `CLIENT_URL`
- `CLIENT_URLS` (opcional, separado por comas para múltiples orígenes)
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET` (se usa como secreto de la auth propia del backend)
- `AUTH_ACCESS_TOKEN_MINUTES`
- `AUTH_REFRESH_TOKEN_DAYS`

### Web

- `VITE_API_URL` (ejemplo desplegado: `https://finduo.onrender.com/api`)
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
- El backend expone los endpoints base con middlewares, validación, auth propia con JWT y respuestas estándar.
- El frontend incluye rutas públicas/privadas, layout móvil, stores, hooks y configuración PWA.
- La lógica real de persistencia sigue marcada con comentarios `TODO` en español donde corresponde.
