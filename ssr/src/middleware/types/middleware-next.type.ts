/**
 * @file middleware-next.type.ts
 * @module @stackra/ssr/middleware/types
 * @description The `next` callback signature passed to every middleware handler.
 *
 *   Calling `next()` runs the remaining chain and returns whatever the
 *   downstream resolves to. Calling it twice within the same middleware
 *   throws `MiddlewareExecutionError` with code `NEXT_CALLED_MULTIPLE_TIMES`.
 */

/**
 * Continue-execution callback exposed to middleware handlers.
 *
 * @typeParam TResult - The value the chain eventually returns
 */
export type MiddlewareNext<TResult = unknown> = () => Promise<TResult>;
