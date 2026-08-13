# uStudent · Frontend

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4.

TanStack Query y Recharts se añaden en las fases 1 y 5, cuando haya datos que consultar y
que graficar.

## Estructura

```
src/
├── app/
│   ├── (public)/          landing e información institucional
│   ├── (auth)/            login, recuperación de contraseña
│   ├── (app)/             área autenticada
│   │   ├── dashboard/     panel según rol
│   │   ├── estudiante/    solicitudes, check-in de bienestar
│   │   ├── docente/       reportes, mis estudiantes
│   │   └── admin/         usuarios, roles, solicitudes, riesgo, parámetros
│   └── api/               route handlers (proxy de sesión, descargas)
├── features/              lógica por dominio: hooks, esquemas Zod, componentes propios
│   ├── auth/  cases/  risk/  users/  reporting/
├── components/
│   ├── ui/                primitivos del sistema de diseño
│   ├── layout/            barra lateral, cabecera, contenedores
│   ├── charts/            gráficas del tablero
│   └── forms/             campos y patrones de formulario
├── lib/
│   ├── api/               cliente HTTP y funciones por recurso
│   ├── auth/              lectura de sesión, guardas
│   ├── hooks/             hooks genéricos
│   └── utils/             formateo de fechas, números, textos
├── styles/                tokens.css y capa base de Tailwind
└── types/                 api.ts generado desde OpenAPI — no editar a mano
```

## Reglas

- **Los tipos de la API se generan**, no se escriben:
  ```bash
  npm run generate:api
  ```
- **Colores solo por token.** Nada de hex en los componentes. Tailwind 4 se configura desde
  CSS: los tokens viven en un bloque `@theme` de `src/styles/tokens.css` y de ahí salen las
  utilidades (`bg-blue-600`, `text-teal-700`). No hay `tailwind.config.ts`. Ver
  [sistema de diseño](../../docs/05-ux/sistema-diseno.md).
- **El menú se arma con los permisos** del token, pero ocultar no autoriza: la autorización
  real está en el servidor.
- **Todo listado** define sus estados de carga, error y vacío.
- **Server Components** para las lecturas iniciales; TanStack Query para datos que cambian.
- **La sesión vive en cookie `httpOnly`**: no se toca `localStorage`.

## Comandos

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run test:e2e
```

## Referencias

- [Sistema de diseño](../../docs/05-ux/sistema-diseno.md)
- [Mapa de navegación](../../docs/05-ux/mapa-navegacion.md)
- [Contrato de API](../../docs/03-especificaciones/api/api-rest.md)
