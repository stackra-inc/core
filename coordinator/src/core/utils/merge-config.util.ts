/**
 * @file merge-config.util.ts
 * @module @stackra/coordinator/utils
 * @description Single source of truth for merging user-supplied
 *   coordinator options with `DEFAULT_COORDINATOR_CONFIG`. Both
 *   `forRoot()` and any future async path should route through this
 *   helper so defaults stay consistent.
 */

import { DEFAULT_COORDINATOR_CONFIG } from '../constants/default-coordinator-config.constant';

/**
 * Merge user options into the default config.
 *
 * @typeParam T - Module options shape.
 * @param options - User-supplied configuration (partial).
 * @returns Resolved configuration with defaults applied.
 */
export function mergeCoordinatorConfig<T extends Record<string, unknown> = Record<string, unknown>>(
  options: T = {} as T
): T {
  return {
    ...(DEFAULT_COORDINATOR_CONFIG as unknown as T),
    ...options,
  };
}
