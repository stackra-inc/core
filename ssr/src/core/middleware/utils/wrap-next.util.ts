/**
 * @file wrap-next.util.ts
 * @module @stackra/ssr/middleware/utils
 * @description Adapts the pipeline's `(passable) => unknown` next signature
 *   to the middleware `MiddlewareNext<TResult>` signature, and enforces
 *   call-once semantics.
 */

import { MiddlewareExecutionError } from '../errors/middleware-execution.error';
import type { MiddlewareNext } from '../types/middleware-next.type';

/**
 * Wrap a pipeline-native `next` function so it matches the middleware
 * `MiddlewareNext<T>` shape and throws `NEXT_CALLED_MULTIPLE_TIMES` when
 * invoked more than once.
 *
 * @param pipelineNext   - The next callback exposed by `@stackra/pipeline`
 * @param passable       - The passable to forward
 * @param middlewareName - Name of the current middleware — for error meta
 */
export function wrapNext<TPassable, TResult>(
  pipelineNext: (passable: TPassable) => Promise<TResult> | TResult,
  passable: TPassable,
  middlewareName: string
): MiddlewareNext<TResult> {
  let called = false;
  return async (): Promise<TResult> => {
    if (called) {
      throw new MiddlewareExecutionError(
        `next() was called more than once in middleware "${middlewareName}".`,
        'NEXT_CALLED_MULTIPLE_TIMES',
        { middlewareName }
      );
    }
    called = true;
    return await pipelineNext(passable);
  };
}
