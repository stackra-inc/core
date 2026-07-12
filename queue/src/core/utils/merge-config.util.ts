/**
 * @file merge-config.util.ts
 * @module @stackra/queue/core/utils
 * @description Single source of truth for merging user-supplied
 *   queue options with {@link DEFAULT_QUEUE_CONFIG}. Both `forRoot()`
 *   and `forRootAsync()` route through this helper so defaults stay
 *   consistent.
 */

import type { IQueueModuleOptions } from '../interfaces';
import { DEFAULT_QUEUE_CONFIG } from '../constants/default-queue-config.constant';

/**
 * Merge user options into the default queue config.
 *
 * @param options - User-supplied partial configuration.
 * @returns Resolved queue configuration with defaults applied.
 */
export function mergeConfig(options: Partial<IQueueModuleOptions>): IQueueModuleOptions {
  return {
    ...DEFAULT_QUEUE_CONFIG,
    ...options,
  } as IQueueModuleOptions;
}
