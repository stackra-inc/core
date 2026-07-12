/**
 * @file index.ts
 * @module @stackra/contracts/interfaces/cookie
 * @description Barrel for cross-package cookie contracts.
 */

export type { ICookieOptions } from './cookie-options.interface';
export type { ICookie } from './cookie.interface';
export type { ICookieService } from './cookie-service.interface';
export type { ICookieEncrypter } from './cookie-encrypter.interface';
export type { ICookieJar } from './cookie-jar.interface';
export type {
  ICookieSetPayload,
  ICookieRemovedPayload,
  ICookieFlushedPayload,
} from './cookie-event-payloads.interface';
