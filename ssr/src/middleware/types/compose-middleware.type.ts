/**
 * @file compose-middleware.type.ts
 * @module @stackra/ssr/middleware/types
 * @description Type-level state accumulator for middleware chains.
 *
 *   Given a tuple of middleware definitions, walks each one and
 *   intersects its declared `stateAdditions` into the state seen by the
 *   next middleware. The end result is the fully-populated state visible
 *   at the route handler.
 */

import type { MiddlewareOptions } from '../interfaces/middleware-options.interface';

/**
 * Extract the `stateAdditions` from a `MiddlewareOptions` form (function
 * and class forms never contribute — they are treated as opaque).
 */
type ExtractStateAdditions<T> =
  T extends MiddlewareOptions<infer _TCtx, infer _TResult, infer TState, infer _TParams>
    ? TState
    : object;

/**
 * Walk a chain of middleware and intersect every declared
 * `stateAdditions` into a single state type.
 *
 * @typeParam Chain - Tuple of middleware entries
 */
export type ComposeMiddleware<Chain extends readonly unknown[]> = Chain extends readonly [
  infer Head,
  ...infer Tail,
]
  ? ExtractStateAdditions<Head> & ComposeMiddleware<Tail>
  : object;
