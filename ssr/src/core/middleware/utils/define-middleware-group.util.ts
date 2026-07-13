/**
 * @file define-middleware-group.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Typed identity helper for authoring middleware groups.
 *
 *   Runtime is `return input`. The template literal type constraint on
 *   `name` produces a compile-time error if the caller forgets the leading
 *   `@` — no runtime guard needed.
 */

import type { MiddlewareGroup } from '../interfaces/middleware-group.interface';

/**
 * Identity function over `MiddlewareGroup`. Preserves the exact `name`
 * literal type so downstream consumers can pin a group by name at the
 * type level.
 *
 * @example
 * ```typescript
 * export const web = defineMiddlewareGroup({
 *   name: '@web',
 *   description: 'Standard web request pipeline',
 *   middleware: [csrfProtection, sessionLoader, authGate],
 * });
 * ```
 */
export function defineMiddlewareGroup<G extends MiddlewareGroup>(group: G): G {
  return group;
}
