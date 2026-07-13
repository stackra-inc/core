/**
 * @file define-api-route.util.ts
 * @module @stackra/ssr/react/utils
 * @description Typed identity for authoring API routes.
 *
 *   Runtime is a pure identity. Kept as a distinct helper (rather than
 *   overloading `defineRoutes`) so consumers see clear API surface —
 *   HTTP API routes and UI routes are dispatched by separate tables
 *   inside the server runtime.
 */

import type { StackraApiRoute } from '../types/stackra-api-route.type';

/**
 * Identity function over a single `StackraApiRoute`.
 *
 * @example
 * ```typescript
 * export const usersMe = defineApiRoute({
 *   path: '/api/users/me',
 *   method: 'GET',
 *   middleware: [requireAuth],
 *   handler: async (ctx) => {
 *     const auth = ctx.container.get(AuthService);
 *     return await auth.currentUser();
 *   },
 * });
 * ```
 */
export function defineApiRoute<T extends StackraApiRoute>(route: T): T {
  return route;
}
