/**
 * @file merge-config.util.ts
 * @module @stackra/realtime/utils
 * @description Single source of truth for merging user-supplied
 *   realtime options with `DEFAULT_REALTIME_CONFIG`. Both
 *   `forRoot()` and any future async path should route through this
 *   helper so defaults stay consistent.
 */

import { DEFAULT_REALTIME_CONFIG } from '../constants/default-realtime-config.constant';

/**
 * Merge user options into the default config.
 *
 * @typeParam T - Module options shape.
 * @param options - User-supplied configuration (partial).
 * @returns Resolved configuration with defaults applied.
 */
export function mergeRealtimeConfig<T extends Record<string, unknown> = Record<string, unknown>>(
  options: T = {} as T
): T {
  return {
    ...(DEFAULT_REALTIME_CONFIG as unknown as T),
    ...options,
  };
}
