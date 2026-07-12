/**
 * @file cookie.interface.ts
 * @module @stackra/contracts/interfaces/cookie
 * @description A queued cookie ready for response attachment.
 *   Returned by `ICookieJar.getQueued()`.
 */

import type { ICookieOptions } from './cookie-options.interface';

/**
 * A queued cookie ready to be written as a `Set-Cookie` header.
 */
export interface ICookie {
  /** Cookie name (already prefixed if applicable). */
  name: string;

  /** Cookie value (plain text — encryption applied at send time). */
  value: string;

  /** Resolved cookie attributes. */
  options: Required<Pick<ICookieOptions, 'path' | 'httpOnly' | 'secure' | 'sameSite'>> &
    Omit<ICookieOptions, 'path' | 'httpOnly' | 'secure' | 'sameSite'>;
}
