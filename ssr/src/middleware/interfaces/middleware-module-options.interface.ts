/**
 * @file middleware-module-options.interface.ts
 * @module @stackra/ssr/middleware/interfaces
 * @description Options payload accepted by `MiddlewareModule.forRoot(...)`.
 */

import type { MiddlewareDefinition } from '../types/middleware-definition.type';
import type { MiddlewareGroup } from './middleware-group.interface';

/**
 * Configuration passed to `MiddlewareModule.forRoot({...})`.
 *
 * All fields are optional — the module ships with sensible defaults via
 * `DEFAULT_MIDDLEWARE_CONFIG` (empty arrays).
 */
export interface MiddlewareModuleOptions {
  /**
   * Middleware definitions that should be registered on bootstrap. Named
   * entries become referenceable by string from routes and other groups.
   */
  readonly middleware?: readonly MiddlewareDefinition[];

  /**
   * Named middleware groups (bundles). Reference them from routes via
   * `middleware: ['@web', '@auth']`.
   */
  readonly groups?: readonly MiddlewareGroup[];
}
