# Requirements — SSR Runtime + React Router v7 library-mode wiring

## Introduction

`@stackra/ssr@0.1.x` shipped the middleware subpath and left three placeholders:
`./react`, `./server`, and `./vite`. This spec fills them in and delivers the
first version of the SSR runtime.

Design constraints (fixed by prior architecture decisions):

- **React Router v7 library mode** — no file-based routing, no framework
  mode. Consumers declare route trees via `defineRoutes(...)`.
- **SSR for SEO only** — human traffic gets the client-only bundle;
  crawler traffic gets a fully-rendered HTML response.
- **Streaming** where the target runtime supports it. `renderToReadableStream`
  on Web-fetch runtimes, `renderToPipeableStream` on Node.
- **Client-first** — the package must remain usable in pure-client apps
  (no server, no crawler path). Consumers opt into `@stackra/ssr/server`
  by importing it.
- **Middleware integration** — routes and route groups can attach middleware
  chains resolved via `MiddlewareResolver` on both stages (HTTP + UI).

Ships as `@stackra/ssr@0.2.0`. Contains no breaking changes to the
`./middleware` subpath.

## Requirements

### Requirement 1 — `defineRoutes` primitive

**As a** consumer  
**I want** a typed identity helper for declaring route trees  
**So that** I can attach middleware, loaders, actions, and metadata declaratively

- 1.1 — `defineRoutes(routes: RouteObject[]): RouteObject[]` is a runtime identity.
- 1.2 — Every route accepts: `path`, `element` OR `component`, `middleware`,
  `loader`, `action`, `errorElement`, `handle` (RRD-native), `children`.
- 1.3 — `middleware` accepts the same union as `MiddlewareGroup.middleware` —
  `MiddlewareDefinition | string | MiddlewareTuple`.
- 1.4 — Nested routes inherit middleware from ancestors — the resolver walks
  the match tree outermost → innermost.
- 1.5 — Unknown fields raise a `// @ts-expect-error` compile-time error.
- 1.6 — The runtime output is compatible with `createBrowserRouter`,
  `createMemoryRouter`, and the server-side `createStaticHandler`.

### Requirement 2 — `defineApiRoute` primitive

**As a** consumer  
**I want** a typed helper for declaring API routes  
**So that** I can build JSON endpoints alongside my UI routes

- 2.1 — `defineApiRoute(config)` accepts `path`, `method`, `middleware`, `handler`.
- 2.2 — `handler` receives an `HttpContext` (same as HTTP-stage middleware).
- 2.3 — Return values are `Response`, `object` (JSON-serialized), or `Promise` of either.
- 2.4 — Throwing a signal (`redirect`, `notFound`, `abort`) is caught by the
  server runtime and mapped to a `Response`.
- 2.5 — API routes are collected into a separate table from UI routes.

### Requirement 3 — `<StackraRouter>` client entry

**As a** consumer  
**I want** a single React component that wires everything up  
**So that** I don't have to manually thread the container, routes, and hydration

- 3.1 — `<StackraRouter routes={...} app={container}>` renders a
  `<RouterProvider router={createBrowserRouter(...)}>`.
- 3.2 — The rendered tree includes `<ContainerProvider value={app}>` at the top
  so `useApp()` works anywhere.
- 3.3 — `<StackraRouter hydrated={true}>` uses `createBrowserRouter` for post-hydration.
- 3.4 — Middleware attached to routes runs on every navigation via a route-level
  `unstable_middleware` array (RRD v7's mechanism) OR via a loader wrapper.
- 3.5 — Redirect signals thrown from middleware call `router.navigate(url)`.
- 3.6 — NotFound signals bubble to the nearest route `errorElement`.

### Requirement 4 — `<Link>` component

**As a** consumer  
**I want** a link that pre-fetches on hover/focus  
**So that** navigation feels instant

- 4.1 — `<Link to="...">` renders a native `<a>` with correct `href`.
- 4.2 — Left-click without modifiers triggers a client-side navigation.
- 4.3 — Hover/focus triggers loader prefetch (unless `prefetch="none"`).
- 4.4 — `prefetch` prop accepts `'hover' | 'intent' | 'render' | 'none'`.
- 4.5 — All standard `<a>` attributes pass through.

### Requirement 5 — `<Meta>` component

**As a** consumer  
**I want** a component that renders route-provided SEO tags  
**So that** every route can declare its own `<title>`, description, and OpenGraph

- 5.1 — `<Meta />` reads meta from `useMatches()` — every matched route can
  export a `meta` field on its `handle`.
- 5.2 — Renders `<title>`, `<meta name="description">`, `<meta property="og:*">`,
  and `<link rel="canonical">`.
- 5.3 — Deeper routes' meta overrides shallower routes.
- 5.4 — Missing/empty meta falls back to `app.meta.default` from module options.

### Requirement 6 — Hooks

**As a** consumer  
**I want** framework-idiomatic hooks  
**So that** I don't have to import from both `@stackra/ssr/react` and `react-router-dom`

- 6.1 — Re-export `useNavigate`, `useLocation`, `useParams`, `useMatches`,
  `useLoaderData`, `useActionData`, `useSubmit`, `useNavigation` from RRD.
- 6.2 — Add `useApp()` — returns the container from the surrounding
  `<ContainerProvider>`.
- 6.3 — Add `useMiddlewareState<T>()` — reads state accumulated by upstream
  middleware for the current match.

### Requirement 7 — `renderRequest` server renderer

**As a** consumer  
**I want** a single function to render a request  
**So that** I can plug SSR into any HTTP runtime

- 7.1 — `renderRequest(request, { app, routes }): Promise<Response>` is the
  main API.
- 7.2 — Crawler requests (User-Agent match) render fully:
  - Create `StaticHandler` from routes.
  - Await loaders.
  - `renderToReadableStream(<StackraRouter />)`.
  - Return `Response` with `Content-Type: text/html`.
- 7.3 — Human requests return the SPA shell:
  - No loader execution.
  - Emit HTML with root `<div id="app">` and `<script src="/client.js">`.
- 7.4 — Redirect signals produce `Response.redirect(url, status)`.
- 7.5 — NotFound signals produce a `Response` with the `errorElement` at 404.
- 7.6 — Middleware for stage `'http'` runs BEFORE routing.

### Requirement 8 — Crawler detection

**As a** consumer  
**I want** the runtime to decide crawler vs human automatically  
**So that** I don't have to configure two separate rendering paths

- 8.1 — `isCrawler(userAgent: string): boolean` inspects the UA header.
- 8.2 — Matches all common search-engine and social-preview bots:
  `Googlebot`, `Bingbot`, `Slurp`, `DuckDuckBot`, `Baiduspider`, `YandexBot`,
  `Twitterbot`, `facebookexternalhit`, `LinkedInBot`, `WhatsApp`, `Slackbot`,
  `Discordbot`, `Applebot`, `TelegramBot`, `PetalBot`, `Bytespider`.
- 8.3 — Regex is exported so consumers can extend the list.
- 8.4 — `renderRequest` accepts `isCrawler` override for custom detection.

### Requirement 9 — HTTP adapters

**As a** consumer  
**I want** ready-made adapters for common runtimes  
**So that** I don't have to write Request → Response glue

- 9.1 — `createFetchHandler(config): (request: Request) => Promise<Response>`
  — Web-fetch-compatible. Works on Bun / Deno / Workers.
- 9.2 — `createNodeHandler(config): (req, res) => Promise<void>` — Node
  `http`/`https` compatible.
- 9.3 — Both adapters route to `renderRequest` under the hood.
- 9.4 — API routes are handled by the adapter (no need for separate wiring).

### Requirement 10 — Vite plugin

**As a** consumer  
**I want** a Vite plugin that wires everything  
**So that** dev / build / preview work out of the box

- 10.1 — `stackraSsr(options)` returns a Vite `Plugin`.
- 10.2 — Registers a dev-server middleware that catches HTML requests
  and delegates to `renderRequest`.
- 10.3 — Provides a virtual module `virtual:stackra/routes` re-exporting the
  consumer's routes file.
- 10.4 — Build emits two bundles: `dist/client/*` and `dist/server/*`.
- 10.5 — Options: `routesFile: string`, `entry: string`, `ssrEntry: string`,
  `middlewareFile?: string`.

### Requirement 11 — Middleware integration

**As a** consumer  
**I want** middleware to run on route transitions (client) and requests (server)  
**So that** the same `defineMiddleware` primitive works for both

- 11.1 — HTTP middleware runs before `StaticHandler.query()` on the server.
- 11.2 — UI middleware runs before route loaders on the client, per-navigation.
- 11.3 — The resolver receives `{ global, groups, route, environment, stage }`
  where `route` is the merged middleware chain from all matched routes.
- 11.4 — Middleware errors bubble to the route's `errorElement`.
- 11.5 — Redirect signals thrown in HTTP middleware produce a `Response`
  redirect; redirect signals thrown in UI middleware call `router.navigate`.

### Requirement 12 — Testing surface

**As a** consumer  
**I want** test helpers that let me exercise routes and middleware together  
**So that** integration tests are ergonomic

- 12.1 — `createMemoryApp({ routes, middleware })` returns an app + a
  `navigate(url)` helper backed by `createMemoryRouter`.
- 12.2 — `renderRoute(url, config)` renders a single route to a DOM string —
  useful for snapshot tests.
- 12.3 — `runHttpRequest(request, config)` runs the full HTTP pipeline
  (middleware → routing → render) and returns the `Response`.

### Requirement 13 — Documentation

- 13.1 — Package README covers install, quick start, subpath map, common recipes.
- 13.2 — Each subpath has its own section: `./react`, `./server`, `./vite`.
- 13.3 — Migration note: how `@stackra/ssr@0.2.0` differs from `0.1.x` (no breaking
  changes to `./middleware`; three new subpaths are populated).
- 13.4 — Recipe: "protect a route with auth middleware".
- 13.5 — Recipe: "declare a JSON API route".
- 13.6 — Recipe: "wire the Vite plugin".

### Requirement 14 — Release

- 14.1 — Bump `@stackra/ssr` from `0.1.2` → `0.2.0`.
- 14.2 — Publish to npm via the existing changesets pipeline.
- 14.3 — Update `vite-example` to consume `0.2.0` and wire real routes.
- 14.4 — Verify `vite-example` boots and a crawler request produces
  fully-rendered HTML.
