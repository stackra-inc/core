/**
 * @file abort.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Helper that throws a middleware `AbortSignal`.
 */

import { AbortSignal as MiddlewareAbortSignal } from '../signals/abort.signal';

/**
 * Terminate the current middleware chain and return `result` as the
 * final outcome. Downstream middleware is skipped.
 *
 * Throws a middleware `AbortSignal` (distinct from the Web platform's
 * `AbortSignal`) which the outer runtime catches and unwraps.
 *
 * @param result - Value the pipeline should resolve to
 */
export function abort(result: unknown): never {
  throw new MiddlewareAbortSignal(result);
}
