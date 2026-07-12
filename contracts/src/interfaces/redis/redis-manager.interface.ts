/**
 * @file redis-manager.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Redis manager contract (multi-connection).
 */

import type { IAsyncModuleOptions } from '@stackra/nestjs-types';
import type { IRedisClient } from './redis-client.interface';

/** Redis module options. */
export interface IRedisModuleOptions {
  default?: string;
  connections?: Record<string, Record<string, unknown>>;
  /** Cache store configuration. */
  cacheStore?: {
    enabled?: boolean;
    connection?: string;
    prefix?: string;
    ttl?: number;
  };
  /** Tag system configuration. */
  tags?: {
    enabled?: boolean;
    connection?: string;
    prefix?: string;
  };
  /** Observability configuration. */
  observability?: {
    enabled?: boolean;
    slowQueryThreshold?: number;
  };
  /** Allow additional options. */
  [key: string]: unknown;
}

/** Redis module async options. */
export interface IRedisModuleAsyncOptions
  extends IAsyncModuleOptions<IRedisModuleOptions> {}

/** Redis manager — resolves named connections. */
export interface IRedisManager {
  connection(name?: string): Promise<IRedisClient>;
  getDefaultDriver(): string;
  /** Health check for a named connection. */
  healthCheck?(name?: string): Promise<boolean>;
  /** Get all registered connection names. */
  getConnectionNames?(): string[];
}
