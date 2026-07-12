/**
 * @file merge-config.util.ts
 * @module @stackra/null/utils
 * @description Single source of truth for merging user-supplied
 *   null options with `DEFAULT_NEST_CONTAINER_CONFIG`. Both
 *   `forRoot()` and any future async path should route through this
 *   helper so defaults stay consistent.
 */

import { DEFAULT_NEST_CONTAINER_CONFIG } from '../constants/default-nest-container-config.constant';

/**
 * Merge user options into the default config.
 *
 * @typeParam T - Module options shape.
 * @param options - User-supplied configuration (partial).
 * @returns Resolved configuration with defaults applied.
 */
export function mergeNestContainerConfig<
  T extends Record<string, unknown> = Record<string, unknown>,
>(options: T = {} as T): T {
  return {
    ...(DEFAULT_NEST_CONTAINER_CONFIG as unknown as T),
    ...options,
  };
}
