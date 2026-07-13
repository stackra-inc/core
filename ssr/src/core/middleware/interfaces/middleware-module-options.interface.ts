/**
 * @file middleware-module-options.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Options payload accepted by `MiddlewareModule.forRoot(...)`.
 */

import type { MiddlewareDefinition } from '../types/middleware-definition.type';
import type { MiddlewareGroup } from './middleware-group.interface';

/**
 * Options passed to `MiddlewareModule.forRoot({...})` / `.forFeature(...)`.
 *
 * All fields are optional. The preferred way to register middleware is
 * the `@Middleware()` decorator (auto-discovered) — these options are an
 * escape hatch for inline `defineMiddleware(...)` values and explicit
 * `defineMiddlewareGroup(...)` bundles.
 */
export interface MiddlewareModuleOptions {
  /**
   * Inline middleware definitions to register at wire time. Named
   * entries become referenceable by string from routes and groups.
   * Prefer `@Middleware()` classes for anything non-trivial.
   */
  readonly middleware?: readonly MiddlewareDefinition[];

  /**
   * Named middleware groups (bundles). Reference them from routes via
   * `middleware: ['@web', '@auth']`.
   */
  readonly groups?: readonly MiddlewareGroup[];
}
