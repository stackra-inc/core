/**
 * @file merge-config.util.ts
 * @module @stackra/logger/utils
 * @description Single source of truth for merging user-supplied
 *   logger options with `DEFAULT_LOGGER_CONFIG`. Both
 *   `forRoot()` and any future async path should route through this
 *   helper so defaults stay consistent.
 */

import { DEFAULT_LOGGER_CONFIG } from '../constants/default-logger-config.constant';

/**
 * Merge user options into the default config.
 *
 * @typeParam T - Module options shape.
 * @param options - User-supplied configuration (partial).
 * @returns Resolved configuration with defaults applied.
 */
export function mergeLoggerConfig<T extends Record<string, unknown> = Record<string, unknown>>(
  options: T = {} as T
): T {
  return {
    ...(DEFAULT_LOGGER_CONFIG as unknown as T),
    ...options,
  };
}
