/**
 * @file merge-config.util.ts
 * @module @stackra/scheduler/utils
 * @description Single source of truth for merging user-supplied
 *   scheduler options with `DEFAULT_SCHEDULER_CONFIG`. Both
 *   `forRoot()` and any future async path should route through this
 *   helper so defaults stay consistent.
 */

import { DEFAULT_SCHEDULER_CONFIG } from '../constants/default-scheduler-config.constant';

/**
 * Merge user options into the default config.
 *
 * @typeParam T - Module options shape.
 * @param options - User-supplied configuration (partial).
 * @returns Resolved configuration with defaults applied.
 */
export function mergeSchedulerConfig<T extends Record<string, unknown> = Record<string, unknown>>(
  options: T = {} as T
): T {
  return {
    ...(DEFAULT_SCHEDULER_CONFIG as unknown as T),
    ...options,
  };
}
