/**
 * @file redis-lock.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Redis distributed lock contracts.
 */

/** Lock acquisition options. */
export interface ILockOptions {
  /** Lock key name. */
  key: string;
  /** TTL in milliseconds. */
  ttl: number;
  /** Retry attempts. */
  retries?: number;
  /** Delay between retries in ms. */
  retryDelay?: number;
  /** Maximum time to wait for lock acquisition in ms. */
  timeout?: number;
  /** Whether to automatically extend the lock before TTL expires. */
  autoExtend?: boolean;
}

/** Result of a lock acquisition attempt. */
export interface ILockResult {
  /** Whether the lock was acquired. */
  acquired?: boolean;
  /** Resource name. */
  resource?: string;
  /** Lock token (for release). */
  token?: string;
  /** Expiration timestamp. */
  expiresAt?: number;
  /** Extend the lock TTL. */
  extend?(): Promise<ILockResult>;
  /** Release the lock. */
  release?(): Promise<void>;
}

/** Redis lock service contract. */
export interface IRedisLock {
  /** Acquire a lock on a resource. */
  acquire(resource: string, options?: ILockOptions): Promise<ILockResult>;
  /** Release a lock by resource and token. */
  release(resource: string, token: string): Promise<boolean>;
  /** Check if a resource is currently locked. */
  isLocked(resource: string): Promise<boolean>;
}

/** Rate limiter result. */
export interface ILimiterResult {
  allowed: boolean;
  remaining: number;
  retryAfter?: number;
  limit: number;
  /** Timestamp when the current rate limit window decays/resets. */
  decaysAt?: number;
}
