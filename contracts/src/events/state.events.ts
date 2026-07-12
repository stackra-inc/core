/**
 * @file state.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants for the reactive state system.
 *
 *   Two complementary surfaces:
 *   - **`STATE_EVENTS`** — *event name fragments* appended to a store
 *     name (e.g. `i18n.changed`). Used by broadcasters and hooks to
 *     build per-store event names. Cross-package consumers
 *     (`@stackra/state` broadcasters and the React hooks) need the
 *     same vocabulary.
 *   - **`STATE_REGISTRY_EVENTS`** — *package-level lifecycle events*
 *     about the StateRegistry itself (store registered, registry
 *     snapshotted, …). Useful for devtools and audit listeners.
 *
 *   @example
 *   ```typescript
 *   import { STATE_EVENTS, STATE_REGISTRY_EVENTS } from '@stackra/contracts';
 *
 *   // Per-store change subscription via the fragment vocabulary.
 *   eventEmitter.on(`theme.${STATE_EVENTS.CHANGED}`, handleThemeChange);
 *
 *   // Registry-level lifecycle.
 *   @OnEvent(STATE_REGISTRY_EVENTS.STORE_REGISTERED)
 *   onStoreRegistered(payload: { name: string }) {
 *     devtools.refresh();
 *   }
 *   ```
 */

/**
 * State lifecycle event name fragments.
 *
 * Always appended to a store name as `${storeName}.${STATE_EVENTS.X}`.
 * Never emitted on their own.
 */
export const STATE_EVENTS = {
  /** A store's state changed. */
  CHANGED: 'changed',
  /** A store was hydrated from persistence. */
  HYDRATED: 'hydrated',
  /** A cross-tab sync was received. */
  SYNC_RECEIVED: 'sync.received',
  /** A realtime update was received. */
  REALTIME_RECEIVED: 'realtime.received',
  /** A mutation started. */
  MUTATE_STARTED: 'mutate.started',
  /** A mutation succeeded. */
  MUTATE_SUCCESS: 'mutate.success',
  /** A mutation failed. */
  MUTATE_FAILED: 'mutate.failed',
  /** A query started fetching. */
  QUERY_STARTED: 'query.started',
  /** A query succeeded. */
  QUERY_SUCCESS: 'query.success',
  /** A query failed. */
  QUERY_FAILED: 'query.failed',
} as const;

/**
 * State registry lifecycle event names.
 *
 * Package-level events emitted by `StateRegistry` when stores are
 * registered or removed.
 *
 * Payload shapes:
 * - `STORE_REGISTERED` — `{ name }`
 * - `STORE_REMOVED`    — `{ name }`
 */
export const STATE_REGISTRY_EVENTS = {
  /** A new store was registered with the registry. */
  STORE_REGISTERED: 'state.store.registered',
  /** A store was removed from the registry. */
  STORE_REMOVED: 'state.store.removed',
} as const;

/** Union type of every state fragment name. */
export type StateEventFragment = (typeof STATE_EVENTS)[keyof typeof STATE_EVENTS];

/** Union type of every emitted state-registry event name. */
export type StateRegistryEventName =
  (typeof STATE_REGISTRY_EVENTS)[keyof typeof STATE_REGISTRY_EVENTS];
