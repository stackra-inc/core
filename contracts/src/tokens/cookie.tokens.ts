/**
 * @file cookie.tokens.ts
 * @module @stackra/contracts/tokens
 * @description DI tokens for the cookie package.
 */

/** Token for the per-request CookieJar service (server-only). */
export const COOKIE_JAR = Symbol.for('COOKIE_JAR');

/** Token for the CookieEncrypter service. */
export const COOKIE_ENCRYPTER = Symbol.for('COOKIE_ENCRYPTER');

/** Token for the cookie module configuration. */
export const COOKIE_CONFIG = Symbol.for('COOKIE_CONFIG');

/**
 * Token for the client-side `ICookieService` (browser / SSR / native).
 * Bound by `WebCookieModule.forRoot()` and `NativeCookieModule.forRoot()`.
 */
export const COOKIE_SERVICE = Symbol.for('COOKIE_SERVICE');
