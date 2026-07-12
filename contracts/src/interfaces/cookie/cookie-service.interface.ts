/**
 * @file cookie-service.interface.ts
 * @module @stackra/contracts/interfaces/cookie
 * @description Client-side cookie service contract.
 *
 *   Implemented by `WebCookieService` (browser). The server-side
 *   `ICookieJar` is a superset with queue/flush semantics but shares
 *   the same read/write signature.
 *
 *   Bound to the `COOKIE_SERVICE` DI token.
 */

import type { ICookieOptions } from './cookie-options.interface';

/**
 * Client-side cookie service contract.
 */
export interface ICookieService {
  /** Read a single cookie value by name. */
  get(name: string): string | null;

  /** Check whether a cookie is set. */
  has(name: string): boolean;

  /** Read every visible cookie as a name→value map. */
  getAll(): Record<string, string>;

  /** Write a cookie. */
  set(name: string, value: string, options?: ICookieOptions): void;

  /** Remove a cookie by expiring it. */
  remove(name: string, options?: Pick<ICookieOptions, 'path' | 'domain'>): void;
}
