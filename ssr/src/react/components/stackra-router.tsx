/**
 * @file stackra-router.tsx
 * @module @stackra/ssr/react/components
 * @description Application-level router component.
 *
 *   Wires three things together at the tree root:
 *     1. `<ContainerProvider>` — makes the DI container available to hooks.
 *     2. `attachMiddleware` — walks the route tree and installs middleware
 *        loaders for every route.
 *     3. `<RouterProvider>` — the React Router entry that drives navigations.
 *
 *   Both `app` and `routes` are optional:
 *     - `app` defaults to the **global** application context registered by
 *       `ApplicationFactory.create(...)` — the same fallback
 *       `<ContainerProvider>` uses. Pass it explicitly only for tests or
 *       multi-container setups.
 *     - `routes` defaults to the tree in `ROUTE_REGISTRY` (populated via
 *       `SsrModule.forFeature` + `@Route` discovery).
 */

import { useMemo, type ReactNode } from 'react';
import type { IApplication } from '@stackra/contracts';
import { ROUTE_REGISTRY } from '@stackra/contracts';
import { ContainerProvider } from '@stackra/container/react';
import { getGlobalApplicationContext } from '@stackra/container';
import {
  createBrowserRouter,
  createMemoryRouter,
  RouterProvider,
  type MemoryRouterOpts,
  type DOMRouterOpts,
} from 'react-router-dom';

import type { RouteRegistry } from '../../core/server/services/route-registry.service';
import { attachMiddleware } from '../utils/attach-middleware.util';
import type { StackraRoute } from '../types/stackra-route.type';

/**
 * Props accepted by `<StackraRouter>`. Everything is optional — the
 * common case is `<StackraRouter />` after `ApplicationFactory.create()`.
 */
export interface StackraRouterProps {
  /**
   * The application container. Defaults to the global context set by
   * `ApplicationFactory.create(...)`. Pass explicitly for tests or when
   * running multiple containers in one process.
   */
  readonly app?: IApplication;
  /**
   * Explicit route tree. When omitted, routes are pulled from
   * `ROUTE_REGISTRY` — the recommended path.
   */
  readonly routes?: readonly StackraRoute[];
  /**
   * Choose the underlying router implementation. `'browser'` is the
   * default for real apps; `'memory'` is used in tests + SSR fallback.
   */
  readonly kind?: 'browser' | 'memory';
  /**
   * Options forwarded to `createBrowserRouter` / `createMemoryRouter`
   * (`basename`, `hydrationData`, `initialEntries`, ...).
   */
  readonly opts?: DOMRouterOpts | MemoryRouterOpts;
  /**
   * Reserved for future use — will hold a global error boundary once
   * RRD v7 formalises the API.
   */
  readonly fallback?: ReactNode;
}

/**
 * The application-level router component.
 *
 * @example
 * ```tsx
 * // Global container + registry routes (recommended):
 * await ApplicationFactory.create(AppModule);
 * createRoot(el).render(<StackraRouter />);
 *
 * // Explicit app + routes (tests / multi-container):
 * <StackraRouter app={app} routes={routes} kind="memory" />
 * ```
 */
export function StackraRouter({
  app: appProp,
  routes,
  kind = 'browser',
  opts,
  fallback,
}: StackraRouterProps = {}) {
  const app = appProp ?? (getGlobalApplicationContext() as unknown as IApplication | null);
  if (!app) {
    throw new Error(
      'StackraRouter: no application container found. ' +
        'Call ApplicationFactory.create(AppModule) before rendering, ' +
        'or pass an explicit `app` prop.'
    );
  }

  const router = useMemo(() => {
    const tree = routes ?? readRegistryTree(app);
    const wired = attachMiddleware(tree, app, 'client');
    if (kind === 'memory') {
      return createMemoryRouter(wired, opts as MemoryRouterOpts | undefined);
    }
    return createBrowserRouter(wired, opts as DOMRouterOpts | undefined);
  }, [app, routes, kind, opts]);

  // `fallback` reserved for future use — v7 uses per-route HydrateFallback.
  void fallback;

  // Omit `context` so ContainerProvider also falls back to the global
  // when the caller relied on the global container.
  return appProp ? (
    <ContainerProvider context={appProp as never}>
      <RouterProvider router={router} />
    </ContainerProvider>
  ) : (
    <ContainerProvider>
      <RouterProvider router={router} />
    </ContainerProvider>
  );
}

/**
 * Read the route tree from the `ROUTE_REGISTRY` if available. Returns an
 * empty array when the SSR module isn't installed — a clearer dev-time
 * signal than a crash.
 */
function readRegistryTree(app: IApplication): readonly StackraRoute[] {
  try {
    const registry = app.get(ROUTE_REGISTRY) as RouteRegistry;
    return registry.getTree();
  } catch {
    return [];
  }
}
