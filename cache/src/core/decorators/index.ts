/**
 * @file index.ts
 * @module @stackra/cache/core/decorators
 * @description Barrel export for cache decorators.
 */
export { CacheStore } from './cache-store.decorator';
export { Cacheable, setCacheableContainer } from './cacheable.decorator';
export { CacheEvict, setCacheEvictContainer } from './cache-evict.decorator';
export type { ICacheableOptions } from '../interfaces/cacheable-options.interface';
export type { ICacheEvictOptions } from '../interfaces/cache-evict-options.interface';
