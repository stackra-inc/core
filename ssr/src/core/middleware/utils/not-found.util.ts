/**
 * @file not-found.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Helper that throws a `NotFoundSignal`.
 */

import { NotFoundSignal } from '../signals/not-found.signal';

/**
 * Terminate the current middleware chain with a not-found outcome.
 *
 * Throws a `NotFoundSignal` which the outer runtime catches and maps
 * to a 404 response (HTTP) or the router's not-found boundary (UI).
 *
 * @param reason - Optional human-readable reason. Defaults to `"Not Found"`.
 */
export function notFound(reason: string = 'Not Found'): never {
  throw new NotFoundSignal(reason);
}
