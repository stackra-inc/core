/**
 * @file cookie.events.ts
 * @module @stackra/contracts/events
 * @description Event name constants emitted by `@stackra/cookie`.
 *
 *   Emitted by `CookieJar` on the optional `EVENT_EMITTER` bus when
 *   a cookie is queued for the response or scheduled for deletion.
 *   Useful for security audits, GDPR consent trails, and analytics.
 *
 *   @example
 *   ```typescript
 *   import { COOKIE_EVENTS } from '@stackra/contracts';
 *
 *   @OnEvent(COOKIE_EVENTS.SET)
 *   onCookieSet(payload: { name: string }) {
 *     audit.record('cookie.set', payload.name);
 *   }
 *   ```
 */

/**
 * Cookie lifecycle event names.
 *
 * Payload shapes:
 * - `SET`     — `{ name, encrypted, signed }`
 * - `REMOVED` — `{ name }`
 * - `FLUSHED` — `{ count }` (queued cookies discarded before response)
 */
export const COOKIE_EVENTS = {
  /** A cookie was queued for the outgoing response. */
  SET: 'cookie.set',
  /** A cookie was scheduled for removal on the next response. */
  REMOVED: 'cookie.removed',
  /** All queued cookies were discarded before the response was sent. */
  FLUSHED: 'cookie.flushed',
} as const;

/** Union type of every emitted cookie event name. */
export type CookieEventName = (typeof COOKIE_EVENTS)[keyof typeof COOKIE_EVENTS];
