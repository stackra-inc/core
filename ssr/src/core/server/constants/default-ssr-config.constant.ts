/**
 * @file default-ssr-config.constant.ts
 * @module @stackra/ssr/core/server/constants
 * @description Canonical default value for `SsrModuleOptions`.
 *
 *   Consumed by `mergeConfig(options)` inside `SsrModule.forRoot(...)`
 *   so missing options fall through to a stable baseline. Empty arrays
 *   are the least surprising defaults — nothing runs unless the consumer
 *   explicitly registers routes or middleware.
 */

import type { SsrModuleOptions } from '../interfaces/ssr-module-options.interface';

/**
 * Default configuration merged into every `SsrModule.forRoot(...)`
 * invocation. Empty tables + safe HTML fallbacks.
 */
export const DEFAULT_SSR_CONFIG: SsrModuleOptions = {
  routes: [],
  apiRoutes: [],
  globalMiddleware: [],
  globalGroups: [],
  exposeErrors: false,
};
