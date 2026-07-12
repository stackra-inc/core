/**
 * @file cookie-encrypter.interface.ts
 * @module @stackra/contracts/interfaces/cookie
 * @description Cookie encryption + signing contract.
 *   Bound to the `COOKIE_ENCRYPTER` DI token.
 */

/**
 * Encrypts, decrypts, signs, and verifies cookie values.
 */
export interface ICookieEncrypter {
  /** Encrypt a cookie value. */
  encrypt(value: string): string;

  /** Decrypt a cookie value. Returns `null` if tampered/invalid. */
  decrypt(encrypted: string): string | null;

  /** Sign a cookie value with HMAC. */
  sign(value: string): string;

  /** Verify and extract a signed cookie value. Returns `null` if invalid. */
  unsign(signed: string): string | null;
}
