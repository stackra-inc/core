/**
 * @file middleware-tuple.type.ts
 * @module @stackra/ssr/middleware/types
 * @description `[middleware, ...params]` tuple used to invoke parameterized middleware.
 */

import type { MiddlewareDefinition } from './middleware-definition.type';

/**
 * Parameterized middleware invocation shape.
 *
 * Middleware whose handler accepts extra params can be attached via a
 * tuple — the first element is the middleware (function / options / class /
 * string reference), remaining elements are the params forwarded after
 * `(ctx, next)`.
 *
 * @typeParam TDef    - The middleware definition or string reference
 * @typeParam TParams - The tuple of params
 */
export type MiddlewareTuple<
  TDef = MiddlewareDefinition | string,
  TParams extends readonly unknown[] = readonly unknown[],
> = readonly [TDef, ...TParams];
