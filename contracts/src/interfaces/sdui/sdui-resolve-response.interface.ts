/**
 * @file sdui-resolve-response.interface.ts
 * @module @stackra/contracts/interfaces/sdui
 * @description Response body shape returned by `/api/sdui/resolve`
 *   and `/api/sdui/resolve-page`.
 */

import type { ISduiDocument } from './sdui-document.interface';

/**
 * Resolve response envelope.
 */
export interface ISduiResolveResponse {
  /** The assembled SDUI document. */
  readonly document: ISduiDocument;

  /**
   * ETag for the document — clients send back as `If-None-Match`
   * on subsequent requests to take advantage of the cache.
   */
  readonly etag: string;

  /**
   * Cache-Control header value mirrored from `document.meta.cache.ttl`.
   * Example: `'private, max-age=300'`.
   */
  readonly cacheControl: string;
}
