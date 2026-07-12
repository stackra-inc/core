/**
 * @file cookie-event-payloads.interface.ts
 * @module @stackra/contracts/interfaces/cookie
 * @description Typed payloads for every constant in `COOKIE_EVENTS`.
 */

/**
 * Payload for `COOKIE_EVENTS.SET` — a cookie was queued on the
 * outgoing response.
 */
export interface ICookieSetPayload {
  /** Cookie name (as it will appear in the browser). */
  readonly name: string;
  /** Whether the value was encrypted before serialisation. */
  readonly encrypted: boolean;
  /** Whether the cookie will carry an HMAC signature. */
  readonly signed: boolean;
}

/**
 * Payload for `COOKIE_EVENTS.REMOVED` — a cookie was scheduled for
 * removal (a Set-Cookie header with `Max-Age=0` was queued).
 */
export interface ICookieRemovedPayload {
  /** Cookie name to be removed. */
  readonly name: string;
}

/**
 * Payload for `COOKIE_EVENTS.FLUSHED` — every queued cookie was
 * discarded before the response was sent.
 */
export interface ICookieFlushedPayload {
  /** Number of cookies that were discarded. */
  readonly count: number;
}
