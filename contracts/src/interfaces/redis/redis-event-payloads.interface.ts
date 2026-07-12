/**
 * @file redis-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/redis
 * @description Typed payloads for every constant in `REDIS_EVENTS`.
 *
 *   All Redis lifecycle events carry the connection name so
 *   subscribers can filter by backend when multiple named clients
 *   are active (e.g. `default`, `cache`, `sessions`).
 */

/**
 * Common fields carried by every Redis event payload.
 */
export interface IRedisEventBase {
  /** Named connection that produced the event. */
  readonly connection: string;
}

/**
 * Payload for `REDIS_EVENTS.CONNECTED` — a client's TCP + AUTH
 * handshake completed successfully.
 */
export interface IRedisConnectedPayload extends IRedisEventBase {}

/**
 * Payload for `REDIS_EVENTS.DISCONNECTED` — a client's connection
 * closed (network drop, manual shutdown, or server close).
 */
export interface IRedisDisconnectedPayload extends IRedisEventBase {
  /** Optional reason string surfaced by the driver. */
  readonly reason?: string;
}

/**
 * Payload for `REDIS_EVENTS.ERROR` — a client-level error occurred
 * (not tied to a specific command execution).
 */
export interface IRedisErrorPayload extends IRedisEventBase {
  /** Human-readable error message. */
  readonly error: string;
}

/**
 * Payload for `REDIS_EVENTS.RECONNECTING` — the client's reconnect
 * loop is currently in flight.
 */
export interface IRedisReconnectingPayload extends IRedisEventBase {
  /** 1-based reconnect attempt counter. */
  readonly attempt: number;
}

/**
 * Payload for `REDIS_EVENTS.LOCK_ACQUIRED` — `RedisLockService`
 * successfully acquired a distributed lock.
 */
export interface IRedisLockAcquiredPayload extends IRedisEventBase {
  /** The lock key that was acquired. */
  readonly key: string;
  /** Lock token so the owner can release later. */
  readonly token: string;
  /** Lock TTL in milliseconds. */
  readonly ttlMs: number;
}

/**
 * Payload for `REDIS_EVENTS.LOCK_RELEASED` — a distributed lock
 * was released (voluntarily or on TTL expiry).
 */
export interface IRedisLockReleasedPayload extends IRedisEventBase {
  /** The lock key that was released. */
  readonly key: string;
  /** Lock token used at release time. */
  readonly token: string;
}

/**
 * Payload for `REDIS_EVENTS.COMMAND_EXECUTED` — a command completed
 * successfully (fires only when the command interceptor is wired).
 */
export interface IRedisCommandExecutedPayload extends IRedisEventBase {
  /** Command name (`GET`, `SET`, `HGET`, …). */
  readonly command: string;
  /** Wall-clock duration in milliseconds. */
  readonly durationMs: number;
}

/**
 * Payload for `REDIS_EVENTS.COMMAND_FAILED` — a command threw.
 */
export interface IRedisCommandFailedPayload extends IRedisEventBase {
  /** Command name. */
  readonly command: string;
  /** Human-readable error message. */
  readonly error: string;
}

/**
 * Payload for `REDIS_EVENTS.STREAM_MESSAGE_RECEIVED` — a stream
 * consumer received a message via `XREADGROUP` or `XREAD`.
 */
export interface IRedisStreamMessageReceivedPayload extends IRedisEventBase {
  /** Stream key. */
  readonly stream: string;
  /** Consumer-group name (empty for plain `XREAD`). */
  readonly group?: string;
  /** Message id (`1234-0`). */
  readonly messageId: string;
}

/**
 * Payload for `REDIS_EVENTS.STREAM_MESSAGE_ACKNOWLEDGED` — a
 * stream consumer acknowledged a message via `XACK`.
 */
export interface IRedisStreamMessageAcknowledgedPayload extends IRedisEventBase {
  readonly stream: string;
  readonly group: string;
  readonly messageId: string;
}
