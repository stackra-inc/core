/**
 * @file merge-config.util.ts
 * @module @stackra/queue/utils
 * @description Single source of truth for merging user-supplied
 *   queue options with `DEFAULT_QUEUE_CONFIG`. Both
 *   `forRoot()` and any future async path should route through this
 *   helper so defaults stay consistent.
 */

import { DEFAULT_QUEUE_CONFIG } from '../constants/default-queue-config.constant';

/**
 * Merge user options into the default config.
 *
 * @typeParam T - Module options shape.
 * @param options - User-supplied configuration (partial).
 * @returns Resolved configuration with defaults applied.
 */
export function mergeQueueConfig<T extends Record<string, unknown> = Record<string, unknown>>(
  options: T = {} as T
): T {
  return {
    ...(DEFAULT_QUEUE_CONFIG as unknown as T),
    ...options,
  };
}
