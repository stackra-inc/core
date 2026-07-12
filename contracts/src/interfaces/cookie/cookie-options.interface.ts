/**
 * @file cookie-options.interface.ts
 * @module @stackra/contracts/interfaces/cookie
 * @description Options for setting a cookie. Used by every consumer
 *   of `ICookieService.set()`, `ICookieJar.set()`, and the
 *   `useCookie()` hook across the monorepo.
 */

/**
 * Cookie attributes accepted by set/remove operations.
 */
export interface ICookieOptions {
  /** Cookie path scope. Defaults to `'/'`. */
  path?: string;

  /** Domain the cookie is valid for. */
  domain?: string;

  /** Max age in seconds. Mutually exclusive with `expires`. */
  maxAge?: number;

  /** Expiration date. Mutually exclusive with `maxAge`. */
  expires?: Date;

  /** Restrict to HTTPS connections only. */
  secure?: boolean;

  /** Prevent JavaScript access (server-side only). */
  httpOnly?: boolean;

  /** SameSite policy for CSRF protection. */
  sameSite?: 'strict' | 'lax' | 'none';

  /** Whether to sign the cookie value with HMAC. */
  signed?: boolean;

  /** Whether to encrypt the cookie value. */
  encrypted?: boolean;
}
