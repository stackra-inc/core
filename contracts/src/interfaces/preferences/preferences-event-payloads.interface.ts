/**
 * @file preferences-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/preferences
 * @description Typed payloads for every constant in `PREFERENCES_EVENTS`.
 */

/**
 * Common fields carried by every preferences payload.
 */
export interface IPreferencesEventBase {
  /** Named store that produced the event (`memory`, `redis`, ...). */
  readonly store: string;
}

/**
 * Payload for `PREFERENCES_EVENTS.VALUE_CHANGED` — a key was set
 * or updated in a store.
 */
export interface IPreferencesValueChangedPayload extends IPreferencesEventBase {
  /** Preference key. */
  readonly key: string;
  /** Value written under `key`. */
  readonly value: unknown;
}

/**
 * Payload for `PREFERENCES_EVENTS.VALUE_REMOVED` — a key was
 * removed (single key or as part of `clear()`).
 */
export interface IPreferencesValueRemovedPayload extends IPreferencesEventBase {
  /** Preference key that was removed. */
  readonly key: string;
}

/**
 * Payload for `PREFERENCES_EVENTS.STORE_REGISTERED` — a driver
 * creator was added to the manager via `extend()` or decorator
 * discovery.
 */
export interface IPreferencesStoreRegisteredPayload {
  /** Driver name (e.g. `localStorage`, `asyncStorage`, `redis`). */
  readonly name: string;
}
