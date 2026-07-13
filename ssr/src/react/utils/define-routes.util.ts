/**
 * @file define-routes.util.ts
 * @module @stackra/ssr/react/utils
 * @description Typed identity for authoring route trees.
 *
 *   Runtime is a pure identity (`return routes`). The value is entirely
 *   in the type — `defineRoutes` preserves the literal shape of every
 *   entry so downstream consumers (e.g. `createBrowserRouter`) can still
 *   see the concrete route configuration without widening.
 */

import type { StackraRoute } from '../types/stackra-route.type';

/**
 * Identity function over an array of `StackraRoute`s.
 *
 * @example
 * ```typescript
 * export const routes = defineRoutes([
 *   { path: '/', Component: HomePage, handle: { meta: { title: 'Home' } } },
 *   {
 *     path: '/dashboard',
 *     middleware: ['@auth', requireAuth],
 *     Component: DashboardPage,
 *     handle: { meta: { title: 'Dashboard' } },
 *   },
 * ]);
 * ```
 */
export function defineRoutes<T extends readonly StackraRoute[]>(routes: T): T {
  return routes;
}
