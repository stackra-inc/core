/**
 * @file default-cache-config.constant.ts
 * @module @stackra/cache/constants
 * @description Default configuration for `CacheModule.forRoot()`.
 *   Used by `mergeConfig()` as the base layer that user options
 *   override.
 */

import type { ICacheModuleConfig } from '@/core/interfaces';
import { DEFAULT_STORE, DEFAULT_TTL } from './defaults.constant';

/**
 * Default cache module configuration. Applied when callers omit
 * fields from the `forRoot()` options.
 */
export const DEFAULT_CACHE_CONFIG: ICacheModuleConfig = {
  default: DEFAULT_STORE,
  stores: { memory: { driver: 'memory' } },
  prefix: undefined,
  ttl: DEFAULT_TTL,
};
