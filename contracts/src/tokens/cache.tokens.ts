/**
 * @file cache.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the cache system.
 */

/** Token for the CacheManager instance. */
export const CACHE_MANAGER = Symbol.for('CACHE_MANAGER');

/** Token for the cache module configuration. */
export const CACHE_CONFIG = Symbol.for('CACHE_CONFIG');

/** Metadata key for the @CacheStore() decorator. */
export const CACHE_STORE_METADATA_KEY = 'stackra:cache:store';
