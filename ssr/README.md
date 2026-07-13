# @stackra/ssr

Server-side rendering, routing, middleware, and SEO for the Stackra framework. Client-first (React Router v7 library mode), **SSR for SEO only** (crawler detection + streaming), zero file-based routing, decorator-driven registration.

## Subpaths

| Import                    | Contents                                                            |
| ------------------------- | ------------------------------------------------------------------- |
| `@stackra/ssr`            | Everything — the composite `SsrModule` + all subsystems re-exported |
| `@stackra/ssr/middleware` | `defineMiddleware`, `@Middleware`, signals, registry, resolver      |
| `@stackra/ssr/server`     | `ServerModule`, `SsrRenderer`, `@Route`, `@ApiRoute`, HTTP adapters |
| `@stackra/ssr/seo`        | `SeoService`, JSON-LD builders, `SeoModule`                         |
| `@stackra/ssr/react`      | `<StackraRouter>`, `<Link>`, `<Meta>`, `defineRoutes`, hooks        |
| `@stackra/ssr/vite`       | `stackraSsr` Vite plugin + virtual modules                          |
| `@stackra/ssr/testing`    | `createMockContext`, `runMiddleware`, `createMockContainer`         |

## Install

```bash
pnpm add @stackra/ssr @stackra/container @stackra/contracts @stackra/pipeline \
  react react-dom react-router-dom reflect-metadata
```

Optional peers: `@stackra/events` (lifecycle events), `@stackra/logger` (warnings), `vite` (dev plugin).

## Mental model

- **Client-first.** Humans get a client-only SPA. React Router v7 in library mode drives navigation.
- **SSR for SEO only.** Crawler requests (detected by User-Agent) get a fully server-rendered, streamed HTML response. Everyone else gets the SPA shell.
- **No file-based routing.** Routes are declared as data (`defineRoutes`) or discovered from `@Route()` classes.
- **Decorator-driven registration.** `@Route` / `@ApiRoute` / `@Middleware` classes are auto-discovered. Inline definitions go through `SsrModule.forFeature(...)`.
- **`forRoot` vs `forFeature`.** `forRoot` = app-global config (SEO, client entry, global middleware). `forFeature` = register routes / middleware. Registries hold no config.

## Quick start

### 1. Declare middleware

```typescript
// src/middleware/require-auth.ts
import {
  Middleware,
  redirect,
  type HttpContext,
  type MiddlewareNext,
} from '@stackra/ssr/middleware';
import { Inject, Injectable } from '@stackra/container';
import { AUTH_SERVICE } from '@/tokens';

@Middleware({ name: 'auth', priority: 100, stage: 'http' })
@Injectable()
export class RequireAuth {
  constructor(@Inject(AUTH_SERVICE) private auth: AuthService) {}

  async handle(ctx: HttpContext, next: MiddlewareNext) {
    if (!this.auth.check(ctx.request)) redirect('/login', 302);
    return next();
  }
}
```

Or inline, without a class:

```typescript
import { defineMiddleware, redirect } from '@stackra/ssr/middleware';

export const requireAuth = defineMiddleware({
  name: 'auth',
  priority: 100,
  stage: 'http',
  handle: async (ctx, next) => {
    if (!ctx.request.headers.get('authorization')) redirect('/login');
    return next();
  },
});
```

### 2. Declare routes

```typescript
// src/routes.ts
import { defineRoutes, article } from '@stackra/ssr/react';
import { HomePage, DashboardPage, PostPage } from './pages';

export const routes = defineRoutes([
  {
    path: '/',
    Component: HomePage,
    handle: { seo: { title: 'Home', description: 'Welcome' } },
  },
  {
    path: '/dashboard',
    middleware: ['auth'], // reference by name
    Component: DashboardPage,
    handle: { seo: { title: 'Dashboard', robots: { index: false } } },
  },
  {
    path: '/blog/:slug',
    Component: PostPage,
    handle: {
      seo: {
        title: 'Post',
        jsonLd: article({
          headline: 'My Post',
          datePublished: '2026-01-01',
          authorName: 'Jane Doe',
        }),
      },
    },
  },
]);
```

Or as `@Route()` classes (auto-discovered — no `forFeature` needed):

```typescript
import { Route } from '@stackra/ssr/server';
import { Injectable } from '@stackra/container';

@Route({ path: '/dashboard', middleware: ['auth'], meta: { title: 'Dashboard' } })
@Injectable()
export class DashboardRoute {
  render() {
    return <DashboardPage />;
  }
}
```

### 3. Compose the app module

```typescript
// src/app.module.ts
import { Module } from '@stackra/container';
import { SsrModule } from '@stackra/ssr';
import { routes } from './routes';
import { RequireAuth } from './middleware/require-auth';

@Module({
  imports: [
    // App-wide config only.
    SsrModule.forRoot({
      seo: {
        baseUrl: 'https://acme.com',
        defaults: { titleTemplate: '%s | Acme', openGraph: { siteName: 'Acme' } },
      },
      clientEntry: '/src/main.tsx',
      clientCss: '/src/styles/index.css',
    }),
    // Register routes.
    SsrModule.forFeature({ routes }),
  ],
  providers: [RequireAuth], // @Middleware class — auto-discovered
})
export class AppModule {}
```

### 4. Client entry

```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
import { ApplicationFactory } from '@stackra/container';
import { StackraRouter } from '@stackra/ssr/react';
import { AppModule } from './app.module';

const app = await ApplicationFactory.create(AppModule);

createRoot(document.getElementById('app')!).render(
  // routes come from ROUTE_REGISTRY when omitted
  <StackraRouter app={app} />
);
```

### 5. Server entry (SSR for crawlers)

```typescript
// src/entry.server.ts
import { ApplicationFactory } from '@stackra/container';
import { createNodeHandler } from '@stackra/ssr/server';
import { AppModule } from './app.module';

export default async function () {
  const app = await ApplicationFactory.create(AppModule);
  return { handler: createNodeHandler(app) };
}
```

### 6. Vite plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { stackraSsr } from '@stackra/ssr/vite';

export default defineConfig({
  plugins: [
    react(),
    stackraSsr({
      ssrEntry: '/src/entry.server.ts',
      routesFile: '/src/routes.ts',
    }),
  ],
});
```

## `@stackra/ssr/middleware`

`defineMiddleware` has three forms — function, options, class — all typed identities. See the [middleware section](#middleware-forms) below. Signals short-circuit the chain:

```typescript
import { redirect, notFound, abort } from '@stackra/ssr/middleware';

redirect('/login', 302); // → 3xx Response / router.navigate
notFound('User not found'); // → 404
abort(new Response('...', { status: 503 })); // → returned verbatim
```

Groups bundle middleware under an `@`-prefixed name:

```typescript
import { defineMiddlewareGroup } from '@stackra/ssr/middleware';

export const web = defineMiddlewareGroup({
  name: '@web',
  middleware: ['session', 'csrf', 'flash'],
});
```

### Middleware forms

| Form     | Shape                                           | Use when                       |
| -------- | ----------------------------------------------- | ------------------------------ |
| Function | `defineMiddleware(async (ctx, next) => …)`      | Stateless, no DI               |
| Options  | `defineMiddleware({ name, priority, handle })`  | Needs metadata (name/priority) |
| Class    | `@Middleware({...})` on a class with `handle()` | Needs DI — auto-discovered     |

Resolution order: descending `priority`, ties by declaration order, `dependsOn` enforced as a partial order (cycles throw `MIDDLEWARE_CYCLE_DETECTED`).

## `@stackra/ssr/seo`

Routes attach an `seo` descriptor to `handle.seo`. `SeoService` merges the chain (inner overrides outer) on top of the site-wide `forRoot({ seo })` defaults, then `<Meta>` renders the tags — the exact same tag list is serialized to HTML on the server.

```typescript
import { organization, faqPage, breadcrumbList } from '@stackra/ssr/seo';

handle: {
  seo: {
    title: 'Pricing',
    description: 'Simple, transparent pricing',
    canonical: '/pricing',
    openGraph: { type: 'website', images: [{ url: '/og/pricing.png' }] },
    twitter: { card: 'summary_large_image' },
    robots: { index: true, follow: true, maxImagePreview: 'large' },
    jsonLd: [
      breadcrumbList([{ name: 'Home', url: '/' }, { name: 'Pricing', url: '/pricing' }]),
      faqPage([{ question: 'Is there a free tier?', answer: 'Yes.' }]), // AEO
    ],
  },
}
```

JSON-LD builders: `organization`, `website`, `webPage`, `breadcrumbList`, `article`, `product`, `faqPage`, `qaPage`, `speakable`. `faqPage`/`qaPage`/`speakable` target Answer Engine Optimization (featured snippets + voice).

Render `<Meta>` inside your document `<head>` (in a layout route). It reads `useMatches()`, resolves through `SeoService`, and renders `<title>`, `<meta>`, `<link rel="canonical">`, alternates, and `<script type="application/ld+json">` (with `</script>`-breakout escaping).

## `@stackra/ssr/react`

- `defineRoutes(routes)` / `defineApiRoute(config)` — typed identities.
- `<StackraRouter app={app} routes? />` — wraps `<ContainerProvider>` + `<RouterProvider>`; pulls routes from `ROUTE_REGISTRY` when the prop is omitted.
- `<Link to prefetch="hover">` — hover/intent prefetching over RRD's `<Link>`.
- `<Meta />` — SEO head renderer.
- Hooks: `useRouteState()` (middleware-prepared state for the match), `useContainer()` / `useInject()` (from `@stackra/container/react`), plus curated RRD re-exports (`useNavigate`, `useLoaderData`, …).

## `@stackra/ssr/server`

- `SsrModule` (composite) / `ServerModule` (routing only).
- `@Route(...)` / `@ApiRoute(...)` decorators.
- `SsrRenderer` — inject `SSR_RENDERER` or call `renderRequest(request, app)`.
- Adapters: `createFetchHandler(app)` (Bun/Deno/Workers), `createNodeHandler(app)` (Node).
- `isCrawler(ua)` + `CRAWLER_PATTERN` — extend detection by passing `isCrawler` to `forRoot`.

### Render flow

```
request
  → global HTTP middleware (forRoot globalMiddleware/groups)
  → API route match?  → dispatch handler → Response
  → crawler UA?       → StaticHandler + renderToReadableStream → streamed HTML
  → human UA?         → SPA shell (<div id="app"> + client entry)
  ↳ redirect/notFound/abort signal → mapped to Response at the boundary
```

## `@stackra/ssr/testing`

```typescript
import { createMockContext } from '@stackra/ssr/testing';

const ctx = createMockContext('http', {
  request: new Request('http://localhost/dashboard'),
});
await expect(ctx.runMiddleware(requireAuth)).rejects.toMatchObject({
  kind: 'redirect',
  url: '/login',
});
```

## Migration from 0.1.x

- `./middleware` public API is unchanged.
- New subpaths populated: `./server`, `./seo`, `./react`, `./vite`.
- The middleware config file is gone — use `@Middleware` classes or `forFeature`.

## License

MIT © Stackra L.L.C
