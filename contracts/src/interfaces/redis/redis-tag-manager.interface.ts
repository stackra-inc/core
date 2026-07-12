/**
 * @file redis-tag-manager.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Redis tag-based cache invalidation contract.
 */

/** Redis tag manager — tag-based cache invalidation. */
export interface IRedisTagManager {
  /** Associate a cache key with one or more tags. */
  tag(key: string, tags: string[]): Promise<void>;
  /** Flush all keys associated with a tag. */
  flushTag?(tag: string): Promise<number>;
  /** Flush all keys associated with multiple tags. */
  flushTags?(tags: string[]): Promise<number>;
  /** Get all keys associated with a tag. */
  getTaggedKeys?(tag: string): Promise<string[]>;
}
