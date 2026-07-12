/**
 * @file index.ts
 * @module @stackra/cache/core/services
 * @description Barrel export for cache services.
 */

export { CacheManager } from './cache-manager.service';
export { CacheService } from './cache.service';
export { CacheStoreLoader } from './cache-store-loader.service';
/**
 * Re-export of the canonical cache event constants from
 * `@stackra/contracts`. Kept here for consumers that previously
 * imported `CACHE_EVENTS` from `@stackra/cache` — new code should
 * import directly from `@stackra/contracts`.
 */
export { CACHE_EVENTS } from '@stackra/contracts';
