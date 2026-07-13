# Design — SSR Runtime + React Router v7 wiring

## Overview

Fills in the three placeholder subpaths of `@stackra/ssr` (`./react`,
`./server`, `./vite`) to deliver a working SSR + routing runtime. Ships as
`@stackra/ssr@0.2.0`. No breaking changes to `./middleware`.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       @stackra/ssr@0.2.0                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  ./react     │  │   ./server   │  │       ./vite         │   │
│  │              │  │              │  │                      │   │
│  │ defineRoutes │  │ isCrawler    │  │  stackraSsr(opts)    │   │
│  │ defineApi.   │  │ renderRequest│  │  → dev middleware    │   │
│  │ <Stackra…>   │  │ createFetch. │  │  → virtual modules   │   │
│  │ <Link>       │  │ createNode.  │  │  → build hooks       │   │
│  │ <Meta>       │  │              │  │                      │   │
│  │ useApp()     │  │              │  │                      │   │
│  │ useMwState() │  │              │  │                      │   │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬───────────┘   │
│         │                  │                     │                │
│         └──────────┬───────┴─────────────────────┘                │
│                    │                                              │
│                    ▼                                              │
│          ┌───────────────────┐                                    │
│          │  ./middleware     │ (already published — no changes)  │
│          │  defineMiddleware │                                    │
│          │  MiddlewareResolver│                                   │
│          └───────────────────┘                                    │
└─────────────────────────────────────────────────────────────────┘
```

Every subpath is a self-contained module. Consumers pick what they need:

- **Client-only app**: import `./react` only. Middleware still works client-side.
- **SSR + SEO**: add `./server` for the crawler-detection path.
- **Vite dev/build**: add `./vite` for the plugin.

## `./react` — Client entry

### Route definition

```typescript
// User's routes file
import { defineRoutes } from '@stackra/ssr/react';
import { HomePage, DashboardPage, NotFoundPage } from './pages';
import { requireAuth, rateLimit } from './middleware';

export const routes = defineRoutes([
  {
    path: '/',
    Component: HomePage,
    handle: { meta: { title: 'Home' } },
  },
  {
    path: '/dashboard',
    middleware: ['@auth', requireAuth],
    Component: DashboardPage,
    handle: { meta: { title: 'Dashboard' } },
    ErrorBoundary: NotFoundPage,
  },
]);
```

`defineRoutes(routes)` is a runtime identity that normalizes middleware
attachment. It preserves the `RouteObject` shape from React Router v7
so downstream `createBrowserRouter` / `createStaticHandler` accept it
verbatim.

### `<StackraRouter>`

```typescript
import { ContainerProvider } from '@stackra/container/react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

export function StackraRouter({ app, routes }: StackraRouterProps) {
  const router = useMemo(() => createBrowserRouter(routes), [routes]);
  return (
    <ContainerProvider value={app}>
      <RouterProvider router={router} />
    </ContainerProvider>
  );
}
```

Consumers wrap their app root:

```typescript
// main.tsx
import { StackraRouter } from '@stackra/ssr/react';
import { bootstrap } from './bootstrap';
import { routes } from './routes';

const app = await bootstrap();
createRoot(document.getElementById('app')!).render(
  <StackraRouter app={app} routes={routes} />,
);
```

### Middleware wiring on the client

React Router v7 has an `unstable_middleware` field per route. We use it
to inject a single middleware entry that runs our resolver:

```typescript
function attachMiddlewareToRoute(route: RouteObject, app: IApplication): RouteObject {
  const stackraMiddleware = async ({ request, params }) => {
    const resolver = app.get(MIDDLEWARE_RESOLVER);
    const chain = resolver.resolve({
      route: route.middleware ?? [],
      environment: 'client',
      stage: 'ui',
    });
    const pipes = chain.map((m) => toPipe(m.definition, app, m.name));
    return new Pipeline(app)
      .send({ container: app, ...ctx })
      .through(pipes)
      .thenReturn();
  };
  return {
    ...route,
    unstable_middleware: [stackraMiddleware, ...(route.unstable_middleware ?? [])],
    children: route.children?.map((child) => attachMiddlewareToRoute(child, app)),
  };
}
```

Signals thrown from middleware:

- `RedirectSignal` → `router.navigate(url, { replace: status >= 307 })`
- `NotFoundSignal` → re-throw as a `Response` so RRD's error boundary catches it
- `AbortSignal` → re-throw with `result` as the loader value

### `<Link>`

Thin wrapper over RRD's `<Link>` that adds hover/intent prefetching:

```typescript
export function Link({ to, prefetch = 'hover', ...rest }) {
  const router = useRouter();
  const prefetchNow = () => router.prefetch(to);
  const handlers = prefetch === 'hover' || prefetch === 'intent'
    ? { onMouseEnter: prefetchNow, onFocus: prefetchNow }
    : {};
  return <RRDLink to={to} {...handlers} {...rest} />;
}
```

`prefetch: 'render'` prefetches on mount; `prefetch: 'none'` disables.

### `<Meta>`

Reads meta from `useMatches()` and renders SEO tags:

```typescript
export function Meta() {
  const matches = useMatches();
  const meta = matches
    .flatMap((m) => (m.handle as { meta?: MetaTags })?.meta ?? [])
    .reduce((acc, tag) => ({ ...acc, ...tag }), {} as MetaTags);

  return (
    <>
      {meta.title && <title>{meta.title}</title>}
      {meta.description && <meta name="description" content={meta.description} />}
      {meta.og && Object.entries(meta.og).map(([key, value]) => (
        <meta key={key} property={`og:${key}`} content={value} />
      ))}
      {meta.canonical && <link rel="canonical" href={meta.canonical} />}
    </>
  );
}
```

Used inside the app's `<head>`, e.g. via a top-level layout route.

### Hooks

Re-exports from `react-router-dom`:

- `useNavigate`, `useLocation`, `useParams`, `useMatches`
- `useLoaderData`, `useActionData`, `useSubmit`, `useNavigation`

New hooks:

- `useApp<T = IApplication>(): T` — resolves the container from context.
- `useMiddlewareState<T>(): T` — reads `handle.middlewareState` accumulated
  by the middleware runner.

## `./server` — SSR renderer

### Crawler detection

```typescript
const CRAWLER_PATTERN = new RegExp(
  '(googlebot|bingbot|yahoo|duckduckbot|baiduspider|yandex|' +
    'twitterbot|facebookexternalhit|linkedinbot|whatsapp|slackbot|' +
    'discordbot|applebot|telegrambot|petalbot|bytespider|semrushbot)',
  'i'
);

export function isCrawler(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return CRAWLER_PATTERN.test(userAgent);
}
```

Exported alongside the regex so consumers can extend it.

### `renderRequest`

```typescript
export async function renderRequest(
  request: Request,
  config: RenderRequestConfig
): Promise<Response> {
  const { app, routes, apiRoutes, isCrawler: isCrawlerOverride } = config;

  // 1. HTTP middleware runs first.
  const httpMw = app.get(MIDDLEWARE_RESOLVER).resolve({
    global: config.globalMiddleware,
    environment: 'server',
    stage: 'http',
  });
  const httpPipe = new Pipeline(app);
  try {
    await httpPipe
      .send({ container: app, request, response: new Response() })
      .through(httpMw.map((m) => toPipe(m.definition, app, m.name)))
      .then(async (ctx) => {
        // 2. Try API routes first.
        const apiMatch = matchApiRoute(apiRoutes, ctx.request);
        if (apiMatch) return dispatchApiRoute(apiMatch, ctx);

        // 3. Then UI routes.
        const url = new URL(ctx.request.url);
        const detector = isCrawlerOverride ?? isCrawler;
        const uaCrawler = detector(ctx.request.headers.get('user-agent'));

        if (!uaCrawler) return renderClientShell(config, ctx);
        return renderCrawlerHtml(routes, ctx);
      });
  } catch (err) {
    return signalToResponse(err) ?? errorToResponse(err);
  }
}
```

### Crawler HTML rendering

Uses `createStaticHandler` from RRD and streams via
`renderToReadableStream`:

```typescript
async function renderCrawlerHtml(routes, ctx) {
  const handler = createStaticHandler(routes);
  const context = await handler.query(ctx.request);

  if (context instanceof Response) return context; // Redirect thrown by loader

  const router = createStaticRouter(handler.dataRoutes, context);
  const stream = await renderToReadableStream(
    <ContainerProvider value={ctx.container}>
      <StaticRouterProvider router={router} context={context} />
    </ContainerProvider>,
    {
      bootstrapScriptContent: `window.__STACKRA_HYDRATION__ = ${JSON.stringify(context.loaderData)};`,
    },
  );

  return new Response(stream, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
    status: context.statusCode ?? 200,
  });
}
```

### Client shell rendering

For human users, we emit a minimal HTML shell that boots the client bundle:

```typescript
function renderClientShell(config, ctx) {
  const html = `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="${config.clientCss}">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="${config.clientEntry}"></script>
</body>
</html>`;
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
```

### Signal → Response conversion

```typescript
function signalToResponse(err: unknown): Response | null {
  if (err instanceof RedirectSignal) {
    return Response.redirect(err.url, err.status);
  }
  if (err instanceof NotFoundSignal) {
    return new Response(err.reason, { status: 404 });
  }
  if (err instanceof AbortSignal) {
    return err.result instanceof Response
      ? err.result
      : new Response(JSON.stringify(err.result), {
          headers: { 'content-type': 'application/json' },
        });
  }
  return null;
}
```

### Adapters

```typescript
// Web-fetch adapter — Bun/Deno/Workers
export function createFetchHandler(config: RenderRequestConfig) {
  return (request: Request) => renderRequest(request, config);
}

// Node adapter
export function createNodeHandler(config: RenderRequestConfig) {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const request = nodeReqToWebRequest(req);
    const response = await renderRequest(request, config);
    await pipeResponseToNode(response, res);
  };
}
```

`nodeReqToWebRequest` + `pipeResponseToNode` are small utility functions.

## `./vite` — Vite plugin

### Plugin surface

```typescript
export function stackraSsr(options: StackraSsrOptions): Plugin {
  const { routesFile, ssrEntry, entry, middlewareFile } = options;
  return {
    name: 'stackra:ssr',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!isHtmlRequest(req)) return next();
        try {
          const { renderRequest } = await server.ssrLoadModule(ssrEntry);
          const { routes } = await server.ssrLoadModule(routesFile);
          const { bootstrap } = await server.ssrLoadModule(entry);
          const app = await bootstrap();
          const request = nodeReqToWebRequest(req);
          const response = await renderRequest(request, { app, routes });
          await pipeResponseToNode(response, res);
        } catch (err) {
          next(err);
        }
      });
    },
    resolveId(id) {
      if (id === 'virtual:stackra/routes') return '\0virtual:stackra/routes';
      if (id === 'virtual:stackra/middleware') return '\0virtual:stackra/middleware';
    },
    load(id) {
      if (id === '\0virtual:stackra/routes') return `export * from ${JSON.stringify(routesFile)};`;
      if (id === '\0virtual:stackra/middleware')
        return middlewareFile
          ? `export * from ${JSON.stringify(middlewareFile)};`
          : `export const middlewareConfig = { middleware: [], groups: [] };`;
    },
  };
}
```

### Build behaviour

For v0.2, the plugin only wires the dev-server middleware. Production
builds run the client bundle only; SSR builds are deferred to a follow-up
that adds a `pnpm build:ssr` step. Consumers who want production SSR wire
the adapter themselves (Node/Bun/Workers).

Rationale: dual-bundle Vite builds require careful externals config and
custom entry orchestration. Landing that in the same release makes the
review surface too large.

## Package structure

```
ssr/src/
├── middleware/       (unchanged — 0.1.x)
├── react/
│   ├── index.ts
│   ├── define-routes.util.ts
│   ├── define-api-route.util.ts
│   ├── stackra-router.tsx
│   ├── link.tsx
│   ├── meta.tsx
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── use-app.ts
│   │   ├── use-middleware-state.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── stackra-route.type.ts
│   │   ├── stackra-api-route.type.ts
│   │   ├── meta-tags.type.ts
│   ├── attach-middleware.util.ts
├── server/
│   ├── index.ts
│   ├── render-request.ts
│   ├── is-crawler.util.ts
│   ├── create-fetch-handler.ts
│   ├── create-node-handler.ts
│   ├── render-crawler-html.tsx
│   ├── render-client-shell.ts
│   ├── signal-to-response.util.ts
│   ├── node-req-adapter.util.ts
│   ├── match-api-route.util.ts
│   ├── dispatch-api-route.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── render-request-config.type.ts
├── vite/
│   ├── index.ts
│   ├── stackra-ssr.plugin.ts
│   ├── virtual-modules.util.ts
│   ├── is-html-request.util.ts
├── testing/          (extend existing)
│   ├── create-memory-app.ts
│   ├── render-route.ts
│   ├── run-http-request.ts
```

## Peer dependencies

Add to `peerDependencies` (all optional):

- `react-router-dom` ≥ 7 (already there)
- No new required peers

## Test strategy

- **Unit** — `defineRoutes` identity, `isCrawler` matching, signal → Response mapping
- **Integration** — full HTTP pipeline via `runHttpRequest` (middleware → routing → render)
- **Client** — `attachMiddlewareToRoute` wires a resolver correctly; `<Meta>` renders correct tags

## Non-goals for v0.2

- Production SSR builds (dual bundle)
- Streaming with `<Suspense>` boundaries (uses `renderToReadableStream`
  but doesn't add suspense-aware fetch primitives)
- File-based routing
- Advanced caching (edge cache, ISR)
- Data mutation abstractions beyond RRD's `action`

These land in follow-up specs.
