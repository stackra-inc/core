/**
 * @file define-config.util.ts
 * @module @stackra/ssr/core/server/utils
 * @description Typed identity helper for authoring `ssr.config.ts`.
 *
 *   Matches the pattern used by every other Stackra package — the
 *   config file exports `defineConfig({...})` for type inference + IDE
 *   support. Actual merging with defaults happens in `mergeConfig`.
 */

import type { SsrModuleOptions } from '../interfaces/ssr-module-options.interface';

/**
 * Identity function over `SsrModuleOptions`. Use inside `ssr.config.ts`
 * to get autocompletion and type-checking without wrapping the runtime
 * shape.
 */
export function defineConfig<T extends SsrModuleOptions>(config: T): T {
  return config;
}
