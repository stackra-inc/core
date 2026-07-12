/**
 * @file storage-store-options.interface.ts
 * @module @stackra/cache/core/interfaces
 * @description Configuration options interface for the StorageStore.
 *   Controls prefix isolation, maximum entry limits, and storage backend selection.
 */

/**
 * Configuration options for the StorageStore.
 *
 * Controls how the Web Storage-backed cache store operates, including
 * key prefix isolation, entry count limits for eviction, and whether
 * to use sessionStorage instead of localStorage.
 */
export interface IStorageStoreOptions {
  /** Key prefix for all entries. Default: 'cache:'. */
  prefix?: string;
  /** Maximum entries to retain before eviction. Default: 1000. */
  maxEntries?: number;
  /** If true, use sessionStorage instead of localStorage. */
  session?: boolean;
}
