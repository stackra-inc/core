/**
 * @file default-middleware-config.constant.ts
 * @module @stackra/ssr/middleware/constants
 * @description Canonical default value for `MiddlewareModuleOptions`.
 *
 *   Consumed by the module's `mergeConfig(options)` helper so that missing
 *   options fall through to a stable baseline. Empty arrays are the least
 *   surprising defaults — nothing runs unless the consumer explicitly
 *   registers middleware or groups.
 */

import type { MiddlewareModuleOptions } from '../interfaces/middleware-module-options.interface';

/**
 * Default configuration merged into every `MiddlewareModule.forRoot(...)`
 * invocation. Empty `middleware` and `groups` arrays are safe no-ops.
 */
export const DEFAULT_MIDDLEWARE_CONFIG: MiddlewareModuleOptions = {
  middleware: [],
  groups: [],
};
