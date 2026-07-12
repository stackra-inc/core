/**
 * @file define-config.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Typed identity helper for authoring `middleware.config.ts`.
 *
 *   Matches the pattern used by every other Stackra package — the config
 *   file exports `defineConfig({...})` for type inference and IDE support.
 *   Actual merging with defaults happens in `mergeConfig`.
 */

import type { MiddlewareModuleOptions } from '../interfaces/middleware-module-options.interface';

/**
 * Identity function over `MiddlewareModuleOptions`. Use inside a
 * `middleware.config.ts` file to get autocompletion and type-checking
 * without wrapping the runtime shape.
 */
export function defineConfig<T extends MiddlewareModuleOptions>(config: T): T {
  return config;
}
