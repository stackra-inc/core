/**
 * @file network.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/network`.
 *
 *   Emitted by `NetworkService` on the optional `EVENT_EMITTER` bus
 *   whenever the underlying platform bindings observe a change.
 *   Subscribers can react to coarse-grained transitions (`ONLINE` /
 *   `OFFLINE`) or to every status sample (`STATUS_CHANGED`).
 *
 *   @example
 *   ```typescript
 *   import { NETWORK_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(NETWORK_EVENTS.OFFLINE)
 *   onOffline() {
 *     showOfflineBanner();
 *   }
 *   ```
 */

/**
 * Network lifecycle event names.
 *
 * Payload shapes:
 * - `STATUS_CHANGED`          — `{ status, previous }`
 * - `ONLINE`                  — `{ status, previous }` (only on transition)
 * - `OFFLINE`                 — `{ status, previous }` (only on transition)
 * - `CONNECTION_TYPE_CHANGED` — `{ type, previousType, status }`
 */
export const NETWORK_EVENTS = {
  /** Emitted on every status sample, regardless of whether values changed. */
  STATUS_CHANGED: 'network.status.changed',
  /** Emitted when the device transitions from offline to online. */
  ONLINE: 'network.online',
  /** Emitted when the device transitions from online to offline. */
  OFFLINE: 'network.offline',
  /** Emitted when the connection type changes (e.g. wifi -> cellular). */
  CONNECTION_TYPE_CHANGED: 'network.connection-type.changed',
} as const;

/**
 * Union type of every emitted network event name.
 */
export type NetworkEventName = (typeof NETWORK_EVENTS)[keyof typeof NETWORK_EVENTS];
