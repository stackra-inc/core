/**
 * @file cache-module-async-options.interface.ts
 * @module @stackra/cache/src/interfaces
 * @description Async configuration options for `CacheModule.forRootAsync()`.
 *   Extends the canonical `IAsyncModuleOptions<T>` from `@stackra/contracts`
 *   to keep imports/useFactory/inject typed consistently across the monorepo.
 */

import type { IAsyncModuleOptions } from '@stackra/contracts';
import type { ICacheModuleConfig } from './cache-config.interface';

/** Async configuration options for `CacheModule.forRootAsync()`. */
export interface ICacheModuleAsyncOptions extends IAsyncModuleOptions<ICacheModuleConfig> {}
