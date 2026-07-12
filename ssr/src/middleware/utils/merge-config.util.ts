/**
 * @file merge-config.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Merges caller-supplied `MiddlewareModuleOptions` with the
 *   canonical defaults from `DEFAULT_MIDDLEWARE_CONFIG`.
 */

import { DEFAULT_MIDDLEWARE_CONFIG } from '../constants/default-middleware-config.constant';
import type { MiddlewareModuleOptions } from '../interfaces/middleware-module-options.interface';

/**
 * Deep-ish merge — arrays replace rather than append (predictable
 * behaviour), primitive fields fall back to defaults when the caller
 * omits them.
 *
 * @param options - Caller-supplied options (may be partial or absent)
 * @returns Fully-populated `MiddlewareModuleOptions`
 */
export function mergeConfig(options?: MiddlewareModuleOptions): MiddlewareModuleOptions {
  if (!options) {
    return { ...DEFAULT_MIDDLEWARE_CONFIG };
  }

  return {
    middleware: options.middleware ?? DEFAULT_MIDDLEWARE_CONFIG.middleware ?? [],
    groups: options.groups ?? DEFAULT_MIDDLEWARE_CONFIG.groups ?? [],
  };
}
