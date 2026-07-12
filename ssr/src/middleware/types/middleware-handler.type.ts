/**
 * @file middleware-handler.type.ts
 * @module @stackra/ssr/middleware/types
 * @description Handler function shape for every middleware form.
 */

import type { MiddlewareNext } from './middleware-next.type';

/**
 * The core handler signature every middleware boils down to.
 *
 * Receives a stage-specific context, a `next()` callback to continue
 * execution, and (optionally) parameters supplied by a tuple invocation.
 *
 * @typeParam TContext - Stage-specific context (`HttpContext`, `UiContext`, `PipeContext`)
 * @typeParam TResult  - Value the chain eventually returns
 * @typeParam TParams  - Extra tuple parameters
 */
export type MiddlewareHandler<
  TContext extends object = object,
  TResult = unknown,
  TParams extends readonly unknown[] = readonly unknown[],
> = (
  ctx: TContext,
  next: MiddlewareNext<TResult>,
  ...params: TParams
) => Promise<TResult> | TResult;
