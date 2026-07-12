/**
 * @file merge-config.util.ts
 * @module @stackra/cache/utils
 * @description Single source of truth for merging user-supplied
 *   cache options with `DEFAULT_CACHE_CONFIG`. Both `forRoot()` and
 *   `forRootAsync()` route through this helper so defaults stay
 *   consistent.
 */

import type { ICacheModuleConfig } from '../interfaces';
import { DEFAULT_CACHE_CONFIG } from '../constants/default-cache-config.constant';

/**
 * Merge user options into the default cache config.
 *
 * @param options - User-supplied partial configuration.
 * @returns Fully resolved configuration with defaults applied.
 */
export function mergeConfig(options?: Partial<ICacheModuleConfig>): ICacheModuleConfig {
  return {
    ...DEFAULT_CACHE_CONFIG,
    ...options,
  };
}
