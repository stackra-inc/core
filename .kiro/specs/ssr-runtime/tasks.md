# Implementation Plan

## Overview

Delivery plan for `@stackra/ssr@0.2.0` — fills in the three placeholder
subpaths (`./react`, `./server`, `./vite`) with a working SSR + routing
runtime. No breaking changes to `./middleware`.

## Task Dependency Graph

```
Phase 1 — react/types (route + api-route + meta shapes)
   ↓
Phase 2 — react/hooks (useApp, useMiddlewareState)
   ↓
Phase 3 — react/primitives (defineRoutes, defineApiRoute)
   ↓
Phase 4 — react/components (<StackraRouter>, <Link>, <Meta>)
   ↓
Phase 5 — react/middleware wiring (attachMiddlewareToRoute)
   ↓
Phase 6 — server/utils (isCrawler, signal→Response, node adapters)
   ↓
Phase 7 — server/renderer (renderRequest, crawler + shell paths)
   ↓
Phase 8 — server/api-routes (matchApiRoute, dispatchApiRoute)
   ↓
Phase 9 — server/handlers (createFetchHandler, createNodeHandler)
   ↓
Phase 10 — vite plugin (stackraSsr, dev middleware, virtual modules)
   ↓
Phase 11 — testing helpers (createMemoryApp, renderRoute, runHttpRequest)
   ↓
Phase 12 — test suite (unit + integration)
   ↓
Phase 13 — docs (README + recipes)
   ↓
Phase 14 — vite-example integration (real routes + Meta component)
   ↓
Phase 15 — release
```

---

## Tasks

### Phase 1 — Types

- [ ] **1.1 — `MetaTags` type**

  Create `ssr/src/react/types/meta-tags.type.ts` with fields: `title`,
  `description`, `og?: Record<string, string>`, `twitter?: Record<string, string>`,
  `canonical?: string`.

  _Requirements: 5.2_

- [ ] **1.2 — `StackraRoute` type**

  Create `ssr/src/react/types/stackra-route.type.ts`. Extends RRD's
  `RouteObject` with `middleware?: (MiddlewareDefinition | string | MiddlewareTuple)[]`
  and stricter `handle?: { meta?: MetaTags; middlewareState?: unknown }`.

  _Requirements: 1.2, 1.3, 5.1_

- [ ] **1.3 — `StackraApiRoute` type**

  Create `ssr/src/react/types/stackra-api-route.type.ts` with `path`,
  `method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'`,
  `middleware?`, `handler: (ctx: HttpContext) => Response | object | Promise<Response | object>`.

  _Requirements: 2.1, 2.2, 2.3_

- [ ] **1.4 — Types barrel**

  Create `ssr/src/react/types/index.ts` exporting all three.

### Phase 2 — Hooks

- [ ] **2.1 — `useApp` hook**

  Create `ssr/src/react/hooks/use-app.ts`. Uses `useContext` on the
  container-provider context re-exported from `@stackra/container/react`.

  _Requirements: 6.2_

- [ ] **2.2 — `useMiddlewareState` hook**

  Create `ssr/src/react/hooks/use-middleware-state.ts`. Reads
  `handle.middlewareState` from the current match via `useMatches()`.

  _Requirements: 6.3_

- [ ] **2.3 — Hooks barrel**

  Create `ssr/src/react/hooks/index.ts` — barrel + re-exports from
  `react-router-dom` (`useNavigate`, `useLocation`, `useParams`, etc.).

  _Requirements: 6.1_

### Phase 3 — Primitives

- [ ] **3.1 — `defineRoutes`**

  Create `ssr/src/react/define-routes.util.ts`. Identity function typed as
  `defineRoutes<T extends readonly StackraRoute[]>(routes: T): T`.

  _Requirements: 1.1, 1.6_

- [ ] **3.2 — `defineApiRoute`**

  Create `ssr/src/react/define-api-route.util.ts`. Identity function typed
  as `defineApiRoute<T extends StackraApiRoute>(config: T): T`.

  _Requirements: 2.1, 2.2, 2.3_

### Phase 4 — Components

- [ ] **4.1 — `<StackraRouter>`**

  Create `ssr/src/react/stackra-router.tsx`. Accepts `{ app, routes,
hydrated? }`, wraps `<RouterProvider router={createBrowserRouter(...)}>`
  in a `<ContainerProvider value={app}>`. Applies `attachMiddlewareToRoute`
  to every route.

  _Requirements: 3.1, 3.2, 3.3, 11.2_

- [ ] **4.2 — `<Link>`**

  Create `ssr/src/react/link.tsx`. Wraps RRD's `<Link>` with a `prefetch`
  prop that triggers hover/intent prefetching via `router.prefetch(to)`.

  _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] **4.3 — `<Meta>`**

  Create `ssr/src/react/meta.tsx`. Reads `useMatches()`, walks
  `match.handle.meta` outermost → innermost, renders `<title>`, `<meta>`,
  and `<link rel="canonical">` tags.

  _Requirements: 5.1, 5.2, 5.3, 5.4_

### Phase 5 — Middleware wiring (react)

- [ ] **5.1 — `attachMiddlewareToRoute`**

  Create `ssr/src/react/attach-middleware.util.ts`. Given `(route, app)`
  returns a new route with `unstable_middleware` prepended by a function
  that:
  1. Resolves the chain via `MIDDLEWARE_RESOLVER`.
  2. Adapts each entry via `toPipe`.
  3. Executes via `Pipeline`.
  4. Catches signals: redirects call `router.navigate`, notFound and abort
     re-throw for the error boundary.
     Recurses into `children`.

  _Requirements: 3.4, 3.5, 3.6, 11.2, 11.4, 11.5_

### Phase 6 — Server utilities

- [ ] **6.1 — `isCrawler` + regex export**

  Create `ssr/src/server/is-crawler.util.ts`. Regex matches
  ~16 known crawlers. Export both `isCrawler(userAgent)` and
  `CRAWLER_PATTERN`.

  _Requirements: 8.1, 8.2, 8.3_

- [ ] **6.2 — `signalToResponse`**

  Create `ssr/src/server/signal-to-response.util.ts`. Maps
  `RedirectSignal` / `NotFoundSignal` / `AbortSignal` to `Response`.
  Returns `null` for non-signal errors.

  _Requirements: 7.4, 7.5, 11.5_

- [ ] **6.3 — Node request adapters**

  Create `ssr/src/server/node-req-adapter.util.ts` with:
  - `nodeReqToWebRequest(req: IncomingMessage): Request`
  - `pipeResponseToNode(response: Response, res: ServerResponse): Promise<void>`

  _Requirements: 9.2_

### Phase 7 — Renderer

- [ ] **7.1 — `renderCrawlerHtml`**

  Create `ssr/src/server/render-crawler-html.tsx`. Uses
  `createStaticHandler` + `createStaticRouter` + `renderToReadableStream`.
  Serializes loader data into `window.__STACKRA_HYDRATION__`.

  _Requirements: 7.2_

- [ ] **7.2 — `renderClientShell`**

  Create `ssr/src/server/render-client-shell.ts`. Emits minimal HTML with
  `<div id="app">` and a `<script type="module" src={config.clientEntry}>`.

  _Requirements: 7.3_

- [ ] **7.3 — `renderRequest`**

  Create `ssr/src/server/render-request.ts`. Orchestrates:
  1. HTTP middleware chain (resolver + pipeline).
  2. API route match — dispatch if hit.
  3. Crawler detection.
  4. Crawler path → `renderCrawlerHtml`.
  5. Human path → `renderClientShell`.
     Wraps everything in try/catch → `signalToResponse` fallback.

  _Requirements: 7.1, 7.4, 7.5, 7.6, 11.1_

### Phase 8 — API routes

- [ ] **8.1 — `matchApiRoute`**

  Create `ssr/src/server/match-api-route.util.ts`. Given
  `(routes: StackraApiRoute[], request: Request)` returns the matched
  route + extracted params, or `null`. Uses simple path matching (no
  URL-pattern lib dependency).

  _Requirements: 2.5_

- [ ] **8.2 — `dispatchApiRoute`**

  Create `ssr/src/server/dispatch-api-route.ts`. Runs the route's
  middleware chain, calls `handler(ctx)`, normalizes the return value to
  a `Response` (JSON-serializing objects). Catches signals.

  _Requirements: 2.3, 2.4_

### Phase 9 — Handlers

- [ ] **9.1 — `createFetchHandler`**

  Create `ssr/src/server/create-fetch-handler.ts`. Returns
  `(request: Request) => Promise<Response>` that delegates to
  `renderRequest`.

  _Requirements: 9.1, 9.3, 9.4_

- [ ] **9.2 — `createNodeHandler`**

  Create `ssr/src/server/create-node-handler.ts`. Returns
  `(req, res) => Promise<void>` that adapts req → Request, calls
  `renderRequest`, pipes Response back.

  _Requirements: 9.2, 9.3, 9.4_

- [ ] **9.3 — Server barrel**

  Create `ssr/src/server/index.ts` — barrel exports for everything above.

### Phase 10 — Vite plugin

- [ ] **10.1 — `isHtmlRequest`**

  Create `ssr/src/vite/is-html-request.util.ts`. Returns `true` when the
  request accepts `text/html`, excluding static assets and RRD's
  `.data` requests.

- [ ] **10.2 — Virtual modules**

  Create `ssr/src/vite/virtual-modules.util.ts`. Exports `RESOLVED_ROUTES`
  and `RESOLVED_MIDDLEWARE` constants + helpers.

  _Requirements: 10.3_

- [ ] **10.3 — `stackraSsr` plugin**

  Create `ssr/src/vite/stackra-ssr.plugin.ts`. Returns a Vite `Plugin`
  with `configureServer`, `resolveId`, `load` hooks. Dev-server middleware
  intercepts HTML requests and delegates to `renderRequest`.

  _Requirements: 10.1, 10.2, 10.5_

- [ ] **10.4 — Vite barrel**

  Create `ssr/src/vite/index.ts`.

### Phase 11 — Testing helpers

- [ ] **11.1 — `createMemoryApp`**

  Create `ssr/src/testing/create-memory-app.ts`. Wraps
  `createMemoryRouter` + a container mock + middleware wiring.

  _Requirements: 12.1_

- [ ] **11.2 — `renderRoute`**

  Create `ssr/src/testing/render-route.ts`. Renders a single route to a
  DOM string using `renderToString` from `react-dom/server`.

  _Requirements: 12.2_

- [ ] **11.3 — `runHttpRequest`**

  Create `ssr/src/testing/run-http-request.ts`. Full pipeline runner —
  builds a `Request`, calls `renderRequest`, returns the `Response`.

  _Requirements: 12.3_

- [ ] **11.4 — Testing barrel update**

  Extend `ssr/src/testing/index.ts` to export the new helpers.

### Phase 12 — Test suite

- [ ] **12.1 — Unit: `isCrawler`**

  Matches expected UA strings; rejects human UAs; handles null/empty.

- [ ] **12.2 — Unit: `signalToResponse`**

  Every signal → correct Response; non-signal returns null.

- [ ] **12.3 — Unit: `defineRoutes` / `defineApiRoute` identity**

  Runtime pass-through; type preservation.

- [ ] **12.4 — Unit: `<Meta>` renders correctly**

  Given match tree with meta at each level, renders the deep-override
  intersection.

- [ ] **12.5 — Unit: `matchApiRoute`**

  Path patterns, method filter, params extraction.

- [ ] **12.6 — Integration: `runHttpRequest`**

  End-to-end HTTP pipeline: middleware → route → response. Includes
  crawler path and API-route path.

- [ ] **12.7 — Integration: middleware signal handling**

  Redirect signal from HTTP middleware → 302 response. Redirect signal
  from UI middleware (memory router) → `router.navigate` called.

### Phase 13 — Documentation

- [ ] **13.1 — README expansion**

  Add sections: quick start with SSR, `./react` API, `./server` API,
  `./vite` API. Include the three recipes.

  _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

### Phase 14 — Vite example integration

- [ ] **14.1 — Wire real routes**

  Convert `vite-example/src/App.tsx` to use `<StackraRouter routes={routes}>`.
  Move routes to `vite-example/src/routes.ts` with `defineRoutes`.

- [ ] **14.2 — Attach real middleware**

  Attach `requireAuth` to a protected route (e.g., `/dashboard`).
  Attach `@web` group to root.

- [ ] **14.3 — Add `<Meta>` to root layout**

- [ ] **14.4 — Boot the dev server + verify**

  `pnpm dev` → verify no console errors, `/` renders, `/dashboard`
  redirects to `/login` if auth header missing.

### Phase 15 — Release

- [ ] **15.1 — Bump `@stackra/ssr` 0.1.2 → 0.2.0**

- [ ] **15.2 — Format + typecheck + test + build**

- [ ] **15.3 — Commit + push**

- [ ] **15.4 — Verify CI + Release green; `@stackra/ssr@0.2.0` published**

- [ ] **15.5 — Post-release smoke test**

  Fresh directory: install `@stackra/ssr@0.2.0`, run a 30-line script that
  creates a memory router + resolves the app + renders a request.

---

## Notes

**Scope discipline**: v0.2 does NOT deliver production SSR bundle
orchestration (dual-bundle Vite builds). Dev-server SSR is fully working;
consumers who need production SSR compose the adapter themselves. That
narrows the review surface and lets us ship faster.

**Middleware compat**: everything in `./middleware` from 0.1.x continues
to work unchanged. The new subpaths import from `./middleware` internally
but the public API of the middleware subpath is frozen for this release.

**Peer versioning**: `react-router-dom` peer already pinned to `*`. We
target v7 features but degrade gracefully — features that need v7 like
`unstable_middleware` fall back to loader-wrapping on older versions.

## Estimated Effort

| Phase                 | Complexity | Time (approx) |
| --------------------- | ---------- | ------------- |
| 1 — Types             | Low        | 20 min        |
| 2 — Hooks             | Low        | 20 min        |
| 3 — Primitives        | Low        | 15 min        |
| 4 — Components        | Medium     | 90 min        |
| 5 — Middleware wiring | Medium     | 45 min        |
| 6 — Server utilities  | Low        | 45 min        |
| 7 — Renderer          | High       | 2 hours       |
| 8 — API routes        | Medium     | 45 min        |
| 9 — Handlers          | Low        | 30 min        |
| 10 — Vite plugin      | Medium     | 60 min        |
| 11 — Testing helpers  | Medium     | 60 min        |
| 12 — Test suite       | Medium     | 2 hours       |
| 13 — Docs             | Low        | 45 min        |
| 14 — Vite integration | Medium     | 45 min        |
| 15 — Release          | Low        | 30 min        |
| **Total**             | —          | **~10 hours** |

## Acceptance

The spec is complete when:

1. All 15 phases are checked off.
2. `pnpm typecheck` and `pnpm build` and `pnpm -r run test` pass workspace-wide.
3. `@stackra/ssr@0.2.0` is live on npm.
4. `vite-example` boots with real routes + middleware.
5. A crawler-UA request to the dev server returns fully-rendered HTML.
6. A human-UA request returns the client shell.
