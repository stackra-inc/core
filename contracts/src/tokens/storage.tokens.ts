/**
 * @file storage.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the storage package.
 */

/** Token for the StorageService. */
export const STORAGE_SERVICE = Symbol.for('STORAGE_SERVICE');

/** Token for the storage module configuration. */
export const STORAGE_CONFIG = Symbol.for('STORAGE_CONFIG');
