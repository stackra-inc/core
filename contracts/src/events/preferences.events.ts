/**
 * @file preferences.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/preferences`.
 *
 *   Emitted by `PreferencesService` and `PreferencesManager` on the
 *   optional `EVENT_EMITTER` bus when a key is created, updated,
 *   removed, or when a new store driver is registered.
 *
 *   @example
 *   ```typescript
 *   import { PREFERENCES_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(PREFERENCES_EVENTS.VALUE_CHANGED)
 *   onPrefChanged(payload: { store: string; key: string; value: unknown }) {
 *     sync.queueUpload(payload.key, payload.value);
 *   }
 *   ```
 */

/**
 * Preferences lifecycle event names.
 *
 * Payload shapes:
 * - `VALUE_CHANGED`     — `{ store, key, value }`
 * - `VALUE_REMOVED`     — `{ store, key }`
 * - `STORE_REGISTERED`  — `{ name }`
 */
export const PREFERENCES_EVENTS = {
  /** A key was created or updated in any store. */
  VALUE_CHANGED: 'preferences.value.changed',
  /** A key was removed (single key or as part of `clear()`). */
  VALUE_REMOVED: 'preferences.value.removed',
  /** A new store driver was registered with the manager. */
  STORE_REGISTERED: 'preferences.store.registered',
} as const;

/** Union type of every emitted preferences event name. */
export type PreferencesEventName = (typeof PREFERENCES_EVENTS)[keyof typeof PREFERENCES_EVENTS];
