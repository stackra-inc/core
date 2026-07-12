/**
 * @file redis.events.ts
 * @module @stackra/contracts/events
 * @description Event constants emitted by the Redis system.
 */

/** Events emitted by the Redis system. */
export const REDIS_EVENTS = {
  /** Emitted when a Redis connection is established. */
  CONNECTED: 'redis.connected',
  /** Emitted when a Redis connection is lost. */
  DISCONNECTED: 'redis.disconnected',
  /** Emitted when a Redis connection error occurs. */
  ERROR: 'redis.error',
  /** Emitted when a reconnection attempt is made. */
  RECONNECTING: 'redis.reconnecting',
  /** Emitted when a lock is acquired. */
  LOCK_ACQUIRED: 'redis.lock.acquired',
  /** Emitted when a lock is released. */
  LOCK_RELEASED: 'redis.lock.released',
  /** Emitted when a Redis command is executed (for observability). */
  COMMAND_EXECUTED: 'redis.command.executed',
  /** Emitted when a Redis command fails. */
  COMMAND_FAILED: 'redis.command.failed',
  /** Emitted when a stream message is received. */
  STREAM_MESSAGE_RECEIVED: 'redis.stream.message.received',
  /** Emitted when a stream message is acknowledged. */
  STREAM_MESSAGE_ACKNOWLEDGED: 'redis.stream.message.acknowledged',
} as const;
