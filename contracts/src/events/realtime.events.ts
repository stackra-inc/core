/**
 * @file realtime.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/realtime`.
 *
 *   Emitted by `RealtimeManager` (and registered drivers) on the
 *   optional `EVENT_EMITTER` bus whenever a connection moves through
 *   its lifecycle or a transport-level message/error occurs.
 *
 *   @example
 *   ```typescript
 *   import { REALTIME_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(REALTIME_EVENTS.DISCONNECTED)
 *   onDisconnect(payload: { connection: string }) {
 *     metrics.increment('realtime.disconnects');
 *   }
 *   ```
 */

/**
 * Realtime lifecycle event names.
 *
 * Payload shapes:
 * - `CONNECTED`    — `{ connection }`
 * - `DISCONNECTED` — `{ connection, reason }`
 * - `RECONNECTING` — `{ connection, attempt }`
 * - `ERROR`        — `{ connection, error }`
 * - `MESSAGE`      — `{ connection, channel, event, data }`
 */
export const REALTIME_EVENTS = {
  /** A connection was established successfully. */
  CONNECTED: 'realtime.connected',
  /** An active connection was dropped. */
  DISCONNECTED: 'realtime.disconnected',
  /** A reconnection attempt is in flight. */
  RECONNECTING: 'realtime.reconnecting',
  /** The underlying transport raised a transport-level error. */
  ERROR: 'realtime.error',
  /** A message was received on any subscribed channel. */
  MESSAGE: 'realtime.message',
} as const;

/** Union type of every emitted realtime event name. */
export type RealtimeEventName = (typeof REALTIME_EVENTS)[keyof typeof REALTIME_EVENTS];
