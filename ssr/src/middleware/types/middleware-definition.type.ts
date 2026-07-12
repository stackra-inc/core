/**
 * @file middleware-definition.type.ts
 * @module @stackra/ssr/middleware/types
 * @description The discriminated union of every middleware form.
 */

import type {
  MiddlewareClassRef,
  MiddlewareOptions,
} from '../interfaces/middleware-options.interface';
import type { MiddlewareHandler } from './middleware-handler.type';

/**
 * Every legal shape a middleware can take:
 *
 *  1. **Function form** — a bare handler function.
 *  2. **Options form** — a `MiddlewareOptions` object with metadata + either
 *     an inline `handle` or a class `resolve` reference.
 *  3. **Class form** — a class constructor whose instance has a `handle`
 *     method. Metadata is read from the `MIDDLEWARE_METADATA_KEY` reflect
 *     entry (populated by `defineMiddleware` on the class).
 *
 * All three forms are accepted anywhere a middleware is expected —
 * registry, module options, group members, route attachments.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export type MiddlewareDefinition<
  TContext extends object = object,
  TResult = unknown,
  TState extends object = object,
  TParams extends readonly unknown[] = readonly any[],
> =
  | MiddlewareHandler<TContext, TResult, TParams>
  | MiddlewareOptions<TContext, TResult, TState, TParams>
  | MiddlewareClassRef<TContext, TResult, TParams>;
/* eslint-enable @typescript-eslint/no-explicit-any */
