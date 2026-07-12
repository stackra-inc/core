/**
 * @file cookie-jar.interface.ts
 * @module @stackra/contracts/interfaces/cookie
 * @description Per-request CookieJar contract. Bound to `COOKIE_JAR`.
 *   Server-side only — manages incoming cookies + queues outgoing ones
 *   for the response.
 */

import type { ICookieOptions } from './cookie-options.interface';
import type { ICookie } from './cookie.interface';

/**
 * Per-request cookie jar — read incoming, queue outgoing.
 */
export interface ICookieJar {
  /** Read a cookie from the incoming request. */
  get(name: string): string | null;

  /** Check if a cookie exists in the incoming request. */
  has(name: string): boolean;

  /** Queue a cookie for the outgoing response. */
  set(name: string, value: string, options?: ICookieOptions): void;

  /** Queue a cookie for removal (expires immediately). */
  remove(name: string, options?: Pick<ICookieOptions, 'path' | 'domain'>): void;

  /** Get all queued cookies for the response. */
  getQueued(): ICookie[];

  /** Check if a cookie is queued for the response. */
  hasQueued(name: string): boolean;

  /** Clear all queued cookies. */
  flushQueued(): void;
}
